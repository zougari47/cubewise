/**
 * A solution as the user performs it: face moves, wide and slice turns, and
 * sometimes turning the whole cube to look at it from another side.
 */
import { applyMove, formatMoves } from './cubie.ts'
import type { CubieCube, Move } from './cubie.ts'
import { DEFAULT_ORIENTATION } from './orientation.ts'
import type { Orientation } from './orientation.ts'

/** The layers a wide or slice turn moves, for drawing it. */
export interface LayerTurn {
  /** The face whose axis the layers turn about, and how far, on the cube as entered. */
  move: Move
  /** Which layers turn, counted from that face: 1 is the face itself, 0 the middle layer. */
  layers: readonly number[]
}

export interface Step {
  /** What the user reads: `R`, `U2`, `F'`, `r`, `M'`, or `x` `y` `z` for turning the whole cube. */
  text: string
  /**
   * What the step does to the pieces, as moves on the cube as entered. One
   * for a face move; none for a whole-cube turn. A wide or slice turn also
   * changes how the cube is held, so it comes out as moves of the outer faces.
   */
  moves: readonly Move[]
  /** For a wide or slice turn: the layers the user actually turns. */
  layers?: LayerTurn
  /** How the cube is held after this step. */
  orientation: Orientation
}

/** Plain moves, with the cube held the same way throughout. */
export function stepsFromMoves(
  moves: readonly Move[],
  orientation: Orientation = DEFAULT_ORIENTATION,
): Step[] {
  return moves.map((move) => ({ text: formatMoves([move]), moves: [move], orientation }))
}

/** Whether the step only turns the whole cube, moving no piece. */
export const isWholeCubeTurn = (step: Step) => step.moves.length === 0

/** The cube after the first `count` steps. */
export function cubeAfterSteps(cube: CubieCube, steps: readonly Step[], count: number): CubieCube {
  let result = cube
  for (let i = 0; i < count; i++) {
    for (const move of steps[i].moves) result = applyMove(result, move)
  }
  return result
}
