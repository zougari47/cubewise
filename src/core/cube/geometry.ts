/**
 * Where each of the 54 stickers sits in space, for drawing the cube and for
 * working out which stickers face the user.
 *
 * Axes: x points right, y up, z towards the viewer. Each piece sits at a
 * whole-number position from -1 to 1 on every axis.
 */
import { STICKER_COUNT } from './stickers.ts'

export type Vec3 = [number, number, number]

/** Outward direction of each face, in U R F D L B order. */
export const FACE_NORMALS: Vec3[] = [
  [0, 1, 0],
  [1, 0, 0],
  [0, 0, 1],
  [0, -1, 0],
  [-1, 0, 0],
  [0, 0, -1],
]

export interface StickerPlace {
  /** Position of the piece this sticker is on. */
  place: Vec3
  /** Direction the sticker faces. */
  normal: Vec3
}

function placeOnFace(face: number, row: number, col: number): Vec3 {
  switch (face) {
    case 0:
      return [col - 1, 1, row - 1]
    case 1:
      return [1, 1 - row, 1 - col]
    case 2:
      return [col - 1, 1 - row, 1]
    case 3:
      return [col - 1, -1, 1 - row]
    case 4:
      return [-1, 1 - row, col - 1]
    default:
      return [1 - col, 1 - row, -1]
  }
}

const key = (place: Vec3, normal: Vec3) => `${place.join(',')}|${normal.join(',')}`

/** The place of every sticker, indexed like the sticker list in `stickers.ts`. */
export const STICKER_PLACES: StickerPlace[] = []
const STICKER_BY_PLACE = new Map<string, number>()
for (let sticker = 0; sticker < STICKER_COUNT; sticker++) {
  const face = Math.floor(sticker / 9)
  const place = placeOnFace(face, Math.floor((sticker % 9) / 3), sticker % 3)
  STICKER_BY_PLACE.set(key(place, FACE_NORMALS[face]), sticker)
  STICKER_PLACES.push({ place, normal: FACE_NORMALS[face] })
}

/** The sticker on the piece at `place` facing `normal`, or -1 if there is none. */
export function stickerAt(place: Vec3, normal: Vec3): number {
  return STICKER_BY_PLACE.get(key(place, normal)) ?? -1
}

export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** `v` after a clockwise quarter turn about `axis`, seen from outside the cube. */
export function turnClockwise(v: Vec3, axis: Vec3): Vec3 {
  const along = dot(v, axis)
  return [
    v[1] * axis[2] - v[2] * axis[1] + axis[0] * along,
    v[2] * axis[0] - v[0] * axis[2] + axis[1] * along,
    v[0] * axis[1] - v[1] * axis[0] + axis[2] * along,
  ]
}
