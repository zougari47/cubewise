/**
 * The sequences of the ZZ method. The lessons read them from here, and the
 * tests check that the solver finds each in the same number of moves.
 *
 * The first two stages are found by looking, not from a fixed set, so these
 * are worked examples. The last layer uses the shared sequences in
 * `shared/last-layer.ts`. All are written for a cube held with the line at
 * the bottom, running from front to back.
 *
 * An edge is "bad" when it cannot go home the right way round without a
 * quarter turn of the front or the back face, and "good" otherwise.
 */

/**
 * The first stage: every edge good, and the bottom-front and bottom-back
 * edges home. Each example solves the whole cube it starts from, in the
 * fewest moves the stage can take.
 */
export const EO_LINE_EXAMPLES = {
  /** Four bad edges, all on the front face: one turn of it makes them good. */
  fourBad: 'F',
  /** Three bad edges on the front face and the fourth at the bottom right: two moves bring all four onto the front face. */
  gather: 'R U F',
  /** Two bad edges, at the top left and the front left. The first turn makes one good and three others bad: four in all. */
  twoBad: "F U' F",
  /** Every edge is good; the line edges are at the top right and the top front and go down with half turns. */
  lineEdges: 'U F2 U B2',
  /** Four bad edges, one of them the front line edge at the bottom right; the turn that makes them good takes it home. */
  together: "R F U' B2",
} as const

/**
 * The first two layers: two blocks, with `R`, `U` and `L` moves only. Each
 * example starts with the line home and every edge good, and finishes the
 * block it works on in the fewest moves there are.
 */
export const BLOCK_EXAMPLES = {
  /** The bottom-right edge is in the top layer at the back: a turn of the top, then a half turn takes it down. */
  bottomEdge: 'U R2',
  /** A corner and its edge, joined in the top layer, go into the front-right slot. */
  frontPair: "U R U' R'",
  /** A corner above the front-right slot and its edge at the top back: the first two moves join them. */
  splitPair: "R U R'",
  /** A joined pair goes into the back-right slot, with no whole-cube turn. */
  backPair: "U' R' U R",
  /** A joined pair goes into the front-left slot with the left hand: the mirror image of `frontPair`. */
  leftPair: "U' L' U L",
} as const
