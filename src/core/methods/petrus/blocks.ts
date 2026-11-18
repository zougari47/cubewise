/**
 * The two block stages of Petrus. The small block is the bottom-back-left
 * corner with its three edges (two by two by two with the centres). The big
 * block adds the bottom-front-left corner and its two other edges, which
 * leaves the right and the top face free.
 *
 * The small block may use every face. The big block is added with the three
 * faces that do not touch the small block: right, top and front.
 *
 * Each stage has a table of how many moves every arrangement of its pieces
 * needs, so solutions are read off without searching.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { areSolved } from '../shared/search.ts'
import type { Pieces } from '../shared/search.ts'
import { FACE_TURNS, parseTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'

/** Bottom-back-left corner; bottom-left, bottom-back and back-left edges. */
export const SMALL_BLOCK = { corners: [6], edges: [6, 7, 10] } as const satisfies Pieces
/** What the big block adds: bottom-front-left corner; bottom-front and front-left edges. */
export const EXTENSION = { corners: [5], edges: [5, 9] } as const satisfies Pieces
/** The big block: everything that is on neither the right nor the top face. */
export const BIG_BLOCK = { corners: [5, 6], edges: [5, 6, 7, 9, 10] } as const satisfies Pieces

/** The moves that leave the small block alone. */
export const EXTENSION_MOVES = "U U2 U' R R2 R' F F2 F'"

export const smallBlockDone = (view: CubieCube) => areSolved(view, SMALL_BLOCK)
export const bigBlockDone = (view: CubieCube) => areSolved(view, BIG_BLOCK)

/** A tracked piece is in one of 24 slots: its position and which way round it is. */
const SLOTS = 24

interface Tracked {
  isCorner: boolean
  piece: number
}

const trackedOf = (pieces: Pieces): Tracked[] => [
  ...(pieces.corners ?? []).map((piece) => ({ isCorner: true, piece })),
  ...(pieces.edges ?? []).map((piece) => ({ isCorner: false, piece })),
]

/** One stage: its pieces, its moves, where each move takes each slot, and its table. */
interface BlockStage {
  tracked: Tracked[]
  turns: readonly Turn[]
  /** For each move and each tracked piece, the slot it goes to from each slot. */
  moves: Uint8Array[][]
  /** The face of each move, 0–5. */
  faces: number[]
  home: number[]
  table: Int8Array | null
}

function stageOf(pieces: Pieces, turns: readonly Turn[]): BlockStage {
  const tracked = trackedOf(pieces)
  const moves = turns.map(({ effect }) => {
    const corner = new Uint8Array(SLOTS)
    const edge = new Uint8Array(SLOTS)
    effect.cp.forEach((from, to) => {
      for (let twist = 0; twist < 3; twist++) corner[from * 3 + twist] = to * 3 + ((twist + effect.co[to]) % 3)
    })
    effect.ep.forEach((from, to) => {
      for (let flip = 0; flip < 2; flip++) edge[from * 2 + flip] = to * 2 + ((flip + effect.eo[to]) % 2)
    })
    return tracked.map(({ isCorner }) => (isCorner ? corner : edge))
  })
  return {
    tracked,
    turns,
    moves,
    faces: turns.map((turn) => Math.floor(turn.faceMoves[0] / 3)),
    home: tracked.map(({ isCorner, piece }) => piece * (isCorner ? 3 : 2)),
    table: null,
  }
}

const SMALL = stageOf(SMALL_BLOCK, FACE_TURNS)
const ADDED = stageOf(EXTENSION, parseTurns(EXTENSION_MOVES))

const keyOf = (slots: readonly number[]) => slots.reduce((key, slot) => key * SLOTS + slot, 0)

const slotsOf = (view: CubieCube, stage: BlockStage) =>
  stage.tracked.map(({ isCorner, piece }) => {
    const position = (isCorner ? view.cp : view.ep).indexOf(piece)
    return isCorner ? position * 3 + view.co[position] : position * 2 + view.eo[position]
  })

const moved = (stage: BlockStage, slots: readonly number[], move: number) =>
  slots.map((slot, i) => stage.moves[move][i][slot])

/** Fewest moves to bring the stage's pieces home, from every arrangement of them. */
function tableOf(stage: BlockStage): Int8Array {
  if (stage.table) return stage.table
  const count = stage.tracked.length
  const table = new Int8Array(SLOTS ** count).fill(-1)
  const slots = new Array<number>(count)
  let frontier = [keyOf(stage.home)]
  table[frontier[0]] = 0
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: number[] = []
    for (const key of frontier) {
      let rest = key
      for (let i = count - 1; i >= 0; i--) {
        slots[i] = rest % SLOTS
        rest = (rest - slots[i]) / SLOTS
      }
      for (const move of stage.moves) {
        let reached = 0
        for (let i = 0; i < count; i++) reached = reached * SLOTS + move[i][slots[i]]
        if (table[reached] !== -1) continue
        table[reached] = depth
        next.push(reached)
      }
    }
    frontier = next
  }
  stage.table = table
  return table
}

/** A face is never turned twice running, and of two opposite faces only one order is tried. */
const wasted = (stage: BlockStage, previous: number, move: number) =>
  previous >= 0 &&
  (stage.faces[previous] === stage.faces[move] || stage.faces[previous] === stage.faces[move] + 3)

/**
 * Calls `visit` with every way of finishing the stage in at most `extra`
 * moves more than the fewest, until `visit` returns false.
 */
function eachWay(
  stage: BlockStage,
  start: readonly number[],
  extra: number,
  visit: (moves: readonly number[]) => boolean,
): void {
  const table = tableOf(stage)
  const path: number[] = []
  let going = true
  const descend = (slots: readonly number[], left: number, previous: number): void => {
    const distance = table[keyOf(slots)]
    if (distance > left) return
    if (distance === 0) {
      // With moves to spare, this way was visited already at a smaller depth.
      if (left === 0) going = visit(path)
      return
    }
    for (let move = 0; move < stage.moves.length && going; move++) {
      if (wasted(stage, previous, move)) continue
      path.push(move)
      descend(moved(stage, slots, move), left - 1, move)
      path.pop()
    }
  }
  const fewest = table[keyOf(start)]
  for (let depth = fewest; depth <= fewest + extra && going; depth++) descend(start, depth, -1)
}

/** The fewest moves that build the small block. */
export function smallBlockDistance(view: CubieCube): number {
  return tableOf(SMALL)[keyOf(slotsOf(view, SMALL))]
}

/** The fewest right, top and front moves that add the extension; the small block must be built. */
export function extensionDistance(view: CubieCube): number {
  return tableOf(ADDED)[keyOf(slotsOf(view, ADDED))]
}

/** A way of building the small block, and how many moves both blocks then take in all. */
export interface BlockPlan {
  smallBlock: Turn[]
  /** Moves of the small block plus the fewest moves that then add the extension. */
  moves: number
}

/**
 * Ways of building the small block, with what each costs once the big block
 * is built after it. Looks at every way that is at most `extra` moves longer
 * than the fewest (up to `limit` of them) and returns the `keep` best.
 */
export function planBlocks(view: CubieCube, extra = 1, limit = 400, keep = 3): BlockPlan[] {
  const added = tableOf(ADDED)
  const start = slotsOf(view, SMALL)
  const addedStart = slotsOf(view, ADDED)
  const plans: { moves: number[]; total: number }[] = []
  let seen = 0
  eachWay(SMALL, start, extra, (path) => {
    // The extension's pieces ride along; SMALL has every face move, in the order of `FACE_TURNS`.
    let slots = addedStart
    for (const move of path) slots = slots.map((slot, i) => ALL_MOVES_ON_ADDED[move][i][slot])
    const total = path.length + added[keyOf(slots)]
    if (plans.length < keep || total < plans[plans.length - 1].total) {
      plans.push({ moves: path.slice(), total })
      plans.sort((a, b) => a.total - b.total)
      if (plans.length > keep) plans.pop()
    }
    return ++seen < limit
  })
  return plans.map(({ moves, total }) => ({
    smallBlock: moves.map((move) => SMALL.turns[move]),
    moves: total,
  }))
}

/** Where every face move takes the extension's pieces. */
const ALL_MOVES_ON_ADDED = stageOf(EXTENSION, FACE_TURNS).moves

/** Every way of adding the extension in the fewest right, top and front moves, up to `limit` of them. */
export function solveExtension(view: CubieCube, limit = 1): Turn[][] {
  const found: Turn[][] = []
  eachWay(ADDED, slotsOf(view, ADDED), 0, (path) => {
    found.push(path.map((move) => ADDED.turns[move]))
    return found.length < limit
  })
  return found
}

/** The fewest moves that build the small block: one way of the shortest there are. */
export function solveSmallBlock(view: CubieCube): Turn[] {
  let found: Turn[] = []
  eachWay(SMALL, slotsOf(view, SMALL), 0, (path) => {
    found = path.map((move) => SMALL.turns[move])
    return false
  })
  return found
}
