/** The lesson cases of the Petrus method. */
import { solvedCube } from '../../../core/cube/cubie.ts'
import {
  BIG_BLOCK_EXAMPLES as B,
  EDGE_FLIPS,
  LAYER_EXAMPLES as L,
  SMALL_BLOCK_EXAMPLES as S,
} from '../../../core/methods/petrus/sequences.ts'
import type { PetrusStage } from '../../../core/methods/petrus/stages.ts'
import { BOTTOM, MIDDLE, TOP, solvedBy } from '../lessons.ts'
import type { LessonCase, Pieces } from '../lessons.ts'
import { CORNER_ORIENTATION_CASES, PERMUTATION_CASES } from './last-layer.ts'

const SMALL_BLOCK: Pieces = { corners: [6], edges: [6, 7, 10] }
const BIG_BLOCK: Pieces = { corners: [5, 6], edges: [5, 6, 7, 9, 10] }
/** Good and bad are about edges only, so the corners outside the block stay grey. */
const BLOCK_AND_EDGES: Pieces = { corners: [5, 6], edges: [...TOP, ...BOTTOM, ...MIDDLE] }
const BLOCK_AND_SQUARE: Pieces = { corners: [5, 6, 4], edges: [5, 6, 7, 9, 10, 4, 8] }
const TWO_LAYERS: Pieces = { corners: BOTTOM, edges: [...BOTTOM, ...MIDDLE] }
/** What is solved when the right layer is left for last. */
const ALL_BUT_RIGHT_LAYER: Pieces = { corners: [5, 6, 1, 2], edges: [5, 6, 7, 9, 10, 1, 2, 3] }

export const PETRUS_LESSONS: Record<PetrusStage, LessonCase[]> = {
  // The small block is at the back left, so its pictures show the cube from behind or from the left.
  'small-block': [
    solvedBy('last-turn', S.lastTurn, SMALL_BLOCK, { turned: ['left', 'left'] }),
    solvedBy('pair-and-square', S.pairAndSquare, SMALL_BLOCK, { turned: ['left', 'left'] }),
    solvedBy('from-scratch', S.fromScratch, SMALL_BLOCK, { turned: ['left'] }),
    { id: 'done', sequence: '', start: solvedCube(), shown: SMALL_BLOCK, turned: ['left', 'left'] },
  ],
  'big-block': [
    solvedBy('pair-then-square', B.pairThenSquare, BIG_BLOCK),
    solvedBy('pair-from-the-back', B.pairFromTheBack, BIG_BLOCK),
    solvedBy('twisted-corner', B.twistedCorner, BIG_BLOCK),
    { id: 'done', sequence: '', start: solvedCube(), shown: BIG_BLOCK, turned: ['left'] },
  ],
  // One case per sequence, in the order of the table.
  'edge-orientation': Object.entries(EDGE_FLIPS).map(([id, sequence]) =>
    solvedBy(id, sequence, BLOCK_AND_EDGES),
  ),
  'first-two-layers': [
    solvedBy('square', L.square, BLOCK_AND_SQUARE),
    solvedBy('back-pair', L.backPair, TWO_LAYERS),
    solvedBy('misaligned', L.misaligned, TWO_LAYERS),
    solvedBy('right-last', L.rightLast, ALL_BUT_RIGHT_LAYER),
    { id: 'done', sequence: '', start: solvedCube(), shown: TWO_LAYERS },
  ],
  'orient-last-layer-corners': CORNER_ORIENTATION_CASES,
  'permute-last-layer': PERMUTATION_CASES,
}
