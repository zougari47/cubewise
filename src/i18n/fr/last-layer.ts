/**
 * Text for the last-layer cases that several methods share. The keys are the
 * names in `core/methods/shared/last-layer.ts`.
 */
import type {
  CornerOrientationName,
  PermutationName,
} from '../../core/methods/shared/last-layer.ts'

type CaseText = { title: string; body: string }

export const cornerOrientationCases: Record<CornerOrientationName, CaseText> = {
  sune: {
    title: 'Un coin regarde vers le haut (Sune)',
    body: 'Le dessus montre un poisson. Tenez le coin qui regarde vers le haut à l’avant gauche ; le coin à l’avant droit montre alors la couleur du haut sur l’avant. C’est la séquence la plus utile de la dernière couche.',
  },
  antisune: {
    title: 'Un coin regarde vers le haut, en miroir (Antisune)',
    body: 'L’autre poisson. Tenez le coin qui regarde vers le haut à l’arrière droit ; le coin à l’avant droit montre alors la couleur du haut sur son côté droit. C’est la première séquence jouée à l’envers.',
  },
  doubleSune: {
    title: 'Aucun coin ne regarde vers le haut, deux paires',
    body:
      'Deux coins montrent la couleur du haut à gauche et deux à droite. La séquence est la première faite deux fois, avec le milieu raccordé.',
  },
  wheel: {
    title: 'Aucun coin ne regarde vers le haut, une paire',
    body: 'Deux coins montrent la couleur du haut à gauche ; les deux autres la montrent à l’avant et à l’arrière.',
  },
  headlights: {
    title: 'Deux coins regardent vers le haut, avec des phares',
    body:
      'Les deux autres coins montrent la couleur du haut du même côté, comme une paire de phares. Tenez les phares à l’avant.',
  },
  chameleon: {
    title: 'Deux coins regardent vers le haut, côte à côte',
    body:
      'Les deux autres coins montrent la couleur du haut sur des côtés opposés. Tenez les deux coins terminés à droite.',
  },
  bowtie: {
    title: 'Deux coins regardent vers le haut, en diagonale',
    body:
      'Les deux coins terminés sont dans des coins opposés de la face du haut, comme un nœud papillon. Tenez-les à l’avant gauche et à l’arrière droit, avec la couleur du haut du coin avant droit face à vous.',
  },
}

export const permutationCases: Record<PermutationName, CaseText> = {
  Aa: {
    title: 'Trois coins tournent entre eux (A, sens horaire)',
    body: 'Les arêtes sont déjà à leur place, et un coin aussi. Les trois autres coins tournent entre eux, dans le sens horaire.',
  },
  Ab: {
    title: 'Trois coins tournent entre eux (A, sens antihoraire)',
    body: 'Les trois mêmes coins, qui tournent dans l’autre sens.',
  },
  E: {
    title: 'Les coins s’échangent deux à deux (E)',
    body: 'Les arêtes sont à leur place. Chaque coin s’échange avec son voisin d’en face : aucun côté ne montre deux coins de la même couleur.',
  },
  Ua: {
    title: 'Trois arêtes tournent entre elles (U, sens antihoraire)',
    body: 'Tous les coins sont à leur place et un côté est terminé. Tenez ce côté à l’arrière ; les trois autres arêtes tournent entre elles.',
  },
  Ub: {
    title: 'Trois arêtes tournent entre elles (U, sens horaire)',
    body: 'Les trois mêmes arêtes, qui tournent dans l’autre sens.',
  },
  H: {
    title: 'Les arêtes opposées s’échangent (H)',
    body: 'Tous les coins sont à leur place. Chaque arête s’échange avec celle d’en face. Le cas a le même aspect vu de chaque côté.',
  },
  Z: {
    title: 'Les arêtes voisines s’échangent (Z)',
    body: 'Tous les coins sont à leur place. Chaque arête s’échange avec une voisine, deux à deux.',
  },
  Ja: {
    title: 'Deux coins et deux arêtes s’échangent (J, premier)',
    body:
      'Un côté est terminé ; tenez-le à l’avant. Les deux coins arrière s’échangent, ainsi que les arêtes arrière et gauche.',
  },
  Jb: {
    title: 'Deux coins et deux arêtes s’échangent (J, deuxième)',
    body:
      'Un côté est terminé ; tenez-le à gauche. Les deux coins de droite s’échangent, ainsi que les arêtes avant et droite.',
  },
  T: {
    title: 'Deux coins et deux arêtes s’échangent (T)',
    body:
      'Des phares à gauche, avec un bloc de deux à l’avant et un autre à l’arrière. Les deux coins de droite s’échangent, ainsi que les arêtes gauche et droite.',
  },
  Ra: {
    title: 'Deux coins et deux arêtes s’échangent (R, premier)',
    body:
      'Des phares à gauche et un bloc de deux à l’avant. Les deux coins de droite s’échangent, ainsi que les arêtes arrière et gauche.',
  },
  Rb: {
    title: 'Deux coins et deux arêtes s’échangent (R, deuxième)',
    body:
      'Des phares à gauche et un bloc de deux à l’arrière. Les deux coins de droite s’échangent, ainsi que les arêtes avant et gauche.',
  },
  F: {
    title: 'Deux coins et deux arêtes s’échangent (F)',
    body:
      'Un côté est terminé ; tenez-le à gauche. Les deux coins de droite s’échangent, ainsi que les arêtes avant et arrière.',
  },
  Ga: {
    title: 'Trois coins et trois arêtes tournent entre eux (G, premier)',
    body:
      'Chaque cas G a des phares sur un côté et un seul bloc de deux. Tenez les phares à gauche : ici, le bloc est sur le côté avant, à droite.',
  },
  Gb: {
    title: 'Trois coins et trois arêtes tournent entre eux (G, deuxième)',
    body:
      'Des phares à gauche ; le bloc de deux est sur le côté droit, à l’arrière. C’est le premier cas G joué à l’envers.',
  },
  Gc: {
    title: 'Trois coins et trois arêtes tournent entre eux (G, troisième)',
    body:
      'Des phares à gauche ; le bloc de deux est sur le côté arrière, à droite.',
  },
  Gd: {
    title: 'Trois coins et trois arêtes tournent entre eux (G, quatrième)',
    body:
      'Des phares à gauche ; le bloc de deux est sur le côté droit, à l’avant. C’est le troisième cas G joué à l’envers.',
  },
  V: {
    title: 'Les coins en diagonale s’échangent, avec un bloc (V)',
    body: 'Deux coins opposés en diagonale s’échangent, ainsi que deux arêtes voisines. Un coin fait partie d’un bloc de deux terminé sur chacun de ses deux côtés.',
  },
  Y: {
    title: 'Les coins en diagonale s’échangent (Y)',
    body:
      'Deux coins opposés en diagonale s’échangent, ainsi que deux arêtes voisines. Il y a deux blocs de deux, à l’avant et à droite, et pas de phares.',
  },
  Na: {
    title: 'Coins en diagonale et arêtes opposées s’échangent (N, premier)',
    body: 'Chaque côté montre un bloc de deux et un coin dépareillé. Deux coins opposés en diagonale s’échangent, ainsi que deux arêtes opposées.',
  },
  Nb: {
    title: 'Coins en diagonale et arêtes opposées s’échangent (N, deuxième)',
    body: 'L’image en miroir du premier cas N.',
  },
}
