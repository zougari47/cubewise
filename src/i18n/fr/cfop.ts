/** The text of CFOP: its stages and their lessons. */
import { SEQUENCES as BEGINNER } from '../../core/methods/beginner/sequences.ts'
import { PAIR_EXAMPLES as P } from '../../core/methods/cfop/sequences.ts'
import type { OrientationName } from '../../core/methods/cfop/sequences.ts'
import type { CfopStage } from '../../core/methods/cfop/stages.ts'
import type { MethodText } from '../method-text.ts'
import { cornerOrientationCases, permutationCases } from './last-layer.ts'

type CaseText = { title: string; body: string }

const stages: MethodText<CfopStage>['stages'] = {
  cross: {
    name: 'Croix',
    summary:
      'Faites la croix directement en bas, en huit mouvements ou moins, planifiée avant le premier mouvement.',
  },
  'first-two-layers': {
    name: 'Deux premières couches',
    summary:
      'Réunissez chaque coin de la première couche à l’arête de la couche du milieu située au-dessus de lui et insérez les deux ensemble, quatre fois. Les speedcubeurs appellent cela F2L.',
  },
  'orient-last-layer': {
    name: 'Orientation de la dernière couche',
    summary:
      'Tournez chaque pièce de la dernière couche vers le haut avec une séquence parmi 57. Les speedcubeurs appellent cela OLL.',
  },
  'permute-last-layer': {
    name: 'Permutation de la dernière couche',
    summary:
      'Amenez les pièces de la dernière couche à leur place avec une séquence parmi 21, appelée PLL. Le cube est résolu.',
  },
}

/**
 * The cases of the last-layer orientation, in the order of the lesson: the
 * edges show a cross, a line, an L, or only the dot. Each body describes the
 * cube as its picture shows it, before the sequence.
 */
const orientationCases: Record<OrientationName, CaseText> = {
  ...cornerOrientationCases,
  oll33: {
    title: 'Forme en T (OLL 33)',
    body: 'La ligne va de gauche à droite. Deux coins regardent vers le haut, à l’arrière droit et à l’avant droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant et deux fois à l’arrière.',
  },
  oll45: {
    title: 'Forme en T (OLL 45)',
    body: 'La ligne va de gauche à droite. Deux coins regardent vers le haut, à l’arrière droit et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à l’arrière et deux fois à gauche.',
  },
  oll34: {
    title: 'Forme en C (OLL 34)',
    body: 'La ligne va de gauche à droite. Deux coins regardent vers le haut, à l’avant gauche et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll46: {
    title: 'Forme en C (OLL 46)',
    body: 'La ligne va d’avant en arrière. Deux coins regardent vers le haut, à l’arrière gauche et à l’avant gauche. Sur les côtés, la couleur du haut apparaît trois fois à droite et une fois à gauche.',
  },
  oll51: {
    title: 'Forme en I (OLL 51)',
    body: 'La ligne va de gauche à droite. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, deux fois à l’arrière et deux fois à gauche.',
  },
  oll52: {
    title: 'Forme en I (OLL 52)',
    body: 'La ligne va d’avant en arrière. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît une fois à l’avant, trois fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll55: {
    title: 'Forme en I (OLL 55)',
    body: 'La ligne va de gauche à droite. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît trois fois à l’avant et trois fois à l’arrière.',
  },
  oll56: {
    title: 'Forme en I (OLL 56)',
    body: 'La ligne va de gauche à droite. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à droite, une fois à l’arrière et deux fois à gauche.',
  },
  oll13: {
    title: 'Cavalier (OLL 13)',
    body: 'La ligne va de gauche à droite. Un coin regarde vers le haut, à l’avant gauche. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à droite et deux fois à l’arrière.',
  },
  oll14: {
    title: 'Cavalier (OLL 14)',
    body: 'La ligne va de gauche à droite. Un coin regarde vers le haut, à l’avant droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, deux fois à l’arrière et une fois à gauche.',
  },
  oll15: {
    title: 'Cavalier (OLL 15)',
    body: 'La ligne va de gauche à droite. Un coin regarde vers le haut, à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite, deux fois à l’arrière et une fois à gauche.',
  },
  oll16: {
    title: 'Cavalier (OLL 16)',
    body: 'La ligne va de gauche à droite. Un coin regarde vers le haut, à l’arrière droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll39: {
    title: 'Grand éclair (OLL 39)',
    body: 'La ligne va de gauche à droite. Deux coins regardent vers le haut, à l’arrière droit et à l’avant gauche. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite et deux fois à l’arrière.',
  },
  oll40: {
    title: 'Grand éclair (OLL 40)',
    body: 'La ligne va de gauche à droite. Deux coins regardent vers le haut, à l’arrière gauche et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à l’arrière et une fois à gauche.',
  },
  oll57: {
    title: 'Ligne, coins terminés (OLL 57)',
    body: 'La ligne va de gauche à droite. Les quatre coins regardent vers le haut. Sur les côtés, la couleur du haut apparaît une fois à l’avant et une fois à l’arrière.',
  },
  oll5: {
    title: 'Carré (OLL 5)',
    body: 'Les arêtes à l’avant et à droite regardent vers le haut. Un coin regarde vers le haut, à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à droite, deux fois à l’arrière et deux fois à gauche.',
  },
  oll6: {
    title: 'Carré (OLL 6)',
    body: 'Les arêtes à l’arrière et à droite regardent vers le haut. Un coin regarde vers le haut, à l’arrière droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à droite et deux fois à gauche.',
  },
  oll7: {
    title: 'Petit éclair (OLL 7)',
    body: 'Les arêtes à l’arrière et à gauche regardent vers le haut. Un coin regarde vers le haut, à l’avant gauche. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, deux fois à droite et une fois à l’arrière.',
  },
  oll8: {
    title: 'Petit éclair (OLL 8)',
    body: 'Les arêtes à l’avant et à gauche regardent vers le haut. Un coin regarde vers le haut, à l’arrière gauche. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à droite et deux fois à l’arrière.',
  },
  oll11: {
    title: 'Petit éclair (OLL 11)',
    body: 'Les arêtes à l’avant et à droite regardent vers le haut. Un coin regarde vers le haut, à l’avant gauche. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite, deux fois à l’arrière et une fois à gauche.',
  },
  oll12: {
    title: 'Petit éclair (OLL 12)',
    body: 'Les arêtes à l’arrière et à droite regardent vers le haut. Un coin regarde vers le haut, à l’arrière gauche. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll9: {
    title: 'Poisson (OLL 9)',
    body: 'Les arêtes à l’arrière et à gauche regardent vers le haut. Un coin regarde vers le haut, à l’avant droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll10: {
    title: 'Poisson (OLL 10)',
    body: 'Les arêtes à l’avant et à gauche regardent vers le haut. Un coin regarde vers le haut, à l’arrière droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite, deux fois à l’arrière et une fois à gauche.',
  },
  oll35: {
    title: 'Poisson (OLL 35)',
    body: 'Les arêtes à l’avant et à droite regardent vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll37: {
    title: 'Poisson (OLL 37)',
    body: 'Les arêtes à l’arrière et à gauche regardent vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’avant droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant et deux fois à droite.',
  },
  oll31: {
    title: 'Forme en P (OLL 31)',
    body: 'Les arêtes à l’arrière et à droite regardent vers le haut. Deux coins regardent vers le haut, à l’arrière droit et à l’avant droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à l’arrière et une fois à gauche.',
  },
  oll32: {
    title: 'Forme en P (OLL 32)',
    body: 'Les arêtes à l’avant et à droite regardent vers le haut. Deux coins regardent vers le haut, à l’arrière droit et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à l’arrière et une fois à gauche.',
  },
  oll43: {
    title: 'Forme en P (OLL 43)',
    body: 'Les arêtes à l’avant et à gauche regardent vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’avant gauche. Sur les côtés, la couleur du haut apparaît trois fois à droite et une fois à l’arrière.',
  },
  oll44: {
    title: 'Forme en P (OLL 44)',
    body: 'Les arêtes à l’avant et à droite regardent vers le haut. Deux coins regardent vers le haut, à l’arrière droit et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’arrière et trois fois à gauche.',
  },
  oll36: {
    title: 'Forme en W (OLL 36)',
    body: 'Les arêtes à l’arrière et à droite regardent vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à l’arrière et deux fois à gauche.',
  },
  oll38: {
    title: 'Forme en W (OLL 38)',
    body: 'Les arêtes à l’arrière et à gauche regardent vers le haut. Deux coins regardent vers le haut, à l’arrière droit et à l’avant gauche. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à droite et une fois à l’arrière.',
  },
  oll29: {
    title: 'Forme biscornue (OLL 29)',
    body: 'Les arêtes à l’avant et à gauche regardent vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’arrière droit. Sur les côtés, la couleur du haut apparaît deux fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll30: {
    title: 'Forme biscornue (OLL 30)',
    body: 'Les arêtes à l’arrière et à gauche regardent vers le haut. Deux coins regardent vers le haut, à l’avant gauche et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à droite et une fois à gauche.',
  },
  oll41: {
    title: 'Forme biscornue (OLL 41)',
    body: 'Les arêtes à l’arrière et à gauche regardent vers le haut. Deux coins regardent vers le haut, à l’avant gauche et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite et deux fois à l’arrière.',
  },
  oll42: {
    title: 'Forme biscornue (OLL 42)',
    body: 'Les arêtes à l’avant et à gauche regardent vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’arrière droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à droite et une fois à l’arrière.',
  },
  oll47: {
    title: 'Petit L (OLL 47)',
    body: 'Les arêtes à l’arrière et à droite regardent vers le haut. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, deux fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll48: {
    title: 'Petit L (OLL 48)',
    body: 'Les arêtes à l’arrière et à gauche regardent vers le haut. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à droite, une fois à l’arrière et deux fois à gauche.',
  },
  oll49: {
    title: 'Petit L (OLL 49)',
    body: 'Les arêtes à l’arrière et à droite regardent vers le haut. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à l’arrière et trois fois à gauche.',
  },
  oll50: {
    title: 'Petit L (OLL 50)',
    body: 'Les arêtes à l’avant et à droite regardent vers le haut. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à l’arrière et trois fois à gauche.',
  },
  oll53: {
    title: 'Petit L (OLL 53)',
    body: 'Les arêtes à l’avant et à droite regardent vers le haut. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît deux fois à droite, une fois à l’arrière et trois fois à gauche.',
  },
  oll54: {
    title: 'Petit L (OLL 54)',
    body: 'Les arêtes à l’arrière et à droite regardent vers le haut. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à droite et trois fois à gauche.',
  },
  oll28: {
    title: 'L, coins terminés (OLL 28)',
    body: 'Les arêtes à l’arrière et à gauche regardent vers le haut. Les quatre coins regardent vers le haut. Sur les côtés, la couleur du haut apparaît une fois à l’avant et une fois à droite.',
  },
  oll1: {
    title: 'Point (OLL 1)',
    body: 'Aucune arête ne regarde vers le haut. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît une fois à l’avant, trois fois à droite, une fois à l’arrière et trois fois à gauche.',
  },
  oll2: {
    title: 'Point (OLL 2)',
    body: 'Aucune arête ne regarde vers le haut. Aucun coin ne regarde vers le haut. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, une fois à droite, deux fois à l’arrière et trois fois à gauche.',
  },
  oll3: {
    title: 'Point (OLL 3)',
    body: 'Aucune arête ne regarde vers le haut. Un coin regarde vers le haut, à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à droite, deux fois à l’arrière et deux fois à gauche.',
  },
  oll4: {
    title: 'Point (OLL 4)',
    body: 'Aucune arête ne regarde vers le haut. Un coin regarde vers le haut, à l’arrière droit. Sur les côtés, la couleur du haut apparaît deux fois à l’avant, deux fois à droite, une fois à l’arrière et deux fois à gauche.',
  },
  oll17: {
    title: 'Point (OLL 17)',
    body: 'Aucune arête ne regarde vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’avant droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite, deux fois à l’arrière et deux fois à gauche.',
  },
  oll18: {
    title: 'Point (OLL 18)',
    body: 'Aucune arête ne regarde vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’arrière droit. Sur les côtés, la couleur du haut apparaît trois fois à l’avant, une fois à droite, une fois à l’arrière et une fois à gauche.',
  },
  oll19: {
    title: 'Point (OLL 19)',
    body: 'Aucune arête ne regarde vers le haut. Deux coins regardent vers le haut, à l’arrière gauche et à l’arrière droit. Sur les côtés, la couleur du haut apparaît une fois à l’avant, deux fois à droite, une fois à l’arrière et deux fois à gauche.',
  },
  oll20: {
    title: 'Point (OLL 20)',
    body: 'Aucune arête ne regarde vers le haut. Les quatre coins regardent vers le haut. Sur les côtés, la couleur du haut apparaît une fois à l’avant, une fois à droite, une fois à l’arrière et une fois à gauche.',
  },
}

const lessons: MethodText<CfopStage>['lessons'] = {
  cross: {
    goal: 'Quatre arêtes blanches forment un signe plus sur le bas, chacune assortie au centre voisin. C’est la croix de la méthode débutant, mais faite directement en bas, sans la marguerite, et planifiée avant le premier mouvement.',
    steps: [
      'Tenez le cube avec le blanc en bas. Vous ne verrez pas la croix pendant que vous la faites : suivez donc les arêtes blanches grâce à leur couleur de côté.',
      'Avant de tourner quoi que ce soit, repérez les quatre arêtes blanches et décidez dans quel ordre les placer. Commencez par celles qui demandent un ou deux mouvements.',
      'Placez chaque arête à côté de celles déjà en bas, dans le bon ordre. Vues de dessus et dans le sens horaire, les couleurs de côté sont vert, rouge, bleu, orange.',
      'Pendant que vous la construisez, la croix peut être décalée d’une rotation par rapport aux centres des côtés. Tournez la couche du bas pour l’aligner, à la fin ou dès que cela vous aide.',
      'Vérifiez qu’un mouvement fait pour une arête n’en chasse pas une autre déjà placée. Si c’est le cas, tournez d’abord la couche du bas pour mettre cette arête à l’abri, puis ramenez-la ensuite.',
    ],
    cases: {
      'from-top': {
        title: 'Tout droit depuis le haut',
        body: 'L’arête blanche et verte est dans la couche du haut, au-dessus de sa place, le blanc vers le haut. Un demi-tour de la face avant l’amène à sa place.',
      },
      'from-middle': {
        title: 'À un mouvement, depuis la couche du milieu',
        body: 'L’arête blanche et orange est à l’avant droit, le blanc vers l’avant. Une rotation de la face de droite la fait descendre. Une arête de la couche du milieu est toujours à un mouvement du bas.',
      },
      'facing-front': {
        title: 'Dans la couche du haut, le blanc vers le côté',
        body: "L’arête blanche et verte est en haut à l’avant, le blanc face à vous. U' l’amène au-dessus de la face de droite et R' la descend dans la couche du milieu. F la met à sa place, et R remet l’arête que R' avait déplacée.",
      },
      flipped: {
        title: 'À sa place mais retournée',
        body: "L’arête blanche et verte est à sa place, le blanc vers l’avant. F' la monte dans la couche du milieu. D amène sa place sous la face de droite, R' y dépose l’arête, et D' remet le bas comme avant.",
      },
      'bottom-turn': {
        title: 'Une croix décalée d’une rotation',
        body: 'Les quatre arêtes sont en bas dans le bon ordre, mais chacune est à une place de son centre. Une rotation de la couche du bas les aligne toutes.',
      },
      done: {
        title: 'La croix terminée, vue de dessous',
        body: 'Chaque arête blanche est assortie au centre voisin.',
      },
    },
    tip: 'Aucune croix ne demande plus de huit mouvements, et la plupart en demandent six ou moins. Les speedcubeurs planifient toute la croix avant de commencer, puis la font sans regarder le bas.',
  },
  'first-two-layers': {
    goal: 'Les quatre coins blancs et les quatre arêtes de la couche du milieu sont en place : les deux couches du bas sont résolues. Chaque coin entre avec l’arête qui va au-dessus de lui, en paire.',
    steps: [
      'Un emplacement, c’est une place de coin de la couche du bas avec la place d’arête juste au-dessus. Il y en a quatre. Chacun reçoit une paire : un coin blanc et l’arête qui a les deux mêmes couleurs de côté.',
      'Repérez un coin et son arête dans la couche du haut. Tournez le cube entier pour que leur emplacement soit à l’avant droit. Avec de l’entraînement, vous pourrez laisser l’emplacement à l’avant gauche ou à l’arrière et travailler depuis là.',
      'Tournez la couche du haut et une face de côté pour réunir les deux pièces, ou pour les préparer de façon qu’un seul mouvement les réunisse. Ramenez cette face de côté avant d’en tourner une autre, pour que la croix reste entière.',
      'Insérez la paire avec l’une des quatre insertions courtes ci-dessous.',
      `Si une pièce dont vous avez besoin est coincée dans un emplacement, sortez-la d’abord : tournez la face de côté de cet emplacement, tournez la couche du haut, puis ramenez la face de côté. Pour l’emplacement avant droit, cela donne ${P.splitInsert}.`,
      'Prenez chaque fois la paire la plus facile. Un emplacement vide est utile : vous pouvez tourner librement sa face de côté sans rien casser.',
    ],
    cases: {
      'joined-insert': {
        title: 'Une paire réunie',
        body: "Le coin est au-dessus de son emplacement, le blanc vers l’avant. Son arête est à côté de lui, en haut à droite : les deux montrent du vert sur le dessus et de l’orange à droite. U écarte la paire, R monte l’emplacement dans la couche du haut, U' ramène la paire au-dessus et R' la descend.",
      },
      'split-insert': {
        title: 'Une paire séparée',
        body: "Le coin est au-dessus de son emplacement, le blanc vers la droite et l’orange sur le dessus. L’arête est en haut à l’arrière, le vert sur le dessus. R emmène le coin à l’arrière, où il rejoint l’arête. U ramène la paire vers l’avant et R' la descend.",
      },
      'joined-insert-front': {
        title: 'Une paire réunie, en miroir',
        body: "Le coin a le blanc vers la droite, et son arête est à côté de lui, en haut à l’avant : les deux montrent de l’orange sur le dessus et du vert à l’avant. La même idée avec la face avant : U' écarte la paire, F' monte l’emplacement, U ramène la paire et F la descend.",
      },
      'split-insert-front': {
        title: 'Une paire séparée, en miroir',
        body: "Le coin a le blanc vers l’avant et le vert sur le dessus. L’arête est en haut à gauche, l’orange sur le dessus. F' emmène le coin à gauche, où il rejoint l’arête. U' ramène la paire et F la descend.",
      },
      'join-then-insert': {
        title: 'La même couleur sur le dessus',
        body: "Le coin a le blanc vers l’avant et le vert sur le dessus. L’arête est en haut à l’arrière, elle aussi avec le vert sur le dessus. Les quatre premiers mouvements, U' R U R', réunissent la paire dans la couche du haut. Ensuite, U2 R U' R' l’insère, comme dans le premier cas mais un quart de tour plus loin.",
      },
      'corner-facing-up': {
        title: 'Le blanc vers le haut',
        body: "Le coin est au-dessus de son emplacement, le blanc sur le dessus, et l’arête est en haut à l’arrière, le vert sur le dessus. Les quatre premiers mouvements, U R U2 R', tournent le coin et le réunissent à l’arête. Les quatre derniers sont le premier cas.",
      },
      'corner-twisted-in-slot': {
        title: 'Coin dans l’emplacement, pivoté',
        body: "Le coin est déjà dans son emplacement, mais le blanc est vers l’avant. L’arête est en haut à droite, le vert sur le dessus. R U' R' sort le coin et le réunit à l’arête. Les quatre derniers mouvements sont le premier cas.",
      },
    },
    tip: 'Toute paire peut se résoudre avec seulement des rotations de la couche du haut et des insertions de trois mouvements. Le solveur part de là et cherche plus court : ses mouvements peuvent donc différer des vôtres. Tournez le cube entier le moins souvent possible : chaque rotation coûte du temps.',
  },
  'orient-last-layer': {
    goal: 'Chaque pièce de la dernière couche montre du jaune sur le dessus. Les pièces ne sont pas encore à leur place : les côtés de la couche du haut sont donc encore mélangés.',
    steps: [
      'Regardez les autocollants jaunes du dessus. Voyez d’abord la forme que les arêtes dessinent avec le centre : une croix, une ligne, un L, ou seulement le point du milieu. Les cas ci-dessous suivent cet ordre.',
      'Voyez ensuite quels coins regardent vers le haut, et où les autocollants jaunes des autres pièces apparaissent sur les côtés. Ensemble, ces indices distinguent les 57 cas.',
      'Tournez la couche du haut jusqu’à ce que le cube corresponde à l’image du cas.',
      'Faites la séquence de ce cas. Une seule séquence termine toujours l’étape.',
      `Vous n’avez pas besoin des 57 d’un coup. Commencez par les sept cas qui ont une croix, et faites d’abord la croix avec ${BEGINNER.lastLayerCross}, comme dans la méthode débutant. Cela demande deux coups d’œil au lieu d’un. Ajoutez ensuite les autres cas, un groupe à la fois.`,
    ],
    cases: orientationCases,
    tip: "Environ une fois sur 216, la dernière couche regarde déjà vers le haut et cette étape est sautée. Beaucoup de séquences sont faites des mêmes petits morceaux, comme R U R' U' et R' F R F', ce qui les rend plus faciles à retenir qu’il n’y paraît.",
  },
  'permute-last-layer': {
    goal: 'Chaque pièce de la dernière couche est à sa place. Le cube est résolu.',
    steps: [
      'Regardez les côtés de la couche du haut, pas le dessus. Cherchez des phares (deux coins qui montrent la même couleur sur un côté), des blocs (un coin et l’arête voisine qui montrent la même couleur) et des côtés terminés.',
      'Trouvez ci-dessous le cas qui a le même motif. Il y en a 21.',
      'Tournez la couche du haut jusqu’à ce que le motif soit placé comme le cas le décrit, puis faites sa séquence.',
      'Tournez encore une fois la couche du haut si elle n’est pas encore alignée avec les côtés.',
      'Vous pouvez commencer avec moins de séquences : T ou Y pour bien placer les coins, puis l’un des quatre cas qui ne déplacent que des arêtes (U, H et Z). Cela demande deux coups d’œil au lieu d’un.',
    ],
    cases: permutationCases,
    tip: 'Environ une fois sur 72, la dernière couche ne demande qu’une rotation du haut, ou rien du tout. Apprenez à reconnaître le cas à partir de l’avant et du côté droit seulement, pour ne pas avoir à tourner le cube pour regarder.',
  },
}

export const cfopText: MethodText<CfopStage> = {
  name: 'CFOP',
  level: 'Speedcubing',
  summary:
    'La méthode de la plupart des speedcubeurs : la croix, les deux premières couches par paires, puis la dernière couche en deux séquences. Moins de la moitié des mouvements de la méthode débutant, mais beaucoup de séquences à apprendre.',
  lead: 'CFOP tire son nom de ses quatre étapes, en anglais : Cross (croix), First two layers (deux premières couches), Orientation et Permutation de la dernière couche. On l’appelle aussi méthode Fridrich, du nom de Jessica Fridrich, qui l’a fait largement connaître. Presque tous les speedcubeurs les plus rapides l’utilisent. Par rapport à la méthode débutant, elle regroupe des étapes : chaque coin de la première couche entre avec l’arête de la couche du milieu située au-dessus de lui, et la dernière couche prend deux séquences au lieu de quatre étapes. Le prix à payer : apprendre à voir les paires, et jusqu’à 78 séquences à mémoriser, même si vous pouvez commencer avec quelques-unes et ajouter les autres peu à peu.',
  solverHint:
    'Environ 53 mouvements, en quatre étapes. La croix et les paires sont trouvées par recherche, elles sont donc courtes. La dernière couche, c’est une séquence parmi 57, puis une parmi 21.',
  roadmap: {
    picture: 'La croix et une paire coin-arête',
    what: 'La méthode de la plupart des speedcubeurs. Elle avance encore par couches, mais chaque coin de la première couche entre avec l’arête située au-dessus de lui, et la dernière couche se fait en deux séquences.',
    pick: 'Choisissez-la si mémoriser ne vous fait pas peur : il y a jusqu’à 78 séquences, mais on peut commencer avec quelques-unes et ajouter les autres peu à peu.',
  },
  stages,
  lessons,
}
