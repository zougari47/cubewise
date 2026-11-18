/** The text of the Roux method: its stages and their lessons. */
import {
  FIRST_BLOCK_EXAMPLES as F,
  ORIENT_EXAMPLES as O,
  SECOND_BLOCK_EXAMPLES as S,
} from '../../core/methods/roux/sequences.ts'
import type { TopCornersName } from '../../core/methods/roux/sequences.ts'
import type { RouxStage } from '../../core/methods/roux/stages.ts'
import type { MethodText } from '../method-text.ts'

type CaseText = { title: string; body: string }

const stages: MethodText<RouxStage>['stages'] = {
  'first-block': {
    name: 'First block',
    summary:
      'Build a block one piece deep, two high and three long on the left of the bottom layer, with any moves you like.',
  },
  'second-block': {
    name: 'Second block',
    summary:
      'Build the matching block on the right without disturbing the first, turning only the right face, the top and the middle slice.',
  },
  'top-corners': {
    name: 'Top corners',
    summary:
      'Solve the four top corners with one sequence out of 42, ignoring the edges. Speedsolvers call this CMLL.',
  },
  'orient-last-edges': {
    name: 'Last six edges: orientation',
    summary:
      'Flip the six remaining edges so that each shows the top or the bottom colour upwards or downwards, with the middle slice and the top only.',
  },
  'side-edges': {
    name: 'Last six edges: left and right',
    summary: 'Bring the top-left and top-right edges home, which finishes the left and right sides.',
  },
  'middle-edges': {
    name: 'Last six edges: middle slice',
    summary: 'Put the four edges of the middle slice in their places. The cube is solved.',
  },
}

/**
 * The 42 cases of the top corners, in the order of the lesson. Each body
 * describes the cube as its picture shows it, before the sequence.
 */
const topCornerCases: Record<TopCornersName, CaseText> = {
  'o-adjacent-swap': {
    title: 'O: adjacent swap',
    body: 'All four corners face up. At the front the corner stickers are red and green; on the right they are orange and red.',
  },
  'o-diagonal-swap': {
    title: 'O: diagonal swap',
    body: 'All four corners face up. At the front the corner stickers are green and blue; on the right they are red and orange.',
  },
  'h-columns': {
    title: 'H: columns',
    body: 'No corner faces up. Yellow shows twice at the front and twice at the back. At the front the corner stickers are both yellow; on the right they are green and blue.',
  },
  'h-rows': {
    title: 'H: rows',
    body: 'No corner faces up. Yellow shows twice at the front and twice at the back. At the front the corner stickers are both yellow; on the right they are both red.',
  },
  'h-column': {
    title: 'H: column',
    body: 'No corner faces up. Yellow shows twice on the right and twice on the left. At the front the corner stickers are green and blue; on the right they are both yellow.',
  },
  'h-row': {
    title: 'H: row',
    body: 'No corner faces up. Yellow shows twice at the front and twice at the back. At the front the corner stickers are both yellow; on the right they are blue and orange.',
  },
  'pi-right-bar': {
    title: 'Pi: right bar',
    body: 'No corner faces up. Yellow shows once at the front, once at the back and twice on the left. At the front the corner stickers are red and yellow; on the right they are green and blue.',
  },
  'pi-back-slash': {
    title: 'Pi: back slash',
    body: 'No corner faces up. Yellow shows once on the right, twice at the back and once on the left. At the front the corner stickers are blue and orange; on the right they are yellow and green.',
  },
  'pi-x-checkerboard': {
    title: 'Pi: x checkerboard',
    body: 'No corner faces up. Yellow shows twice at the front, once on the right and once on the left. At the front the corner stickers are both yellow; on the right they are green and yellow.',
  },
  'pi-forward-slash': {
    title: 'Pi: forward slash',
    body: 'No corner faces up. Yellow shows once at the front, once at the back and twice on the left. At the front the corner stickers are orange and yellow; on the right they are green and red.',
  },
  'pi-columns': {
    title: 'Pi: columns',
    body: 'No corner faces up. Yellow shows twice at the front, once on the right and once on the left. At the front the corner stickers are both yellow; on the right they are orange and yellow.',
  },
  'pi-left-bar': {
    title: 'Pi: left bar',
    body: 'No corner faces up. Yellow shows twice at the front, once on the right and once on the left. At the front the corner stickers are both yellow; on the right they are orange and yellow.',
  },
  'u-forward-slash': {
    title: 'U: forward slash',
    body: 'Two corners face up, at the back right and the back left. Yellow shows twice at the front. At the front the corner stickers are both yellow; on the right they are red and green.',
  },
  'u-back-slash': {
    title: 'U: back slash',
    body: 'Two corners face up, at the front left and the front right. Yellow shows twice at the back. At the front the corner stickers are green and orange; on the right they are blue and red.',
  },
  'u-front-row': {
    title: 'U: front row',
    body: 'Two corners face up, at the front left and the front right. Yellow shows twice at the back. At the front the corner stickers are both green; on the right they are orange and blue.',
  },
  'u-rows': {
    title: 'U: rows',
    body: 'Two corners face up, at the front right and the back right. Yellow shows twice on the left. At the front the corner stickers are orange and red; on the right they are both green.',
  },
  'u-x-checkerboard': {
    title: 'U: x checkerboard',
    body: 'Two corners face up, at the back right and the back left. Yellow shows twice at the front. At the front the corner stickers are both yellow; on the right they are blue and green.',
  },
  'u-back-row': {
    title: 'U: back row',
    body: 'Two corners face up, at the front right and the back right. Yellow shows twice on the left. At the front the corner stickers are green and red; on the right they are green and blue.',
  },
  't-left-bar': {
    title: 'T: left bar',
    body: 'Two corners face up, at the front right and the back right. Yellow shows once at the front and once at the back. At the front the corner stickers are yellow and green; on the right they are orange and blue.',
  },
  't-right-bar': {
    title: 'T: right bar',
    body: 'Two corners face up, at the front left and the back left. Yellow shows once at the front and once at the back. At the front the corner stickers are green and yellow; on the right they are blue and orange.',
  },
  't-rows': {
    title: 'T: rows',
    body: 'Two corners face up, at the front left and the front right. Yellow shows once on the right and once on the left. At the front the corner stickers are both orange; on the right they are blue and yellow.',
  },
  't-front-row': {
    title: 'T: front row',
    body: 'Two corners face up, at the front left and the front right. Yellow shows once on the right and once on the left. At the front the corner stickers are both blue; on the right they are red and yellow.',
  },
  't-back-row': {
    title: 'T: back row',
    body: 'Two corners face up, at the front left and the front right. Yellow shows once on the right and once on the left. At the front the corner stickers are red and orange; on the right they are blue and yellow.',
  },
  't-columns': {
    title: 'T: columns',
    body: 'Two corners face up, at the back right and the back left. Yellow shows once on the right and once on the left. At the front the corner stickers are both orange; on the right they are yellow and red.',
  },
  's-left-bar': {
    title: 'S: left bar',
    body: 'One corner faces up, at the front left. Yellow shows once at the front, once on the right and once at the back. At the front the corner stickers are blue and yellow; on the right they are blue and yellow.',
  },
  's-x-checkerboard': {
    title: 'S: x checkerboard',
    body: 'One corner faces up, at the front left. Yellow shows once at the front, once on the right and once at the back. At the front the corner stickers are orange and yellow; on the right they are orange and yellow.',
  },
  's-forward-slash': {
    title: 'S: forward slash',
    body: 'One corner faces up, at the front left. Yellow shows once at the front, once on the right and once at the back. At the front the corner stickers are orange and yellow; on the right they are blue and yellow.',
  },
  's-columns': {
    title: 'S: columns',
    body: 'One corner faces up, at the front left. Yellow shows once at the front, once on the right and once at the back. At the front the corner stickers are green and yellow; on the right they are blue and yellow.',
  },
  's-right-bar': {
    title: 'S: right bar',
    body: 'One corner faces up, at the back right. Yellow shows once at the front, once at the back and once on the left. At the front the corner stickers are green and yellow; on the right they are red and blue.',
  },
  's-back-slash': {
    title: 'S: back slash',
    body: 'One corner faces up, at the front left. Yellow shows once at the front, once on the right and once at the back. At the front the corner stickers are orange and yellow; on the right they are blue and yellow.',
  },
  'as-right-bar': {
    title: 'As: right bar',
    body: 'One corner faces up, at the back left. Yellow shows once at the front, once on the right and once at the back. At the front the corner stickers are yellow and red; on the right they are yellow and green.',
  },
  'as-columns': {
    title: 'As: columns',
    body: 'One corner faces up, at the front right. Yellow shows once at the front, once at the back and once on the left. At the front the corner stickers are yellow and green; on the right they are orange and red.',
  },
  'as-back-slash': {
    title: 'As: back slash',
    body: 'One corner faces up, at the front right. Yellow shows once at the front, once at the back and once on the left. At the front the corner stickers are yellow and red; on the right they are green and orange.',
  },
  'as-x-checkerboard': {
    title: 'As: x checkerboard',
    body: 'One corner faces up, at the front right. Yellow shows once at the front, once at the back and once on the left. At the front the corner stickers are yellow and red; on the right they are green and blue.',
  },
  'as-forward-slash': {
    title: 'As: forward slash',
    body: 'One corner faces up, at the front right. Yellow shows once at the front, once at the back and once on the left. At the front the corner stickers are yellow and red; on the right they are green and red.',
  },
  'as-left-bar': {
    title: 'As: left bar',
    body: 'One corner faces up, at the front left. Yellow shows once on the right, once at the back and once on the left. At the front the corner stickers are red and blue; on the right they are yellow and orange.',
  },
  'l-mirror': {
    title: 'L: mirror',
    body: 'Two corners face up, at the front right and the back left. Yellow shows once at the front and once on the right. At the front the corner stickers are yellow and orange; on the right they are blue and yellow.',
  },
  'l-inverse': {
    title: 'L: inverse',
    body: 'Two corners face up, at the front right and the back left. Yellow shows once at the front and once on the right. At the front the corner stickers are yellow and green; on the right they are orange and yellow.',
  },
  'l-pure': {
    title: 'L: pure',
    body: 'Two corners face up, at the front right and the back left. Yellow shows once at the back and once on the left. At the front the corner stickers are orange and blue; on the right they are red and green.',
  },
  'l-front-commutator': {
    title: 'L: front commutator',
    body: 'Two corners face up, at the front right and the back left. Yellow shows once at the front and once on the right. At the front the corner stickers are yellow and orange; on the right they are blue and yellow.',
  },
  'l-diagonal': {
    title: 'L: diagonal',
    body: 'Two corners face up, at the front right and the back left. Yellow shows once at the back and once on the left. At the front the corner stickers are green and red; on the right they are green and red.',
  },
  'l-back-commutator': {
    title: 'L: back commutator',
    body: 'Two corners face up, at the front left and the back right. Yellow shows once on the right and once at the back. At the front the corner stickers are green and red; on the right they are yellow and green.',
  },
}

const lessons: MethodText<RouxStage>['lessons'] = {
  'first-block': {
    goal: 'Five pieces on the left of the bottom layer are solved and make a block one piece deep, two high and three long: the bottom-left edge, the two bottom corners beside it and the two middle-layer edges above them. Nothing else matters yet.',
    steps: [
      'Hold the cube with white at the bottom and red on the left. The block is then made of the five pieces that have red on them and no yellow.',
      'Put the bottom-left edge in first: the white and red one. It goes under the red centre with white facing down.',
      'Find a white and red corner and the edge that has its two side colours. Join them in the top layer so that their colours match where they touch. They are now a pair, one piece wide and two long.',
      'Turn the top layer to bring the pair over its place and turn it down with the front face or the back face. One move puts both pieces in.',
      'Do the same with the other pair. Nothing on the right is solved yet, so the right face is free for joining pairs.',
      'With practice you will build the block in any order and plan all of it before the first move, as the solver does.',
    ],
    cases: {
      'bottom-edge': {
        title: 'The bottom-left edge',
        body: `The cube is shown from the left. The white and red edge is in the top layer above the green centre, with red on top and white facing the green side. ${F.bottomEdge.split(' ')[0]} brings it down the green face to the left side, and ${F.bottomEdge.split(' ')[1]} turns it to the bottom.`,
      },
      'joined-pair': {
        title: 'A joined pair',
        body: "The cube is shown from the left. The corner and its edge lie side by side along the left of the top layer: both show red on top and green on the left. U' carries the pair round to the front, and F' turns it down into its place beside the bottom-left edge.",
      },
      'split-pair': {
        title: 'A split pair',
        body: "The cube is shown from the front. The corner is at the top back right with red on top and white on the right. Its edge is at the front right with red facing the front. R lifts the edge to the top and U' moves it to the back. R' brings the corner back up beside it, and the pair is joined. U2 takes it to the front and F' turns it down.",
      },
      'back-pair': {
        title: 'The back pair',
        body: 'The cube is shown from the left. The last corner and its edge lie joined along the left of the top layer: both show red on top and blue on the left. U carries the pair round to the back, and B turns it down into its place.',
      },
      done: {
        title: 'The finished block, seen from the left',
        body: 'Two rows of three on the left face, and white along the bottom. The rest of the cube is still mixed.',
      },
    },
    tip: 'The solver builds the first block in about seven moves. It looks at all four sides of the cube and starts with the one that gives the shortest two blocks, so check how it asks you to hold the cube.',
  },
  'second-block': {
    goal: 'The same five pieces on the right are solved: the bottom-right edge, the two bottom corners beside it and the two middle-layer edges above them. The first block is untouched. The top layer and the middle slice are still mixed.',
    steps: [
      'From here the left block must stay where it is. Use only four kinds of turn: R, the top layer U, the wide turn r (the right face with the middle slice) and the slice turn M. None of them moves a piece of the left block.',
      'Put the bottom-right edge in: the white and orange one. It goes under the orange centre with white facing down.',
      `Join a white and orange corner to its edge in the top layer, bring the pair above its place and put it in. For the front pair that is ${S.frontPair}, for the back pair ${S.backPair}.`,
      'The middle slice is free, so use it. An edge at the bottom of the middle slice comes up with M or with a wide turn, and nothing is lost by turning the slice.',
      'The centres of the middle slice move with it. After this stage the centre on top may not be yellow. That is expected: the last stages put the centres right.',
    ],
    cases: {
      'bottom-edge': {
        title: 'The bottom-right edge',
        body: "The white and orange edge is at the top front with white on top. U' takes it over the right face and R2 turns it down to the bottom.",
      },
      'front-pair': {
        title: 'A joined pair at the front',
        body: "The corner is above its place with white facing the front. Its edge is beside it at the top right: both show green on top and orange on the right. U moves the pair aside, R turns its place up to the top layer, U' moves the pair back over it and R' carries it down.",
      },
      'back-pair': {
        title: 'A joined pair at the back',
        body: "The corner is above its place at the back right, with blue on top. Its edge is beside it at the top right: both show blue on top and orange on the right. U' moves the pair aside, R' turns its place up, U moves the pair back and R carries it down.",
      },
      'wide-insert': {
        title: 'An edge at the bottom of the middle slice',
        body: "The corner is at the top front left with green on top and orange facing the front. Its edge is at the bottom front, in the middle slice, with green facing the front. The wide turn r lifts the edge up beside the corner, and the pair is joined. U' moves it over the right side and r' carries it down.",
      },
      'through-middle': {
        title: 'Corner home, edge in the middle slice',
        body: "The corner is home, but its edge is at the bottom front with green facing the front. R lifts the corner to the top and U moves it to the front left. M' brings the edge up beside it. U' takes the joined pair back to the right, and r' carries it down and puts the middle slice back.",
      },
    },
    tip: 'The solver finds the fewest turns for every second block, about eight, so its turns may differ from yours. Roux solvers do not turn the whole cube during this stage or after it: every turn is made from the same grip.',
  },
  'top-corners': {
    goal: 'The four top corners are solved next to each other: all show yellow on top and their side colours agree. The top layer may still be a turn away from the blocks; that turn comes with the edges. Both blocks are kept. The six edges outside the blocks are ignored.',
    steps: [
      'Look only at the corners. First see which of them show yellow on top: that gives the letter of the case. The cases below are grouped by letter.',
      'Then look at the corner stickers on the sides: which are yellow, and which pairs have the same colour. That tells the cases of one letter apart.',
      'Turn the top layer until the corners match the picture of the case.',
      'Do the sequence of that case. One sequence always finishes the stage.',
      'You do not need all 42 at once. Start with one case of each letter to turn the corners up, then one of the two O cases to put them in place. That takes two looks instead of one.',
    ],
    cases: topCornerCases,
    tip: 'These sequences are free to move the six edges and the centres of the middle slice, so many are shorter than the last-layer sequences for the same corners. The centre on top may not be yellow at this point: go by the corners. About one time in 162 the corners are solved already.',
  },
  'orient-last-edges': {
    goal: 'The centre on top is yellow or white, and each of the six remaining edges shows yellow or white on the top or the bottom face. Such edges are called good. The edges are not yet in their own places.',
    steps: [
      'From here to the end only two layers turn: the middle slice (M) and the top (U). Neither can break the blocks.',
      'If the centre on top is not yellow or white, one M turn brings yellow or white there. Judge the edges after that.',
      'Look at the four top edges and the two bottom edges of the middle slice. An edge is good if its yellow or white sticker faces up or down, and bad if that sticker faces sideways. The number of bad edges is always even.',
      `The case to aim for is the arrow: three bad edges on top, and one bad edge at the bottom below the middle one of the three. Hold it with the bad bottom edge at the front; ${O.arrow} then makes all six good.`,
      'Any other count is turned into an arrow first, with one M turn and a turn of the top. The cases below show how many turns each count takes.',
    ],
    cases: {
      arrow: {
        title: 'The arrow: three on top, one below',
        body: "On top, the front, left and right edges are bad: they show orange, green and green. The back edge is good. At the bottom, the front edge is bad, with yellow facing the front. M' takes the bad bottom edge up and the good back edge down, U moves the top round, and M finishes: all six are good.",
      },
      'two-and-two': {
        title: 'Two beside each other on top, two below',
        body: "On top, the front and right edges are bad: they show orange and red. Both bottom edges are bad too. M2 and U' turn this into an arrow, and three more turns finish it.",
      },
      'two-beside': {
        title: 'Two beside each other on top',
        body: 'On top, the front and right edges are bad: they show orange and green. The other four edges are good. Seven turns.',
      },
      'four-on-top': {
        title: 'All four on top',
        body: 'None of the four top edges shows yellow or white on top. Both bottom edges are good. Seven turns.',
      },
      'two-below': {
        title: 'Both bottom edges',
        body: 'The top looks finished: all four top edges are good. Both bottom edges are bad, the front one showing white at the front. Seven turns.',
      },
      'all-six': {
        title: 'All six',
        body: 'Every one of the six edges is bad. This is the longest case, eleven turns, and it is rare.',
      },
    },
    tip: 'Each picture is made so that its sequence ends on a solved cube, to keep it easy to read. In a real solve the edges end up good but out of place, and the corners may be a turn of the top away from the blocks. The solver picks, among the shortest ways to orient the edges, the one that leaves the least to do afterwards.',
  },
  'side-edges': {
    goal: 'The top-left and top-right edges are home between their corners, and the corners are lined up with the blocks. The left and right sides of the cube are finished. Only the four edges of the middle slice are left.',
    steps: [
      'Find the two edges: yellow and red, yellow and orange.',
      "Bring both to the bottom of the middle slice, one at the front and one at the back. To move an edge between the top and the bottom without making it bad, use M2, or M' U2 M.",
      'Look at the edge at the bottom front. If its side sticker is red, turn the top layer until the two corners with red are at the back. If it is orange, bring the corners with orange to the back.',
      'M2 lifts both edges into place between their corners. Turn the top layer to line everything up with the blocks.',
      'Keep every edge good: quarter turns of the middle slice come in twos, with only a half turn of the top between them.',
    ],
    cases: {
      'both-below': {
        title: 'Both at the bottom',
        body: "The yellow and red edge is at the bottom front with red facing the front. The yellow and orange edge is at the bottom back, out of sight. U takes the corners with red to the back, M2 lifts both edges between their corners and U' brings them home. The centres are now upside down: the last M2 puts them right, and is really the first turn of the next stage.",
      },
      'both-in-middle': {
        title: 'Both in the middle slice on top',
        body: "The yellow and red edge is at the top front and the yellow and orange edge at the top back. M2 sends both to the bottom. U' brings the corners with red to the front, away from the red edge at the back. M2 lifts the edges between their corners and U lines everything up.",
      },
      swapped: {
        title: 'Each in the place of the other',
        body: 'The yellow and red edge is at the top right and the yellow and orange edge at the top left. U puts both into the middle slice and M2 sends them down. U2 turns the corners half way round, M2 lifts the edges between them and U lines everything up.',
      },
      'one-below': {
        title: 'One at the bottom, one on top',
        body: "The yellow and orange edge is at the bottom front with orange facing the front. The yellow and red edge is at the top right, in the place of the first. M' and M, with U2 between them, change edges between the top and the bottom and leave every edge good.",
      },
    },
    tip: 'This stage takes about five turns. Often the centres finish upside down, with white on top; the next stage puts that right.',
  },
  'middle-edges': {
    goal: 'The four edges of the middle slice are in their places and the centres are right. The cube is solved.',
    steps: [
      'Use only M turns and half turns of the top (U2). A half turn of the top swaps the top front and top back edges of the slice, and each pair of half turns leaves the sides as they were.',
      'The centre on top is yellow or white. If it is white, the middle slice needs half a turn in all. If it is yellow, the turns of the slice must cancel out.',
      'Look at where the four edges are. If one is home, the other three go round in a ring: that takes four or five turns.',
      'If none is home, the edges change places in two pairs: see the last three cases.',
    ],
    cases: {
      'three-edges': {
        title: 'Three edges in a ring',
        body: "The bottom back edge is home. The white and green edge is at the top front, the yellow and green edge at the top back and the yellow and blue edge at the bottom front. M' U2 M U2 sends each one on to its place.",
      },
      'three-edges-back': {
        title: 'Three edges in a ring, the other way',
        body: 'The bottom back edge is home. The yellow and blue edge is at the top front, the white and green edge at the top back and the yellow and green edge at the bottom front. The same four turns in the other order.',
      },
      'front-and-back': {
        title: 'Front and back change places',
        body: 'At the top front the side sticker is blue, and at the top back it is green: the two top edges have changed places. So have the two bottom ones.',
      },
      'top-and-bottom': {
        title: 'Top and bottom change places',
        body: 'The white edges are on top and the yellow edges at the bottom, each on its own side: white and green at the top front, white and blue at the top back.',
      },
      diagonal: {
        title: 'Each edge is opposite its place',
        body: 'The white edges are on top, on the wrong sides: white and blue at the top front, white and green at the top back. The longest case, seven turns.',
      },
    },
    tip: 'This stage takes four turns or fewer in most solves. The end of a Roux solve is quick because the hands never leave the middle slice and the top.',
  },
}

export const rouxText: MethodText<RouxStage> = {
  name: 'Roux',
  level: 'Speedsolving',
  summary:
    'Two blocks, the top corners, then the last six edges with the middle slice. About 40 moves, few sequences to learn, and no turning the cube over.',
  lead: 'The Roux method was invented by Gilles Roux in 2003 and is the main alternative to CFOP among fast solvers. It does not work in layers. You build a block on the left and a block on the right, which leaves the top layer and the middle slice free. One sequence then solves the top corners, and the six edges that remain are solved with turns of the middle slice and the top alone. Compared with the beginner method it needs far fewer moves and only 42 sequences, and the cube is never turned over in the hands. The price is that the two blocks are built by eye, not by rule, and that takes practice.',
  solverHint:
    'About 39 moves, in six stages. The two blocks are found by search, so they are short. The top corners are one sequence out of 42, and the last six edges use only the middle slice and the top.',
  stages,
  lessons,
}
