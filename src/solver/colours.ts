import type { ColourKey, Paint } from './entry.ts'

/** Screen colour of each colour key. */
export const COLOUR_HEX: Record<ColourKey, string> = {
  W: '#ffffff',
  Y: '#facc15',
  R: '#dc2626',
  O: '#f97316',
  B: '#2563eb',
  G: '#16a34a',
}

/** Screen colour of a sticker that has not been painted yet. */
export const UNPAINTED_HEX = '#c4c4cc'

export const hexOf = (paint: Paint) => (paint === null ? UNPAINTED_HEX : COLOUR_HEX[paint])
