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
    goal: 'Four white edges form a plus sign on the white face, and the side colour of each one matches the centre next to it.',
    parts: [
      {
        title: 'The plan: a daisy first, then the cross',
        body: [
          'The cross belongs on the white face, underneath, where you cannot see it. So we build it in two easy halves.',
          'First, gather the four white edges on top, around the yellow centre, with white facing up. This is called the daisy. White next to yellow looks wrong, and it is: the daisy is only a place to park the edges where you can see them.',
          'Then send each petal down to the white face with one half turn. That makes the cross.',
        ],
        cases: ['daisy', 'done'],
      },
      {
        title: 'Making the daisy',
        body: [
          'Look for an edge with a white sticker. It can be in one of a few kinds of place, and each has its own short answer below. Do them in any order, one edge at a time.',
          'One rule keeps you safe: before you bring an edge up, check the place on top where it will land. If a petal is already there, turn the top layer first so that an empty place is waiting. Turning the top never spoils the daisy.',
        ],
        cases: ['middle', 'make-room', 'bottom', 'flipped-top', 'flipped-bottom'],
      },
      {
        title: 'Turning the daisy into the cross',
        body: [
          'Pick a petal and look at its other sticker, the one on the side of the cube.',
          'Turn the top layer until that sticker is directly above the centre of the same colour.',
          'Turn that side face twice. The petal goes down to the white face, in its own place. Do the same for the other three.',
        ],
        cases: ['petal', 'line-up'],
      },
      {
        title: 'A whole cross, from start to finish',
        body: [
          'Here is everything together on one scrambled cube: four white edges brought up one at a time, then four petals sent down. Step through it slowly and say what each move is for.',
        ],
        cases: ['whole'],
      },
    ],
    cases: {
      daisy: {
        title: 'The daisy',
        body: 'Four white edges around the yellow centre, white facing up. The side stickers do not need to match anything yet.',
      },
      done: {
        title: 'The finished cross, seen from below',
        body: 'The cube is turned over to show the white face. Every white edge also matches the centre beside it.',
      },
      middle: {
        title: 'A white edge in the middle layer',
        body: 'The white sticker faces you, on the right of the front face, and the place above it on the right is empty. One turn of the right face (R) swings the edge up, white on top. On the left side it is the same with L’.',
      },
      'make-room': {
        title: 'The same edge, with a petal in the way',
        body: 'Here a petal already sits on the right of the top. R would knock it out. So turn the top first (U) to bring the empty place round, then do R.',
      },
      bottom: {
        title: 'A white edge on the bottom, white facing down',
        body: 'You can see only its orange sticker, at the bottom of the right face; the white one is underneath. The place above it on top is empty, so turn the right face twice (R2).',
      },
      'flipped-top': {
        title: 'A white edge on top, the wrong way up',
        body: 'It is in the top layer, but white faces you and orange is on top. Turn the front face (F): the edge moves to the middle layer on the right, and now it is the first case. R finishes it.',
      },
      'flipped-bottom': {
        title: 'A white edge on the bottom, white facing you',
        body: 'White is at the bottom of the front face. Turn the front face the other way (F’) to move the edge to the middle layer on the right, then R brings it up.',
      },
      petal: {
        title: 'Dropping a petal',
        body: 'The side sticker of the front petal is green and it is above the green centre, so the front face is turned twice (F2).',
      },
      'line-up': {
        title: 'Lining a petal up first',
        body: 'The green petal is on the right, above the orange centre. That does not match. Turn the top (U) to bring it above the green centre, then turn the front face twice.',
      },
      whole: {
        title: 'Seven moves to the daisy, eight to the cross',
        body: 'L’ lifts the orange edge from the middle layer. U makes room and L2 lifts the red edge from the bottom. F’ then R brings up the blue edge, which had white facing you. U’ makes room and R lifts the green edge. Then each petal is lined up with the top layer and dropped: green, blue, orange, red.',
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
  roadmap: {
    picture: 'The first layer, solved',
    what: 'One layer at a time, in seven stages. Each stage has a single goal and a few short sequences, so you always know what to do next.',
    pick: 'Pick it if you have never solved a cube. It is where almost everyone starts.',
  },
  stages,
  lessons,
}
