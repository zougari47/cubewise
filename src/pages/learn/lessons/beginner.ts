/** The lesson cases of the beginner method. */
import { SEQUENCES as A } from '../../../core/methods/beginner/sequences.ts'
import type { BeginnerStage } from '../../../core/methods/beginner/stages.ts'
import { solvedCube } from '../../../core/cube/cubie.ts'
import { BOTTOM, MIDDLE, TOP, after, solvedBy } from '../lessons.ts'
import type { LessonCase, Pieces } from '../lessons.ts'

const FIRST_LAYER: Pieces = { edges: BOTTOM, corners: BOTTOM }
const TWO_LAYERS: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: BOTTOM }
const WHOLE_CUBE: Pieces = { edges: [...TOP, ...BOTTOM, ...MIDDLE], corners: [...TOP, ...BOTTOM] }

const X = A.lastLayerCross
const TWIST = `${A.lastLayerCornerTwist} ${A.lastLayerCornerTwist}`

export const BEGINNER_LESSONS: Record<BeginnerStage, LessonCase[]> = {
  cross: [
    { id: 'daisy', sequence: '', start: after('F2 R2 B2 L2'), shown: { edges: BOTTOM } },
    solvedBy('petal', 'F2', { edges: BOTTOM }),
    { id: 'done', sequence: '', start: solvedCube(), shown: { edges: BOTTOM }, turned: ['up', 'up'] },
  ],
  'first-layer-corners': [
    solvedBy('right', A.cornerFacingRight, FIRST_LAYER),
    solvedBy('front', A.cornerFacingFront, FIRST_LAYER),
    solvedBy('up', `${A.cornerFacingUp} ${A.cornerFacingRight}`, FIRST_LAYER),
  ],
  'middle-layer-edges': [
    solvedBy('right', A.edgeToRight, TWO_LAYERS),
    solvedBy('left', A.edgeToLeft, TWO_LAYERS),
  ],
  'last-layer-cross': [
    solvedBy('dot', `${X} U2 ${X} ${X}`, TWO_LAYERS, { topColourOnly: { edges: TOP } }),
    solvedBy('corner', `${X} ${X}`, TWO_LAYERS, { topColourOnly: { edges: TOP } }),
    solvedBy('line', X, TWO_LAYERS, { topColourOnly: { edges: TOP } }),
  ],
  'last-layer-edges': [
    solvedBy('swap', `${A.lastLayerEdges} U`, { ...TWO_LAYERS, edges: [...TOP, ...BOTTOM, ...MIDDLE] }),
  ],
  'last-layer-corner-positions': [solvedBy('cycle', A.lastLayerCornerCycle, WHOLE_CUBE)],
  'last-layer-corner-twists': [
    solvedBy('twist', `${TWIST} U ${TWIST} ${TWIST} U'`, WHOLE_CUBE),
  ],
}
