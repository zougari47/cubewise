/** The lesson cases of CFOP. */
import { solvedCube } from '../../../core/cube/cubie.ts'
import {
  CROSS_EXAMPLES as C,
  ORIENTATIONS,
  PAIR_EXAMPLES as P,
} from '../../../core/methods/cfop/sequences.ts'
import type { CfopStage } from '../../../core/methods/cfop/stages.ts'
import { BOTTOM, MIDDLE, TOP, solvedBy } from '../lessons.ts'
import type { LessonCase, Pieces } from '../lessons.ts'
import { PERMUTATION_CASES } from './last-layer.ts'

const CROSS: Pieces = { edges: BOTTOM }
const TWO_LAYERS: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: BOTTOM }

export const CFOP_LESSONS: Record<CfopStage, LessonCase[]> = {
  cross: [
    solvedBy('from-top', C.fromTop, CROSS),
    solvedBy('from-middle', C.fromMiddle, CROSS),
    solvedBy('facing-front', C.facingFront, CROSS),
    solvedBy('flipped', C.flipped, CROSS),
    solvedBy('bottom-turn', C.bottomTurn, CROSS),
    { id: 'done', sequence: '', start: solvedCube(), shown: CROSS, turned: ['up', 'up'] },
  ],
  'first-two-layers': [
    solvedBy('joined-insert', P.joinedInsert, TWO_LAYERS),
    solvedBy('split-insert', P.splitInsert, TWO_LAYERS),
    solvedBy('joined-insert-front', P.joinedInsertFront, TWO_LAYERS),
    solvedBy('split-insert-front', P.splitInsertFront, TWO_LAYERS),
    solvedBy('join-then-insert', P.joinThenInsert, TWO_LAYERS),
    solvedBy('corner-facing-up', P.cornerFacingUp, TWO_LAYERS),
    solvedBy('corner-twisted-in-slot', P.cornerTwistedInSlot, TWO_LAYERS),
  ],
  // One case per sequence, in the order of the table: cross, line, L, dot.
  'orient-last-layer': Object.entries(ORIENTATIONS).map(([id, sequence]) =>
    solvedBy(id, sequence, TWO_LAYERS, { topColourOnly: { edges: TOP, corners: TOP } }),
  ),
  'permute-last-layer': PERMUTATION_CASES,
}
