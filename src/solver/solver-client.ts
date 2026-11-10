/** The page's side of the solver worker. Browser only. */
import type { CubieCube, Move } from '../cube/cubie.ts'
import type { SolverRequest, SolverResponse } from './solver.worker.ts'

let worker: Worker | null = null
let nextId = 1
const waiting = new Map<number, { resolve: (moves: Move[]) => void; reject: (error: Error) => void }>()

function getWorker(): Worker {
  if (worker) return worker
  worker = new Worker(new URL('./solver.worker.ts', import.meta.url), { type: 'module' })
  worker.addEventListener('message', (event: MessageEvent<SolverResponse>) => {
    const response = event.data
    const request = waiting.get(response.id)
    if (!request) return
    waiting.delete(response.id)
    if ('error' in response) request.reject(new Error(response.error))
    else request.resolve(response.moves)
  })
  worker.addEventListener('error', (event) => {
    for (const request of waiting.values()) request.reject(new Error(event.message))
    waiting.clear()
    worker = null
  })
  return worker
}

/** Starts the worker and builds its tables, so the first solve does not wait for them. */
export function warmUpSolver(): void {
  getWorker().postMessage({ warmUp: true } satisfies SolverRequest)
}

/** The short solution for a solvable cube. */
export function solveShort(cube: CubieCube): Promise<Move[]> {
  return new Promise((resolve, reject) => {
    const id = nextId++
    waiting.set(id, { resolve, reject })
    getWorker().postMessage({ id, cube } satisfies SolverRequest)
  })
}
