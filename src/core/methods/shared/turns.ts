/**
 * Everything a person can do to a cube in their hands, in standard notation:
 * face moves (`R U' F2`), wide turns (`r`, also written `Rw`), slice turns
 * (`M E S`) and whole-cube turns (`x y z`).
 *
 * Method solvers work on "the view": the cube as the user sees it right now.
 * In the view, a piece is numbered by the place it belongs given where the
 * centres currently are, so `isSolved(view)` and checks such as
 * `view.ep[5] === 5` ("the front-bottom edge is home") stay true to what the
 * user sees however the cube has been turned. Wide, slice and whole-cube
 * turns move the centres, and the view follows them.
 */
import { FACE_NAMES, MOVE_CUBES, multiply, solvedCube } from '../../cube/cubie.ts'
import type { CubieCube, Move } from '../../cube/cubie.ts'
import { STICKER_PLACES, stickerAt } from '../../cube/geometry.ts'
import {
  DEFAULT_ORIENTATION,
  cubeFaceSeenAs,
  seenDirection,
  turnCubeAbout,
} from '../../cube/orientation.ts'
import type { CubeAxis, Orientation } from '../../cube/orientation.ts'
import { CORNER_STICKERS, EDGE_STICKERS } from '../../cube/stickers.ts'
import type { Step } from '../../cube/steps.ts'

export type TurnKind = 'face' | 'wide' | 'slice' | 'cube'

/** One thing the user does. There is one shared object per turn, so turns can be compared with `===`. */
export interface Turn {
  /** As written: `R`, `U2`, `r'`, `M`, `y`. */
  readonly text: string
  readonly kind: TurnKind
  /** The letter without its suffix; turns of one family join into one. */
  readonly family: string
  /** 1 clockwise, 2 a half turn, 3 anticlockwise. */
  readonly quarters: number
  /** The face moves it amounts to, on the cube as held before the turn. */
  readonly faceMoves: readonly Move[]
  /** The whole-cube turn it amounts to after those moves, if any. */
  readonly cubeTurn: { axis: CubeAxis; quarters: number } | null
  /** For wide and slice turns: the face whose axis they turn about, and which layers turn. */
  readonly layers: { face: number; layers: readonly number[] } | null
  /** Renumbers the pieces after the centres have moved; null when they have not. */
  readonly relabel: CubieCube | null
  /** Moves the pieces. */
  readonly effect: CubieCube
}

const SUFFIXES = ['', '2', "'"]
const AXIS_OF_FACE: CubeAxis[] = ['y', 'x', 'z', 'y', 'x', 'z']
const opposite = (face: number) => (face + 3) % 6

function inverseOf(cube: CubieCube): CubieCube {
  const inverse = solvedCube()
  cube.cp.forEach((from, to) => {
    inverse.cp[from] = to
    inverse.co[from] = (3 - cube.co[to]) % 3
  })
  cube.ep.forEach((from, to) => {
    inverse.ep[from] = to
    inverse.eo[from] = cube.eo[to]
  })
  return inverse
}

/** Where every piece goes when the whole cube is turned to `orientation`, as a cube. */
function wholeTurnCube(orientation: Orientation): CubieCube {
  const cube = solvedCube()
  const carry = (stickersByPosition: number[][], pieces: number[], turned: number[]) => {
    stickersByPosition.forEach((stickers, from) => {
      const { place, normal } = STICKER_PLACES[stickers[0]]
      const sticker = stickerAt(seenDirection(orientation, place), seenDirection(orientation, normal))
      const to = stickersByPosition.findIndex((candidates) => candidates.includes(sticker))
      pieces[to] = from
      turned[to] = stickersByPosition[to].indexOf(sticker)
    })
  }
  carry(CORNER_STICKERS, cube.cp, cube.co)
  carry(EDGE_STICKERS, cube.ep, cube.eo)
  return cube
}

/** The cube as the user sees it when it is held in `orientation`. */
export function viewOf(cube: CubieCube, orientation: Orientation): CubieCube {
  const whole = wholeTurnCube(orientation)
  return multiply(multiply(inverseOf(whole), cube), whole)
}

const TURNS = new Map<string, Turn>()

function define(
  family: string,
  kind: TurnKind,
  /** The face this turn goes the same way as. */
  like: number,
  facesFor: (quarters: number) => [face: number, quarters: number][],
  layers: readonly number[] | null,
): void {
  for (let quarters = 1; quarters <= 3; quarters++) {
    const faceMoves = facesFor(quarters).map(([face, q]) => face * 3 + q - 1)
    const cubeTurn =
      kind === 'face'
        ? null
        : { axis: AXIS_OF_FACE[like], quarters: like < 3 ? quarters : 4 - quarters }
    const whole = cubeTurn
      ? wholeTurnCube(turnCubeAbout(DEFAULT_ORIENTATION, cubeTurn.axis, cubeTurn.quarters))
      : null
    let effect = solvedCube()
    for (const move of faceMoves) effect = multiply(effect, MOVE_CUBES[move])
    if (whole) effect = multiply(effect, whole)
    const turn: Turn = {
      text: family + SUFFIXES[quarters - 1],
      kind,
      family,
      quarters,
      faceMoves,
      cubeTurn,
      layers: layers ? { face: like, layers } : null,
      relabel: whole ? inverseOf(whole) : null,
      effect,
    }
    TURNS.set(`${family}${quarters}`, turn)
  }
}

FACE_NAMES.forEach((name, face) => {
  define(name, 'face', face, (q) => [[face, q]], null)
  // A wide turn is the opposite face turned alone, then the whole cube.
  define(name.toLowerCase(), 'wide', face, (q) => [[opposite(face), q]], [1, 0])
})
// A slice is both outer faces turned the other way, then the whole cube. M goes like L, E like D, S like F.
for (const [name, like] of [['M', 4], ['E', 3], ['S', 2]] as const) {
  define(name, 'slice', like, (q) => [[like, 4 - q], [opposite(like), q]], [0])
}
for (const [name, like] of [['x', 1], ['y', 0], ['z', 2]] as const) {
  define(name, 'cube', like, () => [], null)
}

/** The turn of `family` by `quarters` quarter turns (1–3). */
export function turnOf(family: string, quarters: number): Turn {
  const turn = TURNS.get(`${family}${quarters}`)
  if (!turn) throw new Error(`Unknown turn "${family}" × ${quarters}`)
  return turn
}

/** Parses notation such as `R U' r2 M' x y2`. `Rw` is read as `r`. Throws on anything else. */
export function parseTurns(text: string): Turn[] {
  const turns: Turn[] = []
  for (const token of text.trim().split(/\s+/)) {
    if (token === '') continue
    const match = /^([URFDLB]w?|[urfdlbMESxyz])(2'?|')?$/.exec(token)
    if (!match) throw new Error(`Unknown turn "${token}"`)
    const family = match[1].endsWith('w') ? match[1][0].toLowerCase() : match[1]
    const quarters = match[2] === undefined ? 1 : match[2] === "'" ? 3 : 2
    turns.push(turnOf(family, quarters))
  }
  return turns
}

export function formatTurns(turns: readonly Turn[]): string {
  return turns.map((turn) => turn.text).join(' ')
}

/** The turns that undo `turns`. */
export function invertTurns(turns: readonly Turn[]): Turn[] {
  return turns.map((turn) => turnOf(turn.family, 4 - turn.quarters)).reverse()
}

/** Joins turns of the same family that follow each other, dropping those that cancel. */
export function tidy(turns: readonly Turn[]): Turn[] {
  const result: Turn[] = []
  for (const turn of turns) {
    const previous = result.at(-1)
    if (previous?.family !== turn.family) {
      result.push(turn)
      continue
    }
    result.pop()
    const quarters = (previous.quarters + turn.quarters) % 4
    if (quarters !== 0) result.push(turnOf(turn.family, quarters))
  }
  return result
}

/** The view after one turn. */
export function applyTurn(view: CubieCube, turn: Turn): CubieCube {
  const moved = multiply(view, turn.effect)
  return turn.relabel ? multiply(turn.relabel, moved) : moved
}

/** The view after `turns`, given as turns or as notation. */
export function applyTurns(view: CubieCube, turns: readonly Turn[] | string): CubieCube {
  let result = view
  for (const turn of typeof turns === 'string' ? parseTurns(turns) : turns) {
    result = applyTurn(result, turn)
  }
  return result
}

/**
 * The steps the user follows for `turns`, starting with the cube held in
 * `orientation`, and how it is held at the end.
 */
export function stepsFromTurns(
  turns: readonly Turn[],
  orientation: Orientation = DEFAULT_ORIENTATION,
): { steps: Step[]; orientation: Orientation } {
  const steps: Step[] = []
  let held = orientation
  for (const turn of turns) {
    const onCube = (move: Move) => cubeFaceSeenAs(held, Math.floor(move / 3)) * 3 + (move % 3)
    const step: Step = { text: turn.text, moves: turn.faceMoves.map(onCube), orientation: held }
    if (turn.layers) {
      step.layers = {
        move: onCube(turn.layers.face * 3 + turn.quarters - 1),
        layers: turn.layers.layers,
      }
    }
    if (turn.cubeTurn) held = turnCubeAbout(held, turn.cubeTurn.axis, turn.cubeTurn.quarters)
    step.orientation = held
    steps.push(step)
  }
  return { steps, orientation: held }
}

/** Each notation text as a list of turns; `''` is "do nothing". */
export const turnLists = (texts: readonly string[]): Turn[][] => texts.map(parseTurns)

/** Turning the top layer: not at all, or any of the three ways. */
export const U_TURNS = turnLists(['', 'U', "U'", 'U2'])
/** Turning the whole cube about its vertical axis: not at all, or any of the three ways. */
export const Y_TURNS = turnLists(['', 'y', "y'", 'y2'])
/** All 18 face moves. */
export const FACE_TURNS = parseTurns("U U2 U' R R2 R' F F2 F' D D2 D' L L2 L' B B2 B'")
