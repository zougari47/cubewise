/**
 * The solve history: the cubes the user has solved on the solver page, newest
 * first. Pure rules only: what a saved solve holds, how one is added or
 * removed, and how the list is read back from text that may be damaged or
 * left by an older version. `store.ts` keeps the list in the browser.
 */
import { isMethodId, stagesOf } from '../../core/methods/index.ts'
import { stickersFromText } from '../solver/entry.ts'
import type { SolveMethod } from '../solver/solver.worker.ts'

/** How many solves are kept; beyond this the oldest are dropped. */
export const HISTORY_LIMIT = 200

/** A stage of a method solution and how many of its steps belong to it. */
export interface SolveStage {
  stage: string
  count: number
}

/** What the solver hands over when a solve succeeds. */
export interface NewSolve {
  /** The cube as entered, as `stickersText` writes it: one group of colour keys per face, U R F D L B. */
  stickers: string
  method: SolveMethod
  /** Every step in notation, separated by spaces, with the whole-cube turns among them. */
  solution: string
  /** For a method solution, its stages in order; empty for the short solution. */
  stages: SolveStage[]
}

/** One solve as it is kept. */
export interface SavedSolve extends NewSolve {
  /** Names the solve in an address; it stays the same when the cube is solved again. */
  id: string
  /** When it was last solved, in milliseconds since 1970. */
  solvedAt: number
}

const sameSolve = (a: NewSolve, b: NewSolve) => a.stickers === b.stickers && a.method === b.method

/** An id no solve in the list has, made from the time. */
function newId(solves: readonly SavedSolve[], now: number): string {
  let number = Math.max(0, Math.floor(now))
  while (solves.some((solve) => solve.id === number.toString(36))) number++
  return number.toString(36)
}

/**
 * The history after a solve. A cube solved again with the same method moves
 * to the top with the new time instead of appearing twice, and a cube that
 * needed no step is not kept.
 */
export function addSolve(solves: readonly SavedSolve[], solve: NewSolve, now: number): SavedSolve[] {
  if (solve.solution.trim() === '') return solves.slice()
  const before = solves.find((saved) => sameSolve(saved, solve))
  const saved: SavedSolve = {
    id: before?.id ?? newId(solves, now),
    stickers: solve.stickers,
    method: solve.method,
    solution: solve.solution,
    stages: solve.stages.map(({ stage, count }) => ({ stage, count })),
    solvedAt: now,
  }
  return [saved, ...solves.filter((other) => other !== before)].slice(0, HISTORY_LIMIT)
}

export function removeSolve(solves: readonly SavedSolve[], id: string): SavedSolve[] {
  return solves.filter((solve) => solve.id !== id)
}

/** The steps of a solve, in notation. */
export const solveSteps = (solve: NewSolve): string[] => solve.solution.split(' ').filter(Boolean)

/** Whether a step in notation turns the whole cube, which is not a move. */
export const isWholeCubeTurnText = (step: string) => /^[xyz]/.test(step)

/** How many moves the solution has: its steps without the whole-cube turns. */
export const moveCount = (solve: NewSolve): number =>
  solveSteps(solve).filter((step) => !isWholeCubeTurnText(step)).length

/**
 * The solution in the groups it is shown in: one per stage for a method
 * solution, and a single group without a stage for the short solution.
 */
export function stepsByStage(solve: NewSolve): { stage: string | null; steps: string[] }[] {
  const steps = solveSteps(solve)
  if (solve.stages.length === 0) return [{ stage: null, steps }]
  let from = 0
  return solve.stages.map(({ stage, count }) => {
    const group = { stage, steps: steps.slice(from, from + count) }
    from += count
    return group
  })
}

/** The solution as text to copy: one line, or one line per stage that has steps. */
export function solutionText(solve: NewSolve, stageName: (stage: string) => string): string {
  return stepsByStage(solve)
    .filter((group) => group.steps.length > 0)
    .map(({ stage, steps }) => (stage === null ? steps.join(' ') : `${stageName(stage)}: ${steps.join(' ')}`))
    .join('\n')
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0

/** The stages as saved, when they are still the stages of the method and account for every step. */
function savedStages(value: unknown, method: SolveMethod, stepCount: number): SolveStage[] | null {
  if (method === 'short' || !Array.isArray(value)) return null
  const known = stagesOf(method)
  const stages: SolveStage[] = []
  for (const item of value) {
    if (!isRecord(item) || typeof item.stage !== 'string' || !isCount(item.count)) return null
    if (!known.includes(item.stage) || stages.some((stage) => stage.stage === item.stage)) return null
    stages.push({ stage: item.stage, count: item.count })
  }
  const total = stages.reduce((sum, stage) => sum + stage.count, 0)
  return total === stepCount ? stages : null
}

/** One saved solve, or `null` when the value is not a usable one. */
function savedSolve(value: unknown): SavedSolve | null {
  if (!isRecord(value)) return null
  const { id, stickers, method, solution, stages, solvedAt } = value
  if (typeof id !== 'string' || id === '') return null
  // A solved cube is a painted one: every sticker has a colour.
  if (typeof stickers !== 'string' || stickersFromText(stickers)?.includes(null) !== false) return null
  if (typeof method !== 'string' || !(method === 'short' || isMethodId(method))) return null
  if (typeof solution !== 'string') return null
  if (typeof solvedAt !== 'number' || !Number.isFinite(solvedAt)) return null
  const steps = solveSteps({ stickers, method, solution, stages: [] })
  if (steps.length === 0) return null
  return {
    id,
    stickers,
    method,
    solution: steps.join(' '),
    // A solve whose stages cannot be trusted is still shown, as a plain list of steps.
    stages: savedStages(stages, method, steps.length) ?? [],
    solvedAt,
  }
}

/**
 * The history read back from storage. It never fails: text that is not a
 * list gives an empty history, and anything in the list that is not a usable
 * solve, or repeats an earlier one, is left out.
 */
export function parseHistory(text: string | null): SavedSolve[] {
  let value: unknown
  try {
    value = JSON.parse(text ?? 'null')
  } catch {
    return []
  }
  if (!Array.isArray(value)) return []
  const solves: SavedSolve[] = []
  for (const item of value) {
    const solve = savedSolve(item)
    if (!solve) continue
    if (solves.some((other) => other.id === solve.id || sameSolve(other, solve))) continue
    solves.push(solve)
    if (solves.length === HISTORY_LIMIT) break
  }
  return solves
}

export const historyText = (solves: readonly SavedSolve[]): string => JSON.stringify(solves)

const AGO_UNITS = [
  ['year', 365 * 24 * 60 * 60_000],
  ['month', 30 * 24 * 60 * 60_000],
  ['day', 24 * 60 * 60_000],
  ['hour', 60 * 60_000],
  ['minute', 60_000],
] as const

/**
 * How long ago a time was, in the largest unit that fits, as
 * `Intl.RelativeTimeFormat` takes it: `{ value: -2, unit: 'hour' }`.
 * Under a minute, and a time ahead of the clock, count as now.
 */
export function timeAgo(then: number, now: number): { value: number; unit: Intl.RelativeTimeFormatUnit } {
  const passed = Math.max(0, now - then)
  for (const [unit, length] of AGO_UNITS) {
    if (passed >= length) return { value: -Math.floor(passed / length), unit }
  }
  return { value: 0, unit: 'second' }
}
