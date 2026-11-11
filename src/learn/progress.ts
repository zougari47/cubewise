/** Which lessons the user has marked as complete, kept on their device. */
import { useCallback, useEffect, useState } from 'react'
import { BEGINNER_STAGES } from '#/beginner/stages.ts'
import type { BeginnerStage } from '#/beginner/stages.ts'

const STORAGE_KEY = 'cubewise.lessons.v1'

function read(): BeginnerStage[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(saved)) return []
    return BEGINNER_STAGES.filter((stage) => saved.includes(stage))
  } catch {
    return []
  }
}

/**
 * Completed lessons. Empty until the page has loaded in the browser, so the
 * prerendered page and the first render agree.
 */
export function useLessonProgress() {
  const [completed, setCompleted] = useState<BeginnerStage[]>([])

  useEffect(() => setCompleted(read()), [])

  const setDone = useCallback((stage: BeginnerStage, done: boolean) => {
    const next = BEGINNER_STAGES.filter((s) => (s === stage ? done : read().includes(s)))
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage can be full or blocked; the lesson still works.
    }
    setCompleted(next)
  }, [])

  return { completed, setDone }
}
