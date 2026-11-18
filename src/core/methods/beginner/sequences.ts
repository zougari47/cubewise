/**
 * The move sequences of the beginner method. The beginner solver and the
 * lessons both read them from here, so what is taught is what is played.
 *
 * All are written for a cube held with the first layer at the bottom.
 */
export const SEQUENCES = {
  /** Corner above its slot at front-right, first-layer colour facing right. */
  cornerFacingRight: "R U R'",
  /** Same corner, first-layer colour facing the front. */
  cornerFacingFront: "F' U' F",
  /** Same corner, first-layer colour facing up: turns it into the facing-right case. */
  cornerFacingUp: "R U2 R' U'",
  /** Edge at the top front, matching the front centre, that belongs to the right. */
  edgeToRight: "U R U' R' U' F' U F",
  /** The same edge when it belongs to the left. */
  edgeToLeft: "U' L' U L U F U' F'",
  /** Flips last-layer edges: dot to corner shape to line to cross. */
  lastLayerCross: "F R U R' U' F'",
  /** Moves three last-layer edges round, leaving the one at the right in place. */
  lastLayerEdges: "R U R' U R U2 R'",
  /** Moves three last-layer corners round, leaving the front-right one in place. */
  lastLayerCornerCycle: "U R U' L' U R' U' L",
  /** Twists the front-right corner of the last layer; always done in pairs. */
  lastLayerCornerTwist: "R' D' R D",
} as const
