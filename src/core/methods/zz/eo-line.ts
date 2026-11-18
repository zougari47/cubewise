/**
 * The first stage of ZZ: every edge is turned the good way round and the two
 * line edges (bottom front and bottom back) go home, all at once and in the
 * fewest moves there are. Speedsolvers call it EOLine.
 *
 * An edge is good when `R`, `U`, `L` and `D` moves alone can bring it home
 * the right way round, and bad otherwise. Only a quarter turn of the front
 * or the back face changes that, for the four edges it carries. This is what
 * `eo` holds in a view: 0 for a good edge, 1 for a bad one.
 *
 * A table holds how many moves every arrangement needs: which of the twelve
 * edge places hold a bad edge (2048 ways), and where the two line edges are
 * (144). Solutions are read off it without searching.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { FACE_TURNS } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'

const EDGES = 12
/** The flips of the first eleven places; the twelfth follows from them. */
const FLIPS = 2 ** (EDGES - 1)
const LINE_PLACES = EDGES * EDGES
/** The line edges: bottom front and bottom back. */
export const LINE = [5, 7] as const
const LINE_HOME = LINE[0] * EDGES + LINE[1]

/** Whether every edge is good. */
export const edgesOriented = (view: CubieCube) => view.eo.every((flip) => flip === 0)

/** Whether every edge is good and the two line edges are home. */
export const eoLineDone = (view: CubieCube) =>
  edgesOriented(view) && LINE.every((edge) => view.ep[edge] === edge)

interface Tables {
  /** For each move, the flips after it from each set of flips. */
  flips: Uint16Array[]
  /** For each move, the places of the line edges after it. */
  line: Uint8Array[]
  /** Moves needed from each arrangement, numbered `flips * 144 + line`. */
  distances: Int8Array
}

let tables: Tables | null = null

function buildTables(): Tables {
  const flips = FACE_TURNS.map(({ effect }) => {
    const table = new Uint16Array(FLIPS)
    for (let key = 0; key < FLIPS; key++) {
      // Bit i is the flip of place i; the last place makes the count even.
      let all = key
      let odd = 0
      for (let i = 0; i < EDGES - 1; i++) odd ^= (key >> i) & 1
      all |= odd << (EDGES - 1)
      let reached = 0
      for (let to = 0; to < EDGES - 1; to++) {
        reached |= (((all >> effect.ep[to]) & 1) ^ effect.eo[to]) << to
      }
      table[key] = reached
    }
    return table
  })
  const line = FACE_TURNS.map(({ effect }) => {
    const goesTo = new Array<number>(EDGES)
    effect.ep.forEach((from, to) => (goesTo[from] = to))
    const table = new Uint8Array(LINE_PLACES)
    for (let key = 0; key < LINE_PLACES; key++) {
      table[key] = goesTo[Math.floor(key / EDGES)] * EDGES + goesTo[key % EDGES]
    }
    return table
  })

  const distances = new Int8Array(FLIPS * LINE_PLACES).fill(-1)
  let frontier = [LINE_HOME]
  distances[LINE_HOME] = 0
  for (let depth = 1; frontier.length > 0; depth++) {
    const next: number[] = []
    for (const key of frontier) {
      const places = key % LINE_PLACES
      const flipped = (key - places) / LINE_PLACES
      for (let move = 0; move < FACE_TURNS.length; move++) {
        const reached = flips[move][flipped] * LINE_PLACES + line[move][places]
        if (distances[reached] !== -1) continue
        distances[reached] = depth
        next.push(reached)
      }
    }
    frontier = next
  }
  return { flips, line, distances }
}

/** The most moves the stage ever needs. */
export function longestEoLine(): number {
  tables ??= buildTables()
  return tables.distances.reduce((most, distance) => Math.max(most, distance), 0)
}

/** The fewest moves that finish the stage from this view. */
export function eoLineDistance(view: CubieCube): number {
  tables ??= buildTables()
  return tables.distances[keyOf(view)]
}

function keyOf(view: CubieCube): number {
  let flipped = 0
  for (let i = 0; i < EDGES - 1; i++) flipped |= view.eo[i] << i
  return flipped * LINE_PLACES + view.ep.indexOf(LINE[0]) * EDGES + view.ep.indexOf(LINE[1])
}

/**
 * Every way of finishing the stage in the fewest moves, up to `limit` of
 * them. There is always at least one; a view that is done already gives one
 * empty list.
 */
export function solveEoLine(view: CubieCube, limit = 1): Turn[][] {
  tables ??= buildTables()
  const { flips, line, distances } = tables
  const found: Turn[][] = []
  const path: Turn[] = []

  const descend = (flipped: number, places: number, left: number): void => {
    if (left === 0) {
      found.push(path.slice())
      return
    }
    for (let move = 0; move < FACE_TURNS.length && found.length < limit; move++) {
      const nextFlipped = flips[move][flipped]
      const nextPlaces = line[move][places]
      if (distances[nextFlipped * LINE_PLACES + nextPlaces] !== left - 1) continue
      path.push(FACE_TURNS[move])
      descend(nextFlipped, nextPlaces, left - 1)
      path.pop()
    }
  }

  const key = keyOf(view)
  const places = key % LINE_PLACES
  descend((key - places) / LINE_PLACES, places, distances[key])
  return found
}
