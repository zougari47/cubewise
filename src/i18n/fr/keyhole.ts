/** The text of the keyhole method: its stages and their lessons. */
import { SEQUENCES as A } from '../../core/methods/beginner/sequences.ts'
import { KEYHOLE_INSERTS as K } from '../../core/methods/keyhole/sequences.ts'
import type { KeyholeStage } from '../../core/methods/keyhole/stages.ts'
import type { MethodText } from '../method-text.ts'
import { beginnerText } from './beginner.ts'

const stages: MethodText<KeyholeStage>['stages'] = {
  cross: beginnerText.stages.cross,
  'three-corners': {
    name: 'Trois coins de la première couche',
    summary:
      'Placez trois des quatre coins autour de la croix, comme dans la méthode débutant. La quatrième place, laissée vide, est le trou de serrure.',
  },
  'keyhole-edges': {
    name: 'Arêtes de la couche du milieu par le trou de serrure',
    summary:
      'Tournez la couche du bas pour amener le trou de serrure sous chaque arête de la couche du milieu, et insérez l’arête en trois mouvements.',
  },
  'last-corner': {
    name: 'Dernier coin de la première couche',
    summary:
      'Comblez le trou de serrure avec le quatrième coin sans déranger l’arête au-dessus. Les deux premières couches sont résolues.',
  },
  'last-layer-cross': beginnerText.stages['last-layer-cross'],
  'last-layer-edges': beginnerText.stages['last-layer-edges'],
  'last-layer-corner-positions': beginnerText.stages['last-layer-corner-positions'],
  'last-layer-corner-twists': beginnerText.stages['last-layer-corner-twists'],
}

const lessons: MethodText<KeyholeStage>['lessons'] = {
  cross: {
    ...beginnerText.lessons.cross,
    tip: 'Cette étape est la même que dans la méthode débutant. Si vous savez déjà faire la croix, passez directement à l’étape suivante.',
  },
  'three-corners': {
    goal: 'Trois coins blancs rejoignent la croix. La quatrième place de coin est laissée telle quelle : cette place est le trou de serrure.',
    steps: [
      'Trouvez un coin avec un autocollant blanc dans la couche du haut.',
      'Ses deux autres couleurs disent où il va. Tournez la couche du haut jusqu’à ce que le coin soit juste au-dessus de cette place, puis tournez le cube entier pour que le coin soit à l’avant à droite.',
      'Regardez de quel côté est tourné son autocollant blanc, et faites la séquence correspondante ci-dessous. Ce sont les trois séquences de la méthode débutant.',
      'Arrêtez-vous après trois coins. Prenez les trois plus faciles à atteindre ; peu importe quelle place reste vide.',
      `Si un coin dont vous avez besoin est coincé dans la couche du bas, au mauvais endroit ou pivoté, tenez-le à l’avant à droite et faites ${A.cornerFacingRight} une fois. Cela le monte dans la couche du haut.`,
    ],
    cases: {
      right: { title: 'Le blanc est tourné vers la droite', body: 'Le cas le plus court : trois mouvements.' },
      front: { title: 'Le blanc est tourné vers l’avant', body: 'L’image miroir du premier cas.' },
      up: {
        title: 'Le blanc est tourné vers le haut',
        body: `Faites d’abord ${A.cornerFacingUp}. Le coin revient avec le blanc tourné vers la droite : terminez donc par ${A.cornerFacingRight}.`,
      },
      keyhole: {
        title: 'Trois coins, vus d’en dessous',
        body: 'La croix et trois coins sont à leur place. Le coin gris est le trou de serrure. Peu importe quelle pièce s’y trouve.',
      },
    },
    tip: 'Si le quatrième coin se trouve être facile lui aussi, laissez-le quand même. Le trou de serrure fait gagner plus de mouvements à l’étape suivante que le coin n’en coûtera plus tard.',
  },
  'keyhole-edges': {
    goal: 'Les quatre arêtes de la couche du milieu sont à leur place. La croix et les trois coins sont revenus où ils étaient, et seul le trou de serrure reste à résoudre dans les deux couches du bas.',
    steps: [
      'Trouvez dans la couche du haut une arête sans autocollant jaune. Ses deux couleurs disent où elle va : entre les deux centres de ces couleurs. Tournez le cube entier pour que cette place soit à l’avant à droite ou à l’avant à gauche.',
      'Tournez la couche du bas jusqu’à ce que le trou de serrure soit juste en dessous de cette place. Pour l’instant, la croix n’est plus assortie aux centres latéraux. C’est normal.',
      'Tournez la couche du haut jusqu’à ce que l’autocollant du dessus de l’arête soit au-dessus du centre de la même couleur. L’arête est alors à l’avant ou sur le côté, à côté de sa place.',
      'Faites la séquence de trois mouvements correspondante ci-dessous. Chacune commence par la face latérale sur laquelle l’arête ne se trouve pas.',
      'Pour l’arête suivante, tournez de nouveau la couche du bas pour amener le trou de serrure sous sa place. Inutile de la remettre en place entre-temps.',
      'Quand les quatre arêtes sont en place, tournez la couche du bas jusqu’à ce que la croix soit de nouveau assortie aux centres latéraux.',
    ],
    cases: {
      'right-from-front': {
        title: 'Vers la droite, arête à l’avant',
        body: 'L’arête est en haut à l’avant avec le vert en haut, au-dessus du centre vert. Son côté orange dit qu’elle va à l’avant à droite. Le trou de serrure est en dessous de cette place.',
      },
      'right-from-side': {
        title: 'Vers la droite, arête sur le côté',
        body: 'La même arête dans l’autre sens : elle est en haut à droite avec l’orange en haut, au-dessus du centre orange. C’est maintenant la face avant qui fait le travail.',
      },
      'left-from-front': {
        title: 'Vers la gauche, arête à l’avant',
        body: 'L’image miroir du premier cas. L’arête est en haut à l’avant avec le vert en haut, et son côté rouge dit qu’elle va à l’avant à gauche. Le trou de serrure est à l’avant à gauche.',
      },
      'left-from-side': {
        title: 'Vers la gauche, arête sur le côté',
        body: 'L’arête est en haut à gauche avec le rouge en haut, au-dessus du centre rouge. L’image miroir du deuxième cas.',
      },
      'bottom-turn': {
        title: 'Amener le trou de serrure',
        body: `L’arête va à l’avant à droite, mais le trou de serrure est à l’avant à gauche. Tournez la couche du bas (D) pour amener le trou de serrure sous la place, faites ${K.rightFromFront}, puis remettez la couche du bas en place.`,
      },
      stuck: {
        title: 'Une arête coincée dans la couche du milieu',
        body: `L’arête avant droite est à sa place, mais retournée. Avec le trou de serrure en dessous, ${K.rightFromFront} met à sa place une arête de la couche du haut et la fait sortir. Ensuite, alignez-la et insérez-la comme d’habitude.`,
      },
    },
    tip: 'Dans la méthode débutant, chacune de ces arêtes demande huit mouvements, parce qu’il faut sortir le coin du dessous puis le remettre. Ici, ce coin manque déjà : trois mouvements suffisent.',
  },
  'last-corner': {
    goal: 'Le quatrième coin blanc comble le trou de serrure. Les deux couches du bas sont résolues.',
    steps: [
      'Vérifiez que la croix est assortie aux centres latéraux, puis tournez le cube entier pour que le trou de serrure soit à l’avant à droite.',
      'Trouvez le dernier coin blanc. S’il est dans la couche du haut, tournez la couche du haut jusqu’à ce qu’il soit juste au-dessus du trou de serrure.',
      'Regardez de quel côté est tourné son autocollant blanc, et faites la séquence correspondante ci-dessous. Chacune laisse où elle est l’arête située au-dessus du trou de serrure.',
      'Si le coin est déjà dans le trou de serrure mais pivoté, utilisez l’une des deux séquences pour un coin pivoté.',
      'Si le coin se trouve être déjà résolu, il n’y a rien à faire.',
    ],
    cases: {
      'facing-right': {
        title: 'Le blanc est tourné vers la droite',
        body: 'Le coin est au-dessus du trou de serrure avec le blanc sur la face de droite.',
      },
      'facing-front': {
        title: 'Le blanc est tourné vers l’avant',
        body: 'Le coin est au-dessus du trou de serrure avec le blanc sur la face avant.',
      },
      'facing-up': {
        title: 'Le blanc est tourné vers le haut',
        body: 'Le coin est au-dessus du trou de serrure avec le blanc en haut. Seuls des demi-tours de la face de droite sont utilisés.',
      },
      'twisted-facing-right': {
        title: 'En place, le blanc tourné vers la droite',
        body: 'Le coin est dans le trou de serrure avec le blanc sur la face de droite. La couche du haut n’est pas tournée d’abord.',
      },
      'twisted-facing-front': {
        title: 'En place, le blanc tourné vers l’avant',
        body: 'Le coin est dans le trou de serrure avec le blanc sur la face avant. C’est la séquence précédente, jouée à l’envers.',
      },
    },
    tip: `N’utilisez pas ${A.cornerFacingRight} ici comme dans la méthode débutant : cela sortirait l’arête terminée avec le coin. Ces séquences n’utilisent que la face de droite et la couche du haut, elles sont donc rapides une fois apprises.`,
  },
  'last-layer-cross': beginnerText.lessons['last-layer-cross'],
  'last-layer-edges': beginnerText.lessons['last-layer-edges'],
  'last-layer-corner-positions': beginnerText.lessons['last-layer-corner-positions'],
  'last-layer-corner-twists': beginnerText.lessons['last-layer-corner-twists'],
}

export const keyholeText: MethodText<KeyholeStage> = {
  name: 'Méthode du trou de serrure (keyhole)',
  level: 'Un petit cran au-dessus',
  summary:
    'La méthode débutant avec un raccourci : laissez de côté un coin de la première couche et glissez les arêtes de la couche du milieu par l’ouverture, en trois mouvements chacune. Les speedcubeurs l’appellent « keyhole F2L ».',
  lead: 'La méthode du trou de serrure est la méthode débutant avec un chemin plus rapide pour les deux premières couches. Seuls trois coins de la première couche sont d’abord résolus. La quatrième place, laissée vide, le trou de serrure, est amenée tour à tour sous chaque arête de la couche du milieu, et l’arête s’insère en trois mouvements au lieu de huit. Le dernier coin est ensuite placé autour de son arête, et la dernière couche se résout exactement comme avant. C’est une première marche courante pour ceux qui connaissent la méthode débutant et veulent moins de mouvements avant d’apprendre une méthode de speedcubing.',
  solverHint:
    'Environ 110 mouvements, en huit étapes. Les deux premières couches demandent environ 13 mouvements de moins que dans la méthode débutant, et la dernière couche se résout de la même façon.',
  roadmap: {
    picture: 'Trois coins en place, la quatrième place laissée vide',
    what: 'La méthode débutant avec un raccourci. Un coin de la première couche est laissé de côté, et les arêtes de la couche du milieu se glissent par l’ouverture, en trois mouvements chacune au lieu de huit.',
    pick: 'Choisissez-la quand la méthode débutant vous semble facile et que vous voulez moins de mouvements, avec presque rien de nouveau à mémoriser.',
  },
  stages,
  lessons,
}
