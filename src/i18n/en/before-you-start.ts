/** The text of "Before you start": what every method needs, for someone who has never solved a cube. */
import type { LessonPart } from '../method-text.ts'

const parts: LessonPart[] = [
  {
    title: 'The cube is made of pieces',
    body: [
      'Do not think of the cube as 54 stickers. It is 26 pieces, and the stickers on one piece always stay together.',
      'A centre is the middle of a face and has one sticker. There are 6. Centres never change places: on most cubes yellow is always opposite white, red opposite orange and blue opposite green. So the centre tells you what colour its whole face will be when the cube is solved.',
      'An edge sits between two centres and has two stickers. There are 12. A corner has three stickers. There are 8. An edge can never go where a corner is, and a corner can never go where an edge is.',
    ],
    cases: ['pieces'],
  },
  {
    title: 'How to hold the cube',
    body: [
      'Find the yellow centre and put it on top. The white centre is then underneath. Turn the whole cube round, keeping yellow on top, until the green centre faces you.',
      'The lessons start with white because most people do. It is only a habit: every method works the same from any colour. White goes underneath so that you can watch the top of the cube while you work.',
      'Every picture in the lessons starts from this way of holding the cube. A picture shows three faces: the top, the front and the right. The other three are hidden.',
    ],
    cases: ['hold', 'hidden'],
  },
  {
    title: 'The six faces and their letters',
    body: [
      'Each face has a letter. The letter comes from where the face is as you hold the cube, not from its colour: U is up (the top), D is down (the bottom), R is right, L is left, F is front and B is back.',
      'Held the usual way, U is the yellow face, D the white, F the green, B the blue, R the orange and L the red. If you turn the whole cube round, the letters stay where they are: F is always the face towards you, whatever its colour.',
      'A face has nine pieces: its centre, four edges and four corners. When the face turns, all nine go round together.',
    ],
    cases: ['up-down', 'right-left', 'front-back'],
  },
  {
    title: 'Reading the moves',
    body: [
      'A move is one turn of one face. It is written with the letter of that face.',
      'A letter alone, such as R, is a quarter turn clockwise. With an apostrophe, as in R’, it is a quarter turn anticlockwise. With a 2, as in R2, it is a half turn, and then the direction makes no difference.',
      'Clockwise means clockwise as if you were looking straight at that face. This is where most beginners go wrong. For U, R and F it is easy. For L, D and B, imagine looking at the cube from the left, from below or from behind. So R and L are both clockwise, yet at the front of the cube R goes up and L goes down.',
      'Press “Watch in 3D” under a picture to see its moves played, and do them on your own cube at the same time.',
      'Some methods also use small letters such as r, the letters M, E and S, and x, y and z. These are wide turns, slice turns and whole-cube turns. They are explained in the lessons that use them.',
    ],
    cases: ['three-ways', 'right', 'left', 'down', 'back'],
  },
  {
    title: 'The three layers',
    body: [
      'Held the usual way, the cube has three layers, one above the other. The top layer is everything that turns with U. The bottom layer is everything that turns with D. The middle layer is what is left between them: four edges and the four centres around the cube.',
      'Many methods solve the cube one layer at a time. The layer solved first is called the first layer, and the one solved last is the last layer. In these lessons the first layer is the bottom one, with white, and the last layer is the top one, with yellow.',
      'A layer is solved only when its pieces also match the centres around the cube. One face of a single colour is not enough.',
    ],
    cases: ['first-layer', 'two-layers'],
  },
  {
    title: 'Practise following a sequence',
    body: [
      'A sequence is a fixed series of moves that does one job. It is written as a row of moves, read from left to right.',
      'Try this one: R U R’ U’. Say it as you do it: right face up, top to the left, right face down, top to the right.',
      'You can practise it on any cube, scrambled or not. Do the four moves six times and the cube is back exactly as it was. If it is not, a move went the wrong way. Most often it is U and U’ that were mixed up.',
    ],
    cases: ['practice'],
  },
]

const cases: Record<string, { title: string; body: string }> = {
  pieces: {
    title: 'A centre, an edge and a corner',
    body: 'The centres are coloured, as they always are in these pictures. One edge is shown, with its two stickers (yellow and green), and one corner, with its three (yellow, green and orange). Everything else is grey: in the lessons, grey stickers are the ones that do not matter yet.',
  },
  hold: {
    title: 'Yellow on top, green facing you',
    body: 'Only the centres are coloured. Yellow is on top, green is at the front and orange is on the right.',
  },
  hidden: {
    title: 'The three hidden faces',
    body: 'The same cube turned over and round to show the faces the other picture hides: white, which was underneath, red, which was on the left, and blue, which was at the back. Here white is on top, red at the front and blue on the right.',
  },
  'up-down': {
    title: 'U and D: the top and the bottom',
    body: 'The pieces of the top face and of the bottom face are coloured. The bottom face itself is underneath, but you can see the edge of it: the bottom row of the front and of the right. The grey stickers in between belong to neither face.',
  },
  'right-left': {
    title: 'R and L: the right and the left',
    body: 'The right face is the orange one. The left face is hidden, but you can see the edge of it: the left column of the top and of the front. The grey stripe down the middle belongs to neither face.',
  },
  'front-back': {
    title: 'F and B: the front and the back',
    body: 'The front face is the green one. The back face is hidden, but you can see the edge of it: the back row of the top and the back column of the right. The grey stripe in between belongs to neither face.',
  },
  'three-ways': {
    title: 'R, R’ and R2',
    body: 'The right face makes a quarter turn clockwise, then a quarter turn anticlockwise, which puts it back, then a half turn.',
  },
  right: {
    title: 'R: clockwise, seen from the right',
    body: 'The right face is in view, so you can see it go clockwise. The three green stickers on the right of the front face go up to the top.',
  },
  left: {
    title: 'L: clockwise, seen from the left',
    body: 'The left face is hidden, so watch the front. The three green stickers on the left of the front face go down, and three yellow ones come down from the top to replace them. That is the opposite of R, although both moves are clockwise.',
  },
  down: {
    title: 'D: clockwise, seen from below',
    body: 'The bottom row of the front face moves round to the right face. U does the opposite: it sends the top row of the front face round to the left.',
  },
  back: {
    title: 'B: clockwise, seen from behind',
    body: 'From the front this looks anticlockwise. The three orange stickers at the back of the right face go up to the back row of the top.',
  },
  'first-layer': {
    title: 'The first layer solved',
    body: 'The bottom layer is coloured. Its white face is underneath, out of sight. What you can see is the bottom row of the front and of the right, each matching the centre above it: green under green, orange under orange.',
  },
  'two-layers': {
    title: 'Two layers solved',
    body: 'The bottom and middle layers are coloured, and the top layer is grey. Only the last layer is left to solve.',
  },
  practice: {
    title: 'R U R’ U’, six times',
    body: 'The four moves are played six times on a solved cube. It gets more and more mixed up, and then comes back to solved on the last move.',
  },
}

export const beforeYouStartText = {
  name: 'Before you start',
  title: 'Before you start: the basics of the Rubik’s cube | Cubewise',
  description:
    'Never solved a cube? Learn what the pieces are, how to hold the cube, the letters of the six faces and how to read moves such as R, U’ and F2, with pictures you can play in 3D.',
  lead: 'This page is for you if you have never solved a cube. It covers what every method needs: the pieces, how to hold the cube, the names of the faces and how to read moves. Read it with your cube in your hands.',
  parts,
  cases,
  next: {
    heading: 'Where to go next',
    body: 'That is all you need to begin. The beginner method solves the cube layer by layer, one stage at a time, starting with the cross.',
    action: 'Start the beginner method',
    allMethods: 'See all the methods',
  },
  /** The card on the list of methods. */
  card: {
    heading: 'New to the cube? Start here',
    body: 'A short page on what every method needs: the pieces, how to hold the cube, the letters of the faces and how to read moves.',
    action: 'Before you start',
  },
  /** One line on other pages, for people who land there first: a question, then the link. */
  pointer: {
    question: 'New to the cube?',
    link: '“Before you start” explains the pieces, the faces and how to read moves.',
  },
}
