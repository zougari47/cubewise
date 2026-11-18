/**
 * The cases of "Before you start": the page for someone who has never solved
 * a cube, with what every method needs. It is not a method and has no stages.
 */
import { solvedCube } from '../../core/cube/cubie.ts'
import { BOTTOM, MIDDLE, TOP } from './lessons.ts'
import type { LessonCase, Pieces } from './lessons.ts'

const ALL_CORNERS = [...TOP, ...BOTTOM]
const WHOLE_CUBE: Pieces = { edges: [...TOP, ...BOTTOM, ...MIDDLE], corners: ALL_CORNERS }

/** Four moves that bring the cube back to where it was when done six times. */
export const PRACTICE_ROUND = "R U R' U'"
export const PRACTICE_ROUNDS = 6

/** A picture of the solved cube with some pieces in colour and nothing to play. */
const picture = (id: string, shown: Pieces, more: Pick<LessonCase, 'turned'> = {}): LessonCase => ({
  id,
  sequence: '',
  start: solvedCube(),
  shown,
  ...more,
})

/** A sequence played on the solved cube, to watch what it does. */
const played = (id: string, sequence: string, stopsShort = true): LessonCase => ({
  id,
  sequence,
  start: solvedCube(),
  shown: WHOLE_CUBE,
  stopsShort,
})

export const BEFORE_YOU_START_CASES: LessonCase[] = [
  // The pieces.
  picture('pieces', { edges: [1], corners: [0] }),
  // Holding the cube: the three faces every picture shows, then the three it hides.
  picture('hold', {}),
  picture('hidden', {}, { turned: ['up', 'up', 'left'] }),
  // The six faces, in opposite pairs: the pieces of both faces are in colour.
  picture('up-down', { edges: [...TOP, ...BOTTOM], corners: ALL_CORNERS }),
  picture('right-left', { edges: [0, 4, 8, 11, 2, 6, 9, 10], corners: ALL_CORNERS }),
  picture('front-back', { edges: [1, 5, 8, 9, 3, 7, 10, 11], corners: ALL_CORNERS }),
  // Reading the moves.
  played('three-ways', "R R' R2"),
  played('right', 'R'),
  played('left', 'L'),
  played('down', 'D'),
  played('back', 'B'),
  // The layers.
  picture('first-layer', { edges: BOTTOM, corners: BOTTOM }),
  picture('two-layers', { edges: [...BOTTOM, ...MIDDLE], corners: BOTTOM }),
  // Following along.
  played('practice', Array(PRACTICE_ROUNDS).fill(PRACTICE_ROUND).join(' '), false),
]
