/**
 * Every piece of text the site shows, in English. Components read text from
 * here and never hard-code it, so another language is one more file like this.
 */
import type { ColourKey } from '../pages/solver/entry.ts'
import type { MethodId } from '../core/methods/index.ts'
import { beginnerText } from './en/beginner.ts'
import { keyholeText } from './en/keyhole.ts'
import { cfopText } from './en/cfop.ts'
import type { MethodText } from './method-text.ts'

const colourNames: Record<ColourKey, string> = {
  W: 'white',
  Y: 'yellow',
  R: 'red',
  O: 'orange',
  B: 'blue',
  G: 'green',
}

const faceNames = ['Up', 'Right', 'Front', 'Down', 'Left', 'Back']

/** The text of every method, in the order of `METHOD_IDS`. */
const methods: Record<MethodId, MethodText> = {
  beginner: beginnerText,
  keyhole: keyholeText,
  cfop: cfopText,
}

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many)

export const en = {
  site: {
    name: 'Cubewise',
    tagline: 'Solve your cube and learn it at the same time.',
    description:
      'Enter the colours of your scrambled 3×3 cube and get a short, animated solution in seconds. Then learn to solve it yourself, step by step.',
    nav: { solver: 'Solver', learn: 'Learn' },
    menu: { open: 'Open the menu', close: 'Close the menu' },
    theme: { label: 'Theme', system: 'Same as your device', light: 'Light', dark: 'Dark' },
    footer: 'Made for people who have a scrambled cube on their desk.',
    builtBy: 'Built by',
    author: 'Ahmed Zougari',
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
          body: 'Cubewise checks the cube for mistakes, then solves it in your browser. Choose the short solution of about 21 moves, or a method you are learning, solved stage by stage.',
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
      otherMethods: 'Other methods',
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

    scan: {
      open: 'Scan with camera',
      heading: 'Scan your cube',
      progress: (face: number) => `Face ${face} of 6`,
      steps: [
        'Show one face of the cube to the camera. This is the front face. Notice which face is on top.',
        'Turn the cube so the face on the right comes to the front. Keep the same face on top.',
        'Turn it the same way again, to the next side face.',
        'Turn it the same way once more, to the last side face.',
        'Now tilt the cube so the top face comes to the front.',
        'Tilt it back the other way, two quarter-turns, so the bottom face comes to the front.',
      ],
      tips: 'Use even light and avoid glare. Hold the face upright and facing the camera: it is captured by itself once it is found and held still. If the cube is not found, line the face up with the square and press Capture.',
      starting: 'Starting the camera…',
      looking: 'Looking for the cube…',
      holdStill: 'Hold still…',
      turnNow: 'Captured. Now turn the cube.',
      capture: 'Capture',
      retake: 'Retake last face',
      cancel: 'Cancel',
      tryAgain: 'Try again',
      videoLabel: 'Camera picture; a grid is drawn over the cube face once it is found',
      reviewHeading: 'Check the colours',
      check: 'Check each face against its picture. If a sticker is wrong, pick its colour below, then tap the sticker.',
      pictureLabel: (face: number) => `The picture taken of face ${face}`,
      checkSticker: (face: number, number: number, colour: ColourKey) =>
        `Face ${face}, sticker ${number}, ${colourNames[colour]}`,
      use: 'Use these colours',
      again: 'Scan again',
      done: 'Scanned. Compare the colours with your cube, fix any that are wrong, then press Solve.',
      copyReport: 'Copy scan report',
      reportCopied: 'Copied',
      guide: {
        open: 'How to scan',
        title: 'How to scan your cube',
        intro: 'You show the camera one face at a time, six in all. Hold each face still until you see the tick, then turn the cube.',
        laptop: {
          title: 'On a laptop',
          picture: 'A person facing a laptop holds a cube up to its camera, holds still, then turns the cube to the next face, six times.',
          hold: 'Sit facing the screen and hold the cube up to the webcam, one face flat towards it.',
        },
        phone: {
          title: 'On a phone',
          picture: 'A person holds a phone in one hand and a cube in the other, points the back camera at the cube, then turns the cube to the next face, six times.',
          hold: 'Hold the phone in one hand and the cube in the other, about a hand apart. Turn the cube, not the phone.',
        },
        stepsTitle: 'The six faces, in order',
        steps: [
          'Show the front face.',
          'Turn the cube to the next side face.',
          'Turn it the same way again.',
          'And once more, for the last side face.',
          'Tilt the cube to show the top face.',
          'Tilt it right over to show the bottom face.',
        ],
        light: 'Light from the side works best. A lamp straight above makes the stickers shine.',
        close: 'Got it',
      },
      errors: {
        unsupported: 'This browser cannot use the camera. Enter the colours by hand instead.',
        denied: 'The camera was blocked. Allow camera access for this site in your browser, then try again.',
        missing: 'No camera was found on this device.',
        failed: 'The camera could not be started. Close other apps that use it, then try again.',
      },
    },

    method: {
      label: 'Method',
      short: 'Short solution',
      shortHint: 'About 21 moves. The fastest way to a solved cube, with no stages to follow.',
      methodsGroup: 'Methods you can learn',
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
      pauseLabel: 'Pause between moves',
      pauseValue: (pauseMs: number) => (pauseMs === 0 ? 'None' : `${(pauseMs / 1000).toFixed(1)} s`),
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
        'A dashed x, y or z means turn the whole cube, not a face: x the way R turns, y the way U turns, z the way F turns.',
      wideNotation:
        'A small letter is a wide turn: that face and the middle layer behind it together. M, E and S turn a middle layer alone: M the way L turns, E the way D turns, S the way F turns.',
      lesson: 'Lesson',
      stageDone: 'Already done.',
    },
  },

  methods,

  learn: {
    title: 'Learn to solve the Rubik’s cube: choose a method | Cubewise',
    description:
      'Lessons for the ways people solve the 3×3 cube, from the beginner method to CFOP, Roux and ZZ. Pick a method and learn it stage by stage.',
    heading: 'Learn to solve the cube',
    lead: 'There is more than one way to solve a cube. Pick a method and learn it stage by stage: each stage has a single goal, pictures of what to look for, and sequences you can watch in 3D.',
    methodsHeading: 'Choose a method',
    stageCount: (count: number) => `${count} ${plural(count, 'stage', 'stages')}`,
    progress: (done: number, total: number) => `${done} of ${total} completed`,
    stageNumber: (number: number) => `Stage ${number}`,
    method: {
      pageTitle: (name: string) => `${name}: learn it stage by stage | Cubewise`,
      allMethods: 'All methods',
      stagesHeading: 'The stages',
    },
    practice: {
      heading: 'Practise on your own cube',
      body: (name: string) =>
        `In the solver, choose “${name}” as the method. It solves your cube in these same stages, so you can follow each one with the cube in your hands.`,
      action: 'Open the solver',
    },
    lesson: {
      pageTitle: (name: string, method: string, number: number) =>
        `${name}: ${method}, stage ${number} | Cubewise`,
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
      wideNotation:
        'A small letter (r, u, f) is a wide turn: that face and the middle layer behind it together. M, E and S turn a middle layer alone: M the way L turns, E the way D turns, S the way F turns. x, y and z turn the whole cube: x the way R turns, y the way U turns, z the way F turns.',
    },
  },
}

export type Messages = typeof en
