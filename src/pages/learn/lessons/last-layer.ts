/**
 * Lesson cases for the last-layer finish that several methods share: one case
 * per sequence in `core/methods/shared/last-layer.ts`, with the same ids.
 * Their text is in `i18n/<language>/last-layer.ts`.
 */
import { CORNER_ORIENTATIONS, PERMUTATIONS } from '../../../core/methods/shared/last-layer.ts'
import { BOTTOM, MIDDLE, TOP, solvedBy } from '../lessons.ts'
import type { LessonCase, Pieces } from '../lessons.ts'

const LOWER_LAYERS: Pieces = { edges: [...BOTTOM, ...MIDDLE], corners: BOTTOM }
const WHOLE_CUBE: Pieces = { edges: [...TOP, ...BOTTOM, ...MIDDLE], corners: [...TOP, ...BOTTOM] }

/** Turning the last-layer corners to face up: only the top colour is drawn on the last layer. */
export const CORNER_ORIENTATION_CASES: LessonCase[] = Object.entries(CORNER_ORIENTATIONS).map(
  ([id, sequence]) =>
    solvedBy(id, sequence, LOWER_LAYERS, { topColourOnly: { edges: TOP, corners: TOP } }),
)

/** Moving the last-layer pieces home. */
export const PERMUTATION_CASES: LessonCase[] = Object.entries(PERMUTATIONS).map(([id, sequence]) =>
  solvedBy(id, sequence, WHOLE_CUBE),
)
