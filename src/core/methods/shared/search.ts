/**
 * Searches that method solvers share. All of them work on the view (see
 * `turns.ts`) and return turns.
 *
 * - `findSequence`: a taught sequence, with an adjustment before and after.
 * - `blockSolver`: the fewest face moves that bring a set of pieces home.
 * - `searchTurns`: the fewest turns of any kind that reach any goal.
 * - `distanceTable`: how far every arrangement of something is from the goal,
 *   to guide `searchTurns`.
 */
import { solvedCube } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { applyTurn, applyTurns, parseTurns } from './turns.ts'
import type { Turn } from './turns.ts'

/** Pieces by number: corners 0–7, edges 0–11, as listed in `cubie.ts`. */
export interface Pieces {
  corners?: readonly number[]
  edges?: readonly number[]
}

const asTurns = (turns: readonly Turn[] | string) =>
  typeof turns === 'string' ? parseTurns(turns) : turns

/** How many of the given pieces are home and the right way round. */
export function countSolved(view: CubieCube, pieces: Pieces): number {
  const corners = (pieces.corners ?? []).filter((i) => view.cp[i] === i && view.co[i] === 0)
  const edges = (pieces.edges ?? []).filter((i) => view.ep[i] === i && view.eo[i] === 0)
  return corners.length + edges.length
}

/** Whether all the given pieces are home and the right way round. */
export function areSolved(view: CubieCube, pieces: Pieces): boolean {
  return countSolved(view, pieces) === (pieces.corners?.length ?? 0) + (pieces.edges?.length ?? 0)
}

// --- A taught sequence, with adjustments

/**
 * The shortest `before + sequence + after` that reaches `done`, or null.
 * This is how a person uses a sequence they know: line the cube up, do the
 * sequence, adjust.
 */
export function findSequence(
  view: CubieCube,
  options: {
    sequences: readonly (readonly Turn[])[]
    done: (view: CubieCube) => boolean
    /** Ways to line the cube up first, such as `U_TURNS`. Default: none. */
    before?: readonly (readonly Turn[])[]
    /** Ways to adjust afterwards. Default: none. */
    after?: readonly (readonly Turn[])[]
  },
): Turn[] | null {
  const before = options.before ?? [[]]
  const after = options.after ?? [[]]
  let best: Turn[] | null = null
  for (const first of before) {
    const lined = applyTurns(view, first)
    for (const sequence of options.sequences) {
      const length = first.length + sequence.length
      if (best && length >= best.length) continue
      const reached = applyTurns(lined, sequence)
      for (const last of after) {
        if (best && length + last.length >= best.length) continue
        if (options.done(applyTurns(reached, last))) best = [...first, ...sequence, ...last]
      }
    }
  }
  return best
}

// --- The fewest turns of any kind

/** Whether `next` straight after `previous` would be a wasted or repeated order of turns. */
function redundant(previous: Turn | null, next: Turn): boolean {
  if (!previous) return false
  if (previous.family === next.family) return true
  // Opposite faces can go in either order; only one order is tried.
  if (previous.kind === 'face' && next.kind === 'face') {
    const a = previous.faceMoves[0]
    const b = next.faceMoves[0]
    return Math.floor(a / 3) === Math.floor(b / 3) + 3
  }
  return false
}

/**
 * The fewest turns from `generators` that reach `done`, or null if there are
 * none within `maxDepth`. Tries every combination, so keep it to short
 * searches, or give an `estimate` that never overestimates the turns left.
 */
export function searchTurns(
  view: CubieCube,
  options: {
    generators: readonly Turn[] | string
    done: (view: CubieCube) => boolean
    maxDepth: number
    estimate?: (view: CubieCube) => number
  },
): Turn[] | null {
  const generators = asTurns(options.generators)
  const { done, estimate } = options
  const path: Turn[] = []

  const descend = (cube: CubieCube, left: number, previous: Turn | null): boolean => {
    if (left === 0) return done(cube)
    if (estimate && estimate(cube) > left) return false
    for (const turn of generators) {
      if (redundant(previous, turn)) continue
      path.push(turn)
      if (descend(applyTurn(cube, turn), left - 1, turn)) return true
      path.pop()
    }
    return false
  }

  for (let depth = 0; depth <= options.maxDepth; depth++) {
    if (descend(view, depth, null)) return path.slice()
  }
  return null
}

/**
 * How many turns every arrangement is from the goal, for arrangements
 * numbered by `key` (0 to `size` - 1). `key` must keep everything that
 * decides the keys of the cubes one turn away. Arrangements that cannot be
 * reached hold -1. `generators` must contain the inverse of each of its turns.
 */
export function distanceTable(options: {
  size: number
  key: (view: CubieCube) => number
  generators: readonly Turn[] | string
  /** The cubes at distance 0. Default: the solved cube. */
  goals?: readonly CubieCube[]
}): Int8Array {
  const generators = asTurns(options.generators)
  const distances = new Int8Array(options.size).fill(-1)
  let frontier = (options.goals ?? [solvedCube()]).slice()
  for (const goal of frontier) distances[options.key(goal)] = 0
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: CubieCube[] = []
    for (const cube of frontier) {
      for (const turn of generators) {
        const reached = applyTurn(cube, turn)
        const key = options.key(reached)
        if (distances[key] !== -1) continue
        distances[key] = depth
        next.push(reached)
      }
    }
    frontier = next
  }
  return distances
}

// --- The fewest face moves that bring pieces home

/** A tracked piece is in one of 24 slots: its position and which way round it is. */
const SLOTS = 24

interface SlotMoves {
  turn: Turn
  corner: Uint8Array
  edge: Uint8Array
}

function slotMovesOf(turn: Turn): SlotMoves {
  if (turn.kind !== 'face') throw new Error(`blockSolver only takes face moves, not "${turn.text}"`)
  const corner = new Uint8Array(SLOTS)
  const edge = new Uint8Array(SLOTS)
  turn.effect.cp.forEach((from, to) => {
    for (let twist = 0; twist < 3; twist++) {
      corner[from * 3 + twist] = to * 3 + ((twist + turn.effect.co[to]) % 3)
    }
  })
  turn.effect.ep.forEach((from, to) => {
    for (let flip = 0; flip < 2; flip++) {
      edge[from * 2 + flip] = to * 2 + ((flip + turn.effect.eo[to]) % 2)
    }
  })
  return { turn, corner, edge }
}

interface Tracked {
  isCorner: boolean
  piece: number
}

const trackedOf = (pieces: Pieces): Tracked[] => [
  ...(pieces.corners ?? []).map((piece) => ({ isCorner: true, piece })),
  ...(pieces.edges ?? []).map((piece) => ({ isCorner: false, piece })),
]

const homeSlot = ({ isCorner, piece }: Tracked) => piece * (isCorner ? 3 : 2)

/** Fewest moves to bring a few pieces home, from every arrangement of them. */
function pieceDistances(tracked: Tracked[], moves: SlotMoves[]): Int8Array {
  const count = tracked.length
  const distances = new Int8Array(SLOTS ** count).fill(-1)
  const slots = new Array<number>(count)
  let frontier: number[] = [tracked.reduce((key, piece) => key * SLOTS + homeSlot(piece), 0)]
  distances[frontier[0]] = 0
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: number[] = []
    for (const key of frontier) {
      let rest = key
      for (let i = count - 1; i >= 0; i--) {
        slots[i] = rest % SLOTS
        rest = (rest - slots[i]) / SLOTS
      }
      for (const move of moves) {
        let reached = 0
        for (let i = 0; i < count; i++) {
          reached = reached * SLOTS + (tracked[i].isCorner ? move.corner : move.edge)[slots[i]]
        }
        if (distances[reached] !== -1) continue
        distances[reached] = depth
        next.push(reached)
      }
    }
    frontier = next
  }
  return distances
}

export interface BlockSolver {
  /** The fewest moves that bring the pieces home, or null if `maxDepth` is too small. */
  (view: CubieCube): Turn[] | null
  /** A number of moves that the pieces certainly need; never too high. */
  estimate: (view: CubieCube) => number
}

/**
 * Makes a search for the fewest face moves that bring `pieces` home. To
 * build on what is already solved, list those pieces too: they start at home
 * and must end there.
 *
 * The search is guided by tables, built on first use, each holding the
 * distance for a few of the pieces alone. `guides` says which; a table has 24
 * entries to the power of its piece count, so keep each to five pieces at
 * most. The default splits `pieces` into groups of four.
 */
export function blockSolver(options: {
  pieces: Pieces
  /** Face moves only, and the inverse of each must be among them. Default: all 18. */
  generators?: readonly Turn[] | string
  guides?: readonly Pieces[]
  /** Default 14. */
  maxDepth?: number
}): BlockSolver {
  const moves = asTurns(
    options.generators ?? "U U2 U' R R2 R' F F2 F' D D2 D' L L2 L' B B2 B'",
  ).map(slotMovesOf)
  const tracked = trackedOf(options.pieces)
  const maxDepth = options.maxDepth ?? 14

  const indexOf = (wanted: Tracked) => {
    const index = tracked.findIndex(
      (piece) => piece.isCorner === wanted.isCorner && piece.piece === wanted.piece,
    )
    if (index < 0) throw new Error('A guide lists a piece that is not among the pieces to solve')
    return index
  }
  const groups: number[][] = options.guides
    ? options.guides.map((guide) => trackedOf(guide).map(indexOf))
    : Array.from({ length: Math.ceil(tracked.length / 4) }, (_, group) =>
        tracked.slice(group * 4, group * 4 + 4).map((_, i) => group * 4 + i),
      )
  let tables: Int8Array[] | null = null

  const slotsOf = (view: CubieCube) =>
    tracked.map(({ isCorner, piece }) => {
      const position = (isCorner ? view.cp : view.ep).indexOf(piece)
      return isCorner ? position * 3 + view.co[position] : position * 2 + view.eo[position]
    })

  const estimateSlots = (slots: readonly number[]): number => {
    tables ??= groups.map((group) =>
      pieceDistances(
        group.map((index) => tracked[index]),
        moves,
      ),
    )
    let most = 0
    for (let g = 0; g < groups.length; g++) {
      let key = 0
      for (const index of groups[g]) key = key * SLOTS + slots[index]
      const distance = tables[g][key]
      // Out of reach with these moves.
      if (distance < 0) return Infinity
      if (distance > most) most = distance
    }
    return most
  }

  const solve = (view: CubieCube): Turn[] | null => {
    const start = slotsOf(view)
    const path: Turn[] = []

    const descend = (slots: number[], left: number, previous: Turn | null): boolean => {
      const needed = estimateSlots(slots)
      if (needed > left) return false
      if (left === 0) return slots.every((slot, i) => slot === homeSlot(tracked[i]))
      for (const move of moves) {
        if (redundant(previous, move.turn)) continue
        const reached = slots.map((slot, i) => (tracked[i].isCorner ? move.corner : move.edge)[slot])
        path.push(move.turn)
        if (descend(reached, left - 1, move.turn)) return true
        path.pop()
      }
      return false
    }

    for (let depth = estimateSlots(start); depth <= maxDepth; depth++) {
      if (descend(start, depth, null)) return path.slice()
    }
    return null
  }

  return Object.assign(solve, { estimate: (view: CubieCube) => estimateSlots(slotsOf(view)) })
}
