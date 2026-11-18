/**
 * The fourth stage of Petrus: the first two layers are finished with `R` and
 * `U` moves only, which keep the big block and keep every edge good.
 *
 * Five pieces are added to the block, and there is a choice of which five.
 * Either the right-hand pieces of the bottom two layers go in and the top
 * layer is left for last, or the left-hand pieces of the top layer go in and
 * the right layer is left; the cube is then turned so that layer is on top.
 *
 * A table for each choice holds how many moves every arrangement of its five
 * pieces needs, so solutions are read off without searching.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { areSolved, distanceTable } from '../shared/search.ts'
import type { Pieces } from '../shared/search.ts'
import { applyTurn, parseTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { FREE_EDGE_PLACES, FREE_MOVES } from './edges.ts'

/** The corner places outside the big block: four on top, then bottom front right and bottom back right. */
const FREE_CORNER_PLACES = [0, 1, 2, 3, 4, 7]

interface Choice {
  /** The five pieces that join the block. */
  pieces: Required<Pieces>
  /** The whole-cube turn that then puts the layer left over on top. */
  after: Turn[]
  table: Int8Array | null
}

/** The top layer is left for last: nothing to turn afterwards. */
const TOP_LAST: Choice = { pieces: { corners: [4, 7], edges: [4, 8, 11] }, after: [], table: null }
/** The right layer is left for last, and comes to the top with `z'`. */
const RIGHT_LAST: Choice = { pieces: { corners: [1, 2], edges: [1, 2, 3] }, after: parseTurns("z'"), table: null }

/** The first is taken when both need the same number of moves. */
const CHOICES = [TOP_LAST, RIGHT_LAST]

const TURNS = parseTurns(FREE_MOVES)
const EDGES = FREE_EDGE_PLACES.length
/** A corner is in one of 18 places: its position and its twist. */
const CORNERS = FREE_CORNER_PLACES.length * 3
const TABLE_SIZE = EDGES ** 3 * CORNERS ** 2

/** Numbers the arrangement of a choice's five pieces. The edges are good, so their flips are not kept. */
function keyOf(view: CubieCube, { pieces }: Choice): number {
  let key = 0
  for (const edge of pieces.edges) {
    key = key * EDGES + FREE_EDGE_PLACES.indexOf(view.ep.indexOf(edge))
  }
  for (const corner of pieces.corners) {
    const position = view.cp.indexOf(corner)
    key = key * CORNERS + FREE_CORNER_PLACES.indexOf(position) * 3 + view.co[position]
  }
  return key
}

function distanceOf(view: CubieCube, choice: Choice): number {
  choice.table ??= distanceTable({
    size: TABLE_SIZE,
    key: (cube) => keyOf(cube, choice),
    generators: TURNS,
  })
  return choice.table[keyOf(view, choice)]
}

/**
 * The fewest `R` and `U` moves that finish the stage, leaving the given layer
 * for last or whichever is quicker. The big block must be built and every
 * edge good.
 */
export function layersDistance(view: CubieCube, last?: 'top' | 'right'): number {
  if (last) return distanceOf(view, last === 'top' ? TOP_LAST : RIGHT_LAST)
  return Math.min(...CHOICES.map((choice) => distanceOf(view, choice)))
}

/**
 * Finishes the first two layers in the fewest `R` and `U` moves, and turns
 * the cube if needed so that the layer left over is on top.
 */
export function solveLayers(view: CubieCube): Turn[] {
  const choice = CHOICES.reduce((best, next) => (distanceOf(view, next) < distanceOf(view, best) ? next : best))
  const turns: Turn[] = []
  let cube = view
  for (let left = distanceOf(view, choice); left > 0; left--) {
    const turn = TURNS.find((candidate) => distanceOf(applyTurn(cube, candidate), choice) === left - 1)
    if (!turn) throw new Error('The big block must be built and every edge good before the first two layers')
    turns.push(turn)
    cube = applyTurn(cube, turn)
  }
  if (!areSolved(cube, choice.pieces)) {
    throw new Error('The big block must be built and every edge good before the first two layers')
  }
  return [...turns, ...choice.after]
}
