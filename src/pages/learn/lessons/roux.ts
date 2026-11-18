/** The lesson cases of the Roux method. */
import { solvedCube } from '../../../core/cube/cubie.ts'
import {
  FIRST_BLOCK_EXAMPLES as F,
  MIDDLE_EDGE_EXAMPLES,
  ORIENT_EXAMPLES,
  SECOND_BLOCK_EXAMPLES as S,
  SIDE_EDGE_EXAMPLES,
  TOP_CORNERS,
} from '../../../core/methods/roux/sequences.ts'
import type { RouxStage } from '../../../core/methods/roux/stages.ts'
import { BOTTOM, MIDDLE, TOP, solvedBy } from '../lessons.ts'
import type { LessonCase, Pieces } from '../lessons.ts'

const BOTTOM_LEFT_EDGE: Pieces = { edges: [6] }
const FRONT_OF_FIRST_BLOCK: Pieces = { corners: [5], edges: [6, 9] }
const FIRST_BLOCK: Pieces = { corners: [5, 6], edges: [6, 9, 10] }
const FIRST_BLOCK_AND_EDGE: Pieces = { corners: [5, 6], edges: [6, 9, 10, 4] }
const BLOCKS: Pieces = { corners: BOTTOM, edges: [4, 6, ...MIDDLE] }
const BLOCKS_AND_CORNERS: Pieces = { corners: [...BOTTOM, ...TOP], edges: [4, 6, ...MIDDLE] }
const ALL_BUT_MIDDLE_SLICE: Pieces = { corners: [...BOTTOM, ...TOP], edges: [0, 2, 4, 6, ...MIDDLE] }
const WHOLE_CUBE: Pieces = { corners: [...BOTTOM, ...TOP], edges: [...TOP, ...BOTTOM, ...MIDDLE] }

/** One case per entry of a table, with the entry's name in kebab case as its id. */
const examples = (table: Record<string, string>, shown: Pieces): LessonCase[] =>
  Object.entries(table).map(([name, sequence]) =>
    solvedBy(name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), sequence, shown),
  )

export const ROUX_LESSONS: Record<RouxStage, LessonCase[]> = {
  // The first block is on the left, so most of its pictures show the cube from that side.
  'first-block': [
    solvedBy('bottom-edge', F.bottomEdge, BOTTOM_LEFT_EDGE, { turned: ['left'] }),
    solvedBy('joined-pair', F.joinedPair, FRONT_OF_FIRST_BLOCK, { turned: ['left'] }),
    solvedBy('split-pair', F.splitPair, FRONT_OF_FIRST_BLOCK),
    solvedBy('back-pair', F.backPair, FIRST_BLOCK, { turned: ['left'] }),
    { id: 'done', sequence: '', start: solvedCube(), shown: FIRST_BLOCK, turned: ['left'] },
  ],
  'second-block': [
    solvedBy('bottom-edge', S.bottomEdge, FIRST_BLOCK_AND_EDGE),
    solvedBy('front-pair', S.frontPair, BLOCKS),
    solvedBy('back-pair', S.backPair, BLOCKS),
    solvedBy('wide-insert', S.wideInsert, BLOCKS),
    solvedBy('through-middle', S.throughMiddle, BLOCKS),
  ],
  // One case per sequence, in the order of the table.
  'top-corners': Object.entries(TOP_CORNERS).map(([id, sequence]) =>
    solvedBy(id, sequence, BLOCKS_AND_CORNERS),
  ),
  'orient-last-edges': examples(ORIENT_EXAMPLES, WHOLE_CUBE),
  'side-edges': examples(SIDE_EDGE_EXAMPLES, ALL_BUT_MIDDLE_SLICE),
  'middle-edges': examples(MIDDLE_EDGE_EXAMPLES, WHOLE_CUBE),
}
