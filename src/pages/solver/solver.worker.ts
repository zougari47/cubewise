/** Runs the solvers off the main thread so the page never freezes. */
import type { MethodId } from '../../core/methods/index.ts'
import { METHOD_SOLVERS } from '../../core/methods/solvers.ts'
import { DEFAULT_ORIENTATION } from '../../core/cube/orientation.ts'
import type { Orientation } from '../../core/cube/orientation.ts'
import { prepareSolver, solve } from '../../core/cube/solver.ts'
import { stepsFromMoves } from '../../core/cube/steps.ts'
import type { Step } from '../../core/cube/steps.ts'
import type { CubieCube } from '../../core/cube/cubie.ts'

/** The short solution, or a method the user is learning. */
export type SolveMethod = 'short' | MethodId

/** A solution ready to play back. */
export interface SolvedSteps {
  method: SolveMethod
  /** How to hold the cube before the first step. */
  start: Orientation
  steps: Step[]
  /** For a method: each stage and how many of the steps belong to it. Empty for the short solution. */
  stages: { stage: string; count: number }[]
}

export type SolverRequest = { id: number; cube: CubieCube; method: SolveMethod } | { warmUp: true }
export type SolverResponse = { id: number; solved: SolvedSteps } | { id: number; error: string }

function solveWith(method: SolveMethod, cube: CubieCube): SolvedSteps {
  if (method === 'short') {
    return { method, start: DEFAULT_ORIENTATION, steps: stepsFromMoves(solve(cube)), stages: [] }
  }
  const { start, stages } = METHOD_SOLVERS[method](cube)
  return {
    method,
    start,
    steps: stages.flatMap((stage) => stage.steps),
    stages: stages.map(({ stage, steps }) => ({ stage, count: steps.length })),
  }
}

addEventListener('message', (event: MessageEvent<SolverRequest>) => {
  const request = event.data
  if ('warmUp' in request) {
    prepareSolver()
    return
  }
  let response: SolverResponse
  try {
    response = { id: request.id, solved: solveWith(request.method, request.cube) }
  } catch (error) {
    response = { id: request.id, error: error instanceof Error ? error.message : String(error) }
  }
  postMessage(response)
})
