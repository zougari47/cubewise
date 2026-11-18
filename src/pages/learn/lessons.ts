/**
 * What a lesson shows: its cases, the sequence for each, and which pieces of
 * the cube are coloured in the picture (the rest are greyed out so the eye
 * goes to what matters). The cases of each method are in `lessons/`.
 *
 * Lessons use the standard colours with white at the bottom.
 */
import { applyMoves, invertMoves, solvedCube } from '../../core/cube/cubie.ts'
import type { CubieCube } from '../../core/cube/cubie.ts'
import { DEFAULT_ORIENTATION, turnCube } from '../../core/cube/orientation.ts'
import type { Orientation, TurnDirection } from '../../core/cube/orientation.ts'
import type { Step } from '../../core/cube/steps.ts'
import { stickersFromCube, stickersOfPieces } from '../../core/cube/stickers.ts'
import type { Pieces } from '../../core/methods/shared/search.ts'
import { parseTurns, stepsFromTurns } from '../../core/methods/shared/turns.ts'
import { COLOUR_HEX } from '../solver/colours.ts'
import type { ColourKey } from '../solver/entry.ts'

export type { Pieces }

/** Centre colours in lessons, in U R F D L B order: yellow on top, white at the bottom. */
export const LESSON_SCHEME: ColourKey[] = ['Y', 'O', 'G', 'W', 'R', 'B']

const HIDDEN_HEX = '#a1a1aa'

export interface LessonCase {
  id: string
  /** The turns to play, in any notation `parseTurns` reads, or '' for a picture with nothing to do. */
  sequence: string
  /** The cube before the sequence, held with yellow on top and green in front. */
  start: CubieCube
  /** Pieces drawn in full colour. After the sequence they must all be home, unless `stopsShort`. */
  shown: Pieces
  /** The sequence is one step on the way: it does not bring the shown pieces home. */
  stopsShort?: boolean
  /** Pieces of which only the top-colour sticker is drawn. */
  topColourOnly?: Pieces
  /**
   * Draw the cube from another side: each entry brings the face on that side
   * to the front. The picture shows the top, front and right faces, so use
   * this when what matters is elsewhere.
   */
  turned?: readonly TurnDirection[]
}

/** Piece numbers by layer, with white at the bottom. */
export const TOP = [0, 1, 2, 3]
export const BOTTOM = [4, 5, 6, 7]
export const MIDDLE = [8, 9, 10, 11]

/** The steps that play a sequence, starting from the usual way of holding the cube. */
export function lessonSteps(sequence: string): Step[] {
  return stepsFromTurns(parseTurns(sequence)).steps
}

const movesOf = (sequence: string) => lessonSteps(sequence).flatMap((step) => step.moves)

/** The solved cube after `sequence`. */
export const after = (sequence: string) => applyMoves(solvedCube(), movesOf(sequence))

/** The cube that `sequence` solves. */
export const before = (sequence: string) =>
  applyMoves(solvedCube(), invertMoves(movesOf(sequence)))

/** A case whose picture starts from the cube that `sequence` solves. */
export function solvedBy(
  id: string,
  sequence: string,
  shown: Pieces,
  more: Pick<LessonCase, 'topColourOnly' | 'turned'> = {},
): LessonCase {
  return { id, sequence, start: before(sequence), shown, ...more }
}

/** How a lesson cube is held for its picture after the first `done` steps. */
export function lessonOrientation(
  lessonCase: LessonCase,
  steps: readonly Step[],
  done: number,
): Orientation {
  const held = steps[done - 1]?.orientation ?? DEFAULT_ORIENTATION
  return (lessonCase.turned ?? []).reduce(turnCube, held)
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
