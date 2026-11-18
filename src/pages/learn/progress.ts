/** Which lessons the user has marked as complete, kept on their device. */
import { useCallback, useEffect, useState } from 'react'
import { METHOD_IDS, stagesOf } from '#/core/methods/index.ts'
import type { MethodId } from '#/core/methods/index.ts'

const STORAGE_KEY = 'cubewise.lessons.v2'
/** Before there was more than one method: a plain list of beginner stages. */
const OLD_STORAGE_KEY = 'cubewise.lessons.v1'

/** The completed stages of each method. */
export type LessonProgress = Record<MethodId, string[]>

const EMPTY = Object.fromEntries(METHOD_IDS.map((method) => [method, []])) as unknown as LessonProgress

const parsed = (key: string): unknown => JSON.parse(localStorage.getItem(key) ?? 'null')

function read(): LessonProgress {
  try {
    const saved = parsed(STORAGE_KEY) ?? { beginner: parsed(OLD_STORAGE_KEY) }
    const byMethod = typeof saved === 'object' && saved !== null ? (saved as Record<string, unknown>) : {}
    return Object.fromEntries(
      METHOD_IDS.map((method) => {
        const stages = byMethod[method]
        return [method, stagesOf(method).filter((stage) => Array.isArray(stages) && stages.includes(stage))]
      }),
    ) as LessonProgress
  } catch {
    return EMPTY
  }
}

/**
 * Completed lessons. Empty until the page has loaded in the browser, so the
 * prerendered page and the first render agree.
 */
export function useLessonProgress() {
  const [completed, setCompleted] = useState<LessonProgress>(EMPTY)

  useEffect(() => setCompleted(read()), [])

  const setDone = useCallback((method: MethodId, stage: string, done: boolean) => {
    const now = read()
    const next = {
      ...now,
      [method]: stagesOf(method).filter((s) => (s === stage ? done : now[method].includes(s))),
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage can be full or blocked; the lesson still works.
    }
    setCompleted(next)
  }, [])

  return { completed, setDone }
}
