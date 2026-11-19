/** The text of the keyhole method: its stages and their lessons. */
import { SEQUENCES as A } from '../../core/methods/beginner/sequences.ts'
import { KEYHOLE_INSERTS as K } from '../../core/methods/keyhole/sequences.ts'
import type { KeyholeStage } from '../../core/methods/keyhole/stages.ts'
import type { MethodText } from '../method-text.ts'
import { beginnerText } from './beginner.ts'

const stages: MethodText<KeyholeStage>['stages'] = {
  cross: beginnerText.stages.cross,
  'three-corners': {
    name: 'Three first-layer corners',
    summary:
      'Put in three of the four corners around the cross, as in the beginner method. The empty fourth place is the keyhole.',
  },
  'keyhole-edges': {
    name: 'Middle-layer edges through the keyhole',
    summary:
      'Turn the bottom layer to bring the keyhole under each middle-layer edge, and put the edge in with three moves.',
  },
  'last-corner': {
    name: 'Last first-layer corner',
    summary:
      'Fill the keyhole with the fourth corner without disturbing the edge above it. The first two layers are solved.',
  },
  'last-layer-cross': beginnerText.stages['last-layer-cross'],
  'last-layer-edges': beginnerText.stages['last-layer-edges'],
  'last-layer-corner-positions': beginnerText.stages['last-layer-corner-positions'],
  'last-layer-corner-twists': beginnerText.stages['last-layer-corner-twists'],
}

const lessons: MethodText<KeyholeStage>['lessons'] = {
  cross: {
    ...beginnerText.lessons.cross,
    tip: 'This stage is the same as in the beginner method. If you can already make the cross, go straight to the next stage.',
  },
  'three-corners': {
    goal: 'Three white corners join the cross. The fourth corner place is left as it is: that place is the keyhole.',
    steps: [
      'Find a corner with a white sticker in the top layer.',
      'Its two other colours say where it belongs. Turn the top layer until the corner is directly above that place, then turn the whole cube so the corner is at the front right.',
      'See which way its white sticker faces, and do the matching sequence below. These are the three sequences of the beginner method.',
      'Stop after three corners. Take the three that are easiest to reach; it does not matter which place stays empty.',
      `If a corner you need is stuck in the bottom layer, in the wrong place or twisted, hold it at the front right and do ${A.cornerFacingRight} once. That lifts it to the top layer.`,
    ],
    cases: {
      right: { title: 'White faces right', body: 'The shortest case: three moves.' },
      front: { title: 'White faces the front', body: 'The mirror image of the first case.' },
      up: {
        title: 'White faces up',
        body: `Do ${A.cornerFacingUp} first. The corner comes back with white facing right, so finish with ${A.cornerFacingRight}.`,
      },
      keyhole: {
        title: 'Three corners, seen from below',
        body: 'The cross and three corners are in place. The grey corner is the keyhole. It does not matter which piece sits there.',
      },
    },
    tip: 'If the fourth corner happens to be easy too, still leave it. The keyhole saves more moves in the next stage than the corner costs later.',
  },
  'keyhole-edges': {
    goal: 'The four edges of the middle layer are in place. The cross and the three corners are back where they were, and only the keyhole is still unsolved in the two bottom layers.',
    steps: [
      'Find an edge in the top layer that has no yellow sticker. Its two colours say where it belongs: between the two centres of those colours. Turn the whole cube so that place is at the front right or the front left.',
      'Turn the bottom layer until the keyhole is directly below that place. The cross no longer matches the side centres for now. That is expected.',
      'Turn the top layer until the top sticker of the edge is above the centre of the same colour. The edge is then at the front or at the side, next to its place.',
      'Do the matching three-move sequence below. Each one begins with the side face that the edge is not on.',
      'For the next edge, turn the bottom layer again to bring the keyhole below its place. There is no need to turn it back in between.',
      'When all four edges are in, turn the bottom layer until the cross matches the side centres again.',
    ],
    cases: {
      'right-from-front': {
        title: 'To the right, edge at the front',
        body: 'The edge is at the top front with green on top, above the green centre. Its orange side says it goes to the front right. The keyhole is below that place.',
      },
      'right-from-side': {
        title: 'To the right, edge at the side',
        body: 'The same edge the other way up: it is at the top right with orange on top, above the orange centre. Now the front face does the work.',
      },
      'left-from-front': {
        title: 'To the left, edge at the front',
        body: 'The mirror image of the first case. The edge is at the top front with green on top, and its red side says it goes to the front left. The keyhole is at the front left.',
      },
      'left-from-side': {
        title: 'To the left, edge at the side',
        body: 'The edge is at the top left with red on top, above the red centre. The mirror image of the second case.',
      },
      'bottom-turn': {
        title: 'Bringing the keyhole round',
        body: `The edge goes to the front right, but the keyhole is at the front left. Turn the bottom layer (D) to bring the keyhole under the place, do ${K.rightFromFront}, and turn the bottom layer back.`,
      },
      stuck: {
        title: 'An edge stuck in the middle layer',
        body: `The front-right edge is in its place but flipped. With the keyhole below it, ${K.rightFromFront} puts a top-layer edge in its place and lifts it out. Then line it up and insert it as usual.`,
      },
    },
    tip: 'In the beginner method each of these edges takes eight moves, because the corner below has to be taken out and put back. Here that corner is missing already, so three moves are enough.',
  },
  'last-corner': {
    goal: 'The fourth white corner fills the keyhole. The two bottom layers are solved.',
    steps: [
      'Check that the cross matches the side centres, then turn the whole cube so the keyhole is at the front right.',
      'Find the last white corner. If it is in the top layer, turn the top layer until it is directly above the keyhole.',
      'See which way its white sticker faces, and do the matching sequence below. Each one leaves the edge above the keyhole where it is.',
      'If the corner is already in the keyhole but twisted, use one of the two sequences for a twisted corner.',
      'If the corner happens to be solved already, there is nothing to do.',
    ],
    cases: {
      'facing-right': {
        title: 'White faces right',
        body: 'The corner is above the keyhole with white on the right face.',
      },
      'facing-front': {
        title: 'White faces the front',
        body: 'The corner is above the keyhole with white on the front face.',
      },
      'facing-up': {
        title: 'White faces up',
        body: 'The corner is above the keyhole with white on top. Only half turns of the right face are used.',
      },
      'twisted-facing-right': {
        title: 'In place, white faces right',
        body: 'The corner is in the keyhole with white on the right face. The top layer is not turned first.',
      },
      'twisted-facing-front': {
        title: 'In place, white faces the front',
        body: 'The corner is in the keyhole with white on the front face. This is the sequence before it, played backwards.',
      },
    },
    tip: `Do not use ${A.cornerFacingRight} here as in the beginner method: it would take the finished edge out with the corner. These sequences use only the right face and the top layer, so they are quick once learnt.`,
  },
  'last-layer-cross': beginnerText.lessons['last-layer-cross'],
  'last-layer-edges': beginnerText.lessons['last-layer-edges'],
  'last-layer-corner-positions': beginnerText.lessons['last-layer-corner-positions'],
  'last-layer-corner-twists': beginnerText.lessons['last-layer-corner-twists'],
}

export const keyholeText: MethodText<KeyholeStage> = {
  name: 'Keyhole method',
  level: 'Small step up',
  summary:
    'The beginner method with a shortcut: leave one first-layer corner out and slip the middle-layer edges in through the gap, three moves each. Speedsolvers call it keyhole F2L.',
  lead: 'The keyhole method is the beginner method with a faster way through the first two layers. Only three corners of the first layer are solved at first. The empty fourth place, the keyhole, is turned under each middle-layer edge in turn, and the edge drops in with three moves instead of eight. The last corner then goes in around its edge, and the last layer is solved exactly as before. It is a common first step for people who know the beginner method and want fewer moves before learning a speedsolving method.',
  solverHint:
    'About 110 moves, in eight stages. The first two layers take about 13 moves fewer than in the beginner method, and the last layer is solved the same way.',
  roadmap: {
    picture: 'Three corners in, the fourth place left empty',
    what: 'The beginner method with one shortcut. A first-layer corner is left out, and the middle-layer edges slip in through the gap, three moves each instead of eight.',
    pick: 'Pick it when the beginner method feels easy and you want fewer moves with almost nothing new to memorise.',
  },
  stages,
  lessons,
}
