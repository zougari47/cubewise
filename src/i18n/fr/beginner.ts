/** The text of the beginner method: its stages and their lessons. */
import { SEQUENCES as A } from '../../core/methods/beginner/sequences.ts'
import type { BeginnerStage } from '../../core/methods/beginner/stages.ts'
import type { MethodText } from '../method-text.ts'

const X_TEXT = A.lastLayerCross

const stages: MethodText<BeginnerStage>['stages'] = {
  cross: {
    name: 'Croix',
    summary:
      'Amenez quatre arêtes autour d’un centre pour former un signe plus, chaque arête étant aussi assortie au centre voisin.',
  },
  'first-layer-corners': {
    name: 'Coins de la première couche',
    summary:
      'Placez les quatre coins autour de la croix pour terminer la première couche, avec une seule séquence courte.',
  },
  'middle-layer-edges': {
    name: 'Arêtes de la couche du milieu',
    summary:
      'Retournez le cube et insérez les quatre arêtes du milieu depuis le haut, vers la gauche ou vers la droite.',
  },
  'last-layer-cross': {
    name: 'Croix de la dernière couche',
    summary:
      'Retournez les arêtes de la dernière couche jusqu’à ce que sa face montre un signe plus, sans défaire les deux couches résolues.',
  },
  'last-layer-edges': {
    name: 'Arêtes de la dernière couche',
    summary:
      'Faites tourner entre elles les arêtes de la dernière couche jusqu’à ce que chacune soit assortie au centre voisin.',
  },
  'last-layer-corner-positions': {
    name: 'Placement des coins de la dernière couche',
    summary: 'Amenez les quatre derniers coins chacun à sa place ; ils peuvent encore être pivotés.',
  },
  'last-layer-corner-twists': {
    name: 'Orientation des coins de la dernière couche',
    summary: 'Pivotez chaque coin restant dans le bon sens, un par un. Le cube est résolu.',
  },
}

const lessons: MethodText<BeginnerStage>['lessons'] = {
  cross: {
    goal: 'Quatre arêtes blanches forment un signe plus sur la face blanche, et la couleur latérale de chacune est assortie au centre voisin.',
    parts: [
      {
        title: 'Le plan : d’abord une marguerite, puis la croix',
        body: [
          'La croix va sur la face blanche, en dessous, là où vous ne la voyez pas. Nous la construisons donc en deux moitiés faciles.',
          'D’abord, rassemblez les quatre arêtes blanches en haut, autour du centre jaune, le blanc vers le haut. C’est ce qu’on appelle la marguerite. Du blanc à côté du jaune, cela semble faux, et ça l’est : la marguerite n’est qu’un endroit où garer les arêtes là où vous les voyez.',
          'Ensuite, envoyez chaque pétale vers la face blanche avec un demi-tour. Cela donne la croix.',
        ],
        cases: ['daisy', 'done'],
      },
      {
        title: 'Faire la marguerite',
        body: [
          'Cherchez une arête avec un autocollant blanc. Elle peut se trouver dans quelques types d’endroits, et chacun a sa réponse courte ci-dessous. Faites-les dans n’importe quel ordre, une arête à la fois.',
          'Une règle vous met à l’abri : avant de monter une arête, vérifiez la place où elle va arriver en haut. Si un pétale s’y trouve déjà, tournez d’abord la couche du haut pour qu’une place vide l’attende. Tourner le haut n’abîme jamais la marguerite.',
        ],
        cases: ['middle', 'make-room', 'bottom', 'flipped-top', 'flipped-bottom'],
      },
      {
        title: 'Transformer la marguerite en croix',
        body: [
          'Choisissez un pétale et regardez son autre autocollant, celui qui est sur le côté du cube.',
          'Tournez la couche du haut jusqu’à ce que cet autocollant soit juste au-dessus du centre de la même couleur.',
          'Tournez cette face latérale deux fois. Le pétale descend sur la face blanche, à sa place. Faites de même pour les trois autres.',
        ],
        cases: ['petal', 'line-up'],
      },
      {
        title: 'Une croix entière, du début à la fin',
        body: [
          'Voici le tout réuni sur un cube mélangé : quatre arêtes blanches montées une à une, puis quatre pétales descendus. Avancez lentement, pas à pas, et dites à quoi sert chaque mouvement.',
        ],
        cases: ['whole'],
      },
    ],
    cases: {
      daisy: {
        title: 'La marguerite',
        body: 'Quatre arêtes blanches autour du centre jaune, le blanc vers le haut. Les autocollants latéraux n’ont encore besoin d’être assortis à rien.',
      },
      done: {
        title: 'La croix terminée, vue d’en dessous',
        body: 'Le cube est retourné pour montrer la face blanche. Chaque arête blanche est aussi assortie au centre voisin.',
      },
      middle: {
        title: 'Une arête blanche dans la couche du milieu',
        body: 'L’autocollant blanc est face à vous, à droite de la face avant, et la place au-dessus, à droite, est vide. Une rotation de la face de droite (R) fait monter l’arête, le blanc en haut. Du côté gauche, c’est pareil avec L’.',
      },
      'make-room': {
        title: 'La même arête, avec un pétale qui gêne',
        body: 'Ici, un pétale occupe déjà la droite du haut. R le délogerait. Tournez donc d’abord le haut (U) pour amener la place vide, puis faites R.',
      },
      bottom: {
        title: 'Une arête blanche en bas, le blanc vers le bas',
        body: 'Vous ne voyez que son autocollant orange, en bas de la face de droite ; le blanc est en dessous. La place au-dessus, en haut, est vide : tournez donc la face de droite deux fois (R2).',
      },
      'flipped-top': {
        title: 'Une arête blanche en haut, à l’envers',
        body: 'Elle est dans la couche du haut, mais le blanc est face à vous et l’orange est en haut. Tournez la face avant (F) : l’arête passe dans la couche du milieu, à droite, et c’est maintenant le premier cas. R le termine.',
      },
      'flipped-bottom': {
        title: 'Une arête blanche en bas, le blanc face à vous',
        body: 'Le blanc est en bas de la face avant. Tournez la face avant dans l’autre sens (F’) pour amener l’arête dans la couche du milieu, à droite, puis R la fait monter.',
      },
      petal: {
        title: 'Descendre un pétale',
        body: 'L’autocollant latéral du pétale de devant est vert et il est au-dessus du centre vert : la face avant est donc tournée deux fois (F2).',
      },
      'line-up': {
        title: 'Aligner d’abord un pétale',
        body: 'Le pétale vert est à droite, au-dessus du centre orange. Cela ne correspond pas. Tournez le haut (U) pour l’amener au-dessus du centre vert, puis tournez la face avant deux fois.',
      },
      whole: {
        title: 'Sept mouvements pour la marguerite, huit pour la croix',
        body: 'Le mouvement L’ monte l’arête orange depuis la couche du milieu. U fait de la place et L2 monte l’arête rouge depuis le bas. F’ puis R montent l’arête bleue, dont le blanc était face à vous. U’ fait de la place et R monte l’arête verte. Ensuite, chaque pétale est aligné avec la couche du haut puis descendu : le vert, le bleu, l’orange, le rouge.',
      },
    },
    tip: 'Dans le solveur, la croix est faite par un chemin plus court que la marguerite. Quand la marguerite vous paraîtra facile, essayez de mettre les arêtes directement en bas.',
  },
  'first-layer-corners': {
    goal: 'Les quatre coins blancs rejoignent la croix. Toute la couche du bas est résolue, et la rangée du bas de chaque côté est assortie à son centre.',
    steps: [
      'Trouvez un coin avec un autocollant blanc dans la couche du haut.',
      'Ses deux autres couleurs disent où il va : entre les deux centres de ces couleurs. Tournez la couche du haut jusqu’à ce que le coin soit juste au-dessus de cette place, puis tournez le cube entier pour que le coin soit à l’avant à droite.',
      'Regardez de quel côté est tourné son autocollant blanc, et faites la séquence correspondante ci-dessous.',
      `Si un coin blanc est coincé dans la couche du bas, au mauvais endroit ou pivoté, tenez-le à l’avant à droite et faites ${A.cornerFacingRight} une fois. Cela le monte dans la couche du haut, où vous pouvez le placer comme d’habitude.`,
    ],
    cases: {
      right: { title: 'Le blanc est tourné vers la droite', body: 'Le cas le plus court : trois mouvements.' },
      front: { title: 'Le blanc est tourné vers l’avant', body: 'L’image miroir du premier cas.' },
      up: {
        title: 'Le blanc est tourné vers le haut',
        body: `Faites d’abord ${A.cornerFacingUp}. Le coin revient avec le blanc tourné vers la droite : terminez donc par ${A.cornerFacingRight}.`,
      },
    },
    tip: 'Après chaque coin, vérifiez que la croix est toujours entière. Sinon, c’est qu’un mouvement a été oublié : annulez et réessayez.',
  },
  'middle-layer-edges': {
    goal: 'Les quatre arêtes de la couche du milieu sont à leur place : les deux couches du bas sont donc résolues.',
    steps: [
      'Trouvez dans la couche du haut une arête sans autocollant jaune.',
      'Regardez son autocollant latéral, pas celui du dessus. Tournez la couche du haut jusqu’à ce que cet autocollant soit au-dessus du centre de la même couleur, puis tournez le cube entier pour qu’ils soient face à vous.',
      'La couleur du dessus de l’arête dit où elle va : vers la droite ou vers la gauche. Faites la séquence correspondante.',
      'Si une arête est coincée dans la couche du milieu, au mauvais endroit ou retournée, tenez-la à l’avant à droite et faites une fois la séquence « vers la droite ». Cela la monte dans la couche du haut.',
    ],
    cases: {
      right: {
        title: 'L’arête va vers la droite',
        body: 'La couleur du dessus de l’arête est celle du centre de droite.',
      },
      left: {
        title: 'L’arête va vers la gauche',
        body: 'La couleur du dessus de l’arête est celle du centre de gauche.',
      },
    },
    tip: 'Les deux séquences commencent par tourner la couche du haut à l’opposé du côté où va l’arête.',
  },
  'last-layer-cross': {
    goal: 'La face du haut montre un signe plus jaune. Seuls les autocollants jaunes comptent dans cette étape, pas les couleurs latérales.',
    steps: [
      'Regardez les quatre arêtes de la face du haut et voyez lesquelles ont le jaune vers le haut.',
      'Associez ce que vous voyez à l’une des trois formes ci-dessous. Tournez la couche du haut jusqu’à ce que la forme soit placée comme sur l’image.',
      `Faites ${X_TEXT}. Un point devient un angle, un angle devient une ligne, et une ligne devient la croix.`,
    ],
    cases: {
      dot: {
        title: 'Un point',
        body: 'Aucune arête n’a le jaune en haut. Faites la séquence une fois, tournez la couche du haut jusqu’à ce que l’angle soit à l’arrière à gauche, puis faites-la encore deux fois.',
      },
      corner: {
        title: 'Un angle',
        body: 'Deux arêtes voisines ont le jaune en haut. Tenez-les à l’arrière et à gauche, et faites la séquence deux fois.',
      },
      line: {
        title: 'Une ligne',
        body: 'Deux arêtes opposées ont le jaune en haut. Tenez la ligne de gauche à droite, et faites la séquence une fois.',
      },
    },
    tip: 'Certains coins peuvent aussi montrer du jaune en haut. Ne vous occupez pas des coins pour l’instant.',
  },
  'last-layer-edges': {
    goal: 'Chaque arête de la croix jaune est aussi assortie au centre de son côté.',
    steps: [
      'Tournez la couche du haut et comptez combien d’arêtes sont assorties au centre de leur côté. Vous pouvez toujours en assortir au moins deux.',
      'Si les quatre sont assorties, cette étape est déjà terminée.',
      `Si les deux arêtes assorties sont l’une à côté de l’autre, tenez le cube en les plaçant à l’arrière et à droite. Faites ${A.lastLayerEdges}, puis tournez la couche du haut encore une fois (U).`,
      'Si les deux arêtes assorties sont opposées, faites la séquence une fois depuis n’importe quel côté. Après cela, deux arêtes voisines sont assorties et vous pouvez continuer comme ci-dessus.',
    ],
    cases: {
      swap: {
        title: 'Deux arêtes voisines sont assorties',
        body: 'Les arêtes à l’arrière et à droite sont correctes. Les arêtes avant et gauche échangent leurs places.',
      },
    },
    tip: 'Seule la croix compte ici. Les coins se déplacent, et ce n’est pas grave.',
  },
  'last-layer-corner-positions': {
    goal: 'Chaque coin jaune se trouve entre ses trois centres. Il peut encore être pivoté.',
    steps: [
      'Vérifiez chaque coin de la couche du haut : ses trois couleurs sont-elles celles des trois centres qui l’entourent, dans n’importe quel ordre ? Si oui, il est à sa place.',
      `Si un coin est à sa place, tenez le cube avec ce coin à l’avant à droite de la couche du haut et faites ${A.lastLayerCornerCycle}. Les trois autres coins tournent entre eux. S’ils ne sont toujours pas à leur place, refaites-la une fois.`,
      'Si aucun coin n’est à sa place, faites la séquence une fois depuis n’importe quel côté. Après cela, un coin est à sa place.',
      'Si les quatre sont à leur place, passez à la dernière étape.',
    ],
    cases: {
      cycle: {
        title: 'Un coin à sa place',
        body: 'Le coin avant droit reste où il est. Les trois autres tournent entre eux.',
      },
    },
    tip: 'Ne tournez pas la couche du haut seule dans cette étape, sinon la croix ne sera plus assortie. Tournez plutôt le cube entier.',
  },
  'last-layer-corner-twists': {
    goal: 'Chaque coin jaune a le jaune en haut. Le cube est résolu.',
    steps: [
      'Tenez le cube avec un coin pivoté à l’avant à droite de la couche du haut.',
      `Faites ${A.lastLayerCornerTwist} deux fois. Si le jaune n’est pas encore en haut de ce coin, faites-la encore deux fois.`,
      'Le reste du cube semble maintenant mélangé. C’est normal. Ne tournez pas le cube entier.',
      'Tournez seulement la couche du haut pour amener le coin pivoté suivant à l’avant à droite, et recommencez.',
      'Quand le dernier coin est fait, les couches du dessous se remettent en place toutes seules. Tournez la couche du haut pour terminer.',
    ],
    cases: {
      twist: {
        title: 'Deux coins pivotés',
        body: 'Regardez les deux couches du bas se défaire puis se reformer.',
      },
    },
    tip: 'Comptez bien : la séquence se fait toujours deux ou quatre fois de suite, jamais un nombre impair de fois.',
  },
}

export const beginnerText: MethodText<BeginnerStage> = {
  name: 'Méthode débutant',
  level: 'Commencez ici',
  summary:
    'Résolvez le cube une couche à la fois, en sept étapes. Chaque étape a un seul but et seulement quelques séquences à retenir.',
  lead: 'La méthode débutant résout le cube une couche à la fois. Il y a sept étapes. Chacune a un seul but, une image de ce qu’il faut repérer et une séquence courte que vous pouvez voir en 3D.',
  solverHint:
    'Environ 130 mouvements, dans les sept étapes enseignées dans les leçons. Plus long, mais vous pouvez comprendre pourquoi chaque mouvement est fait.',
  roadmap: {
    picture: 'La première couche résolue',
    what: 'Une couche à la fois, en sept étapes. Chaque étape a un seul but et quelques séquences courtes : vous savez toujours quoi faire ensuite.',
    pick: 'Choisissez-la si vous n’avez jamais résolu de cube. C’est par là que presque tout le monde commence.',
  },
  stages,
  lessons,
}
