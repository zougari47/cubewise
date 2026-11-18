/** The stages of the keyhole method, in the order they are solved. */
export const KEYHOLE_STAGES = [
  'cross',
  'three-corners',
  'keyhole-edges',
  'last-corner',
  'last-layer-cross',
  'last-layer-edges',
  'last-layer-corner-positions',
  'last-layer-corner-twists',
] as const

export type KeyholeStage = (typeof KEYHOLE_STAGES)[number]
