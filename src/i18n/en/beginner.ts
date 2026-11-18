/** The text of the beginner method: its stages and their lessons. */
import { SEQUENCES as A } from '../../core/methods/beginner/sequences.ts'
import type { BeginnerStage } from '../../core/methods/beginner/stages.ts'
import type { MethodText } from '../method-text.ts'

const X_TEXT = A.lastLayerCross

const stages: MethodText<BeginnerStage>['stages'] = {
  cross: {
    name: 'Cross',
    summary:
      'Bring four edges around one centre so they form a plus sign, each edge also matching the centre beside it.',
  },
  'first-layer-corners': {
    name: 'First-layer corners',
    summary:
      'Drop the four corners into place around the cross to finish the first layer, using one short sequence.',
  },
  'middle-layer-edges': {
    name: 'Middle-layer edges',
    summary:
      'Turn the cube over and slot the four middle edges in from the top, to the left or to the right.',
  },
  'last-layer-cross': {
    name: 'Last-layer cross',
    summary:
      'Flip the edges of the last layer until its face shows a plus sign, without disturbing the two solved layers.',
  },
  'last-layer-edges': {
    name: 'Last-layer edges',
    summary: 'Cycle the edges of the last layer round until each one matches the centre beside it.',
  },
  'last-layer-corner-positions': {
    name: 'Last-layer corner positions',
    summary: 'Move the last four corners to their own places; they may still be twisted.',
  },
  'last-layer-corner-twists': {
    name: 'Last-layer corner twists',
    summary: 'Twist each remaining corner the right way up, one at a time. The cube is solved.',
  },
}

const lessons: MethodText<BeginnerStage>['lessons'] = {
  cross: {
    goal: 'Four white edges form a plus sign on the bottom, and the side colour of each one matches the centre next to it.',
    steps: [
      'Hold the cube with the yellow centre on top and the white centre on the bottom.',
      'Find the four edges that have a white sticker. Bring each one to the top layer with its white sticker facing up, next to the yellow centre. The order does not matter. This shape is called the daisy.',
      'Look at the side sticker of one petal. Turn the top layer until that sticker is above the centre of the same colour.',
      'Turn that side face twice. The edge drops to the bottom, into its own place.',
      'Do the same for the other three petals.',
    ],
    cases: {
      daisy: {
        title: 'The daisy',
        body: 'Four white edges around the yellow centre. Getting here takes no sequence, only a little trial and error.',
      },
      petal: {
        title: 'Dropping a petal',
        body: 'The green side of this petal is above the green centre, so the front face is turned twice.',
      },
      done: {
        title: 'The finished cross, seen from below',
        body: 'Every white edge matches the centre beside it.',
      },
    },
    tip: 'In the solver, the cross is made by a shorter route than the daisy. Once the daisy feels easy, try putting edges straight into the bottom.',
  },
  'first-layer-corners': {
    goal: 'The four white corners join the cross. The whole bottom layer is solved, and the bottom row of every side matches its centre.',
    steps: [
      'Find a corner with a white sticker in the top layer.',
      'Its two other colours say where it belongs: between the two centres of those colours. Turn the top layer until the corner is directly above that place, then turn the whole cube so the corner is at the front right.',
      'See which way its white sticker faces, and do the matching sequence below.',
      `If a white corner is stuck in the bottom layer, in the wrong place or twisted, hold it at the front right and do ${A.cornerFacingRight} once. That lifts it to the top layer, where you can place it as usual.`,
    ],
    cases: {
      right: { title: 'White faces right', body: 'The shortest case: three moves.' },
      front: { title: 'White faces the front', body: 'The mirror image of the first case.' },
      up: {
        title: 'White faces up',
        body: `Do ${A.cornerFacingUp} first. The corner comes back with white facing right, so finish with ${A.cornerFacingRight}.`,
      },
    },
    tip: 'After each corner, check that the cross is still whole. If it is not, a move was missed: undo it and try again.',
  },
  'middle-layer-edges': {
    goal: 'The four edges of the middle layer are in place, so the two bottom layers are solved.',
    steps: [
      'Find an edge in the top layer that has no yellow sticker.',
      'Look at its side sticker, not the one on top. Turn the top layer until that sticker is above the centre of the same colour, then turn the whole cube so they face you.',
      'The colour on top of the edge says where it goes: to the right or to the left. Do the matching sequence.',
      'If an edge is stuck in the middle layer, in the wrong place or flipped, hold it at the front right and do the “to the right” sequence once. That brings it up to the top layer.',
    ],
    cases: {
      right: {
        title: 'The edge goes to the right',
        body: 'The top colour of the edge matches the centre on the right.',
      },
      left: {
        title: 'The edge goes to the left',
        body: 'The top colour of the edge matches the centre on the left.',
      },
    },
    tip: 'Both sequences begin by turning the top layer away from the side the edge is going to.',
  },
  'last-layer-cross': {
    goal: 'The top face shows a yellow plus sign. Only yellow stickers matter in this stage, not the side colours.',
    steps: [
      'Look at the four edges of the top face and see which have yellow facing up.',
      'Match what you see to one of the three shapes below. Turn the top layer until the shape sits as in the picture.',
      `Do ${X_TEXT}. A dot becomes a corner shape, a corner shape becomes a line, and a line becomes the cross.`,
    ],
    cases: {
      dot: {
        title: 'A dot',
        body: 'No edge has yellow on top. Do the sequence once, turn the top layer until the corner shape is at the back left, then do it twice more.',
      },
      corner: {
        title: 'A corner shape',
        body: 'Two neighbouring edges have yellow on top. Hold them at the back and on the left, and do the sequence twice.',
      },
      line: {
        title: 'A line',
        body: 'Two opposite edges have yellow on top. Hold the line going from left to right, and do the sequence once.',
      },
    },
    tip: 'Some corners may show yellow on top as well. Ignore the corners for now.',
  },
  'last-layer-edges': {
    goal: 'Each edge of the yellow cross also matches the centre on its side.',
    steps: [
      'Turn the top layer and count how many edges match the centre on their side. You can always get at least two to match.',
      'If all four match, this stage is already done.',
      `If the two matching edges are next to each other, hold the cube with them at the back and on the right. Do ${A.lastLayerEdges}, then turn the top layer once more (U).`,
      'If the two matching edges are opposite each other, do the sequence once from any side. After that, two neighbouring edges match and you can go on as above.',
    ],
    cases: {
      swap: {
        title: 'Two neighbouring edges match',
        body: 'The edges at the back and on the right are correct. The front and left edges change places.',
      },
    },
    tip: 'Only the cross matters here. The corners move around, and that is fine.',
  },
  'last-layer-corner-positions': {
    goal: 'Every yellow corner sits between its own three centres. It may still be twisted.',
    steps: [
      'Check each corner of the top layer: do its three colours match the three centres around it, in any order? If so, it is in the right place.',
      `If one corner is in the right place, hold the cube with it at the front right of the top layer and do ${A.lastLayerCornerCycle}. The other three corners move round. If they are still wrong, do it once more.`,
      'If no corner is in the right place, do the sequence once from any side. After that, one corner is right.',
      'If all four are in the right place, go on to the last stage.',
    ],
    cases: {
      cycle: {
        title: 'One corner in the right place',
        body: 'The front-right corner stays where it is. The other three move round.',
      },
    },
    tip: 'Do not turn the top layer on its own in this stage, or the cross will no longer match. Turn the whole cube instead.',
  },
  'last-layer-corner-twists': {
    goal: 'Every yellow corner has yellow on top. The cube is solved.',
    steps: [
      'Hold the cube with a twisted corner at the front right of the top layer.',
      `Do ${A.lastLayerCornerTwist} twice. If yellow is not on top of that corner yet, do it twice more.`,
      'The rest of the cube now looks scrambled. That is expected. Do not turn the whole cube.',
      'Turn only the top layer to bring the next twisted corner to the front right, and repeat.',
      'When the last corner is done, the lower layers come back by themselves. Turn the top layer to finish.',
    ],
    cases: {
      twist: {
        title: 'Two twisted corners',
        body: 'Watch the two bottom layers break apart and come back together.',
      },
    },
    tip: 'Count carefully: the sequence is always done two or four times in a row, never an odd number.',
  },
}

export const beginnerText: MethodText<BeginnerStage> = {
  name: 'Beginner method',
  level: 'Start here',
  summary:
    'Solve the cube one layer at a time, in seven stages. Each stage has one goal and only a few sequences to remember.',
  lead: 'The beginner method solves the cube one layer at a time. There are seven stages. Each has a single goal, a picture of what to look for, and a short sequence you can watch in 3D.',
  solverHint:
    'About 130 moves, in the seven stages taught in the lessons. Longer, but you can follow why each move is made.',
  stages,
  lessons,
}
