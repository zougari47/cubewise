/**
 * The road map on the home page: every method as a stop on one road, in the
 * order a learner would meet them. The first stops are steps, taken one after
 * the other; the rest are choices, alternatives to each other where the road
 * forks. This file decides the order and where each stop sits; `roadmap.tsx`
 * draws it.
 */
import { solvedCube } from '../../core/cube/cubie.ts'
import { METHOD_IDS } from '../../core/methods/index.ts'
import type { MethodId } from '../../core/methods/index.ts'
import { lessonColours } from '../learn/lessons.ts'
import type { Pieces } from '../learn/lessons.ts'

export interface RoadmapEntry {
  /** A step is learned after the one before it; choices are alternatives, of which a learner picks one. */
  kind: 'step' | 'choice'
  /** The pieces coloured in the stop's picture: the state the method is known by. */
  shown: Pieces
  /** About how many moves the method's solver takes, as its `solverHint` says. */
  moves: number
}

/** What the road map needs to know of each method. A new method must be given its entry here. */
export const ROADMAP: Record<MethodId, RoadmapEntry> = {
  // The first layer.
  beginner: { kind: 'step', shown: { corners: [4, 5, 6, 7], edges: [4, 5, 6, 7] }, moves: 130 },
  // The cross, three corners and the middle-layer edges; the front-right corner is the keyhole.
  keyhole: { kind: 'step', shown: { corners: [5, 6, 7], edges: [4, 5, 6, 7, 8, 9, 10, 11] }, moves: 110 },
  // The cross and one corner-edge pair in its slot.
  cfop: { kind: 'choice', shown: { corners: [4], edges: [4, 5, 6, 7, 8] }, moves: 53 },
  // The block on the left and the block on the right.
  roux: { kind: 'choice', shown: { corners: [4, 5, 6, 7], edges: [4, 6, 8, 9, 10, 11] }, moves: 39 },
  // The line and the block to its right.
  zz: { kind: 'choice', shown: { corners: [4, 7], edges: [5, 7, 4, 8, 11] }, moves: 43 },
  // The block of two by two by two.
  petrus: { kind: 'choice', shown: { corners: [4], edges: [4, 5, 8] }, moves: 39 },
}

/** How many stops the road passes before it turns back, on a wide screen. */
export const STOPS_PER_ROW = 2

export interface RoadmapStop {
  method: MethodId
  kind: RoadmapEntry['kind']
  /** The number on the stop: steps count up from 1, and every choice has the number after the last step. */
  number: number
  /** What the road says on the way in: where it starts, where it forks, or that this stop is one more choice. */
  lead: 'start' | 'next' | 'fork' | 'or'
  /** The row of the stop on a wide screen, from 0. Even rows run forwards, odd rows run back. */
  row: number
  /** Its place along that row in the order of travel, from 0. */
  place: number
  /** The column it is drawn in, from 1: the same as `place` on a row that runs forwards, mirrored on one that runs back. */
  column: number
  /** The road turns down to the next row after this stop. */
  turnsAfter: boolean
  isLast: boolean
}

/** The stops of the road in the order of travel: the steps, then the choices, each group in the order the methods are offered. */
export function roadmapStops(
  methods: readonly MethodId[] = METHOD_IDS,
  entries: Record<MethodId, Pick<RoadmapEntry, 'kind'>> = ROADMAP,
): RoadmapStop[] {
  const steps = methods.filter((method) => entries[method].kind === 'step')
  const choices = methods.filter((method) => entries[method].kind === 'choice')
  return [...steps, ...choices].map((method, index, all) => {
    const isChoice = index >= steps.length
    const row = Math.floor(index / STOPS_PER_ROW)
    const place = index % STOPS_PER_ROW
    const isLast = index === all.length - 1
    return {
      method,
      kind: entries[method].kind,
      number: isChoice ? steps.length + 1 : index + 1,
      lead: index === 0 ? 'start' : !isChoice ? 'next' : index === steps.length ? 'fork' : 'or',
      row,
      place,
      column: row % 2 === 0 ? place + 1 : STOPS_PER_ROW - place,
      turnsAfter: place === STOPS_PER_ROW - 1 && !isLast,
      isLast,
    }
  })
}

/** Screen colour of each of the 54 stickers in a method's picture: a solved cube with only its `shown` pieces coloured. */
export function roadmapColours(method: MethodId): string[] {
  const start = solvedCube()
  return lessonColours(start, { id: method, sequence: '', start, shown: ROADMAP[method].shown })
}
