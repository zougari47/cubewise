/**
 * Finding a cube face anywhere in a camera picture, so the user does not have
 * to line it up with anything.
 *
 * A face is a square of nine even patches, each a cube colour, with something
 * between every two neighbours: a different colour or a dark gap. Squares of
 * many sizes and places are scored on how well they fit that, and the best
 * one wins if it fits well enough. The face has to be held roughly upright
 * and facing the camera.
 */
import type { Guide, Pixels } from './sample.ts'

/** The smallest and largest face looked for, as a share of the picture's shorter side. */
const MIN_SIZE = 0.25
const MAX_SIZE = 0.96
/** Each size tried is this much larger than the one before. */
const SIZE_STEP = 1.12
/** Places tried per size are this share of a sticker apart. */
const PLACE_STEP = 0.25
/** How many of the best rough fits are then nudged into place. */
const REFINED = 4

/** The middle share of a sticker that is looked at, clear of its borders. */
const PATCH = 0.5
/** Width of the strip looked at between two stickers, as a share of a sticker. */
const GAP = 0.12
/** Unevenness of one patch counts no higher than this (a logo, a finger). */
const SPREAD_CAP = 40
/** Average unevenness above which a square cannot be a face. */
const MAX_SPREAD = 18
/** How much average unevenness takes the whole score away. */
const SPREAD_SCALE = 80
/** A wider share of each sticker, uneven as soon as the square is a little off: it settles the exact place. */
const WIDE_PATCH = 0.8
/** How much unevenness of the wider patches takes the whole score away. */
const WIDE_SCALE = 300
/** Two patches this far apart in colour are different stickers. */
const DIFFERENT = 45
/** A gap is dark when it is below this share of the darker sticker beside it. */
const DARK = 0.8
/** A patch whose channels differ by this much is a strong colour. */
const VIVID = 40
/** A patch this bright can be white. */
const LIGHT = 100
/** The lowest score that counts as a face, out of 1. */
const MIN_SCORE = 0.55

/** Running totals over a picture, so the sum over any rectangle takes four look-ups. */
interface Totals {
  width: number
  height: number
  red: Float64Array
  green: Float64Array
  blue: Float64Array
  /** Total of red² + green² + blue². */
  squares: Float64Array
}

function totalsOf(pixels: Pixels): Totals {
  const { width, height, data } = pixels
  const stride = width + 1
  const make = () => new Float64Array(stride * (height + 1))
  const totals: Totals = { width, height, red: make(), green: make(), blue: make(), squares: make() }
  for (let y = 0; y < height; y++) {
    let red = 0
    let green = 0
    let blue = 0
    let squares = 0
    for (let x = 0; x < width; x++) {
      const at = (y * width + x) * 4
      const r = data[at]
      const g = data[at + 1]
      const b = data[at + 2]
      red += r
      green += g
      blue += b
      squares += r * r + g * g + b * b
      const here = (y + 1) * stride + x + 1
      const above = here - stride
      totals.red[here] = totals.red[above] + red
      totals.green[here] = totals.green[above] + green
      totals.blue[here] = totals.blue[above] + blue
      totals.squares[here] = totals.squares[above] + squares
    }
  }
  return totals
}

/** A rectangle of the picture: its average colour, brightness and unevenness. */
interface Area {
  red: number
  green: number
  blue: number
  light: number
  spread: number
}

/** The rectangle from (left, top) up to but not including (right, bottom); null if none of it is in the picture. */
function area(totals: Totals, left: number, top: number, right: number, bottom: number): Area | null {
  const x0 = Math.max(0, Math.round(left))
  const y0 = Math.max(0, Math.round(top))
  const x1 = Math.min(totals.width, Math.max(x0 + 1, Math.round(right)))
  const y1 = Math.min(totals.height, Math.max(y0 + 1, Math.round(bottom)))
  if (x1 <= x0 || y1 <= y0) return null
  const stride = totals.width + 1
  const a = y0 * stride + x0
  const b = y0 * stride + x1
  const c = y1 * stride + x0
  const d = y1 * stride + x1
  const count = (x1 - x0) * (y1 - y0)
  const sum = (table: Float64Array) => (table[d] - table[b] - table[c] + table[a]) / count
  const red = sum(totals.red)
  const green = sum(totals.green)
  const blue = sum(totals.blue)
  const variance = (sum(totals.squares) - red * red - green * green - blue * blue) / 3
  return { red, green, blue, light: (red + green + blue) / 3, spread: Math.sqrt(Math.max(0, variance)) }
}

const apart = (a: Area, b: Area) => Math.hypot(a.red - b.red, a.green - b.green, a.blue - b.blue)

/** How well the square at (x, y) fits a cube face, from 0 (not at all) to about 1. */
function fit(totals: Totals, x: number, y: number, size: number): number {
  if (x < 0 || y < 0 || x + size > totals.width || y + size > totals.height) return 0
  const cell = size / 3
  const edge = (1 - PATCH) / 2

  const patches: Area[] = []
  let spread = 0
  let cubeColoured = 0
  let vivid = 0
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const patch = area(
        totals,
        x + (col + edge) * cell,
        y + (row + edge) * cell,
        x + (col + 1 - edge) * cell,
        y + (row + 1 - edge) * cell,
      )
      if (!patch) return 0
      patches.push(patch)
      spread += Math.min(patch.spread, SPREAD_CAP)
      const strength = Math.max(patch.red, patch.green, patch.blue) - Math.min(patch.red, patch.green, patch.blue)
      if (strength >= VIVID) vivid++
      if (strength >= VIVID || patch.light >= LIGHT) cubeColoured++
    }
  }
  spread /= 9
  if (spread > MAX_SPREAD || cubeColoured < 8 || vivid < 2) return 0

  const half = (GAP * cell) / 2
  /** Whether a strip, and what lies past it, sets a sticker apart from its surroundings. */
  const parted = (sticker: Area, beyond: Area | null, strip: Area | null) => {
    if (!beyond) return true
    if (apart(sticker, beyond) > DIFFERENT) return true
    return strip !== null && strip.light < DARK * Math.min(sticker.light, beyond.light)
  }

  let partings = 0
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const sticker = patches[row * 3 + col]
      const top = y + (row + edge) * cell
      const bottom = y + (row + 1 - edge) * cell
      const left = x + (col + edge) * cell
      const right = x + (col + 1 - edge) * cell

      // To the right: the next sticker, or what is just outside the face.
      const lineX = x + (col + 1) * cell
      const rightOf =
        col < 2 ? patches[row * 3 + col + 1] : area(totals, lineX + 0.04 * cell, top, lineX + 0.2 * cell, bottom)
      if (parted(sticker, rightOf, area(totals, lineX - half, top, lineX + half, bottom))) partings++
      // Below.
      const lineY = y + (row + 1) * cell
      const below =
        row < 2 ? patches[(row + 1) * 3 + col] : area(totals, left, lineY + 0.04 * cell, right, lineY + 0.2 * cell)
      if (parted(sticker, below, area(totals, left, lineY - half, right, lineY + half))) partings++
      // The outside on the left and above, for the first column and row.
      if (col === 0) {
        const outside = area(totals, x - 0.2 * cell, top, x - 0.04 * cell, bottom)
        if (parted(sticker, x - 0.2 * cell < 0 ? null : outside, area(totals, x - half, top, x + half, bottom))) partings++
      }
      if (row === 0) {
        const outside = area(totals, left, y - 0.2 * cell, right, y - 0.04 * cell)
        if (parted(sticker, y - 0.2 * cell < 0 ? null : outside, area(totals, left, y - half, right, y + half))) partings++
      }
    }
  }

  let wide = 0
  const wideEdge = (1 - WIDE_PATCH) / 2
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const patch = area(
        totals,
        x + (col + wideEdge) * cell,
        y + (row + wideEdge) * cell,
        x + (col + 1 - wideEdge) * cell,
        y + (row + 1 - wideEdge) * cell,
      )
      wide += Math.min(patch?.spread ?? SPREAD_CAP, SPREAD_CAP)
    }
  }
  return partings / 24 - spread / SPREAD_SCALE - wide / 9 / WIDE_SCALE
}

interface Square {
  x: number
  y: number
  size: number
  score: number
}

/**
 * The square holding a cube face in a picture, or null if none is found.
 * The picture should be small (about 160 pixels a side is plenty) and square.
 */
export function findFace(pixels: Pixels): Guide | null {
  const totals = totalsOf(pixels)
  const short = Math.min(pixels.width, pixels.height)

  const rough: Square[] = []
  for (let size = short * MIN_SIZE; size <= short * MAX_SIZE; size *= SIZE_STEP) {
    const step = Math.max(1, (size / 3) * PLACE_STEP)
    for (let y = 0; y + size <= pixels.height; y += step) {
      for (let x = 0; x + size <= pixels.width; x += step) {
        const score = fit(totals, x, y, size)
        if (score > 0) rough.push({ x, y, size, score })
      }
    }
  }
  rough.sort((a, b) => b.score - a.score)

  let best: Square | null = null
  for (const start of rough.slice(0, REFINED)) {
    let square = start
    // Nudge it by ever smaller steps, in place and in size, while that helps.
    for (let step = square.size / 24; step >= 0.5; step /= 2) {
      let improved = true
      while (improved) {
        improved = false
        const tries: [number, number, number][] = [
          [-step, 0, 0],
          [step, 0, 0],
          [0, -step, 0],
          [0, step, 0],
          // Grow or shrink about the middle.
          [-step, -step, 2 * step],
          [step, step, -2 * step],
        ]
        for (const [dx, dy, grow] of tries) {
          const x = square.x + dx
          const y = square.y + dy
          const size = square.size + grow
          const score = fit(totals, x, y, size)
          if (score > square.score) {
            square = { x, y, size, score }
            improved = true
          }
        }
      }
    }
    if (!best || square.score > best.score) best = square
  }
  if (!best || best.score < MIN_SCORE) return null
  return { x: best.x / pixels.width, y: best.y / pixels.height, size: best.size / pixels.width }
}
