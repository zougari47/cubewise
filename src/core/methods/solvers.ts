/** The solver of every method. Only the solver worker should import this. */
import { solveBeginner } from './beginner/solver.ts'
import { solveKeyhole } from './keyhole/solver.ts'
import { solveCfop } from './cfop/solver.ts'
import { solveRoux } from './roux/solver.ts'
import type { MethodId } from './index.ts'
import type { MethodSolver } from './shared/method.ts'

export const METHOD_SOLVERS: Record<MethodId, MethodSolver> = {
  beginner: solveBeginner,
  keyhole: solveKeyhole,
  cfop: solveCfop,
  roux: solveRoux,
}
