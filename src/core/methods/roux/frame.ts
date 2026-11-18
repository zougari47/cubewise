/**
 * What "done" means in the Roux method, while the centres of the middle
 * slice are still free to move.
 *
 * The view follows the centres, so after an `M` or an `r` it no longer shows
 * the blocks as home, although nobody has touched them. The Roux solver
 * therefore reads the cube in "the block frame": the pieces are numbered by
 * where they belong next to the first block, wherever the four centres of
 * the middle slice have got to. The frame also says how far those centres
 * are from where the blocks want them, in quarter turns of the middle slice.
 *
 * In the block frame the turns the method uses after the first block (`U`,
 * `R`, `r`, `M`) move pieces the same way every time, which is what lets
 * tables be built for them.
 */
import { multiply } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { areSolved } from '../shared/search.ts'
import type { Pieces } from '../shared/search.ts'
import { turnOf } from '../shared/turns.ts'

/** The first block: the 1×2×3 on the left of the bottom layer. */
export const FIRST_BLOCK: Pieces = { corners: [5, 6], edges: [6, 9, 10] }
/** The second block: the 1×2×3 on the right of the bottom layer. */
export const SECOND_BLOCK: Pieces = { corners: [4, 7], edges: [4, 8, 11] }
export const BOTH_BLOCKS: Pieces = { corners: [4, 5, 6, 7], edges: [4, 6, 8, 9, 10, 11] }
/** Where the last six edges live: the four top edges and the two bottom edges of the middle slice. */
export const LAST_SIX_PLACES = [0, 1, 2, 3, 5, 7]
/** Where the edges of the middle slice live: top front, top back, bottom back, bottom front. */
export const MIDDLE_SLICE_PLACES = [1, 3, 7, 5]

const TOP = [0, 1, 2, 3]

export interface BlockFrame {
  /** The cube with its pieces numbered by where they belong next to the first block. */
  cube: CubieCube
  /** How many quarter turns the centres of the middle slice are from agreeing with the blocks (0–3). */
  centres: number
}

/** Renumbering for each number of quarter turns the centres may be off by. */
const RENUMBER = [null, turnOf('x', 1).relabel!, turnOf('x', 2).relabel!, turnOf('x', 3).relabel!]

/** The block frame of a view, or null while the first block is not built. */
export function blockFrame(view: CubieCube): BlockFrame | null {
  for (let centres = 0; centres < 4; centres++) {
    const renumber = RENUMBER[centres]
    const cube = renumber ? multiply(renumber, view) : view
    if (areSolved(cube, FIRST_BLOCK)) return { cube, centres }
  }
  return null
}

/** The first block is built. */
export const firstBlockDone = (view: CubieCube) => blockFrame(view) !== null

/** Both blocks are built. */
export function blocksDone(view: CubieCube): boolean {
  const frame = blockFrame(view)
  return frame !== null && areSolved(frame.cube, SECOND_BLOCK)
}

/** How many quarter turns of the top layer bring the top corners home, or -1 if none does. */
export function topCornerTurns(cube: CubieCube): number {
  if (TOP.some((place) => cube.co[place] !== 0 || cube.cp[place] > 3)) return -1
  const turns = (cube.cp[0] + 4) % 4
  return TOP.every((place) => cube.cp[place] === (place + turns) % 4) ? turns : -1
}

/** Both blocks are built and the top corners are solved, give or take a turn of the top layer. */
export function topCornersDone(view: CubieCube): boolean {
  const frame = blockFrame(view)
  return frame !== null && areSolved(frame.cube, SECOND_BLOCK) && topCornerTurns(frame.cube) >= 0
}

/**
 * The corners are done and all six remaining edges are oriented: each shows
 * the top or the bottom colour upwards or downwards, and the centre on top is
 * the top or the bottom one.
 */
export function lastEdgesOriented(view: CubieCube): boolean {
  const frame = blockFrame(view)
  return (
    frame !== null &&
    frame.centres % 2 === 0 &&
    areSolved(frame.cube, SECOND_BLOCK) &&
    topCornerTurns(frame.cube) >= 0 &&
    frame.cube.eo.every((flip) => flip === 0)
  )
}

/** The edges are oriented, and the top-left and top-right edges are home between their corners. */
export function sideEdgesDone(view: CubieCube): boolean {
  const frame = blockFrame(view)
  return (
    frame !== null &&
    lastEdgesOriented(view) &&
    topCornerTurns(frame.cube) === 0 &&
    areSolved(frame.cube, { edges: [0, 2] })
  )
}
