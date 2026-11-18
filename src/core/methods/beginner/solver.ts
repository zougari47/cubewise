/**
 * Beginner-method solver: solves a cube the way the lessons teach it, stage
 * by stage, using only the sequences in `sequences.ts`.
 *
 * The first layer is built on the face the user entered as the top one, so
 * the cube is first turned over to put that face at the bottom.
 */
import { isSolved } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { DEFAULT_ORIENTATION, turnCubeAbout } from '../../cube/orientation.ts'
import { solveInStages } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { blockSolver, countSolved } from '../shared/search.ts'
import { U_TURNS, Y_TURNS, applyTurns, parseTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { SEQUENCES } from './sequences.ts'
import { BEGINNER_STAGES } from './stages.ts'
import type { BeginnerStage } from './stages.ts'

export type BeginnerSolution = MethodSolution<BeginnerStage>

/** The entered top face goes to the bottom; the front stays at the front. */
const START = turnCubeAbout(DEFAULT_ORIENTATION, 'z', 2)

const repeated = (turns: Turn[], times: number) => Array.from({ length: times }, () => turns).flat()

// --- What "done" means for each part of the cube

const TOP = [0, 1, 2, 3]
const BOTTOM = [4, 5, 6, 7]
const MIDDLE = [8, 9, 10, 11]

const crossDone = (cube: CubieCube) => countSolved(cube, { edges: BOTTOM }) === 4
const firstLayerDone = (cube: CubieCube) => crossDone(cube) && countSolved(cube, { corners: BOTTOM }) === 4
const twoLayersDone = (cube: CubieCube) => firstLayerDone(cube) && countSolved(cube, { edges: MIDDLE }) === 4
const topCrossDone = (cube: CubieCube) => twoLayersDone(cube) && TOP.every((i) => cube.eo[i] === 0)
const topEdgesDone = (cube: CubieCube) => twoLayersDone(cube) && countSolved(cube, { edges: TOP }) === 4
const topCornersPlaced = (cube: CubieCube) => topEdgesDone(cube) && TOP.every((i) => cube.cp[i] === i)

// --- Stage 1: the cross, in the fewest moves

const solveCross = blockSolver({ pieces: { edges: BOTTOM } })

// --- Stages 2 and 3: one piece at a time

/**
 * Solves one more piece. Each attempt is what a beginner does: turn the cube
 * to face a slot, turn the top to line a piece up, then do one sequence. When
 * every piece left is stuck in a wrong slot, a first attempt takes one out
 * and a second puts it in.
 */
function solveNextPiece(
  view: CubieCube,
  sequences: Turn[][],
  score: (cube: CubieCube) => number,
): Turn[] {
  const target = score(view) + 1
  const endings = U_TURNS.flatMap((turn) => sequences.map((sequence) => [...turn, ...sequence]))

  /** Every attempt from `cube` with what it leads to, shortest first. */
  const attemptsFrom = (cube: CubieCube) =>
    Y_TURNS.flatMap((rotation) => {
      const turned = applyTurns(cube, rotation)
      return endings.map((ending) => ({
        turns: [...rotation, ...ending],
        result: applyTurns(turned, ending),
      }))
    }).sort((a, b) => a.turns.length - b.turns.length)

  const firsts = attemptsFrom(view)
  const direct = firsts.find((attempt) => score(attempt.result) >= target)
  if (direct) return direct.turns

  let best: Turn[] | null = null
  for (const first of firsts) {
    if (best && first.turns.length >= best.length) break
    const second = attemptsFrom(first.result).find((attempt) => score(attempt.result) >= target)
    if (second && (!best || first.turns.length + second.turns.length < best.length)) {
      best = [...first.turns, ...second.turns]
    }
  }
  if (!best) throw new Error('Beginner solver could not place the next piece')
  return best
}

// --- Stages 4 to 6: repeat one sequence, adjusting in between

/** The shortest mix of adjustments and one sequence that reaches the goal. */
function solveBySequence(
  view: CubieCube,
  adjustments: Turn[][],
  sequence: Turn[],
  done: (cube: CubieCube) => boolean,
): Turn[] {
  const search = (cube: CubieCube, left: number, adjusted: boolean): Turn[] | null => {
    if (done(cube)) return []
    if (left === 0) return null
    const rest = search(applyTurns(cube, sequence), left - 1, false)
    if (rest) return [...sequence, ...rest]
    if (adjusted) return null
    for (const adjustment of adjustments) {
      if (adjustment.length === 0) continue
      const after = search(applyTurns(cube, adjustment), left - 1, true)
      if (after) return [...adjustment, ...after]
    }
    return null
  }
  for (let limit = 0; limit <= 8; limit++) {
    const found = search(view, limit, false)
    if (found) return found
  }
  throw new Error('Beginner solver could not finish a last-layer stage')
}

// --- Stage 7: twist the last corners

function solveCornerTwists(view: CubieCube): Turn[] {
  const twist = repeated(parseTurns(SEQUENCES.lastLayerCornerTwist), 2)
  const turns: Turn[] = []
  let cube = view
  const act = (more: Turn[]) => {
    turns.push(...more)
    cube = applyTurns(cube, more)
  }
  for (let guard = 0; guard < 8 && TOP.some((i) => cube.co[i] !== 0); guard++) {
    const turn = U_TURNS.find((candidate) => applyTurns(cube, candidate).co[0] !== 0)
    if (!turn) throw new Error('Beginner solver lost track of a twisted corner')
    act(turn)
    while (cube.co[0] !== 0) act(twist)
  }
  const last = U_TURNS.find((candidate) => isSolved(applyTurns(cube, candidate)))
  if (!last) throw new Error('Beginner solver could not finish the cube')
  act(last)
  return turns
}

// --- Putting the stages together

/** Keeps solving the next piece until `done`. */
function untilDone(
  view: CubieCube,
  done: (cube: CubieCube) => boolean,
  next: (cube: CubieCube) => Turn[],
): Turn[] {
  const turns: Turn[] = []
  let current = view
  for (let guard = 0; guard < 12 && !done(current); guard++) {
    const more = next(current)
    turns.push(...more)
    current = applyTurns(current, more)
  }
  return turns
}

const sequence = (name: keyof typeof SEQUENCES) => parseTurns(SEQUENCES[name])
const CORNER_SEQUENCES = [
  sequence('cornerFacingRight'),
  sequence('cornerFacingFront'),
  [...sequence('cornerFacingUp'), ...sequence('cornerFacingRight')],
]
const EDGE_SEQUENCES = [sequence('edgeToRight'), sequence('edgeToLeft')]

/**
 * Solves `cube` with the beginner method. Throws if the cube is not solvable.
 */
export function solveBeginner(cube: CubieCube): BeginnerSolution {
  return solveInStages(cube, START, BEGINNER_STAGES, {
    cross: (view) => {
      const turns = solveCross(view)
      if (!turns) throw new Error('Beginner solver could not make the cross')
      return turns
    },
    'first-layer-corners': (view) =>
      untilDone(view, firstLayerDone, (current) =>
        solveNextPiece(current, CORNER_SEQUENCES, (c) =>
          crossDone(c) ? countSolved(c, { corners: BOTTOM }) : -1,
        ),
      ),
    'middle-layer-edges': (view) =>
      untilDone(view, twoLayersDone, (current) =>
        solveNextPiece(current, EDGE_SEQUENCES, (c) =>
          firstLayerDone(c) ? countSolved(c, { edges: MIDDLE }) : -1,
        ),
      ),
    'last-layer-cross': (view) =>
      solveBySequence(view, U_TURNS, sequence('lastLayerCross'), topCrossDone),
    'last-layer-edges': (view) =>
      solveBySequence(view, U_TURNS, sequence('lastLayerEdges'), topEdgesDone),
    'last-layer-corner-positions': (view) =>
      solveBySequence(view, Y_TURNS, sequence('lastLayerCornerCycle'), topCornersPlaced),
    'last-layer-corner-twists': solveCornerTwists,
  })
}
