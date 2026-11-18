/** The stages of the Petrus method, in the order they are solved. */
export const PETRUS_STAGES = [
  'small-block',
  'big-block',
  'edge-orientation',
  'first-two-layers',
  'orient-last-layer-corners',
  'permute-last-layer',
] as const

export type PetrusStage = (typeof PETRUS_STAGES)[number]
