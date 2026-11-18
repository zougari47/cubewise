/** The lesson cases of the ZZ method. */
import { solvedCube } from '../../../core/cube/cubie.ts'
import { BLOCK_EXAMPLES as B, EO_LINE_EXAMPLES as E } from '../../../core/methods/zz/sequences.ts'
import type { ZzStage } from '../../../core/methods/zz/stages.ts'
import { BOTTOM, MIDDLE, TOP, solvedBy } from '../lessons.ts'
import type { LessonCase, Pieces } from '../lessons.ts'
import { CORNER_ORIENTATION_CASES, PERMUTATION_CASES } from './last-layer.ts'

/** Good and bad are about edges only, so the corners stay grey. */
const ALL_EDGES: Pieces = { edges: [...TOP, ...BOTTOM, ...MIDDLE] }
const LINE: Pieces = { edges: [5, 7] }
const LINE_AND_RIGHT_EDGE: Pieces = { edges: [5, 7, 4] }
const FRONT_OF_RIGHT_BLOCK: Pieces = { edges: [5, 7, 4, 8], corners: [4] }
const RIGHT_BLOCK: Pieces = { edges: [5, 7, 4, 8, 11], corners: [4, 7] }
const RIGHT_BLOCK_AND_FRONT_OF_LEFT: Pieces = { edges: [5, 7, 4, 8, 11, 6, 9], corners: [4, 7, 5] }
const TWO_LAYERS: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: BOTTOM }

export const ZZ_LESSONS: Record<ZzStage, LessonCase[]> = {
  'eo-line': [
    solvedBy('four-bad', E.fourBad, ALL_EDGES),
    solvedBy('gather', E.gather, ALL_EDGES),
    solvedBy('two-bad', E.twoBad, ALL_EDGES),
    solvedBy('line-edges', E.lineEdges, LINE),
    solvedBy('together', E.together, ALL_EDGES),
    { id: 'done', sequence: '', start: solvedCube(), shown: LINE, turned: ['up', 'up'] },
  ],
  // The right block is in view; the left block is shown from its own side.
  'first-two-layers': [
    solvedBy('bottom-edge', B.bottomEdge, LINE_AND_RIGHT_EDGE),
    solvedBy('front-pair', B.frontPair, FRONT_OF_RIGHT_BLOCK),
    solvedBy('split-pair', B.splitPair, FRONT_OF_RIGHT_BLOCK),
    solvedBy('back-pair', B.backPair, RIGHT_BLOCK),
    solvedBy('left-pair', B.leftPair, RIGHT_BLOCK_AND_FRONT_OF_LEFT, { turned: ['left'] }),
    { id: 'done', sequence: '', start: solvedCube(), shown: TWO_LAYERS },
  ],
  'orient-last-layer-corners': CORNER_ORIENTATION_CASES,
  'permute-last-layer': PERMUTATION_CASES,
}
