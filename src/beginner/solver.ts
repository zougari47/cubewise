/**
 * Beginner-method solver: solves a cube the way the lessons teach it, stage
 * by stage, using only the sequences in `sequences.ts`.
 *
 * The first layer is built on the face the user entered as the top one, so
 * the cube is first turned over to put that face at the bottom. While
 * solving, the cube is described as the user sees it ("the view"), which
 * changes whenever the whole cube is turned.
 */
import { MOVE_CUBES, applyMove, findUnsolvableReason, isSolved, parseMoves } from '../cube/cubie.ts'
import type { CubieCube, Move } from '../cube/cubie.ts'
import { DEFAULT_ORIENTATION, cubeFaceSeenAs, rotateStickers, turnCube } from '../cube/orientation.ts'
import type { Orientation } from '../cube/orientation.ts'
import { cubeFromStickers, stickersFromCube } from '../cube/stickers.ts'
import { cubeAfterSteps } from '../cube/steps.ts'
import type { Step } from '../cube/steps.ts'
import { SEQUENCES } from './sequences.ts'
import { BEGINNER_STAGES } from './stages.ts'
import type { BeginnerStage } from './stages.ts'

export interface StageSolution {
  stage: BeginnerStage
  steps: Step[]
}

export interface BeginnerSolution {
  /** How to hold the cube before the first step. */
  start: Orientation
  /** One entry per stage, in order; a stage that is already done has no steps. */
  stages: StageSolution[]
}

/** Something the user does: turn a face, or turn the whole cube like the top face (`y`). */
type Action = { face: number; quarters: number } | { rotate: number }

const Y_TURN = turnCube(DEFAULT_ORIENTATION, 'right')
/** The entered top face goes to the bottom; the front stays at the front. */
const START = (['up', 'up', 'right', 'right'] as const).reduce(turnCube, DEFAULT_ORIENTATION)

const U_TURNS: Action[][] = [[], [{ face: 0, quarters: 1 }], [{ face: 0, quarters: 3 }], [{ face: 0, quarters: 2 }]]
const ROTATIONS: Action[][] = [[], [{ rotate: 1 }], [{ rotate: 3 }], [{ rotate: 2 }]]

const actionsOf = (text: string): Action[] =>
  parseMoves(text).map((move) => ({ face: Math.floor(move / 3), quarters: (move % 3) + 1 }))

const repeated = (actions: Action[], times: number) =>
  Array.from({ length: times }, () => actions).flat()

/** The cube as seen after turning the whole of it. */
function turnedView(view: CubieCube, turn: Orientation): CubieCube {
  const result = cubeFromStickers(rotateStickers(stickersFromCube(view), turn))
  if (!result.ok) throw new Error('Turning the cube produced an impossible cube')
  return result.cube
}

function apply(view: CubieCube, actions: readonly Action[]): CubieCube {
  let result = view
  for (const action of actions) {
    if ('rotate' in action) {
      for (let n = 0; n < action.rotate; n++) result = turnedView(result, Y_TURN)
    } else {
      result = applyMove(result, action.face * 3 + action.quarters - 1)
    }
  }
  return result
}

// --- What "done" means for each part of the cube

const range = (from: number, to: number) => Array.from({ length: to - from }, (_, i) => from + i)

const cornersSolved = (cube: CubieCube, positions: number[]) =>
  positions.filter((i) => cube.cp[i] === i && cube.co[i] === 0).length

const edgesSolved = (cube: CubieCube, positions: number[]) =>
  positions.filter((i) => cube.ep[i] === i && cube.eo[i] === 0).length

const BOTTOM = range(4, 8)
const MIDDLE = range(8, 12)
const TOP = range(0, 4)

const crossDone = (cube: CubieCube) => edgesSolved(cube, BOTTOM) === 4
const firstLayerDone = (cube: CubieCube) => crossDone(cube) && cornersSolved(cube, BOTTOM) === 4
const twoLayersDone = (cube: CubieCube) => firstLayerDone(cube) && edgesSolved(cube, MIDDLE) === 4
const topCrossDone = (cube: CubieCube) => twoLayersDone(cube) && TOP.every((i) => cube.eo[i] === 0)
const topEdgesDone = (cube: CubieCube) => twoLayersDone(cube) && edgesSolved(cube, TOP) === 4
const topCornersPlaced = (cube: CubieCube) => topEdgesDone(cube) && TOP.every((i) => cube.cp[i] === i)

// --- Stage 1: the cross, by lookup

/**
 * Fewest moves to solve the four bottom edges from every arrangement of them.
 * An arrangement is the position (0–11) and flip of each of the four edges.
 */
let crossDistances: Int8Array | null = null
/** Where the edge in each position goes for each move, and whether it flips. */
const edgeDestination: number[][] = MOVE_CUBES.map((move) => {
  const destination = new Array<number>(12)
  move.ep.forEach((from, to) => {
    destination[from] = to
  })
  return destination
})

function crossKey(positions: readonly number[], flips: readonly number[]): number {
  let key = 0
  for (let i = 0; i < 4; i++) key = key * 24 + positions[i] * 2 + flips[i]
  return key
}

function crossMove(positions: number[], flips: number[], move: Move): void {
  for (let i = 0; i < 4; i++) {
    const to = edgeDestination[move][positions[i]]
    flips[i] ^= MOVE_CUBES[move].eo[to]
    positions[i] = to
  }
}

function buildCrossDistances(): Int8Array {
  const distances = new Int8Array(24 ** 4).fill(-1)
  let frontier: number[][] = [[4, 5, 6, 7, 0, 0, 0, 0]]
  distances[crossKey([4, 5, 6, 7], [0, 0, 0, 0])] = 0
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: number[][] = []
    for (const state of frontier) {
      for (let move = 0; move < 18; move++) {
        const positions = state.slice(0, 4)
        const flips = state.slice(4)
        crossMove(positions, flips, move)
        const key = crossKey(positions, flips)
        if (distances[key] !== -1) continue
        distances[key] = depth
        next.push([...positions, ...flips])
      }
    }
    frontier = next
  }
  return distances
}

function solveCross(view: CubieCube): Action[] {
  crossDistances ??= buildCrossDistances()
  const positions = BOTTOM.map((piece) => view.ep.indexOf(piece))
  const flips = positions.map((position) => view.eo[position])
  const actions: Action[] = []
  while (crossDistances[crossKey(positions, flips)] > 0) {
    const distance = crossDistances[crossKey(positions, flips)]
    for (let move = 0; move < 18; move++) {
      const nextPositions = positions.slice()
      const nextFlips = flips.slice()
      crossMove(nextPositions, nextFlips, move)
      if (crossDistances[crossKey(nextPositions, nextFlips)] === distance - 1) {
        crossMove(positions, flips, move)
        actions.push({ face: Math.floor(move / 3), quarters: (move % 3) + 1 })
        break
      }
    }
  }
  return actions
}

// --- Stages 2 and 3: one piece at a time

/**
 * Solves one more piece. Each attempt is what a beginner does: turn the cube
 * to face a slot, turn the top to line a piece up, then do one sequence. When
 * every piece left is stuck in a wrong slot, a first attempt takes one out
 * and a second puts it in.
 */
function solveNextPiece(
  view: CubieCube,
  sequences: Action[][],
  score: (cube: CubieCube) => number,
): Action[] {
  const target = score(view) + 1
  const endings = U_TURNS.flatMap((turn) => sequences.map((sequence) => [...turn, ...sequence]))

  /** Every attempt from `cube` with what it leads to, shortest first. */
  const attemptsFrom = (cube: CubieCube) =>
    ROTATIONS.flatMap((rotation) => {
      const turned = apply(cube, rotation)
      return endings.map((ending) => ({
        actions: [...rotation, ...ending],
        result: apply(turned, ending),
      }))
    }).sort((a, b) => a.actions.length - b.actions.length)

  const firsts = attemptsFrom(view)
  const direct = firsts.find((attempt) => score(attempt.result) >= target)
  if (direct) return direct.actions

  let best: Action[] | null = null
  for (const first of firsts) {
    if (best && first.actions.length >= best.length) break
    const second = attemptsFrom(first.result).find((attempt) => score(attempt.result) >= target)
    if (second && (!best || first.actions.length + second.actions.length < best.length)) {
      best = [...first.actions, ...second.actions]
    }
  }
  if (!best) throw new Error('Beginner solver could not place the next piece')
  return best
}

// --- Stages 4 to 6: repeat one sequence, adjusting in between

/** The shortest mix of adjustments and one sequence that reaches the goal. */
function solveBySequence(
  view: CubieCube,
  adjustments: Action[][],
  sequence: Action[],
  done: (cube: CubieCube) => boolean,
): Action[] {
  const search = (cube: CubieCube, left: number, adjusted: boolean): Action[] | null => {
    if (done(cube)) return []
    if (left === 0) return null
    const rest = search(apply(cube, sequence), left - 1, false)
    if (rest) return [...sequence, ...rest]
    if (adjusted) return null
    for (const adjustment of adjustments) {
      if (adjustment.length === 0) continue
      const after = search(apply(cube, adjustment), left - 1, true)
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

function solveCornerTwists(view: CubieCube): Action[] {
  const twist = repeated(actionsOf(SEQUENCES.lastLayerCornerTwist), 2)
  const actions: Action[] = []
  let cube = view
  const act = (more: Action[]) => {
    actions.push(...more)
    cube = apply(cube, more)
  }
  for (let guard = 0; guard < 8 && TOP.some((i) => cube.co[i] !== 0); guard++) {
    const turn = U_TURNS.find((candidate) => apply(cube, candidate).co[0] !== 0)
    if (!turn) throw new Error('Beginner solver lost track of a twisted corner')
    act(turn)
    while (cube.co[0] !== 0) act(twist)
  }
  const last = U_TURNS.find((candidate) => isSolved(apply(cube, candidate)))
  if (!last) throw new Error('Beginner solver could not finish the cube')
  act(last)
  return actions
}

// --- Putting the stages together

/** Joins turns of the same face and turns of the whole cube that follow each other. */
function tidy(actions: readonly Action[]): Action[] {
  const result: Action[] = []
  for (const action of actions) {
    const previous = result.at(-1)
    if (previous && 'rotate' in previous && 'rotate' in action) {
      result.pop()
      const rotate = (previous.rotate + action.rotate) % 4
      if (rotate !== 0) result.push({ rotate })
    } else if (previous && 'face' in previous && 'face' in action && previous.face === action.face) {
      result.pop()
      const quarters = (previous.quarters + action.quarters) % 4
      if (quarters !== 0) result.push({ face: action.face, quarters })
    } else {
      result.push(action)
    }
  }
  return result
}

const FACE_LETTERS = 'URFDLB'
const TURN_SUFFIX = ['', '', '2', "'"]

/**
 * Solves `cube` with the beginner method. Throws if the cube is not solvable.
 */
export function solveBeginner(cube: CubieCube): BeginnerSolution {
  const reason = findUnsolvableReason(cube)
  if (reason !== null) throw new Error(`Cube is not solvable: ${reason}`)

  let view = turnedView(cube, START)
  let orientation = START
  const stages: StageSolution[] = []

  const sequence = (name: keyof typeof SEQUENCES) => actionsOf(SEQUENCES[name])
  const cornerSequences = [
    sequence('cornerFacingRight'),
    sequence('cornerFacingFront'),
    [...sequence('cornerFacingUp'), ...sequence('cornerFacingRight')],
  ]
  const edgeSequences = [sequence('edgeToRight'), sequence('edgeToLeft')]

  const untilDone = (
    done: (cube: CubieCube) => boolean,
    next: (cube: CubieCube) => Action[],
  ): Action[] => {
    const actions: Action[] = []
    let current = view
    for (let guard = 0; guard < 12 && !done(current); guard++) {
      const more = next(current)
      actions.push(...more)
      current = apply(current, more)
    }
    return actions
  }

  const solvers: Record<BeginnerStage, () => Action[]> = {
    cross: () => solveCross(view),
    'first-layer-corners': () =>
      untilDone(firstLayerDone, (current) =>
        solveNextPiece(current, cornerSequences, (c) =>
          crossDone(c) ? cornersSolved(c, BOTTOM) : -1,
        ),
      ),
    'middle-layer-edges': () =>
      untilDone(twoLayersDone, (current) =>
        solveNextPiece(current, edgeSequences, (c) =>
          firstLayerDone(c) ? edgesSolved(c, MIDDLE) : -1,
        ),
      ),
    'last-layer-cross': () =>
      solveBySequence(view, U_TURNS, sequence('lastLayerCross'), topCrossDone),
    'last-layer-edges': () =>
      solveBySequence(view, U_TURNS, sequence('lastLayerEdges'), topEdgesDone),
    'last-layer-corner-positions': () =>
      solveBySequence(view, ROTATIONS, sequence('lastLayerCornerCycle'), topCornersPlaced),
    'last-layer-corner-twists': () => solveCornerTwists(view),
  }

  for (const stage of BEGINNER_STAGES) {
    const actions = tidy(solvers[stage]())
    const steps: Step[] = []
    for (const action of actions) {
      if ('rotate' in action) {
        for (let n = 0; n < action.rotate; n++) orientation = turnCube(orientation, 'right')
        steps.push({ text: `y${TURN_SUFFIX[action.rotate]}`, orientation })
      } else {
        steps.push({
          text: FACE_LETTERS[action.face] + TURN_SUFFIX[action.quarters],
          move: cubeFaceSeenAs(orientation, action.face) * 3 + action.quarters - 1,
          orientation,
        })
      }
    }
    view = apply(view, actions)
    stages.push({ stage, steps })
  }

  const steps = stages.flatMap((stage) => stage.steps)
  if (!isSolved(cubeAfterSteps(cube, steps, steps.length))) {
    throw new Error('Beginner solver produced steps that do not solve the cube')
  }
  return { start: START, stages }
}
