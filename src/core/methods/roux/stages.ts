/** The stages of the Roux method, in the order they are solved. */
export const ROUX_STAGES = [
  'first-block',
  'second-block',
  'top-corners',
  'orient-last-edges',
  'side-edges',
  'middle-edges',
] as const

export type RouxStage = (typeof ROUX_STAGES)[number]
