/**
 * Colours as a camera reads them, and how far apart two of them look.
 * Pure maths only; no browser code.
 */

/** Red, green and blue, each 0–255. */
export type Rgb = [number, number, number]

/** Lightness, green–red and blue–yellow: a space where distance matches what the eye sees. */
export type Lab = [number, number, number]

const linear = (channel: number) => {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

const labCurve = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (t * (24389 / 27) + 16) / 116)

export function rgbToLab([red, green, blue]: Rgb): Lab {
  const r = linear(red)
  const g = linear(green)
  const b = linear(blue)
  const x = labCurve((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047)
  const y = labCurve(0.2126729 * r + 0.7151522 * g + 0.072175 * b)
  const z = labCurve((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883)
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
}

/** Lightness counts for little: a sticker in shadow is still the same colour. */
const LIGHTNESS_WEIGHT = 0.3

/** Hue and strength of colour with brightness divided out, so shadow and exposure barely move them. */
const tint = (lab: Lab): [number, number] => [(100 * lab[1]) / (lab[0] + 16), (100 * lab[2]) / (lab[0] + 16)]

export function colourDistance(a: Lab, b: Lab): number {
  const [a1, a2] = tint(a)
  const [b1, b2] = tint(b)
  return Math.hypot((a[0] - b[0]) * LIGHTNESS_WEIGHT, a1 - b1, a2 - b2)
}

export function hexToRgb(hex: string): Rgb {
  const value = parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

export function rgbToHex(rgb: Rgb): string {
  return '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')
}

export function meanColour<T extends number[]>(colours: readonly T[]): T {
  const sum = colours[0].map(() => 0)
  for (const colour of colours) colour.forEach((value, i) => (sum[i] += value))
  return sum.map((value) => value / colours.length) as T
}
