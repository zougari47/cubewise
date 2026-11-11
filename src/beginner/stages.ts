/** The stages of the beginner method, in the order they are solved. */
export const BEGINNER_STAGES = [
  'cross',
  'first-layer-corners',
  'middle-layer-edges',
  'last-layer-cross',
  'last-layer-edges',
  'last-layer-corner-positions',
  'last-layer-corner-twists',
] as const

export type BeginnerStage = (typeof BEGINNER_STAGES)[number]
