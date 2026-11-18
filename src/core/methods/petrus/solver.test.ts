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
} from '../shared/last-layer.ts'
import { countMoves } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { areSolved, blockSolver } from '../shared/search.ts'
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
  BIG_BLOCK,
  EXTENSION,
  EXTENSION_MOVES,
  SMALL_BLOCK,
  bigBlockDone,
  extensionDistance,
  planBlocks,
  smallBlockDistance,
  smallBlockDone,
  solveExtension,
  solveSmallBlock,
} from './blocks.ts'
import {
  FREE_EDGE_PLACES,
  FREE_MOVES,
  badEdges,
  edgeOrientationDistance,
  edgesOriented,
  solveEdgeOrientation,
} from './edges.ts'
import { layersDistance, solveLayers } from './layers.ts'
import { BIG_BLOCK_EXAMPLES, EDGE_FLIPS, LAYER_EXAMPLES, SMALL_BLOCK_EXAMPLES } from './sequences.ts'
import { planFrom, solvePetrus } from './solver.ts'
import { PETRUS_STAGES } from './stages.ts'
import type { PetrusStage } from './stages.ts'

const TOP = [0, 1, 2, 3]
/** The free edge places by the short names used in `EDGE_FLIPS`, in the order of `FREE_EDGE_PLACES`. */
const PLACES = ['ur', 'uf', 'ul', 'ub', 'dr', 'fr', 'br']

const allSteps = (solution: MethodSolution) => solution.stages.flatMap((stage) => stage.steps)
const stepsOf = (solution: MethodSolution<PetrusStage>, stage: PetrusStage) =>
  solution.stages.find((entry) => entry.stage === stage)!.steps
const textsOf = (solution: MethodSolution<PetrusStage>, stage: PetrusStage) =>
  stepsOf(solution, stage).map((step) => step.text)

/** The cube that `sequence` solves, held the usual way. */
const before = (sequence: string) => applyTurns(solvedCube(), invertTurns(parseTurns(sequence)))

/** The bad places of a view, by name. */
const badPlaces = (view: CubieCube) => PLACES.filter((_, i) => (badEdges(view) >> i) & 1)

/** A cube mixed with the given turns only. */
function mixed(random: () => number, generators: string, length = 40): CubieCube {
  const turns = parseTurns(generators)
  let view = solvedCube()
  for (let n = 0; n < length; n++) view = applyTurn(view, turns[Math.floor(random() * turns.length)])
  return view
}

/** The big block built and the free edges good or bad as the bits say (the corners are left solved). */
function withBadEdges(bits: number): CubieCube {
  const view = solvedCube()
  FREE_EDGE_PLACES.forEach((place, i) => (view.eo[place] = (bits >> i) & 1))
  return view
}

/** Every set of bad places there can be: an even number of the seven. */
const BAD_SETS = Array.from({ length: 128 }, (_, bits) => bits).filter(
  (bits) => bits.toString(2).split('1').length % 2 === 1,
)

describe('solvePetrus', () => {
  test('solves random cubes in about 39 moves', () => {
    const random = seededRandom(120)
    const count = 300
    let total = 0
    let longest = 0
    let slowest = 0
    const perStage = PETRUS_STAGES.map(() => 0)
    const tablesStarted = performance.now()
    solvePetrus(randomCube(random))
    const tables = performance.now() - tablesStarted
    const started = performance.now()
    for (let n = 0; n < count; n++) {
      const cube = randomCube(random)
      const solveStarted = performance.now()
      const solution = solvePetrus(cube)
      slowest = Math.max(slowest, performance.now() - solveStarted)
      const steps = allSteps(solution)
      expect(isSolved(cubeAfterSteps(cube, steps, steps.length))).toBe(true)
      const moves = countMoves(solution)
      total += moves
      longest = Math.max(longest, moves)
      PETRUS_STAGES.forEach((stage, i) => {
        perStage[i] += stepsOf(solution, stage).filter((step) => step.moves.length > 0).length
      })
    }
    console.log(
      `petrus: average ${(total / count).toFixed(1)} moves, longest ${longest}; ` +
        `by stage ${perStage.map((sum) => (sum / count).toFixed(1)).join(' + ')}; ` +
        `${((performance.now() - started) / count).toFixed(1)} ms a solve, slowest ${slowest.toFixed(0)} ms; ` +
        `first solve with tables ${tables.toFixed(0)} ms`,
    )
    expect(longest).toBeLessThan(55)
    expect(total / count).toBeLessThan(40)
    // Both blocks in about ten moves, and the edges and the first two layers in about ten more.
    expect((perStage[0] + perStage[1]) / count).toBeLessThan(11)
    expect((perStage[2] + perStage[3]) / count).toBeLessThan(11)
  })

  test('lists the six stages in order', () => {
    const solution = solvePetrus(randomCube(seededRandom(121)))
    expect(solution.stages.map((stage) => stage.stage)).toEqual([...PETRUS_STAGES])
  })

  test('a solved cube needs no steps', () => {
    expect(allSteps(solvePetrus(solvedCube()))).toEqual([])
  })

  test('refuses an unsolvable cube', () => {
    const flipped = solvedCube()
    flipped.eo[0] = 1
    expect(() => solvePetrus(flipped)).toThrow(/flipped-edge/)
    const twisted = randomCube(seededRandom(122))
    twisted.co[0] = (twisted.co[0] + 1) % 3
    expect(() => solvePetrus(twisted)).toThrow(/twisted-corner/)
    const swapped = solvedCube()
    swapped.ep[0] = 1
    swapped.ep[1] = 0
    expect(() => solvePetrus(swapped)).toThrow(/swapped-pieces/)
  })

  test('holds the cube whichever of the 24 ways is shortest, and with the entered top at the bottom when nothing is shorter', () => {
    const { start } = solvePetrus(solvedCube())
    expect(cubeFaceSeenAs(start, 3)).toBe(0)
    expect(cubeFaceSeenAs(start, 2)).toBe(2)
    const random = seededRandom(123)
    const held = new Set<string>()
    for (let n = 0; n < 100; n++) {
      const solution = solvePetrus(randomCube(random))
      held.add(`${cubeFaceSeenAs(solution.start, 0)}${cubeFaceSeenAs(solution.start, 2)}`)
    }
    expect(held.size).toBeGreaterThan(16)
  })

  test('each stage reaches its goal and keeps the earlier ones', () => {
    const checks: ((view: CubieCube) => boolean)[] = [
      smallBlockDone,
      bigBlockDone,
      edgesOriented,
      (view) => lowerLayersSolved(view) && TOP.every((i) => view.eo[i] === 0),
      lastLayerFacesUp,
      isSolved,
    ]
    const random = seededRandom(124)
    for (let n = 0; n < 100; n++) {
      const cube = randomCube(random)
      const solution = solvePetrus(cube)
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

  test('each stage turns only the faces the method gives it', () => {
    const random = seededRandom(125)
    let turnedOver = 0
    for (let n = 0; n < 100; n++) {
      const solution = solvePetrus(randomCube(random))
      expect(textsOf(solution, 'small-block').join(' ')).toMatch(/^[URFDLB2' ]*$/)
      expect(textsOf(solution, 'big-block').join(' ')).toMatch(/^[URF2' ]*$/)
      expect(textsOf(solution, 'edge-orientation').join(' ')).toMatch(/^[URFB2' ]*$/)
      // Right and top only; then, when the right layer was left for last, the cube is turned to put it on top.
      const layers = textsOf(solution, 'first-two-layers').join(' ')
      expect(layers).toMatch(/^[RU2' ]*?( ?z')?$/)
      if (layers.endsWith("z'")) turnedOver++
    }
    expect(turnedOver).toBeGreaterThan(20)
    expect(turnedOver).toBeLessThan(80)
  })

  test('edge orientation is taught sequences with turns of the right and the top face between them', () => {
    const taught = Object.values(EDGE_FLIPS)
    const free = FREE_MOVES.split(' ')
    /** Whether `texts` from `at` on can be read as taught sequences and free moves. */
    const reads = (texts: string[], at = 0): boolean =>
      at === texts.length ||
      (free.includes(texts[at]) && reads(texts, at + 1)) ||
      taught.some((sequence) => {
        const length = sequence.split(' ').length
        return texts.slice(at, at + length).join(' ') === sequence && reads(texts, at + length)
      })
    const random = seededRandom(126)
    let stages = 0
    for (let n = 0; n < 100; n++) {
      const texts = textsOf(solvePetrus(randomCube(random)), 'edge-orientation')
      expect(reads(texts), texts.join(' ')).toBe(true)
      // The stage never ends on a move that changes no edge.
      if (texts.length > 0) {
        expect(texts.at(-1)).toMatch(/^[FB]/)
        stages++
      }
    }
    expect(stages).toBeGreaterThan(60)
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
    const random = seededRandom(127)
    for (let n = 0; n < 100; n++) {
      const solution = solvePetrus(randomCube(random))
      expect(orienting.has(textsOf(solution, 'orient-last-layer-corners').join(' '))).toBe(true)
      expect(permuting.has(textsOf(solution, 'permute-last-layer').join(' '))).toBe(true)
    }
  })

  test('step text follows the cube as it is turned', () => {
    // One move from solved on the entered right face: the cube is turned over
    // first, so that face is on the left.
    const steps = allSteps(solvePetrus(applyMoves(solvedCube(), parseMoves('R'))))
    expect(steps.map((step) => step.text)).toEqual(["L'"])
    expect(steps[0].moves).toEqual(parseMoves("R'"))
  })

  test('the plan through the first four stages counts its own moves', () => {
    const random = seededRandom(128)
    for (let n = 0; n < 20; n++) {
      const view = randomCube(random)
      const plan = planFrom(view)
      const turns = [plan.smallBlock, plan.bigBlock, plan.edgeOrientation, plan.firstTwoLayers]
      expect(turns.flat().filter((turn) => turn.kind === 'face').length).toBe(plan.moves)
      const reached = turns.reduce<CubieCube>(applyTurns, view)
      expect(lowerLayersSolved(reached) && TOP.every((i) => reached.eo[i] === 0)).toBe(true)
    }
  })
})

describe('the blocks', () => {
  test('the small block is built in the fewest moves there are', () => {
    const fewest = blockSolver({ pieces: SMALL_BLOCK })
    const random = seededRandom(130)
    let total = 0
    for (let n = 0; n < 200; n++) {
      const view = randomCube(random)
      const turns = solveSmallBlock(view)
      expect(smallBlockDone(applyTurns(view, turns))).toBe(true)
      expect(turns.length).toBe(smallBlockDistance(view))
      expect(turns.length).toBe(fewest(view)!.length)
      total += turns.length
    }
    // One corner chosen beforehand; the solver chooses among all eight.
    expect(total / 200).toBeLessThan(6.5)
  })

  test('the big block is added in the fewest right, top and front moves, with the small block untouched', () => {
    const fewest = blockSolver({ pieces: BIG_BLOCK, generators: EXTENSION_MOVES })
    const random = seededRandom(131)
    for (let n = 0; n < 200; n++) {
      const view = mixed(random, EXTENSION_MOVES)
      expect(smallBlockDone(view)).toBe(true)
      const ways = solveExtension(view, 6)
      expect(ways.length).toBeGreaterThan(0)
      expect(new Set(ways.map(formatTurns)).size).toBe(ways.length)
      for (const turns of ways) {
        expect(formatTurns(turns)).toMatch(/^[URF2' ]*$/)
        expect(bigBlockDone(applyTurns(view, turns))).toBe(true)
        expect(turns.length).toBe(extensionDistance(view))
        expect(turns.length).toBe(fewest(view)!.length)
      }
    }
  })

  test('the small block is planned with the big block in mind', () => {
    const random = seededRandom(132)
    let saved = 0
    for (let n = 0; n < 100; n++) {
      const view = randomCube(random)
      const plans = planBlocks(view)
      expect(plans.length).toBeGreaterThan(0)
      for (const { smallBlock, moves } of plans) {
        const reached = applyTurns(view, smallBlock)
        expect(smallBlockDone(reached)).toBe(true)
        expect(smallBlock.length).toBeLessThanOrEqual(smallBlockDistance(view) + 1)
        expect(moves).toBe(smallBlock.length + extensionDistance(reached))
      }
      expect(plans.map((plan) => plan.moves)).toEqual(plans.map((plan) => plan.moves).sort((a, b) => a - b))
      const plain = solveSmallBlock(view)
      const plainMoves = plain.length + extensionDistance(applyTurns(view, plain))
      expect(plans[0].moves).toBeLessThanOrEqual(plainMoves)
      saved += plainMoves - plans[0].moves
    }
    expect(saved / 100).toBeGreaterThan(1)
  })

  test('every example builds its block in the fewest moves there are', () => {
    for (const [name, sequence] of Object.entries(SMALL_BLOCK_EXAMPLES)) {
      const start = before(sequence)
      expect(smallBlockDone(start), name).toBe(false)
      expect(smallBlockDone(applyTurns(start, sequence)), name).toBe(true)
      expect(smallBlockDistance(start), name).toBe(parseTurns(sequence).length)
    }
    for (const [name, sequence] of Object.entries(BIG_BLOCK_EXAMPLES)) {
      const start = before(sequence)
      expect(sequence, name).toMatch(/^[URF2' ]*$/)
      expect(smallBlockDone(start) && !bigBlockDone(start), name).toBe(true)
      expect(bigBlockDone(applyTurns(start, sequence)), name).toBe(true)
      expect(extensionDistance(start), name).toBe(parseTurns(sequence).length)
      // The solver finds it among the shortest ways.
      expect(solveExtension(start, 20).map(formatTurns), name).toContain(sequence)
    }
  })

  test('the examples start as their comments say', () => {
    const small = (name: keyof typeof SMALL_BLOCK_EXAMPLES) => before(SMALL_BLOCK_EXAMPLES[name])
    const big = (name: keyof typeof BIG_BLOCK_EXAMPLES) => before(BIG_BLOCK_EXAMPLES[name])
    const placeOf = (view: CubieCube, edge: number) => view.ep.indexOf(edge)
    // The bottom-back edge (7) is home; the corner (6) is at the bottom front left, between its other two edges.
    expect(areSolved(small('lastTurn'), { edges: [7] })).toBe(true)
    expect(small('lastTurn').cp.indexOf(6)).toBe(5)
    expect([placeOf(small('lastTurn'), 6), placeOf(small('lastTurn'), 10)]).toEqual([9, 6])
    // The corner and the back-left edge (10) at the front left; the bottom-left edge (6) at the back left; the bottom-back edge home.
    expect(small('pairAndSquare').cp.indexOf(6)).toBe(5)
    expect(placeOf(small('pairAndSquare'), 10)).toBe(9)
    expect(placeOf(small('pairAndSquare'), 6)).toBe(10)
    expect(areSolved(small('pairAndSquare'), { edges: [7] })).toBe(true)
    // None of the four pieces is home.
    expect(SMALL_BLOCK.edges.some((edge) => placeOf(small('fromScratch'), edge) === edge)).toBe(false)
    expect(small('fromScratch').cp.indexOf(6)).toBe(1)
    expect(placeOf(small('fromScratch'), 6)).toBe(1)
    // Corner (5) at the top back right with the bottom-front edge (5) at the top right; the front-left edge (9) at the top front.
    expect(big('pairThenSquare').cp.indexOf(5)).toBe(3)
    expect([placeOf(big('pairThenSquare'), 5), placeOf(big('pairThenSquare'), 9)]).toEqual([0, 1])
    // Corner at the bottom back right with the front-left edge at the back right; the bottom-front edge at the top left.
    expect(big('pairFromTheBack').cp.indexOf(5)).toBe(7)
    expect([placeOf(big('pairFromTheBack'), 9), placeOf(big('pairFromTheBack'), 5)]).toEqual([11, 2])
    // Corner in its place, twisted.
    expect(big('twistedCorner').cp[5]).toBe(5)
    expect(big('twistedCorner').co[5]).not.toBe(0)
  })

  test('the extension pieces are named apart from the small block', () => {
    expect([...SMALL_BLOCK.corners, ...EXTENSION.corners].sort()).toEqual([...BIG_BLOCK.corners])
    expect([...SMALL_BLOCK.edges, ...EXTENSION.edges].sort((a, b) => a - b)).toEqual([...BIG_BLOCK.edges])
    // The big block is every piece that is on neither the right nor the top face.
    const free = applyTurns(applyTurns(solvedCube(), 'R'), 'U')
    const still = (pieces: number[], home: number[]) => home.filter((piece) => pieces[piece] === piece)
    expect(still(MOVE_CUBES[3].cp, still(MOVE_CUBES[0].cp, [0, 1, 2, 3, 4, 5, 6, 7]))).toEqual([...BIG_BLOCK.corners])
    expect(bigBlockDone(free)).toBe(true)
  })
})

describe('good and bad edges', () => {
  test('turns of the right and the top face keep the block and change no edge; quarter turns of the front and the back change four', () => {
    MOVE_CUBES.forEach((cube, move) => {
      const face = Math.floor(move / 3)
      expect(bigBlockDone(cube), `move ${move}`).toBe(face === 0 || face === 1)
      const quarterOfFrontOrBack = (face === 2 || face === 5) && move % 3 !== 1
      expect(cube.eo.filter((flip) => flip === 1).length, `move ${move}`).toBe(quarterOfFrontOrBack ? 4 : 0)
    })
  })

  test('with the block built and every edge good, the right and the top face finish the first two layers', () => {
    const random = seededRandom(140)
    for (let n = 0; n < 50; n++) {
      const view = mixed(random, FREE_MOVES)
      expect(edgesOriented(view)).toBe(true)
      const turns = solveLayers(view)
      const reached = applyTurns(view, turns)
      expect(lowerLayersSolved(reached) && TOP.every((i) => reached.eo[i] === 0)).toBe(true)
    }
  })

  test('the stickers tell a bad edge as the lesson says', () => {
    // Faces: 0 top (yellow in lessons), 1 right (orange).
    const random = seededRandom(141)
    for (let n = 0; n < 100; n++) {
      // Any arrangement of the seven free edges, each either way round.
      const view = solvedCube()
      const pieces = [...FREE_EDGE_PLACES].sort(() => random() - 0.5)
      FREE_EDGE_PLACES.forEach((place, i) => {
        view.ep[place] = pieces[i]
        view.eo[place] = random() < 0.5 ? 0 : 1
      })
      const stickers = stickersFromCube(view)
      FREE_EDGE_PLACES.forEach((place, i) => {
        // In the top layer the sticker facing up; at the other three places of the right face, the one not facing right.
        const [looked, other] = EDGE_STICKERS[place]
        expect(Math.floor(looked / 9), PLACES[i]).not.toBe(1)
        expect(Math.floor(looked / 9) === 0, PLACES[i]).toBe(place < 4)
        const hasTopColour = stickers[looked] === 0 || stickers[other] === 0
        // An edge with the top colour is good when that sticker shows it; any other is good unless it shows the right colour.
        const good = hasTopColour ? stickers[looked] === 0 : stickers[looked] !== 1
        expect(good, PLACES[i]).toBe(view.eo[place] === 0)
      })
    }
  })
})

describe('the taught edge sequences', () => {
  test('each is for the bad edges it is named after, makes them good, and puts the block back', () => {
    for (const [name, sequence] of Object.entries(EDGE_FLIPS)) {
      const start = before(sequence)
      expect(bigBlockDone(start), name).toBe(true)
      expect(badPlaces(start).join(''), name).toBe(name.toLowerCase())
      expect(edgesOriented(applyTurns(start, sequence)), name).toBe(true)
      // It changes those edges and no others, wherever it is used.
      const changed = applyTurns(solvedCube(), sequence)
      expect(bigBlockDone(changed), name).toBe(true)
      expect(changed.eo.filter((flip) => flip === 1).length, name).toBe(name.length / 2)
      // Free edges stay among the free places.
      for (const place of FREE_EDGE_PLACES) expect(FREE_EDGE_PLACES, name).toContain(changed.ep[place])
    }
  })

  test('each breaks the block with the front or the back face and turns only free faces meanwhile', () => {
    for (const [name, sequence] of Object.entries(EDGE_FLIPS)) {
      expect(sequence, name).toMatch(/^[FB]['2]?( [FBRU]['2]?)* [FB]['2]?$/)
      let view = solvedCube()
      const turns = parseTurns(sequence)
      turns.forEach((turn, i) => {
        view = applyTurn(view, turn)
        expect(bigBlockDone(view), `${name} after ${i + 1}`).toBe(i === turns.length - 1)
      })
    }
  })

  test('are two-edge, four-edge and six-edge sequences', () => {
    const sizes = Object.keys(EDGE_FLIPS).map((name) => name.length / 2)
    expect(sizes.filter((size) => size === 2)).toHaveLength(6)
    expect(sizes.filter((size) => size === 4)).toHaveLength(7)
    expect(sizes.filter((size) => size === 6)).toHaveLength(1)
  })
})

describe('edge orientation', () => {
  test('every set of bad edges is made good with taught sequences and free moves, in the fewest moves that takes', () => {
    expect(BAD_SETS).toHaveLength(64)
    let total = 0
    let longest = 0
    const used = new Set<string>()
    for (const bits of BAD_SETS) {
      const view = withBadEdges(bits)
      const ways = solveEdgeOrientation(view, 50)
      expect(ways.length, `${bits}`).toBeGreaterThan(0)
      for (const way of ways) {
        const turns = way.flatMap((part) => part.turns)
        expect(edgesOriented(applyTurns(view, turns)), `${bits}`).toBe(true)
        expect(turns.length, `${bits}`).toBe(edgeOrientationDistance(view))
        // Nothing joins up or cancels, so each sequence is played as taught.
        expect(tidy(turns), `${bits}`).toEqual(turns)
        for (const part of way) {
          const text = formatTurns(part.turns)
          if (part.taught) {
            expect(Object.values(EDGE_FLIPS), `${bits}`).toContain(text)
            used.add(text)
          } else {
            expect(FREE_MOVES.split(' '), `${bits}`).toContain(text)
          }
        }
        expect(way.at(-1)?.taught ?? true, `${bits}`).toBe(true)
      }
      const length = ways[0].flatMap((part) => part.turns).length
      total += length
      longest = Math.max(longest, length)
    }
    expect(solveEdgeOrientation(solvedCube())).toEqual([[]])
    expect(used.size).toBe(Object.keys(EDGE_FLIPS).length)
    expect(longest).toBe(9)
    expect(total / 64).toBeLessThan(5.5)
  })

  test('only the bad places matter, wherever the other pieces are', () => {
    const random = seededRandom(150)
    for (let n = 0; n < 100; n++) {
      // Mixed with whole sequences, so the block is always put back.
      const parts = [...FREE_MOVES.split(' '), ...Object.values(EDGE_FLIPS)]
      let view = solvedCube()
      for (let i = 0; i < 30; i++) view = applyTurns(view, parts[Math.floor(random() * parts.length)])
      expect(bigBlockDone(view)).toBe(true)
      const [way] = solveEdgeOrientation(view)
      const turns = way.flatMap((part) => part.turns)
      expect(edgesOriented(applyTurns(view, turns))).toBe(true)
      expect(turns.length).toBe(edgeOrientationDistance(withBadEdges(badEdges(view))))
    }
  })

  test("needs no more moves than Lars Petrus's own answer to each position he lists", () => {
    // From the three pages of positions on his site; a turn of two faces at once is written as two moves here.
    const listed = [
      "U' F R' F'", "R B U B'", "F' U' F", "R' B U B'", "U R B U B'", "F R' F'", "U F' U' F", "B U2 B'",
      "F' U' F2 R2 F'", "F' U' F2 R F'", "R F' U' F2 R F'", "F' U2 F2 R' F'", "U2 F B' R F' B", "F' U2 F2 R2 F'",
      "F R' F2 U' F", "F R F' B U B'", "R' F' U2 F2 R' F'", "F R' F2 U2 F", "F B' R F' B", "F R' F' B U' B'",
      "F B' R F' B2 U B'", "R F B' R F' B2 U B'", "R' F B' R F' B2 U B'",
    ]
    const counts = [0, 0, 0, 0, 0, 0, 0]
    for (const sequence of listed) {
      const start = before(sequence)
      expect(bigBlockDone(start), sequence).toBe(true)
      expect(edgesOriented(applyTurns(start, sequence)), sequence).toBe(true)
      counts[badPlaces(start).length]++
      expect(edgeOrientationDistance(start), sequence).toBeLessThanOrEqual(parseTurns(sequence).length)
    }
    expect(counts).toEqual([0, 0, 8, 0, 12, 0, 3])
  })
})

describe('the first two layers', () => {
  test('are finished with the right and the top face in the fewest moves, leaving whichever layer is quicker', () => {
    const random = seededRandom(160)
    let total = 0
    for (let n = 0; n < 200; n++) {
      const view = mixed(random, FREE_MOVES)
      const turns = solveLayers(view)
      const text = formatTurns(turns)
      expect(text).toMatch(/^[RU2' ]*?( ?z')?$/)
      const moves = turns.filter((turn) => turn.kind === 'face').length
      const top = layersDistance(view, 'top')
      const right = layersDistance(view, 'right')
      expect(layersDistance(view)).toBe(Math.min(top, right))
      expect(moves).toBe(Math.min(top, right))
      // The top layer is left for last unless the right layer is quicker.
      expect(text.endsWith("z'")).toBe(right < top)
      const reached = applyTurns(view, turns)
      expect(lowerLayersSolved(reached) && TOP.every((i) => reached.eo[i] === 0)).toBe(true)
      total += moves
    }
    expect(total / 200).toBeLessThan(14)
  })

  test('one move less is always one move away', () => {
    const turns = parseTurns(FREE_MOVES)
    const random = seededRandom(161)
    for (let n = 0; n < 100; n++) {
      const view = mixed(random, FREE_MOVES)
      for (const last of ['top', 'right'] as const) {
        const distance = layersDistance(view, last)
        const next = turns.map((turn) => layersDistance(applyTurn(view, turn), last))
        expect(Math.min(...next)).toBe(distance === 0 ? 1 : distance - 1)
        expect(Math.max(...next)).toBeLessThanOrEqual(distance + 1)
      }
    }
  })

  test('every example finishes the stage in the fewest moves for the layer it leaves', () => {
    for (const [name, sequence] of Object.entries(LAYER_EXAMPLES)) {
      const start = before(sequence)
      expect(edgesOriented(start), name).toBe(true)
      const turns = parseTurns(sequence)
      const moves = turns.filter((turn) => turn.kind === 'face')
      expect(formatTurns(moves), name).toMatch(/^[RU2' ]*$/)
      const last = turns.at(-1)!.kind === 'cube' ? 'right' : 'top'
      expect(name === 'rightLast', name).toBe(last === 'right')
      expect(layersDistance(start, last), name).toBe(moves.length)
      const reached = applyTurns(start, sequence)
      expect(lowerLayersSolved(reached), name).toBe(true)
    }
  })

  test('the examples start as their comments say', () => {
    const start = (name: keyof typeof LAYER_EXAMPLES) => before(LAYER_EXAMPLES[name])
    const done = (name: keyof typeof LAYER_EXAMPLES, moves: number) =>
      applyTurns(start(name), parseTurns(LAYER_EXAMPLES[name]).slice(0, moves))
    const frontSquare = { corners: [4], edges: [4, 8] }
    const backPair = { corners: [7], edges: [11] }
    // The square is made after two moves, on the right face, and the third turns it down.
    expect(areSolved(start('square'), frontSquare)).toBe(false)
    expect(areSolved(applyTurns(done('square', 2), 'R'), frontSquare)).toBe(false)
    expect(areSolved(applyTurns(done('square', 2), "R'"), frontSquare)).toBe(true)
    for (const name of ['backPair', 'misaligned'] as const) {
      expect(areSolved(start(name), frontSquare), name).toBe(true)
      expect(areSolved(start(name), backPair), name).toBe(false)
      // Corner and edge side by side on top, at the back right.
      expect(start(name).cp.indexOf(7), name).toBe(3)
      expect(start(name).ep.indexOf(11), name).toBe(0)
    }
    // Joined: both show the same colour on top. Misaligned: they do not.
    const topColours = (view: CubieCube) => [stickersFromCube(view)[2], stickersFromCube(view)[5]]
    expect(topColours(start('backPair'))).toEqual([5, 5])
    expect(topColours(start('misaligned'))).toEqual([3, 5])
    // The other choice: the left of the top layer is finished and the right layer is not.
    const left = { corners: [1, 2], edges: [1, 2, 3] }
    expect(areSolved(start('rightLast'), left)).toBe(false)
    expect(areSolved(done('rightLast', 2), left)).toBe(true)
  })
})
