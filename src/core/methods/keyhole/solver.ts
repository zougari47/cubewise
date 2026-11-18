/**
 * Keyhole-method solver: the beginner method with a shorter way through the
 * first two layers. Only three first-layer corners are solved at first; the
 * place of the fourth is the keyhole. The bottom layer is turned to bring the
 * keyhole under each middle-layer edge's place, and the edge goes in with
 * three moves. The fourth corner then goes in around its edge, and the last
 * layer is solved exactly as in the beginner method.
 *
 * The first layer is built on the face the user entered as the top one, so
 * the cube is first turned over to put that face at the bottom.
 */
import { isSolved } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { DEFAULT_ORIENTATION, turnCubeAbout } from '../../cube/orientation.ts'
import { SEQUENCES } from '../beginner/sequences.ts'
import { solveInStages } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { areSolved, blockSolver, countSolved, findSequence } from '../shared/search.ts'
import { U_TURNS, Y_TURNS, applyTurns, parseTurns, turnLists, turnOf } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { KEYHOLE_INSERTS, LAST_CORNERS } from './sequences.ts'
import { KEYHOLE_STAGES } from './stages.ts'
import type { KeyholeStage } from './stages.ts'

export type KeyholeSolution = MethodSolution<KeyholeStage>

/** The entered top face goes to the bottom; the front stays at the front. */
const START = turnCubeAbout(DEFAULT_ORIENTATION, 'z', 2)

// --- What "done" means for each part of the cube

const TOP = [0, 1, 2, 3]
const BOTTOM = [4, 5, 6, 7]
const MIDDLE = [8, 9, 10, 11]

const crossDone = (cube: CubieCube) => areSolved(cube, { edges: BOTTOM })
const twoLayersDone = (cube: CubieCube) =>
  areSolved(cube, { corners: BOTTOM, edges: [...BOTTOM, ...MIDDLE] })
const topCrossDone = (cube: CubieCube) => twoLayersDone(cube) && TOP.every((i) => cube.eo[i] === 0)
const topEdgesDone = (cube: CubieCube) => twoLayersDone(cube) && areSolved(cube, { edges: TOP })
const topCornersPlaced = (cube: CubieCube) => topEdgesDone(cube) && TOP.every((i) => cube.cp[i] === i)

/** How many first-layer corners are solved around a finished cross; -1 without the cross. */
const cornersAroundCross = (cube: CubieCube) =>
  crossDone(cube) ? countSolved(cube, { corners: BOTTOM }) : -1

/**
 * How far the bottom layer is turned away from home (0–3 quarter turns) when
 * the cross and at least three corners are whole on it; -1 when they are not.
 */
function bottomLayerOffset(cube: CubieCube): number {
  const offset = (cube.ep[4] - 4) & 3
  let corners = 0
  for (let i = 0; i < 4; i++) {
    const home = 4 + ((i + offset) & 3)
    if (cube.ep[4 + i] !== home || cube.eo[4 + i] !== 0) return -1
    if (cube.cp[4 + i] === home && cube.co[4 + i] === 0) corners++
  }
  return corners >= 3 ? offset : -1
}

/** How many middle-layer edges are solved above a whole, possibly turned, bottom layer; -1 if it is not whole. */
const edgesAboveBottomLayer = (cube: CubieCube) =>
  bottomLayerOffset(cube) < 0 ? -1 : countSolved(cube, { edges: MIDDLE })

/** Three corners and all four middle-layer edges, with the bottom layer home. */
const keyholeEdgesDone = (cube: CubieCube) =>
  bottomLayerOffset(cube) === 0 && areSolved(cube, { edges: MIDDLE })

// --- Stage 1: the cross, in the fewest moves

const solveCross = blockSolver({ pieces: { edges: BOTTOM } })

// --- Stages 2 and 3: one piece at a time, in the order that costs least

/**
 * How many more arrangements a search may look at once it has one way of
 * solving its pieces. This bounds the time; looking further hardly shortens
 * the whole solution.
 */
const SECOND_LOOKS = 30

interface Attempt {
  /** Lining up, then one sequence, as written for a cube that is never turned whole. */
  lineUp: readonly Turn[]
  sequence: readonly Turn[]
  result: CubieCube
  cost: number
  score: number
}

/**
 * The same turns for each of the four ways of holding the cube: entry `n` is
 * `turns` as it would be done after `n` whole-cube turns `y`, written for the
 * cube as held before them.
 */
function inEveryHold(turns: readonly Turn[]): Turn[][] {
  const behind: Record<string, string> = { R: 'B', B: 'L', L: 'F', F: 'R' }
  const holds = [turns.slice()]
  for (let n = 1; n < 4; n++) {
    holds.push(holds[n - 1].map((turn) => turnOf(behind[turn.family] ?? turn.family, turn.quarters)))
  }
  return holds
}

const sameCube = (a: CubieCube, b: CubieCube) =>
  a.cp.every((piece, i) => piece === b.cp[i] && a.co[i] === b.co[i]) &&
  a.ep.every((piece, i) => piece === b.ep[i] && a.eo[i] === b.eo[i])

/**
 * Solves pieces one at a time until `score` reaches `target`, the way a
 * person does: turn the cube to face a place, line up, do one taught
 * sequence. Different orders of solving the pieces are tried, up to
 * `SECOND_LOOKS`, and the one with the fewest moves is kept. When no attempt solves a piece (those left are stuck
 * in wrong places), one attempt that solves nothing is allowed, to take a
 * piece out.
 *
 * The search itself never turns the whole cube: it tries each sequence as it
 * would be done from all four sides, and the whole-cube turns are worked out
 * afterwards.
 */
function placePieces(
  view: CubieCube,
  options: {
    /**
     * Turns below the top layer that may be needed before a sequence, such as
     * `D`; they must read the same from every side. Default: none. The top
     * layer is always turned as needed.
     */
    settings?: readonly (readonly Turn[])[]
    /** The taught sequences, as done from the front. */
    sequences: readonly (readonly Turn[])[]
    /** How many pieces are solved; -1 when something that must be kept is broken. */
    score: (cube: CubieCube) => number
    target: number
    /** The fewest moves one piece can take. */
    movesPerPiece: number
    /** Turns that tidy up at the very end, such as turning the bottom layer home. */
    finish?: (cube: CubieCube) => Turn[]
  },
): Turn[] {
  const { score, target, movesPerPiece } = options
  const settings = options.settings ?? [[]]
  const finish = options.finish ?? (() => [])
  const fromAllSides = options.sequences.flatMap(inEveryHold)

  const attemptsFrom = (cube: CubieCube): Attempt[] => {
    const attempts: Attempt[] = []
    for (const setting of settings) {
      const set = applyTurns(cube, setting)
      for (const sequence of fromAllSides) {
        // Turning the top first never changes what a sequence breaks below it.
        if (score(applyTurns(set, sequence)) < 0) continue
        for (const top of U_TURNS) {
          const result = applyTurns(applyTurns(set, top), sequence)
          const lineUp = [...setting, ...top]
          attempts.push({
            lineUp,
            sequence,
            result,
            cost: lineUp.length + sequence.length,
            score: score(result),
          })
        }
      }
    }
    return attempts.sort((a, b) => a.cost - b.cost)
  }

  let best: { attempts: Attempt[]; last: Turn[] } | null = null
  let bestCost = Infinity
  const path: Attempt[] = []
  let looksLeft = SECOND_LOOKS

  const search = (cube: CubieCube, solved: number, spent: number, tookOut: boolean) => {
    if (solved >= target) {
      const last = finish(cube)
      if (spent + last.length < bestCost) {
        bestCost = spent + last.length
        best = { attempts: path.slice(), last }
      }
      return
    }
    if (spent + (target - solved) * movesPerPiece >= bestCost) return
    // The first way found is the nearest piece each time; other orders are tried while looks last.
    if (best && --looksLeft < 0) return
    const attempts = attemptsFrom(cube)
    let next = attempts.filter((attempt) => attempt.score > solved)
    const takingOut = next.length === 0
    if (takingOut) {
      if (tookOut) return
      next = attempts.filter((attempt) => attempt.score === solved)
    }
    for (const attempt of next) {
      if (spent + attempt.cost >= bestCost) break
      path.push(attempt)
      search(attempt.result, attempt.score, spent + attempt.cost, takingOut)
      path.pop()
    }
  }

  const start = score(view)
  if (start < 0) throw new Error('Keyhole solver was given a cube that is not ready for this stage')
  search(view, start, 0, false)
  const found = best as { attempts: Attempt[]; last: Turn[] } | null
  if (!found) throw new Error('Keyhole solver could not place the next piece')

  // Now as the user does it: turn the cube so that the sequence is one of the taught ones.
  const turns: Turn[] = []
  let unturned = view
  let held = view
  let turnedBy: Turn[] = []
  for (const attempt of found.attempts) {
    unturned = applyTurns(applyTurns(unturned, attempt.lineUp), attempt.sequence)
    let taught: Turn[] | null = null
    for (const hold of Y_TURNS) {
      const wanted = applyTurns(unturned, [...turnedBy, ...hold])
      const lined = applyTurns(applyTurns(held, hold), attempt.lineUp)
      const sequence = options.sequences.find((candidate) => sameCube(applyTurns(lined, candidate), wanted))
      if (sequence) {
        taught = [...hold, ...attempt.lineUp, ...sequence]
        turnedBy = [...turnedBy, ...hold]
        break
      }
    }
    if (!taught) throw new Error('Keyhole solver could not turn the cube to face a place')
    turns.push(...taught)
    held = applyTurns(held, taught)
  }
  return [...turns, ...found.last]
}

const beginner = (name: keyof typeof SEQUENCES) => parseTurns(SEQUENCES[name])

const CORNER_SEQUENCES = [
  beginner('cornerFacingRight'),
  beginner('cornerFacingFront'),
  [...beginner('cornerFacingUp'), ...beginner('cornerFacingRight')],
]

/** Three first-layer corners, whichever three are cheapest; the place of the fourth is the keyhole. */
const solveThreeCorners = (view: CubieCube) =>
  placePieces(view, {
    sequences: CORNER_SEQUENCES,
    score: cornersAroundCross,
    target: 3,
    movesPerPiece: 3,
  })

const D_TURNS = turnLists(['', 'D', "D'", 'D2'])
const INSERTS = Object.values(KEYHOLE_INSERTS).map(parseTurns)

/** The bottom turn that brings the cross home again. */
function turnBottomHome(cube: CubieCube): Turn[] {
  const turn = D_TURNS.find((candidate) => crossDone(applyTurns(cube, candidate)))
  if (!turn) throw new Error('Keyhole solver lost the cross')
  return turn
}

/**
 * All four middle-layer edges through the keyhole: turn the bottom layer to
 * bring the keyhole under the edge's place, line the edge up, insert. The
 * bottom layer is turned home at the end.
 */
function solveKeyholeEdges(view: CubieCube): Turn[] {
  if (keyholeEdgesDone(view)) return []
  return placePieces(view, {
    settings: D_TURNS,
    sequences: INSERTS,
    score: edgesAboveBottomLayer,
    target: 4,
    movesPerPiece: 3,
    finish: turnBottomHome,
  })
}

// --- Stage 4: the last corner, around its edge

const LAST_CORNER_SEQUENCES = Object.values(LAST_CORNERS).map(parseTurns)
const HOLDS_AND_TOP_TURNS = Y_TURNS.flatMap((hold) => U_TURNS.map((top) => [...hold, ...top]))

function solveLastCorner(view: CubieCube): Turn[] {
  if (twoLayersDone(view)) return []
  const turns = findSequence(view, {
    before: HOLDS_AND_TOP_TURNS,
    sequences: LAST_CORNER_SEQUENCES,
    done: twoLayersDone,
  })
  if (!turns) throw new Error('Keyhole solver could not place the last corner')
  return turns
}

// --- Stages 5 to 7: repeat one beginner sequence, adjusting in between

/** The shortest mix of adjustments and one sequence that reaches the goal. */
function repeatSequence(
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
  throw new Error('Keyhole solver could not finish a last-layer stage')
}

// --- Stage 8: twist the last corners, two twists at a time

function solveCornerTwists(view: CubieCube): Turn[] {
  const twist = parseTurns(`${SEQUENCES.lastLayerCornerTwist} ${SEQUENCES.lastLayerCornerTwist}`)
  const turns: Turn[] = []
  let cube = view
  const act = (more: Turn[]) => {
    turns.push(...more)
    cube = applyTurns(cube, more)
  }
  for (let guard = 0; guard < 8 && TOP.some((i) => cube.co[i] !== 0); guard++) {
    const turn = U_TURNS.find((candidate) => applyTurns(cube, candidate).co[0] !== 0)
    if (!turn) throw new Error('Keyhole solver lost track of a twisted corner')
    act(turn)
    for (let twists = 0; twists < 2 && cube.co[0] !== 0; twists++) act(twist)
  }
  const last = U_TURNS.find((candidate) => isSolved(applyTurns(cube, candidate)))
  if (!last) throw new Error('Keyhole solver could not finish the cube')
  act(last)
  return turns
}

/**
 * Solves `cube` with the keyhole method. Throws if the cube is not solvable.
 */
export function solveKeyhole(cube: CubieCube): KeyholeSolution {
  return solveInStages(cube, START, KEYHOLE_STAGES, {
    cross: (view) => {
      const turns = solveCross(view)
      if (!turns) throw new Error('Keyhole solver could not make the cross')
      return turns
    },
    'three-corners': solveThreeCorners,
    'keyhole-edges': solveKeyholeEdges,
    'last-corner': solveLastCorner,
    'last-layer-cross': (view) =>
      repeatSequence(view, U_TURNS, beginner('lastLayerCross'), topCrossDone),
    'last-layer-edges': (view) =>
      repeatSequence(view, U_TURNS, beginner('lastLayerEdges'), topEdgesDone),
    'last-layer-corner-positions': (view) =>
      repeatSequence(view, Y_TURNS, beginner('lastLayerCornerCycle'), topCornersPlaced),
    'last-layer-corner-twists': solveCornerTwists,
  })
}
