/**
 * The two blocks of the Roux method, found by search as a person finds them
 * by looking.
 *
 * The first block is built with any face moves, in the fewest there are.
 * Every such way is found, and the one kept is the one that leaves the
 * shortest second block.
 *
 * The second block is built the way Roux solvers build it: with `R`, `r`, `U`
 * and `M` only, none of which can disturb the first block. A table holds how
 * many turns every arrangement of its five pieces needs, so the fewest turns
 * are read off it without any searching.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { FACE_TURNS, parseTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { blockFrame } from './frame.ts'

/** A tracked piece is in one of 24 places: its position and which way round it is. */
const PLACES = 24

interface Tracked {
  isCorner: boolean
  piece: number
}

const corner = (piece: number): Tracked => ({ isCorner: true, piece })
const edge = (piece: number): Tracked => ({ isCorner: false, piece })
const homeOf = ({ isCorner, piece }: Tracked) => piece * (isCorner ? 3 : 2)

/** Where a turn takes a piece from each of the 24 places. Read in the block frame for wide and slice turns. */
interface PlaceMoves {
  turn: Turn
  corner: Uint8Array
  edge: Uint8Array
}

function placeMovesOf(turn: Turn): PlaceMoves {
  const corners = new Uint8Array(PLACES)
  const edges = new Uint8Array(PLACES)
  turn.effect.cp.forEach((from, to) => {
    for (let twist = 0; twist < 3; twist++) {
      corners[from * 3 + twist] = to * 3 + ((twist + turn.effect.co[to]) % 3)
    }
  })
  turn.effect.ep.forEach((from, to) => {
    for (let flip = 0; flip < 2; flip++) {
      edges[from * 2 + flip] = to * 2 + ((flip + turn.effect.eo[to]) % 2)
    }
  })
  return { turn, corner: corners, edge: edges }
}

/** The place of each tracked piece on a cube. */
function placesOf(cube: CubieCube, tracked: readonly Tracked[]): number[] {
  return tracked.map(({ isCorner, piece }) => {
    const position = (isCorner ? cube.cp : cube.ep).indexOf(piece)
    return isCorner ? position * 3 + cube.co[position] : position * 2 + cube.eo[position]
  })
}

// --- The first block

/** Bottom-front-left and bottom-back-left corners, then the bottom-left, front-left and back-left edges. */
const FIRST: readonly Tracked[] = [corner(5), corner(6), edge(6), edge(9), edge(10)]
/** The pieces of the second block, in the order its table numbers them. */
const SECOND: readonly Tracked[] = [corner(4), corner(7), edge(4), edge(8), edge(11)]

const FACE_MOVES = FACE_TURNS.map(placeMovesOf)
const FACE_OF = FACE_MOVES.map((move) => Math.floor(move.turn.faceMoves[0] / 3))

/** Each guide is four of the five pieces; a table says how many moves those four need alone. */
const GUIDES = [
  [0, 1, 2, 3],
  [0, 1, 2, 4],
  [0, 1, 3, 4],
]
let guideTables: Int8Array[] | null = null

/** Fewest moves to bring four pieces home, from every arrangement of them. */
function guideTable(pieces: readonly Tracked[]): Int8Array {
  const distances = new Int8Array(PLACES ** 4).fill(-1)
  const maps = pieces.map((piece) => FACE_MOVES.map((move) => (piece.isCorner ? move.corner : move.edge)))
  let frontier = [pieces.reduce((key, piece) => key * PLACES + homeOf(piece), 0)]
  distances[frontier[0]] = 0
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: number[] = []
    for (const key of frontier) {
      const d = key % PLACES
      const c = ((key - d) / PLACES) % PLACES
      const b = Math.floor(key / (PLACES * PLACES)) % PLACES
      const a = Math.floor(key / (PLACES * PLACES * PLACES))
      for (let move = 0; move < FACE_MOVES.length; move++) {
        const reached =
          ((maps[0][move][a] * PLACES + maps[1][move][b]) * PLACES + maps[2][move][c]) * PLACES +
          maps[3][move][d]
        if (distances[reached] !== -1) continue
        distances[reached] = depth
        next.push(reached)
      }
    }
    frontier = next
  }
  return distances
}

/** A number of moves the first block certainly needs from these places; never too high. */
function firstBlockEstimate(places: readonly number[]): number {
  guideTables ??= GUIDES.map((guide) => guideTable(guide.map((index) => FIRST[index])))
  let most = 0
  for (let g = 0; g < GUIDES.length; g++) {
    const [a, b, c, d] = GUIDES[g]
    const distance =
      guideTables[g][((places[a] * PLACES + places[b]) * PLACES + places[c]) * PLACES + places[d]]
    if (distance > most) most = distance
  }
  return most
}

/** The search stops at this depth; a first block that needed more would be built the plain way. */
const FIRST_BLOCK_DEPTH = 12
/** How many ways of the same length are kept to choose from. */
const WAYS_KEPT = 48
/** How much searching one first block may take before the plain way is used instead. */
const SEARCH_BUDGET = 400_000

/**
 * Every way (up to `WAYS_KEPT`) of building the first block in the fewest
 * face moves, each as indexes into `FACE_TURNS`. Empty if the search ran out
 * of budget.
 */
function firstBlockWays(start: readonly number[], searchBudget: number): number[][] {
  const ways: number[][] = []
  const path: number[] = []
  let budget = searchBudget

  const descend = (places: readonly number[], left: number, lastFace: number): void => {
    if (firstBlockEstimate(places) > left) return
    if (left === 0) {
      ways.push(path.slice())
      return
    }
    if (budget-- <= 0) return
    for (let move = 0; move < FACE_MOVES.length && ways.length < WAYS_KEPT; move++) {
      const face = FACE_OF[move]
      // The same face twice is one move; opposite faces are tried in one order only.
      if (face === lastFace || face + 3 === lastFace) continue
      const { corner: corners, edge: edges } = FACE_MOVES[move]
      path.push(move)
      descend(
        [corners[places[0]], corners[places[1]], edges[places[2]], edges[places[3]], edges[places[4]]],
        left - 1,
        face,
      )
      path.pop()
    }
  }

  for (let depth = firstBlockEstimate(start); depth <= FIRST_BLOCK_DEPTH; depth++) {
    descend(start, depth, -1)
    if (ways.length > 0 || budget <= 0) break
  }
  return budget <= 0 ? [] : ways
}

/**
 * A sure way to build the first block when the search gives up: four of its
 * pieces are brought home by reading their table, then the last edge is
 * worked in around them.
 */
function plainFirstBlock(start: readonly number[]): number[] {
  const path: number[] = []
  let places = start.slice()
  const step = (move: number) => {
    const { corner: corners, edge: edges } = FACE_MOVES[move]
    places = [corners[places[0]], corners[places[1]], edges[places[2]], edges[places[3]], edges[places[4]]]
    path.push(move)
  }
  firstBlockEstimate(places)
  const table = guideTables![0]
  const keyOf = (at: readonly number[]) => ((at[0] * PLACES + at[1]) * PLACES + at[2]) * PLACES + at[3]
  while (table[keyOf(places)] > 0) {
    const distance = table[keyOf(places)]
    const move = FACE_MOVES.findIndex(
      ({ corner: corners, edge: edges }) =>
        table[keyOf([corners[places[0]], corners[places[1]], edges[places[2]], edges[places[3]]])] ===
        distance - 1,
    )
    step(move)
  }
  // With four pieces home the last edge is never far: the search cannot run out here.
  const rest = firstBlockWays(places, SEARCH_BUDGET)[0]
  if (!rest) throw new Error('Roux solver could not finish the first block')
  rest.forEach(step)
  return path
}

export interface FirstBlock {
  turns: Turn[]
  /** How many turns the second block will take after these. */
  secondBlock: number
}

/**
 * The first block of a view in the fewest face moves; of the ways that are
 * equally short, the one that leaves the shortest second block. When the
 * search would take more than `searchBudget`, the plain way is used.
 */
export function solveFirstBlock(view: CubieCube, searchBudget = SEARCH_BUDGET): FirstBlock {
  const start = placesOf(view, FIRST)
  let ways = firstBlockWays(start, searchBudget)
  if (ways.length === 0) ways = [plainFirstBlock(start)]

  const second = placesOf(view, SECOND)
  let best: FirstBlock | null = null
  for (const way of ways) {
    let places = second
    for (const move of way) {
      const { corner: corners, edge: edges } = FACE_MOVES[move]
      places = [corners[places[0]], corners[places[1]], edges[places[2]], edges[places[3]], edges[places[4]]]
    }
    const secondBlock = secondBlockDistance(places)
    if (!best || secondBlock < best.secondBlock) {
      best = { turns: way.map((move) => FACE_TURNS[move]), secondBlock }
    }
  }
  return best!
}

// --- The second block

/** The turns the second block is built with. Earlier ones are preferred among equally short ways. */
const SECOND_TURNS = parseTurns("U U' U2 R R' R2 r r' r2 M' M M2").map(placeMovesOf)

/**
 * With the first block built, a second-block piece can be in 18 places, not
 * 24: these number them 0–17 (and -1 for the six that are taken).
 */
function denseNumbers(taken: readonly number[], waysRound: number): Int8Array {
  const dense = new Int8Array(PLACES).fill(-1)
  let next = 0
  for (let place = 0; place < PLACES; place++) {
    if (!taken.includes(Math.floor(place / waysRound))) dense[place] = next++
  }
  return dense
}

const DENSE = 18
const CORNER_DENSE = denseNumbers([5, 6], 3)
const EDGE_DENSE = denseNumbers([6, 9, 10], 2)

let secondTable: Int8Array | null = null
/** For each turn, where it takes a corner and an edge, in dense numbers. */
let secondMoves: { corner: Uint8Array; edge: Uint8Array }[] | null = null

function buildSecondTable(): Int8Array {
  const sparse = (dense: Int8Array) => {
    const places: number[] = []
    dense.forEach((number, place) => {
      if (number >= 0) places[number] = place
    })
    return places
  }
  const cornerPlaces = sparse(CORNER_DENSE)
  const edgePlaces = sparse(EDGE_DENSE)
  secondMoves = SECOND_TURNS.map((move) => ({
    corner: Uint8Array.from(cornerPlaces, (place) => CORNER_DENSE[move.corner[place]]),
    edge: Uint8Array.from(edgePlaces, (place) => EDGE_DENSE[move.edge[place]]),
  }))

  const distances = new Int8Array(DENSE ** 5).fill(-1)
  const home = secondKey(SECOND.map(homeOf))
  distances[home] = 0
  let frontier = [home]
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: number[] = []
    for (const key of frontier) {
      const e = key % DENSE
      const d = Math.floor(key / DENSE) % DENSE
      const c = Math.floor(key / (DENSE * DENSE)) % DENSE
      const b = Math.floor(key / (DENSE * DENSE * DENSE)) % DENSE
      const a = Math.floor(key / (DENSE * DENSE * DENSE * DENSE))
      for (const { corner: corners, edge: edges } of secondMoves) {
        const reached =
          (((corners[a] * DENSE + corners[b]) * DENSE + edges[c]) * DENSE + edges[d]) * DENSE + edges[e]
        if (distances[reached] !== -1) continue
        distances[reached] = depth
        next.push(reached)
      }
    }
    frontier = next
  }
  return distances
}

/** The table's number for the places of the five second-block pieces. */
function secondKey(places: readonly number[]): number {
  return (
    (((CORNER_DENSE[places[0]] * DENSE + CORNER_DENSE[places[1]]) * DENSE + EDGE_DENSE[places[2]]) *
      DENSE +
      EDGE_DENSE[places[3]]) *
      DENSE +
    EDGE_DENSE[places[4]]
  )
}

/** How many turns the second block needs from these places, with the first block built. */
function secondBlockDistance(places: readonly number[]): number {
  secondTable ??= buildSecondTable()
  return secondTable[secondKey(places)]
}

/**
 * The second block of a view in the fewest `R`, `r`, `U` and `M` turns.
 * The first block must be built.
 */
export function solveSecondBlock(view: CubieCube): Turn[] {
  const frame = blockFrame(view)
  if (!frame) throw new Error('The second block needs the first block built')
  let places = placesOf(frame.cube, SECOND)
  const turns: Turn[] = []
  for (let left = secondBlockDistance(places); left > 0; left--) {
    const next = SECOND_TURNS.map(({ corner: corners, edge: edges }) => [
      corners[places[0]],
      corners[places[1]],
      edges[places[2]],
      edges[places[3]],
      edges[places[4]],
    ])
    const move = next.findIndex((reached) => secondBlockDistance(reached) === left - 1)
    if (move < 0) throw new Error('Roux solver could not build the second block')
    turns.push(SECOND_TURNS[move].turn)
    places = next[move]
  }
  return turns
}
