/** The text under the solver, in French. Its shape and its facts are those of `en/solver-about.ts`. */
import type { SolverAboutText } from '../en/solver-about.ts'

export const solverAboutText: SolverAboutText = {
  what: {
    heading: 'Ce que fait ce solveur de cube',
    body: [
      'Cubewise résout un Rubik’s Cube 3×3 mélangé à partir de ses couleurs. Recopiez les couleurs de votre cube sur celui de cette page, ou scannez-les avec une caméra, puis appuyez sur Résoudre. La solution est jouée sur un cube en 3D, un mouvement à la fois, pendant que vous faites les mêmes mouvements sur votre cube.',
      'C’est gratuit, sans compte, et tout se passe dans votre navigateur. Demandez une solution courte, d’environ 21 mouvements, ou une solution qui suit la méthode que vous apprenez, avec les mêmes étapes que les leçons.',
    ],
  },

  enter: {
    heading: 'Comment saisir votre cube',
    body: [
      'La page montre une face à la fois, la face avant, avec ses autocollants numérotés de 1 à 9. Le patron montre les six faces en même temps. Les centres suivent au départ le schéma de couleurs standard, blanc en haut et vert devant : tenez votre cube de la même façon et recopiez ce que vous voyez.',
    ],
    parts: [
      {
        title: 'À la souris ou au doigt',
        body: [
          'Choisissez une couleur, puis cliquez ou touchez chaque autocollant de la face avant qui la porte. Les flèches autour du cube amènent une autre face devant. Sous chaque couleur, un compteur indique combien d’autocollants l’ont déjà : un cube complet en a neuf de chaque.',
        ],
      },
      {
        title: 'Au clavier',
        body: [
          'Appuyez sur un numéro d’autocollant, de 1 à 9, puis sur une touche de couleur : W, Y, R, O, B ou G, les initiales des couleurs en anglais. Le curseur passe tout seul à l’autocollant suivant qui n’a pas de couleur. Les flèches du clavier amènent une autre face devant, Ctrl+Z annule et Entrée lance la résolution.',
        ],
      },
      {
        title: 'Avec la caméra',
        body: [
          'Appuyez sur « Scanner avec la caméra » et montrez le cube une face à la fois, en le tournant comme la page le demande. Chaque face est capturée toute seule dès que vous la tenez immobile. À la fin, comparez les six faces aux photos prises et corrigez les autocollants mal lus.',
        ],
      },
    ],
    tips: {
      title: 'Bien saisir les couleurs',
      items: [
        'Gardez la même face en haut pendant que vous faites le tour des quatre faces latérales.',
        'Regardez d’abord le centre. Il ne bouge jamais : il vous dit quelle face vous avez sous les yeux.',
        'Le rouge et l’orange, ou le blanc et le jaune, se confondent facilement. Choisissez une lumière uniforme et, pour un scan, évitez les reflets.',
        'Si votre cube a un autre schéma de couleurs, recoloriez d’abord les centres.',
      ],
    },
  },

  solutions: {
    heading: 'Deux sortes de solution',
    body: [
      'Choisissez la sorte de solution sous « Méthode » avant d’appuyer sur Résoudre.',
    ],
    parts: [
      {
        title: 'La solution courte',
        body: [
          'Elle vise le moins de mouvements possible : environ 21, quel que soit le mélange. C’est le chemin le plus rapide vers un cube résolu, mais elle n’a ni étapes ni logique qu’une personne pourrait suivre.',
        ],
      },
      {
        title: 'Une solution selon la méthode que vous apprenez',
        body: [
          'Une solution par méthode résout votre cube comme le ferait une personne, étape par étape, avec les séquences mêmes que les leçons enseignent. Elle est plus longue, mais vous voyez pourquoi chaque mouvement est fait, et chaque étape renvoie à sa leçon. Le solveur propose toutes les méthodes enseignées sur Cubewise :',
        ],
      },
    ],
    startAction: 'Commencer par la méthode débutant',
    allMethods: 'Comparer toutes les méthodes',
  },

  reading: {
    heading: 'Comment lire les mouvements',
    body: [
      'Chaque lettre est une face, d’après son nom anglais : R droite, L gauche, U haut, D bas, F avant, B arrière. Une lettre seule, comme R, est un quart de tour dans le sens horaire quand vous regardez cette face. R’ est le même quart de tour dans le sens antihoraire, et R2 est un demi-tour.',
      'Avant le premier mouvement, le solveur vous dit comment tenir le cube : quel centre est face à vous et lequel est en haut. Vous pouvez ensuite jouer la solution, la mettre en pause, ou reculer et avancer d’un mouvement.',
    ],
    action: 'Tout cela est nouveau pour vous ? Lisez « Avant de commencer »',
  },

  how: {
    heading: 'Comment fonctionne le solveur',
    body: [
      'La solution courte vient de notre propre implémentation de l’algorithme en deux phases de Kociemba. La première phase amène le cube dans un état que l’on peut terminer avec seulement les faces du haut et du bas et des demi-tours des quatre autres. La seconde phase le termine. Les deux sont des recherches guidées par des tables précalculées.',
      'La première solution trouvée est en général un peu longue : le solveur continue donc de chercher. Il s’arrête quand il tient une solution de 21 mouvements ou moins, ou au bout d’environ un cinquième de seconde, et vous donne la plus courte qu’il a trouvée.',
      'Une solution par méthode est construite par le solveur propre à cette méthode, qui parcourt les étapes dans l’ordre et prend ses séquences dans la même table que les leçons.',
      'Tout cela tourne dans votre navigateur, dans un Web Worker, si bien que la page ne se fige pas. Rien n’est envoyé : ni vos couleurs, ni l’image de la caméra. Un scan lit les couleurs sur votre appareil, et les photos des six faces ne sont gardées que le temps de les vérifier.',
    ],
  },

  problems: {
    heading: 'Quand le cube ne peut pas être résolu',
    body: [
      'Avant de résoudre, Cubewise vérifie que vos couleurs forment un vrai cube. Sinon, il dit ce qui ne va pas et, quand il le peut, encadre en rouge les autocollants à regarder. La plupart des problèmes sont des étourderies : un autocollant sans couleur, une couleur utilisée plus ou moins de neuf fois, ou une pièce qui n’existe sur aucun cube, comme une arête à la fois blanche et jaune.',
      'Trois problèmes sont d’une autre nature : toutes les pièces sont là, et pourtant aucun mouvement ne peut résoudre le cube.',
    ],
    parts: [
      {
        title: 'Un coin pivoté',
        body: [
          'Un coin a tourné sur lui-même, à sa place. Comparez les autocollants de chaque coin avec votre cube. S’ils correspondent, un coin du vrai cube a été pivoté à la main, et il faut le faire pivoter dans l’autre sens.',
        ],
      },
      {
        title: 'Une arête retournée',
        body: [
          'Une arête a ses deux couleurs à l’envers. Presque toujours, ses deux autocollants ont été saisis l’un à la place de l’autre.',
        ],
      },
      {
        title: 'Deux pièces échangées',
        body: [
          'Deux pièces ont échangé leurs places. Cherchez deux autocollants saisis l’un à la place de l’autre. Si la saisie est juste, le vrai cube a été démonté et mal remonté.',
        ],
      },
    ],
  },

  faq: {
    heading: 'Questions sur le solveur',
    items: [
      {
        question: 'Résout-il le 2×2, le 4×4 ou d’autres casse-têtes ?',
        answer:
          'Pas pour l’instant. Le solveur ne fonctionne qu’avec le cube 3×3 standard.',
      },
      {
        question: 'L’image de ma caméra est-elle envoyée quelque part ?',
        answer:
          'Non. Les couleurs sont lues à l’intérieur de votre navigateur et rien n’est envoyé.',
      },
      {
        question: 'Pourquoi une solution par méthode est-elle tellement plus longue que la solution courte ?',
        answer:
          'Parce qu’elle est faite pour être suivie, pas pour être courte. La méthode débutant répète de nombreuses fois quelques séquences simples. Des méthodes comme CFOP et Roux demandent beaucoup moins de mouvements.',
      },
      {
        question: 'Puis-je utiliser le solveur sur un téléphone ?',
        answer:
          'Oui. Touchez les autocollants pour les colorier, ou scannez le cube avec la caméra du téléphone.',
      },
      {
        question: 'J’ai fait un mauvais mouvement en suivant la solution. Que faire ?',
        answer:
          'Si vous vous souvenez du mouvement, défaites-le sur votre cube et continuez. Si vous êtes perdu, appuyez sur « Modifier le cube », saisissez les couleurs telles qu’elles sont maintenant et résolvez de nouveau.',
      },
    ],
  },
}
