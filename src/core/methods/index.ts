/**
 * The methods the site teaches and solves with, and the stages of each.
 * Solvers are kept out of this file (see `solvers.ts`) so that pages which
 * only list stages do not download them.
 */
import { BEGINNER_STAGES } from './beginner/stages.ts'
import { KEYHOLE_STAGES } from './keyhole/stages.ts'

/** Every method, in the order they are offered. */
export const METHOD_STAGES = {
  beginner: BEGINNER_STAGES,
  keyhole: KEYHOLE_STAGES,
} as const satisfies Record<string, readonly string[]>

export type MethodId = keyof typeof METHOD_STAGES

export const METHOD_IDS = Object.keys(METHOD_STAGES) as MethodId[]

export const isMethodId = (value: string): value is MethodId => value in METHOD_STAGES

/** The stages of a method, in the order they are solved. */
export const stagesOf = (method: MethodId): readonly string[] => METHOD_STAGES[method]
