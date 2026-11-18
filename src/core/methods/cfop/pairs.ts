/**
 * The first two layers, the way CFOP does them: a corner of the first layer
 * and the middle-layer edge that belongs above it are brought together and
 * put into their slot as a pair, four times over.
 *
 * Each pair is solved by search, in the fewest moves that keep the cross and
 * the finished pairs. The search moves as a person does here: it turns the
 * top layer and one side face at a time, and while a pair is being solved
 * that side face comes back to where it was before another one turns. The
 * bottom face is never turned. The four slots
 * are tried in every order and the shortest way through is kept. Whole-cube
 * turns are worked out at the end, so that no move has to be made on the
 * back face.
 *
 * A search that takes too long gives way to a plain one that only ever does
 * what the lesson teaches: turn the top, or take a slot out, turn the top and
 * put it back. The plain way also says how deep the search need look, so the
 * search can never run away.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { parseTurns, turnOf } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'

/** The faces turned while pairing: all but the bottom one. Index = face * 3 + quarter turns - 1. */
const MOVES = parseTurns("U U2 U' R R2 R' L L2 L' F F2 F' B B2 B'")
const [U, R, L, F, B] = [0, 1, 2, 3, 4]

/** A tracked piece is in one of 24 places: its position and which way round it is. */
const PLACES = 24

/** A slot: the corner and edge that fill it, and the two cross edges below it. */
interface Slot {
  corner: number
  edge: number
  cross: readonly [number, number]
  /** The two ways of taking the slot out to the top layer: the face, and the quarter turns that lift it. */
  lifts: readonly (readonly [face: number, quarters: number])[]
}

/** Front right, front left, back left, back right. */
const SLOTS: readonly Slot[] = [
  { corner: 4, edge: 8, cross: [5, 4], lifts: [[R, 1], [F, 3]] },
  { corner: 5, edge: 9, cross: [5, 6], lifts: [[L, 3], [F, 1]] },
  { corner: 6, edge: 10, cross: [6, 7], lifts: [[L, 1], [B, 3]] },
  { corner: 7, edge: 11, cross: [7, 4], lifts: [[R, 3], [B, 1]] },
]
const ALL_SLOTS = 0b1111

/**
 * What the search follows, as places: the four cross edges (pieces 4–7),
 * then the four slot corners (4–7), then the four slot edges (8–11).
 */
const TRACKED = 12
const isCorner = (index: number) => index >= 4 && index < 8
const pieceOf = (index: number) => (index < 8 ? 4 + (index & 3) : index)

type Places = Uint8Array

function placesOf(view: CubieCube): Places {
  const places = new Uint8Array(TRACKED)
  for (let index = 0; index < TRACKED; index++) {
    if (isCorner(index)) {
      const position = view.cp.indexOf(pieceOf(index))
      places[index] = position * 3 + view.co[position]
    } else {
      const position = view.ep.indexOf(pieceOf(index))
      places[index] = position * 2 + view.eo[position]
    }
  }
  return places
}

const HOME = placesOf({
  cp: [0, 1, 2, 3, 4, 5, 6, 7],
  co: [0, 0, 0, 0, 0, 0, 0, 0],
  ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
})

const slotHome = (places: Places, slot: number) =>
  places[4 + slot] === HOME[4 + slot] && places[8 + slot] === HOME[8 + slot]

interface Tables {
  /** Where each move takes a corner or an edge, by place. */
  corner: Uint8Array[]
  edge: Uint8Array[]
  /** Fewest moves that bring the four cross edges home. */
  cross: Int8Array
  /** Per slot: fewest moves that bring its corner, its edge and the two cross edges below it home. */
  pair: Int8Array[]
}

let tables: Tables | null = null

/** Fewest moves home for four pieces followed together, from every arrangement of them. */
function distances(indexes: readonly number[], corner: Uint8Array[], edge: Uint8Array[]): Int8Array {
  const table = new Int8Array(PLACES ** 4).fill(-1)
  const moves = indexes.map((index) => (isCorner(index) ? corner : edge))
  const start = indexes.reduce((key, index) => key * PLACES + HOME[index], 0)
  table[start] = 0
  let frontier = [start]
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: number[] = []
    for (const key of frontier) {
      const d = key % PLACES
      const c = ((key - d) / PLACES) % PLACES
      const b = Math.floor(key / (PLACES * PLACES)) % PLACES
      const a = Math.floor(key / (PLACES * PLACES * PLACES))
      for (let move = 0; move < MOVES.length; move++) {
        const reached =
          ((moves[0][move][a] * PLACES + moves[1][move][b]) * PLACES + moves[2][move][c]) * PLACES +
          moves[3][move][d]
        if (table[reached] !== -1) continue
        table[reached] = depth
        next.push(reached)
      }
    }
    frontier = next
  }
  return table
}

function buildTables(): Tables {
  const corner = MOVES.map(({ effect }) => {
    const table = new Uint8Array(PLACES)
    effect.cp.forEach((from, to) => {
      for (let twist = 0; twist < 3; twist++) table[from * 3 + twist] = to * 3 + ((twist + effect.co[to]) % 3)
    })
    return table
  })
  const edge = MOVES.map(({ effect }) => {
    const table = new Uint8Array(PLACES)
    effect.ep.forEach((from, to) => {
      for (let flip = 0; flip < 2; flip++) table[from * 2 + flip] = to * 2 + ((flip + effect.eo[to]) % 2)
    })
    return table
  })
  return {
    corner,
    edge,
    cross: distances([0, 1, 2, 3], corner, edge),
    pair: SLOTS.map((slot, index) =>
      distances([4 + index, 8 + index, slot.cross[0] - 4, slot.cross[1] - 4], corner, edge),
    ),
  }
}

const tablesNow = () => (tables ??= buildTables())

function moved(places: Places, move: number, into: Places = new Uint8Array(TRACKED)): Places {
  const { corner, edge } = tablesNow()
  for (let index = 0; index < TRACKED; index++) {
    into[index] = (isCorner(index) ? corner : edge)[move][places[index]]
  }
  return into
}

// --- The sure way: turn the top, or take a slot out, turn the top and put it back

/** One thing the plain way does, as moves. */
const PLAIN_STEPS: { moves: number[]; slot: number }[] = [
  ...[0, 1, 2].map((turn) => ({ moves: [U * 3 + turn], slot: -1 })),
  ...SLOTS.flatMap((slot, index) =>
    slot.lifts.flatMap(([face, quarters]) =>
      [0, 1, 2].map((turn) => ({
        moves: [face * 3 + quarters - 1, U * 3 + turn, face * 3 + 3 - quarters],
        slot: index,
      })),
    ),
  ),
]

interface PlainWay {
  /** Moves still needed from each arrangement of the pair (corner place × 24 + edge place); -1 if out of reach. */
  cost: Int16Array
  /** The step to do next, as an index into `PLAIN_STEPS`. */
  next: Int8Array
}

const plainWays = new Map<number, PlainWay>()

/**
 * How to solve the pair of `slot` from anywhere using only plain steps
 * through the slots in `open` (which must include `slot`). These steps leave
 * the cross and every other slot as they were.
 */
function plainWay(slot: number, open: number): PlainWay {
  const id = slot * 16 + open
  const known = plainWays.get(id)
  if (known) return known
  const { corner, edge } = tablesNow()
  const steps = PLAIN_STEPS.map((step, index) => ({ ...step, index })).filter(
    (step) => step.slot < 0 || (open >> step.slot) & 1,
  )
  const after = (key: number, moves: number[]) => {
    let c = Math.floor(key / PLACES)
    let e = key % PLACES
    for (const move of moves) {
      c = corner[move][c]
      e = edge[move][e]
    }
    return c * PLACES + e
  }
  const cost = new Int16Array(PLACES * PLACES).fill(-1)
  const next = new Int8Array(PLACES * PLACES).fill(-1)
  cost[HOME[4 + slot] * PLACES + HOME[8 + slot]] = 0
  for (let changed = true; changed; ) {
    changed = false
    for (let key = 0; key < cost.length; key++) {
      for (const step of steps) {
        const reached = cost[after(key, step.moves)]
        if (reached < 0) continue
        const total = reached + step.moves.length
        if (cost[key] < 0 || total < cost[key]) {
          cost[key] = total
          next[key] = step.index
          changed = true
        }
      }
    }
  }
  const way = { cost, next }
  plainWays.set(id, way)
  return way
}

function plainSolution(places: Places, slot: number, open: number): number[] {
  const { corner, edge } = tablesNow()
  const way = plainWay(slot, open)
  const moves: number[] = []
  let c = places[4 + slot]
  let e = places[8 + slot]
  while (way.cost[c * PLACES + e] > 0) {
    for (const move of PLAIN_STEPS[way.next[c * PLACES + e]].moves) {
      moves.push(move)
      c = corner[move][c]
      e = edge[move][e]
    }
  }
  if (way.cost[c * PLACES + e] < 0) throw new Error('A pair is where no pair can be')
  return moves
}

/** For tests: the moves the plain way needs for the pair of `slot`, or -1 if it cannot solve it. */
export function plainCost(cornerPlace: number, edgePlace: number, slot: number, open: number): number {
  return plainWay(slot, open).cost[cornerPlace * PLACES + edgePlace]
}

// --- The short way: fewest moves, by search

/** How many arrangements one search may look at before the plain way is used instead. */
const SEARCH_LIMIT = 150_000

/**
 * The fewest moves that solve the pair of `slot`, keeping the cross and the
 * slots in `done`. Looks only for something shorter than the plain way, and
 * gives the plain way when there is nothing shorter or when the search has
 * looked at `searchLimit` arrangements, so it always answers.
 */
function solvePair(places: Places, slot: number, done: number, searchLimit: number): number[] {
  const { corner, edge, cross, pair } = tablesNow()
  const plain = plainSolution(places, slot, ALL_SLOTS & ~done)
  const kept = SLOTS.map((_, index) => index).filter((index) => index === slot || (done >> index) & 1)

  const estimate = (at: Places): number => {
    let most = cross[((at[0] * PLACES + at[1]) * PLACES + at[2]) * PLACES + at[3]]
    for (const index of kept) {
      const below = SLOTS[index].cross
      const distance =
        pair[index][
          ((at[4 + index] * PLACES + at[8 + index]) * PLACES + at[below[0] - 4]) * PLACES + at[below[1] - 4]
        ]
      if (distance > most) most = distance
    }
    return most
  }

  const stack = Array.from({ length: plain.length + 1 }, () => new Uint8Array(TRACKED))
  stack[0].set(places)
  const path: number[] = []
  let looked = 0

  /**
   * `open` is the side face that is turned away from where it was (-1 when
   * none is) and `turned` by how many quarter turns. While one is, no other
   * side face may turn: this is what keeps the moves to those a person makes.
   */
  const descend = (depth: number, left: number, lastFace: number, open: number, turned: number): boolean => {
    const at = stack[depth]
    const needed = estimate(at)
    if (needed > left) return false
    if (left === 0) return true
    if (++looked > searchLimit) return false
    const into = stack[depth + 1]
    for (let move = 0; move < MOVES.length; move++) {
      const face = Math.floor(move / 3)
      if (face === lastFace) continue
      let nowOpen = open
      let nowTurned = turned
      if (face !== U) {
        if (open >= 0 && face !== open) continue
        nowTurned = (turned + (move % 3) + 1) % 4
        nowOpen = nowTurned === 0 ? -1 : face
      }
      for (let index = 0; index < TRACKED; index++) {
        into[index] = (isCorner(index) ? corner : edge)[move][at[index]]
      }
      path[depth] = move
      if (descend(depth + 1, left - 1, face, nowOpen, nowTurned)) return true
    }
    return false
  }

  for (let depth = estimate(places); depth < plain.length; depth++) {
    path.length = 0
    if (descend(0, depth, -1, -1, 0)) return path.slice(0, depth)
    if (looked > searchLimit) break
  }
  return plain
}

// --- Whole-cube turns

/** The face each side face is written as after one whole-cube turn `y`. */
const AFTER_Y: Record<number, number> = { [U]: U, [R]: F, [F]: L, [L]: B, [B]: R }
const HOLDS = 4

/**
 * Writes face moves, found without ever turning the whole cube, as the user
 * does them: with a whole-cube turn `y` wherever a move would otherwise be on
 * the back face. Uses as few whole-cube turns as it can, and then as few
 * moves of the front face.
 */
function withWholeCubeTurns(moves: readonly number[]): { turns: Turn[]; wholeCubeTurns: number } {
  const written = (move: number, hold: number) => {
    let face = Math.floor(move / 3)
    for (let n = 0; n < hold; n++) face = AFTER_Y[face]
    return face
  }
  const TURN_COST = 100
  const price = (move: number, hold: number) => {
    const face = written(move, hold)
    return face === B ? Infinity : face === F ? 1 : 0
  }
  // best[i][h]: least cost of the moves from `i` on, when the cube is held in `h` before move `i`.
  const best = Array.from({ length: moves.length + 1 }, () => new Array<number>(HOLDS).fill(0))
  const choice = Array.from({ length: moves.length }, () => new Array<number>(HOLDS).fill(0))
  for (let i = moves.length - 1; i >= 0; i--) {
    for (let hold = 0; hold < HOLDS; hold++) {
      best[i][hold] = Infinity
      // Staying as held is tried first, so the cube is only turned when it pays.
      for (let n = 0; n < HOLDS; n++) {
        const next = (hold + n) % HOLDS
        const cost = (n === 0 ? 0 : TURN_COST) + price(moves[i], next) + best[i + 1][next]
        if (cost < best[i][hold]) {
          best[i][hold] = cost
          choice[i][hold] = next
        }
      }
    }
  }
  const turns: Turn[] = []
  let hold = 0
  let wholeCubeTurns = 0
  moves.forEach((move, i) => {
    const next = choice[i][hold]
    if (next !== hold) {
      turns.push(turnOf('y', (next - hold + HOLDS) % HOLDS))
      wholeCubeTurns++
    }
    hold = next
    turns.push(turnOf('URLFB'[written(move, hold)], (move % 3) + 1))
  })
  return { turns, wholeCubeTurns }
}

// --- All four pairs, in the order that costs least

/**
 * Solves the four pairs of a view whose cross is done. Returns the turns as
 * the user does them. `searchLimit` is how many arrangements the search for
 * one pair may look at; with 0, only the plain way is used.
 */
export function solvePairs(view: CubieCube, searchLimit = SEARCH_LIMIT): Turn[] {
  const start = placesOf(view)
  for (let index = 0; index < 4; index++) {
    if (start[index] !== HOME[index]) throw new Error('The cross must be done before the pairs')
  }

  let best: { turns: Turn[]; cost: number } | null = null
  const path: number[] = []

  const search = (places: Places, done: number) => {
    let finished = done
    SLOTS.forEach((_, slot) => {
      if (slotHome(places, slot)) finished |= 1 << slot
    })
    if (finished === ALL_SLOTS) {
      const { turns, wholeCubeTurns } = withWholeCubeTurns(path)
      const cost = path.length + wholeCubeTurns
      if (!best || cost < best.cost) best = { turns, cost }
      return
    }
    const ways = SLOTS.map((_, slot) => slot)
      .filter((slot) => !((finished >> slot) & 1))
      .map((slot) => ({ slot, moves: solvePair(places, slot, finished, searchLimit) }))
      .sort((a, b) => a.moves.length - b.moves.length)
    // No later pair can take fewer than three moves.
    const later = (ways.length - 1) * 3
    for (const way of ways) {
      if (best && path.length + way.moves.length + later >= best.cost) break
      let reached = places
      for (const move of way.moves) reached = moved(reached, move)
      path.push(...way.moves)
      search(reached, finished | (1 << way.slot))
      path.length -= way.moves.length
    }
  }

  search(start, 0)
  return (best as { turns: Turn[] } | null)?.turns ?? []
}
