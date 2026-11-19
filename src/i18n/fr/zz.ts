/** The text of the ZZ method: its stages and their lessons. */
import { BLOCK_EXAMPLES as B, EO_LINE_EXAMPLES as E } from '../../core/methods/zz/sequences.ts'
import type { ZzStage } from '../../core/methods/zz/stages.ts'
import type { MethodText } from '../method-text.ts'
import { cornerOrientationCases, permutationCases } from './last-layer.ts'

const stages: MethodText<ZzStage>['stages'] = {
  'eo-line': {
    name: 'Orientation des arêtes et ligne',
    summary:
      'Tournez chaque arête dans le bon sens et placez les arêtes du bas à l’avant et à l’arrière, en six mouvements environ. Les speedcubeurs appellent cela EOLine.',
  },
  'first-two-layers': {
    name: 'Deux premières couches',
    summary:
      'Construisez un bloc de chaque côté de la ligne avec des rotations des faces de droite, du haut et de gauche seulement, sans tourner le cube dans vos mains. Les speedcubeurs appellent cela ZZ F2L.',
  },
  'orient-last-layer-corners': {
    name: 'Coins de la dernière couche vers le haut',
    summary:
      'Les arêtes de la dernière couche regardent déjà vers le haut. Tournez les coins vers le haut avec une séquence parmi sept, appelée OCLL.',
  },
  'permute-last-layer': {
    name: 'Permutation de la dernière couche',
    summary:
      'Amenez les pièces de la dernière couche à leur place avec une séquence parmi 21, appelée PLL. Le cube est résolu.',
  },
}

const lessons: MethodText<ZzStage>['lessons'] = {
  'eo-line': {
    goal: 'Toutes les arêtes sont « bonnes », et les arêtes blanc-vert et blanc-bleu sont en place. Avec le centre blanc, elles forment une ligne sous le cube, d’avant en arrière. Rien d’autre n’est encore résolu.',
    steps: [
      'Tenez le cube avec le blanc en bas et le vert devant, et ne le tournez pas dans vos mains. Une bonne arête peut rejoindre sa place dans le bon sens avec seulement des rotations des faces de droite, de gauche, du haut et du bas. Une mauvaise arête ne le peut pas : il lui faut un quart de tour de la face avant ou de la face arrière.',
      'Vérifiez chacune des douze arêtes grâce à un seul autocollant. Pour une arête de la couche du haut ou du bas, prenez l’autocollant tourné vers le haut ou vers le bas. Pour une arête de la couche du milieu, prenez l’autocollant tourné vers l’avant ou vers l’arrière. Jaune ou blanc : l’arête est bonne. Rouge ou orange : elle est mauvaise. Vert ou bleu : regardez l’autre autocollant de la même arête. S’il est rouge ou orange, l’arête est bonne ; s’il est jaune ou blanc, elle est mauvaise.',
      'Un quart de tour de la face avant ou de la face arrière change ses quatre arêtes : les mauvaises deviennent bonnes et les bonnes deviennent mauvaises. Aucune autre rotation ne change une arête, pas même un demi-tour de la face avant ou de la face arrière. Le nombre de mauvaises arêtes est toujours pair.',
      'Servez-vous des autres faces pour amener les mauvaises arêtes sur la face avant ou la face arrière. Avec quatre mauvaises arêtes sur une face, tournez cette face une fois. Avec deux seulement, placez-en une sur la face avant à côté de trois bonnes arêtes et tournez cette face : il y en a maintenant quatre. Avec six ou plus, rendez-en d’abord quatre bonnes, puis occupez-vous du reste.',
      'Amenez ensuite l’arête blanc-vert en bas à l’avant et l’arête blanc-bleu en bas à l’arrière. N’utilisez que les faces de droite, de gauche, du haut et du bas, et des demi-tours des faces avant et arrière, pour que toutes les arêtes restent bonnes.',
      'Avec de l’entraînement, faites les deux tâches ensemble : choisissez les rotations qui rendent les arêtes bonnes de sorte qu’elles amènent aussi les arêtes de la ligne à leur place.',
    ],
    cases: {
      'four-bad': {
        title: 'Quatre mauvaises arêtes à l’avant',
        body: `Les quatre arêtes de la face avant sont mauvaises. Celle d’en haut à l’avant a l’orange vers le haut, et celle d’en bas à l’avant a le rouge vers le bas. Les deux sur les côtés ont le vert vers l’avant : ce sont donc leurs autres autocollants qui décident. Ils sont blanc et jaune, les deux arêtes sont donc mauvaises. ${E.fourBad} les rend bonnes toutes les quatre.`,
      },
      gather: {
        title: 'Trois à l’avant, une ailleurs',
        body: 'Trois mauvaises arêtes sont sur la face avant : à l’avant droit, en bas à l’avant et à l’avant gauche. La quatrième est en bas à droite. R monte celle de l’avant droit en haut et fait monter celle d’en bas à droite à l’endroit qu’elle vient de quitter. U amène l’arête montée en haut à l’avant. Les quatre sont maintenant sur la face avant, et F les rend bonnes.',
      },
      'two-bad': {
        title: 'Deux mauvaises arêtes',
        body: "Les mauvaises arêtes sont en haut à gauche, l’orange vers le haut, et à l’avant gauche, l’orange vers l’avant. Une seule rotation ne peut pas rendre deux arêtes bonnes. Le premier F rend bonne l’arête de l’avant gauche et rend mauvaises trois bonnes arêtes. Il y en a maintenant quatre : trois sur la face avant et celle d’en haut à gauche. U' amène celle-ci à l’avant, et le second F les rend bonnes toutes les quatre.",
      },
      'line-edges': {
        title: 'Les arêtes de la ligne depuis le haut',
        body: 'Toutes les arêtes sont déjà bonnes. L’arête blanc-vert est en haut à droite et l’arête blanc-bleu en haut à l’avant, toutes deux avec le blanc vers le haut. U place l’arête blanc-vert au-dessus de sa place et F2 la descend. Un nouveau U place l’arête blanc-bleu au-dessus de sa place, à l’arrière, et B2 la descend. Les demi-tours des faces avant et arrière gardent toutes les arêtes bonnes.',
      },
      together: {
        title: 'Les deux tâches à la fois',
        body: "Quatre arêtes sont mauvaises : en haut à l’avant, à l’avant gauche, en bas à l’avant et en bas à droite. Celle d’en bas à droite est l’arête blanc-vert de la ligne. R l’amène à l’avant droit : les quatre sont alors sur la face avant. F les rend bonnes et, dans la même rotation, descend l’arête blanc-vert à sa place. L’arête blanc-bleu est maintenant en haut à droite : U' B2 l’amène à sa place.",
      },
      done: {
        title: 'La ligne, vue de dessous',
        body: 'Les arêtes blanc-vert et blanc-bleu sont de part et d’autre du centre blanc. Le reste du cube a encore l’air mélangé, mais toutes les arêtes sont maintenant bonnes.',
      },
    },
    tip: 'Planifiez toute l’étape avant le premier mouvement, comme vous le feriez pour une croix. Elle demande six mouvements en moyenne et jamais plus de neuf. Ne vous occupez pas encore des coins. Une croix en bas à la place de la ligne est une variante courante, appelée EOCross : elle coûte plus de mouvements ici et simplifie l’étape suivante.',
  },
  'first-two-layers': {
    goal: 'Les deux premières couches sont résolues. De chaque côté de la ligne, il y a un bloc de cinq pièces : une arête du bas, deux coins et deux arêtes de la couche du milieu. Chaque arête de la dernière couche montre du jaune sur le dessus.',
    steps: [
      'À partir d’ici, ne tournez que les faces de droite, du haut et de gauche. Ces rotations ne peuvent ni rendre mauvaise une bonne arête ni déplacer la ligne : rien de ce qui est déjà fait ne peut donc être défait. Inutile de tourner le cube dans vos mains.',
      'Commencez un bloc par son arête du bas : blanc-orange à droite, blanc-rouge à gauche. Amenez-la dans la couche du haut au-dessus de sa place et descendez-la d’un demi-tour.',
      "Remplissez les deux emplacements du bloc. Comme dans d’autres méthodes, réunissez un coin blanc à son arête de la couche du milieu dans la couche du haut, puis insérez la paire. Un emplacement à l’avant reçoit la paire avec R U R' ou une séquence semblable ; un emplacement à l’arrière la reçoit avec R' U R ou une séquence semblable : on n’a donc jamais à ramener l’arrière du cube devant soi.",
      'Comme toutes les arêtes sont bonnes, un coin et son arête peuvent toujours être réunis avec ces seules rotations : une arête n’arrive jamais dans le mauvais sens.',
      'Faites de même à gauche avec la face de gauche, en miroir. Travaillez d’abord sur le bloc dont les pièces sont les plus faciles.',
      'Si une pièce est coincée dans un mauvais emplacement, sortez-la avec les trois mouvements qui y inséreraient une paire, puis résolvez-la comme d’habitude.',
    ],
    cases: {
      'bottom-edge': {
        title: 'L’arête du bas d’un bloc',
        body: `L’arête blanc-orange est en haut à l’arrière, le blanc vers le haut. U l’amène au-dessus de sa place à droite, et R2 la descend. La séquence complète est ${B.bottomEdge}.`,
      },
      'front-pair': {
        title: 'Une paire réunie vers l’avant',
        body: "Le coin est au-dessus de l’emplacement avant droit, le blanc vers l’avant. Son arête est à côté de lui, en haut à droite : les deux montrent du vert sur le dessus et de l’orange à droite. U écarte la paire, R monte l’emplacement à sa rencontre, U' y glisse la paire et R' la descend.",
      },
      'split-pair': {
        title: 'Une paire séparée',
        body: "Le coin est au-dessus de l’emplacement avant droit, le blanc vers la droite et l’orange sur le dessus. L’arête est en haut à l’arrière, le vert sur le dessus. R emmène le coin à l’arrière, où il rejoint l’arête. U ramène les deux ensemble, et R' descend la paire.",
      },
      'back-pair': {
        title: 'Une paire réunie vers l’arrière',
        body: "Le coin est au-dessus de l’emplacement arrière droit, le blanc vers l’arrière. Son arête est à côté de lui, en haut à droite : les deux montrent du bleu sur le dessus et de l’orange à droite. C’est le cas de l’avant vu dans un miroir : U' écarte la paire, R' monte l’emplacement arrière, U y glisse la paire et R la descend. Le cube reste tenu tel quel.",
      },
      'left-pair': {
        title: 'Une paire réunie à gauche',
        body: "L’image montre le cube vu de la gauche. Le bloc de droite est terminé. Le coin est au-dessus de l’emplacement avant gauche, le blanc vers l’avant, et son arête est à côté de lui, en haut à gauche : les deux montrent du vert sur le dessus et du rouge à gauche. La main gauche fait ce que la main droite a fait : U' L' U L.",
      },
      done: {
        title: 'Les deux blocs construits',
        body: 'Les deux premières couches sont résolues, et les arêtes jaunes forment une croix sur le dessus sans travail supplémentaire.',
      },
    },
    tip: 'Le solveur construit un bloc entier puis l’autre, chacun avec le moins de mouvements qu’il trouve, et déplace souvent plusieurs pièces à la fois. Ses mouvements seront plus courts que les vôtres et pourront avoir l’air différents. Ce qui compte, c’est l’habitude : faces de droite, du haut et de gauche seulement, sans bouger le cube.',
  },
  'orient-last-layer-corners': {
    goal: 'Chaque pièce de la dernière couche montre du jaune sur le dessus. Les pièces ne sont pas encore à leur place : les côtés de la couche du haut sont donc encore mélangés.',
    steps: [
      'Regardez le dessus. Les arêtes jaunes forment déjà une croix. C’est à cela que servait la première étape : les bonnes arêtes restent bonnes, la croix est donc offerte.',
      'Comptez les coins qui montrent du jaune sur le dessus : aucun, un ou deux. Il n’y en a jamais exactement trois. Si les quatre le montrent, cette étape est terminée.',
      'Voyez où les autres coins montrent du jaune sur les côtés, et trouvez le cas ci-dessous.',
      'Tournez la couche du haut jusqu’à ce que le cube corresponde à l’image du cas, puis faites sa séquence. Une seule séquence termine toujours l’étape.',
    ],
    cases: cornerOrientationCases,
    tip: 'Environ une fois sur 27, les coins regardent déjà vers le haut et cette étape est sautée. Les adeptes avancés de ZZ remplacent cette étape et la suivante par une séquence parmi 493, un ensemble appelé ZBLL, qui ne fonctionne que parce que les arêtes regardent toujours vers le haut. Apprenez d’abord les sept et les 21.',
  },
  'permute-last-layer': {
    goal: 'Chaque pièce de la dernière couche est à sa place. Le cube est résolu.',
    steps: [
      'Regardez les côtés de la couche du haut, pas le dessus. Cherchez des phares (deux coins qui montrent la même couleur sur un côté), des blocs (un coin et l’arête voisine qui montrent la même couleur) et des côtés terminés.',
      'Trouvez ci-dessous le cas qui a le même motif. Il y en a 21.',
      'Tournez la couche du haut jusqu’à ce que le motif soit placé comme le cas le décrit, puis faites sa séquence. Certaines séquences tournent le cube entier ou la face avant ; ce n’est plus un problème, car il ne reste rien à protéger.',
      'Tournez encore une fois la couche du haut si elle n’est pas encore alignée avec les côtés.',
    ],
    cases: permutationCases,
    tip: 'Environ une fois sur 72, la dernière couche ne demande qu’une rotation du haut, ou rien du tout. Ce sont les 21 mêmes séquences que dans CFOP : elles vous serviront donc aussi si vous apprenez cette méthode.',
  },
}

export const zzText: MethodText<ZzStage> = {
  name: 'ZZ',
  level: 'Speedcubing',
  summary:
    'Tournez d’abord chaque arête dans le bon sens, avec une ligne en bas. Les deux premières couches ne demandent alors que trois faces, sans tourner le cube, et la dernière couche commence avec sa croix déjà faite.',
  lead: 'ZZ tire son nom de Zbigniew Zborowski, qui l’a publiée en 2006. Elle commence par une étape qu’aucune méthode par couches ne possède : chaque arête est tournée dans le « bon » sens pendant que deux arêtes du bas sont placées en ligne, une étape appelée EOLine. Ensuite, les deux premières couches sont construites en deux blocs avec des rotations des faces de droite, du haut et de gauche seulement : le cube n’est donc jamais tourné dans les mains, et les arêtes de la dernière couche regardent vers le haut sans aucun travail. Par rapport à la méthode débutant, elle compte bien moins de mouvements et d’étapes, et par rapport à CFOP, moins de séquences à apprendre pour la dernière couche : 28 au lieu de 78. Le prix à payer est la première étape : voir quelles arêtes sont mauvaises, et prévoir comment les corriger avant le premier mouvement, demande de l’entraînement. C’est la forme d’origine de la méthode ; beaucoup d’adeptes de ZZ font aujourd’hui une croix entière dans la première étape à la place de la ligne, ce qu’on appelle EOCross.',
  solverHint:
    'Environ 43 mouvements, en quatre étapes. La ligne prend environ 6 mouvements et les deux blocs environ 16, trouvés par recherche : ils sont donc plus courts que ce qu’une personne obtiendrait d’habitude. La ligne est faite d’avant en arrière ou d’un côté à l’autre, selon ce qui donne la solution la plus courte : regardez donc comment la première instruction vous demande de tenir le cube.',
  roadmap: {
    picture: 'La ligne et le bloc à côté d’elle',
    what: 'Elle commence par tourner chaque arête dans le bon sens et par poser une ligne en bas. Ensuite, les deux premières couches ne demandent que trois faces, et le cube n’est jamais tourné dans les mains.',
    pick: 'Choisissez-la si vous aimez planifier avant le premier mouvement et voulez moins de séquences de dernière couche qu’avec CFOP.',
  },
  stages,
  lessons,
}
