/**
 * The sequences of the Roux method. The solver and the lessons both read
 * them from here.
 */

/**
 * The top corners, all 42 cases (speedsolvers call the set CMLL). Each solves
 * the four top corners, give or take a turn of the top layer, and keeps both
 * blocks. The six other edges and the centres of the middle slice are free
 * to move, which is why these are shorter than last-layer sequences.
 *
 * Named as Roux solvers name them: a letter for which way the corners face,
 * then the pattern their stickers make. Each comment describes the cube the
 * sequence solves, held with yellow on top and green in front: which corners
 * face up, and the colours of the corner stickers on the two sides in view,
 * read from left to right.
 */
export const TOP_CORNERS = {
  // O: all four corners face up
  /** Adjacent swap: all corners up; corner stickers red and green at the front, orange and red on the right. */
  'o-adjacent-swap': "R U R' F' R U R' U' R' F R2 U' R'",
  /** Diagonal swap: all corners up; corner stickers green and blue at the front, red and orange on the right. */
  'o-diagonal-swap': "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  // H: no corner faces up; they face outwards in two pairs, on opposite sides
  /** Columns: no corner up; corner stickers both yellow at the front, green and blue on the right. */
  'h-columns': "R U2 R' U' R U R' U' R U' R'",
  /** Rows: no corner up; corner stickers both yellow at the front, both red on the right. */
  'h-rows': "F R U R' U' R U R' U' R U R' U' F'",
  /** Column: no corner up; corner stickers green and blue at the front, both yellow on the right. */
  'h-column': "R U2 R2 F R F' U2 R' F R F'",
  /** Row: no corner up; corner stickers both yellow at the front, blue and orange on the right. */
  'h-row': "r U' r2 D' r U' r' D r2 U r'",
  // Pi: no corner faces up; only one pair faces the same side
  /** Right bar: no corner up; corner stickers red and yellow at the front, green and blue on the right. */
  'pi-right-bar': "F R U R' U' R U R' U' F'",
  /** Back slash: no corner up; corner stickers blue and orange at the front, yellow and green on the right. */
  'pi-back-slash': "F R' F' R U2 R U' R' U R U2 R'",
  /** X checkerboard: no corner up; corner stickers both yellow at the front, green and yellow on the right. */
  'pi-x-checkerboard': "R' F R U F U' R U R' U' F'",
  /** Forward slash: no corner up; corner stickers orange and yellow at the front, green and red on the right. */
  'pi-forward-slash': "R U2 R' U' R U R' U2 R' F R F'",
  /** Columns: no corner up; corner stickers both yellow at the front, orange and yellow on the right. */
  'pi-columns': "r U' r2 D' r U r' D r2 U r'",
  /** Left bar: no corner up; corner stickers both yellow at the front, orange and yellow on the right. */
  'pi-left-bar': "R' U' R' F R F' R U' R' U2 R",
  // U: two corners side by side face up; the other two face the same side
  /** Forward slash: back right and back left up; corner stickers both yellow at the front, red and green on the right. */
  'u-forward-slash': "R2 D R' U2 R D' R' U2 R'",
  /** Back slash: front left and front right up; corner stickers green and orange at the front, blue and red on the right. */
  'u-back-slash': "R2 D' R U2 R' D R U2 R",
  /** Front row: front left and front right up; corner stickers both green at the front, orange and blue on the right. */
  'u-front-row': "R2 F U' F U F2 R2 U' R' F R",
  /** Rows: front right and back right up; corner stickers orange and red at the front, both green on the right. */
  'u-rows': "F R2 D R' U R D' R2 U' F'",
  /** X checkerboard: back right and back left up; corner stickers both yellow at the front, blue and green on the right. */
  'u-x-checkerboard': "r U' r' U r' D' r U' r' D r",
  /** Back row: front right and back right up; corner stickers green and red at the front, green and blue on the right. */
  'u-back-row': "F R U R' U' F'",
  // T: two corners side by side face up; the other two face opposite sides
  /** Left bar: front right and back right up; corner stickers yellow and green at the front, orange and blue on the right. */
  't-left-bar': "R U R' U' R' F R F'",
  /** Right bar: front left and back left up; corner stickers green and yellow at the front, blue and orange on the right. */
  't-right-bar': "L' U' L U L F' L' F",
  /** Rows: front left and front right up; corner stickers both orange at the front, blue and yellow on the right. */
  't-rows': "F R' F R2 U' R' U' R U R' F2",
  /** Front row: front left and front right up; corner stickers both blue at the front, red and yellow on the right. */
  't-front-row': "r' U r U2 R2 F R F' R",
  /** Back row: front left and front right up; corner stickers red and orange at the front, blue and yellow on the right. */
  't-back-row': "r' D' r U r' D r U' r U r'",
  /** Columns: back right and back left up; corner stickers both orange at the front, yellow and red on the right. */
  't-columns': "r2 D' r U r' D r2 U' r' U' r",
  // S: one corner faces up; each of the others needs a clockwise twist
  /** Left bar: front left up; corner stickers blue and yellow at the front, blue and yellow on the right. */
  's-left-bar': "R U R' U R U2 R'",
  /** X checkerboard: front left up; corner stickers orange and yellow at the front, orange and yellow on the right. */
  's-x-checkerboard': "L' U2 L U2 L F' L' F",
  /** Forward slash: front left up; corner stickers orange and yellow at the front, blue and yellow on the right. */
  's-forward-slash': "F R' F' R U2 R U2 R'",
  /** Columns: front left up; corner stickers green and yellow at the front, blue and yellow on the right. */
  's-columns': "R U R' U' R' F R F' R U R' U R U2 R'",
  /** Right bar: back right up; corner stickers green and yellow at the front, red and blue on the right. */
  's-right-bar': "R U R' U R' F R F' R U2 R'",
  /** Back slash: front left up; corner stickers orange and yellow at the front, blue and yellow on the right. */
  's-back-slash': "R U' L' U R' U' L",
  // As: one corner faces up; each of the others needs an anticlockwise twist
  /** Right bar: back left up; corner stickers yellow and red at the front, yellow and green on the right. */
  'as-right-bar': "R' U' R U' R' U2 R",
  /** Columns: front right up; corner stickers yellow and green at the front, orange and red on the right. */
  'as-columns': "R2 D R' U R D' R' U R' U' R U' R'",
  /** Back slash: front right up; corner stickers yellow and red at the front, green and orange on the right. */
  'as-back-slash': "F' L F L' U2 L' U2 L",
  /** X checkerboard: front right up; corner stickers yellow and red at the front, green and blue on the right. */
  'as-x-checkerboard': "R U2 R' U2 R' F R F'",
  /** Forward slash: front right up; corner stickers yellow and red at the front, green and red on the right. */
  'as-forward-slash': "L' U R U' L U R'",
  /** Left bar: front left up; corner stickers red and blue at the front, yellow and orange on the right. */
  'as-left-bar': "R' U' R U' R' U R' F R F' U R",
  // L: two diagonally opposite corners face up
  /** Mirror: front right and back left up; corner stickers yellow and orange at the front, blue and yellow on the right. */
  'l-mirror': "F R U' R' U' R U R' F'",
  /** Inverse: front right and back left up; corner stickers yellow and green at the front, orange and yellow on the right. */
  'l-inverse': "F R' F' R U R U' R'",
  /** Pure: front right and back left up; corner stickers orange and blue at the front, red and green on the right. */
  'l-pure': "R U2 R' U' R U R' U' R U R' U' R U' R'",
  /** Front commutator: front right and back left up; corner stickers yellow and orange at the front, blue and yellow on the right. */
  'l-front-commutator': "R U2 R D R' U2 R D' R2",
  /** Diagonal: front right and back left up; corner stickers green and red at the front, green and red on the right. */
  'l-diagonal': "R' U' R U R' F' R U R' U' R' F R2",
  /** Back commutator: front left and back right up; corner stickers green and red at the front, yellow and green on the right. */
  'l-back-commutator': "R' U2 R' D' R U2 R' D R2",
} as const

export type TopCornersName = keyof typeof TOP_CORNERS

/**
 * Examples for the first-block lesson. Every first block is planned afresh,
 * so the solver searches for it instead of reading these. Each brings home
 * the pieces named and keeps the pieces of the block that are already home.
 */
export const FIRST_BLOCK_EXAMPLES = {
  /** The bottom-left edge from the top front: down the front to the left, then to the bottom. */
  bottomEdge: "F' L",
  /** The front pair, already joined and lying along the left of the top layer: over to the front, then in. */
  joinedPair: "U' F'",
  /** The front pair apart: corner at the top back right, edge at the front right. Joined on top, then put in. */
  splitPair: "R U' R' U2 F'",
  /** The back pair, joined and lying along the left of the top layer: over to the back, then in. */
  backPair: 'U B',
} as const

/**
 * Examples for the second-block lesson, with `R`, `r`, `U` and `M` only.
 * The solver reads the fewest turns off a table instead of reading these;
 * each of these is as short as its case allows. Each keeps the first block
 * and the pieces of the second that are already home.
 */
export const SECOND_BLOCK_EXAMPLES = {
  /** The bottom-right edge from the top front: over the right face, then down. */
  bottomEdge: "U' R2",
  /** The front pair joined at the top right, above its place. */
  frontPair: "U R U' R'",
  /** The back pair joined at the top right, above its place. */
  backPair: "U' R' U R",
  /** Corner at the top front left, edge at the bottom of the middle slice: the wide turn lifts the edge with the place. */
  wideInsert: "r U' r'",
  /** Corner home already, edge flipped at the bottom of the middle slice: the slice turn brings it up to meet the corner. */
  throughMiddle: "R U M' U' r'",
} as const

/**
 * Examples for orienting the last six edges, with `M` and `U` only. Each
 * orients all six in the fewest turns and puts the centres back where it
 * found them. Named by where the edges that need flipping are.
 */
export const ORIENT_EXAMPLES = {
  /** Three on top and the bottom front one: the arrow. */
  arrow: "M' U M",
  /** Two on top, side by side, and both bottom ones. */
  twoAndTwo: "M2 U' M U M",
  /** Two on top, side by side. */
  twoBeside: "M U M' U2 M U' M'",
  /** All four on top. */
  fourOnTop: "M U2 M' U2 M U M'",
  /** Both bottom ones. */
  twoBelow: "M' U' M' U M U' M",
  /** All six. */
  allSix: "M' U M' U2 M' U' M U' M' U' M'",
} as const

/**
 * Examples for the top-left and top-right edges, with `M` and `U` only. Each
 * brings both home and keeps the six edges oriented.
 */
export const SIDE_EDGE_EXAMPLES = {
  /**
   * Both in the bottom of the middle slice. Three turns bring them home; the
   * last `M2` belongs to the next stage and puts the centres back.
   */
  bothBelow: "U M2 U' M2",
  /** Both in the middle slice on top: the top-left edge at the front, the top-right edge at the back. */
  bothInMiddle: "M2 U' M2 U",
  /** Each in the other's place. */
  swapped: 'U M2 U2 M2 U',
  /** One at the bottom front, the other in the first one's place. */
  oneBelow: "U' M' U2 M U'",
} as const

/**
 * Examples for the edges of the middle slice, with `M` and half turns of the
 * top only. Each solves the cube in the fewest turns.
 */
export const MIDDLE_EDGE_EXAMPLES = {
  /** Three edges go round: top front, top back, bottom front. */
  threeEdges: "M' U2 M U2",
  /** The same three go round the other way. */
  threeEdgesBack: "U2 M' U2 M",
  /** The two top edges change places, and so do the two bottom ones. */
  frontAndBack: 'U2 M2 U2 M2',
  /** Each top edge changes places with the edge below it. */
  topAndBottom: "M' U2 M2 U2 M'",
  /** Each edge changes places with the one diagonally opposite. */
  diagonal: "U2 M' U2 M2 U2 M' U2",
} as const
