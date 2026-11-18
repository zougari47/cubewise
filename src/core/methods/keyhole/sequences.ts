/**
 * The move sequences that the keyhole method adds to the beginner method.
 * The first-layer corners and the last layer use the beginner method's own
 * sequences (`../beginner/sequences.ts`). The keyhole solver and the lessons
 * both read from here, so what is taught is what is played.
 *
 * All are written for a cube held with the first layer at the bottom. The
 * keyhole is the one corner place of the first layer that is left unsolved.
 */

/**
 * Putting a middle-layer edge in through the keyhole. The keyhole must be
 * directly below the edge's place. Each changes only that place, the keyhole
 * and the top layer.
 */
export const KEYHOLE_INSERTS = {
  /** Edge at the top front that belongs at the front right, its top sticker matching the front centre. */
  rightFromFront: "R U' R'",
  /** Edge at the top right that belongs at the front right, its top sticker matching the right centre. */
  rightFromSide: "F' U F",
  /** Edge at the top front that belongs at the front left, its top sticker matching the front centre. */
  leftFromFront: "L' U L",
  /** Edge at the top left that belongs at the front left, its top sticker matching the left centre. */
  leftFromSide: "F U' F'",
} as const

/**
 * Putting the last first-layer corner into the front-right place once all
 * four middle-layer edges are in. Each keeps the cross, the other three
 * corners and all four middle-layer edges.
 */
export const LAST_CORNERS = {
  /** Corner above its place, first-layer colour facing right. */
  facingRight: "U R U R' U2 R U R'",
  /** Corner above its place, first-layer colour facing the front. */
  facingFront: "U' R U' R' U' R U2 R'",
  /** Corner above its place, first-layer colour facing up. */
  facingUp: 'R2 U R2 U R2 U2 R2',
  /** Corner in its place but twisted, first-layer colour facing right. */
  twistedFacingRight: "R U2 R U R' U R U2 R2",
  /** Corner in its place but twisted, first-layer colour facing the front. */
  twistedFacingFront: "R2 U2 R' U' R U' R' U2 R'",
} as const

export type KeyholeInsertName = keyof typeof KEYHOLE_INSERTS
export type LastCornerName = keyof typeof LAST_CORNERS
