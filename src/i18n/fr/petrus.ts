/** The text of the Petrus method: its stages and their lessons. */
import { EDGE_FLIPS as E, SMALL_BLOCK_EXAMPLES as S } from '../../core/methods/petrus/sequences.ts'
import type { PetrusStage } from '../../core/methods/petrus/stages.ts'
import type { MethodText } from '../method-text.ts'
import { cornerOrientationCases, permutationCases } from './last-layer.ts'

type CaseText = { title: string; body: string }

const stages: MethodText<PetrusStage>['stages'] = {
  'small-block': {
    name: 'Bloc 2×2×2',
    summary:
      'Résolvez un coin avec ses trois arêtes. Avec les trois centres qui les entourent, ils forment un bloc de deux sur deux sur deux.',
  },
  'big-block': {
    name: 'Bloc 2×2×3',
    summary:
      'Ajoutez un deuxième coin et deux arêtes de plus sans casser le petit bloc. Tout est maintenant résolu sauf deux faces.',
  },
  'edge-orientation': {
    name: 'Orientation des arêtes',
    summary:
      'Mettez dans le bon sens les sept arêtes hors du bloc, deux par deux. Les speedcubeurs appellent cela EO.',
  },
  'first-two-layers': {
    name: 'Deux premières couches',
    summary:
      'Terminez les deux premières couches en ne tournant que les deux faces libres. Les arêtes de la dernière couche se retrouvent dans le bon sens sans travail supplémentaire.',
  },
  'orient-last-layer-corners': {
    name: 'Coins de la dernière couche vers le haut',
    summary:
      'Les arêtes de la dernière couche sont déjà orientées vers le haut. Orientez les coins vers le haut avec une séquence parmi sept, appelée OCLL.',
  },
  'permute-last-layer': {
    name: 'Permutation de la dernière couche',
    summary:
      'Amenez les pièces de la dernière couche à leur place avec une séquence parmi 21, appelée PLL. Le cube est résolu.',
  },
}

/** One case per sequence of the edge lesson. Each body describes the cube as its picture shows it, before the sequence. */
const edgeCases: Record<keyof typeof E, CaseText> = {
  ulFr: {
    title: 'Haut gauche et avant droit',
    body: `L’arête en haut à gauche n’a pas de jaune et montre de l’orange sur le dessus. L’arête à l’avant droit a du jaune, mais montre de l’orange à l’avant. F' monte l’arête de l’avant droit en haut à l’avant, ce qui la rend bonne. U' la pousse plus loin et amène l’arête du haut gauche en haut à l’avant. F descend celle-ci à l’avant droit, la rend bonne elle aussi et remet le bloc en place. La séquence complète est ${E.ulFr}.`,
  },
  urUf: {
    title: 'Haut droit et haut avant',
    body: `L’arête en haut à droite a du jaune, mais montre du vert sur le dessus. L’arête en haut à l’avant n’a pas de jaune et montre de l’orange sur le dessus. F descend l’arête du haut avant à l’avant droit, R' la pousse plus loin et y amène l’arête du haut droit, et F' monte celle-ci en haut à l’avant. La séquence complète est ${E.urUf}.`,
  },
  ufDr: {
    title: 'Haut avant et bas droit',
    body: `L’arête en haut à l’avant montre de l’orange sur le dessus, avec du jaune à l’avant. L’arête en bas à droite montre du vert en dessous, avec du jaune à droite. C’est la séquence précédente avec la face de droite tournée dans l’autre sens : ${E.ufDr}. R monte l’arête du bas droit à l’avant droit.`,
  },
  ulBr: {
    title: 'Haut gauche et arrière droit',
    body: `L’arête en haut à gauche n’a pas de jaune et montre de l’orange sur le dessus. L’arête à l’arrière droit a du jaune à droite, là où il ne compte pas. C’est la première séquence faite avec la face arrière : B monte l’arête de l’arrière droit en haut à l’arrière, U y amène l’arête du haut gauche, et B' la descend. La séquence complète est ${E.ulBr}.`,
  },
  ufBr: {
    title: 'Haut avant et arrière droit',
    body: `L’arête en haut à l’avant n’a pas de jaune et montre de l’orange sur le dessus. L’autre mauvaise arête est à l’arrière droit. L’arête du haut avant est à un demi-tour du haut arrière, donc la rotation du milieu est U2 : ${E.ufBr}.`,
  },
  urBr: {
    title: 'Haut droit et arrière droit',
    body: `Les mauvaises arêtes sont en haut à droite et à l’arrière droit. Celle d’en haut à droite n’a pas de jaune et montre de l’orange sur le dessus. ${E.urBr} règle les deux.`,
  },
  ufUlFrBr: {
    title: 'Quatre : haut avant, haut gauche, avant droit, arrière droit',
    body: `Deux séquences s’enchaînent. F' U' F réglerait le haut gauche et l’avant droit, et F R2 F' les deux qui restent. Le F qui termine la première et le F qui commence la seconde fusionnent en F2 : ${E.ufUlFrBr}.`,
  },
  ufUlDrFr: {
    title: 'Quatre : haut avant, haut gauche, bas droit, avant droit',
    body: `F' U' F et F R F' s’enchaînent, réunies par F2 au milieu : ${E.ufUlDrFr}.`,
  },
  ufUlUbFr: {
    title: 'Quatre : haut avant, haut gauche, haut arrière, avant droit',
    body: `Trois des quatre arêtes du haut sont mauvaises ; seule celle d’en haut à droite, avec du jaune sur le dessus, est bonne. F' U2 F et F R' F' s’enchaînent : ${E.ufUlUbFr}.`,
  },
  ufUbFrBr: {
    title: 'Quatre : haut avant, haut arrière, avant droit, arrière droit',
    body: `Deux mauvaises arêtes sont opposées en haut et deux sont opposées sur la face de droite. F' U2 F et F R2 F' s’enchaînent : ${E.ufUbFrBr}.`,
  },
  urUfUlFr: {
    title: 'Quatre : haut droit, haut avant, haut gauche, avant droit',
    body: `Trois des quatre arêtes du haut sont mauvaises ; seule celle d’en haut à l’arrière, avec du jaune sur le dessus, est bonne. Cette fois, la face avant tourne d’abord dans le sens horaire : F R' F' et F' U' F s’enchaînent en ${E.urUfUlFr}.`,
  },
  urUfUbFr: {
    title: 'Quatre : haut droit, haut avant, haut arrière, avant droit',
    body: `Trois des quatre arêtes du haut sont mauvaises ; seule celle d’en haut à gauche, avec du jaune sur le dessus, est bonne. F R' F' et F' U2 F s’enchaînent : ${E.urUfUbFr}.`,
  },
  urUfUbDr: {
    title: 'Quatre : haut droit, haut avant, haut arrière, bas droit',
    body: `La face avant et la face arrière tournent ensemble, si bien que les deux bouts du bloc sortent en même temps. Une seule rotation de la face de droite règle alors les quatre arêtes, et les deux bouts reviennent : ${E.urUfUbDr}.`,
  },
  urUfUlUbDrBr: {
    title: 'Six : toutes sauf l’avant droit',
    body: `Toutes les arêtes libres sont mauvaises sauf celle de l’avant droit, qui montre du vert à l’avant et de l’orange à droite. Les cinq premiers mouvements sont la séquence précédente et règlent quatre arêtes. Il en reste deux, en haut à gauche et à l’arrière droit, et B U B' règle celles-là. Les deux rotations B du milieu fusionnent en B2 : ${E.urUfUlUbDrBr}.`,
  },
}

const lessons: MethodText<PetrusStage>['lessons'] = {
  'small-block': {
    goal: 'Un coin est résolu avec ses trois arêtes. Dans ces leçons, c’est le coin blanc, rouge et bleu, en bas, à l’arrière, à gauche du cube. Avec les centres blanc, rouge et bleu, les quatre pièces forment un bloc de deux sur deux sur deux.',
    steps: [
      'Trouvez les quatre pièces : le coin blanc-rouge-bleu et les arêtes blanc-rouge, blanc-bleu et bleu-rouge. Les centres ne bougent jamais : ils montrent donc où sera le bloc.',
      'Réunissez le coin et l’une de ses arêtes, de façon que deux couleurs se prolongent sur les deux pièces. Les deux bougent désormais comme une paire.',
      'Placez une deuxième arête à côté de son centre, sur la face vers laquelle la paire peut être tournée. Amenez la paire à côté d’elle. Le coin, les deux arêtes et le centre forment maintenant un carré plat.',
      'Placez la troisième arête entre ses deux centres, à sa place.',
      'Tournez le carré vers la troisième arête. Le bloc est construit.',
      'Il n’y a pas d’ordre fixe. Souvent, une paire est déjà formée, ou une seule rotation fait deux de ces tâches à la fois. Regardez où sont les quatre pièces avant le premier mouvement.',
    ],
    cases: {
      'last-turn': {
        title: 'La dernière rotation',
        body: `L’image montre le cube de derrière, avec la face de gauche à droite de l’image. L’arête blanc-bleu est à sa place, entre les centres blanc et bleu. Le coin et ses deux autres arêtes forment un carré avec le centre rouge sur la face de gauche : tous les trois y montrent du rouge. ${S.lastTurn} fait tourner le carré jusqu’à l’arête blanc-bleu.`,
      },
      'pair-and-square': {
        title: 'Une paire, puis le carré',
        body: "Le cube est de nouveau vu de derrière. L’arête blanc-bleu est à sa place. Le coin est en bas à l’avant gauche, avec l’arête bleu-rouge au-dessus de lui. Ils sont réunis : tous deux montrent du bleu à gauche et du rouge à l’avant. L’arête blanc-rouge attend à l’arrière gauche, le rouge sur la face de gauche à côté du centre rouge. F monte la paire en haut et U l’amène en haut à gauche, où elle montre du rouge à gauche. La paire, l’arête et le centre forment maintenant un carré, et L' le descend.",
      },
      'from-scratch': {
        title: 'Rien en place',
        body: "L’image montre le cube depuis la gauche. Aucune des quatre pièces n’est à sa place. Le coin et l’arête blanc-rouge sont réunis en haut à l’avant gauche : tous deux montrent du rouge sur le dessus et du blanc à l’avant. R' descend l’arête blanc-bleu dans la couche du bas et D la glisse à sa place. Le même D amène l’arête bleu-rouge en bas à gauche, le rouge sur la face de gauche. F' descend la paire à côté d’elle, ce qui forme le carré, et L amène le carré à sa place.",
      },
      done: {
        title: 'Le petit bloc',
        body: 'Vu de derrière : le coin, ses trois arêtes et les trois centres qui les entourent. Le reste du cube est encore mélangé. Trois faces peuvent maintenant tourner sans toucher au bloc : la face de droite, la face du haut et la face avant.',
      },
    },
    tip: 'N’importe lequel des huit coins convient, et certains sont bien plus faciles que d’autres. Lars Petrus conseille aux débutants de partir du même coin à chaque fois puis, une fois que c’est facile, de regarder les huit et de prendre le plus rapide. Le solveur regarde les huit, ainsi que la façon dont le bloc peut grandir, et il lui faut en général six ou sept mouvements ici.',
  },
  'big-block': {
    goal: 'Le bloc fait deux sur deux sur trois. Il s’étend le long du bas gauche du cube, d’avant en arrière, et contient toutes les pièces qui ne sont ni sur la face de droite ni sur la face du haut. Dans ces leçons, on ajoute le coin blanc, rouge et vert et les arêtes blanc-vert et vert-rouge.',
    steps: [
      'Tenez le petit bloc en bas, à l’arrière, à gauche. Ne tournez que la face de droite, la face du haut et la face avant : elles ne le touchent pas.',
      'Le bloc peut grandir dans trois directions. Ici, il grandit vers l’avant : trouvez donc le coin blanc-rouge-vert et les arêtes blanc-vert et vert-rouge.',
      'Procédez comme à la première étape. Réunissez le coin et une arête pour former une paire. Placez l’autre arête à côté du centre vert, sur la face avant. Amenez-y la paire pour former un carré avec le centre.',
      'Tournez la face avant pour descendre le carré à sa place.',
      'Une pièce qui est au bon endroit mais dans le mauvais sens doit d’abord en sortir. Sortez-la réunie à une autre pièce si vous le pouvez, comme dans le troisième cas ci-dessous.',
    ],
    cases: {
      'pair-then-square': {
        title: 'Une paire, puis le carré',
        body: 'Le coin est en haut à l’arrière droit et l’arête blanc-vert à côté de lui, en haut à droite. Ils sont réunis : tous deux montrent du blanc sur le dessus et du vert à droite. L’arête vert-rouge est en haut à l’avant, le vert à l’avant. F la descend à l’avant droit, toujours à côté du centre vert. U amène la paire à l’avant, de sorte que le coin se trouve entre ses deux arêtes et que le carré est formé. F2 descend le carré à sa place.',
      },
      'pair-from-the-back': {
        title: 'Une paire venue de l’arrière',
        body: "Le coin est en bas à l’arrière droit, avec l’arête vert-rouge au-dessus de lui. Ils sont réunis : tous deux montrent du rouge à droite et du vert à l’arrière. L’arête blanc-vert est en haut à gauche, le blanc sur le dessus. U' l’amène en haut à l’avant, à côté du centre vert. R2 fait basculer la paire à l’avant droit, à côté d’elle, et le carré est formé. F2 le descend.",
      },
      'twisted-corner': {
        title: 'Un coin au bon endroit mais pivoté',
        body: "Le coin est au bon endroit mais dans le mauvais sens : il montre du rouge à l’avant et du vert en dessous. L’arête vert-rouge à côté de lui, en bas à l’avant, montre les deux mêmes couleurs : les deux sont donc réunis. L’arête blanc-vert est en haut à l’avant. F' sort la paire vers la droite et amène l’arête blanc-vert à l’avant gauche, le vert à l’avant. R monte la paire en haut et U l’amène à l’avant, au-dessus de cette arête. Le carré est formé, et F' l’amène à sa place.",
      },
      done: {
        title: 'Le grand bloc',
        body: 'L’image montre le cube depuis la gauche. Le bloc s’étend le long du bas de la face de gauche, d’arrière en avant : deux coins, cinq arêtes et les centres qu’ils touchent. Seules la face de droite et la face du haut sont libres maintenant.',
      },
    },
    tip: 'Ne cassez pas le petit bloc : gardez une main dessus. Des trois directions, prenez celle dont les pièces sont les plus faciles. Le solveur choisit le coin et la direction ensemble : il ne lui faut donc en général que trois ou quatre mouvements ici, et il peut vous demander de tenir le cube de 24 façons différentes au départ. Lars Petrus montre aussi des façons plus rapides qui cassent le petit bloc un instant ; le solveur ne les utilise pas.',
  },
  'edge-orientation': {
    goal: 'Le grand bloc est toujours construit, et chacune des sept arêtes hors du bloc est « bonne » : elle peut aller à sa place dans le bon sens avec les seules rotations de la face de droite et de la face du haut.',
    steps: [
      'Tenez le bloc le long du bas gauche, pour que les faces libres soient le haut (jaune) et la droite (orange). Sept arêtes ne sont pas dans le bloc : quatre dans la couche du haut et trois autres autour de la face de droite.',
      'Vérifiez chacune des sept à l’aide d’un seul autocollant. Pour une arête de la couche du haut, prenez l’autocollant tourné vers le haut. Pour les trois autres, à l’avant droit, en bas à droite et à l’arrière droit, prenez l’autocollant qui n’est pas tourné vers la droite.',
      'Une arête qui porte du jaune est bonne si cet autocollant est jaune, et mauvaise sinon. Une arête sans jaune porte de l’orange : elle est mauvaise si cet autocollant est orange, et bonne sinon.',
      'Les rotations de la face de droite et de la face du haut ne changent jamais une bonne arête en mauvaise, ni l’inverse. Un quart de tour de la face avant ou de la face arrière le fait, pour les quatre arêtes qu’il emporte, mais il casse le bloc. Le nombre de mauvaises arêtes est toujours pair : zéro, deux, quatre ou six.',
      'Corrigez-en donc deux à la fois. Sortez une partie du bloc avec la face avant ou la face arrière, ce qui envoie aussi une mauvaise arête sur l’autre face libre. Tournez cette face libre pour mettre la deuxième mauvaise arête à la place de la première. Remettez le bloc. Les deux arêtes sont maintenant bonnes.',
      'Tournez d’abord la face de droite et la face du haut, pour amener les mauvaises arêtes aux endroits prévus par une séquence. Avec quatre ou six mauvaises arêtes, utilisez une séquence qui en enchaîne deux, ou corrigez-en deux et regardez de nouveau.',
    ],
    cases: edgeCases,
    tip: 'Vous n’avez pas besoin d’apprendre les quatorze séquences par cœur. Lars Petrus dit que c’est l’étape la plus simple une fois que l’on voit ce que font les trois mouvements : une mauvaise arête est retournée en passant sur l’autre face libre, une deuxième prend sa place, et celle-ci est retournée au retour. Chacune des séquences plus longues est faite de deux courtes enchaînées. La méthode ZZ applique la même idée aux douze arêtes dès le tout début.',
  },
  'first-two-layers': {
    goal: 'Les deux premières couches sont résolues, et chaque arête de la dernière couche montre la couleur de la dernière couche sur le dessus. Il ne reste que la dernière couche.',
    steps: [
      'À partir d’ici, ne tournez que la face de droite et la face du haut. Elles ne peuvent ni casser le bloc ni rendre mauvaise une bonne arête.',
      'Cinq pièces sont ajoutées. Dans ces leçons, ce sont l’arête blanc-orange, les deux coins blancs de droite et les deux arêtes de la couche du milieu à droite, ce qui laisse la couche jaune pour la fin.',
      'Formez d’abord un carré sur la face de droite : l’arête blanc-orange, un coin et son arête de la couche du milieu, autour du centre orange. Construisez-le comme avant, une paire puis le carré, et descendez-le pour que l’arête blanc-orange soit à sa place.',
      "Réunissez ensuite le dernier coin et la dernière arête dans la couche du haut et insérez la paire. Comme le carré gêne, la face de droite ne peut faire qu’un quart de tour aller et retour : R' U R ou une séquence semblable pour un emplacement à l’arrière, R U R' pour un emplacement à l’avant.",
      'Si les deux dernières pièces sont côte à côte mais ne concordent pas, séparez-les d’abord, comme dans le troisième cas ci-dessous.',
      'L’autre choix est d’ajouter plutôt les cinq pièces à gauche de la couche du haut et de laisser la couche de droite pour la fin. Prenez le plus facile des deux. Le cube est ensuite tourné pour que la couche restante soit en haut.',
    ],
    cases: {
      square: {
        title: 'Le carré',
        body: "Le coin blanc-vert-orange et l’arête vert-orange sont réunis en haut à l’avant gauche : tous deux montrent du vert sur le dessus et de l’orange à l’avant. L’arête blanc-orange est à l’arrière droit, l’orange à droite. R2 amène l’arête blanc-orange à l’avant droit. U' amène la paire à droite, au-dessus d’elle, et les trois forment un carré autour du centre orange. R' descend le carré.",
      },
      'back-pair': {
        title: 'La dernière paire, formée',
        body: "Le carré est construit à l’avant. Le dernier coin et la dernière arête sont réunis en haut à l’arrière droit : tous deux montrent du bleu sur le dessus et de l’orange à droite. U' écarte la paire. R' monte l’emplacement vide dans la couche du haut, U y glisse la paire et R redescend le tout.",
      },
      misaligned: {
        title: 'La dernière paire, côte à côte mais sans concorder',
        body: "Le coin et l’arête sont l’un à côté de l’autre en haut à l’arrière droit, mais ils ne concordent pas : le coin montre du blanc sur le dessus et l’arête du bleu. R' U2 R les sépare et retourne le coin, qui montre alors de l’orange sur le dessus. U R' les réunit ensuite en haut à l’avant, tous deux montrant du bleu sur le dessus, et U' R insère la paire comme dans le cas précédent.",
      },
      'right-last': {
        title: 'L’autre choix : la couche de droite en dernier',
        body: "Ici, les cinq pièces vont à gauche de la couche du haut : deux coins jaunes et trois arêtes jaunes. Trois d’entre elles sont déjà en haut, à une rotation de leur place. Le coin jaune-rouge-bleu et l’arête jaune-bleu sont réunis à l’avant droit, tous deux montrant du jaune à l’avant et du bleu à droite. R monte la paire en haut et U' amène les cinq à leur place. Il ne reste que la couche orange, et z' tourne le cube entier pour la mettre en haut.",
      },
      done: {
        title: 'Deux couches terminées',
        body: 'Les deux premières couches sont résolues, et les arêtes jaunes forment une croix en haut sans travail supplémentaire.',
      },
    },
    tip: 'Cette étape est la plus difficile à bien faire, parce que deux faces laissent très peu de marge. Elle est aussi rapide à tourner, puisque les mains ne changent jamais de prise. Le solveur lit toute l’étape dans une table et choisit les étapes précédentes pour que celle-ci soit courte : environ sept mouvements. Attendez-vous à en avoir besoin d’à peu près deux fois plus. Si de mauvaises arêtes apparaissent ici, c’est que le bloc a été cassé ou tenu dans un autre sens après la troisième étape.',
  },
  'orient-last-layer-corners': {
    goal: 'Chaque pièce de la dernière couche montre la couleur de la dernière couche sur le dessus. Les pièces ne sont pas encore à leur place : les côtés de la couche du haut sont donc encore mélangés.',
    steps: [
      'Regardez le haut. Les arêtes de la dernière couche forment déjà une croix. C’est à cela que servait la troisième étape : les bonnes arêtes restent bonnes, donc la croix est offerte.',
      'Comptez les coins qui montrent la couleur du haut sur le dessus : zéro, un ou deux. Ce n’est jamais exactement trois. Si les quatre la montrent, cette étape est terminée.',
      'Voyez où les autres coins montrent la couleur du haut sur les côtés, et trouvez le cas ci-dessous.',
      'Tournez la couche du haut jusqu’à ce que le cube corresponde à l’image du cas, et faites sa séquence. Une seule séquence termine toujours l’étape.',
    ],
    cases: cornerOrientationCases,
    tip: 'Environ une fois sur 27, les coins sont déjà orientés vers le haut et cette étape est sautée. Lars Petrus enseigne plutôt la dernière couche en trois temps : mettre les coins à leur place, les orienter vers le haut, puis mettre les arêtes à leur place. Cela ne demande qu’une poignée de séquences, et la première séquence ci-dessous, qu’il a nommée Sune, est la principale. Ce site utilise les deux étapes par lesquelles la plupart des cubeurs terminent aujourd’hui.',
  },
  'permute-last-layer': {
    goal: 'Chaque pièce de la dernière couche est à sa place. Le cube est résolu.',
    steps: [
      'Regardez les côtés de la couche du haut, pas le dessus. Cherchez des phares (deux coins montrant la même couleur sur un côté), des blocs (un coin et l’arête voisine montrant la même couleur) et des côtés terminés.',
      'Trouvez ci-dessous le cas qui a le même motif. Il y en a 21.',
      'Tournez la couche du haut jusqu’à ce que le motif soit placé comme le cas le décrit, et faites sa séquence. Certaines séquences tournent le cube entier ou la face avant ; ce n’est plus un problème, car il ne reste rien à protéger.',
      'Tournez encore une fois la couche du haut si elle n’est pas encore alignée avec les côtés.',
    ],
    cases: permutationCases,
    tip: 'Environ une fois sur 72, la dernière couche ne demande qu’une rotation du haut, ou rien du tout. Ce sont les 21 mêmes séquences que dans CFOP et ZZ : elles vous resserviront donc si vous apprenez aussi ces méthodes.',
  },
}

export const petrusText: MethodText<PetrusStage> = {
  name: 'Petrus',
  level: 'Construction de blocs',
  summary:
    'Construisez un petit bloc dans un coin, agrandissez-le jusqu’à ce qu’il ne reste que deux faces libres, mettez les arêtes restantes dans le bon sens, et terminez avec ces deux faces. Peu de mouvements, et peu de choses à apprendre par cœur.',
  lead: 'La méthode Petrus porte le nom de Lars Petrus, qui l’a mise au point en 1981 et a terminé quatrième au championnat du monde de 1982. Son point de départ : une première couche terminée gêne, car chaque mouvement suivant la casse et il faut la réparer encore et encore. Cette méthode ne construit donc jamais de couche. Elle construit un bloc de deux sur deux sur deux dans un coin, ce qui laisse trois faces libres de tourner, puis l’agrandit à deux sur deux sur trois, ce qui en laisse deux. Les arêtes hors du bloc sont ensuite mises dans le « bon » sens, après quoi les deux premières couches peuvent être terminées avec les deux seules faces libres, et la dernière couche commence avec sa croix déjà faite. Par rapport à la méthode débutant, il y a bien moins de mouvements, et l’essentiel de la résolution se fait en regardant et en réfléchissant, pas à partir de séquences. Petrus lui-même annonce 55 à 60 mouvements pour une résolution rapide et 40 à 45 quand le but est d’en faire peu.',
  solverHint:
    'Environ 39 mouvements, en six étapes. Les quatre premières sont trouvées par recherche et prennent environ 20 mouvements au total, moins que ce qu’une personne ferait d’habitude. Le solveur part du coin et de la direction qui donnent la solution la plus courte : vérifiez donc comment la première instruction vous demande de tenir le cube. Il peut aussi tourner le cube une fois avant la dernière couche.',
  roadmap: {
    picture: 'Un bloc de 2×2×2 dans un coin',
    what: 'Elle ne construit jamais de couche, car une couche terminée gêne. Un petit bloc dans un coin grandit jusqu’à ce qu’il ne reste que deux faces libres, et les deux premières couches se terminent avec ces deux faces seulement.',
    pick: 'Choisissez-la si vous aimez mieux regarder et réfléchir que réciter des séquences : l’essentiel de la résolution se trouve, il ne s’apprend pas par cœur.',
  },
  stages,
  lessons,
}
