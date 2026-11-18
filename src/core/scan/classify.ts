/**
 * Working out the colour of every sticker once all six faces are captured.
 *
 * Nothing is decided face by face. The six centres are six different colours
 * read by this camera in this light, so they are the reference; every other
 * sticker is on a corner or an edge, and a cube has each of those pieces
 * exactly once. So the pieces are placed together: each corner and edge
 * position gets the piece its stickers look most like, and no piece is used
 * twice. A sticker that is unclear by itself is settled by the others.
 */
import { CORNER_STICKERS, EDGE_STICKERS, STICKER_COUNT } from '../cube/stickers.ts'
import { colourDistance, meanColour, rgbToLab } from './colour.ts'
import type { Lab, Rgb } from './colour.ts'

const FACE_COUNT = 6
const centreOf = (face: number) => face * 9 + 4
const faceOf = (sticker: number) => Math.floor(sticker / 9)

const CORNER_FACES = CORNER_STICKERS.map((stickers) => stickers.map(faceOf))
const EDGE_FACES = EDGE_STICKERS.map((stickers) => stickers.map(faceOf))

/** Times the colours are looked at again with what the last pass learnt about each one. */
const PASSES = 3
/** How many stickers' worth a centre counts for when working out how its colour looks. */
const CENTRE_WEIGHT = 3

/**
 * The face (0–5, in U R F D L B order) each of the 54 stickers belongs to,
 * from what the camera read for each, in the order of `cube/stickers.ts`.
 * Every corner and edge in the answer is a real piece, used once.
 */
export function guessCube(read: readonly Rgb[]): number[] {
  const labs = read.map(rgbToLab)
  const faces = new Array<number>(STICKER_COUNT).fill(0)
  for (let face = 0; face < FACE_COUNT; face++) faces[centreOf(face)] = face

  let looks = Array.from({ length: FACE_COUNT }, (_, face) => labs[centreOf(face)])
  for (let pass = 0; pass < PASSES; pass++) {
    const cost = labs.map((lab) => looks.map((look) => colourDistance(lab, look)))
    placePieces(CORNER_STICKERS, CORNER_FACES, cost, faces)
    placePieces(EDGE_STICKERS, EDGE_FACES, cost, faces)
    looks = looks.map((_, face) => {
      const examples: Lab[] = new Array<Lab>(CENTRE_WEIGHT).fill(labs[centreOf(face)])
      faces.forEach((label, sticker) => {
        if (label === face && sticker !== centreOf(face)) examples.push(labs[sticker])
      })
      return meanColour(examples)
    })
  }
  return faces
}

/**
 * Gives every position the piece, and the way round, that its stickers look
 * most like, using each piece once, and writes the result into `faces`.
 */
function placePieces(positions: number[][], pieces: number[][], cost: number[][], faces: number[]) {
  const size = positions[0].length
  const turns = positions.map(() => new Array<number>(pieces.length).fill(0))
  const table = positions.map((stickers, position) =>
    pieces.map((pieceFaces, piece) => {
      let best = Infinity
      for (let turn = 0; turn < size; turn++) {
        let sum = 0
        for (let n = 0; n < size; n++) sum += cost[stickers[(n + turn) % size]][pieceFaces[n]]
        if (sum < best) {
          best = sum
          turns[position][piece] = turn
        }
      }
      return best
    }),
  )
  cheapestPairing(table).forEach((piece, position) => {
    const turn = turns[position][piece]
    for (let n = 0; n < size; n++) faces[positions[position][(n + turn) % size]] = pieces[piece][n]
  })
}

/**
 * Which of the usual colours each centre is: the pairing of centres with
 * colours that fits best overall, each colour used once.
 * @param usual how each colour usually looks to a camera
 * @returns for each centre, a position in `usual`
 */
export function nameCentres(centres: readonly Rgb[], usual: readonly Rgb[]): number[] {
  const usualLabs = usual.map(rgbToLab)
  return cheapestPairing(
    centres.map((centre) => {
      const lab = rgbToLab(centre)
      return usualLabs.map((look) => colourDistance(lab, look))
    }),
  )
}

/**
 * Pairs every row with a different column so the costs add up to the least
 * possible (the Hungarian method). Returns the column of each row.
 */
export function cheapestPairing(cost: readonly (readonly number[])[]): number[] {
  const n = cost.length
  const rowOffset = new Array<number>(n + 1).fill(0)
  const columnOffset = new Array<number>(n + 1).fill(0)
  /** The row paired with each column, both counted from 1; 0 is none. */
  const rowOf = new Array<number>(n + 1).fill(0)
  const cameFrom = new Array<number>(n + 1).fill(0)
  for (let row = 1; row <= n; row++) {
    rowOf[0] = row
    let column = 0
    const least = new Array<number>(n + 1).fill(Infinity)
    const used = new Array<boolean>(n + 1).fill(false)
    do {
      used[column] = true
      const current = rowOf[column]
      let delta = Infinity
      let next = 0
      for (let j = 1; j <= n; j++) {
        if (used[j]) continue
        const reduced = cost[current - 1][j - 1] - rowOffset[current] - columnOffset[j]
        if (reduced < least[j]) {
          least[j] = reduced
          cameFrom[j] = column
        }
        if (least[j] < delta) {
          delta = least[j]
          next = j
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          rowOffset[rowOf[j]] += delta
          columnOffset[j] -= delta
        } else {
          least[j] -= delta
        }
      }
      column = next
    } while (rowOf[column] !== 0)
    do {
      const previous = cameFrom[column]
      rowOf[column] = rowOf[previous]
      column = previous
    } while (column !== 0)
  }
  const columns = new Array<number>(n)
  for (let j = 1; j <= n; j++) columns[rowOf[j] - 1] = j - 1
  return columns
}
