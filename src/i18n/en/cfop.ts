/** The text of CFOP: its stages and their lessons. */
import { SEQUENCES as BEGINNER } from '../../core/methods/beginner/sequences.ts'
import { PAIR_EXAMPLES as P } from '../../core/methods/cfop/sequences.ts'
import type { OrientationName } from '../../core/methods/cfop/sequences.ts'
import type { CfopStage } from '../../core/methods/cfop/stages.ts'
import type { MethodText } from '../method-text.ts'
import { cornerOrientationCases, permutationCases } from './last-layer.ts'

type CaseText = { title: string; body: string }

const stages: MethodText<CfopStage>['stages'] = {
  cross: {
    name: 'Cross',
    summary:
      'Make the cross straight on the bottom, in eight moves or fewer, planned before the first move.',
  },
  'first-two-layers': {
    name: 'First two layers',
    summary:
      'Join each first-layer corner to the middle-layer edge above it and put the two in together, four times. Speedsolvers call this F2L.',
  },
  'orient-last-layer': {
    name: 'Last-layer orientation',
    summary:
      'Turn every piece of the last layer to face up with one sequence out of 57. Speedsolvers call this OLL.',
  },
  'permute-last-layer': {
    name: 'Last-layer permutation',
    summary:
      'Move the last-layer pieces to their own places with one sequence out of 21, called PLL. The cube is solved.',
  },
}

/**
 * The cases of the last-layer orientation, in the order of the lesson: the
 * edges show a cross, a line, an L, or only the dot. Each body describes the
 * cube as its picture shows it, before the sequence.
 */
const orientationCases: Record<OrientationName, CaseText> = {
  ...cornerOrientationCases,
  oll33: {
    title: 'T shape (OLL 33)',
    body: 'The line runs from left to right. Two corners face up, at the back right and the front right. On the sides, the top colour shows twice at the front and twice at the back.',
  },
  oll45: {
    title: 'T shape (OLL 45)',
    body: 'The line runs from left to right. Two corners face up, at the back right and the front right. On the sides, the top colour shows once at the front, once at the back and twice on the left.',
  },
  oll34: {
    title: 'C shape (OLL 34)',
    body: 'The line runs from left to right. Two corners face up, at the front left and the front right. On the sides, the top colour shows once at the front, once on the right, once at the back and once on the left.',
  },
  oll46: {
    title: 'C shape (OLL 46)',
    body: 'The line runs from front to back. Two corners face up, at the back left and the front left. On the sides, the top colour shows three times on the right and once on the left.',
  },
  oll51: {
    title: 'I shape (OLL 51)',
    body: 'The line runs from left to right. No corner faces up. On the sides, the top colour shows twice at the front, twice at the back and twice on the left.',
  },
  oll52: {
    title: 'I shape (OLL 52)',
    body: 'The line runs from front to back. No corner faces up. On the sides, the top colour shows once at the front, three times on the right, once at the back and once on the left.',
  },
  oll55: {
    title: 'I shape (OLL 55)',
    body: 'The line runs from left to right. No corner faces up. On the sides, the top colour shows three times at the front and three times at the back.',
  },
  oll56: {
    title: 'I shape (OLL 56)',
    body: 'The line runs from left to right. No corner faces up. On the sides, the top colour shows once at the front, twice on the right, once at the back and twice on the left.',
  },
  oll13: {
    title: 'Knight move (OLL 13)',
    body: 'The line runs from left to right. One corner faces up, at the front left. On the sides, the top colour shows twice at the front, once on the right and twice at the back.',
  },
  oll14: {
    title: 'Knight move (OLL 14)',
    body: 'The line runs from left to right. One corner faces up, at the front right. On the sides, the top colour shows twice at the front, twice at the back and once on the left.',
  },
  oll15: {
    title: 'Knight move (OLL 15)',
    body: 'The line runs from left to right. One corner faces up, at the front right. On the sides, the top colour shows once at the front, once on the right, twice at the back and once on the left.',
  },
  oll16: {
    title: 'Knight move (OLL 16)',
    body: 'The line runs from left to right. One corner faces up, at the back right. On the sides, the top colour shows twice at the front, once on the right, once at the back and once on the left.',
  },
  oll39: {
    title: 'Big lightning bolt (OLL 39)',
    body: 'The line runs from left to right. Two corners face up, at the back right and the front left. On the sides, the top colour shows once at the front, once on the right and twice at the back.',
  },
  oll40: {
    title: 'Big lightning bolt (OLL 40)',
    body: 'The line runs from left to right. Two corners face up, at the back left and the front right. On the sides, the top colour shows once at the front, twice at the back and once on the left.',
  },
  oll57: {
    title: 'Line, corners done (OLL 57)',
    body: 'The line runs from left to right. All four corners face up. On the sides, the top colour shows once at the front and once at the back.',
  },
  oll5: {
    title: 'Square (OLL 5)',
    body: 'The edges at the front and on the right face up. One corner faces up, at the front right. On the sides, the top colour shows once on the right, twice at the back and twice on the left.',
  },
  oll6: {
    title: 'Square (OLL 6)',
    body: 'The edges at the back and on the right face up. One corner faces up, at the back right. On the sides, the top colour shows twice at the front, once on the right and twice on the left.',
  },
  oll7: {
    title: 'Small lightning bolt (OLL 7)',
    body: 'The edges at the back and on the left face up. One corner faces up, at the front left. On the sides, the top colour shows twice at the front, twice on the right and once at the back.',
  },
  oll8: {
    title: 'Small lightning bolt (OLL 8)',
    body: 'The edges at the front and on the left face up. One corner faces up, at the back left. On the sides, the top colour shows once at the front, twice on the right and twice at the back.',
  },
  oll11: {
    title: 'Small lightning bolt (OLL 11)',
    body: 'The edges at the front and on the right face up. One corner faces up, at the front left. On the sides, the top colour shows once at the front, once on the right, twice at the back and once on the left.',
  },
  oll12: {
    title: 'Small lightning bolt (OLL 12)',
    body: 'The edges at the back and on the right face up. One corner faces up, at the back left. On the sides, the top colour shows twice at the front, once on the right, once at the back and once on the left.',
  },
  oll9: {
    title: 'Fish (OLL 9)',
    body: 'The edges at the back and on the left face up. One corner faces up, at the front right. On the sides, the top colour shows twice at the front, once on the right, once at the back and once on the left.',
  },
  oll10: {
    title: 'Fish (OLL 10)',
    body: 'The edges at the front and on the left face up. One corner faces up, at the back right. On the sides, the top colour shows once at the front, once on the right, twice at the back and once on the left.',
  },
  oll35: {
    title: 'Fish (OLL 35)',
    body: 'The edges at the front and on the right face up. Two corners face up, at the back left and the front right. On the sides, the top colour shows once at the front, once on the right, once at the back and once on the left.',
  },
  oll37: {
    title: 'Fish (OLL 37)',
    body: 'The edges at the back and on the left face up. Two corners face up, at the back left and the front right. On the sides, the top colour shows twice at the front and twice on the right.',
  },
  oll31: {
    title: 'P shape (OLL 31)',
    body: 'The edges at the back and on the right face up. Two corners face up, at the back right and the front right. On the sides, the top colour shows twice at the front, once at the back and once on the left.',
  },
  oll32: {
    title: 'P shape (OLL 32)',
    body: 'The edges at the front and on the right face up. Two corners face up, at the back right and the front right. On the sides, the top colour shows once at the front, twice at the back and once on the left.',
  },
  oll43: {
    title: 'P shape (OLL 43)',
    body: 'The edges at the front and on the left face up. Two corners face up, at the back left and the front left. On the sides, the top colour shows three times on the right and once at the back.',
  },
  oll44: {
    title: 'P shape (OLL 44)',
    body: 'The edges at the front and on the right face up. Two corners face up, at the back right and the front right. On the sides, the top colour shows once at the back and three times on the left.',
  },
  oll36: {
    title: 'W shape (OLL 36)',
    body: 'The edges at the back and on the right face up. Two corners face up, at the back left and the front right. On the sides, the top colour shows once at the front, once at the back and twice on the left.',
  },
  oll38: {
    title: 'W shape (OLL 38)',
    body: 'The edges at the back and on the left face up. Two corners face up, at the back right and the front left. On the sides, the top colour shows once at the front, twice on the right and once at the back.',
  },
  oll29: {
    title: 'Awkward shape (OLL 29)',
    body: 'The edges at the front and on the left face up. Two corners face up, at the back left and the back right. On the sides, the top colour shows twice on the right, once at the back and once on the left.',
  },
  oll30: {
    title: 'Awkward shape (OLL 30)',
    body: 'The edges at the back and on the left face up. Two corners face up, at the front left and the front right. On the sides, the top colour shows once at the front, twice on the right and once on the left.',
  },
  oll41: {
    title: 'Awkward shape (OLL 41)',
    body: 'The edges at the back and on the left face up. Two corners face up, at the front left and the front right. On the sides, the top colour shows once at the front, once on the right and twice at the back.',
  },
  oll42: {
    title: 'Awkward shape (OLL 42)',
    body: 'The edges at the front and on the left face up. Two corners face up, at the back left and the back right. On the sides, the top colour shows twice at the front, once on the right and once at the back.',
  },
  oll47: {
    title: 'Small L (OLL 47)',
    body: 'The edges at the back and on the right face up. No corner faces up. On the sides, the top colour shows twice at the front, twice on the right, once at the back and once on the left.',
  },
  oll48: {
    title: 'Small L (OLL 48)',
    body: 'The edges at the back and on the left face up. No corner faces up. On the sides, the top colour shows twice at the front, once on the right, once at the back and twice on the left.',
  },
  oll49: {
    title: 'Small L (OLL 49)',
    body: 'The edges at the back and on the right face up. No corner faces up. On the sides, the top colour shows twice at the front, once at the back and three times on the left.',
  },
  oll50: {
    title: 'Small L (OLL 50)',
    body: 'The edges at the front and on the right face up. No corner faces up. On the sides, the top colour shows once at the front, twice at the back and three times on the left.',
  },
  oll53: {
    title: 'Small L (OLL 53)',
    body: 'The edges at the front and on the right face up. No corner faces up. On the sides, the top colour shows twice on the right, once at the back and three times on the left.',
  },
  oll54: {
    title: 'Small L (OLL 54)',
    body: 'The edges at the back and on the right face up. No corner faces up. On the sides, the top colour shows once at the front, twice on the right and three times on the left.',
  },
  oll28: {
    title: 'L, corners done (OLL 28)',
    body: 'The edges at the back and on the left face up. All four corners face up. On the sides, the top colour shows once at the front and once on the right.',
  },
  oll1: {
    title: 'Dot (OLL 1)',
    body: 'No edge faces up. No corner faces up. On the sides, the top colour shows once at the front, three times on the right, once at the back and three times on the left.',
  },
  oll2: {
    title: 'Dot (OLL 2)',
    body: 'No edge faces up. No corner faces up. On the sides, the top colour shows twice at the front, once on the right, twice at the back and three times on the left.',
  },
  oll3: {
    title: 'Dot (OLL 3)',
    body: 'No edge faces up. One corner faces up, at the front right. On the sides, the top colour shows once at the front, twice on the right, twice at the back and twice on the left.',
  },
  oll4: {
    title: 'Dot (OLL 4)',
    body: 'No edge faces up. One corner faces up, at the back right. On the sides, the top colour shows twice at the front, twice on the right, once at the back and twice on the left.',
  },
  oll17: {
    title: 'Dot (OLL 17)',
    body: 'No edge faces up. Two corners face up, at the back left and the front right. On the sides, the top colour shows once at the front, once on the right, twice at the back and twice on the left.',
  },
  oll18: {
    title: 'Dot (OLL 18)',
    body: 'No edge faces up. Two corners face up, at the back left and the back right. On the sides, the top colour shows three times at the front, once on the right, once at the back and once on the left.',
  },
  oll19: {
    title: 'Dot (OLL 19)',
    body: 'No edge faces up. Two corners face up, at the back left and the back right. On the sides, the top colour shows once at the front, twice on the right, once at the back and twice on the left.',
  },
  oll20: {
    title: 'Dot (OLL 20)',
    body: 'No edge faces up. All four corners face up. On the sides, the top colour shows once at the front, once on the right, once at the back and once on the left.',
  },
}

const lessons: MethodText<CfopStage>['lessons'] = {
  cross: {
    goal: 'Four white edges form a plus sign on the bottom, each matching the centre beside it. It is the cross of the beginner method, but made straight on the bottom, without the daisy, and planned before the first move.',
    steps: [
      'Hold the cube with white on the bottom. You will not see the cross while you make it, so follow the white edges by their side colours.',
      'Before turning anything, find the four white edges and decide in which order to place them. Start with the ones that need one or two moves.',
      'Place each edge beside the ones already on the bottom, in the right order. Seen from above and going clockwise, the side colours are green, red, blue, orange.',
      'The cross may sit a turn away from the side centres while you build it. Turn the bottom layer to line it up, at the end or whenever it helps.',
      'Check that a move for one edge does not push out an edge you have placed. If it would, turn the bottom layer first to move that edge out of the way, and turn it back afterwards.',
    ],
    cases: {
      'from-top': {
        title: 'Straight down from the top',
        body: 'The white and green edge is in the top layer above its place, with white facing up. A half turn of the front face takes it home.',
      },
      'from-middle': {
        title: 'One move from the middle layer',
        body: 'The white and orange edge is at the front right, with white facing the front. One turn of the right face brings it down. An edge in the middle layer is always one move from the bottom.',
      },
      'facing-front': {
        title: 'In the top layer, white facing the side',
        body: "The white and green edge is at the top front, with white facing you. U' takes it over the right face and R' brings it down to the middle layer. F puts it home, and R puts back the edge that R' moved.",
      },
      flipped: {
        title: 'In its place but flipped',
        body: "The white and green edge is in its place with white facing the front. F' lifts it to the middle layer. D brings its place under the right face, R' drops the edge in, and D' turns the bottom back.",
      },
      'bottom-turn': {
        title: 'A cross that is a turn away',
        body: 'All four edges are on the bottom in the right order, but each is one place away from its centre. One turn of the bottom layer lines them all up.',
      },
      done: {
        title: 'The finished cross, seen from below',
        body: 'Every white edge matches the centre beside it.',
      },
    },
    tip: 'No cross needs more than eight moves, and most need six or fewer. Speedsolvers plan the whole cross before they start and then make it without looking at the bottom.',
  },
  'first-two-layers': {
    goal: 'The four white corners and the four middle-layer edges are in place, so the two bottom layers are solved. Each corner goes in together with the edge that belongs above it, as a pair.',
    steps: [
      'A slot is a corner place of the bottom layer with the edge place above it. There are four. Each takes one pair: a white corner and the edge that has the same two side colours.',
      'Find a corner and its edge in the top layer. Turn the whole cube so that their slot is at the front right. With practice you can leave the slot at the front left or at the back and work from there.',
      'Turn the top layer and one side face to join the two pieces, or to set them up so that one move joins them. Bring that side face back before you turn another one, so the cross stays whole.',
      'Put the pair in with one of the four short inserts below.',
      `If a piece you need is stuck in a slot, take it out first: turn the side face of that slot, turn the top layer, and turn the side face back. For the front-right slot that is ${P.splitInsert}.`,
      'Take the easiest pair each time. An empty slot is useful: you can turn its side face freely without breaking anything.',
    ],
    cases: {
      'joined-insert': {
        title: 'A joined pair',
        body: "The corner is above its slot with white facing the front. Its edge is beside it at the top right: both show green on top and orange on the right. U moves the pair aside, R turns the slot up to the top layer, U' moves the pair back over it and R' carries it down.",
      },
      'split-insert': {
        title: 'A split pair',
        body: "The corner is above its slot with white facing right and orange on top. The edge is at the top back with green on top. R takes the corner to the back, where it joins the edge. U brings the pair forward and R' carries it down.",
      },
      'joined-insert-front': {
        title: 'A joined pair, mirrored',
        body: "The corner has white facing right, and its edge is beside it at the top front: both show orange on top and green on the front. The same idea with the front face: U' moves the pair aside, F' turns the slot up, U moves the pair back and F carries it down.",
      },
      'split-insert-front': {
        title: 'A split pair, mirrored',
        body: "The corner has white facing the front and green on top. The edge is at the top left with orange on top. F' takes the corner to the left, where it joins the edge. U' brings the pair round and F carries it down.",
      },
      'join-then-insert': {
        title: 'Same colour on top',
        body: "The corner has white facing the front and green on top. The edge is at the top back, also with green on top. The first four moves, U' R U R', join the pair in the top layer. Then U2 R U' R' puts it in, like the first case from one turn further round.",
      },
      'corner-facing-up': {
        title: 'White faces up',
        body: "The corner is above its slot with white on top, and the edge is at the top back with green on top. The first four moves, U R U2 R', turn the corner and join it to the edge. The last four are the first case.",
      },
      'corner-twisted-in-slot': {
        title: 'Corner in the slot, twisted',
        body: "The corner is in its slot already, but white faces the front. The edge is at the top right with green on top. R U' R' takes the corner out and joins it to the edge. The last four moves are the first case.",
      },
    },
    tip: 'Every pair can be solved with turns of the top layer and three-move inserts alone. The solver starts from that and looks for something shorter, so its moves may differ from yours. Turn the whole cube as rarely as you can: each turn costs time.',
  },
  'orient-last-layer': {
    goal: 'Every piece of the last layer shows yellow on top. The pieces are not yet in their own places, so the sides of the top layer are still mixed.',
    steps: [
      'Look at the yellow stickers on top. First see the shape the edges make with the centre: a cross, a line, an L, or only the dot in the middle. The cases below are in that order.',
      'Then see which corners face up, and where the yellow stickers of the other pieces show on the sides. Together these tell the 57 cases apart.',
      'Turn the top layer until the cube matches the picture of the case.',
      'Do the sequence of that case. One sequence always finishes the stage.',
      `You do not need all 57 at once. Start with the seven cases that have a cross, and make the cross first with ${BEGINNER.lastLayerCross} as in the beginner method. That takes two looks instead of one. Then add the other cases a group at a time.`,
    ],
    cases: orientationCases,
    tip: "About one time in 216 the last layer faces up already and this stage is skipped. Many of the sequences are built from the same short pieces, such as R U R' U' and R' F R F', which makes them easier to remember than they look.",
  },
  'permute-last-layer': {
    goal: 'Every piece of the last layer is in its own place. The cube is solved.',
    steps: [
      'Look at the sides of the top layer, not at the top. Look for headlights (two corners showing the same colour on one side), blocks (a corner and the edge beside it showing the same colour) and finished sides.',
      'Find the case below with the same pattern. There are 21.',
      'Turn the top layer until the pattern sits as the case describes, and do its sequence.',
      'Turn the top layer once more if it is not yet lined up with the sides.',
      'You can start with fewer sequences: T or Y to put the corners right, then one of the four cases that move only edges (U, H and Z). That takes two looks instead of one.',
    ],
    cases: permutationCases,
    tip: 'About one time in 72 the last layer needs only a turn of the top, or nothing at all. Learn to tell the case from the front and the right side alone, so that you do not have to turn the cube to look.',
  },
}

export const cfopText: MethodText<CfopStage> = {
  name: 'CFOP',
  level: 'Speedsolving',
  summary:
    'The method most speedsolvers use: the cross, the first two layers in pairs, then the last layer in two sequences. Less than half the moves of the beginner method, with many sequences to learn.',
  lead: 'CFOP is named after its four stages: Cross, First two layers, Orientation and Permutation of the last layer. It is also called the Fridrich method, after Jessica Fridrich, who made it widely known. Nearly all the fastest solvers use it. Compared with the beginner method it joins stages together: each first-layer corner goes in with the middle-layer edge above it, and the last layer takes two sequences instead of four stages. The price is learning to see pairs, and up to 78 sequences to memorise, though you can start with a few and add the rest over time.',
  solverHint:
    'About 53 moves, in four stages. The cross and the pairs are found by search, so they are short. The last layer is one sequence out of 57, then one out of 21.',
  roadmap: {
    picture: 'The cross and one corner-edge pair',
    what: 'The method most speedsolvers use. It still works in layers, but each first-layer corner goes in together with the edge above it, and the last layer takes two sequences.',
    pick: 'Pick it if you are happy to memorise: there are up to 78 sequences, though you can start with a few and add the rest over time.',
  },
  stages,
  lessons,
}
