/**
 * The sequences of the Petrus method. The lessons read them from here, and
 * the tests check each against the solver.
 *
 * All are written for a cube held with the small block at the bottom, back,
 * left and the big block along the bottom left, so that the right and the top
 * face are free. The last layer uses the shared sequences in
 * `shared/last-layer.ts`.
 *
 * An edge is "bad" when it cannot go home the right way round with turns of
 * the right and the top face alone, and "good" otherwise.
 */

/**
 * The small block: the bottom-back-left corner and its three edges. It is
 * found by looking, not from a fixed set, so these are worked examples; each
 * builds the block in the fewest moves there are.
 */
export const SMALL_BLOCK_EXAMPLES = {
  /** The corner and two of its edges make a square on the left face; one turn brings it down beside the third edge, which is home. */
  lastTurn: 'L',
  /** The corner and the back-left edge are joined at the front left. Two moves carry the pair over the top to the bottom-left edge, which waits on the left face, and the square they make turns down. */
  pairAndSquare: "F U L'",
  /** Nothing is home. The bottom-back edge goes home in two moves, the second of which also sets the back-left edge on the left face; the corner and the bottom-left edge, joined on top, come down to it; the square turns home. */
  fromScratch: "R' D F' L",
} as const

/**
 * The big block: the bottom-front-left corner, the bottom-front edge and the
 * front-left edge are added with the right, top and front faces only, which
 * leave the small block alone. Worked examples; each adds them in the fewest
 * such moves there are.
 */
export const BIG_BLOCK_EXAMPLES = {
  /** The corner and the bottom-front edge are joined on top. The front-left edge is put on the front face, the pair comes round to it, and the square turns down. */
  pairThenSquare: 'F U F2',
  /** The corner and the front-left edge are joined at the back right. The bottom-front edge is turned to the top front, the pair comes over to it, and the square turns down. */
  pairFromTheBack: "U' R2 F2",
  /** The corner is in its place but twisted. The first move takes it out joined to the front-left edge; the pair goes over the top to the bottom-front edge and the square turns home. */
  twistedCorner: "F' R U F'",
} as const

/**
 * Edge orientation: each sequence makes bad edges good and puts the big block
 * back. A quarter turn of the front or the back face takes part of the block
 * out; the free face that part is not on is turned; the block is put back.
 * Each is named after the places of the bad edges it is for, which are the
 * edges it changes: `ul` top left, `fr` front right, `dr` bottom right and so
 * on. Between sequences the solver only turns the right and the top face.
 *
 * These are the sequences Lars Petrus gives for this stage, without the
 * turns of the right and the top face that some begin with.
 */
export const EDGE_FLIPS = {
  // Two bad edges
  /** Top left and front right. */
  ulFr: "F' U' F",
  /** Top right and top front. */
  urUf: "F R' F'",
  /** Top front and bottom right. */
  ufDr: "F R F'",
  /** Top left and back right. */
  ulBr: "B U B'",
  /** Top front and back right. */
  ufBr: "B U2 B'",
  /** Top right and back right. */
  urBr: "B U' B'",
  // Four bad edges
  /** Top front, top left, front right and back right. */
  ufUlFrBr: "F' U' F2 R2 F'",
  /** Top front, top left, bottom right and front right. */
  ufUlDrFr: "F' U' F2 R F'",
  /** Top front, top left, top back and front right. */
  ufUlUbFr: "F' U2 F2 R' F'",
  /** Top front, top back, front right and back right. */
  ufUbFrBr: "F' U2 F2 R2 F'",
  /** Top right, top front, top left and front right. */
  urUfUlFr: "F R' F2 U' F",
  /** Top right, top front, top back and front right. */
  urUfUbFr: "F R' F2 U2 F",
  /** Top right, top front, top back and bottom right. */
  urUfUbDr: "F B' R F' B",
  // Six bad edges
  /** Every free edge but the one at the front right. */
  urUfUlUbDrBr: "F B' R F' B2 U B'",
} as const

/**
 * The first two layers, with the right and the top face only. Worked
 * examples; each finishes the stage in the fewest such moves there are for
 * the layer it leaves for last.
 */
export const LAYER_EXAMPLES = {
  /** The bottom-right edge, the front-right corner and the front-right edge become a square on the right face and turn down together. */
  square: "R2 U' R'",
  /** The last corner and edge are joined on top; they go into the back-right slot while the square steps aside. */
  backPair: "U' R' U R",
  /** The last corner and edge sit side by side on top but do not match; they are parted, joined and put in. */
  misaligned: "R' U2 R U R' U' R",
  /** The other choice: the five pieces go to the left of the top layer, the right layer is left for last, and the cube is turned to put it on top. */
  rightLast: "R U' z'",
} as const
