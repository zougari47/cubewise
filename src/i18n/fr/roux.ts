/** The text of the Roux method: its stages and their lessons. */
import {
  FIRST_BLOCK_EXAMPLES as F,
  ORIENT_EXAMPLES as O,
  SECOND_BLOCK_EXAMPLES as S,
} from '../../core/methods/roux/sequences.ts'
import type { TopCornersName } from '../../core/methods/roux/sequences.ts'
import type { RouxStage } from '../../core/methods/roux/stages.ts'
import type { MethodText } from '../method-text.ts'

type CaseText = { title: string; body: string }

const stages: MethodText<RouxStage>['stages'] = {
  'first-block': {
    name: 'Premier bloc',
    summary:
      'Construisez à gauche de la couche du bas un bloc d’une pièce de profondeur, deux de haut et trois de long, avec les mouvements que vous voulez.',
  },
  'second-block': {
    name: 'Deuxième bloc',
    summary:
      'Construisez le même bloc à droite sans défaire le premier, en ne tournant que la face de droite, le haut et la tranche du milieu.',
  },
  'top-corners': {
    name: 'Coins du haut',
    summary:
      'Résolvez les quatre coins du haut avec une séquence parmi 42, sans vous occuper des arêtes. Les speedcubeurs appellent cela CMLL.',
  },
  'orient-last-edges': {
    name: 'Six dernières arêtes : orientation',
    summary:
      'Retournez les six arêtes restantes pour que chacune montre la couleur du haut ou du bas vers le haut ou vers le bas, avec la tranche du milieu et le haut seulement.',
  },
  'side-edges': {
    name: 'Six dernières arêtes : gauche et droite',
    summary:
      'Amenez à leur place les arêtes du haut à gauche et du haut à droite, ce qui termine les côtés gauche et droit.',
  },
  'middle-edges': {
    name: 'Six dernières arêtes : tranche du milieu',
    summary: 'Mettez à leur place les quatre arêtes de la tranche du milieu. Le cube est résolu.',
  },
}

/**
 * The 42 cases of the top corners, in the order of the lesson. Each body
 * describes the cube as its picture shows it, before the sequence.
 */
const topCornerCases: Record<TopCornersName, CaseText> = {
  'o-adjacent-swap': {
    title: 'O : échange adjacent',
    body: 'Les quatre coins sont orientés vers le haut. À l’avant, les autocollants des coins sont rouge et vert ; à droite, ils sont orange et rouge.',
  },
  'o-diagonal-swap': {
    title: 'O : échange diagonal',
    body: 'Les quatre coins sont orientés vers le haut. À l’avant, les autocollants des coins sont vert et bleu ; à droite, ils sont rouge et orange.',
  },
  'h-columns': {
    title: 'H : colonnes',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît deux fois à l’avant et deux fois à l’arrière. À l’avant, les autocollants des coins sont tous les deux jaunes ; à droite, ils sont vert et bleu.',
  },
  'h-rows': {
    title: 'H : rangées',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît deux fois à l’avant et deux fois à l’arrière. À l’avant, les autocollants des coins sont tous les deux jaunes ; à droite, ils sont tous les deux rouges.',
  },
  'h-column': {
    title: 'H : colonne',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît deux fois à droite et deux fois à gauche. À l’avant, les autocollants des coins sont vert et bleu ; à droite, ils sont tous les deux jaunes.',
  },
  'h-row': {
    title: 'H : rangée',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît deux fois à l’avant et deux fois à l’arrière. À l’avant, les autocollants des coins sont tous les deux jaunes ; à droite, ils sont bleu et orange.',
  },
  'pi-right-bar': {
    title: 'Pi : barre à droite',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît une fois à l’avant, une fois à l’arrière et deux fois à gauche. À l’avant, les autocollants des coins sont rouge et jaune ; à droite, ils sont vert et bleu.',
  },
  'pi-back-slash': {
    title: 'Pi : oblique inverse',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît une fois à droite, deux fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont bleu et orange ; à droite, ils sont jaune et vert.',
  },
  'pi-x-checkerboard': {
    title: 'Pi : damier en x',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît deux fois à l’avant, une fois à droite et une fois à gauche. À l’avant, les autocollants des coins sont tous les deux jaunes ; à droite, ils sont vert et jaune.',
  },
  'pi-forward-slash': {
    title: 'Pi : oblique',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît une fois à l’avant, une fois à l’arrière et deux fois à gauche. À l’avant, les autocollants des coins sont orange et jaune ; à droite, ils sont vert et rouge.',
  },
  'pi-columns': {
    title: 'Pi : colonnes',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît deux fois à l’avant, une fois à droite et une fois à gauche. À l’avant, les autocollants des coins sont tous les deux jaunes ; à droite, ils sont orange et jaune.',
  },
  'pi-left-bar': {
    title: 'Pi : barre à gauche',
    body: 'Aucun coin n’est orienté vers le haut. Le jaune apparaît deux fois à l’avant, une fois à droite et une fois à gauche. À l’avant, les autocollants des coins sont tous les deux jaunes ; à droite, ils sont orange et jaune.',
  },
  'u-forward-slash': {
    title: 'U : oblique',
    body: 'Deux coins sont orientés vers le haut, à l’arrière droit et à l’arrière gauche. Le jaune apparaît deux fois à l’avant. À l’avant, les autocollants des coins sont tous les deux jaunes ; à droite, ils sont rouge et vert.',
  },
  'u-back-slash': {
    title: 'U : oblique inverse',
    body: 'Deux coins sont orientés vers le haut, à l’avant gauche et à l’avant droit. Le jaune apparaît deux fois à l’arrière. À l’avant, les autocollants des coins sont vert et orange ; à droite, ils sont bleu et rouge.',
  },
  'u-front-row': {
    title: 'U : rangée avant',
    body: 'Deux coins sont orientés vers le haut, à l’avant gauche et à l’avant droit. Le jaune apparaît deux fois à l’arrière. À l’avant, les autocollants des coins sont tous les deux verts ; à droite, ils sont orange et bleu.',
  },
  'u-rows': {
    title: 'U : rangées',
    body: 'Deux coins sont orientés vers le haut, à l’avant droit et à l’arrière droit. Le jaune apparaît deux fois à gauche. À l’avant, les autocollants des coins sont orange et rouge ; à droite, ils sont tous les deux verts.',
  },
  'u-x-checkerboard': {
    title: 'U : damier en x',
    body: 'Deux coins sont orientés vers le haut, à l’arrière droit et à l’arrière gauche. Le jaune apparaît deux fois à l’avant. À l’avant, les autocollants des coins sont tous les deux jaunes ; à droite, ils sont bleu et vert.',
  },
  'u-back-row': {
    title: 'U : rangée arrière',
    body: 'Deux coins sont orientés vers le haut, à l’avant droit et à l’arrière droit. Le jaune apparaît deux fois à gauche. À l’avant, les autocollants des coins sont vert et rouge ; à droite, ils sont vert et bleu.',
  },
  't-left-bar': {
    title: 'T : barre à gauche',
    body: 'Deux coins sont orientés vers le haut, à l’avant droit et à l’arrière droit. Le jaune apparaît une fois à l’avant et une fois à l’arrière. À l’avant, les autocollants des coins sont jaune et vert ; à droite, ils sont orange et bleu.',
  },
  't-right-bar': {
    title: 'T : barre à droite',
    body: 'Deux coins sont orientés vers le haut, à l’avant gauche et à l’arrière gauche. Le jaune apparaît une fois à l’avant et une fois à l’arrière. À l’avant, les autocollants des coins sont vert et jaune ; à droite, ils sont bleu et orange.',
  },
  't-rows': {
    title: 'T : rangées',
    body: 'Deux coins sont orientés vers le haut, à l’avant gauche et à l’avant droit. Le jaune apparaît une fois à droite et une fois à gauche. À l’avant, les autocollants des coins sont tous les deux orange ; à droite, ils sont bleu et jaune.',
  },
  't-front-row': {
    title: 'T : rangée avant',
    body: 'Deux coins sont orientés vers le haut, à l’avant gauche et à l’avant droit. Le jaune apparaît une fois à droite et une fois à gauche. À l’avant, les autocollants des coins sont tous les deux bleus ; à droite, ils sont rouge et jaune.',
  },
  't-back-row': {
    title: 'T : rangée arrière',
    body: 'Deux coins sont orientés vers le haut, à l’avant gauche et à l’avant droit. Le jaune apparaît une fois à droite et une fois à gauche. À l’avant, les autocollants des coins sont rouge et orange ; à droite, ils sont bleu et jaune.',
  },
  't-columns': {
    title: 'T : colonnes',
    body: 'Deux coins sont orientés vers le haut, à l’arrière droit et à l’arrière gauche. Le jaune apparaît une fois à droite et une fois à gauche. À l’avant, les autocollants des coins sont tous les deux orange ; à droite, ils sont jaune et rouge.',
  },
  's-left-bar': {
    title: 'S : barre à gauche',
    body: 'Un coin est orienté vers le haut, à l’avant gauche. Le jaune apparaît une fois à l’avant, une fois à droite et une fois à l’arrière. À l’avant, les autocollants des coins sont bleu et jaune ; à droite, ils sont bleu et jaune.',
  },
  's-x-checkerboard': {
    title: 'S : damier en x',
    body: 'Un coin est orienté vers le haut, à l’avant gauche. Le jaune apparaît une fois à l’avant, une fois à droite et une fois à l’arrière. À l’avant, les autocollants des coins sont orange et jaune ; à droite, ils sont orange et jaune.',
  },
  's-forward-slash': {
    title: 'S : oblique',
    body: 'Un coin est orienté vers le haut, à l’avant gauche. Le jaune apparaît une fois à l’avant, une fois à droite et une fois à l’arrière. À l’avant, les autocollants des coins sont orange et jaune ; à droite, ils sont bleu et jaune.',
  },
  's-columns': {
    title: 'S : colonnes',
    body: 'Un coin est orienté vers le haut, à l’avant gauche. Le jaune apparaît une fois à l’avant, une fois à droite et une fois à l’arrière. À l’avant, les autocollants des coins sont vert et jaune ; à droite, ils sont bleu et jaune.',
  },
  's-right-bar': {
    title: 'S : barre à droite',
    body: 'Un coin est orienté vers le haut, à l’arrière droit. Le jaune apparaît une fois à l’avant, une fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont vert et jaune ; à droite, ils sont rouge et bleu.',
  },
  's-back-slash': {
    title: 'S : oblique inverse',
    body: 'Un coin est orienté vers le haut, à l’avant gauche. Le jaune apparaît une fois à l’avant, une fois à droite et une fois à l’arrière. À l’avant, les autocollants des coins sont orange et jaune ; à droite, ils sont bleu et jaune.',
  },
  'as-right-bar': {
    title: 'As : barre à droite',
    body: 'Un coin est orienté vers le haut, à l’arrière gauche. Le jaune apparaît une fois à l’avant, une fois à droite et une fois à l’arrière. À l’avant, les autocollants des coins sont jaune et rouge ; à droite, ils sont jaune et vert.',
  },
  'as-columns': {
    title: 'As : colonnes',
    body: 'Un coin est orienté vers le haut, à l’avant droit. Le jaune apparaît une fois à l’avant, une fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont jaune et vert ; à droite, ils sont orange et rouge.',
  },
  'as-back-slash': {
    title: 'As : oblique inverse',
    body: 'Un coin est orienté vers le haut, à l’avant droit. Le jaune apparaît une fois à l’avant, une fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont jaune et rouge ; à droite, ils sont vert et orange.',
  },
  'as-x-checkerboard': {
    title: 'As : damier en x',
    body: 'Un coin est orienté vers le haut, à l’avant droit. Le jaune apparaît une fois à l’avant, une fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont jaune et rouge ; à droite, ils sont vert et bleu.',
  },
  'as-forward-slash': {
    title: 'As : oblique',
    body: 'Un coin est orienté vers le haut, à l’avant droit. Le jaune apparaît une fois à l’avant, une fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont jaune et rouge ; à droite, ils sont vert et rouge.',
  },
  'as-left-bar': {
    title: 'As : barre à gauche',
    body: 'Un coin est orienté vers le haut, à l’avant gauche. Le jaune apparaît une fois à droite, une fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont rouge et bleu ; à droite, ils sont jaune et orange.',
  },
  'l-mirror': {
    title: 'L : miroir',
    body: 'Deux coins sont orientés vers le haut, à l’avant droit et à l’arrière gauche. Le jaune apparaît une fois à l’avant et une fois à droite. À l’avant, les autocollants des coins sont jaune et orange ; à droite, ils sont bleu et jaune.',
  },
  'l-inverse': {
    title: 'L : inverse',
    body: 'Deux coins sont orientés vers le haut, à l’avant droit et à l’arrière gauche. Le jaune apparaît une fois à l’avant et une fois à droite. À l’avant, les autocollants des coins sont jaune et vert ; à droite, ils sont orange et jaune.',
  },
  'l-pure': {
    title: 'L : pur',
    body: 'Deux coins sont orientés vers le haut, à l’avant droit et à l’arrière gauche. Le jaune apparaît une fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont orange et bleu ; à droite, ils sont rouge et vert.',
  },
  'l-front-commutator': {
    title: 'L : commutateur avant',
    body: 'Deux coins sont orientés vers le haut, à l’avant droit et à l’arrière gauche. Le jaune apparaît une fois à l’avant et une fois à droite. À l’avant, les autocollants des coins sont jaune et orange ; à droite, ils sont bleu et jaune.',
  },
  'l-diagonal': {
    title: 'L : diagonale',
    body: 'Deux coins sont orientés vers le haut, à l’avant droit et à l’arrière gauche. Le jaune apparaît une fois à l’arrière et une fois à gauche. À l’avant, les autocollants des coins sont vert et rouge ; à droite, ils sont vert et rouge.',
  },
  'l-back-commutator': {
    title: 'L : commutateur arrière',
    body: 'Deux coins sont orientés vers le haut, à l’avant gauche et à l’arrière droit. Le jaune apparaît une fois à droite et une fois à l’arrière. À l’avant, les autocollants des coins sont vert et rouge ; à droite, ils sont jaune et vert.',
  },
}

const lessons: MethodText<RouxStage>['lessons'] = {
  'first-block': {
    goal: 'Cinq pièces à gauche de la couche du bas sont résolues et forment un bloc d’une pièce de profondeur, deux de haut et trois de long : l’arête du bas à gauche, les deux coins du bas à côté d’elle et les deux arêtes de la couche du milieu au-dessus d’eux. Rien d’autre ne compte pour l’instant.',
    steps: [
      'Tenez le cube avec le blanc en bas et le rouge à gauche. Le bloc est alors formé des cinq pièces qui portent du rouge et pas de jaune.',
      'Placez d’abord l’arête du bas à gauche : l’arête blanc et rouge. Elle va sous le centre rouge, le blanc vers le bas.',
      'Trouvez un coin blanc et rouge et l’arête qui porte ses deux couleurs latérales. Réunissez-les dans la couche du haut de façon que leurs couleurs concordent là où ils se touchent. Ils forment maintenant une paire, d’une pièce de large et deux de long.',
      'Tournez la couche du haut pour amener la paire au-dessus de sa place et descendez-la avec la face avant ou la face arrière. Un seul mouvement met les deux pièces en place.',
      'Faites de même avec l’autre paire. Rien n’est encore résolu à droite : la face de droite est donc libre pour former les paires.',
      'Avec de l’entraînement, vous construirez le bloc dans n’importe quel ordre et vous le planifierez en entier avant le premier mouvement, comme le fait le solveur.',
    ],
    cases: {
      'bottom-edge': {
        title: 'L’arête du bas à gauche',
        body: `Le cube est montré depuis la gauche. L’arête blanc et rouge est dans la couche du haut au-dessus du centre vert, le rouge sur le dessus et le blanc du côté vert. ${F.bottomEdge.split(' ')[0]} la descend le long de la face verte jusqu’au côté gauche, et ${F.bottomEdge.split(' ')[1]} la tourne vers le bas.`,
      },
      'joined-pair': {
        title: 'Une paire formée',
        body: "Le cube est montré depuis la gauche. Le coin et son arête sont côte à côte le long du bord gauche de la couche du haut : tous deux montrent du rouge sur le dessus et du vert à gauche. U' fait passer la paire à l’avant, et F' la descend à sa place à côté de l’arête du bas à gauche.",
      },
      'split-pair': {
        title: 'Une paire séparée',
        body: "Le cube est montré depuis l’avant. Le coin est en haut à l’arrière droit, le rouge sur le dessus et le blanc à droite. Son arête est à l’avant droit, le rouge vers l’avant. R monte l’arête en haut et U' l’envoie à l’arrière. R' ramène le coin en haut à côté d’elle, et la paire est formée. U2 l’amène à l’avant et F' la descend.",
      },
      'back-pair': {
        title: 'La paire arrière',
        body: 'Le cube est montré depuis la gauche. Le dernier coin et son arête sont réunis le long du bord gauche de la couche du haut : tous deux montrent du rouge sur le dessus et du bleu à gauche. U fait passer la paire à l’arrière, et B la descend à sa place.',
      },
      done: {
        title: 'Le bloc terminé, vu de la gauche',
        body: 'Deux rangées de trois sur la face de gauche, et du blanc tout le long du bas. Le reste du cube est encore mélangé.',
      },
    },
    tip: 'Le solveur construit le premier bloc en sept mouvements environ. Il regarde les quatre côtés du cube et part de celui qui donne les deux blocs les plus courts : vérifiez donc comment il vous demande de tenir le cube.',
  },
  'second-block': {
    goal: 'Les cinq mêmes pièces à droite sont résolues : l’arête du bas à droite, les deux coins du bas à côté d’elle et les deux arêtes de la couche du milieu au-dessus d’eux. Le premier bloc est intact. La couche du haut et la tranche du milieu sont encore mélangées.',
    steps: [
      'À partir d’ici, le bloc de gauche doit rester où il est. N’utilisez que quatre sortes de rotations : R, la couche du haut U, la rotation large r (la face de droite avec la tranche du milieu) et la rotation de tranche M. Aucune ne déplace une pièce du bloc de gauche.',
      'Placez l’arête du bas à droite : l’arête blanc et orange. Elle va sous le centre orange, le blanc vers le bas.',
      `Réunissez un coin blanc et orange et son arête dans la couche du haut, amenez la paire au-dessus de sa place et insérez-la. Pour la paire avant, c’est ${S.frontPair}, pour la paire arrière ${S.backPair}.`,
      'La tranche du milieu est libre, alors servez-vous-en. Une arête en bas de la tranche du milieu remonte avec M ou avec une rotation large, et tourner la tranche ne fait rien perdre.',
      'Les centres de la tranche du milieu bougent avec elle. Après cette étape, le centre du haut ne sera peut-être pas jaune. C’est normal : les dernières étapes remettent les centres en ordre.',
    ],
    cases: {
      'bottom-edge': {
        title: 'L’arête du bas à droite',
        body: "L’arête blanc et orange est en haut à l’avant, le blanc sur le dessus. U' l’amène au-dessus de la face de droite et R2 la descend en bas.",
      },
      'front-pair': {
        title: 'Une paire formée à l’avant',
        body: "Le coin est au-dessus de sa place, le blanc vers l’avant. Son arête est à côté de lui, en haut à droite : tous deux montrent du vert sur le dessus et de l’orange à droite. U écarte la paire, R monte sa place dans la couche du haut, U' ramène la paire au-dessus et R' la descend.",
      },
      'back-pair': {
        title: 'Une paire formée à l’arrière',
        body: "Le coin est au-dessus de sa place à l’arrière droit, le bleu sur le dessus. Son arête est à côté de lui, en haut à droite : tous deux montrent du bleu sur le dessus et de l’orange à droite. U' écarte la paire, R' monte sa place, U ramène la paire et R la descend.",
      },
      'wide-insert': {
        title: 'Une arête en bas de la tranche du milieu',
        body: "Le coin est en haut à l’avant gauche, le vert sur le dessus et l’orange vers l’avant. Son arête est en bas à l’avant, dans la tranche du milieu, le vert vers l’avant. La rotation large r monte l’arête à côté du coin, et la paire est formée. U' l’amène au-dessus du côté droit et r' la descend.",
      },
      'through-middle': {
        title: 'Coin à sa place, arête dans la tranche du milieu',
        body: "Le coin est à sa place, mais son arête est en bas à l’avant, le vert vers l’avant. R monte le coin en haut et U l’amène à l’avant gauche. M' monte l’arête à côté de lui. U' ramène la paire formée à droite, et r' la descend tout en remettant la tranche du milieu en place.",
      },
    },
    tip: 'Le solveur trouve le moins de rotations possible pour chaque deuxième bloc, environ huit : ses rotations peuvent donc différer des vôtres. Les adeptes de Roux ne tournent pas le cube entier pendant cette étape ni après : chaque rotation se fait avec la même prise en main.',
  },
  'top-corners': {
    goal: 'Les quatre coins du haut sont résolus les uns par rapport aux autres : tous montrent du jaune sur le dessus et leurs couleurs latérales concordent. La couche du haut peut encore être à une rotation des blocs ; cette rotation viendra avec les arêtes. Les deux blocs sont conservés. Les six arêtes hors des blocs sont ignorées.',
    steps: [
      'Ne regardez que les coins. Voyez d’abord lesquels montrent du jaune sur le dessus : cela donne la lettre du cas. Les cas ci-dessous sont regroupés par lettre.',
      'Regardez ensuite les autocollants des coins sur les côtés : lesquels sont jaunes, et lesquels vont par deux de la même couleur. C’est ce qui distingue les cas d’une même lettre.',
      'Tournez la couche du haut jusqu’à ce que les coins correspondent à l’image du cas.',
      'Faites la séquence de ce cas. Une seule séquence termine toujours l’étape.',
      'Vous n’avez pas besoin des 42 d’un coup. Commencez par un cas de chaque lettre pour orienter les coins vers le haut, puis l’un des deux cas O pour les mettre en place. Cela demande deux coups d’œil au lieu d’un.',
    ],
    cases: topCornerCases,
    tip: 'Ces séquences peuvent déplacer librement les six arêtes et les centres de la tranche du milieu : beaucoup sont donc plus courtes que les séquences de dernière couche pour les mêmes coins. Le centre du haut n’est pas forcément jaune à ce stade : fiez-vous aux coins. Environ une fois sur 162, les coins sont déjà résolus.',
  },
  'orient-last-edges': {
    goal: 'Le centre du haut est jaune ou blanc, et chacune des six arêtes restantes montre du jaune ou du blanc sur la face du haut ou du bas. On dit que ces arêtes sont bonnes. Les arêtes ne sont pas encore à leur place.',
    steps: [
      'D’ici à la fin, seules deux couches tournent : la tranche du milieu (M) et le haut (U). Aucune ne peut casser les blocs.',
      'Si le centre du haut n’est ni jaune ni blanc, une rotation M y amène le jaune ou le blanc. Jugez les arêtes après cela.',
      'Regardez les quatre arêtes du haut et les deux arêtes du bas de la tranche du milieu. Une arête est bonne si son autocollant jaune ou blanc est tourné vers le haut ou vers le bas, et mauvaise s’il est tourné vers un côté. Le nombre de mauvaises arêtes est toujours pair.',
      `Le cas à viser est la flèche : trois mauvaises arêtes en haut, et une mauvaise arête en bas, sous celle du milieu des trois. Tenez-le avec la mauvaise arête du bas à l’avant ; ${O.arrow} rend alors les six bonnes.`,
      'Toute autre répartition est d’abord transformée en flèche, avec une rotation M et une rotation du haut. Les cas ci-dessous indiquent combien de rotations demande chacune.',
    ],
    cases: {
      arrow: {
        title: 'La flèche : trois en haut, une en bas',
        body: "En haut, les arêtes avant, gauche et droite sont mauvaises : elles montrent de l’orange, du vert et du vert. L’arête arrière est bonne. En bas, l’arête avant est mauvaise, le jaune vers l’avant. M' monte la mauvaise arête du bas et descend la bonne arête arrière, U fait tourner le haut, et M termine : les six sont bonnes.",
      },
      'two-and-two': {
        title: 'Deux côte à côte en haut, deux en bas',
        body: "En haut, les arêtes avant et droite sont mauvaises : elles montrent de l’orange et du rouge. Les deux arêtes du bas sont mauvaises aussi. M2 et U' en font une flèche, et trois rotations de plus terminent.",
      },
      'two-beside': {
        title: 'Deux côte à côte en haut',
        body: 'En haut, les arêtes avant et droite sont mauvaises : elles montrent de l’orange et du vert. Les quatre autres arêtes sont bonnes. Sept rotations.',
      },
      'four-on-top': {
        title: 'Les quatre du haut',
        body: 'Aucune des quatre arêtes du haut ne montre du jaune ou du blanc sur le dessus. Les deux arêtes du bas sont bonnes. Sept rotations.',
      },
      'two-below': {
        title: 'Les deux arêtes du bas',
        body: 'Le haut semble terminé : les quatre arêtes du haut sont bonnes. Les deux arêtes du bas sont mauvaises, celle de l’avant montrant du blanc à l’avant. Sept rotations.',
      },
      'all-six': {
        title: 'Les six',
        body: 'Les six arêtes sont toutes mauvaises. C’est le cas le plus long, onze rotations, et il est rare.',
      },
    },
    tip: 'Chaque image est faite pour que sa séquence se termine sur un cube résolu, afin de rester facile à lire. Dans une vraie résolution, les arêtes finissent bonnes mais pas à leur place, et les coins peuvent être à une rotation du haut des blocs. Parmi les façons les plus courtes d’orienter les arêtes, le solveur choisit celle qui laisse le moins à faire ensuite.',
  },
  'side-edges': {
    goal: 'Les arêtes du haut à gauche et du haut à droite sont à leur place entre leurs coins, et les coins sont alignés avec les blocs. Les côtés gauche et droit du cube sont terminés. Il ne reste que les quatre arêtes de la tranche du milieu.',
    steps: [
      'Trouvez les deux arêtes : jaune et rouge, jaune et orange.',
      "Amenez-les toutes les deux en bas de la tranche du milieu, l’une à l’avant et l’autre à l’arrière. Pour faire passer une arête entre le haut et le bas sans la rendre mauvaise, utilisez M2, ou M' U2 M.",
      'Regardez l’arête en bas à l’avant. Si son autocollant latéral est rouge, tournez la couche du haut jusqu’à ce que les deux coins qui portent du rouge soient à l’arrière. S’il est orange, amenez à l’arrière les coins qui portent de l’orange.',
      'M2 monte les deux arêtes à leur place entre leurs coins. Tournez la couche du haut pour tout aligner avec les blocs.',
      'Gardez toutes les arêtes bonnes : les quarts de tour de la tranche du milieu vont par deux, avec seulement un demi-tour du haut entre eux.',
    ],
    cases: {
      'both-below': {
        title: 'Les deux en bas',
        body: "L’arête jaune et rouge est en bas à l’avant, le rouge vers l’avant. L’arête jaune et orange est en bas à l’arrière, hors de vue. U envoie à l’arrière les coins qui portent du rouge, M2 monte les deux arêtes entre leurs coins et U' les ramène à leur place. Les centres sont maintenant à l’envers : le dernier M2 les remet en ordre, et c’est en réalité la première rotation de l’étape suivante.",
      },
      'both-in-middle': {
        title: 'Les deux en haut dans la tranche du milieu',
        body: "L’arête jaune et rouge est en haut à l’avant et l’arête jaune et orange en haut à l’arrière. M2 les envoie toutes les deux en bas. U' amène à l’avant les coins qui portent du rouge, loin de l’arête rouge qui est à l’arrière. M2 monte les arêtes entre leurs coins et U aligne le tout.",
      },
      swapped: {
        title: 'Chacune à la place de l’autre',
        body: 'L’arête jaune et rouge est en haut à droite et l’arête jaune et orange en haut à gauche. U les met toutes les deux dans la tranche du milieu et M2 les envoie en bas. U2 fait faire un demi-tour aux coins, M2 monte les arêtes entre eux et U aligne le tout.',
      },
      'one-below': {
        title: 'Une en bas, une en haut',
        body: "L’arête jaune et orange est en bas à l’avant, l’orange vers l’avant. L’arête jaune et rouge est en haut à droite, à la place de la première. M' et M, avec U2 entre les deux, échangent des arêtes entre le haut et le bas et laissent toutes les arêtes bonnes.",
      },
    },
    tip: 'Cette étape demande environ cinq rotations. Souvent, les centres finissent à l’envers, avec le blanc en haut ; l’étape suivante corrige cela.',
  },
  'middle-edges': {
    goal: 'Les quatre arêtes de la tranche du milieu sont à leur place et les centres sont en ordre. Le cube est résolu.',
    steps: [
      'N’utilisez que des rotations M et des demi-tours du haut (U2). Un demi-tour du haut échange les arêtes de la tranche situées en haut à l’avant et en haut à l’arrière, et chaque paire de demi-tours laisse les côtés tels qu’ils étaient.',
      'Le centre du haut est jaune ou blanc. S’il est blanc, la tranche du milieu doit faire un demi-tour au total. S’il est jaune, les rotations de la tranche doivent s’annuler.',
      'Regardez où sont les quatre arêtes. Si l’une est à sa place, les trois autres tournent en rond : cela demande quatre ou cinq rotations.',
      'Si aucune n’est à sa place, les arêtes s’échangent deux à deux : voyez les trois derniers cas.',
    ],
    cases: {
      'three-edges': {
        title: 'Trois arêtes en rond',
        body: "L’arête en bas à l’arrière est à sa place. L’arête blanc et vert est en haut à l’avant, l’arête jaune et vert en haut à l’arrière et l’arête jaune et bleu en bas à l’avant. M' U2 M U2 envoie chacune à sa place.",
      },
      'three-edges-back': {
        title: 'Trois arêtes en rond, dans l’autre sens',
        body: 'L’arête en bas à l’arrière est à sa place. L’arête jaune et bleu est en haut à l’avant, l’arête blanc et vert en haut à l’arrière et l’arête jaune et vert en bas à l’avant. Les quatre mêmes rotations dans l’autre ordre.',
      },
      'front-and-back': {
        title: 'L’avant et l’arrière échangés',
        body: 'En haut à l’avant, l’autocollant latéral est bleu, et en haut à l’arrière il est vert : les deux arêtes du haut ont échangé leurs places. Les deux du bas aussi.',
      },
      'top-and-bottom': {
        title: 'Le haut et le bas échangés',
        body: 'Les arêtes blanches sont en haut et les arêtes jaunes en bas, chacune de son côté : blanc et vert en haut à l’avant, blanc et bleu en haut à l’arrière.',
      },
      diagonal: {
        title: 'Chaque arête est à l’opposé de sa place',
        body: 'Les arêtes blanches sont en haut, du mauvais côté : blanc et bleu en haut à l’avant, blanc et vert en haut à l’arrière. Le cas le plus long, sept rotations.',
      },
    },
    tip: 'Cette étape demande quatre rotations ou moins dans la plupart des résolutions. La fin d’une résolution Roux est rapide parce que les mains ne quittent jamais la tranche du milieu et le haut.',
  },
}

export const rouxText: MethodText<RouxStage> = {
  name: 'Roux',
  level: 'Speedcubing',
  summary:
    'Deux blocs, les coins du haut, puis les six dernières arêtes avec la tranche du milieu. Environ 40 mouvements, peu de séquences à apprendre, et jamais besoin de retourner le cube.',
  lead: 'La méthode Roux a été inventée par Gilles Roux en 2003 ; c’est la principale alternative à CFOP chez les cubeurs rapides. Elle ne procède pas par couches. Vous construisez un bloc à gauche et un bloc à droite, ce qui laisse libres la couche du haut et la tranche du milieu. Une séquence résout ensuite les coins du haut, et les six arêtes qui restent se résolvent avec les seules rotations de la tranche du milieu et du haut. Par rapport à la méthode débutant, elle demande bien moins de mouvements et seulement 42 séquences, et le cube n’est jamais retourné dans les mains. En contrepartie, les deux blocs se construisent à l’œil et non selon une règle, ce qui demande de l’entraînement.',
  solverHint:
    'Environ 39 mouvements, en six étapes. Les deux blocs sont trouvés par recherche : ils sont donc courts. Les coins du haut se résolvent avec une séquence parmi 42, et les six dernières arêtes n’utilisent que la tranche du milieu et le haut.',
  roadmap: {
    picture: 'Un bloc à gauche et un bloc à droite',
    what: 'Pas de couches. Vous construisez un bloc de chaque côté à l’œil, résolvez les coins du haut avec une séquence, puis terminez les six dernières arêtes avec la tranche du milieu et le haut seulement.',
    pick: 'Choisissez-la si vous voulez peu de mouvements et peu de séquences, et si vous aimez mieux réfléchir que mémoriser.',
  },
  stages,
  lessons,
}
