/** Which text file under `src/i18n/<language>/` a page takes its words from: a lesson, or a page with a text file of its own. */
import { METHOD_IDS } from '../../core/methods/index.ts'
import type { MethodId } from '../../core/methods/index.ts'
import type { Messages } from '../../i18n/en.ts'

/** The name of a text file: a method's id, or a page with a text file of its own. */
export type TextName = MethodId | 'before-you-start' | 'solver-about'

/**
 * The method whose text file holds a lesson. It is the lesson's own method,
 * unless that method takes the lesson whole from an earlier one, as keyhole
 * takes its last-layer lessons from the beginner method. `methods` is the text
 * of every method in any one language: they all share lessons the same way.
 */
export function lessonTextMethod(
  methods: Messages['methods'],
  method: MethodId,
  stage: string,
): MethodId {
  const lessons = (id: MethodId): Record<string, unknown> => methods[id].lessons
  const lesson = lessons(method)[stage]
  return METHOD_IDS.find((id) => lessons(id)[stage] === lesson) ?? method
}
