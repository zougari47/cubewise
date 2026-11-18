/** The stages of the ZZ method, in the order they are solved. */
export const ZZ_STAGES = [
  'eo-line',
  'first-two-layers',
  'orient-last-layer-corners',
  'permute-last-layer',
] as const

export type ZzStage = (typeof ZZ_STAGES)[number]
