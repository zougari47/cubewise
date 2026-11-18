/**
 * A solution as the user performs it: face moves, and sometimes turning the
 * whole cube to look at it from another side.
 */
import { applyMove, formatMoves } from './cubie.ts'
import type { CubieCube, Move } from './cubie.ts'
import { DEFAULT_ORIENTATION } from './orientation.ts'
import type { Orientation } from './orientation.ts'

export interface Step {
  /** What the user reads: `R`, `U2`, `F'`, or `y` for turning the whole cube. */
  text: string
  /** The move to make on the cube as it was entered; absent when the whole cube is turned. */
  move?: Move
  /** How the cube is held after this step. */
  orientation: Orientation
}

/** Plain moves, with the cube held the same way throughout. */
export function stepsFromMoves(
  moves: readonly Move[],
  orientation: Orientation = DEFAULT_ORIENTATION,
): Step[] {
  return moves.map((move) => ({ text: formatMoves([move]), move, orientation }))
}

/** The cube after the first `count` steps. */
export function cubeAfterSteps(cube: CubieCube, steps: readonly Step[], count: number): CubieCube {
  let result = cube
  for (let i = 0; i < count; i++) {
    const move = steps[i].move
    if (move !== undefined) result = applyMove(result, move)
  }
  return result
}
