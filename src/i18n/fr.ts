/**
 * Every piece of text the site shows, in French. Its shape is `Messages`,
 * which `en.ts` defines.
 */
import type { ColourKey } from '../pages/solver/entry.ts'
import type { MethodId } from '../core/methods/index.ts'
import type { Messages } from './en.ts'
import { beginnerText } from './fr/beginner.ts'
import { keyholeText } from './fr/keyhole.ts'
import { cfopText } from './fr/cfop.ts'
import { rouxText } from './fr/roux.ts'
import { zzText } from './fr/zz.ts'
import { petrusText } from './fr/petrus.ts'
import { beforeYouStartText } from './fr/before-you-start.ts'
import { solverAboutText } from './fr/solver-about.ts'
import type { MethodText } from './method-text.ts'

const colourNames: Record<ColourKey, string> = {
  W: 'blanc',
  Y: 'jaune',
  R: 'rouge',
  O: 'orange',
  B: 'bleu',
  G: 'vert',
}

const faceNames = ['Haut', 'Droite', 'Avant', 'Bas', 'Gauche', 'Arrière']

/** The faces as full phrases, in the order of `faceNames`. */
const faceLabels = [
  'Face du haut',
  'Face de droite',
  'Face avant',
  'Face du bas',
  'Face de gauche',
  'Face arrière',
]

/** The text of every method, in the order of `METHOD_IDS`. */
const methods: Record<MethodId, MethodText> = {
  beginner: beginnerText,
  keyhole: keyholeText,
  cfop: cfopText,
  roux: rouxText,
  zz: zzText,
  petrus: petrusText,
}

/** French uses the singular for 0 and 1. */
const plural = (count: number, one: string, many: string) => (count < 2 ? one : many)

export const fr: Messages = {
  site: {
    name: 'Cubewise',
    tagline: 'Résolvez votre cube et apprenez à le faire en même temps.',
    description:
      'Saisissez les couleurs de votre Rubik’s Cube 3×3 mélangé et obtenez en quelques secondes une solution courte et animée. Apprenez ensuite à le résoudre vous-même, étape par étape.',
    nav: { solver: 'Solveur', learn: 'Apprendre', history: 'Historique' },
    menu: { open: 'Ouvrir le menu', close: 'Fermer le menu' },
    language: 'Langue',
    theme: { label: 'Thème', system: 'Comme votre appareil', light: 'Clair', dark: 'Sombre' },
    footer: 'Fait pour ceux qui ont un cube mélangé sur leur bureau.',
    builtBy: 'Créé par',
    author: 'Ahmed Zougari',
    notFound: {
      title: 'Page introuvable',
      body: 'Cette page n’existe pas. Le solveur, lui, est toujours là.',
      action: 'Aller à la page d’accueil',
    },
  },

  colourNames,
  faceNames,

  home: {
    title: 'Cubewise : résoudre un Rubik’s Cube avec le solveur et les leçons',
    heading: 'Résolvez votre cube et apprenez à le faire en même temps.',
    lead: 'Saisissez les couleurs de votre cube 3×3 mélangé et regardez-le se résoudre, mouvement par mouvement. Quand vous serez prêt, apprenez la méthode et résolvez-le vous-même.',
    solveAction: 'Résoudre mon cube',
    learnAction: 'Apprendre à le résoudre',
    cubeAlt: 'Un cube 3×3 résolu',
    load3d: 'Touchez pour charger le cube en 3D',
    /** Short reassurances under the hero buttons. */
    perks: ['Gratuit', 'Sans compte', 'Résolu dans votre navigateur'],
    how: {
      heading: 'Comment ça marche',
      steps: [
        {
          title: 'Saisissez vos couleurs',
          body: 'Tenez votre cube et recopiez ses couleurs, une face à la fois. Au clavier, appuyez sur un numéro d’autocollant puis sur une lettre de couleur. Sur un téléphone, choisissez une couleur et touchez l’autocollant.',
        },
        {
          title: 'Obtenez la solution',
          body: 'Cubewise vérifie que le cube ne contient pas d’erreur, puis le résout dans votre navigateur. Choisissez la solution courte, d’environ 21 mouvements, ou une méthode que vous apprenez, résolue étape par étape.',
        },
        {
          title: 'Suivez pas à pas',
          body: 'Jouez la solution sur un cube en 3D, mettez-la en pause, ou avancez un mouvement à la fois pendant que vous tournez le cube dans vos mains.',
        },
      ],
    },
    roadmap: {
      heading: 'Par où commencer, et où aller ensuite',
      lead: 'Chaque méthode enseignée par Cubewise est un arrêt sur cette route, et le solveur peut résoudre votre cube avec n’importe laquelle. Faites les premiers arrêts dans l’ordre. Là où la route bifurque, les méthodes sont des alternatives : choisissez celle qui vous convient, inutile de toutes les apprendre.',
      /** Signs on the road: where it starts, where it forks, and between two methods that are alternatives. */
      signs: { start: 'Départ', fork: 'Puis une au choix', or: 'ou' },
      moves: (count: number) => `environ ${count} ${plural(count, 'mouvement', 'mouvements')}`,
      action: 'Voir les étapes',
      movesNote: 'Les nombres de mouvements sont à peu près ceux du solveur de Cubewise avec chaque méthode.',
      allMethods: 'Voir toutes les méthodes',
    },
    learn: {
      heading: 'Apprenez la méthode débutant',
      lead: 'La méthode débutant résout le cube couche par couche, en sept étapes. Chaque étape a un seul but et seulement quelques séquences à retenir.',
      action: 'Voir toutes les étapes',
    },
    faq: {
      heading: 'Questions et réponses',
      items: [
        {
          question: 'Tout cube mélangé peut-il être résolu ?',
          answer:
            'Oui, à condition qu’il ait été mélangé en tournant ses faces. Un tel cube peut toujours être résolu en 20 mouvements ou moins. Si un coin a été pivoté à la main, ou si le cube a été démonté et mal remonté, il peut être impossible à résoudre, et Cubewise vous le dira.',
        },
        {
          question: 'Combien de mouvements comptera la solution ?',
          answer:
            'En général 21 ou moins, et parfois 22. La solution la plus courte possible ne demande jamais plus de 20 mouvements, mais la trouver exactement prend beaucoup plus de temps que d’en trouver une presque aussi courte.',
        },
        {
          question: 'Le site dit que mon cube ne peut pas être résolu. Que faire ?',
          answer:
            'Presque toujours, un ou deux autocollants ont été mal saisis. Cubewise met en évidence les autocollants qu’il soupçonne. Comparez-les avec votre cube, corrigez-les et appuyez de nouveau sur Résoudre.',
        },
        {
          question: 'Mon cube a d’autres couleurs. Est-ce que ça marchera quand même ?',
          answer:
            'Oui. Coloriez le centre de chaque face avec une couleur différente pour reproduire votre cube, puis coloriez le reste. N’importe quelles six couleurs conviennent, tant que vous utilisez toujours la même pour la même couleur.',
        },
        {
          question: 'Faut-il un compte, et des données sont-elles envoyées ?',
          answer:
            'Non. Il n’y a pas de compte, et le cube est résolu dans votre propre navigateur. Vos couleurs ne sont enregistrées que sur votre appareil, pour que vous ne les perdiez pas en actualisant la page.',
        },
        {
          question: 'Que signifient les lettres de la solution ?',
          answer:
            'Chaque lettre est une face, d’après son nom anglais : R (« right ») droite, L (« left ») gauche, U (« up ») haut, D (« down ») bas, F (« front ») avant, B (« back ») arrière. Une lettre seule signifie un quart de tour dans le sens horaire quand vous regardez cette face, une apostrophe signifie le sens antihoraire, et un 2 signifie un demi-tour.',
        },
      ],
    },
    closing: {
      heading: 'Prenez votre cube',
      body: 'Saisissez ses couleurs et suivez la solution mouvement par mouvement, ou ouvrez la première leçon et apprenez à le résoudre vous-même.',
      learnAction: 'Commencer la méthode débutant',
    },
  },

  solver: {
    title: 'Solveur de Rubik’s Cube 3×3 : solution pas à pas | Cubewise',
    description:
      'Solveur de Rubik’s Cube 3×3 gratuit en ligne. Saisissez vos couleurs ou scannez le cube à la caméra, puis suivez une solution courte ou votre méthode.',
    heading: 'Solveur de Rubik’s Cube',
    lead: 'Recopiez les couleurs de votre cube 3×3 mélangé, une face à la fois, ou scannez-le avec votre caméra. Appuyez ensuite sur Résoudre et suivez les mouvements.',
    /** The text under the tool. */
    about: solverAboutText,
    loading3d: 'Chargement du cube en 3D…',

    entry: {
      colours: 'Couleurs',
      coloursHint: 'Choisissez une couleur, puis cliquez sur des autocollants de la face avant.',
      paletteLabel: (colour: ColourKey, count: number) =>
        `${colourNames[colour]}, ${count} sur 9 ${plural(count, 'colorié', 'coloriés')}`,
      keyboard: 'Clavier',
      keyboardSteps: [
        { keys: ['1', '–', '9'], text: 'choisir un autocollant de la face avant' },
        { keys: ['W', 'Y', 'R', 'O', 'B', 'G'], text: 'le colorier et passer au suivant' },
        { keys: ['←', '↑', '↓', '→'], text: 'amener une autre face à l’avant' },
      ],
      allFaces: 'Les six faces',
      allFacesHint: 'Cliquez sur une face pour l’amener à l’avant.',
      stickerLabel: (face: number, number: number, colour: ColourKey | null) =>
        `${faceLabels[face]}, autocollant ${number}, ${colour === null ? 'non colorié' : colourNames[colour]}`,
      turn: {
        left: 'Afficher la face de gauche',
        right: 'Afficher la face de droite',
        up: 'Afficher la face du haut',
        down: 'Afficher la face du bas',
      },
      undo: 'Annuler',
      redo: 'Rétablir',
      clearFace: 'Effacer la face',
      reset: 'Réinitialiser le cube',
      solve: 'Résoudre',
      solving: 'Résolution…',
    },

    scan: {
      open: 'Scanner avec la caméra',
      heading: 'Scannez votre cube',
      progress: (face: number) => `Face ${face} sur 6`,
      steps: [
        'Montrez une face du cube à la caméra. C’est la face avant. Repérez quelle face est en haut.',
        'Tournez le cube pour que la face de droite vienne à l’avant. Gardez la même face en haut.',
        'Tournez-le encore dans le même sens, jusqu’à la face latérale suivante.',
        'Tournez-le une dernière fois dans le même sens, jusqu’à la dernière face latérale.',
        'Maintenant, basculez le cube pour que la face du haut vienne à l’avant.',
        'Basculez-le dans l’autre sens, de deux quarts de tour, pour que la face du bas vienne à l’avant.',
      ],
      tips: 'Utilisez un éclairage uniforme et évitez les reflets. Tenez la face droite, bien en face de la caméra : elle est capturée automatiquement dès qu’elle est trouvée et tenue immobile. Si le cube n’est pas trouvé, alignez la face sur le carré et appuyez sur Capturer.',
      starting: 'Démarrage de la caméra…',
      looking: 'Recherche du cube…',
      holdStill: 'Ne bougez plus…',
      turnNow: 'Capturée. Tournez maintenant le cube.',
      capture: 'Capturer',
      retake: 'Reprendre la dernière face',
      cancel: 'Annuler',
      tryAgain: 'Réessayer',
      videoLabel: 'Image de la caméra ; une grille est tracée sur la face du cube dès qu’elle est trouvée',
      reviewHeading: 'Vérifiez les couleurs',
      check: 'Comparez chaque face avec sa photo. Si un autocollant est faux, choisissez sa couleur ci-dessous, puis touchez l’autocollant.',
      pictureLabel: (face: number) => `La photo prise de la face ${face}`,
      checkSticker: (face: number, number: number, colour: ColourKey) =>
        `Face ${face}, autocollant ${number}, ${colourNames[colour]}`,
      use: 'Utiliser ces couleurs',
      again: 'Scanner à nouveau',
      done: 'Scan terminé. Comparez les couleurs avec votre cube, corrigez celles qui sont fausses, puis appuyez sur Résoudre.',
      copyReport: 'Copier le rapport de scan',
      reportCopied: 'Copié',
      guide: {
        open: 'Comment scanner',
        title: 'Comment scanner votre cube',
        intro: 'Vous montrez à la caméra une face à la fois, six en tout. Tenez chaque face immobile jusqu’à voir la coche, puis tournez le cube.',
        laptop: {
          title: 'Sur un ordinateur portable',
          picture: 'Une personne face à un ordinateur portable lève un cube devant sa caméra, reste immobile, puis tourne le cube jusqu’à la face suivante, six fois.',
          hold: 'Asseyez-vous face à l’écran et levez le cube devant la webcam, une face bien à plat vers elle.',
        },
        phone: {
          title: 'Sur un téléphone',
          picture: 'Une personne tient un téléphone dans une main et un cube dans l’autre, pointe la caméra arrière vers le cube, puis tourne le cube jusqu’à la face suivante, six fois.',
          hold: 'Tenez le téléphone dans une main et le cube dans l’autre, à environ une largeur de main l’un de l’autre. Tournez le cube, pas le téléphone.',
        },
        stepsTitle: 'Les six faces, dans l’ordre',
        steps: [
          'Montrez la face avant.',
          'Tournez le cube jusqu’à la face latérale suivante.',
          'Tournez-le encore dans le même sens.',
          'Et encore une fois, pour la dernière face latérale.',
          'Basculez le cube pour montrer la face du haut.',
          'Basculez-le complètement dans l’autre sens pour montrer la face du bas.',
        ],
        light: 'Une lumière venant du côté convient le mieux. Une lampe juste au-dessus fait briller les autocollants.',
        close: 'Compris',
      },
      errors: {
        unsupported: 'Ce navigateur ne peut pas utiliser la caméra. Saisissez plutôt les couleurs à la main.',
        denied: 'La caméra a été bloquée. Autorisez l’accès à la caméra pour ce site dans votre navigateur, puis réessayez.',
        missing: 'Aucune caméra n’a été trouvée sur cet appareil.',
        failed: 'La caméra n’a pas pu démarrer. Fermez les autres applications qui l’utilisent, puis réessayez.',
      },
    },

    method: {
      label: 'Méthode',
      short: 'Solution courte',
      shortHint: 'Environ 21 mouvements. Le chemin le plus rapide vers un cube résolu, sans étapes à suivre.',
      methodsGroup: 'Méthodes que vous pouvez apprendre',
    },

    problems: {
      title: 'Ce cube ne peut pas encore être résolu',
      unpainted: (count: number) =>
        `${count} ${plural(count, 'autocollant n’a', 'autocollants n’ont')} pas encore de couleur.`,
      'wrong-sticker-count': 'Il manque des autocollants au cube. Réinitialisez-le et saisissez de nouveau les couleurs.',
      'duplicate-centres':
        'Deux centres ont la même couleur. Chaque face doit avoir un centre d’une couleur différente.',
      'unknown-colour':
        'Les autocollants mis en évidence ont une couleur qu’aucun centre ne porte. Vérifiez-les, ou recoloriez un centre.',
      'wrong-colour-count': (wrong: { colour: ColourKey; count: number }[]) =>
        `Chaque couleur doit apparaître 9 fois. Pour l’instant : ${wrong
          .map(({ colour, count }) => `${colourNames[colour]} ${count}`)
          .join(', ')}.`,
      'impossible-piece':
        'La pièce mise en évidence n’existe sur aucun cube. Au moins un de ses autocollants est faux.',
      'duplicate-piece':
        'La même pièce apparaît deux fois. Au moins un des autocollants mis en évidence est faux.',
      'twisted-corner':
        'Toutes les pièces sont là, mais un coin est pivoté. Vérifiez les autocollants des coins ; sinon, un coin a été pivoté à la main sur le vrai cube.',
      'flipped-edge':
        'Toutes les pièces sont là, mais une arête est retournée. Vérifiez si deux couleurs ont été échangées sur les autocollants des arêtes.',
      'swapped-pieces':
        'Toutes les pièces sont là, mais deux pièces sont échangées. Vérifiez si deux autocollants ont été saisis l’un à la place de l’autre.',
      failed: 'Une erreur s’est produite pendant la résolution. Veuillez réessayer.',
    },

    report: {
      question: 'Un problème ?',
      action: 'Signalez-le',
    },

    playback: {
      heading: 'Solution',
      moveCount: (count: number) => `${count} ${plural(count, 'mouvement', 'mouvements')}`,
      alreadySolved: 'Ce cube est déjà résolu. Rien à faire !',
      hold: (front: ColourKey, up: ColourKey) =>
        `Tenez votre cube avec le centre ${colourNames[front]} face à vous et le centre ${colourNames[up]} en haut.`,
      progress: (done: number, total: number) => `Mouvement ${done} sur ${total}`,
      play: 'Lecture',
      pause: 'Pause',
      back: 'Reculer d’un pas',
      forward: 'Avancer d’un pas',
      restart: 'Revenir au début',
      pauseLabel: 'Pause entre les mouvements',
      pauseValue: (pauseMs: number) =>
        pauseMs === 0 ? 'Aucune' : `${(pauseMs / 1000).toFixed(1).replace('.', ',')} s`,
      edit: 'Modifier le cube',
      done: 'Résolu !',
      keys: [
        { keys: ['Espace'], text: 'lecture ou pause' },
        { keys: ['←', '→'], text: 'un mouvement en arrière ou en avant' },
        { keys: ['E'], text: 'modifier le cube' },
      ],
      notation:
        'Une lettre est un quart de tour dans le sens horaire quand vous regardez cette face (d’après l’anglais : R droite, L gauche, U haut, D bas, F avant, B arrière). Une apostrophe signifie le sens antihoraire, et 2 signifie un demi-tour.',
      wholeCubeNotation:
        'Un x, y ou z en pointillés signifie tourner le cube entier, pas une face : x comme tourne R, y comme tourne U, z comme tourne F.',
      wideNotation:
        'Une lettre minuscule est une rotation large : cette face et la couche du milieu derrière elle, ensemble. M, E et S tournent une couche du milieu seule : M comme tourne L, E comme tourne D, S comme tourne F.',
      lesson: 'Leçon',
      stageDone: 'Déjà fait.',
    },
  },

  history: {
    title: 'Votre historique des résolutions | Cubewise',
    description:
      'Les cubes que vous avez résolus avec Cubewise, conservés dans ce navigateur. Rouvrez-en un dans le solveur, copiez sa solution ou supprimez-le.',
    heading: 'Historique des résolutions',
    lead: (limit: number) =>
      `Chaque cube que vous résolvez est conservé ici avec sa solution, du plus récent au plus ancien. L’historique reste dans ce navigateur et n’est jamais envoyé. Seules les ${limit} dernières résolutions sont conservées.`,
    count: (count: number) => `${count} ${plural(count, 'résolution', 'résolutions')}`,
    netLabel: 'Les six faces du cube tel qu’il a été saisi',
    replay: 'Rejouer dans le solveur',
    showSolution: 'Afficher la solution',
    hideSolution: 'Masquer la solution',
    copy: 'Copier la solution',
    copied: 'Copié',
    copyFailed: 'Copie impossible',
    delete: 'Supprimer',
    empty: {
      heading: 'Aucune résolution pour l’instant',
      body: 'Résolvez un cube dans le solveur et il apparaîtra ici.',
      action: 'Ouvrir le solveur',
    },
    clear: {
      action: 'Effacer l’historique',
      title: 'Effacer votre historique des résolutions ?',
      body: (count: number) =>
        `${plural(count, 'La seule résolution sera supprimée', `Les ${count} résolutions seront supprimées`)} de ce navigateur. Cette action est irréversible.`,
      confirm: 'Effacer l’historique',
      cancel: 'Annuler',
    },
    fromSolver: 'Voir votre historique des résolutions',
  },

  methods,

  learn: {
    title: 'Apprendre à résoudre un Rubik’s Cube : choisissez une méthode | Cubewise',
    description:
      'Des leçons pour apprendre à résoudre le Rubik’s Cube 3×3, de la méthode débutant à CFOP, Roux et ZZ. Choisissez une méthode et apprenez-la étape par étape.',
    heading: 'Apprenez à résoudre le cube',
    lead: 'Il y a plus d’une façon de résoudre un cube. Choisissez une méthode et apprenez-la étape par étape : chaque étape a un seul but, des images de ce qu’il faut repérer et des séquences que vous pouvez voir en 3D.',
    methodsHeading: 'Choisissez une méthode',
    stageCount: (count: number) => `${count} ${plural(count, 'étape', 'étapes')}`,
    progress: (done: number, total: number) =>
      `${done} sur ${total} ${plural(done, 'terminée', 'terminées')}`,
    stageNumber: (number: number) => `Étape ${number}`,
    suggestUpdate: 'Proposer une modification',
    beforeYouStart: beforeYouStartText,
    method: {
      pageTitle: (name: string) =>
        `${name} : apprendre à résoudre le Rubik’s Cube étape par étape | Cubewise`,
      allMethods: 'Toutes les méthodes',
      stagesHeading: 'Les étapes',
    },
    practice: {
      heading: 'Entraînez-vous sur votre cube',
      body: (name: string) =>
        `Dans le solveur, choisissez « ${name} » comme méthode. Il résout votre cube selon ces mêmes étapes, pour que vous puissiez suivre chacune avec le cube dans les mains.`,
      action: 'Ouvrir le solveur',
    },
    lesson: {
      pageTitle: (name: string, method: string, number: number) =>
        `${name} : ${method}, étape ${number} | Cubewise`,
      allStages: 'Toutes les étapes',
      backToStages: (method: string) => `${method} : toutes les étapes`,
      stageOf: (number: number, total: number) => `Étape ${number} sur ${total}`,
      goal: 'But',
      steps: 'Comment faire',
      cases: 'À quoi ça ressemble',
      tip: 'Astuce',
      watch: 'Voir en 3D',
      copyMarkdown: 'Copier en Markdown',
      markdownCopied: 'Copié',
      markdownCopyFailed: 'Copie impossible',
      /** Before the address of the lesson, on the last line of the copied Markdown. */
      markdownSource: 'Source :',
      markComplete: 'Marquer comme terminée',
      completed: 'Terminée',
      tryIt: 'Essayez sur votre cube',
      notation:
        'Lire les mouvements : une lettre est un quart de tour dans le sens horaire quand vous regardez cette face (d’après l’anglais : R droite, L gauche, U haut, D bas, F avant, B arrière). Une apostrophe signifie le sens antihoraire, et 2 signifie un demi-tour. Dans les images, les autocollants gris sont ceux qui ne comptent pas encore.',
      wideNotation:
        'Une lettre minuscule (r, u, f) est une rotation large : cette face et la couche du milieu derrière elle, ensemble. M, E et S tournent une couche du milieu seule : M comme tourne L, E comme tourne D, S comme tourne F. x, y et z tournent le cube entier : x comme tourne R, y comme tourne U, z comme tourne F.',
    },
  },
}
