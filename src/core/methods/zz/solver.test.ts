import { describe, expect, test } from 'vitest'
import { MOVE_CUBES, applyMoves, isSolved, parseMoves, randomCube, solvedCube } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { cubeFaceSeenAs } from '../../cube/orientation.ts'
import { cubeAfterSteps } from '../../cube/steps.ts'
import { EDGE_STICKERS, stickersFromCube } from '../../cube/stickers.ts'
import { seededRandom } from '../../cube/testing.ts'
import {
  CORNER_ORIENTATIONS,
  PERMUTATIONS,
  lastLayerFacesUp,
  lowerLayersSolved,
  orientLastLayerCorners,
  permuteLastLayer,
} from '../shared/last-layer.ts'
import { countMoves } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { areSolved } from '../shared/search.ts'
import {
  U_TURNS,
  applyTurn,
  applyTurns,
  formatTurns,
  invertTurns,
  parseTurns,
  tidy,
  viewOf,
} from '../shared/turns.ts'
import {
  BLOCK_MOVES,
  LEFT_BLOCK,
  RIGHT_BLOCK,
  blockDistance,
  blocksDone,
  searchStats,
  solveBlocks,
} from './blocks.ts'
import { edgesOriented, eoLineDistance, eoLineDone, longestEoLine, solveEoLine } from './eo-line.ts'
import { BLOCK_EXAMPLES, EO_LINE_EXAMPLES } from './sequences.ts'
import { solveEoLineAndBlocks, solveZz } from './solver.ts'
import { ZZ_STAGES } from './stages.ts'
import type { ZzStage } from './stages.ts'

const TOP = [0, 1, 2, 3]
/** Edge places by name, in the order of `cubie.ts`. */
const PLACES = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR']

const allSteps = (solution: MethodSolution) => solution.stages.flatMap((stage) => stage.steps)
const stepsOf = (solution: MethodSolution<ZzStage>, stage: ZzStage) =>
  solution.stages.find((entry) => entry.stage === stage)!.steps
const textsOf = (solution: MethodSolution<ZzStage>, stage: ZzStage) =>
  stepsOf(solution, stage).map((step) => step.text)

/** The cube that `sequence` solves, held the usual way. */
const before = (sequence: string) => applyTurns(solvedCube(), invertTurns(parseTurns(sequence)))

/** The places that hold a bad edge, by name. */
const badPlaces = (view: CubieCube) => PLACES.filter((_, place) => view.eo[place] === 1)

/** A cube mixed with the given turns only. */
function mixed(random: () => number, generators: string, length = 40): CubieCube {
  const turns = parseTurns(generators)
  let view = solvedCube()
  for (let n = 0; n < length; n++) view = applyTurn(view, turns[Math.floor(random() * turns.length)])
  return view
}

describe('solveZz', () => {
  test('solves random cubes in about 43 moves', () => {
    const random = seededRandom(90)
    const count = 300
    let total = 0
    let longest = 0
    const perStage = ZZ_STAGES.map(() => 0)
    solveZz(randomCube(random))
    const started = performance.now()
    for (let n = 0; n < count; n++) {
      const cube = randomCube(random)
      const solution = solveZz(cube)
      const steps = allSteps(solution)
      expect(isSolved(cubeAfterSteps(cube, steps, steps.length))).toBe(true)
      const moves = countMoves(solution)
      total += moves
      longest = Math.max(longest, moves)
      ZZ_STAGES.forEach((stage, i) => {
        perStage[i] += stepsOf(solution, stage).filter((step) => step.moves.length > 0).length
      })
    }
    console.log(
      `zz: average ${(total / count).toFixed(1)} moves, longest ${longest}; ` +
        `by stage ${perStage.map((sum) => (sum / count).toFixed(1)).join(' + ')}; ` +
        `${((performance.now() - started) / count).toFixed(1)} ms a solve`,
    )
    expect(longest).toBeLessThan(60)
    expect(total / count).toBeLessThan(45)
    // The line in about six moves, and two blocks in well under the 13 moves each that a person aims for.
    expect(perStage[0] / count).toBeLessThan(6.5)
    expect(perStage[1] / count).toBeLessThan(18)
  })

  test('lists the four stages in order', () => {
    const solution = solveZz(randomCube(seededRandom(91)))
    expect(solution.stages.map((stage) => stage.stage)).toEqual([...ZZ_STAGES])
  })

  test('a solved cube needs no steps', () => {
    expect(allSteps(solveZz(solvedCube()))).toEqual([])
  })

  test('refuses an unsolvable cube', () => {
    const cube = solvedCube()
    cube.eo[0] = 1
    expect(() => solveZz(cube)).toThrow(/flipped-edge/)
  })

  test('starts with the entered top face at the bottom, and the front unchanged when that is no longer', () => {
    const { start } = solveZz(solvedCube())
    expect(cubeFaceSeenAs(start, 3)).toBe(0)
    expect(cubeFaceSeenAs(start, 2)).toBe(2)
    const random = seededRandom(92)
    const fronts = new Set<number>()
    for (let n = 0; n < 40; n++) {
      const solution = solveZz(randomCube(random))
      expect(cubeFaceSeenAs(solution.start, 3)).toBe(0)
      fronts.add(cubeFaceSeenAs(solution.start, 2))
    }
    // The line may run either way across the bottom: the entered front or the entered left side is in front.
    expect([...fronts].sort()).toEqual([2, 4])
  })

  test('each stage reaches its goal and keeps the earlier ones', () => {
    const checks: ((view: CubieCube) => boolean)[] = [
      eoLineDone,
      (view) => blocksDone(view) && lowerLayersSolved(view) && TOP.every((i) => view.eo[i] === 0),
      lastLayerFacesUp,
      isSolved,
    ]
    const random = seededRandom(93)
    for (let n = 0; n < 100; n++) {
      const cube = randomCube(random)
      const solution = solveZz(cube)
      const steps = allSteps(solution)
      let count = 0
      solution.stages.forEach((stage, index) => {
        count += stage.steps.length
        const held = steps[count - 1]?.orientation ?? solution.start
        const view = viewOf(cubeAfterSteps(cube, steps, count), held)
        for (let earlier = 0; earlier <= index; earlier++) {
          expect(checks[earlier](view), `${stage.stage} / check ${earlier + 1}`).toBe(true)
        }
      })
    }
  })

  test('the first stage uses face moves only, and the second only the right, top and left faces', () => {
    const random = seededRandom(94)
    for (let n = 0; n < 100; n++) {
      const solution = solveZz(randomCube(random))
      expect(textsOf(solution, 'eo-line').join(' ')).toMatch(/^[URFDLB2' ]*$/)
      expect(textsOf(solution, 'eo-line').length).toBeLessThanOrEqual(9)
      expect(textsOf(solution, 'first-two-layers').join(' ')).toMatch(/^[RUL2' ]*$/)
    }
  })

  test('the last layer is one taught sequence for each stage, with turns of the top layer around it', () => {
    const orientations = Object.values(CORNER_ORIENTATIONS).map(parseTurns)
    const permutations = Object.values(PERMUTATIONS).map(parseTurns)
    const waysOf = (sequences: (typeof orientations)[number][], adjustAfter: boolean) =>
      new Set(
        U_TURNS.flatMap((first) =>
          [[], ...sequences].flatMap((sequence) =>
            (adjustAfter ? U_TURNS : [[]]).map((last) => formatTurns(tidy([...first, ...sequence, ...last]))),
          ),
        ),
      )
    const orienting = waysOf(orientations, false)
    const permuting = waysOf(permutations, true)
    const random = seededRandom(95)
    for (let n = 0; n < 150; n++) {
      const solution = solveZz(randomCube(random))
      expect(orienting.has(textsOf(solution, 'orient-last-layer-corners').join(' '))).toBe(true)
      expect(permuting.has(textsOf(solution, 'permute-last-layer').join(' '))).toBe(true)
    }
  })

  test('step text follows the cube as it is turned', () => {
    // One move from solved on the entered right face: the cube is turned over
    // first, so that face is on the left.
    const steps = allSteps(solveZz(applyMoves(solvedCube(), parseMoves('R'))))
    expect(steps.map((step) => step.text)).toEqual(["L'"])
    expect(steps[0].moves).toEqual(parseMoves("R'"))
  })
})

describe('good and bad edges', () => {
  test('only a quarter turn of the front or the back face makes an edge bad', () => {
    MOVE_CUBES.forEach((cube, move) => {
      const quarterOfFrontOrBack = [2, 5].includes(Math.floor(move / 3)) && move % 3 !== 1
      expect(edgesOriented(cube), `move ${move}`).toBe(!quarterOfFrontOrBack)
      expect(badPlaces(cube).length, `move ${move}`).toBe(quarterOfFrontOrBack ? 4 : 0)
    })
  })

  test('every edge stays good under the turns that cannot make one bad, and a good cube needs no other turn', () => {
    const random = seededRandom(96)
    for (let n = 0; n < 50; n++) {
      const view = mixed(random, "R R' U U' L L' D D' F2 B2")
      expect(edgesOriented(view)).toBe(true)
      // With the line home as well, the blocks can be built with three faces.
      const line = solveEoLine(view)[0]
      expect(formatTurns(line)).toMatch(/^([URDL][2']?|[FB]2| )*$/)
      const blocks = solveBlocks(applyTurns(view, line))!
      expect(formatTurns(blocks)).toMatch(/^[RUL2' ]*$/)
      expect(blocksDone(applyTurns(applyTurns(view, line), blocks))).toBe(true)
    }
  })

  test('the stickers tell a bad edge as the lesson says', () => {
    // Faces: 0 top, 1 right, 2 front, 3 bottom, 4 left, 5 back.
    const topOrBottom = (face: number) => face === 0 || face === 3
    const side = (face: number) => face === 1 || face === 4
    const random = seededRandom(97)
    for (let n = 0; n < 100; n++) {
      const cube = randomCube(random)
      const stickers = stickersFromCube(cube)
      EDGE_STICKERS.forEach(([first, second], place) => {
        // The first sticker faces up or down in the top and bottom layers, and the front or the back in the middle layer.
        expect(Math.floor(first / 9) % 3, PLACES[place]).toBe(place < 8 ? 0 : 2)
        const looked = stickers[first]
        const bad = side(looked) || (!topOrBottom(looked) && topOrBottom(stickers[second]))
        expect(bad, PLACES[place]).toBe(cube.eo[place] === 1)
      })
    }
  })
})

describe('the first stage', () => {
  test('never takes more than nine moves, and about six on average', () => {
    expect(longestEoLine()).toBe(9)
    const random = seededRandom(98)
    let total = 0
    for (let n = 0; n < 500; n++) total += eoLineDistance(randomCube(random))
    expect(total / 500).toBeGreaterThan(5.8)
    expect(total / 500).toBeLessThan(6.4)
  })

  test('every way it offers is as short as any, and finishes the stage', () => {
    const random = seededRandom(99)
    for (let n = 0; n < 100; n++) {
      const cube = randomCube(random)
      const ways = solveEoLine(cube, 40)
      expect(ways.length).toBeGreaterThan(0)
      expect(ways.length).toBeLessThanOrEqual(40)
      for (const way of ways) {
        expect(way).toHaveLength(eoLineDistance(cube))
        expect(eoLineDone(applyTurns(cube, way))).toBe(true)
      }
    }
    expect(solveEoLine(solvedCube())).toEqual([[]])
  })

  test('nothing shorter exists: one move away is at most one move nearer', () => {
    const random = seededRandom(100)
    for (let n = 0; n < 50; n++) {
      const cube = randomCube(random)
      const distance = eoLineDistance(cube)
      expect(distance === 0).toBe(eoLineDone(cube))
      for (const move of MOVE_CUBES.keys()) {
        expect(eoLineDistance(applyMoves(cube, [move]))).toBeGreaterThanOrEqual(distance - 1)
      }
    }
  })

  test('each example does what its comment says, in the fewest moves', () => {
    const bad: Record<keyof typeof EO_LINE_EXAMPLES, string[]> = {
      fourBad: ['UF', 'DF', 'FR', 'FL'],
      gather: ['DR', 'DF', 'FR', 'FL'],
      twoBad: ['UL', 'FL'],
      lineEdges: [],
      together: ['UF', 'DR', 'DF', 'FL'],
    }
    for (const [name, sequence] of Object.entries(EO_LINE_EXAMPLES)) {
      const start = before(sequence)
      expect(badPlaces(start), name).toEqual(bad[name as keyof typeof EO_LINE_EXAMPLES])
      expect(eoLineDone(start), name).toBe(false)
      expect(eoLineDistance(start), name).toBe(parseTurns(sequence).length)
      expect(eoLineDone(applyTurns(start, sequence)), name).toBe(true)
    }
    // Where the comments put the line edges: [bottom-front edge, bottom-back edge].
    const lineAt = (view: CubieCube) => [5, 7].map((edge) => PLACES[view.ep.indexOf(edge)])
    expect(lineAt(before(EO_LINE_EXAMPLES.lineEdges))).toEqual(['UR', 'UF'])
    expect(lineAt(before(EO_LINE_EXAMPLES.together))).toEqual(['DR', 'FR'])
    // After the first turn of `twoBad` there are four bad edges.
    expect(badPlaces(applyTurns(before(EO_LINE_EXAMPLES.twoBad), 'F'))).toHaveLength(4)
    // Half turns of the front and the back are enough once every edge is good.
    expect(EO_LINE_EXAMPLES.lineEdges).toMatch(/^([URDL][2']?|[FB]2| )*$/)
  })
})

describe('the blocks', () => {
  /** Line home and every edge good, the rest mixed. */
  const afterLine = (random: () => number) => {
    const cube = randomCube(random)
    return applyTurns(cube, solveEoLine(cube)[0])
  }

  test('are built with the three faces, keep the line, and take little searching', () => {
    const random = seededRandom(101)
    let most = 0
    for (let n = 0; n < 200; n++) {
      const view = afterLine(random)
      searchStats.tries = 0
      const turns = solveBlocks(view)!
      most = Math.max(most, searchStats.tries)
      expect(turns.every((turn) => parseTurns(BLOCK_MOVES).includes(turn))).toBe(true)
      const reached = applyTurns(view, turns)
      expect(blocksDone(reached) && eoLineDone(reached)).toBe(true)
      expect(turns.length).toBeLessThanOrEqual(26)
    }
    // The search may give up after 500,000 tries and start again without a limit; it never comes near.
    expect(most).toBeLessThan(50_000)
  })

  test('the first block is as short as its table says, and the table is right about one block alone', () => {
    const random = seededRandom(102)
    for (let n = 0; n < 100; n++) {
      const view = afterLine(random)
      const turns = solveBlocks(view)!
      // Whichever block comes first is done after exactly the moves its table gives.
      const doneOnTime = [LEFT_BLOCK, RIGHT_BLOCK].some((block) =>
        areSolved(applyTurns(view, turns.slice(0, blockDistance(view, block))), block),
      )
      expect(doneOnTime).toBe(true)
      for (const turn of parseTurns(BLOCK_MOVES)) {
        const next = applyTurn(view, turn)
        expect(blockDistance(next, LEFT_BLOCK)).toBeGreaterThanOrEqual(blockDistance(view, LEFT_BLOCK) - 1)
      }
    }
    expect(blockDistance(solvedCube(), LEFT_BLOCK)).toBe(0)
    expect(blockDistance(before("L' U L"), LEFT_BLOCK)).toBe(3)
    expect(blockDistance(before("L' U L"), RIGHT_BLOCK)).toBe(0)
  })

  test('with a limit, only a shorter answer is given', () => {
    const view = afterLine(seededRandom(103))
    const turns = solveBlocks(view)!
    expect(solveBlocks(view, turns.length)).toBeNull()
    expect(solveBlocks(view, turns.length + 1)).toHaveLength(turns.length)
    expect(solveBlocks(solvedCube())).toEqual([])
  })

  test('the two stages together are never longer than one after the other', () => {
    const random = seededRandom(104)
    for (let n = 0; n < 50; n++) {
      const cube = randomCube(random)
      const { line, blocks } = solveEoLineAndBlocks(cube)
      const plain = solveEoLine(cube)[0]
      expect(line).toHaveLength(plain.length)
      expect(blocks.length).toBeLessThanOrEqual(solveBlocks(applyTurns(cube, plain))!.length)
    }
  })

  test('each example does what its comment says, in the fewest moves', () => {
    const block: Record<keyof typeof BLOCK_EXAMPLES, typeof LEFT_BLOCK | typeof RIGHT_BLOCK> = {
      bottomEdge: RIGHT_BLOCK,
      frontPair: RIGHT_BLOCK,
      splitPair: RIGHT_BLOCK,
      backPair: RIGHT_BLOCK,
      leftPair: LEFT_BLOCK,
    }
    for (const [name, sequence] of Object.entries(BLOCK_EXAMPLES)) {
      const start = before(sequence)
      const turns = parseTurns(sequence)
      expect(eoLineDone(start), name).toBe(true)
      expect(sequence, name).toMatch(/^[RUL2' ]*$/)
      expect(blockDistance(start, block[name as keyof typeof BLOCK_EXAMPLES]), name).toBe(turns.length)
      expect(solveBlocks(start), name).toHaveLength(turns.length)
      expect(blocksDone(applyTurns(start, sequence)), name).toBe(true)
    }
    // Where the comments put the pieces: [place of the corner, place of the edge].
    const pair = (view: CubieCube, corner: number, edge: number) => [view.cp.indexOf(corner), view.ep.indexOf(edge)]
    expect(PLACES[before(BLOCK_EXAMPLES.bottomEdge).ep.indexOf(4)]).toBe('UB')
    expect(pair(before(BLOCK_EXAMPLES.frontPair), 4, 8)).toEqual([0, 0])
    expect(pair(before(BLOCK_EXAMPLES.splitPair), 4, 8)).toEqual([0, 3])
    expect(pair(before(BLOCK_EXAMPLES.backPair), 7, 11)).toEqual([3, 0])
    expect(pair(before(BLOCK_EXAMPLES.leftPair), 5, 9)).toEqual([1, 2])
  })
})

describe('the last layer after the blocks', () => {
  test('every way the corners can face is turned up by one sequence', () => {
    let cases = 0
    for (let key = 0; key < 81; key++) {
      const twists = [key % 3, Math.floor(key / 3) % 3, Math.floor(key / 9) % 3, Math.floor(key / 27)]
      if (twists.reduce((sum, twist) => sum + twist, 0) % 3 !== 0) continue
      const view = solvedCube()
      twists.forEach((twist, corner) => (view.co[corner] = twist))
      const turns = orientLastLayerCorners(view)
      expect(lastLayerFacesUp(applyTurns(view, turns))).toBe(true)
      cases++
    }
    expect(cases).toBe(27)
  })

  test('every arrangement of the last layer is solved by one sequence', () => {
    const orders = (items: number[]): number[][] =>
      items.length <= 1
        ? [items]
        : items.flatMap((item) => orders(items.filter((other) => other !== item)).map((rest) => [item, ...rest]))
    const odd = (order: number[]) =>
      order.reduce((count, a, i) => count + order.slice(i + 1).filter((b) => b < a).length, 0) % 2
    let cases = 0
    for (const corners of orders(TOP)) {
      for (const edges of orders(TOP)) {
        if (odd(corners) !== odd(edges)) continue
        const view = solvedCube()
        corners.forEach((piece, place) => (view.cp[place] = piece))
        edges.forEach((piece, place) => (view.ep[place] = piece))
        expect(isSolved(applyTurns(view, permuteLastLayer(view)))).toBe(true)
        cases++
      }
    }
    expect(cases).toBe(288)
  })
})
