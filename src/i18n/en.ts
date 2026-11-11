/**
 * Every piece of text the site shows, in English. Components read text from
 * here and never hard-code it, so another language is one more file like this.
 */
import type { ColourKey } from '../solver/entry.ts'
import { SEQUENCES as A } from '../beginner/sequences.ts'
import type { BeginnerStage } from '../beginner/stages.ts'

const colourNames: Record<ColourKey, string> = {
  W: 'white',
  Y: 'yellow',
  R: 'red',
  O: 'orange',
  B: 'blue',
  G: 'green',
}

const faceNames = ['Up', 'Right', 'Front', 'Down', 'Left', 'Back']

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many)

const X_TEXT = A.lastLayerCross

const stages: Record<BeginnerStage, { name: string; summary: string }> = {
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

const lessons: Record<
  BeginnerStage,
  { goal: string; steps: string[]; cases: Record<string, { title: string; body: string }>; tip: string }
> = {
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

export const en = {
  site: {
    name: 'Cubewise',
    tagline: 'Solve your cube and learn it at the same time.',
    description:
      'Enter the colours of your scrambled 3×3 cube and get a short, animated solution in seconds. Then learn to solve it yourself, step by step.',
    nav: { solver: 'Solver', learn: 'Learn' },
    footer: 'Made for people who have a scrambled cube on their desk.',
    notFound: {
      title: 'Page not found',
      body: 'That page does not exist. The solver is still here.',
      action: 'Go to the home page',
    },
  },

  colourNames,
  faceNames,

  home: {
    title: 'Cubewise: Rubik’s cube solver and lessons',
    heading: 'Solve your cube and learn it at the same time.',
    lead: 'Enter the colours of your scrambled 3×3 cube and watch it being solved, move by move. When you are ready, learn the method and solve it yourself.',
    solveAction: 'Solve my cube',
    learnAction: 'Learn to solve it',
    cubeAlt: 'A scrambled 3×3 cube',
    load3d: 'Tap to load the 3D cube',
    dragHint: 'Drag the cube to look around it.',
    how: {
      heading: 'How it works',
      steps: [
        {
          title: 'Enter your colours',
          body: 'Hold your cube and copy its colours, one face at a time. On a keyboard, press a sticker number and then a colour letter. On a phone, pick a colour and tap.',
        },
        {
          title: 'Get the solution',
          body: 'Cubewise checks the cube for mistakes, then solves it in your browser. Choose the short solution of about 21 moves, or the beginner method, stage by stage, to learn from.',
        },
        {
          title: 'Follow along',
          body: 'Play the solution on a 3D cube, pause it, or go one move at a time while you turn the cube in your hands.',
        },
      ],
    },
    learn: {
      heading: 'Learn the beginner method',
      lead: 'The beginner method solves the cube layer by layer in seven stages. Each stage has one goal and only a few sequences to remember.',
      action: 'See all the stages',
    },
    faq: {
      heading: 'Questions and answers',
      items: [
        {
          question: 'Can every scrambled cube be solved?',
          answer:
            'Yes, as long as it was scrambled by turning its faces. Any such cube can be solved in 20 moves or fewer. If a corner was twisted by hand or the cube was taken apart and rebuilt wrongly, it may be impossible, and Cubewise will tell you so.',
        },
        {
          question: 'How many moves will the solution have?',
          answer:
            'Usually 21 or fewer, and sometimes 22. The shortest possible solution never needs more than 20 moves, but finding it exactly takes much longer than finding one that is almost as short.',
        },
        {
          question: 'It says my cube cannot be solved. What now?',
          answer:
            'Almost always one or two stickers were entered wrongly. Cubewise highlights the stickers it suspects. Check them against your cube, fix them and press Solve again.',
        },
        {
          question: 'My cube has different colours. Will it still work?',
          answer:
            'Yes. Paint the centre of each face with a different colour to match your cube, then paint the rest. Any six colours work, as long as you use the same one for the same colour every time.',
        },
        {
          question: 'Do I need an account, and is anything uploaded?',
          answer:
            'No. There are no accounts, and the cube is solved in your own browser. Your colours are saved only on your device, so a page refresh does not lose them.',
        },
        {
          question: 'What do the letters in the solution mean?',
          answer:
            'Each letter is a face: R right, L left, U up, D down, F front, B back. A letter alone means a quarter turn clockwise as you look at that face, an apostrophe means anticlockwise, and a 2 means a half turn.',
        },
      ],
    },
  },

  solver: {
    title: 'Rubik’s cube solver: enter your colours, get the moves | Cubewise',
    description:
      'Free online 3×3 Rubik’s cube solver. Enter the colours with your keyboard or by tapping, and follow an animated solution of about 21 moves.',
    heading: 'Cube solver',
    lead: 'Copy the colours of your cube, one face at a time, then press Solve.',
    loading3d: 'Loading the 3D cube…',

    entry: {
      colours: 'Colours',
      coloursHint: 'Pick a colour, then click stickers on the face in front.',
      paletteLabel: (colour: ColourKey, count: number) =>
        `${colourNames[colour]}, ${count} of 9 painted`,
      keyboard: 'Keyboard',
      keyboardSteps: [
        { keys: ['1', '–', '9'], text: 'choose a sticker on the front face' },
        { keys: ['W', 'Y', 'R', 'O', 'B', 'G'], text: 'paint it and move to the next one' },
        { keys: ['←', '↑', '↓', '→'], text: 'bring another face to the front' },
      ],
      allFaces: 'All six faces',
      allFacesHint: 'Click a face to bring it to the front.',
      stickerLabel: (face: number, number: number, colour: ColourKey | null) =>
        `${faceNames[face]} face, sticker ${number}, ${colour === null ? 'not painted' : colourNames[colour]}`,
      turn: { left: 'Show the left face', right: 'Show the right face', up: 'Show the top face', down: 'Show the bottom face' },
      undo: 'Undo',
      redo: 'Redo',
      clearFace: 'Clear face',
      reset: 'Reset cube',
      solve: 'Solve',
      solving: 'Solving…',
    },

    method: {
      label: 'Method',
      short: 'Short solution',
      beginner: 'Beginner method',
      hints: {
        short: 'About 21 moves. The fastest way to a solved cube.',
        beginner:
          'About 130 moves, in the seven stages taught in the lessons. Longer, but you can follow why each move is made.',
      },
    },

    problems: {
      title: 'This cube cannot be solved yet',
      unpainted: (count: number) =>
        `${count} ${plural(count, 'sticker still needs', 'stickers still need')} a colour.`,
      'wrong-sticker-count': 'The cube is missing stickers. Reset it and enter the colours again.',
      'duplicate-centres':
        'Two centres have the same colour. Every face needs a centre of a different colour.',
      'unknown-colour':
        'The highlighted stickers have a colour that no centre has. Check them, or repaint a centre.',
      'wrong-colour-count': (wrong: { colour: ColourKey; count: number }[]) =>
        `Each colour must appear 9 times. Right now: ${wrong
          .map(({ colour, count }) => `${colourNames[colour]} ${count}`)
          .join(', ')}.`,
      'impossible-piece':
        'The highlighted piece does not exist on any cube. At least one of its stickers is wrong.',
      'duplicate-piece':
        'The same piece appears twice. At least one of the highlighted stickers is wrong.',
      'twisted-corner':
        'Every piece is there, but one corner is twisted. Check the corner stickers, or the corner was twisted by hand on the real cube.',
      'flipped-edge':
        'Every piece is there, but one edge is flipped. Check the edge stickers for two swapped colours.',
      'swapped-pieces':
        'Every piece is there, but two pieces are swapped. Check for two stickers entered the wrong way round.',
      failed: 'Something went wrong while solving. Please try again.',
    },

    playback: {
      heading: 'Solution',
      moveCount: (count: number) => `${count} ${plural(count, 'move', 'moves')}`,
      alreadySolved: 'This cube is already solved. Nothing to do!',
      hold: (front: ColourKey, up: ColourKey) =>
        `Hold your cube with the ${colourNames[front]} centre facing you and the ${colourNames[up]} centre on top.`,
      progress: (done: number, total: number) => `Move ${done} of ${total}`,
      play: 'Play',
      pause: 'Pause',
      back: 'Step back',
      forward: 'Step forward',
      restart: 'Back to the start',
      edit: 'Edit cube',
      done: 'Solved!',
      keys: [
        { keys: ['Space'], text: 'play or pause' },
        { keys: ['←', '→'], text: 'one move back or forward' },
        { keys: ['E'], text: 'edit the cube' },
      ],
      notation:
        'A letter is a quarter turn clockwise as you look at that face (R right, L left, U up, D down, F front, B back). An apostrophe means anticlockwise, and 2 means a half turn.',
      wholeCubeNotation:
        'A dashed y means turn the whole cube, not a face: the right side comes to the front. y\u2019 turns it the other way, and y2 is a half turn.',
      lesson: 'Lesson',
      stageDone: 'Already done.',
    },
  },

  learn: {
    title: 'Learn to solve the Rubik’s cube: the beginner method | Cubewise',
    description:
      'The beginner method solves the 3×3 cube layer by layer in seven stages. See what each stage does and the order they go in.',
    heading: 'Learn to solve the cube',
    lead: 'The beginner method solves the cube one layer at a time. There are seven stages. Each has a single goal, a picture of what to look for, and a short sequence you can watch in 3D.',
    stagesHeading: 'The seven stages',
    stageNumber: (number: number) => `Stage ${number}`,
    stages,
    practice: {
      heading: 'Practise on your own cube',
      body: 'In the solver, choose the beginner method. It solves your cube in these same seven stages, so you can follow each one with the cube in your hands.',
      action: 'Open the solver',
    },
    lesson: {
      pageTitle: (name: string, number: number) =>
        `${name}: beginner method, stage ${number} | Cubewise`,
      allStages: 'All stages',
      stageOf: (number: number, total: number) => `Stage ${number} of ${total}`,
      goal: 'Goal',
      steps: 'How to do it',
      cases: 'What it looks like',
      tip: 'Tip',
      watch: 'Watch in 3D',
      markComplete: 'Mark as complete',
      completed: 'Completed',
      tryIt: 'Try it on your own cube',
      notation:
        'Reading the moves: a letter is a quarter turn clockwise as you look at that face (R right, L left, U up, D down, F front, B back). An apostrophe means anticlockwise, and 2 means a half turn. In the pictures, grey stickers are the ones that do not matter yet.',
    },
    lessons,
  },
}

export type Messages = typeof en
