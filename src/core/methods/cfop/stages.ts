/** The stages of CFOP, in the order they are solved. */
export const CFOP_STAGES = [
  'cross',
  'first-two-layers',
  'orient-last-layer',
  'permute-last-layer',
] as const

export type CfopStage = (typeof CFOP_STAGES)[number]
