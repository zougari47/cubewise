/**
 * What every method solver returns, and the bookkeeping they all share:
 * turning each stage's turns into the steps the user follows.
 */
import { findUnsolvableReason, isSolved } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import type { Orientation } from '../../cube/orientation.ts'
import { cubeAfterSteps } from '../../cube/steps.ts'
import type { Step } from '../../cube/steps.ts'
import { applyTurns, stepsFromTurns, tidy, viewOf } from './turns.ts'
import type { Turn } from './turns.ts'

export interface StageSolution<Stage extends string = string> {
  stage: Stage
  steps: Step[]
}

/** A solution that follows a method, stage by stage. */
export interface MethodSolution<Stage extends string = string> {
  /** How to hold the cube before the first step. */
  start: Orientation
  /** One entry per stage, in order; a stage that is already done has no steps. */
  stages: StageSolution<Stage>[]
}

/** Solves a cube with one method. Throws if the cube is not solvable. */
export type MethodSolver<Stage extends string = string> = (cube: CubieCube) => MethodSolution<Stage>

/** Works out the turns of one stage from the view the stage starts with. */
export type StageSolver = (view: CubieCube) => Turn[]

/**
 * Solves `cube` held in `start` by running each stage's solver in order.
 * Throws if the cube is not solvable, or if the stages do not solve it.
 */
export function solveInStages<Stage extends string>(
  cube: CubieCube,
  start: Orientation,
  stages: readonly Stage[],
  solvers: Record<Stage, StageSolver>,
): MethodSolution<Stage> {
  const reason = findUnsolvableReason(cube)
  if (reason !== null) throw new Error(`Cube is not solvable: ${reason}`)

  let view = viewOf(cube, start)
  let orientation = start
  const solved: StageSolution<Stage>[] = []
  for (const stage of stages) {
    const turns = tidy(solvers[stage](view))
    const result = stepsFromTurns(turns, orientation)
    view = applyTurns(view, turns)
    orientation = result.orientation
    solved.push({ stage, steps: result.steps })
  }

  const steps = solved.flatMap((stage) => stage.steps)
  if (!isSolved(cubeAfterSteps(cube, steps, steps.length))) {
    throw new Error('The stages did not solve the cube')
  }
  return { start, stages: solved }
}

/** How many steps of a solution move pieces; whole-cube turns are not counted. */
export function countMoves(solution: MethodSolution): number {
  return solution.stages.reduce(
    (sum, stage) => sum + stage.steps.filter((step) => step.moves.length > 0).length,
    0,
  )
}

/** The solution with the fewest moves among those the given starts lead to. */
export function shortestOf<Stage extends string>(solutions: MethodSolution<Stage>[]): MethodSolution<Stage> {
  return solutions.reduce((best, next) => (countMoves(next) < countMoves(best) ? next : best))
}
