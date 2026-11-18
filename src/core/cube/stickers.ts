/**
 * Converts between the 54 stickers a user sees and the piece-level cube the
 * solver works on.
 *
 * Stickers are listed face by face in the order U R F D L B, nine per face,
 * read left-to-right, top-to-bottom while looking at that face (U and D are
 * viewed with F nearest to you). The centre is index 4 of each face.
 */
import { findUnsolvableReason } from './cubie.ts'
import type { CubieCube } from './cubie.ts'

export const STICKER_COUNT = 54

/** Sticker indexes of each corner position, starting with its U or D sticker. */
export const CORNER_STICKERS = [
  [8, 9, 20],
  [6, 18, 38],
  [0, 36, 47],
  [2, 45, 11],
  [29, 26, 15],
  [27, 44, 24],
  [33, 53, 42],
  [35, 17, 51],
]

/** Sticker indexes of each edge position. */
export const EDGE_STICKERS = [
  [5, 10],
  [7, 19],
  [3, 37],
  [1, 46],
  [32, 16],
  [28, 25],
  [30, 43],
  [34, 52],
  [23, 12],
  [21, 41],
  [50, 39],
  [48, 14],
]

const faceOf = (sticker: number) => Math.floor(sticker / 9)

const CORNER_FACES = CORNER_STICKERS.map((stickers) => stickers.map(faceOf))
const EDGE_FACES = EDGE_STICKERS.map((stickers) => stickers.map(faceOf))

/**
 * The face (0–5, in U R F D L B order) each of the 54 stickers belongs to
 * when solved. Map faces to the user's colour scheme to get colours.
 */
export function stickersFromCube(cube: CubieCube): number[] {
  const stickers = new Array<number>(STICKER_COUNT)
  for (let face = 0; face < 6; face++) stickers[face * 9 + 4] = face
  for (let position = 0; position < 8; position++) {
    const faces = CORNER_FACES[cube.cp[position]]
    const twist = cube.co[position]
    for (let n = 0; n < 3; n++) {
      stickers[CORNER_STICKERS[position][(n + twist) % 3]] = faces[n]
    }
  }
  for (let position = 0; position < 12; position++) {
    const faces = EDGE_FACES[cube.ep[position]]
    const flip = cube.eo[position]
    for (let n = 0; n < 2; n++) {
      stickers[EDGE_STICKERS[position][(n + flip) % 2]] = faces[n]
    }
  }
  return stickers
}

/** Why a set of entered stickers is not a solvable cube. */
export type StickerError =
  /** Not exactly 54 stickers. */
  | { code: 'wrong-sticker-count' }
  /** Two centres share a colour; `stickers` are those centres. */
  | { code: 'duplicate-centres'; stickers: number[] }
  /** These stickers have a colour that no centre has. */
  | { code: 'unknown-colour'; stickers: number[] }
  /** A colour does not appear nine times; `counts[face]` is how often it does. */
  | { code: 'wrong-colour-count'; counts: number[] }
  /** These stickers form a corner or edge that no cube has. */
  | { code: 'impossible-piece'; stickers: number[] }
  /** The same corner or edge appears twice; `stickers` are both copies. */
  | { code: 'duplicate-piece'; stickers: number[] }
  /** Every piece exists, but one corner is twisted in place. */
  | { code: 'twisted-corner' }
  /** Every piece exists, but one edge is flipped in place. */
  | { code: 'flipped-edge' }
  /** Every piece exists, but two pieces are swapped. */
  | { code: 'swapped-pieces' }

export type StickerResult =
  | { ok: true; cube: CubieCube }
  | { ok: false; error: StickerError }

/**
 * Reads the cube from 54 sticker colours. Colours can be any values (letters,
 * numbers); each face's colour is whatever its centre sticker has, so any
 * colour scheme works as long as the six centres differ.
 */
export function cubeFromStickers(colours: ArrayLike<unknown>): StickerResult {
  if (colours.length !== STICKER_COUNT) {
    return { ok: false, error: { code: 'wrong-sticker-count' } }
  }

  const faceOfColour = new Map<unknown, number>()
  for (let face = 0; face < 6; face++) {
    const centre = face * 9 + 4
    const earlier = faceOfColour.get(colours[centre])
    if (earlier !== undefined) {
      return {
        ok: false,
        error: { code: 'duplicate-centres', stickers: [earlier * 9 + 4, centre] },
      }
    }
    faceOfColour.set(colours[centre], face)
  }

  const faces = new Array<number>(STICKER_COUNT)
  const unknown: number[] = []
  const counts = [0, 0, 0, 0, 0, 0]
  for (let i = 0; i < STICKER_COUNT; i++) {
    const face = faceOfColour.get(colours[i])
    if (face === undefined) {
      unknown.push(i)
    } else {
      faces[i] = face
      counts[face]++
    }
  }
  if (unknown.length > 0) {
    return { ok: false, error: { code: 'unknown-colour', stickers: unknown } }
  }
  if (counts.some((count) => count !== 9)) {
    return { ok: false, error: { code: 'wrong-colour-count', counts } }
  }

  const cp = new Array<number>(8)
  const co = new Array<number>(8)
  const cornerSeenAt = new Array<number>(8).fill(-1)
  for (let position = 0; position < 8; position++) {
    const stickers = CORNER_STICKERS[position]
    let found = false
    for (let twist = 0; twist < 3 && !found; twist++) {
      for (let piece = 0; piece < 8 && !found; piece++) {
        const pieceFaces = CORNER_FACES[piece]
        if (
          faces[stickers[twist]] === pieceFaces[0] &&
          faces[stickers[(twist + 1) % 3]] === pieceFaces[1] &&
          faces[stickers[(twist + 2) % 3]] === pieceFaces[2]
        ) {
          cp[position] = piece
          co[position] = twist
          found = true
        }
      }
    }
    if (!found) {
      return { ok: false, error: { code: 'impossible-piece', stickers } }
    }
    const earlier = cornerSeenAt[cp[position]]
    if (earlier >= 0) {
      return {
        ok: false,
        error: {
          code: 'duplicate-piece',
          stickers: [...CORNER_STICKERS[earlier], ...stickers],
        },
      }
    }
    cornerSeenAt[cp[position]] = position
  }

  const ep = new Array<number>(12)
  const eo = new Array<number>(12)
  const edgeSeenAt = new Array<number>(12).fill(-1)
  for (let position = 0; position < 12; position++) {
    const stickers = EDGE_STICKERS[position]
    let found = false
    for (let flip = 0; flip < 2 && !found; flip++) {
      for (let piece = 0; piece < 12 && !found; piece++) {
        const pieceFaces = EDGE_FACES[piece]
        if (
          faces[stickers[flip]] === pieceFaces[0] &&
          faces[stickers[1 - flip]] === pieceFaces[1]
        ) {
          ep[position] = piece
          eo[position] = flip
          found = true
        }
      }
    }
    if (!found) {
      return { ok: false, error: { code: 'impossible-piece', stickers } }
    }
    const earlier = edgeSeenAt[ep[position]]
    if (earlier >= 0) {
      return {
        ok: false,
        error: {
          code: 'duplicate-piece',
          stickers: [...EDGE_STICKERS[earlier], ...stickers],
        },
      }
    }
    edgeSeenAt[ep[position]] = position
  }

  const cube = { cp, co, ep, eo }
  const reason = findUnsolvableReason(cube)
  if (reason === 'twisted-corner' || reason === 'flipped-edge' || reason === 'swapped-pieces') {
    return { ok: false, error: { code: reason } }
  }
  return { ok: true, cube }
}

/** The stickers currently on the given pieces (by piece number), wherever those pieces are. */
export function stickersOfPieces(
  cube: CubieCube,
  pieces: { corners?: readonly number[]; edges?: readonly number[] },
): number[] {
  const stickers: number[] = []
  cube.cp.forEach((piece, position) => {
    if (pieces.corners?.includes(piece)) stickers.push(...CORNER_STICKERS[position])
  })
  cube.ep.forEach((piece, position) => {
    if (pieces.edges?.includes(piece)) stickers.push(...EDGE_STICKERS[position])
  })
  return stickers
}
