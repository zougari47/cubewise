/** The text of the ZZ method: its stages and their lessons. */
import { BLOCK_EXAMPLES as B, EO_LINE_EXAMPLES as E } from '../../core/methods/zz/sequences.ts'
import type { ZzStage } from '../../core/methods/zz/stages.ts'
import type { MethodText } from '../method-text.ts'
import { cornerOrientationCases, permutationCases } from './last-layer.ts'

const stages: MethodText<ZzStage>['stages'] = {
  'eo-line': {
    name: 'Edge orientation and line',
    summary:
      'Turn every edge the good way round and put the bottom-front and bottom-back edges in place, in about six moves. Speedsolvers call this EOLine.',
  },
  'first-two-layers': {
    name: 'First two layers',
    summary:
      'Build a block each side of the line with turns of the right, top and left faces only, without turning the cube in your hands. Speedsolvers call this ZZ F2L.',
  },
  'orient-last-layer-corners': {
    name: 'Last-layer corners face up',
    summary:
      'The last-layer edges face up already. Turn the corners to face up with one sequence out of seven, called OCLL.',
  },
  'permute-last-layer': {
    name: 'Last-layer permutation',
    summary:
      'Move the last-layer pieces to their own places with one sequence out of 21, called PLL. The cube is solved.',
  },
}

const lessons: MethodText<ZzStage>['lessons'] = {
  'eo-line': {
    goal: 'Every edge is "good", and the white-green and white-blue edges are in place. With the white centre they make a line under the cube from front to back. Nothing else is solved yet.',
    steps: [
      'Hold the cube with white at the bottom and green in front, and do not turn it in your hands. A good edge can go home the right way round with turns of the right, left, top and bottom faces alone. A bad edge cannot: it needs a quarter turn of the front or the back face.',
      'Check each of the twelve edges by one sticker. For an edge in the top or bottom layer, take the sticker that faces up or down. For an edge in the middle layer, take the sticker that faces the front or the back. Yellow or white: the edge is good. Red or orange: it is bad. Green or blue: look at the other sticker of the same edge. If that one is red or orange the edge is good; if it is yellow or white the edge is bad.',
      'A quarter turn of the front or the back face changes its four edges: bad ones become good and good ones become bad. No other turn changes any edge, and nor does a half turn of the front or the back. The number of bad edges is always even.',
      'Use the other faces to move bad edges onto the front or the back face. With four bad edges on one face, turn that face once. With only two, put one on the front face beside three good edges and turn it: now there are four. With six or more, make four good first and then deal with the rest.',
      'Then bring the white-green edge to the bottom front and the white-blue edge to the bottom back. Use only the right, left, top and bottom faces and half turns of the front and the back, so that every edge stays good.',
      'With practice, do both jobs together: pick the turns that make edges good so that they also carry the line edges home.',
    ],
    cases: {
      'four-bad': {
        title: 'Four bad edges on the front',
        body: `All four edges of the front face are bad. The one at the top front has orange facing up, and the one at the bottom front has red facing down. The two at the sides have green facing the front, so their other stickers decide: white and yellow, so both are bad. ${E.fourBad} makes all four good.`,
      },
      gather: {
        title: 'Three on the front, one elsewhere',
        body: 'Three bad edges are on the front face: at the front right, the bottom front and the front left. The fourth is at the bottom right. R lifts the front-right one to the top and brings the bottom-right one up in its place. U brings the lifted one to the top front. All four are now on the front face, and F makes them good.',
      },
      'two-bad': {
        title: 'Two bad edges',
        body: "The bad edges are at the top left, with orange facing up, and at the front left, with orange facing the front. One turn cannot make two edges good. The first F makes the front-left edge good and three good edges bad. Now there are four: three on the front face and the one at the top left. U' brings that one to the front, and the second F makes all four good.",
      },
      'line-edges': {
        title: 'Line edges from the top',
        body: 'Every edge is good already. The white-green edge is at the top right and the white-blue edge at the top front, both with white facing up. U puts the white-green edge above its place and F2 takes it down. U again puts the white-blue edge above its place at the back, and B2 takes it down. Half turns of the front and the back keep every edge good.',
      },
      together: {
        title: 'Both jobs at once',
        body: "Four edges are bad: at the top front, the front left, the bottom front and the bottom right. The one at the bottom right is the white-green line edge. R brings it to the front right, so all four are on the front face. F makes them good and, in the same turn, carries the white-green edge down to its place. The white-blue edge is now at the top right: U' B2 takes it home.",
      },
      done: {
        title: 'The line, seen from below',
        body: 'The white-green and white-blue edges sit either side of the white centre. The rest of the cube still looks mixed, but every edge is now good.',
      },
    },
    tip: 'Plan the whole stage before the first move, as you would a cross. It takes six moves on average and never more than nine. Take no notice of the corners yet. A cross on the bottom instead of the line is a common variation, called EOCross: it costs more moves here and makes the next stage simpler.',
  },
  'first-two-layers': {
    goal: 'The first two layers are solved. Each side of the line there is a block of five pieces: a bottom edge, two corners and two middle-layer edges. Every last-layer edge shows yellow on top.',
    steps: [
      'From here on, turn only the right, top and left faces. These turns cannot make a good edge bad and cannot move the line, so nothing done so far can be undone. There is no need to turn the cube in your hands.',
      'Start a block with its bottom edge: white-orange on the right, white-red on the left. Bring it to the top layer above its place and take it down with a half turn.',
      'Fill the two slots of the block. As in other methods, join a white corner to its middle-layer edge in the top layer and put the pair in. A slot at the front takes the pair with R U R\' or the like; a slot at the back takes it with R\' U R or the like, so the back of the cube is never brought round.',
      'Because every edge is good, a corner and its edge can always be joined with these turns alone: an edge never arrives the wrong way round.',
      'Do the same on the left with the left face, as a mirror image. Work on whichever block has the easier pieces first.',
      'If a piece is stuck in a wrong slot, take it out with the three moves that would put a pair in, then solve it as usual.',
    ],
    cases: {
      'bottom-edge': {
        title: 'Bottom edge of a block',
        body: `The white-orange edge is at the top back, with white facing up. U brings it above its place on the right, and R2 takes it down. The whole sequence is ${B.bottomEdge}.`,
      },
      'front-pair': {
        title: 'A joined pair to the front',
        body: "The corner is above the front-right slot with white facing the front. Its edge is beside it at the top right: both show green on top and orange on the right. U moves the pair away, R turns the slot up to meet it, U' slides the pair in and R' carries it down.",
      },
      'split-pair': {
        title: 'A split pair',
        body: "The corner is above the front-right slot with white facing right and orange on top. The edge is at the top back with green on top. R takes the corner to the back, where it meets the edge. U brings the two round together, and R' carries the pair down.",
      },
      'back-pair': {
        title: 'A joined pair to the back',
        body: "The corner is above the back-right slot with white facing the back. Its edge is beside it at the top right: both show blue on top and orange on the right. This is the front case seen in a mirror: U' moves the pair away, R' turns the back slot up, U slides the pair in and R carries it down. The cube stays as it is held.",
      },
      'left-pair': {
        title: 'A joined pair on the left',
        body: "The picture shows the cube from the left. The right block is finished. The corner is above the front-left slot with white facing the front, and its edge is beside it at the top left: both show green on top and red on the left. The left hand does what the right hand did: U' L' U L.",
      },
      done: {
        title: 'Both blocks built',
        body: 'The first two layers are solved, and the yellow edges make a cross on top without any more work.',
      },
    },
    tip: 'The solver builds one whole block and then the other, each in the fewest moves it can find, and often moves several pieces at once. Its moves will be shorter than yours and may look different. What matters is the habit: right, top and left faces only, with the cube held still.',
  },
  'orient-last-layer-corners': {
    goal: 'Every piece of the last layer shows yellow on top. The pieces are not yet in their own places, so the sides of the top layer are still mixed.',
    steps: [
      'Look at the top. The yellow edges make a cross already. This is what the first stage was for: good edges stay good, so the cross comes for free.',
      'Count the corners that show yellow on top: none, one or two. It is never exactly three. If all four do, this stage is done.',
      'See where the other corners show yellow on the sides, and find the case below.',
      'Turn the top layer until the cube matches the picture of the case, and do its sequence. One sequence always finishes the stage.',
    ],
    cases: cornerOrientationCases,
    tip: 'About one time in 27 the corners face up already and this stage is skipped. Advanced ZZ solvers replace this stage and the next with one sequence out of 493, a set called ZBLL, which only works because the edges always face up. Learn the seven and the 21 first.',
  },
  'permute-last-layer': {
    goal: 'Every piece of the last layer is in its own place. The cube is solved.',
    steps: [
      'Look at the sides of the top layer, not at the top. Look for headlights (two corners showing the same colour on one side), blocks (a corner and the edge beside it showing the same colour) and finished sides.',
      'Find the case below with the same pattern. There are 21.',
      'Turn the top layer until the pattern sits as the case describes, and do its sequence. Some sequences turn the whole cube or the front face; that is fine now, because nothing is left to protect.',
      'Turn the top layer once more if it is not yet lined up with the sides.',
    ],
    cases: permutationCases,
    tip: 'About one time in 72 the last layer needs only a turn of the top, or nothing at all. These are the same 21 sequences as in CFOP, so they carry over if you learn that method too.',
  },
}

export const zzText: MethodText<ZzStage> = {
  name: 'ZZ',
  level: 'Speedsolving',
  summary:
    'Turn every edge the right way round first, with a line on the bottom. The first two layers then need only three faces and no turning of the cube, and the last layer starts with its cross made.',
  lead: 'ZZ is named after Zbigniew Zborowski, who published it in 2006. It begins with a stage no layer method has: every edge is turned the "good" way round while two bottom edges are placed as a line, a stage called EOLine. After that the first two layers are built as two blocks with turns of the right, top and left faces only, so the cube is never turned in the hands, and the last-layer edges face up without any work. Compared with the beginner method it has far fewer moves and stages, and compared with CFOP it has fewer last-layer sequences to learn, 28 instead of 78. The price is the first stage: seeing which edges are bad, and planning their fix before the first move, takes practice. This is the original form of the method; many ZZ solvers now make a whole cross in the first stage instead of the line, which is called EOCross.',
  solverHint:
    'About 43 moves, in four stages. The line takes about 6 moves and the two blocks about 16, found by search, so they are shorter than a person would usually manage. The line is made from front to back or from side to side, whichever gives the shorter solution, so check how the first instruction asks you to hold the cube.',
  stages,
  lessons,
}
