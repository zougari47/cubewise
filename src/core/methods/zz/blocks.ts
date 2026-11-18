/**
 * The first two layers of ZZ: two blocks of two by three pieces, one each
 * side of the line, built with `R`, `U` and `L` moves only. Those moves keep
 * every edge good and leave the line alone, so nothing from the first stage
 * can be undone, and the cube is never turned in the hands.
 *
 * A table per block holds how many moves every arrangement of its five
 * pieces needs. The first block is read off its table; the second is found
 * by a search that the two tables guide, since it must end with the first
 * block back in place.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { areSolved } from '../shared/search.ts'
import type { Pieces } from '../shared/search.ts'
import { applyTurns, parseTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'

/** The only moves of this stage. */
export const BLOCK_MOVES = "R R2 R' U U2 U' L L2 L'"

/** Bottom-left edge, front-left and back-left edges, and the two corners between them. */
export const LEFT_BLOCK = { corners: [5, 6], edges: [6, 9, 10] } as const satisfies Pieces
/** The same on the right. */
export const RIGHT_BLOCK = { corners: [4, 7], edges: [4, 8, 11] } as const satisfies Pieces

type Block = typeof LEFT_BLOCK | typeof RIGHT_BLOCK

export const blocksDone = (view: CubieCube) => areSolved(view, LEFT_BLOCK) && areSolved(view, RIGHT_BLOCK)

const TURNS = parseTurns(BLOCK_MOVES)
const MOVES = TURNS.length
/** The face of each move, as 0 (R), 1 (U) or 2 (L). */
const FACE = TURNS.map((_, move) => Math.floor(move / 3))

const EDGE_PLACES = 12
/** A corner is in one of 24 places: its position and its twist. */
const CORNER_PLACES = 24
const CORNER_KEYS = CORNER_PLACES * CORNER_PLACES
const TABLE_SIZE = EDGE_PLACES ** 3 * CORNER_KEYS

/** Where each move takes an edge from each position (edges stay good, so no flip is kept). */
const EDGE_MOVES = TURNS.map(({ effect }) => {
  const table = new Uint8Array(EDGE_PLACES)
  effect.ep.forEach((from, to) => (table[from] = to))
  return table
})
/** Where each move takes a corner from each place. */
const CORNER_MOVES = TURNS.map(({ effect }) => {
  const table = new Uint8Array(CORNER_PLACES)
  effect.cp.forEach((from, to) => {
    for (let twist = 0; twist < 3; twist++) table[from * 3 + twist] = to * 3 + ((twist + effect.co[to]) % 3)
  })
  return table
})

/** The places of a block's pieces: three edges, then two corners. */
type Places = [number, number, number, number, number]

const keyOf = (p: Readonly<Places>) =>
  ((p[0] * EDGE_PLACES + p[1]) * EDGE_PLACES + p[2]) * CORNER_KEYS + p[3] * CORNER_PLACES + p[4]

function placesOf(view: CubieCube, block: Block): Places {
  const [a, b] = block.corners.map((piece) => {
    const position = view.cp.indexOf(piece)
    return position * 3 + view.co[position]
  })
  const [x, y, z] = block.edges.map((piece) => view.ep.indexOf(piece))
  return [x, y, z, a, b]
}

const moved = (p: Readonly<Places>, move: number): Places => [
  EDGE_MOVES[move][p[0]],
  EDGE_MOVES[move][p[1]],
  EDGE_MOVES[move][p[2]],
  CORNER_MOVES[move][p[3]],
  CORNER_MOVES[move][p[4]],
]

const homeOf = (block: Block): Places => [
  block.edges[0],
  block.edges[1],
  block.edges[2],
  block.corners[0] * 3,
  block.corners[1] * 3,
]

/** Fewest moves to build one block, from every arrangement of its pieces; -1 where there is no way. */
function blockTable(block: Block): Int8Array {
  const distances = new Int8Array(TABLE_SIZE).fill(-1)
  let frontier: Places[] = [homeOf(block)]
  distances[keyOf(frontier[0])] = 0
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: Places[] = []
    for (const places of frontier) {
      for (let move = 0; move < MOVES; move++) {
        const reached = moved(places, move)
        const key = keyOf(reached)
        if (distances[key] !== -1) continue
        distances[key] = depth
        next.push(reached)
      }
    }
    frontier = next
  }
  return distances
}

const tables = new Map<Block, Int8Array>()

function tableOf(block: Block): Int8Array {
  let table = tables.get(block)
  if (!table) {
    table = blockTable(block)
    tables.set(block, table)
  }
  return table
}

/** The fewest moves that build `block` alone, whatever happens to the other. */
export function blockDistance(view: CubieCube, block: Block): number {
  return tableOf(block)[keyOf(placesOf(view, block))]
}

/** `R` and `L` can go in either order, so only one is tried; a face is never turned twice running. */
const wasted = (previous: number, move: number) =>
  previous >= 0 && (FACE[previous] === FACE[move] || (FACE[previous] === 2 && FACE[move] === 0))

/** Every way of building `block` in the fewest moves, up to `limit` of them. */
function firstBlocks(view: CubieCube, block: Block, limit: number): Turn[][] {
  const table = tableOf(block)
  const found: Turn[][] = []
  const path: Turn[] = []
  const descend = (places: Places, left: number, previous: number): void => {
    if (left === 0) {
      found.push(path.slice())
      return
    }
    for (let move = 0; move < MOVES && found.length < limit; move++) {
      if (wasted(previous, move)) continue
      const reached = moved(places, move)
      if (table[keyOf(reached)] !== left - 1) continue
      path.push(TURNS[move])
      descend(reached, left - 1, move)
      path.pop()
    }
  }
  const start = placesOf(view, block)
  const distance = table[keyOf(start)]
  if (distance < 0) throw new Error('The edges must be good and the line home before the blocks')
  descend(start, distance, -1)
  return found
}

/** Counts the tries of the searches, for tests of how hard they work. */
export const searchStats = { tries: 0 }

/**
 * The fewest moves that build `block` and end with the `kept` block, which is
 * built already, back in place. Null if that takes more than `maxDepth`
 * moves, or more than `budget` tries to find.
 */
function secondBlock(
  view: CubieCube,
  block: Block,
  kept: Block,
  maxDepth: number,
  budget: number,
): Turn[] | null {
  const table = tableOf(block)
  const keptTable = tableOf(kept)
  const path: number[] = []
  let tries = 0

  const descend = (places: Places, keptPlaces: Places, left: number, previous: number): boolean => {
    // Neither table can ask for too much: each counts the moves of one block alone.
    if (table[keyOf(places)] > left || keptTable[keyOf(keptPlaces)] > left) return false
    if (left === 0) return true
    if (++tries > budget) return false
    for (let move = 0; move < MOVES; move++) {
      if (wasted(previous, move)) continue
      path.push(move)
      if (descend(moved(places, move), moved(keptPlaces, move), left - 1, move)) return true
      path.pop()
    }
    return false
  }

  const start = placesOf(view, block)
  const keptStart = placesOf(view, kept)
  let found = false
  for (let depth = table[keyOf(start)]; depth <= maxDepth && tries <= budget && !found; depth++) {
    found = descend(start, keptStart, depth, -1)
  }
  searchStats.tries += tries
  return found ? path.map((move) => TURNS[move]) : null
}

/** How many of the shortest ways to build the first block are looked at, for each block. */
const FIRSTS = 8
/** A second block has never needed more than a few thousand tries; this is far above that. */
const BUDGET = 500_000
/** No pair of blocks needs this many moves. */
const MAX_DEPTH = 30

const ORDERS = [
  [LEFT_BLOCK, RIGHT_BLOCK],
  [RIGHT_BLOCK, LEFT_BLOCK],
] as const

/**
 * Builds both blocks. Either may come first, and the first is built in the
 * fewest moves there are; the ways tried are those that leave the second
 * block closest, and the shortest whole is kept. With `shorterThan`, only an
 * answer of fewer moves than that is wanted, and null says there is none.
 */
export function solveBlocks(view: CubieCube, shorterThan = Infinity): Turn[] | null {
  if (blocksDone(view)) return shorterThan > 0 ? [] : null
  const candidates = ORDERS.flatMap(([first, second]) =>
    firstBlocks(view, first, FIRSTS).map((turns) => {
      const reached = applyTurns(view, turns)
      return { turns, reached, first, second, least: turns.length + blockDistance(reached, second) }
    }),
  ).sort((a, b) => a.least - b.least)

  let best: Turn[] | null = null
  let limit = Math.min(shorterThan, MAX_DEPTH + 1)
  for (const { turns, reached, first, second, least } of candidates) {
    if (least >= limit) break
    const rest = secondBlock(reached, second, first, limit - 1 - turns.length, BUDGET)
    if (!rest) continue
    best = [...turns, ...rest]
    limit = best.length
  }
  if (best || shorterThan <= MAX_DEPTH) return best

  // Never seen to happen: the search gave up. Search again for as long as it takes.
  const { turns, reached, first, second } = candidates[0]
  const rest = secondBlock(reached, second, first, MAX_DEPTH, Infinity)
  if (!rest) throw new Error('ZZ solver could not build the blocks')
  return [...turns, ...rest]
}
