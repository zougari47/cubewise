/**
 * Petrus solver: solves a cube the way Lars Petrus's method does. A block of
 * two by two by two is built in one corner and grown to two by two by three,
 * which leaves two faces free. The edges outside the block are then all
 * turned the good way round, so that the first two layers can be finished
 * with those two faces alone and the last-layer edges end up facing up. The
 * last layer is the shared two-sequence finish: turn the corners to face up,
 * then move the pieces home.
 *
 * The cube is held so that the small block is at the bottom, back, left and
 * grows towards the front: the big block lies along the bottom left, and the
 * right and the top face are free. Any corner may start and the block may
 * grow in any of three directions, which is the 24 ways of holding the cube:
 * all are looked at and the shortest solution is kept.
 */
import { findUnsolvableReason } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { DEFAULT_ORIENTATION, turnCubeAbout } from '../../cube/orientation.ts'
import type { Orientation } from '../../cube/orientation.ts'
import { orientLastLayerCorners, permuteLastLayer } from '../shared/last-layer.ts'
import { shortestOf, solveInStages } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { applyTurns, viewOf } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { planBlocks, solveExtension } from './blocks.ts'
import { solveEdgeOrientation } from './edges.ts'
import { layersDistance, solveLayers } from './layers.ts'
import { PETRUS_STAGES } from './stages.ts'
import type { PetrusStage } from './stages.ts'

export type PetrusSolution = MethodSolution<PetrusStage>

/**
 * The 24 ways of holding the cube. The first puts the entered top face at the
 * bottom with the front unchanged, and is kept when nothing is shorter.
 */
const STARTS: Orientation[] = (['z', 'x'] as const).flatMap((axis) =>
  [2, 0, 1, 3]
    .filter((quarters) => axis === 'z' || quarters % 2 === 1)
    .flatMap((quarters) =>
      [0, 1, 2, 3].map((about) =>
        turnCubeAbout(turnCubeAbout(DEFAULT_ORIENTATION, axis, quarters), 'y', about),
      ),
    ),
)

/** The turns of the four stages before the last layer, from one way of holding the cube. */
export interface PetrusPlan {
  smallBlock: Turn[]
  bigBlock: Turn[]
  edgeOrientation: Turn[]
  firstTwoLayers: Turn[]
  /** Moves of the four stages together. */
  moves: number
}

/** How many ways of building the small block are looked at, for each way of holding the cube. */
const SMALL_BLOCK_WAYS = 400
/** How many of them are followed further: those that leave the shortest big block. */
const SMALL_BLOCKS = 3
/** How many of the shortest ways of adding the extension are followed further. */
const EXTENSIONS = 6
/** How many of the shortest ways of making the edges good are compared. */
const EDGE_ORIENTATIONS = 24

/** The shortest way found through the first four stages from `view`, which must be of a solvable cube. */
export function planFrom(view: CubieCube): PetrusPlan {
  let best: PetrusPlan | null = null
  for (const { smallBlock, moves } of planBlocks(view, 1, SMALL_BLOCK_WAYS, SMALL_BLOCKS)) {
    const withSmallBlock = applyTurns(view, smallBlock)
    for (const bigBlock of solveExtension(withSmallBlock, EXTENSIONS)) {
      const withBigBlock = applyTurns(withSmallBlock, bigBlock)
      for (const parts of solveEdgeOrientation(withBigBlock, EDGE_ORIENTATIONS)) {
        const edgeOrientation = parts.flatMap((part) => part.turns)
        const oriented = applyTurns(withBigBlock, edgeOrientation)
        const total = moves + edgeOrientation.length + layersDistance(oriented)
        if (best && total >= best.moves) continue
        best = { smallBlock, bigBlock, edgeOrientation, firstTwoLayers: solveLayers(oriented), moves: total }
      }
    }
  }
  if (!best) throw new Error('Petrus solver found no way to build the blocks')
  return best
}

function solveFrom(cube: CubieCube, start: Orientation, plan: PetrusPlan): PetrusSolution {
  return solveInStages(cube, start, PETRUS_STAGES, {
    'small-block': () => plan.smallBlock,
    'big-block': () => plan.bigBlock,
    'edge-orientation': () => plan.edgeOrientation,
    'first-two-layers': () => plan.firstTwoLayers,
    'orient-last-layer-corners': orientLastLayerCorners,
    'permute-last-layer': permuteLastLayer,
  })
}

/** How many of the other ways of holding the cube are solved to the end, to compare their last layers too: those with the best plans. */
const FINISHED = 3

/**
 * Solves `cube` with the Petrus method. Throws if the cube is not solvable.
 */
export function solvePetrus(cube: CubieCube): PetrusSolution {
  if (findUnsolvableReason(cube) !== null) {
    // `solveInStages` says why.
    return solveFrom(cube, STARTS[0], { smallBlock: [], bigBlock: [], edgeOrientation: [], firstTwoLayers: [], moves: 0 })
  }
  const plans = STARTS.map((start) => ({ start, plan: planFrom(viewOf(cube, start)) }))
  // The first way of holding the cube is always finished, and comes first so that it wins when nothing is shorter.
  const finished = [plans[0], ...plans.slice(1).sort((a, b) => a.plan.moves - b.plan.moves).slice(0, FINISHED)]
  return shortestOf(finished.map(({ start, plan }) => solveFrom(cube, start, plan)))
}
