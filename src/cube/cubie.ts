/**
 * The 3×3 cube at piece level: which corner and edge sits where, and how it
 * is turned. This is the model the solver works on; stickers are derived from
 * it in `stickers.ts`.
 *
 * Corner positions: URF UFL ULB UBR DFR DLF DBL DRB (0–7)
 * Edge positions:   UR UF UL UB DR DF DL DB FR FL BL BR (0–11)
 *
 * `cp[i]` is the corner sitting in position `i`, and `co[i]` is its twist
 * (0–2, clockwise). `ep`/`eo` are the same for edges (flip is 0–1).
 */
export interface CubieCube {
  cp: number[]
  co: number[]
  ep: number[]
  eo: number[]
}

/** Faces in the order used everywhere: U R F D L B. */
export const FACE_NAMES = ['U', 'R', 'F', 'D', 'L', 'B'] as const

/** A move is `face * 3 + turns - 1`: U U2 U' R R2 R' F … B'. */
export type Move = number

export const MOVE_COUNT = 18

const SUFFIXES = ['', '2', "'"]

/** The six clockwise quarter turns, in face order U R F D L B. */
const QUARTER_TURNS: CubieCube[] = [
  {
    cp: [3, 0, 1, 2, 4, 5, 6, 7],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    cp: [4, 1, 2, 0, 7, 5, 6, 3],
    co: [2, 0, 0, 1, 1, 0, 0, 2],
    ep: [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    cp: [1, 5, 2, 3, 0, 4, 6, 7],
    co: [1, 2, 0, 0, 2, 1, 0, 0],
    ep: [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11],
    eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
  },
  {
    cp: [0, 1, 2, 3, 5, 6, 7, 4],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    cp: [0, 2, 6, 3, 4, 1, 5, 7],
    co: [0, 1, 2, 0, 0, 2, 1, 0],
    ep: [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    cp: [0, 1, 3, 7, 4, 5, 2, 6],
    co: [0, 0, 1, 2, 0, 0, 2, 1],
    ep: [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7],
    eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
  },
]

export function solvedCube(): CubieCube {
  return {
    cp: [0, 1, 2, 3, 4, 5, 6, 7],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }
}

/** The cube you get by doing `a`, then `b`. */
export function multiply(a: CubieCube, b: CubieCube): CubieCube {
  const cp = new Array<number>(8)
  const co = new Array<number>(8)
  const ep = new Array<number>(12)
  const eo = new Array<number>(12)
  for (let i = 0; i < 8; i++) {
    cp[i] = a.cp[b.cp[i]]
    co[i] = (a.co[b.cp[i]] + b.co[i]) % 3
  }
  for (let i = 0; i < 12; i++) {
    ep[i] = a.ep[b.ep[i]]
    eo[i] = (a.eo[b.ep[i]] + b.eo[i]) % 2
  }
  return { cp, co, ep, eo }
}

/** All 18 moves as cubes, indexed by `Move`. */
export const MOVE_CUBES: CubieCube[] = QUARTER_TURNS.flatMap((quarter) => {
  const half = multiply(quarter, quarter)
  return [quarter, half, multiply(half, quarter)]
})

export function applyMove(cube: CubieCube, move: Move): CubieCube {
  return multiply(cube, MOVE_CUBES[move])
}

export function applyMoves(cube: CubieCube, moves: readonly Move[]): CubieCube {
  let result = cube
  for (const move of moves) result = applyMove(result, move)
  return result
}

export function isSolved(cube: CubieCube): boolean {
  return (
    cube.cp.every((piece, i) => piece === i) &&
    cube.co.every((twist) => twist === 0) &&
    cube.ep.every((piece, i) => piece === i) &&
    cube.eo.every((flip) => flip === 0)
  )
}

/** Parses standard notation such as `R U R' U2`. Throws on anything else. */
export function parseMoves(text: string): Move[] {
  const moves: Move[] = []
  for (const token of text.trim().split(/\s+/)) {
    if (token === '') continue
    const face = FACE_NAMES.indexOf(token[0] as (typeof FACE_NAMES)[number])
    const turns = SUFFIXES.indexOf(token.slice(1))
    if (face < 0 || turns < 0) throw new Error(`Unknown move "${token}"`)
    moves.push(face * 3 + turns)
  }
  return moves
}

export function formatMoves(moves: readonly Move[]): string {
  return moves
    .map((move) => FACE_NAMES[Math.floor(move / 3)] + SUFFIXES[move % 3])
    .join(' ')
}

/** The moves that undo `moves`. */
export function invertMoves(moves: readonly Move[]): Move[] {
  return moves.map((move) => move - (move % 3) + (2 - (move % 3))).reverse()
}

/** Why a cube cannot be reached from solved by turning faces. */
export type UnsolvableReason =
  | 'bad-pieces'
  | 'twisted-corner'
  | 'flipped-edge'
  | 'swapped-pieces'

function isPermutation(pieces: readonly number[], size: number): boolean {
  if (pieces.length !== size) return false
  const seen = new Array<boolean>(size).fill(false)
  for (const piece of pieces) {
    if (!Number.isInteger(piece) || piece < 0 || piece >= size || seen[piece]) {
      return false
    }
    seen[piece] = true
  }
  return true
}

function permutationParity(pieces: readonly number[]): number {
  let parity = 0
  for (let i = 0; i < pieces.length; i++) {
    for (let j = i + 1; j < pieces.length; j++) {
      if (pieces[i] > pieces[j]) parity ^= 1
    }
  }
  return parity
}

/** Returns `null` when the cube is solvable, otherwise the reason it is not. */
export function findUnsolvableReason(cube: CubieCube): UnsolvableReason | null {
  if (!isPermutation(cube.cp, 8) || !isPermutation(cube.ep, 12)) {
    return 'bad-pieces'
  }
  if (cube.co.length !== 8 || cube.eo.length !== 12) return 'bad-pieces'
  if (cube.co.some((twist) => twist !== 0 && twist !== 1 && twist !== 2)) {
    return 'bad-pieces'
  }
  if (cube.eo.some((flip) => flip !== 0 && flip !== 1)) return 'bad-pieces'
  if (cube.co.reduce((sum, twist) => sum + twist, 0) % 3 !== 0) {
    return 'twisted-corner'
  }
  if (cube.eo.reduce((sum, flip) => sum + flip, 0) % 2 !== 0) {
    return 'flipped-edge'
  }
  if (permutationParity(cube.cp) !== permutationParity(cube.ep)) {
    return 'swapped-pieces'
  }
  return null
}

function shuffle(pieces: number[], random: () => number): void {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const held = pieces[i]
    pieces[i] = pieces[j]
    pieces[j] = held
  }
}

/** A uniformly random solvable cube. */
export function randomCube(random: () => number = Math.random): CubieCube {
  const cube = solvedCube()
  shuffle(cube.cp, random)
  shuffle(cube.ep, random)
  if (permutationParity(cube.cp) !== permutationParity(cube.ep)) {
    const held = cube.ep[0]
    cube.ep[0] = cube.ep[1]
    cube.ep[1] = held
  }
  let twistSum = 0
  for (let i = 0; i < 7; i++) {
    cube.co[i] = Math.floor(random() * 3)
    twistSum += cube.co[i]
  }
  cube.co[7] = (3 - (twistSum % 3)) % 3
  let flipSum = 0
  for (let i = 0; i < 11; i++) {
    cube.eo[i] = Math.floor(random() * 2)
    flipSum += cube.eo[i]
  }
  cube.eo[11] = flipSum % 2
  return cube
}
