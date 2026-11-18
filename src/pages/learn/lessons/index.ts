/** The lesson cases of every method, by stage. */
import type { MethodId } from '../../../core/methods/index.ts'
import type { LessonCase } from '../lessons.ts'
import { BEGINNER_LESSONS } from './beginner.ts'
import { KEYHOLE_LESSONS } from './keyhole.ts'

export const LESSONS: Record<MethodId, Record<string, LessonCase[]>> = {
  beginner: BEGINNER_LESSONS,
  keyhole: KEYHOLE_LESSONS,
}
