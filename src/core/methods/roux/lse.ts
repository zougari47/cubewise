/**
 * The last six edges of the Roux method, solved the way it is taught: in
 * three parts, each with `M` and `U` turns only.
 *
 * 1. Orient the six edges.
 * 2. Solve the top-left and top-right edges.
 * 3. Solve the four edges of the middle slice.
 *
 * Each part is small enough for a table to hold how many turns every
 * arrangement needs, so each is solved in the fewest turns. Where several
 * ways are equally short, the one that leaves the least for the parts after
 * it is taken, as a person who looks ahead would.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { distanceTable } from '../shared/search.ts'
import { applyTurn, parseTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { LAST_SIX_PLACES, MIDDLE_SLICE_PLACES, blockFrame, topCornerTurns } from './frame.ts'

const M_AND_U = parseTurns("U U' U2 M' M M2")
/** The last part turns the top layer by halves only. */
const M_AND_U2 = parseTurns("U2 M' M M2")

/** One part: its turns, and a number for everything about a view that the part cares about. */
interface Part {
  turns: readonly Turn[]
  size: number
  key: (view: CubieCube) => number
  table: Int8Array | null
}

const frameOf = (view: CubieCube) => {
  const frame = blockFrame(view)
  if (!frame) throw new Error('The last six edges need both blocks built')
  return frame
}

/** Which of the six edges are flipped, and whether the centres are a quarter turn off. */
function orientationKey(view: CubieCube): number {
  const { cube, centres } = frameOf(view)
  return LAST_SIX_PLACES.reduce((key, place) => key * 2 + cube.eo[place], centres % 2)
}

/** The orientation key, where the top-left and top-right edges are, and how far the top corners are turned. */
function sideEdgesKey(view: CubieCube): number {
  const { cube } = frameOf(view)
  const left = LAST_SIX_PLACES.indexOf(cube.ep.indexOf(2))
  const right = LAST_SIX_PLACES.indexOf(cube.ep.indexOf(0))
  return ((orientationKey(view) * 6 + left) * 6 + right) * 4 + topCornerTurns(cube)
}

/** Where each middle-slice edge is, how far the centres are off, and whether the top layer is half a turn off. */
function middleEdgesKey(view: CubieCube): number {
  const { cube, centres } = frameOf(view)
  const edges = MIDDLE_SLICE_PLACES.reduce(
    (key, place) => key * 4 + MIDDLE_SLICE_PLACES.indexOf(cube.ep[place]),
    0,
  )
  return (edges * 4 + centres) * 2 + (cube.cp[0] === 0 ? 0 : 1)
}

const ORIENT: Part = { turns: M_AND_U, size: 128, key: orientationKey, table: null }
const SIDES: Part = { turns: M_AND_U, size: 128 * 36 * 4, key: sideEdgesKey, table: null }
const MIDDLE: Part = { turns: M_AND_U2, size: 256 * 8, key: middleEdgesKey, table: null }

/** How many turns a part needs from a view that is ready for it. */
function turnsLeft(part: Part, view: CubieCube): number {
  part.table ??= distanceTable({ size: part.size, key: part.key, generators: part.turns })
  const distance = part.table[part.key(view)]
  if (distance < 0) throw new Error('The last six edges are in a state the Roux solver does not know')
  return distance
}

/** How many ways of the same length are looked at when choosing one. */
const WAYS_KEPT = 64

/** Every way (up to `WAYS_KEPT`) of doing a part in the fewest turns, with the view each ends in. */
function shortestWays(part: Part, view: CubieCube): { turns: Turn[]; view: CubieCube }[] {
  const ways: { turns: Turn[]; view: CubieCube }[] = []
  const path: Turn[] = []
  const descend = (cube: CubieCube, left: number): void => {
    if (left === 0) {
      ways.push({ turns: path.slice(), view: cube })
      return
    }
    for (const turn of part.turns) {
      if (ways.length >= WAYS_KEPT) return
      const reached = applyTurn(cube, turn)
      if (turnsLeft(part, reached) !== left - 1) continue
      path.push(turn)
      descend(reached, left - 1)
      path.pop()
    }
  }
  descend(view, turnsLeft(part, view))
  return ways
}

/** The shortest way through `parts` in which each part is as short as it can be. */
function shortestThrough(parts: readonly Part[], view: CubieCube): { first: Turn[]; total: number } {
  const [part, ...rest] = parts
  if (rest.length === 0) return { first: shortestWays(part, view)[0].turns, total: turnsLeft(part, view) }
  let best: { first: Turn[]; total: number } | null = null
  for (const way of shortestWays(part, view)) {
    const total = way.turns.length + shortestThrough(rest, way.view).total
    if (!best || total < best.total) best = { first: way.turns, total }
  }
  return best!
}

/** Orients the last six edges. Both blocks and the top corners must be done. */
export const orientLastEdges = (view: CubieCube) => shortestThrough([ORIENT, SIDES, MIDDLE], view).first

/** Solves the top-left and top-right edges. The last six edges must be oriented. */
export const solveSideEdges = (view: CubieCube) => shortestThrough([SIDES, MIDDLE], view).first

/** Solves the edges of the middle slice, and with them the cube. The side edges must be home. */
export const solveMiddleEdges = (view: CubieCube) => shortestThrough([MIDDLE], view).first

/** How many turns each part needs from a view that is ready for it; for tests. */
export const turnsToOrient = (view: CubieCube) => turnsLeft(ORIENT, view)
export const turnsForSideEdges = (view: CubieCube) => turnsLeft(SIDES, view)
export const turnsForMiddleEdges = (view: CubieCube) => turnsLeft(MIDDLE, view)
