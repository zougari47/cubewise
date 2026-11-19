/**
 * Entering a cube's colours: the stickers painted so far, which face is at
 * the front, which sticker the keyboard will paint next, and undo history.
 * Pure state and rules only; no browser or rendering code.
 */
import {
  DEFAULT_ORIENTATION,
  frontFace,
  frontStickers,
  orientationShowing,
  turnCube,
} from '../../core/cube/orientation.ts'
import type { Orientation, TurnDirection } from '../../core/cube/orientation.ts'
import { STICKER_COUNT, cubeFromStickers } from '../../core/cube/stickers.ts'
import type { StickerError } from '../../core/cube/stickers.ts'
import type { CubieCube } from '../../core/cube/cubie.ts'

/** The colour keys, in the order shown in the palette. */
export const COLOUR_KEYS = ['W', 'Y', 'R', 'O', 'B', 'G'] as const
export type ColourKey = (typeof COLOUR_KEYS)[number]

/** A sticker's colour, or `null` while it is unpainted. */
export type Paint = ColourKey | null

/** Centre colours of the standard colour scheme, in U R F D L B order. */
export const STANDARD_SCHEME: ColourKey[] = ['W', 'R', 'G', 'Y', 'O', 'B']

export function isColourKey(value: unknown): value is ColourKey {
  return COLOUR_KEYS.includes(value as ColourKey)
}

export interface EntryState {
  /** All 54 stickers, in the order described in `cube/stickers.ts`. */
  stickers: Paint[]
  orientation: Orientation
  /** Sticker number the keyboard paints next, as 0–8. */
  cursor: number
  past: Paint[][]
  future: Paint[][]
}

export type EntryAction =
  /** Move the keyboard cursor to a sticker number (1–9) on the front face. */
  | { type: 'select'; number: number }
  /** Paint the sticker under the cursor, then move on to the next unpainted one. */
  | { type: 'paint'; colour: ColourKey }
  /** Paint a specific sticker (mouse or touch). */
  | { type: 'paint-sticker'; sticker: number; colour: ColourKey }
  | { type: 'turn'; direction: TurnDirection }
  | { type: 'show-face'; face: number }
  | { type: 'undo' }
  | { type: 'redo' }
  /** Unpaint the front face, keeping its centre. */
  | { type: 'clear-face' }
  | { type: 'reset' }
  /** Replace the stickers with a saved set. */
  | { type: 'load'; stickers: Paint[] }
  /** Paint the whole cube at once (a camera scan); it can be undone. */
  | { type: 'fill'; stickers: Paint[] }

const HISTORY_LIMIT = 200

function blankStickers(): Paint[] {
  const stickers = new Array<Paint>(STICKER_COUNT).fill(null)
  STANDARD_SCHEME.forEach((colour, face) => {
    stickers[face * 9 + 4] = colour
  })
  return stickers
}

export function initialEntry(): EntryState {
  return {
    stickers: blankStickers(),
    orientation: DEFAULT_ORIENTATION,
    cursor: 0,
    past: [],
    future: [],
  }
}

/** First unpainted sticker number on the front face at or after `from`, wrapping round. */
function nextUnpainted(stickers: Paint[], orientation: Orientation, from: number): number | null {
  const front = frontStickers(orientation)
  for (let step = 0; step < 9; step++) {
    const number = (from + step) % 9
    if (stickers[front[number]] === null) return number
  }
  return null
}

function withStickers(state: EntryState, stickers: Paint[], cursor = state.cursor): EntryState {
  if (stickers.every((paint, i) => paint === state.stickers[i])) return { ...state, cursor }
  return {
    ...state,
    stickers,
    cursor,
    past: [...state.past, state.stickers].slice(-HISTORY_LIMIT),
    future: [],
  }
}

function withOrientation(state: EntryState, orientation: Orientation): EntryState {
  return {
    ...state,
    orientation,
    cursor: nextUnpainted(state.stickers, orientation, 0) ?? 0,
  }
}

export function entryReducer(state: EntryState, action: EntryAction): EntryState {
  switch (action.type) {
    case 'select':
      if (action.number < 1 || action.number > 9) return state
      return { ...state, cursor: action.number - 1 }

    case 'paint': {
      const stickers = state.stickers.slice()
      stickers[frontStickers(state.orientation)[state.cursor]] = action.colour
      const next = nextUnpainted(stickers, state.orientation, state.cursor + 1)
      return withStickers(state, stickers, next ?? state.cursor)
    }

    case 'paint-sticker': {
      const number = frontStickers(state.orientation).indexOf(action.sticker)
      const stickers = state.stickers.slice()
      stickers[action.sticker] = action.colour
      return withStickers(state, stickers, number >= 0 ? number : state.cursor)
    }

    case 'turn':
      return withOrientation(state, turnCube(state.orientation, action.direction))

    case 'show-face':
      if (frontFace(state.orientation) === action.face) return state
      return withOrientation(state, orientationShowing(action.face))

    case 'undo': {
      const previous = state.past.at(-1)
      if (!previous) return state
      return {
        ...state,
        stickers: previous,
        past: state.past.slice(0, -1),
        future: [state.stickers, ...state.future],
      }
    }

    case 'redo': {
      const [next, ...future] = state.future
      if (!next) return state
      return { ...state, stickers: next, past: [...state.past, state.stickers], future }
    }

    case 'clear-face': {
      const stickers = state.stickers.slice()
      frontStickers(state.orientation).forEach((sticker, number) => {
        if (number !== 4) stickers[sticker] = null
      })
      return withStickers(state, stickers, 0)
    }

    case 'reset':
      return withOrientation(withStickers(state, blankStickers()), DEFAULT_ORIENTATION)

    case 'load':
      if (!isSavedStickers(action.stickers)) return state
      return withOrientation({ ...state, stickers: action.stickers, past: [], future: [] }, state.orientation)

    case 'fill':
      if (!isSavedStickers(action.stickers)) return state
      return withOrientation(withStickers(state, action.stickers), DEFAULT_ORIENTATION)
  }
}

/** Whether a value read back from storage is a usable set of stickers. */
export function isSavedStickers(value: unknown): value is Paint[] {
  return (
    Array.isArray(value) &&
    value.length === STICKER_COUNT &&
    value.every((paint) => paint === null || isColourKey(paint))
  )
}

/** How many stickers have each colour; a complete cube has nine of each. */
export function colourCounts(stickers: readonly Paint[]): Record<ColourKey, number> {
  const counts: Record<ColourKey, number> = { W: 0, Y: 0, R: 0, O: 0, B: 0, G: 0 }
  for (const paint of stickers) {
    if (paint !== null) counts[paint]++
  }
  return counts
}

/**
 * The entered stickers written out for a person to read: one group of colour
 * keys per face, in U R F D L B order, with `-` for an unpainted sticker.
 */
export function stickersText(stickers: readonly Paint[]): string {
  const perFace = Math.max(1, Math.ceil(stickers.length / 6))
  const faces: string[] = []
  for (let from = 0; from < stickers.length; from += perFace) {
    faces.push(
      stickers
        .slice(from, from + perFace)
        .map((paint) => paint ?? '-')
        .join(''),
    )
  }
  return faces.join(' ')
}

/** Why the entered stickers cannot be solved yet. */
export type EntryProblem = { code: 'unpainted'; stickers: number[] } | StickerError

export type EntryCheck =
  | { ok: true; cube: CubieCube; scheme: ColourKey[] }
  | { ok: false; problem: EntryProblem }

/**
 * Checks the entered stickers. When they form a solvable cube, returns it
 * with the user's colour scheme (centre colours in U R F D L B order).
 */
export function checkEntry(stickers: readonly Paint[]): EntryCheck {
  const unpainted = stickers.flatMap((paint, i) => (paint === null ? [i] : []))
  if (unpainted.length > 0) return { ok: false, problem: { code: 'unpainted', stickers: unpainted } }
  const result = cubeFromStickers(stickers)
  if (!result.ok) return { ok: false, problem: result.error }
  const scheme = [0, 1, 2, 3, 4, 5].map((face) => stickers[face * 9 + 4] as ColourKey)
  return { ok: true, cube: result.cube, scheme }
}
