/**
 * Reading the nine stickers of a face out of a camera picture, using a fixed
 * guide square the user lines the face up with.
 */
import type { Rgb } from './colour.ts'

/** A picture as rows of RGBA bytes, the shape of a canvas `ImageData`. */
export interface Pixels {
  data: ArrayLike<number>
  width: number
  height: number
}

/** The guide square, as fractions of the picture's width and height. */
export interface Guide {
  x: number
  y: number
  size: number
}

/** The guide square drawn over the camera picture: centred, 70% wide. */
export const GUIDE: Guide = { x: 0.15, y: 0.15, size: 0.7 }

/** How much of each cell is read, from its middle, so sticker borders are left out. */
const PATCH = 0.4

export interface StickerSample {
  colour: Rgb
  /** How uneven the patch is once glare and shadow are left out; high when it crosses a border. */
  spread: number
}

/** The nine stickers inside the guide, read left-to-right, top-to-bottom. */
export function sampleFace(pixels: Pixels, guide: Guide = GUIDE): StickerSample[] {
  const samples: StickerSample[] = []
  const cellWidth = (guide.size * pixels.width) / 3
  const cellHeight = (guide.size * pixels.height) / 3
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const centreX = guide.x * pixels.width + (col + 0.5) * cellWidth
      const centreY = guide.y * pixels.height + (row + 0.5) * cellHeight
      samples.push(
        samplePatch(
          pixels,
          Math.round(centreX - (cellWidth * PATCH) / 2),
          Math.round(centreY - (cellHeight * PATCH) / 2),
          Math.max(1, Math.round(cellWidth * PATCH)),
          Math.max(1, Math.round(cellHeight * PATCH)),
        ),
      )
    }
  }
  return samples
}

/** Share of a patch's pixels left out at each end of brightness: glare and shadow. */
const TRIM = 0.2

function samplePatch(pixels: Pixels, left: number, top: number, width: number, height: number): StickerSample {
  const found: { brightness: number; at: number }[] = []
  for (let y = Math.max(0, top); y < Math.min(pixels.height, top + height); y++) {
    for (let x = Math.max(0, left); x < Math.min(pixels.width, left + width); x++) {
      const at = (y * pixels.width + x) * 4
      found.push({ brightness: pixels.data[at] + pixels.data[at + 1] + pixels.data[at + 2], at })
    }
  }
  if (found.length === 0) return { colour: [0, 0, 0], spread: 0 }
  found.sort((a, b) => a.brightness - b.brightness)
  const skip = Math.floor(found.length * TRIM)
  const kept = found.slice(skip, found.length - skip)

  const sum = [0, 0, 0]
  const squares = [0, 0, 0]
  for (const { at } of kept) {
    for (let c = 0; c < 3; c++) {
      const value = pixels.data[at + c]
      sum[c] += value
      squares[c] += value * value
    }
  }
  const colour = sum.map((value) => value / kept.length) as Rgb
  const variance = squares.reduce((total, value, c) => total + value / kept.length - colour[c] ** 2, 0) / 3
  return { colour, spread: Math.sqrt(Math.max(0, variance)) }
}

/** The largest change in any one sticker between two readings of a face. */
export function faceChange(a: readonly StickerSample[], b: readonly StickerSample[]): number {
  return Math.max(
    ...a.map((sample, i) =>
      Math.hypot(...sample.colour.map((value, c) => value - b[i].colour[c])),
    ),
  )
}

/**
 * One colour per sticker from several readings of the same face: the middle
 * value of each channel, so a single blurred or glaring frame is ignored.
 */
export function steadyColours(readings: readonly (readonly StickerSample[])[]): Rgb[] {
  const middle = (values: number[]) => {
    values.sort((a, b) => a - b)
    const half = values.length >> 1
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2
  }
  return readings[0].map(
    (_, cell) => [0, 1, 2].map((c) => middle(readings.map((reading) => reading[cell].colour[c]))) as Rgb,
  )
}
