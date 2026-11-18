/** The lesson cases of the beginner method. */
import { SEQUENCES as A } from '../../../core/methods/beginner/sequences.ts'
import type { BeginnerStage } from '../../../core/methods/beginner/stages.ts'
import { solvedCube } from '../../../core/cube/cubie.ts'
import { formatTurns, invertTurns, parseTurns } from '../../../core/methods/shared/turns.ts'
import { BOTTOM, MIDDLE, TOP, after, solvedBy } from '../lessons.ts'
import type { LessonCase, Pieces } from '../lessons.ts'

const FIRST_LAYER: Pieces = { edges: BOTTOM, corners: BOTTOM }
const TWO_LAYERS: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: BOTTOM }
const WHOLE_CUBE: Pieces = { edges: [...TOP, ...BOTTOM, ...MIDDLE], corners: [...TOP, ...BOTTOM] }

const WHITE_EDGES: Pieces = { edges: BOTTOM }
/** From solved, the four white edges round the yellow centre. */
const DAISY = 'F2 R2 B2 L2'
/** The worked example: a daisy made one white edge at a time, then each petal dropped. */
export const WHOLE_DAISY = "L' U L2 F' R U' R"
export const WHOLE_DROPS = "U F2 U' B2 U2 R2 U' L2"

/** A case that ends with one more petal on the daisy: its picture starts from the daisy with `sequence` undone. */
function petalFrom(id: string, sequence: string, shown: Pieces): LessonCase {
  const undo = formatTurns(invertTurns(parseTurns(sequence)))
  return { id, sequence, start: after(`${DAISY} ${undo}`), shown, stopsShort: true }
}

const X = A.lastLayerCross
const TWIST = `${A.lastLayerCornerTwist} ${A.lastLayerCornerTwist}`

export const BEGINNER_LESSONS: Record<BeginnerStage, LessonCase[]> = {
  cross: [
    // The plan.
    { id: 'daisy', sequence: '', start: after(DAISY), shown: WHITE_EDGES },
    { id: 'done', sequence: '', start: solvedCube(), shown: WHITE_EDGES, turned: ['up', 'up'] },
    // Making the daisy: one case for each place a white edge can be.
    petalFrom('middle', 'R', WHITE_EDGES),
    petalFrom('make-room', 'U R', WHITE_EDGES),
    petalFrom('bottom', 'R2', WHITE_EDGES),
    petalFrom('flipped-top', 'F R', { edges: [4, 6, 7] }),
    petalFrom('flipped-bottom', "F' R", { edges: [4, 6, 7] }),
    // From the daisy to the cross.
    solvedBy('petal', 'F2', WHITE_EDGES),
    solvedBy('line-up', 'U F2', WHITE_EDGES),
    solvedBy('whole', `${WHOLE_DAISY} ${WHOLE_DROPS}`, WHITE_EDGES),
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
