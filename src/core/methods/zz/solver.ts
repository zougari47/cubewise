/**
 * ZZ solver: solves a cube the way the ZZ method does, in four stages. First
 * every edge is turned the good way round while the two line edges go home
 * (EOLine). Then the first two layers are built as two blocks, one each side
 * of the line, with `R`, `U` and `L` moves only and without turning the cube
 * in the hands. Both are found by search, as a person finds them by looking.
 * The last-layer edges then face up already, so the last layer is the shared
 * two-sequence finish: turn the corners to face up, then move the pieces home.
 *
 * The line is built on the face the user entered as the top one, so the cube
 * is first turned over to put that face at the bottom. The line may then run
 * from front to back or from side to side: both are tried, and the shorter
 * solution is kept.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { DEFAULT_ORIENTATION, turnCubeAbout } from '../../cube/orientation.ts'
import type { Orientation } from '../../cube/orientation.ts'
import { orientLastLayerCorners, permuteLastLayer } from '../shared/last-layer.ts'
import { shortestOf, solveInStages } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { applyTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { solveBlocks } from './blocks.ts'
import { solveEoLine } from './eo-line.ts'
import { ZZ_STAGES } from './stages.ts'
import type { ZzStage } from './stages.ts'

export type ZzSolution = MethodSolution<ZzStage>

/** The entered top face goes to the bottom; then the front stays in front, or the cube is turned a quarter about its vertical axis. */
const STARTS: Orientation[] = [0, 1].map((quarters) =>
  turnCubeAbout(turnCubeAbout(DEFAULT_ORIENTATION, 'z', 2), 'y', quarters),
)

/** How many of the shortest ways through the first stage are looked at. */
const LINES = 40

/**
 * The first two stages together. The first stage is done in the fewest moves
 * there are; of the ways to do that, the one kept leaves the shortest blocks.
 */
export function solveEoLineAndBlocks(view: CubieCube): { line: Turn[]; blocks: Turn[] } {
  let best: { line: Turn[]; blocks: Turn[] } | null = null
  for (const line of solveEoLine(view, LINES)) {
    const blocks = solveBlocks(applyTurns(view, line), best?.blocks.length)
    if (blocks) best = { line, blocks }
  }
  if (!best) throw new Error('ZZ solver could not build the blocks')
  return best
}

function solveFrom(cube: CubieCube, start: Orientation): ZzSolution {
  let blocks: Turn[] | null = null
  return solveInStages(cube, start, ZZ_STAGES, {
    'eo-line': (view) => {
      const found = solveEoLineAndBlocks(view)
      blocks = found.blocks
      return found.line
    },
    'first-two-layers': (view) => {
      const turns = blocks ?? solveBlocks(view)
      if (!turns) throw new Error('ZZ solver could not build the blocks')
      return turns
    },
    'orient-last-layer-corners': orientLastLayerCorners,
    'permute-last-layer': permuteLastLayer,
  })
}

/**
 * Solves `cube` with the ZZ method. Throws if the cube is not solvable.
 */
export function solveZz(cube: CubieCube): ZzSolution {
  return shortestOf(STARTS.map((start) => solveFrom(cube, start)))
}
