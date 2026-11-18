/**
 * The third stage of Petrus: with the big block built, every other edge is
 * turned the good way round, so that the rest of the cube can be solved with
 * the right and the top face alone.
 *
 * An edge is good when `R` and `U` moves alone can bring it home the right
 * way round, and bad otherwise. This is what `eo` holds in a view: 0 for a
 * good edge, 1 for a bad one. `R` and `U` moves never change it; only a
 * quarter turn of the front or the back face does, and those break the block.
 * The taught sequences (`EDGE_FLIPS`) take part of the block out with such a
 * turn, turn the free face it does not sit on, and put it back.
 *
 * Only which of the seven places hold a bad edge matters here: 64 ways. The
 * stage is the cheapest mix of `R` and `U` moves and taught sequences.
 */
import { solvedCube } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { applyTurns, parseTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { bigBlockDone } from './blocks.ts'
import { EDGE_FLIPS } from './sequences.ts'

/** The edge places outside the big block: four on top, then bottom right, front right, back right. */
export const FREE_EDGE_PLACES: readonly number[] = [0, 1, 2, 3, 4, 8, 11]

/** The moves that keep the big block and every edge as good or bad as it is. */
export const FREE_MOVES = "R R2 R' U U2 U'"

const WAYS = 2 ** FREE_EDGE_PLACES.length

/** Whether the big block is built and every edge is good. */
export const edgesOriented = (view: CubieCube) => bigBlockDone(view) && view.eo.every((flip) => flip === 0)

/** Which places hold a bad edge, as bits in the order of `FREE_EDGE_PLACES`. */
export function badEdges(view: CubieCube): number {
  return FREE_EDGE_PLACES.reduce((bits, place, i) => bits | (view.eo[place] << i), 0)
}

/** Something the stage may do: one free move, or one taught sequence. */
interface Action {
  turns: Turn[]
  taught: boolean
  /** The bad places after it, from each set of bad places. */
  reached: Uint8Array
}

function actionOf(turns: Turn[], taught: boolean): Action {
  const effect = applyTurns(solvedCube(), turns)
  const from = FREE_EDGE_PLACES.map((place) => FREE_EDGE_PLACES.indexOf(effect.ep[place]))
  if (!bigBlockDone(effect) || from.includes(-1)) {
    throw new Error(`"${turns.map((turn) => turn.text).join(' ')}" does not put the block back`)
  }
  const reached = new Uint8Array(WAYS)
  for (let bits = 0; bits < WAYS; bits++) {
    FREE_EDGE_PLACES.forEach((place, i) => {
      reached[bits] |= (((bits >> from[i]) & 1) ^ effect.eo[place]) << i
    })
  }
  return { turns, taught, reached }
}

interface Tables {
  actions: Action[]
  /** Fewest moves from each set of bad places to none. */
  distances: Uint8Array
}

let tables: Tables | null = null

function buildTables(): Tables {
  const actions = [
    ...parseTurns(FREE_MOVES).map((turn) => actionOf([turn], false)),
    ...Object.values(EDGE_FLIPS).map((sequence) => actionOf(parseTurns(sequence), true)),
  ]
  const distances = new Uint8Array(WAYS).fill(255)
  distances[0] = 0
  for (let changed = true; changed; ) {
    changed = false
    for (let bits = 1; bits < WAYS; bits++) {
      for (const action of actions) {
        const through = distances[action.reached[bits]]
        if (through !== 255 && through + action.turns.length < distances[bits]) {
          distances[bits] = through + action.turns.length
          changed = true
        }
      }
    }
  }
  return { actions, distances }
}

/** The fewest moves the stage needs from this view. */
export function edgeOrientationDistance(view: CubieCube): number {
  tables ??= buildTables()
  return tables.distances[badEdges(view)]
}

/** One way through the stage: free moves and taught sequences, in order. */
export type EdgeOrientation = { turns: Turn[]; taught: boolean }[]

/** Never needed: every set of bad places has a way within one move of the fewest. */
const MOST_EXTRA = 6

/**
 * Every way of making all edges good in the fewest moves, up to `limit` of
 * them. Two parts that turn the same face never follow each other, so each
 * taught sequence is played as it is written. The big block must be built.
 */
export function solveEdgeOrientation(view: CubieCube, limit = 1): EdgeOrientation[] {
  tables ??= buildTables()
  const { actions, distances } = tables
  const found: EdgeOrientation[] = []
  const path: Action[] = []
  const descend = (bits: number, left: number): void => {
    if (distances[bits] > left) return
    if (bits === 0) {
      if (left === 0) found.push(path.map(({ turns, taught }) => ({ turns, taught })))
      return
    }
    const last = path.at(-1)?.turns.at(-1)
    for (const action of actions) {
      if (found.length >= limit) return
      if (action.turns.length > left || action.turns[0].family === last?.family) continue
      path.push(action)
      descend(action.reached[bits], left - action.turns.length)
      path.pop()
    }
  }
  const start = badEdges(view)
  for (let extra = 0; extra <= MOST_EXTRA && found.length === 0; extra++) {
    descend(start, distances[start] + extra)
  }
  if (found.length === 0) throw new Error('Petrus solver could not make the edges good')
  return found
}
