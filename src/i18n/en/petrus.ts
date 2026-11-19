/** The text of the Petrus method: its stages and their lessons. */
import { EDGE_FLIPS as E, SMALL_BLOCK_EXAMPLES as S } from '../../core/methods/petrus/sequences.ts'
import type { PetrusStage } from '../../core/methods/petrus/stages.ts'
import type { MethodText } from '../method-text.ts'
import { cornerOrientationCases, permutationCases } from './last-layer.ts'

type CaseText = { title: string; body: string }

const stages: MethodText<PetrusStage>['stages'] = {
  'small-block': {
    name: '2×2×2 block',
    summary:
      'Solve one corner together with its three edges. With the three centres around them they make a block of two by two by two.',
  },
  'big-block': {
    name: '2×2×3 block',
    summary:
      'Add a second corner and two more edges without breaking the small block. Everything is now solved except two faces.',
  },
  'edge-orientation': {
    name: 'Edge orientation',
    summary:
      'Turn the seven edges outside the block the good way round, two at a time. Speedsolvers call this EO.',
  },
  'first-two-layers': {
    name: 'First two layers',
    summary:
      'Finish the first two layers by turning only the two free faces. The last-layer edges end up facing the right way without any more work.',
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

/** One case per sequence of the edge lesson. Each body describes the cube as its picture shows it, before the sequence. */
const edgeCases: Record<keyof typeof E, CaseText> = {
  ulFr: {
    title: 'Top left and front right',
    body: `The edge at the top left has no yellow and shows orange on top. The edge at the front right has yellow, but shows orange on the front. F' lifts the front-right edge to the top front, which makes it good. U' moves it on and brings the top-left edge to the top front. F takes that one down to the front right, makes it good too and puts the block back. The whole sequence is ${E.ulFr}.`,
  },
  urUf: {
    title: 'Top right and top front',
    body: `The edge at the top right has yellow, but shows green on top. The edge at the top front has no yellow and shows orange on top. F takes the top-front edge down to the front right, R' moves it on and brings the top-right edge there, and F' lifts that one to the top front. The whole sequence is ${E.urUf}.`,
  },
  ufDr: {
    title: 'Top front and bottom right',
    body: `The edge at the top front shows orange on top, with yellow on the front. The edge at the bottom right shows green underneath, with yellow on the right. It is the sequence before with the right face turned the other way: ${E.ufDr}. R brings the bottom-right edge up to the front right.`,
  },
  ulBr: {
    title: 'Top left and back right',
    body: `The edge at the top left has no yellow and shows orange on top. The edge at the back right has yellow on the right, where it does not count. This is the first sequence done with the back face: B lifts the back-right edge to the top back, U brings the top-left edge there, and B' takes it down. The whole sequence is ${E.ulBr}.`,
  },
  ufBr: {
    title: 'Top front and back right',
    body: `The edge at the top front has no yellow and shows orange on top. The other bad edge is at the back right. The top-front edge is half a turn away from the top back, so the middle turn is U2: ${E.ufBr}.`,
  },
  urBr: {
    title: 'Top right and back right',
    body: `The bad edges are at the top right and the back right. The one at the top right has no yellow and shows orange on top. ${E.urBr} deals with both.`,
  },
  ufUlFrBr: {
    title: 'Four: top front, top left, front right, back right',
    body: `Two sequences run together. F' U' F would deal with the top left and the front right, and F R2 F' with the two left over. The F that ends the first and the F that starts the second join into F2: ${E.ufUlFrBr}.`,
  },
  ufUlDrFr: {
    title: 'Four: top front, top left, bottom right, front right',
    body: `F' U' F and F R F' run together, joined by F2 in the middle: ${E.ufUlDrFr}.`,
  },
  ufUlUbFr: {
    title: 'Four: top front, top left, top back, front right',
    body: `Three of the four top edges are bad; only the one at the top right, with yellow on top, is good. F' U2 F and F R' F' run together: ${E.ufUlUbFr}.`,
  },
  ufUbFrBr: {
    title: 'Four: top front, top back, front right, back right',
    body: `Two bad edges are opposite each other on top and two are opposite each other on the right face. F' U2 F and F R2 F' run together: ${E.ufUbFrBr}.`,
  },
  urUfUlFr: {
    title: 'Four: top right, top front, top left, front right',
    body: `Three of the four top edges are bad; only the one at the top back, with yellow on top, is good. This time the front face goes clockwise first: F R' F' and F' U' F run together as ${E.urUfUlFr}.`,
  },
  urUfUbFr: {
    title: 'Four: top right, top front, top back, front right',
    body: `Three of the four top edges are bad; only the one at the top left, with yellow on top, is good. F R' F' and F' U2 F run together: ${E.urUfUbFr}.`,
  },
  urUfUbDr: {
    title: 'Four: top right, top front, top back, bottom right',
    body: `The front and the back face are turned together, so both ends of the block come out at once. One turn of the right face then deals with all four edges, and both ends go back: ${E.urUfUbDr}.`,
  },
  urUfUlUbDrBr: {
    title: 'Six: all but the front right',
    body: `Every free edge is bad except the one at the front right, which shows green on the front and orange on the right. The first five moves are the sequence before and deal with four edges. They leave two, at the top left and the back right, and B U B' deals with those. The two B turns in the middle join into B2: ${E.urUfUlUbDrBr}.`,
  },
}

const lessons: MethodText<PetrusStage>['lessons'] = {
  'small-block': {
    goal: 'One corner is solved together with its three edges. In these lessons it is the white, red and blue corner, at the bottom, back, left of the cube. With the white, red and blue centres the four pieces make a block of two by two by two.',
    steps: [
      'Find the four pieces: the white-red-blue corner and the white-red, white-blue and blue-red edges. The centres never move, so they show where the block will be.',
      'Join the corner to one of its edges, so that two colours run across both pieces. The two now move as a pair.',
      'Put a second edge beside its centre, on the face that the pair can be turned onto. Bring the pair next to it. Corner, two edges and centre now make a flat square.',
      'Put the third edge between its two centres, in its own place.',
      'Turn the square onto the third edge. The block is built.',
      'There is no fixed order. Often a pair is joined already, or one turn does two of these jobs at once. Look at where all four pieces are before the first move.',
    ],
    cases: {
      'last-turn': {
        title: 'The last turn',
        body: `The picture shows the cube from behind, with the left face on the right of the picture. The white-blue edge is home, between the white and blue centres. The corner and its other two edges make a square with the red centre on the left face: all three show red there. ${S.lastTurn} turns the square round to meet the white-blue edge.`,
      },
      'pair-and-square': {
        title: 'A pair, then the square',
        body: "The cube is seen from behind again. The white-blue edge is home. The corner is at the bottom front left with the blue-red edge above it. They are joined: both show blue on the left and red on the front. The white-red edge waits at the back left, with red on the left face beside the red centre. F lifts the pair to the top and U carries it to the top left, where it shows red on the left. Pair, edge and centre now make a square, and L' turns it down.",
      },
      'from-scratch': {
        title: 'Nothing in place',
        body: "The picture shows the cube from the left. None of the four pieces is home. The corner and the white-red edge are joined on top at the front left: both show red on top and white on the front. R' takes the white-blue edge down to the bottom layer and D slides it home. The same D brings the blue-red edge to the bottom left, with red on the left face. F' turns the pair down beside it, which makes the square, and L turns the square home.",
      },
      done: {
        title: 'The small block',
        body: 'Seen from behind: the corner, its three edges and the three centres around them. The rest of the cube is still mixed. Three faces can now be turned without touching the block: the right, the top and the front.',
      },
    },
    tip: 'Any of the eight corners will do, and some are much easier than others. Lars Petrus advises beginners to start with the same corner every time and, once that is easy, to look at all eight and take the quickest. The solver looks at all eight, and at how the block can grow, and usually needs six or seven moves here.',
  },
  'big-block': {
    goal: 'The block is two by two by three. It lies along the bottom left of the cube, from front to back, and holds every piece that is on neither the right nor the top face. In these lessons the white, red and green corner and the white-green and green-red edges are added.',
    steps: [
      'Hold the small block at the bottom, back, left. Turn only the right, top and front faces: they do not touch it.',
      'The block can grow in three directions. Here it grows towards the front, so find the white-red-green corner and the white-green and green-red edges.',
      'Work as in the first stage. Join the corner to one edge to make a pair. Put the other edge beside the green centre, on the front face. Bring the pair to it to make a square with the centre.',
      'Turn the front face to put the square down in its place.',
      'A piece that sits in its own place the wrong way round has to come out first. Take it out joined to another piece if you can, as in the third case below.',
    ],
    cases: {
      'pair-then-square': {
        title: 'A pair, then the square',
        body: 'The corner is at the top back right and the white-green edge beside it at the top right. They are joined: both show white on top and green on the right. The green-red edge is at the top front, with green on the front. F turns it down to the front right, still beside the green centre. U brings the pair to the front, so that the corner sits between its two edges and the square is made. F2 turns the square down into place.',
      },
      'pair-from-the-back': {
        title: 'A pair from the back',
        body: "The corner is at the bottom back right with the green-red edge above it. They are joined: both show red on the right and green on the back. The white-green edge is at the top left, with white on top. U' brings it to the top front, beside the green centre. R2 swings the pair over to the front right, next to it, and the square is made. F2 turns it down.",
      },
      'twisted-corner': {
        title: 'A corner in place but twisted',
        body: "The corner is in its own place the wrong way round: it shows red on the front and green underneath. The green-red edge next to it, at the bottom front, shows the same two colours, so the two are joined. The white-green edge is at the top front. F' takes the pair out to the right and brings the white-green edge to the front left, with green on the front. R lifts the pair to the top and U carries it to the front, above that edge. The square is made, and F' turns it home.",
      },
      done: {
        title: 'The big block',
        body: 'The picture shows the cube from the left. The block runs along the bottom of the left face from back to front: two corners, five edges and the centres they touch. Only the right and the top face are free now.',
      },
    },
    tip: 'Do not break the small block: keep one hand on it. Of the three directions, take the one whose pieces are easiest. The solver chooses the corner and the direction together, so it usually needs only three or four moves here, and it may ask you to hold the cube in any of 24 ways at the start. Lars Petrus also shows quicker ways that break the small block for a moment; the solver does not use them.',
  },
  'edge-orientation': {
    goal: 'The big block is still built, and each of the seven edges outside it is "good": it can go home the right way round with turns of the right and the top face alone.',
    steps: [
      'Hold the block along the bottom left, so that the free faces are the top (yellow) and the right (orange). Seven edges are not in the block: four in the top layer and three more round the right face.',
      'Check each of the seven by one sticker. For an edge in the top layer, take the sticker that faces up. For the other three, at the front right, bottom right and back right, take the sticker that does not face right.',
      'An edge with yellow on it is good if that sticker is yellow, and bad if not. An edge with no yellow has orange on it: it is bad if that sticker is orange, and good if not.',
      'Turns of the right and the top face never change a good edge into a bad one or back. A quarter turn of the front or the back face does, for the four edges it carries, but it breaks the block. The number of bad edges is always even: none, two, four or six.',
      'So fix two at a time. Take part of the block out with the front or the back face, which also moves one bad edge to the other free face. Turn that free face to put the second bad edge in its place. Put the block back. Both edges are now good.',
      'Turn the right and the top face first, to bring bad edges to the places a sequence is for. With four or six bad edges, use a sequence that runs two of these together, or fix two and look again.',
    ],
    cases: edgeCases,
    tip: 'You do not need to learn the fourteen sequences by heart. Lars Petrus says this is the simplest stage once you see what the three moves do: one bad edge is turned over as it moves to the other free face, a second takes its place, and that one is turned over on the way back. Each of the longer sequences is two of the short ones run together. The ZZ method uses the same idea for all twelve edges at the very start.',
  },
  'first-two-layers': {
    goal: 'The first two layers are solved, and every last-layer edge shows the last-layer colour on top. Only the last layer is left.',
    steps: [
      'Turn only the right and the top face from here on. They cannot break the block and cannot make a good edge bad.',
      'Five pieces are added. In these lessons they are the white-orange edge, the two white corners on the right and the two middle-layer edges on the right, which leaves the yellow layer for last.',
      'First make a square on the right face: the white-orange edge, one corner and its middle-layer edge, around the orange centre. Build it as before, a pair and then the square, and turn it down so that the white-orange edge is home.',
      'Then join the last corner and edge in the top layer and put the pair in. With the square in the way, the right face can only go a quarter turn out and back: R\' U R or the like for a slot at the back, R U R\' for one at the front.',
      'If the last two pieces sit together but do not match, part them first, as in the third case below.',
      'The other choice is to add the five pieces on the left of the top layer instead and leave the right layer for last. Take whichever is easier. The cube is then turned so that the layer left over is on top.',
    ],
    cases: {
      square: {
        title: 'The square',
        body: "The white-green-orange corner and the green-orange edge are joined on top at the front left: both show green on top and orange on the front. The white-orange edge is at the back right, with orange on the right. R2 brings the white-orange edge round to the front right. U' carries the pair to the right, above it, and the three make a square around the orange centre. R' turns the square down.",
      },
      'back-pair': {
        title: 'The last pair, joined',
        body: "The square is built at the front. The last corner and edge are joined on top at the back right: both show blue on top and orange on the right. U' moves the pair out of the way. R' brings the empty slot up to the top layer, U slides the pair into it and R takes everything back down.",
      },
      misaligned: {
        title: 'The last pair, side by side but not matching',
        body: "The corner and the edge are next to each other on top at the back right, but they do not match: the corner shows white on top and the edge shows blue. R' U2 R parts them and turns the corner over, so that it shows orange on top. U R' then joins them on top at the front, both showing blue on top, and U' R puts the pair in as in the case before.",
      },
      'right-last': {
        title: 'The other choice: the right layer last',
        body: "Here the five pieces go on the left of the top layer: two yellow corners and three yellow edges. Three of them are on top already, one turn away from home. The yellow-red-blue corner and the yellow-blue edge are joined at the front right, both showing yellow on the front and blue on the right. R lifts the pair to the top and U' turns all five home. Only the orange layer is left, and z' turns the whole cube to put it on top.",
      },
      done: {
        title: 'Two layers done',
        body: 'The first two layers are solved, and the yellow edges make a cross on top without any more work.',
      },
    },
    tip: 'This stage is the hardest to do well, because two faces give so little room. It is also fast to turn, since the hands never change grip. The solver reads the whole stage from a table and picks the earlier stages so that this one is short: about seven moves. Expect to need about twice as many yourself. If bad edges turn up here, the block was broken or held another way round after the third stage.',
  },
  'orient-last-layer-corners': {
    goal: 'Every piece of the last layer shows the last-layer colour on top. The pieces are not yet in their own places, so the sides of the top layer are still mixed.',
    steps: [
      'Look at the top. The last-layer edges make a cross already. This is what the third stage was for: good edges stay good, so the cross comes for free.',
      'Count the corners that show the top colour on top: none, one or two. It is never exactly three. If all four do, this stage is done.',
      'See where the other corners show the top colour on the sides, and find the case below.',
      'Turn the top layer until the cube matches the picture of the case, and do its sequence. One sequence always finishes the stage.',
    ],
    cases: cornerOrientationCases,
    tip: 'About one time in 27 the corners face up already and this stage is skipped. Lars Petrus teaches the last layer in three steps instead: put the corners in their places, turn them to face up, then put the edges in their places. That needs only a handful of sequences, and the first sequence below, which he named Sune, is the main one. This site uses the two stages that most solvers finish with today.',
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
    tip: 'About one time in 72 the last layer needs only a turn of the top, or nothing at all. These are the same 21 sequences as in CFOP and ZZ, so they carry over if you learn those methods too.',
  },
}

export const petrusText: MethodText<PetrusStage> = {
  name: 'Petrus',
  level: 'Block building',
  summary:
    'Build a small block in one corner, grow it until only two faces are free, turn the remaining edges the right way round, and finish with those two faces. Few moves, and little to learn by heart.',
  lead: 'The Petrus method is named after Lars Petrus, who worked it out in 1981 and came fourth at the 1982 world championship. His starting point was that a finished first layer gets in the way: every later move breaks it, and it has to be mended again and again. So this method never builds a layer. It builds a block of two by two by two in one corner, which leaves three faces free to turn, and grows it to two by two by three, which leaves two. The edges outside the block are then turned the "good" way round, after which the first two layers can be finished with the two free faces alone and the last layer starts with its cross made. Compared with the beginner method there are far fewer moves, and most of the solve is done by looking and thinking, not from sequences. Petrus himself gives 55 to 60 moves for a fast solve and 40 to 45 when the aim is few moves.',
  solverHint:
    'About 39 moves, in six stages. The first four are found by search and take about 20 moves together, fewer than a person would usually manage. The solver starts from whichever corner and direction give the shortest solution, so check how the first instruction asks you to hold the cube. It may also turn the cube once before the last layer.',
  roadmap: {
    picture: 'A block of 2×2×2 in one corner',
    what: 'It never builds a layer, because a finished layer gets in the way. A small block in one corner grows until only two faces are free, and the first two layers are finished with those two alone.',
    pick: 'Pick it if you would rather look and think than recite sequences: most of the solve is worked out, not memorised.',
  },
  stages,
  lessons,
}
