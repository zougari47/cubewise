/**
 * Text for the last-layer cases that several methods share. The keys are the
 * names in `core/methods/shared/last-layer.ts`.
 */
import type {
  CornerOrientationName,
  PermutationName,
} from '../../core/methods/shared/last-layer.ts'

type CaseText = { title: string; body: string }

export const cornerOrientationCases: Record<CornerOrientationName, CaseText> = {
  sune: {
    title: 'One corner faces up (Sune)',
    body: 'The top shows a fish. Hold the corner that faces up at the front left; the corner at the front right then shows the top colour on the front. The most useful sequence of the last layer.',
  },
  antisune: {
    title: 'One corner faces up, mirrored (Antisune)',
    body: 'The other fish. Hold the corner that faces up at the back right; the corner at the front right then shows the top colour on its right side. It is the first sequence played backwards.',
  },
  doubleSune: {
    title: 'No corner faces up, two pairs',
    body:
      'Two corners show the top colour on the left and two on the right. The sequence is the first one done twice, with its middle joined up.',
  },
  wheel: {
    title: 'No corner faces up, one pair',
    body: 'Two corners show the top colour on the left; the other two show it on the front and on the back.',
  },
  headlights: {
    title: 'Two corners face up, with headlights',
    body:
      'The other two corners show the top colour on the same side, like a pair of headlights. Hold the headlights at the front.',
  },
  chameleon: {
    title: 'Two corners face up, side by side',
    body:
      'The other two corners show the top colour on opposite sides. Hold the two finished corners on the right.',
  },
  bowtie: {
    title: 'Two corners face up, diagonally',
    body:
      'The two finished corners sit in opposite corners of the top face, like a bow tie. Hold them at the front left and the back right, with the top colour of the front-right corner facing you.',
  },
}

export const permutationCases: Record<PermutationName, CaseText> = {
  Aa: {
    title: 'Three corners go round (A, clockwise)',
    body: 'The edges are home already and one corner is too. The other three corners move round, clockwise.',
  },
  Ab: {
    title: 'Three corners go round (A, anticlockwise)',
    body: 'The same three corners, moving round the other way.',
  },
  E: {
    title: 'Corners swap in two pairs (E)',
    body: 'The edges are home. Each corner swaps with its neighbour across the cube: no side shows a matching pair of corners.',
  },
  Ua: {
    title: 'Three edges go round (U, anticlockwise)',
    body: 'All corners are home and one side is finished. Hold that side at the back; the other three edges move round.',
  },
  Ub: {
    title: 'Three edges go round (U, clockwise)',
    body: 'The same three edges, moving round the other way.',
  },
  H: {
    title: 'Opposite edges swap (H)',
    body: 'All corners are home. Each edge swaps with the one opposite it. It looks the same from every side.',
  },
  Z: {
    title: 'Neighbouring edges swap (Z)',
    body: 'All corners are home. Each edge swaps with a neighbour, in two pairs.',
  },
  Ja: {
    title: 'Two corners and two edges swap (J, first)',
    body:
      'One side is finished; hold it at the front. The two back corners swap, and so do the back and left edges.',
  },
  Jb: {
    title: 'Two corners and two edges swap (J, second)',
    body:
      'One side is finished; hold it on the left. The two right corners swap, and so do the front and right edges.',
  },
  T: {
    title: 'Two corners and two edges swap (T)',
    body:
      'Headlights on the left, with a block of two on the front and another on the back. The two right corners swap, and so do the left and right edges.',
  },
  Ra: {
    title: 'Two corners and two edges swap (R, first)',
    body:
      'Headlights on the left and a block of two on the front. The two right corners swap, and so do the back and left edges.',
  },
  Rb: {
    title: 'Two corners and two edges swap (R, second)',
    body:
      'Headlights on the left and a block of two on the back. The two right corners swap, and so do the front and left edges.',
  },
  F: {
    title: 'Two corners and two edges swap (F)',
    body:
      'One side is finished; hold it on the left. The two right corners swap, and so do the front and back edges.',
  },
  Ga: {
    title: 'Three corners and three edges go round (G, first)',
    body:
      'Every G case has headlights on one side and a single block of two. Hold the headlights on the left: here the block is on the front, at the right.',
  },
  Gb: {
    title: 'Three corners and three edges go round (G, second)',
    body:
      'Headlights on the left; the block of two is on the right side, at the back. It is the first G case played backwards.',
  },
  Gc: {
    title: 'Three corners and three edges go round (G, third)',
    body:
      'Headlights on the left; the block of two is on the back, at the right.',
  },
  Gd: {
    title: 'Three corners and three edges go round (G, fourth)',
    body:
      'Headlights on the left; the block of two is on the right side, at the front. It is the third G case played backwards.',
  },
  V: {
    title: 'Diagonal corners swap, with a block (V)',
    body: 'Two diagonally opposite corners swap, and so do two neighbouring edges. One corner sits in a finished block of two on both of its sides.',
  },
  Y: {
    title: 'Diagonal corners swap (Y)',
    body:
      'Two diagonally opposite corners swap, and so do two neighbouring edges. There are two blocks of two, on the front and on the right, and no headlights.',
  },
  Na: {
    title: 'Diagonal corners and opposite edges swap (N, first)',
    body: 'Every side shows a block of two and one odd corner. Two diagonally opposite corners swap, and two opposite edges.',
  },
  Nb: {
    title: 'Diagonal corners and opposite edges swap (N, second)',
    body: 'The mirror image of the first N case.',
  },
}
