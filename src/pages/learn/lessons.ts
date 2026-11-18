/**
 * What each lesson shows: its cases, the sequence for each, and which pieces
 * of the cube are coloured in the picture (the rest are greyed out so the eye
 * goes to what matters).
 *
 * Lessons use the standard colours with the first layer (white) at the bottom.
 */
import { SEQUENCES as A } from '../../core/methods/beginner/sequences.ts'
import type { BeginnerStage } from '../../core/methods/beginner/stages.ts'
import { applyMoves, invertMoves, parseMoves, solvedCube } from '../../core/cube/cubie.ts'
import type { CubieCube } from '../../core/cube/cubie.ts'
import { stickersFromCube, stickersOfPieces } from '../../core/cube/stickers.ts'
import { COLOUR_HEX } from '../solver/colours.ts'
import type { ColourKey } from '../solver/entry.ts'

/** Centre colours in lessons, in U R F D L B order: yellow on top, white at the bottom. */
export const LESSON_SCHEME: ColourKey[] = ['Y', 'O', 'G', 'W', 'R', 'B']

const HIDDEN_HEX = '#a1a1aa'

interface Pieces {
  corners?: number[]
  edges?: number[]
}

export interface LessonCase {
  id: string
  /** The moves to play, or '' for a picture with nothing to do. */
  sequence: string
  /** The cube before the sequence. */
  start: CubieCube
  /** Pieces drawn in full colour. */
  shown: Pieces
  /** Pieces of which only the top-colour sticker is drawn. */
  topColourOnly?: Pieces
  /** Draw the cube turned over, to show its bottom. */
  fromBelow?: boolean
}

const TOP = [0, 1, 2, 3]
const BOTTOM = [4, 5, 6, 7]
const MIDDLE = [8, 9, 10, 11]

const FIRST_LAYER: Pieces = { edges: BOTTOM, corners: BOTTOM }
const TWO_LAYERS: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: BOTTOM }
const WHOLE_CUBE: Pieces = { edges: [...TOP, ...BOTTOM, ...MIDDLE], corners: [...TOP, ...BOTTOM] }

const after = (moves: string) => applyMoves(solvedCube(), parseMoves(moves))
/** The cube that `sequence` solves. */
const before = (sequence: string) => applyMoves(solvedCube(), invertMoves(parseMoves(sequence)))

function solvedBy(id: string, sequence: string, shown: Pieces, topColourOnly?: Pieces): LessonCase {
  return { id, sequence, start: before(sequence), shown, topColourOnly }
}

const X = A.lastLayerCross
const TWIST = `${A.lastLayerCornerTwist} ${A.lastLayerCornerTwist}`

export const LESSON_CASES: Record<BeginnerStage, LessonCase[]> = {
  cross: [
    { id: 'daisy', sequence: '', start: after('F2 R2 B2 L2'), shown: { edges: BOTTOM } },
    solvedBy('petal', 'F2', { edges: BOTTOM }),
    { id: 'done', sequence: '', start: solvedCube(), shown: { edges: BOTTOM }, fromBelow: true },
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
    solvedBy('dot', `${X} U2 ${X} ${X}`, TWO_LAYERS, { edges: TOP }),
    solvedBy('corner', `${X} ${X}`, TWO_LAYERS, { edges: TOP }),
    solvedBy('line', X, TWO_LAYERS, { edges: TOP }),
  ],
  'last-layer-edges': [
    solvedBy('swap', `${A.lastLayerEdges} U`, { ...TWO_LAYERS, edges: [...TOP, ...BOTTOM, ...MIDDLE] }),
  ],
  'last-layer-corner-positions': [solvedBy('cycle', A.lastLayerCornerCycle, WHOLE_CUBE)],
  'last-layer-corner-twists': [
    solvedBy('twist', `${TWIST} U ${TWIST} ${TWIST} U'`, WHOLE_CUBE),
  ],
}

/** Screen colour of each of the 54 stickers for a lesson cube. */
export function lessonColours(cube: CubieCube, lessonCase: LessonCase): string[] {
  const full = new Set(stickersOfPieces(cube, lessonCase.shown))
  const topOnly = new Set(stickersOfPieces(cube, lessonCase.topColourOnly ?? {}))
  return stickersFromCube(cube).map((face, sticker) => {
    const isCentre = sticker % 9 === 4
    const visible = isCentre || full.has(sticker) || (topOnly.has(sticker) && face === 0)
    return visible ? COLOUR_HEX[LESSON_SCHEME[face]] : HIDDEN_HEX
  })
}
