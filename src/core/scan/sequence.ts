/**
 * The order the six faces are shown to the camera, and which stickers each
 * captured face fills in.
 */
import { DEFAULT_ORIENTATION, frontFace, frontStickers, turnCube } from '../cube/orientation.ts'
import type { Orientation, TurnDirection } from '../cube/orientation.ts'

/**
 * How the cube is turned before each capture: the front face first, three
 * side faces by turning the same way, then the top, then the bottom.
 */
export const SCAN_TURNS: TurnDirection[][] = [[], ['right'], ['right'], ['right'], ['up'], ['down', 'down']]

export const SCAN_FACE_COUNT = SCAN_TURNS.length

const SCAN_ORIENTATIONS = SCAN_TURNS.reduce<Orientation[]>((list, turns) => {
  list.push(turns.reduce(turnCube, list.at(-1) ?? DEFAULT_ORIENTATION))
  return list
}, [])

/** The face (0–5 in U R F D L B order) captured at each step. */
export const SCAN_FACES = SCAN_ORIENTATIONS.map(frontFace)

/** For each step, the sticker each of the nine captured cells belongs to. */
export const SCAN_STICKERS = SCAN_ORIENTATIONS.map(frontStickers)

/**
 * Puts six captured faces (nine values each, in capture order) into the
 * 54-sticker order of `cube/stickers.ts`.
 */
export function placeScan<T>(faces: readonly (readonly T[])[]): T[] {
  const placed = new Array<T>(54)
  faces.forEach((face, step) => {
    face.forEach((value, cell) => (placed[SCAN_STICKERS[step][cell]] = value))
  })
  return placed
}
