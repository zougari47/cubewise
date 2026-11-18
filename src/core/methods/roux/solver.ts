/**
 * Roux solver: solves a cube the way the Roux method does. Two blocks are
 * built on the left and the right of the bottom layer by search, as a person
 * builds them by looking; the top corners are solved with one taught
 * sequence; the last six edges are solved in three parts with `M` and `U`
 * turns only.
 *
 * The blocks are built on the face the user entered as the top one, so the
 * cube is first turned over to put that face at the bottom. Any of its four
 * sides may then be the front: each is tried, and the one whose two blocks
 * take the fewest turns is kept.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { findUnsolvableReason } from '../../cube/cubie.ts'
import { DEFAULT_ORIENTATION, turnCubeAbout } from '../../cube/orientation.ts'
import type { Orientation } from '../../cube/orientation.ts'
import { solveInStages } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { findSequence } from '../shared/search.ts'
import { U_TURNS, parseTurns, viewOf } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { solveFirstBlock, solveSecondBlock } from './blocks.ts'
import type { FirstBlock } from './blocks.ts'
import { topCornersDone } from './frame.ts'
import { orientLastEdges, solveMiddleEdges, solveSideEdges } from './lse.ts'
import { TOP_CORNERS } from './sequences.ts'
import { ROUX_STAGES } from './stages.ts'
import type { RouxStage } from './stages.ts'

export type RouxSolution = MethodSolution<RouxStage>

/** The entered top face goes to the bottom; then each of the four sides in front. */
const STARTS: Orientation[] = [0, 1, 2, 3].map((quarters) =>
  turnCubeAbout(turnCubeAbout(DEFAULT_ORIENTATION, 'z', 2), 'y', quarters),
)

const TOP_CORNER_TURNS = Object.values(TOP_CORNERS).map(parseTurns)

/** Solves the top corners: the top layer is lined up, then one of the 42 sequences. */
export function solveTopCorners(view: CubieCube): Turn[] {
  if (topCornersDone(view)) return []
  const turns = findSequence(view, {
    before: U_TURNS,
    sequences: TOP_CORNER_TURNS,
    done: topCornersDone,
  })
  if (!turns) throw new Error('The top corners do not match any known case')
  return turns
}

/**
 * Solves `cube` with the Roux method. Throws if the cube is not solvable.
 */
export function solveRoux(cube: CubieCube): RouxSolution {
  let start = STARTS[0]
  let first: FirstBlock | null = null
  if (findUnsolvableReason(cube) === null) {
    for (const candidate of STARTS) {
      const found = solveFirstBlock(viewOf(cube, candidate))
      const better =
        !first || found.turns.length + found.secondBlock < first.turns.length + first.secondBlock
      if (better) {
        start = candidate
        first = found
      }
    }
  }
  return solveInStages(cube, start, ROUX_STAGES, {
    'first-block': () => first!.turns,
    'second-block': solveSecondBlock,
    'top-corners': solveTopCorners,
    'orient-last-edges': orientLastEdges,
    'side-edges': solveSideEdges,
    'middle-edges': solveMiddleEdges,
  })
}
