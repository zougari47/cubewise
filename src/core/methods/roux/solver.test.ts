import { describe, expect, test } from 'vitest'
import { isSolved, multiply, randomCube, solvedCube } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { cubeFaceSeenAs } from '../../cube/orientation.ts'
import { cubeAfterSteps } from '../../cube/steps.ts'
import { seededRandom } from '../../cube/testing.ts'
import { countMoves } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { areSolved } from '../shared/search.ts'
import { U_TURNS, applyTurn, applyTurns, formatTurns, invertTurns, parseTurns, viewOf } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { solveFirstBlock, solveSecondBlock } from './blocks.ts'
import {
  BOTH_BLOCKS,
  FIRST_BLOCK,
  LAST_SIX_PLACES,
  SECOND_BLOCK,
  blockFrame,
  blocksDone,
  firstBlockDone,
  lastEdgesOriented,
  sideEdgesDone,
  topCornerTurns,
  topCornersDone,
} from './frame.ts'
import {
  orientLastEdges,
  solveMiddleEdges,
  solveSideEdges,
  turnsForMiddleEdges,
  turnsForSideEdges,
  turnsToOrient,
} from './lse.ts'
import {
  FIRST_BLOCK_EXAMPLES,
  MIDDLE_EDGE_EXAMPLES,
  ORIENT_EXAMPLES,
  SECOND_BLOCK_EXAMPLES,
  SIDE_EDGE_EXAMPLES,
  TOP_CORNERS,
} from './sequences.ts'
import type { TopCornersName } from './sequences.ts'
import { solveRoux, solveTopCorners } from './solver.ts'
import { ROUX_STAGES } from './stages.ts'
import type { RouxStage } from './stages.ts'

const TOP = [0, 1, 2, 3]

const allSteps = (solution: MethodSolution) => solution.stages.flatMap((stage) => stage.steps)
const textsOf = (solution: MethodSolution<RouxStage>, stage: RouxStage) =>
  solution.stages.find((entry) => entry.stage === stage)!.steps.map((step) => step.text)

/** The cube that `sequence` solves, held the usual way. */
const before = (sequence: string) => applyTurns(solvedCube(), invertTurns(parseTurns(sequence)))

/** A cube with both blocks built and everything else mixed by turns that keep them. */
function mixed(random: () => number, generators: string, length = 40): CubieCube {
  const turns = parseTurns(generators)
  let view = solvedCube()
  for (let n = 0; n < length; n++) view = applyTurn(view, turns[Math.floor(random() * turns.length)])
  return view
}

/** Notation without a turn of the top layer in front. */
const withoutTopTurn = (turns: readonly Turn[]) =>
  formatTurns(turns[0]?.family === 'U' ? turns.slice(1) : turns)

const TAUGHT_TOP_CORNERS = new Set<string>(
  Object.values(TOP_CORNERS).map((sequence) => formatTurns(parseTurns(sequence))),
)

describe('solveRoux', () => {
  test('solves random cubes in about 39 moves', () => {
    const random = seededRandom(90)
    const count = 300
    const building = performance.now()
    solveRoux(randomCube(random))
    const built = performance.now() - building
    let total = 0
    let longest = 0
    let slowest = 0
    const perStage = ROUX_STAGES.map(() => 0)
    const started = performance.now()
    for (let n = 0; n < count; n++) {
      const cube = randomCube(random)
      const before = performance.now()
      const solution = solveRoux(cube)
      slowest = Math.max(slowest, performance.now() - before)
      const steps = allSteps(solution)
      expect(isSolved(cubeAfterSteps(cube, steps, steps.length))).toBe(true)
      // The Roux method never turns the whole cube.
      expect(steps.every((step) => step.moves.length > 0)).toBe(true)
      const moves = countMoves(solution)
      total += moves
      longest = Math.max(longest, moves)
      solution.stages.forEach((stage, i) => (perStage[i] += stage.steps.length))
    }
    const each = (performance.now() - started) / count
    console.log(
      `roux: average ${(total / count).toFixed(1)} moves, longest ${longest}; ` +
        `per stage ${perStage.map((sum) => (sum / count).toFixed(1)).join(' / ')}; ` +
        `tables ${built.toFixed(0)} ms, then ${each.toFixed(1)} ms a solve, slowest ${slowest.toFixed(0)} ms`,
    )
    expect(total / count).toBeGreaterThan(36)
    expect(total / count).toBeLessThan(42)
    expect(longest).toBeLessThan(60)
    expect(each).toBeLessThan(300)
  })

  test('lists the six stages in order', () => {
    const solution = solveRoux(randomCube(seededRandom(91)))
    expect(solution.stages.map((stage) => stage.stage)).toEqual([...ROUX_STAGES])
  })

  test('a solved cube needs no steps', () => {
    expect(allSteps(solveRoux(solvedCube()))).toEqual([])
  })

  test('starts with the entered top face at the bottom', () => {
    const random = seededRandom(92)
    for (let n = 0; n < 20; n++) {
      expect(cubeFaceSeenAs(solveRoux(randomCube(random)).start, 3)).toBe(0)
    }
  })

  test('each stage reaches its own goal and keeps the earlier ones', () => {
    const checks: ((view: CubieCube) => boolean)[] = [
      firstBlockDone,
      blocksDone,
      topCornersDone,
      lastEdgesOriented,
      sideEdgesDone,
      isSolved,
    ]
    const random = seededRandom(93)
    for (let n = 0; n < 100; n++) {
      const cube = randomCube(random)
      const solution = solveRoux(cube)
      let view = viewOf(cube, solution.start)
      solution.stages.forEach((stage, index) => {
        view = applyTurns(view, stage.steps.map((step) => step.text).join(' '))
        for (let earlier = 0; earlier <= index; earlier++) {
          expect(checks[earlier](view), `${stage.stage} / check ${earlier + 1}`).toBe(true)
        }
      })
    }
  })

  test('the first block is home on the cube as held, before any centre has moved', () => {
    const random = seededRandom(94)
    for (let n = 0; n < 50; n++) {
      const cube = randomCube(random)
      const solution = solveRoux(cube)
      const view = applyTurns(viewOf(cube, solution.start), textsOf(solution, 'first-block').join(' '))
      expect(areSolved(view, FIRST_BLOCK)).toBe(true)
    }
  })

  test('each stage uses only the turns the method uses there', () => {
    const random = seededRandom(95)
    for (let n = 0; n < 100; n++) {
      const solution = solveRoux(randomCube(random))
      expect(textsOf(solution, 'first-block').join(' ')).toMatch(/^[URFDLB2' ]*$/)
      expect(textsOf(solution, 'first-block').length).toBeLessThanOrEqual(10)
      expect(textsOf(solution, 'second-block').join(' ')).toMatch(/^[URrM2' ]*$/)
      const corners = textsOf(solution, 'top-corners')
      if (corners.length > 0) {
        expect(TAUGHT_TOP_CORNERS.has(withoutTopTurn(parseTurns(corners.join(' '))))).toBe(true)
      }
      expect(textsOf(solution, 'orient-last-edges').join(' ')).toMatch(/^[UM2' ]*$/)
      expect(textsOf(solution, 'side-edges').join(' ')).toMatch(/^[UM2' ]*$/)
      expect(textsOf(solution, 'middle-edges').join(' ')).toMatch(/^(U2|M2|M'|M| )*$/)
    }
  })

  test('refuses an unsolvable cube', () => {
    const cube = solvedCube()
    cube.co[0] = 1
    expect(() => solveRoux(cube)).toThrow(/twisted-corner/)
  })
})

describe('the block frame', () => {
  test('is the view itself until a centre moves', () => {
    expect(blockFrame(solvedCube())).toEqual({ cube: solvedCube(), centres: 0 })
    expect(blockFrame(applyTurns(solvedCube(), 'R U F'))).toBeNull()
  })

  test('turns of the middle slice leave both blocks built, though the view shows them elsewhere', () => {
    for (const turns of ['M', "M'", 'M2', "r R'", "M U2 M' U' M2"]) {
      const view = applyTurns(solvedCube(), turns)
      expect(blocksDone(view), turns).toBe(true)
    }
    expect(areSolved(applyTurns(solvedCube(), 'M'), BOTH_BLOCKS)).toBe(false)
    expect(blockFrame(applyTurns(solvedCube(), 'M'))!.centres % 2).toBe(1)
    expect(blockFrame(applyTurns(solvedCube(), 'M2'))!.centres).toBe(2)
    expect(blockFrame(applyTurns(solvedCube(), "r M U M' r'"))!.centres).toBe(0)
  })

  test('a turn that breaks a block is seen', () => {
    expect(firstBlockDone(applyTurns(solvedCube(), 'M F'))).toBe(false)
    // The left face turned alone still has a block at the bottom left, made of other pieces.
    expect(firstBlockDone(applyTurns(solvedCube(), 'M L'))).toBe(true)
    expect(blocksDone(applyTurns(solvedCube(), 'M L'))).toBe(false)
    expect(firstBlockDone(applyTurns(solvedCube(), 'M R'))).toBe(true)
    expect(blocksDone(applyTurns(solvedCube(), 'M R'))).toBe(false)
  })

  test('in the frame, each turn of the later stages moves the pieces the same way every time', () => {
    const random = seededRandom(96)
    const turns = parseTurns("U U' U2 R R' R2 r r' r2 M M' M2")
    let view = applyTurns(solvedCube(), 'R U r')
    for (let n = 0; n < 300; n++) {
      const turn = turns[Math.floor(random() * turns.length)]
      const next = applyTurn(view, turn)
      expect(blockFrame(next)!.cube).toEqual(multiply(blockFrame(view)!.cube, turn.effect))
      view = next
    }
  })

  test('a cube with the centres back and the frame solved is solved', () => {
    const random = seededRandom(97)
    for (let n = 0; n < 200; n++) {
      const view = mixed(random, "U U' U2 M M' M2", 12)
      const frame = blockFrame(view)!
      expect(isSolved(view)).toBe(frame.centres === 0 && isSolved(frame.cube))
    }
  })
})

describe('the blocks', () => {
  test('the first block takes about seven moves and leaves a short second block', () => {
    const random = seededRandom(98)
    let total = 0
    for (let n = 0; n < 100; n++) {
      const view = randomCube(random)
      const first = solveFirstBlock(view)
      const built = applyTurns(view, first.turns)
      expect(areSolved(built, FIRST_BLOCK)).toBe(true)
      expect(first.turns.length).toBeLessThanOrEqual(10)
      expect(solveSecondBlock(built)).toHaveLength(first.secondBlock)
      total += first.turns.length
    }
    expect(total / 100).toBeLessThan(8)
  })

  test('the plain way builds the first block when the search is given no time', () => {
    const random = seededRandom(99)
    for (let n = 0; n < 100; n++) {
      const view = randomCube(random)
      const plain = solveFirstBlock(view, 0)
      expect(areSolved(applyTurns(view, plain.turns), FIRST_BLOCK)).toBe(true)
      expect(plain.turns.length).toBeLessThanOrEqual(20)
      expect(plain.turns.length).toBeGreaterThanOrEqual(solveFirstBlock(view).turns.length)
    }
  })

  test('the second block is built from any state, in at most 16 turns of R, r, U and M', () => {
    const random = seededRandom(100)
    for (let n = 0; n < 300; n++) {
      // The first block and nothing else is home, with the centres wherever they have got to.
      const view = mixed(random, "U U' U2 R R' R2 r r' r2 M M' M2")
      const turns = solveSecondBlock(view)
      expect(turns.length).toBeLessThanOrEqual(16)
      expect(formatTurns(turns)).toMatch(/^[URrM2' ]*$/)
      expect(blocksDone(applyTurns(view, turns))).toBe(true)
    }
  })

  test('the block examples are as short as their cases allow', () => {
    for (const [name, sequence] of Object.entries(FIRST_BLOCK_EXAMPLES)) {
      const start = before(sequence)
      expect(areSolved(start, FIRST_BLOCK), name).toBe(false)
      expect(solveFirstBlock(start).turns, name).toHaveLength(parseTurns(sequence).length)
      expect(areSolved(applyTurns(start, sequence), FIRST_BLOCK), name).toBe(true)
    }
    for (const [name, sequence] of Object.entries(SECOND_BLOCK_EXAMPLES)) {
      const start = before(sequence)
      expect(areSolved(start, FIRST_BLOCK), name).toBe(true)
      expect(areSolved(start, SECOND_BLOCK), name).toBe(false)
      expect(sequence, name).toMatch(/^[URrM2' ]*$/)
      expect(solveSecondBlock(start), name).toHaveLength(parseTurns(sequence).length)
      expect(areSolved(applyTurns(start, sequence), BOTH_BLOCKS), name).toBe(true)
    }
  })

  test('the block examples start as their comments say', () => {
    // [piece, position, twist or flip] of the pieces each comment names.
    const corner = (cube: CubieCube, piece: number) => {
      const position = cube.cp.indexOf(piece)
      return [position, cube.co[position]]
    }
    const edge = (cube: CubieCube, piece: number) => {
      const position = cube.ep.indexOf(piece)
      return [position, cube.eo[position]]
    }
    const first = FIRST_BLOCK_EXAMPLES
    expect(edge(before(first.bottomEdge), 6)[0]).toBe(1)
    // Joined along the left of the top layer: corner at the back or front, edge at the top left.
    expect(corner(before(first.joinedPair), 5)[0]).toBe(2)
    expect(edge(before(first.joinedPair), 9)[0]).toBe(2)
    expect(areSolved(before(first.joinedPair), { corners: [6], edges: [6, 10] })).toBe(true)
    expect(corner(before(first.splitPair), 5)[0]).toBe(3)
    expect(edge(before(first.splitPair), 9)[0]).toBe(8)
    expect(corner(before(first.backPair), 6)[0]).toBe(1)
    expect(edge(before(first.backPair), 10)[0]).toBe(2)
    expect(areSolved(before(first.backPair), { corners: [5], edges: [6, 9] })).toBe(true)

    const second = SECOND_BLOCK_EXAMPLES
    expect(edge(before(second.bottomEdge), 4)).toEqual([1, 0])
    expect(corner(before(second.frontPair), 4)[0]).toBe(0)
    expect(edge(before(second.frontPair), 8)[0]).toBe(0)
    expect(corner(before(second.backPair), 7)[0]).toBe(3)
    expect(edge(before(second.backPair), 11)[0]).toBe(0)
    expect(corner(before(second.wideInsert), 4)[0]).toBe(1)
    expect(edge(before(second.wideInsert), 8)[0]).toBe(5)
    expect(corner(before(second.throughMiddle), 4)).toEqual([4, 0])
    expect(edge(before(second.throughMiddle), 8)).toEqual([5, 1])
    for (const name of ['frontPair', 'backPair', 'wideInsert'] as const) {
      expect(countHome(before(second[name])), name).toBe(3)
    }
    expect(countHome(before(second.throughMiddle))).toBe(4)
  })
})

/** How many of the five second-block pieces are home. */
const countHome = (cube: CubieCube) =>
  [4, 7].filter((i) => cube.cp[i] === i && cube.co[i] === 0).length +
  [4, 8, 11].filter((i) => cube.ep[i] === i && cube.eo[i] === 0).length

describe('the top corners', () => {
  const entries = Object.entries(TOP_CORNERS) as [TopCornersName, string][]
  const group = (name: string) => name.split('-')[0]

  /** Which way each top corner faces before the sequence, clockwise from the front left: 0 is up. */
  const twists = (sequence: string) => [1, 0, 3, 2].map((place) => before(sequence).co[place])

  test('there are 42 sequences', () => {
    expect(entries).toHaveLength(42)
  })

  test('each keeps both blocks, puts the centres back and solves its own case', () => {
    for (const [name, sequence] of entries) {
      const after = applyTurns(solvedCube(), sequence)
      expect(areSolved(after, BOTH_BLOCKS), name).toBe(true)
      expect(blockFrame(after)!.centres, name).toBe(0)
      expect(topCornersDone(after), name).toBe(false)
      const start = before(sequence)
      expect(topCornersDone(start), name).toBe(false)
      expect(areSolved(applyTurns(start, sequence), { ...BOTH_BLOCKS, corners: [0, 1, 2, 3, 4, 5, 6, 7] })).toBe(true)
    }
  })

  test('each still works when the centres of the middle slice are turned', () => {
    for (const [name, sequence] of entries) {
      for (const slice of ['M', 'M2', "M'"]) {
        const start = applyTurns(before(sequence), slice)
        expect(topCornersDone(start), name).toBe(false)
        expect(topCornersDone(applyTurns(start, sequence)), name).toBe(true)
      }
    }
  })

  test('each belongs to the group it is named after', () => {
    const facingUp = (sequence: string) => twists(sequence).filter((twist) => twist === 0).length
    for (const [name, sequence] of entries) {
      const twist = twists(sequence)
      const up = twist.map((value) => value === 0)
      const others = twist.filter((value) => value !== 0)
      switch (group(name)) {
        case 'o':
          expect(facingUp(sequence), name).toBe(4)
          break
        case 'h':
        case 'pi': {
          expect(facingUp(sequence), name).toBe(0)
          // Twists alternate round the layer when the corners face out in two pairs on opposite sides.
          const alternate = twist[0] === twist[2] && twist[1] === twist[3]
          expect(alternate, name).toBe(group(name) === 'h')
          break
        }
        case 'u':
        case 't':
          expect(facingUp(sequence), name).toBe(2)
          expect(up[0] === up[2], name).toBe(false)
          break
        case 'l':
          expect(facingUp(sequence), name).toBe(2)
          expect(up[0] === up[2], name).toBe(true)
          break
        case 's':
          // Each of the three is twisted anticlockwise, so needs a clockwise twist.
          expect(others, name).toEqual([2, 2, 2])
          break
        case 'as':
          expect(others, name).toEqual([1, 1, 1])
          break
        default:
          throw new Error(`Unknown group in "${name}"`)
      }
    }
  })

  test('U cases have the other two corners facing the same side, T cases facing opposite sides', () => {
    for (const [name, sequence] of entries) {
      if (group(name) !== 'u' && group(name) !== 't') continue
      const twist = twists(sequence)
      // Round the layer, the two corners that do not face up are neighbours; they face the
      // same side when one is twisted each way and the first of the two (clockwise) is anticlockwise.
      const first = [0, 1, 2, 3].find((i) => twist[i] !== 0 && twist[(i + 1) % 4] !== 0)!
      const pair = [twist[first], twist[(first + 1) % 4]]
      expect(pair[0] !== pair[1], name).toBe(true)
      const sameSide = sideFacing(first, pair[0]) === sideFacing((first + 1) % 4, pair[1])
      expect(sameSide, name).toBe(group(name) === 'u')
    }
  })

  test('the two O cases swap two corners: side by side, and diagonally', () => {
    const places = (sequence: string) => before(sequence).cp.slice(0, 4)
    const moved = (sequence: string) => {
      // Up to a turn of the top layer, the fewest corners that are not where they belong.
      let fewest = 4
      for (const turn of U_TURNS) {
        const cube = applyTurns(before(sequence), turn)
        fewest = Math.min(fewest, TOP.filter((place) => cube.cp[place] !== place).length)
      }
      return fewest
    }
    expect(moved(TOP_CORNERS['o-adjacent-swap'])).toBe(2)
    expect(moved(TOP_CORNERS['o-diagonal-swap'])).toBe(2)
    const swapped = (sequence: string) => TOP.filter((place) => places(sequence)[place] !== place)
    expect(Math.abs(swapped(TOP_CORNERS['o-adjacent-swap'])[0] - swapped(TOP_CORNERS['o-adjacent-swap'])[1]) % 2).toBe(1)
    expect(swapped(TOP_CORNERS['o-diagonal-swap'])[1] - swapped(TOP_CORNERS['o-diagonal-swap'])[0]).toBe(2)
  })

  test('the set is complete: every arrangement of the top corners is one turn of the top and one sequence away', () => {
    const used = new Set<string>()
    let cases = 0
    const permute = (pieces: number[], chosen: number[] = []): number[][] =>
      pieces.length === 0
        ? [chosen]
        : pieces.flatMap((piece) => permute(pieces.filter((other) => other !== piece), [...chosen, piece]))
    for (const places of permute(TOP)) {
      for (let twist = 0; twist < 27; twist++) {
        const cube = solvedCube()
        const co = [twist % 3, Math.floor(twist / 3) % 3, Math.floor(twist / 9)]
        co.push((30 - co[0] - co[1] - co[2]) % 3)
        TOP.forEach((place) => {
          cube.cp[place] = places[place]
          cube.co[place] = co[place]
        })
        const turns = solveTopCorners(cube)
        expect(topCornersDone(applyTurns(cube, turns))).toBe(true)
        if (turns.length === 0) continue
        cases++
        const sequence = withoutTopTurn(turns)
        expect(TAUGHT_TOP_CORNERS.has(sequence)).toBe(true)
        used.add(sequence)
      }
    }
    // 648 arrangements, 4 of them solved; and no sequence could be left out.
    expect(cases).toBe(644)
    expect(used.size).toBe(42)
  })
})

/** The side face (0 front, 1 right, 2 back, 3 left) that the top sticker of a corner faces. */
function sideFacing(corner: number, twist: number): number {
  // Corners clockwise from the front left; a corner sits between side `corner + 3` and side `corner`.
  // Twisted clockwise (1), its top sticker faces the side clockwise of it.
  return twist === 1 ? corner : (corner + 3) % 4
}

describe('the last six edges', () => {
  test('are solved from every state tried, in three parts, with M and U only', () => {
    const random = seededRandom(101)
    const longest = [0, 0, 0]
    let total = 0
    const count = 2000
    for (let n = 0; n < count; n++) {
      let view = mixed(random, "U U' U2 M M' M2", 200)
      expect(topCornersDone(view)).toBe(true)
      const parts = [orientLastEdges, solveSideEdges, solveMiddleEdges]
      const goals = [lastEdgesOriented, sideEdgesDone, isSolved]
      parts.forEach((solve, part) => {
        const turns = solve(view)
        expect(formatTurns(turns)).toMatch(part === 2 ? /^(U2|M2|M'|M| )*$/ : /^[UM2' ]*$/)
        view = applyTurns(view, turns)
        expect(goals[part](view)).toBe(true)
        longest[part] = Math.max(longest[part], turns.length)
        total += turns.length
      })
    }
    console.log(`roux last six edges: average ${(total / count).toFixed(1)} turns, longest parts ${longest.join(' / ')}`)
    expect(longest[0]).toBeLessThanOrEqual(11)
    expect(longest[1]).toBeLessThanOrEqual(9)
    expect(longest[2]).toBeLessThanOrEqual(8)
    expect(total / count).toBeLessThan(15)
  })

  test('a part that is done needs no turns', () => {
    expect(orientLastEdges(before(SIDE_EDGE_EXAMPLES.swapped))).toEqual([])
    expect(solveSideEdges(before(MIDDLE_EDGE_EXAMPLES.threeEdges))).toEqual([])
    expect(solveMiddleEdges(solvedCube())).toEqual([])
  })

  test('each orientation example flips the edges its comment names, in the fewest turns', () => {
    // The six places: top right, top front, top left, top back, bottom front, bottom back.
    const bad: Record<keyof typeof ORIENT_EXAMPLES, number[]> = {
      arrow: [1, 1, 1, 0, 1, 0],
      twoAndTwo: [1, 1, 0, 0, 1, 1],
      twoBeside: [1, 1, 0, 0, 0, 0],
      fourOnTop: [1, 1, 1, 1, 0, 0],
      twoBelow: [0, 0, 0, 0, 1, 1],
      allSix: [1, 1, 1, 1, 1, 1],
    }
    for (const [name, sequence] of Object.entries(ORIENT_EXAMPLES)) {
      const start = before(sequence)
      const frame = blockFrame(start)!
      expect(frame.centres, name).toBe(0)
      expect(topCornersDone(start), name).toBe(true)
      expect(LAST_SIX_PLACES.map((place) => frame.cube.eo[place]), name).toEqual(
        bad[name as keyof typeof ORIENT_EXAMPLES],
      )
      expect(sequence, name).toMatch(/^[UM2' ]*$/)
      expect(turnsToOrient(start), name).toBe(parseTurns(sequence).length)
      expect(lastEdgesOriented(applyTurns(start, sequence)), name).toBe(true)
    }
  })

  test('each side-edge example brings both edges home in the fewest turns', () => {
    // Where the top-left and the top-right edge start, as edge positions.
    const starts: Record<keyof typeof SIDE_EDGE_EXAMPLES, [number, number]> = {
      bothBelow: [5, 7],
      bothInMiddle: [1, 3],
      swapped: [0, 2],
      oneBelow: [0, 5],
    }
    for (const [name, sequence] of Object.entries(SIDE_EDGE_EXAMPLES)) {
      const start = before(sequence)
      expect(lastEdgesOriented(start), name).toBe(true)
      expect(topCornerTurns(start), name).toBe(0)
      expect([start.ep.indexOf(2), start.ep.indexOf(0)], name).toEqual(
        starts[name as keyof typeof SIDE_EDGE_EXAMPLES],
      )
      expect(sequence, name).toMatch(/^[UM2' ]*$/)
      // The first example ends with a turn that belongs to the next stage.
      const own = name === 'bothBelow' ? parseTurns(sequence).slice(0, -1) : parseTurns(sequence)
      expect(turnsForSideEdges(start), name).toBe(own.length)
      expect(sideEdgesDone(applyTurns(start, own)), name).toBe(true)
      expect(sideEdgesDone(applyTurns(start, sequence)), name).toBe(true)
      expect(blockFrame(applyTurns(start, sequence))!.centres, name).toBe(0)
    }
  })

  test('each middle-edge example solves the cube in the fewest turns', () => {
    // Where the top-front, top-back, bottom-front and bottom-back edges start.
    const starts: Record<keyof typeof MIDDLE_EDGE_EXAMPLES, number[]> = {
      threeEdges: [3, 5, 1, 7],
      threeEdgesBack: [5, 1, 3, 7],
      frontAndBack: [3, 1, 7, 5],
      topAndBottom: [5, 7, 1, 3],
      diagonal: [7, 5, 3, 1],
    }
    for (const [name, sequence] of Object.entries(MIDDLE_EDGE_EXAMPLES)) {
      const start = before(sequence)
      expect(sideEdgesDone(start), name).toBe(true)
      expect([1, 3, 5, 7].map((edge) => start.ep.indexOf(edge)), name).toEqual(
        starts[name as keyof typeof MIDDLE_EDGE_EXAMPLES],
      )
      expect(sequence, name).toMatch(/^(U2|M2|M'|M| )*$/)
      expect(turnsForMiddleEdges(start), name).toBe(parseTurns(sequence).length)
      expect(isSolved(applyTurns(start, sequence)), name).toBe(true)
    }
  })
})
