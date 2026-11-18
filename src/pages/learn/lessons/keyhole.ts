/** The lesson cases of the keyhole method. */
import { SEQUENCES as A } from '../../../core/methods/beginner/sequences.ts'
import { KEYHOLE_INSERTS as K, LAST_CORNERS } from '../../../core/methods/keyhole/sequences.ts'
import type { KeyholeStage } from '../../../core/methods/keyhole/stages.ts'
import { solvedCube } from '../../../core/cube/cubie.ts'
import { BOTTOM, MIDDLE, solvedBy } from '../lessons.ts'
import type { LessonCase, Pieces } from '../lessons.ts'
import { BEGINNER_LESSONS } from './beginner.ts'

/** The cross and three corners; the keyhole is at the front left, where the picture shows it grey. */
const THREE_CORNERS: Pieces = { edges: BOTTOM, corners: [4, 6, 7] }
/** The same with the middle-layer edges, for a keyhole at the front right or at the front left. */
const KEYHOLE_RIGHT: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: [5, 6, 7] }
const KEYHOLE_LEFT: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: [4, 6, 7] }
const TWO_LAYERS: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: BOTTOM }

export const KEYHOLE_LESSONS: Record<KeyholeStage, LessonCase[]> = {
  cross: BEGINNER_LESSONS.cross,
  'three-corners': [
    solvedBy('right', A.cornerFacingRight, THREE_CORNERS),
    solvedBy('front', A.cornerFacingFront, THREE_CORNERS),
    solvedBy('up', `${A.cornerFacingUp} ${A.cornerFacingRight}`, THREE_CORNERS),
    { id: 'keyhole', sequence: '', start: solvedCube(), shown: THREE_CORNERS, turned: ['up', 'up'] },
  ],
  'keyhole-edges': [
    solvedBy('right-from-front', K.rightFromFront, KEYHOLE_RIGHT),
    solvedBy('right-from-side', K.rightFromSide, KEYHOLE_RIGHT),
    solvedBy('left-from-front', K.leftFromFront, KEYHOLE_LEFT),
    solvedBy('left-from-side', K.leftFromSide, KEYHOLE_LEFT),
    solvedBy('bottom-turn', `D ${K.rightFromFront} D'`, KEYHOLE_LEFT),
    solvedBy('stuck', `${K.rightFromFront} U ${K.rightFromSide}`, KEYHOLE_RIGHT),
  ],
  'last-corner': [
    solvedBy('facing-right', LAST_CORNERS.facingRight, TWO_LAYERS),
    solvedBy('facing-front', LAST_CORNERS.facingFront, TWO_LAYERS),
    solvedBy('facing-up', LAST_CORNERS.facingUp, TWO_LAYERS),
    solvedBy('twisted-facing-right', LAST_CORNERS.twistedFacingRight, TWO_LAYERS),
    solvedBy('twisted-facing-front', LAST_CORNERS.twistedFacingFront, TWO_LAYERS),
  ],
  'last-layer-cross': BEGINNER_LESSONS['last-layer-cross'],
  'last-layer-edges': BEGINNER_LESSONS['last-layer-edges'],
  'last-layer-corner-positions': BEGINNER_LESSONS['last-layer-corner-positions'],
  'last-layer-corner-twists': BEGINNER_LESSONS['last-layer-corner-twists'],
}
