/**
 * The two-look finish that several methods share once the first two layers
 * are solved and the last-layer edges already face up: turn the corners to
 * face up (seven cases), then move the last-layer pieces home (21 cases).
 * Speedsolvers call the two sets OCLL and PLL.
 *
 * All are written for a cube held with the last layer on top.
 */
import { isSolved } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { areSolved, findSequence } from './search.ts'
import { U_TURNS, parseTurns } from './turns.ts'
import type { Turn } from './turns.ts'

/** Turns last-layer corners to face up, keeping the edges facing up. Named after the pattern on top. */
export const CORNER_ORIENTATIONS = {
  /** One corner faces up. */
  sune: "R U R' U R U2 R'",
  /** One corner faces up; the mirror image of the first. */
  antisune: "R U2 R' U' R U' R'",
  /** No corner faces up; they face outwards in two pairs, on opposite sides. */
  doubleSune: "R U R' U R U' R' U R U2 R'",
  /** No corner faces up; only one pair faces the same side. */
  wheel: "R U2 R2 U' R2 U' R2 U2 R",
  /** Two corners side by side face up; the other two face the same side. */
  headlights: "R2 D R' U2 R D' R' U2 R'",
  /** Two corners side by side face up; the other two face opposite sides. */
  chameleon: "r U R' U' r' F R F'",
  /** Two corners face up, diagonally opposite. */
  bowtie: "F' r U R' U' r' F R",
} as const

/**
 * Moves last-layer pieces home without turning any of them. Named by the
 * letters speedsolvers use. Where a sequence leaves the top layer a turn
 * away, that turn is written at its end.
 */
export const PERMUTATIONS = {
  // Corners only
  Aa: "x R' U R' D2 R U' R' D2 R2 x'",
  Ab: "x R2 D2 R U R' D2 R U' R x'",
  E: "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
  // Edges only
  Ua: "M2 U M U2 M' U M2",
  Ub: "M2 U' M U2 M' U' M2",
  H: 'M2 U M2 U2 M2 U M2',
  Z: "M' U M2 U M2 U M' U2 M2 U'",
  // Two corners beside each other change places
  Ja: "R' U L' U2 R U' R' U2 R L U'",
  Jb: "R U R' F' R U R' U' R' F R2 U' R' U'",
  T: "R U R' U' R' F R2 U' R' U' R U R' F'",
  Ra: "R U' R' U' R U R D R' U' R D' R' U2 R' U'",
  Rb: "R2 F R U R U' R' F' R U2 R' U2 R U",
  F: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
  Ga: "R2 U R' U R' U' R U' R2 D U' R' U R D'",
  Gb: "R' U' R U D' R2 U R' U R U' R U' R2 D",
  Gc: "R2 U' R U' R U R' U R2 D' U R U' R' D",
  Gd: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
  // Two diagonally opposite corners change places
  V: "R' U R' U' y R' F' R2 U' R' U R' F R F y'",
  Y: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  Na: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
  Nb: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
} as const

export type CornerOrientationName = keyof typeof CORNER_ORIENTATIONS
export type PermutationName = keyof typeof PERMUTATIONS

const LAST_LAYER = [0, 1, 2, 3]
const LOWER_LAYERS = { corners: [4, 5, 6, 7], edges: [4, 5, 6, 7, 8, 9, 10, 11] }

/** Whether everything below the last layer is solved. */
export const lowerLayersSolved = (view: CubieCube) => areSolved(view, LOWER_LAYERS)

/** Whether every last-layer piece faces up, wherever it sits. */
export const lastLayerFacesUp = (view: CubieCube) =>
  lowerLayersSolved(view) && LAST_LAYER.every((i) => view.co[i] === 0 && view.eo[i] === 0)

const turnsOfAll = (sequences: Record<string, string>) => Object.values(sequences).map(parseTurns)
const ORIENTATION_TURNS = turnsOfAll(CORNER_ORIENTATIONS)
const PERMUTATION_TURNS = turnsOfAll(PERMUTATIONS)

/**
 * Turns the last-layer corners to face up with one sequence. The lower layers
 * must be solved and the last-layer edges must face up already.
 */
export function orientLastLayerCorners(view: CubieCube): Turn[] {
  if (lastLayerFacesUp(view)) return []
  const turns = findSequence(view, {
    before: U_TURNS,
    sequences: ORIENTATION_TURNS,
    done: lastLayerFacesUp,
  })
  if (!turns) throw new Error('The last-layer corners do not match any known case')
  return turns
}

/**
 * Moves the last-layer pieces home with one sequence and solves the cube.
 * Every last-layer piece must face up already.
 */
export function permuteLastLayer(view: CubieCube): Turn[] {
  const turned = findSequence(view, { before: U_TURNS, sequences: [[]], done: isSolved })
  if (turned) return turned
  const turns = findSequence(view, {
    before: U_TURNS,
    sequences: PERMUTATION_TURNS,
    after: U_TURNS,
    done: isSolved,
  })
  if (!turns) throw new Error('The last layer does not match any known case')
  return turns
}
