/** Runs the short-solution solver off the main thread so the page never freezes. */
import { prepareSolver, solve } from '../cube/solver.ts'
import type { CubieCube, Move } from '../cube/cubie.ts'

export type SolverRequest = { id: number; cube: CubieCube } | { warmUp: true }
export type SolverResponse = { id: number; moves: Move[] } | { id: number; error: string }

addEventListener('message', (event: MessageEvent<SolverRequest>) => {
  const request = event.data
  if ('warmUp' in request) {
    prepareSolver()
    return
  }
  let response: SolverResponse
  try {
    response = { id: request.id, moves: solve(request.cube) }
  } catch (error) {
    response = { id: request.id, error: error instanceof Error ? error.message : String(error) }
  }
  postMessage(response)
})
