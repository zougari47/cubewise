/** Runs the solvers off the main thread so the page never freezes. */
import { solveBeginner } from '../beginner/solver.ts'
import type { BeginnerStage } from '../beginner/stages.ts'
import { DEFAULT_ORIENTATION } from '../cube/orientation.ts'
import type { Orientation } from '../cube/orientation.ts'
import { prepareSolver, solve } from '../cube/solver.ts'
import { stepsFromMoves } from '../cube/steps.ts'
import type { Step } from '../cube/steps.ts'
import type { CubieCube } from '../cube/cubie.ts'

export type SolveMethod = 'short' | 'beginner'

/** A solution ready to play back. */
export interface SolvedSteps {
  /** How to hold the cube before the first step. */
  start: Orientation
  steps: Step[]
  /** For the beginner method: each stage and how many of the steps belong to it. */
  stages: { stage: BeginnerStage; count: number }[]
}

export type SolverRequest = { id: number; cube: CubieCube; method: SolveMethod } | { warmUp: true }
export type SolverResponse = { id: number; solved: SolvedSteps } | { id: number; error: string }

function solveWith(method: SolveMethod, cube: CubieCube): SolvedSteps {
  if (method === 'short') {
    return { start: DEFAULT_ORIENTATION, steps: stepsFromMoves(solve(cube)), stages: [] }
  }
  const { start, stages } = solveBeginner(cube)
  return {
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
