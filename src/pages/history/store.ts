/**
 * Where the solve history is kept: the browser's local storage, and nowhere
 * else in the code. Nothing here throws: storage that is blocked or full
 * leaves the history as it was, and what is read goes through `parseHistory`.
 */
import { useSyncExternalStore } from 'react'
import { addSolve, historyText, parseHistory, removeSolve } from './history.ts'
import type { NewSolve, SavedSolve } from './history.ts'

const STORAGE_KEY = 'cubewise.history.v1'
const CHANGE_EVENT = 'cubewise-history-change'

const NONE: SavedSolve[] = []
/** The last text read and what it holds, so an unchanged history is the same list. */
let last: { text: string | null; solves: SavedSolve[] } = { text: null, solves: NONE }

function read(): SavedSolve[] {
  let text: string | null
  try {
    text = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Storage can be blocked; there is then no history.
    return NONE
  }
  if (text !== last.text) last = { text, solves: text === null ? NONE : parseHistory(text) }
  return last.solves
}

function write(solves: SavedSolve[]) {
  try {
    if (solves.length === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, historyText(solves))
  } catch {
    // Storage can be full or blocked; the solver still works without a history.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Keeps a solve that has just succeeded. */
export function saveSolve(solve: NewSolve): void {
  write(addSolve(read(), solve, Date.now()))
}

export function deleteSolve(id: string): void {
  write(removeSolve(read(), id))
}

export function clearHistory(): void {
  write([])
}

/** The saved solve with this id, if it is still in the history. */
export function findSolve(id: string): SavedSolve | undefined {
  return read().find((solve) => solve.id === id)
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

/**
 * The solve history, newest first, shared between tabs. It is `null` on the
 * server and while the prerendered page is being taken over, when it cannot
 * be known yet: show neither solves nor "no solves" until it is a list.
 */
export function useSolveHistory(): SavedSolve[] | null {
  return useSyncExternalStore<SavedSolve[] | null>(subscribe, read, () => null)
}
