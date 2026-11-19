/**
 * The text under the solver: what it does, how to enter a cube, the kinds of
 * solution, how it works and what its problems mean, for someone who arrived
 * from a search. Every fact in it is one the code holds; change them together.
 */

/** A titled piece of a section, under a smaller heading. */
export interface SolverAboutPart {
  title: string
  body: string[]
}

export interface SolverAboutSection {
  heading: string
  body: string[]
  parts?: SolverAboutPart[]
}

export interface SolverAboutText {
  /** What the solver does. */
  what: SolverAboutSection
  /** Entering the cube: by hand, by keyboard, by camera. */
  enter: SolverAboutSection & { tips: { title: string; items: string[] } }
  /** The short solution and the method solution; the list of methods is drawn after the last part, then the two links. */
  solutions: SolverAboutSection & { startAction: string; allMethods: string }
  /** Reading the moves and playing them. */
  reading: SolverAboutSection & { action: string }
  /** How the solvers work and where they run. */
  how: SolverAboutSection
  /** The problems the solver reports before solving. */
  problems: SolverAboutSection
  faq: { heading: string; items: { question: string; answer: string }[] }
}

export const solverAboutText: SolverAboutText = {
  what: {
    heading: 'What this cube solver does',
    body: [
      'Cubewise solves a scrambled 3×3 Rubik’s cube from its colours. Copy the colours of your cube onto the cube on this page, or scan them with a camera, and press Solve. The solution is played on a 3D cube, one move at a time, while you make the same moves on your own cube.',
      'It is free, needs no account, and runs in your browser. Ask for a short solution of about 21 moves, or for one that follows the method you are learning, in the same stages as the lessons.',
    ],
  },

  enter: {
    heading: 'How to enter your cube',
    body: [
      'The page shows one face at a time, the front face, with its stickers numbered 1 to 9. The net shows all six faces at once. The centres start in the standard colour scheme, white on top and green in front, so hold your cube the same way and copy what you see.',
    ],
    parts: [
      {
        title: 'With a mouse or a finger',
        body: [
          'Pick a colour, then click or tap each sticker of the front face that has it. The arrows around the cube bring another face to the front. Under each colour is a count of the stickers painted so far: a finished cube has nine of each.',
        ],
      },
      {
        title: 'With the keyboard',
        body: [
          'Press a sticker number from 1 to 9, then a colour key: W, Y, R, O, B or G. The cursor moves to the next unpainted sticker by itself. The arrow keys bring another face to the front, Ctrl+Z undoes and Enter solves.',
        ],
      },
      {
        title: 'With the camera',
        body: [
          'Press “Scan with camera” and show the cube one face at a time, turning it as the page asks. Each face is captured by itself once you hold it still. At the end, compare the six faces with the pictures taken and fix any sticker that was read wrongly.',
        ],
      },
    ],
    tips: {
      title: 'Getting the colours right',
      items: [
        'Keep the same face on top while you go round the four side faces.',
        'Look at the centre first. It never moves, so it tells you which face you are looking at.',
        'Red and orange, or white and yellow, are easy to confuse. Use even light and, for a scan, avoid glare.',
        'If your cube has a different colour scheme, repaint the centres first.',
      ],
    },
  },

  solutions: {
    heading: 'Two kinds of solution',
    body: [
      'Choose the kind of solution under “Method” before you press Solve.',
    ],
    parts: [
      {
        title: 'The short solution',
        body: [
          'It aims at the fewest moves: about 21, whatever the scramble. It is the quickest way to a solved cube, but it has no stages and no logic a person could follow.',
        ],
      },
      {
        title: 'A solution by the method you are learning',
        body: [
          'A method solution solves your cube as a person would, stage by stage, with the same sequences the lessons teach. It is longer, but you can see why each move is made, and every stage links to its lesson. The solver offers every method taught on Cubewise:',
        ],
      },
    ],
    startAction: 'Start with the beginner method',
    allMethods: 'Compare all the methods',
  },

  reading: {
    heading: 'How to read the moves',
    body: [
      'Each letter is a face: R right, L left, U up, D down, F front, B back. A letter alone, such as R, is a quarter turn clockwise as you look at that face. R’ is the same turn anticlockwise, and R2 is a half turn.',
      'Before the first move, the solver tells you how to hold the cube: which centre faces you and which is on top. You can then play the solution, pause it, or go one move back or forward.',
    ],
    action: 'New to this? Read “Before you start”',
  },

  how: {
    heading: 'How the solver works',
    body: [
      'The short solution comes from our own implementation of Kociemba’s two-phase algorithm. The first phase brings the cube to a state that can be finished with only the up and down faces and half turns of the other four. The second phase finishes it. Both are searches guided by lookup tables.',
      'The first solution found is usually a little long, so the solver keeps looking. It stops when it has a solution of 21 moves or fewer, or after about a fifth of a second, and gives you the shortest it found.',
      'A method solution is built by that method’s own solver, which works through the stages in order and takes its sequences from the same table as the lessons.',
      'All of this runs in your browser, in a Web Worker, so the page does not freeze. Nothing is uploaded: not your colours, and not the camera picture. A scan reads the colours on your device, and the pictures of the six faces are kept only until you have checked them.',
    ],
  },

  problems: {
    heading: 'When the cube cannot be solved',
    body: [
      'Before solving, Cubewise checks that your colours make a real cube. If not, it says what is wrong and, where it can, frames in red the stickers to look at. Most problems are slips: a sticker without a colour, a colour used more or fewer than nine times, or a piece that exists on no cube, such as an edge that is both white and yellow.',
      'Three problems are different: every piece is there, yet no moves can solve the cube.',
    ],
    parts: [
      {
        title: 'A twisted corner',
        body: [
          'One corner is turned round in its place. Check the stickers of each corner against your cube. If they match, a corner of the real cube was twisted by hand and has to be twisted back.',
        ],
      },
      {
        title: 'A flipped edge',
        body: [
          'One edge has its two colours the wrong way round. Nearly always, its two stickers were entered in each other’s place.',
        ],
      },
      {
        title: 'Two swapped pieces',
        body: [
          'Two pieces have changed places. Look for two stickers entered the wrong way round. If the entry is right, the real cube was taken apart and put together wrongly.',
        ],
      },
    ],
  },

  faq: {
    heading: 'Questions about the solver',
    items: [
      {
        question: 'Does it solve the 2×2, the 4×4 or other puzzles?',
        answer:
          'Not today. The solver works on the standard 3×3 cube only.',
      },
      {
        question: 'Is the picture from my camera sent anywhere?',
        answer:
          'No. The colours are read inside your browser and nothing is uploaded.',
      },
      {
        question: 'Why is a method solution so much longer than the short one?',
        answer:
          'Because it is made to be followed, not to be short. The beginner method repeats a few simple sequences many times. Methods such as CFOP and Roux need far fewer moves.',
      },
      {
        question: 'Can I use the solver on a phone?',
        answer:
          'Yes. Tap the stickers to paint them, or scan the cube with the phone’s camera.',
      },
      {
        question: 'I made a wrong move while following the solution. What now?',
        answer:
          'If you remember the move, undo it on your cube and go on. If you are lost, press “Edit cube”, enter the colours as they are now and solve again.',
      },
    ],
  },
}
