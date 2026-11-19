/** The text of "Before you start": what every method needs, for someone who has never solved a cube. */
import type { LessonPart } from '../method-text.ts'

const parts: LessonPart[] = [
  {
    title: 'Le cube est fait de pièces',
    body: [
      'Ne voyez pas le cube comme 54 autocollants. Il est fait de 26 pièces, et les autocollants d’une même pièce restent toujours ensemble.',
      'Un centre est le milieu d’une face et porte un seul autocollant. Il y en a 6. Les centres ne changent jamais de place : sur la plupart des cubes, le jaune est toujours à l’opposé du blanc, le rouge à l’opposé de l’orange et le bleu à l’opposé du vert. Le centre vous dit donc de quelle couleur sera toute sa face quand le cube sera résolu.',
      'Une arête se trouve entre deux centres et porte deux autocollants. Il y en a 12. Un coin porte trois autocollants. Il y en a 8. Une arête ne peut jamais aller à la place d’un coin, ni un coin à la place d’une arête.',
    ],
    cases: ['pieces'],
  },
  {
    title: 'Comment tenir le cube',
    body: [
      'Trouvez le centre jaune et mettez-le en haut. Le centre blanc est alors en dessous. Tournez le cube entier, en gardant le jaune en haut, jusqu’à ce que le centre vert soit face à vous.',
      'Les leçons commencent par le blanc parce que c’est ce que font la plupart des gens. Ce n’est qu’une habitude : toutes les méthodes fonctionnent de la même façon à partir de n’importe quelle couleur. Le blanc va en dessous pour que vous puissiez regarder le haut du cube pendant que vous travaillez.',
      'Toutes les images des leçons partent de cette façon de tenir le cube. Une image montre trois faces : le haut, l’avant et la droite. Les trois autres sont cachées.',
    ],
    cases: ['hold', 'hidden'],
  },
  {
    title: 'Les six faces et leurs lettres',
    body: [
      'Chaque face a une lettre, tirée de son nom anglais. La lettre dépend de l’endroit où se trouve la face quand vous tenez le cube, pas de sa couleur : U (« up ») est le haut, D (« down ») le bas, R (« right ») la droite, L (« left ») la gauche, F (« front ») l’avant et B (« back ») l’arrière.',
      'Quand le cube est tenu de la façon habituelle, U est la face jaune, D la blanche, F la verte, B la bleue, R l’orange et L la rouge. Si vous tournez le cube entier, les lettres restent où elles sont : F est toujours la face tournée vers vous, quelle que soit sa couleur.',
      'Une face a neuf pièces : son centre, quatre arêtes et quatre coins. Quand la face tourne, les neuf tournent ensemble.',
    ],
    cases: ['up-down', 'right-left', 'front-back'],
  },
  {
    title: 'Lire les mouvements',
    body: [
      'Un mouvement est une rotation d’une seule face. Il s’écrit avec la lettre de cette face.',
      'Une lettre seule, comme R, est un quart de tour dans le sens horaire. Avec une apostrophe, comme R’, c’est un quart de tour dans le sens antihoraire. Avec un 2, comme R2, c’est un demi-tour, et le sens n’a alors aucune importance.',
      'Le sens horaire s’entend comme si vous regardiez cette face bien en face. C’est là que la plupart des débutants se trompent. Pour U, R et F, c’est facile. Pour L, D et B, imaginez que vous regardez le cube depuis la gauche, par en dessous ou par derrière. Ainsi R et L vont tous les deux dans le sens horaire, et pourtant, à l’avant du cube, R monte et L descend.',
      'Appuyez sur « Voir en 3D » sous une image pour voir ses mouvements joués, et faites-les en même temps sur votre cube.',
      'Certaines méthodes utilisent aussi des lettres minuscules comme r, les lettres M, E et S, ainsi que x, y et z. Ce sont des rotations larges, des rotations de tranche et des rotations du cube entier. Elles sont expliquées dans les leçons qui s’en servent.',
    ],
    cases: ['three-ways', 'right', 'left', 'down', 'back'],
  },
  {
    title: 'Les trois couches',
    body: [
      'Tenu de la façon habituelle, le cube a trois couches, l’une au-dessus de l’autre. La couche du haut est tout ce qui tourne avec U. La couche du bas est tout ce qui tourne avec D. La couche du milieu est ce qui reste entre les deux : quatre arêtes et les quatre centres qui font le tour du cube.',
      'Beaucoup de méthodes résolvent le cube une couche à la fois. La couche résolue en premier s’appelle la première couche, et celle résolue en dernier, la dernière couche. Dans ces leçons, la première couche est celle du bas, avec le blanc, et la dernière couche est celle du haut, avec le jaune.',
      'Une couche n’est résolue que si ses pièces sont aussi assorties aux centres qui font le tour du cube. Une face d’une seule couleur ne suffit pas.',
    ],
    cases: ['first-layer', 'two-layers'],
  },
  {
    title: 'Entraînez-vous à suivre une séquence',
    body: [
      'Une séquence est une suite fixe de mouvements qui accomplit une seule tâche. Elle s’écrit comme une ligne de mouvements, qui se lit de gauche à droite.',
      'Essayez celle-ci : R U R’ U’. Dites-la en la faisant : la face de droite monte, le haut va vers la gauche, la face de droite descend, le haut va vers la droite.',
      'Vous pouvez vous entraîner sur n’importe quel cube, mélangé ou non. Faites les quatre mouvements six fois et le cube revient exactement comme il était. Sinon, c’est qu’un mouvement est parti dans le mauvais sens. Le plus souvent, ce sont U et U’ qui ont été confondus.',
    ],
    cases: ['practice'],
  },
]

const cases: Record<string, { title: string; body: string }> = {
  pieces: {
    title: 'Un centre, une arête et un coin',
    body: 'Les centres sont colorés, comme toujours dans ces images. Une arête est montrée, avec ses deux autocollants (jaune et vert), ainsi qu’un coin, avec ses trois autocollants (jaune, vert et orange). Tout le reste est gris : dans les leçons, les autocollants gris sont ceux qui ne comptent pas encore.',
  },
  hold: {
    title: 'Le jaune en haut, le vert face à vous',
    body: 'Seuls les centres sont colorés. Le jaune est en haut, le vert à l’avant et l’orange à droite.',
  },
  hidden: {
    title: 'Les trois faces cachées',
    body: 'Le même cube, retourné et tourné pour montrer les faces que l’autre image cache : la blanche, qui était en dessous, la rouge, qui était à gauche, et la bleue, qui était à l’arrière. Ici, le blanc est en haut, le rouge à l’avant et le bleu à droite.',
  },
  'up-down': {
    title: 'U et D : le haut et le bas',
    body: 'Les pièces de la face du haut et de la face du bas sont colorées. La face du bas elle-même est en dessous, mais on en voit le bord : la rangée du bas de la face avant et de la face de droite. Les autocollants gris entre les deux n’appartiennent à aucune de ces deux faces.',
  },
  'right-left': {
    title: 'R et L : la droite et la gauche',
    body: 'La face de droite est la face orange. La face de gauche est cachée, mais on en voit le bord : la colonne de gauche de la face du haut et de la face avant. La bande grise au milieu n’appartient à aucune de ces deux faces.',
  },
  'front-back': {
    title: 'F et B : l’avant et l’arrière',
    body: 'La face avant est la face verte. La face arrière est cachée, mais on en voit le bord : la rangée arrière de la face du haut et la colonne arrière de la face de droite. La bande grise entre les deux n’appartient à aucune de ces deux faces.',
  },
  'three-ways': {
    title: 'R, R’ et R2',
    body: 'La face de droite fait un quart de tour dans le sens horaire, puis un quart de tour dans le sens antihoraire, ce qui la remet en place, puis un demi-tour.',
  },
  right: {
    title: 'R : sens horaire, vu de la droite',
    body: 'La face de droite est visible, on la voit donc tourner dans le sens horaire. Les trois autocollants verts à droite de la face avant montent vers le haut.',
  },
  left: {
    title: 'L : sens horaire, vu de la gauche',
    body: 'La face de gauche est cachée, regardez donc l’avant. Les trois autocollants verts à gauche de la face avant descendent, et trois jaunes descendent du haut pour les remplacer. C’est le contraire de R, alors que les deux mouvements vont dans le sens horaire.',
  },
  down: {
    title: 'D : sens horaire, vu d’en dessous',
    body: 'La rangée du bas de la face avant passe sur la face de droite. U fait le contraire : il envoie la rangée du haut de la face avant vers la gauche.',
  },
  back: {
    title: 'B : sens horaire, vu de derrière',
    body: 'Vu de l’avant, on dirait le sens antihoraire. Les trois autocollants orange à l’arrière de la face de droite montent vers la rangée arrière du haut.',
  },
  'first-layer': {
    title: 'La première couche résolue',
    body: 'La couche du bas est colorée. Sa face blanche est en dessous, hors de vue. Ce que l’on voit, c’est la rangée du bas de la face avant et de la face de droite, chacune assortie au centre situé au-dessus : du vert sous le vert, de l’orange sous l’orange.',
  },
  'two-layers': {
    title: 'Deux couches résolues',
    body: 'La couche du bas et la couche du milieu sont colorées, et la couche du haut est grise. Il ne reste que la dernière couche à résoudre.',
  },
  practice: {
    title: 'R U R’ U’, six fois',
    body: 'Les quatre mouvements sont joués six fois sur un cube résolu. Il se mélange de plus en plus, puis redevient résolu au dernier mouvement.',
  },
}

export const beforeYouStartText = {
  name: 'Avant de commencer',
  title: 'Avant de commencer : les bases du Rubik’s Cube pour débutants | Cubewise',
  description:
    'Vous n’avez jamais résolu un Rubik’s Cube ? Découvrez les pièces, comment tenir le cube, les lettres des six faces et comment lire les mouvements comme R, U’ et F2, avec des images à jouer en 3D.',
  lead: 'Cette page est pour vous si vous n’avez jamais résolu un cube. Elle couvre ce dont toutes les méthodes ont besoin : les pièces, comment tenir le cube, le nom des faces et la lecture des mouvements. Lisez-la avec votre cube dans les mains.',
  parts,
  cases,
  next: {
    heading: 'Et ensuite ?',
    body: 'C’est tout ce qu’il vous faut pour commencer. La méthode débutant résout le cube couche par couche, une étape à la fois, en commençant par la croix.',
    action: 'Commencer la méthode débutant',
    allMethods: 'Voir toutes les méthodes',
  },
  /** The card on the list of methods. */
  card: {
    heading: 'Vous découvrez le cube ? Commencez ici',
    body: 'Une courte page sur ce dont toutes les méthodes ont besoin : les pièces, comment tenir le cube, les lettres des faces et la lecture des mouvements.',
    action: 'Avant de commencer',
  },
  /** One line on other pages, for people who land there first: a question, then the link. */
  pointer: {
    question: 'Vous découvrez le cube ?',
    link: '« Avant de commencer » explique les pièces, les faces et la lecture des mouvements.',
  },
}
