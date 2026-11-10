/**
 * How the whole cube is turned in front of the user. Turning the whole cube
 * is not a move: no piece changes place, the user just sees another face.
 */
import { FACE_NORMALS, dot, stickerAt } from './geometry.ts'
import type { Vec3 } from './geometry.ts'

/**
 * A rotation matrix (three rows). It takes a direction on the cube to the
 * direction the user sees it in: x right, y up, z towards the user.
 */
export type Orientation = [Vec3, Vec3, Vec3]

/** F faces the user, U is on top. */
export const DEFAULT_ORIENTATION: Orientation = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]

/** Which neighbouring face to bring to the front. */
export type TurnDirection = 'left' | 'right' | 'up' | 'down'

const TURNS: Record<TurnDirection, Orientation> = {
  // The face on the right comes to the front.
  right: [
    [0, 0, -1],
    [0, 1, 0],
    [1, 0, 0],
  ],
  left: [
    [0, 0, 1],
    [0, 1, 0],
    [-1, 0, 0],
  ],
  // The face on top comes to the front.
  up: [
    [1, 0, 0],
    [0, 0, -1],
    [0, 1, 0],
  ],
  down: [
    [1, 0, 0],
    [0, 0, 1],
    [0, -1, 0],
  ],
}

function compose(after: Orientation, before: Orientation): Orientation {
  const column = (m: Orientation, c: number): Vec3 => [m[0][c], m[1][c], m[2][c]]
  return after.map((row) => [0, 1, 2].map((c) => dot(row, column(before, c)))) as Orientation
}

/** The orientation after bringing the face on the given side to the front. */
export function turnCube(orientation: Orientation, direction: TurnDirection): Orientation {
  return compose(TURNS[direction], orientation)
}

/** Where a direction on the cube points from the user's side. */
export function seenDirection(orientation: Orientation, v: Vec3): Vec3 {
  return [dot(orientation[0], v), dot(orientation[1], v), dot(orientation[2], v)]
}

/** The direction on the cube that the user sees as `v`. */
function cubeDirection(orientation: Orientation, v: Vec3): Vec3 {
  return [0, 1, 2].map(
    (c) => orientation[0][c] * v[0] + orientation[1][c] * v[1] + orientation[2][c] * v[2],
  ) as Vec3
}

/** The face (0–5 in U R F D L B order) turned towards the user. */
export function frontFace(orientation: Orientation): number {
  const towardsUser = cubeDirection(orientation, [0, 0, 1])
  return FACE_NORMALS.findIndex((normal) => dot(normal, towardsUser) === 1)
}

/**
 * The nine stickers of the front face in the order the user reads them
 * (sticker numbers 1–9: left-to-right, top-to-bottom).
 */
export function frontStickers(orientation: Orientation): number[] {
  const normal = cubeDirection(orientation, [0, 0, 1])
  const stickers: number[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      stickers.push(stickerAt(cubeDirection(orientation, [col - 1, 1 - row, 1]), normal))
    }
  }
  return stickers
}

/** The simplest orientation that shows `face` at the front. */
export function orientationShowing(face: number): Orientation {
  const turns: TurnDirection[][] = [['up'], ['right'], [], ['down'], ['left'], ['right', 'right']]
  return turns[face].reduce(turnCube, DEFAULT_ORIENTATION)
}
