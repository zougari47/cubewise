/**
 * The move sequences of CFOP. The CFOP solver and the lessons both read them
 * from here, so what is taught is what is played.
 *
 * All are written for a cube held with the cross at the bottom. The last
 * stage uses the 21 `PERMUTATIONS` of `../shared/last-layer.ts` as they are.
 */
import { CORNER_ORIENTATIONS } from '../shared/last-layer.ts'

/**
 * Examples for the cross lesson. The cross itself is planned afresh for every
 * cube, so the solver searches for it instead of reading these. Each brings
 * home the cross edges that are away and keeps the others.
 */
export const CROSS_EXAMPLES = {
  /** Front cross edge in the top layer, above its place, cross colour facing up. */
  fromTop: 'F2',
  /** Right cross edge in the middle layer at the front right, cross colour facing the front. */
  fromMiddle: "R'",
  /** Front cross edge at the top front, cross colour facing the front. */
  facingFront: "U' R' F R",
  /** Front cross edge in its place but flipped. */
  flipped: "F' D R' D'",
  /** The whole cross made on the bottom, one quarter turn away from the side centres. */
  bottomTurn: 'D',
} as const

/**
 * Examples for the first-two-layers lesson: a corner and its edge going into
 * the front-right slot. The solver searches for each pair instead of reading
 * these, and never needs more moves than they do. Each keeps the cross and
 * the other three slots.
 */
export const PAIR_EXAMPLES = {
  /** The pair joined above the slot: corner with the cross colour facing the front, edge beside it at the top right. */
  joinedInsert: "U R U' R'",
  /** Corner above the slot, cross colour facing right; edge at the top back, ready to meet it. */
  splitInsert: "R U R'",
  /** The mirror image of the first: corner with the cross colour facing right, edge beside it at the top front. */
  joinedInsertFront: "U' F' U F",
  /** The mirror image of the second: corner with the cross colour facing the front; edge at the top left. */
  splitInsertFront: "F' U' F",
  /** Corner above the slot, cross colour facing the front; edge at the top back showing the same colour on top: join them, then insert. */
  joinThenInsert: "U' R U R' U2 R U' R'",
  /** Corner above the slot, cross colour facing up; edge at the top back. */
  cornerFacingUp: "U R U2 R' U R U' R'",
  /** Corner in the slot but twisted, cross colour facing the front; edge at the top right. */
  cornerTwistedInSlot: "R U' R' U R U' R'",
} as const

/**
 * Orienting the last layer when its edges already show a cross: the seven
 * shared corner sequences (speedsolvers' cases 21 to 27).
 */
export const CROSS_ORIENTATIONS = CORNER_ORIENTATIONS

/**
 * Orienting the last layer when two opposite edges face up and make a line
 * with the centre. Named by speedsolvers' case numbers; the comments give the
 * name of the shape on top and which corners face up before the sequence.
 * Each turns every last-layer piece to face up and keeps the first two
 * layers; the pieces of the last layer change places.
 */
export const LINE_ORIENTATIONS = {
  /** T shape: line left to right, both right corners up; the left corners face the front and the back. */
  oll33: "R U R' U' R' F R F'",
  /** T shape: line left to right, both right corners up; the left corners both face left. */
  oll45: "F R U R' U' F'",
  /** C shape: line left to right, both front corners up. */
  oll34: "R U R2 U' R' F R U R U' F'",
  /** C shape: line front to back, both left corners up. */
  oll46: "R' U' R' F R F' U R",
  /** I shape: line left to right, no corner up; two corners face the front and two the back, in pairs. */
  oll51: "f R U R' U' R U R' U' f'",
  /** I shape: line front to back, no corner up; both right corners face right. */
  oll52: "R U R' U R U' B U' B' R'",
  /** I shape: line left to right, no corner up; the front shows three of the top colour and so does the back. */
  oll55: "R' F R U R U' R2 F' R2 U' R' U R U R'",
  /** I shape: line left to right, no corner up; the corners face left and right. */
  oll56: "r' U' r U' R' U R U' R' U R r' U r",
  /** Knight move: line left to right, front-left corner up. */
  oll13: "F U R U' R2 F' R U R U' R'",
  /** Knight move: line left to right, front-right corner up; the mirror image of 13. */
  oll14: "R' F R U R' F' R F U' F'",
  /** Knight move: line left to right, front-right corner up; the back shows two of the top colour. */
  oll15: "r' U' r R' U' R U r' U r",
  /** Knight move: line left to right, back-right corner up; the mirror image of 15. */
  oll16: "r U r' R U R' U' r U' r'",
  /** Big lightning bolt: line left to right, back-right and front-left corners up. */
  oll39: "L F' L' U' L U F U' L'",
  /** Big lightning bolt: line left to right, back-left and front-right corners up; the mirror image of 39. */
  oll40: "R' F R U R' U' F' U R",
  /** All four corners up; only the front and back edges are flipped. */
  oll57: "R U R' U' M' U R U' r'",
} as const

/**
 * Orienting the last layer when two neighbouring edges face up and make an L
 * with the centre. Named and described like the line cases.
 */
export const ANGLE_ORIENTATIONS = {
  /** Square: front and right edges and the front-right corner up. */
  oll5: "r' U2 R U R' U r",
  /** Square: back and right edges and the back-right corner up; the mirror image of 5. */
  oll6: "r U2 R' U' R U' r'",
  /** Small lightning bolt: back and left edges up, front-left corner up. */
  oll7: "r U R' U R U2 r'",
  /** Small lightning bolt: front and left edges up, back-left corner up; the mirror image of 7. */
  oll8: "r' U' R U' R' U2 r",
  /** Small lightning bolt: front and right edges up, front-left corner up. */
  oll11: "r' R2 U R' U R U2 R' U M'",
  /** Small lightning bolt: back and right edges up, back-left corner up; the mirror image of 11. */
  oll12: "M' R' U' R U' R' U2 R U' M",
  /** Fish: back and left edges up, front-right corner up. */
  oll9: "R U R' U' R' F R2 U R' U' F'",
  /** Fish: front and left edges up, back-right corner up; the mirror image of 9. */
  oll10: "R U R' U R' F R F' R U2 R'",
  /** Fish: front and right edges up, back-left and front-right corners up. */
  oll35: "R U2 R2 F R F' R U2 R'",
  /** Fish: back and left edges up, back-left and front-right corners up. */
  oll37: "F R U' R' U' R U R' F'",
  /** P shape: back and right edges up, both right corners up. */
  oll31: "R' U' F U R U' R' F' R",
  /** P shape: front and right edges up, both right corners up; the back shows two of the top colour. */
  oll32: "S R U R' U' R' F R f'",
  /** P shape: front and left edges up, both left corners up; the right shows three of the top colour. */
  oll43: "f' L' U' L U f",
  /** P shape: front and right edges up, both right corners up; the left shows three of the top colour. */
  oll44: "f R U R' U' f'",
  /** W shape: back and right edges up, back-left and front-right corners up. */
  oll36: "L' U' L U' L' U L U L F' L' F",
  /** W shape: back and left edges up, back-right and front-left corners up; the mirror image of 36. */
  oll38: "R U R' U R U' R' U' R' F R F'",
  /** Awkward shape: front and left edges up, both back corners up; the right shows two of the top colour. */
  oll29: "M U R U R' U' R' F R F' M'",
  /** Awkward shape: back and left edges up, both front corners up; the right shows two of the top colour. */
  oll30: "F R' F R2 U' R' U' R U R' F2",
  /** Awkward shape: back and left edges up, both front corners up; the back shows two of the top colour. */
  oll41: "R U R' U R U2 R' F R U R' U' F'",
  /** Awkward shape: front and left edges up, both back corners up; the front shows two of the top colour. */
  oll42: "R' U' R U' R' U2 R F R U R' U' F'",
  /** Small L: back and right edges up, no corner up; the front and the right each show two of the top colour. */
  oll47: "F' L' U' L U L' U' L U F",
  /** Small L: back and left edges up, no corner up; the mirror image of 47. */
  oll48: "F R U R' U' R U R' U' F'",
  /** Small L: back and right edges up, no corner up; the left shows three of the top colour, the front two. */
  oll49: "r U' r2 U r2 U r2 U' r",
  /** Small L: front and right edges up, no corner up; the mirror image of 49. */
  oll50: "r' U r2 U' r2 U' r2 U r'",
  /** Small L: front and right edges up, no corner up; the left shows three of the top colour, the right two. */
  oll53: "r' U' R U' R' U R U' R' U2 r",
  /** Small L: back and right edges up, no corner up; the mirror image of 53. */
  oll54: "r U R' U R U' R' U R U2 r'",
  /** All four corners up; only the front and right edges are flipped. */
  oll28: "r U R' U' M U R U' R'",
} as const

/**
 * Orienting the last layer when no edge faces up, so that only the centre
 * (the dot) shows the top colour among the edges. Named and described like
 * the line cases.
 */
export const DOT_ORIENTATIONS = {
  /** No corner up; the left and the right each show three of the top colour. */
  oll1: "R U2 R2 F R F' U2 R' F R F'",
  /** No corner up; the left shows three of the top colour, the front and back two each. */
  oll2: "F R U R' U' F' f R U R' U' f'",
  /** Front-right corner up. */
  oll3: "f R U R' U' f' U' F R U R' U' F'",
  /** Back-right corner up; the mirror image of 3. */
  oll4: "f R U R' U' f' U F R U R' U' F'",
  /** Back-left and front-right corners up. */
  oll17: "R U R' U R' F R F' U2 R' F R F'",
  /** Both back corners up; the front shows three of the top colour. */
  oll18: "r U R' U R U2 r2 U' R U' R' U2 r",
  /** Both back corners up; the front corners face left and right. */
  oll19: "M U R U R' U' M' R' F R F'",
  /** All four corners up; all four edges are flipped. */
  oll20: "M U R U R' U' M2 U R U' r'",
} as const

/** All 57 sequences that orient the last layer, grouped by the shape its edges make. */
export const ORIENTATIONS = {
  ...CROSS_ORIENTATIONS,
  ...LINE_ORIENTATIONS,
  ...ANGLE_ORIENTATIONS,
  ...DOT_ORIENTATIONS,
} as const

export type OrientationName = keyof typeof ORIENTATIONS
export type CrossExampleName = keyof typeof CROSS_EXAMPLES
export type PairExampleName = keyof typeof PAIR_EXAMPLES
