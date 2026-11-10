/**
 * Every piece of text the site shows, in English. Components read text from
 * here and never hard-code it, so another language is one more file like this.
 */
import type { ColourKey } from '../solver/entry.ts'
import type { BeginnerStage } from '../learn/stages.ts'

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
    how: {
      heading: 'How it works',
      steps: [
        {
          title: 'Enter your colours',
          body: 'Hold your cube and copy its colours, one face at a time. On a keyboard, press a sticker number and then a colour letter. On a phone, pick a colour and tap.',
        },
        {
          title: 'Get the solution',
          body: 'Cubewise checks the cube for mistakes and finds a solution of about 21 moves in a fraction of a second, right in your browser.',
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
      soon: 'Soon',
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
    },
  },

  learn: {
    title: 'Learn to solve the Rubik’s cube: the beginner method | Cubewise',
    description:
      'The beginner method solves the 3×3 cube layer by layer in seven stages. See what each stage does and the order they go in.',
    heading: 'Learn to solve the cube',
    lead: 'The beginner method solves the cube one layer at a time. There are seven stages. Each has a single goal, and you never undo what an earlier stage did.',
    stagesHeading: 'The seven stages',
    stageNumber: (number: number) => `Stage ${number}`,
    soon: 'Lesson coming soon',
    stages,
    meanwhile: {
      heading: 'Have a scrambled cube right now?',
      body: 'The full lessons are being written. In the meantime the solver will get your cube back to solved, one move at a time.',
      action: 'Open the solver',
    },
  },
}

export type Messages = typeof en
