/**
 * Short-solution solver: Kociemba's two-phase algorithm, written from scratch.
 *
 * Phase 1 turns the cube until it can be finished with only
 * U, D, R2, L2, F2, B2 (corners untwisted, edges unflipped, the four middle
 * edges back in the middle layer). Phase 2 finishes it with those moves.
 * Each phase is an iterative-deepening search guided by lookup tables that
 * say "at least this many moves are still needed".
 *
 * The first solution found is usually 22–25 moves; the search then keeps
 * looking for shorter ones until it reaches the target length or the time
 * budget runs out. With the defaults almost every cube ends at 21 or fewer.
 */
import { MOVE_COUNT, MOVE_CUBES, findUnsolvableReason } from './cubie.ts'
import type { CubieCube, Move } from './cubie.ts'

const TWIST_COUNT = 2187 // 3^7 corner twists
const FLIP_COUNT = 2048 // 2^11 edge flips
const SLICE_COUNT = 495 // C(12,4) places for the four middle-layer edges
const PERM8_COUNT = 40320 // 8!
const PERM4_COUNT = 24 // 4!

/** The moves phase 2 may use: U U2 U' D D2 D' R2 F2 L2 B2. */
const PHASE2_MOVES: Move[] = [0, 1, 2, 9, 10, 11, 4, 7, 13, 16]
const PHASE2_MOVE_COUNT = PHASE2_MOVES.length

/** Longest phase 2 can ever need. */
const PHASE2_MAX = 18
/** Once a solution exists, only short phase-2 endings are worth trying. */
const PHASE2_QUICK_MAX = 10

const BINOMIAL: number[][] = []
for (let n = 0; n <= 12; n++) {
  BINOMIAL.push([])
  for (let k = 0; k <= 12; k++) {
    BINOMIAL[n].push(k === 0 ? 1 : n === 0 ? 0 : BINOMIAL[n - 1][k - 1] + BINOMIAL[n - 1][k])
  }
}

// --- Coordinates: each part of the cube's state as one number, 0 when solved.

function getTwist(co: readonly number[]): number {
  let twist = 0
  for (let i = 0; i < 7; i++) twist = twist * 3 + co[i]
  return twist
}

function setTwist(co: number[], twist: number): void {
  let sum = 0
  for (let i = 6; i >= 0; i--) {
    co[i] = twist % 3
    sum += co[i]
    twist = Math.floor(twist / 3)
  }
  co[7] = (3 - (sum % 3)) % 3
}

function getFlip(eo: readonly number[]): number {
  let flip = 0
  for (let i = 0; i < 11; i++) flip = flip * 2 + eo[i]
  return flip
}

function setFlip(eo: number[], flip: number): void {
  let sum = 0
  for (let i = 10; i >= 0; i--) {
    eo[i] = flip % 2
    sum += eo[i]
    flip = Math.floor(flip / 2)
  }
  eo[11] = sum % 2
}

/** Which four positions hold the middle-layer edges (pieces 8–11), ignoring their order. */
function getSlice(ep: readonly number[]): number {
  let slice = 0
  let found = 0
  for (let j = 11; j >= 0; j--) {
    if (ep[j] >= 8) {
      slice += BINOMIAL[11 - j][found + 1]
      found++
    }
  }
  return slice
}

function setSlice(ep: number[], slice: number): void {
  let left = 3
  let nextSliceEdge = 8
  let nextOtherEdge = 0
  for (let j = 0; j < 12; j++) {
    const weight = left >= 0 ? BINOMIAL[11 - j][left + 1] : Infinity
    if (slice >= weight) {
      ep[j] = nextSliceEdge++
      slice -= weight
      left--
    } else {
      ep[j] = nextOtherEdge++
    }
  }
}

/** Order of `count` pieces starting at `start`, as a number below `count!`. */
function getPerm(pieces: readonly number[], start: number, count: number): number {
  let perm = 0
  for (let i = 0; i < count; i++) {
    let smallerAfter = 0
    for (let j = i + 1; j < count; j++) {
      if (pieces[start + j] < pieces[start + i]) smallerAfter++
    }
    perm = perm * (count - i) + smallerAfter
  }
  return perm
}

function setPerm(pieces: number[], start: number, count: number, perm: number): void {
  const digits = new Array<number>(count)
  for (let i = count - 1; i >= 0; i--) {
    digits[i] = perm % (count - i)
    perm = Math.floor(perm / (count - i))
  }
  const unused: number[] = []
  for (let i = 0; i < count; i++) unused.push(start + i)
  for (let i = 0; i < count; i++) {
    pieces[start + i] = unused.splice(digits[i], 1)[0]
  }
}

// --- Tables

interface Tables {
  twistMove: Uint16Array
  flipMove: Uint16Array
  sliceMove: Uint16Array
  cornerPermMove: Uint16Array
  edgePermMove: Uint16Array
  slicePermMove: Uint16Array
  twistSlicePrune: Int8Array
  flipSlicePrune: Int8Array
  cornerSlicePrune: Int8Array
  edgeSlicePrune: Int8Array
}

/** For every value of a coordinate and every move: the value after that move. */
function buildMoveTable(
  size: number,
  moves: readonly Move[],
  pieceCount: number,
  set: (pieces: number[], value: number) => void,
  get: (pieces: number[]) => number,
  turn: (from: number[], to: number[], move: CubieCube) => void,
): Uint16Array {
  const table = new Uint16Array(size * moves.length)
  const from = new Array<number>(pieceCount).fill(0)
  const to = new Array<number>(pieceCount).fill(0)
  for (let value = 0; value < size; value++) {
    set(from, value)
    for (let m = 0; m < moves.length; m++) {
      turn(from, to, MOVE_CUBES[moves[m]])
      table[value * moves.length + m] = get(to)
    }
  }
  return table
}

/**
 * For every pair (x, s) of two coordinates: the fewest moves that bring both
 * to 0. Filled breadth-first; once most entries are known it is faster to ask
 * each unknown entry "is a neighbour one step closer?" than to expand outward.
 */
function buildPruneTable(
  xMove: Uint16Array,
  xCount: number,
  sMove: Uint16Array,
  sCount: number,
  moveCount: number,
): Int8Array {
  const size = xCount * sCount
  const table = new Int8Array(size).fill(-1)
  table[0] = 0
  let filled = 1
  for (let depth = 0; filled < size; depth++) {
    const before = filled
    const fromUnknown = filled > size / 2
    for (let i = 0; i < size; i++) {
      if (fromUnknown ? table[i] !== -1 : table[i] !== depth) continue
      const x = Math.floor(i / sCount) * moveCount
      const s = (i % sCount) * moveCount
      for (let m = 0; m < moveCount; m++) {
        const j = xMove[x + m] * sCount + sMove[s + m]
        if (fromUnknown) {
          if (table[j] === depth) {
            table[i] = depth + 1
            filled++
            break
          }
        } else if (table[j] === -1) {
          table[j] = depth + 1
          filled++
        }
      }
    }
    if (filled === before) throw new Error('Prune table could not be completed')
  }
  return table
}

const ALL_MOVES: Move[] = Array.from({ length: MOVE_COUNT }, (_, move) => move)

function buildTables(): Tables {
  const twistMove = buildMoveTable(TWIST_COUNT, ALL_MOVES, 8, setTwist, getTwist, (from, to, move) => {
    for (let i = 0; i < 8; i++) to[i] = (from[move.cp[i]] + move.co[i]) % 3
  })
  const flipMove = buildMoveTable(FLIP_COUNT, ALL_MOVES, 12, setFlip, getFlip, (from, to, move) => {
    for (let i = 0; i < 12; i++) to[i] = (from[move.ep[i]] + move.eo[i]) % 2
  })
  const permuteEdges = (from: number[], to: number[], move: CubieCube) => {
    for (let i = 0; i < 12; i++) to[i] = from[move.ep[i]]
  }
  const sliceMove = buildMoveTable(SLICE_COUNT, ALL_MOVES, 12, setSlice, getSlice, permuteEdges)
  const cornerPermMove = buildMoveTable(
    PERM8_COUNT,
    PHASE2_MOVES,
    8,
    (cp, value) => setPerm(cp, 0, 8, value),
    (cp) => getPerm(cp, 0, 8),
    (from, to, move) => {
      for (let i = 0; i < 8; i++) to[i] = from[move.cp[i]]
    },
  )
  // In phase 2 the first eight edges stay among the first eight positions and
  // the middle-layer edges stay in the last four, so each group has its own order.
  const edgePermMove = buildMoveTable(
    PERM8_COUNT,
    PHASE2_MOVES,
    12,
    (ep, value) => {
      setPerm(ep, 0, 8, value)
      for (let i = 8; i < 12; i++) ep[i] = i
    },
    (ep) => getPerm(ep, 0, 8),
    permuteEdges,
  )
  const slicePermMove = buildMoveTable(
    PERM4_COUNT,
    PHASE2_MOVES,
    12,
    (ep, value) => {
      for (let i = 0; i < 8; i++) ep[i] = i
      setPerm(ep, 8, 4, value)
    },
    (ep) => getPerm(ep, 8, 4),
    permuteEdges,
  )
  return {
    twistMove,
    flipMove,
    sliceMove,
    cornerPermMove,
    edgePermMove,
    slicePermMove,
    twistSlicePrune: buildPruneTable(twistMove, TWIST_COUNT, sliceMove, SLICE_COUNT, MOVE_COUNT),
    flipSlicePrune: buildPruneTable(flipMove, FLIP_COUNT, sliceMove, SLICE_COUNT, MOVE_COUNT),
    cornerSlicePrune: buildPruneTable(
      cornerPermMove,
      PERM8_COUNT,
      slicePermMove,
      PERM4_COUNT,
      PHASE2_MOVE_COUNT,
    ),
    edgeSlicePrune: buildPruneTable(
      edgePermMove,
      PERM8_COUNT,
      slicePermMove,
      PERM4_COUNT,
      PHASE2_MOVE_COUNT,
    ),
  }
}

let tables: Tables | null = null

/**
 * Builds the lookup tables (about 4 MB, roughly 0.6 s). `solve` does
 * this on first use; call it earlier to move the wait off the first solve.
 */
export function prepareSolver(): void {
  tables ??= buildTables()
}

// --- Search

/**
 * Copies out the solution, merging the last phase-1 move with the first
 * phase-2 move when both turn the same face (R then R2 becomes R').
 */
function joinPhases(moves: readonly Move[], phase1Length: number, length: number): Move[] {
  const joined = moves.slice(0, length)
  if (phase1Length === 0 || phase1Length === length) return joined
  const before = joined[phase1Length - 1]
  const after = joined[phase1Length]
  const face = Math.floor(before / 3)
  if (face !== Math.floor(after / 3)) return joined
  const turns = ((before % 3) + 1 + (after % 3) + 1) % 4
  if (turns === 0) joined.splice(phase1Length - 1, 2)
  else joined.splice(phase1Length - 1, 2, face * 3 + turns - 1)
  return joined
}

export interface SolveOptions {
  /** Stop looking for something shorter once a solution has at most this many moves. Default 21. */
  targetLength?: number
  /** Stop improving after this long and return the best found so far. Default 200 ms. */
  timeBudgetMs?: number
}

/**
 * Returns moves that solve `cube`. Always returns a solution for a solvable
 * cube; `targetLength` and `timeBudgetMs` only decide how long it keeps
 * trying to shorten it. Throws if the cube is not solvable.
 */
export function solve(cube: CubieCube, options: SolveOptions = {}): Move[] {
  const reason = findUnsolvableReason(cube)
  if (reason !== null) throw new Error(`Cube is not solvable: ${reason}`)

  prepareSolver()
  const t = tables!
  const targetLength = options.targetLength ?? 21
  const deadline = performance.now() + (options.timeBudgetMs ?? 200)

  const moves = new Array<Move>(PHASE2_MAX + 13).fill(0)
  let best = null as Move[] | null
  /** Only solutions of at most this many moves are still interesting. */
  let maxLength = moves.length
  let stop = false
  let nodes = 0

  // Scratch space for replaying phase-1 moves on the piece orders.
  let cp = new Array<number>(8)
  let cpNext = new Array<number>(8)
  let ep = new Array<number>(12)
  let epNext = new Array<number>(12)

  const outOfTime = () => {
    if ((++nodes & 0x3fff) === 0 && best !== null && performance.now() > deadline) {
      stop = true
    }
    return stop
  }

  const phase2 = (
    cornerPerm: number,
    edgePerm: number,
    slicePerm: number,
    togo: number,
    depth: number,
    lastFace: number,
  ): boolean => {
    if (togo === 0) return cornerPerm === 0 && edgePerm === 0 && slicePerm === 0
    if (outOfTime()) return false
    for (let m = 0; m < PHASE2_MOVE_COUNT; m++) {
      const move = PHASE2_MOVES[m]
      const face = Math.floor(move / 3)
      // Never turn the same face twice in a row. Opposite faces commute, so
      // only one order is tried.
      if (face === lastFace || face + 3 === lastFace) continue
      const nextSlicePerm = t.slicePermMove[slicePerm * PHASE2_MOVE_COUNT + m]
      const nextCornerPerm = t.cornerPermMove[cornerPerm * PHASE2_MOVE_COUNT + m]
      if (t.cornerSlicePrune[nextCornerPerm * PERM4_COUNT + nextSlicePerm] >= togo) continue
      const nextEdgePerm = t.edgePermMove[edgePerm * PHASE2_MOVE_COUNT + m]
      if (t.edgeSlicePrune[nextEdgePerm * PERM4_COUNT + nextSlicePerm] >= togo) continue
      moves[depth] = move
      if (phase2(nextCornerPerm, nextEdgePerm, nextSlicePerm, togo - 1, depth + 1, face)) {
        return true
      }
    }
    return false
  }

  /** Phase 1 is done after `length` moves: try to finish with phase 2. */
  const finish = (length: number): void => {
    if (length > 0) {
      const last = moves[length - 1]
      const lastFace = Math.floor(last / 3)
      // A phase-1 ending on a phase-2 move is a shorter phase-1 solution plus
      // that move, which has already been tried.
      if (lastFace === 0 || lastFace === 3 || last % 3 === 1) return
    }

    for (let i = 0; i < 8; i++) cp[i] = cube.cp[i]
    for (let i = 0; i < 12; i++) ep[i] = cube.ep[i]
    for (let n = 0; n < length; n++) {
      const move = MOVE_CUBES[moves[n]]
      for (let i = 0; i < 8; i++) cpNext[i] = cp[move.cp[i]]
      for (let i = 0; i < 12; i++) epNext[i] = ep[move.ep[i]]
      ;[cp, cpNext] = [cpNext, cp]
      ;[ep, epNext] = [epNext, ep]
    }
    const cornerPerm = getPerm(cp, 0, 8)
    const edgePerm = getPerm(ep, 0, 8)
    const slicePerm = getPerm(ep, 8, 4)

    // Until there is any solution, let phase 2 run as long as it needs so one
    // is guaranteed. After that only quick endings can beat the best.
    const limit = best === null ? PHASE2_MAX : Math.min(PHASE2_QUICK_MAX, maxLength - length)
    const atLeast = Math.max(
      t.cornerSlicePrune[cornerPerm * PERM4_COUNT + slicePerm],
      t.edgeSlicePrune[edgePerm * PERM4_COUNT + slicePerm],
    )
    for (let togo = atLeast; togo <= limit && !stop; togo++) {
      // Phase 2 starts with no memory of phase 1's last move, so that the
      // shortest ending is always found; the join is tidied afterwards.
      if (phase2(cornerPerm, edgePerm, slicePerm, togo, length, -1)) {
        const found = joinPhases(moves, length, length + togo)
        best = found
        maxLength = found.length - 1
        if (found.length <= targetLength || maxLength < length) stop = true
        return
      }
    }
  }

  const phase1 = (
    twist: number,
    flip: number,
    slice: number,
    togo: number,
    depth: number,
    lastFace: number,
  ): void => {
    if (togo === 0) {
      if (twist === 0 && flip === 0 && slice === 0) finish(depth)
      return
    }
    if (outOfTime()) return
    for (let face = 0; face < 6; face++) {
      if (face === lastFace || face + 3 === lastFace) continue
      for (let turns = 0; turns < 3; turns++) {
        const move = face * 3 + turns
        const nextSlice = t.sliceMove[slice * MOVE_COUNT + move]
        const nextTwist = t.twistMove[twist * MOVE_COUNT + move]
        if (t.twistSlicePrune[nextTwist * SLICE_COUNT + nextSlice] >= togo) continue
        const nextFlip = t.flipMove[flip * MOVE_COUNT + move]
        if (t.flipSlicePrune[nextFlip * SLICE_COUNT + nextSlice] >= togo) continue
        moves[depth] = move
        phase1(nextTwist, nextFlip, nextSlice, togo - 1, depth + 1, face)
        if (stop) return
      }
    }
  }

  const twist = getTwist(cube.co)
  const flip = getFlip(cube.eo)
  const slice = getSlice(cube.ep)
  const atLeast = Math.max(
    t.twistSlicePrune[twist * SLICE_COUNT + slice],
    t.flipSlicePrune[flip * SLICE_COUNT + slice],
  )
  for (let length = atLeast; length <= maxLength && !stop; length++) {
    phase1(twist, flip, slice, length, 0, -1)
  }

  if (best === null) throw new Error('No solution found for a solvable cube')
  return best
}
