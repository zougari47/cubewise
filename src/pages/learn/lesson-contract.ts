/**
 * The tests every method's lessons must pass. A method's own test file calls
 * `describeLessons` with its stages, cases and text.
 */
import { describe, expect, test } from 'vitest'
import { cubeAfterSteps } from '../../core/cube/steps.ts'
import { areSolved } from '../../core/methods/shared/search.ts'
import type { MethodText } from '../../i18n/method-text.ts'
import { lessonSteps } from './lessons.ts'
import type { LessonCase } from './lessons.ts'

export function describeLessons<Stage extends string>(
  name: string,
  stages: readonly Stage[],
  lessons: Record<Stage, LessonCase[]>,
  text: MethodText<Stage>,
): void {
  describe(`${name} lessons`, () => {
    test('every stage has a name, a lesson and at least one case', () => {
      expect(Object.keys(lessons).sort()).toEqual([...stages].sort())
      expect(Object.keys(text.stages).sort()).toEqual([...stages].sort())
      expect(Object.keys(text.lessons).sort()).toEqual([...stages].sort())
      for (const stage of stages) expect(lessons[stage].length, stage).toBeGreaterThan(0)
    })

    test('stage names do not mention a colour', () => {
      for (const stage of stages) {
        expect(text.stages[stage].name, stage).not.toMatch(/white|yellow|red|orange|blue|green/i)
      }
    })

    test('every case has a title and a description, and no text is left over', () => {
      for (const stage of stages) {
        expect(Object.keys(text.lessons[stage].cases).sort(), stage).toEqual(
          lessons[stage].map((lessonCase) => lessonCase.id).sort(),
        )
      }
    })

    test('every sequence brings home the pieces its picture shows', () => {
      for (const stage of stages) {
        for (const lessonCase of lessons[stage]) {
          if (lessonCase.sequence === '') continue
          const steps = lessonSteps(lessonCase.sequence)
          const end = cubeAfterSteps(lessonCase.start, steps, steps.length)
          expect(areSolved(end, lessonCase.shown), `${stage} / ${lessonCase.id}`).toBe(true)
        }
      }
    })
  })
}
