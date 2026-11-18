import { describe, expect, test } from 'vitest'
import { isSolved, randomCube, solvedCube } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { cubeFaceSeenAs } from '../../cube/orientation.ts'
import { cubeAfterSteps } from '../../cube/steps.ts'
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
import { U_TURNS, applyTurns, formatTurns, invertTurns, parseTurns, viewOf } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { plainCost, solvePairs } from './pairs.ts'
import {
  ANGLE_ORIENTATIONS,
  CROSS_EXAMPLES,
  CROSS_ORIENTATIONS,
  DOT_ORIENTATIONS,
  LINE_ORIENTATIONS,
  ORIENTATIONS,
  PAIR_EXAMPLES,
} from './sequences.ts'
import { orientLastLayer, solveCfop } from './solver.ts'
import { CFOP_STAGES } from './stages.ts'
import type { CfopStage } from './stages.ts'

const TOP = [0, 1, 2, 3]
const BOTTOM = [4, 5, 6, 7]
const MIDDLE = [8, 9, 10, 11]
const CROSS = { edges: BOTTOM }
const TWO_LAYERS = { corners: BOTTOM, edges: [...BOTTOM, ...MIDDLE] }

const allSteps = (solution: MethodSolution) => solution.stages.flatMap((stage) => stage.steps)
const stepsOf = (solution: MethodSolution<CfopStage>, stage: CfopStage) =>
  solution.stages.find((entry) => entry.stage === stage)!.steps
const movesIn = (solution: MethodSolution<CfopStage>, stage: CfopStage) =>
  stepsOf(solution, stage).filter((step) => step.moves.length > 0).length
const textsOf = (solution: MethodSolution<CfopStage>, stage: CfopStage) =>
  stepsOf(solution, stage).map((step) => step.text)

/** The cube that `sequence` solves, held the usual way. */
const before = (sequence: string) => applyTurns(solvedCube(), invertTurns(parseTurns(sequence)))

/** The cube that the solver sees as `view`: the solver turns the entered cube over first. */
const enteredAs = (view: CubieCube) => viewOf(view, solveCfop(solvedCube()).start)

/** Notation without a turn of the top layer at either end. */
function withoutTopTurns(texts: readonly string[]): string {
  const kept = texts.slice()
  if (kept[0]?.startsWith('U')) kept.shift()
  if (kept.at(-1)?.startsWith('U')) kept.pop()
  return kept.join(' ')
}

describe('solveCfop', () => {
  test('solves random cubes in about 53 moves', () => {
    const random = seededRandom(70)
    const count = 300
    let total = 0
    let longest = 0
    const perStage = CFOP_STAGES.map(() => 0)
    let wholeCubeTurns = 0
    for (let n = 0; n < count; n++) {
      const cube = randomCube(random)
      const solution = solveCfop(cube)
      const steps = allSteps(solution)
      expect(isSolved(cubeAfterSteps(cube, steps, steps.length))).toBe(true)
      const moves = countMoves(solution)
      total += moves
      longest = Math.max(longest, moves)
      CFOP_STAGES.forEach((stage, i) => (perStage[i] += movesIn(solution, stage)))
      wholeCubeTurns += stepsOf(solution, 'first-two-layers').filter((step) => step.moves.length === 0).length
    }
    console.log(
      `cfop: average ${(total / count).toFixed(1)} moves, longest ${longest}; ` +
        `by stage ${perStage.map((sum) => (sum / count).toFixed(1)).join(' + ')}; ` +
        `${(wholeCubeTurns / count).toFixed(2)} whole-cube turns in the first two layers`,
    )
    expect(longest).toBeLessThan(75)
    expect(total / count).toBeLessThan(56)
    // The pairs: well under the 8 moves each that plain inserts take, and the cube is rarely turned.
    expect(perStage[1] / count).toBeLessThan(25)
    expect(wholeCubeTurns / count).toBeLessThan(1.5)
  })

  test('lists the four stages in order', () => {
    const solution = solveCfop(randomCube(seededRandom(71)))
    expect(solution.stages.map((stage) => stage.stage)).toEqual([...CFOP_STAGES])
  })

  test('a solved cube needs no steps', () => {
    expect(allSteps(solveCfop(solvedCube()))).toEqual([])
  })

  test('refuses an unsolvable cube', () => {
    const cube = solvedCube()
    cube.co[0] = 1
    expect(() => solveCfop(cube)).toThrow(/twisted-corner/)
  })

  test('starts with the entered top face at the bottom and the front unchanged', () => {
    const { start } = solveCfop(solvedCube())
    expect(cubeFaceSeenAs(start, 3)).toBe(0)
    expect(cubeFaceSeenAs(start, 2)).toBe(2)
  })

  test('each stage reaches its goal and keeps the earlier ones', () => {
    // Piece numbers on the cube as entered: its top layer is solved first.
    const first = [0, 1, 2, 3]
    const last = [4, 5, 6, 7]
    const checks: ((cube: CubieCube) => boolean)[] = [
      (cube) => areSolved(cube, { edges: first }),
      (cube) => areSolved(cube, { corners: first, edges: MIDDLE }),
      (cube) => last.every((i) => cube.co[i] === 0 && cube.eo[i] === 0),
      (cube) => isSolved(cube),
    ]
    const random = seededRandom(72)
    for (let n = 0; n < 100; n++) {
      const cube = randomCube(random)
      const solution = solveCfop(cube)
      const steps = allSteps(solution)
      let count = 0
      solution.stages.forEach((stage, index) => {
        count += stage.steps.length
        const reached = cubeAfterSteps(cube, steps, count)
        for (let earlier = 0; earlier <= index; earlier++) {
          expect(checks[earlier](reached), `${stage.stage} / check ${earlier + 1}`).toBe(true)
        }
      })
    }
  })

  test('the cross takes at most 8 moves and never turns the whole cube', () => {
    const random = seededRandom(73)
    for (let n = 0; n < 100; n++) {
      const cross = stepsOf(solveCfop(randomCube(random)), 'cross')
      expect(cross.length).toBeLessThanOrEqual(8)
      expect(cross.every((step) => step.moves.length === 1)).toBe(true)
    }
  })

  test('the first two layers turn only the top, right, left and front faces, and the whole cube', () => {
    const random = seededRandom(74)
    for (let n = 0; n < 100; n++) {
      const texts = textsOf(solveCfop(randomCube(random)), 'first-two-layers')
      for (const text of texts) expect(text).toMatch(/^[URLFy][2']?$/)
      // A whole-cube turn is never the last thing, nor done twice running.
      expect(texts.at(-1)?.startsWith('y')).not.toBe(true)
      expect(texts.some((text, i) => text.startsWith('y') && texts[i + 1]?.startsWith('y'))).toBe(false)
    }
  })

  test('the last layer is oriented with one taught sequence after lining up the top', () => {
    const taught = new Set<string>(Object.values(ORIENTATIONS))
    const used = new Set<string>()
    const random = seededRandom(75)
    for (let n = 0; n < 300; n++) {
      const texts = textsOf(solveCfop(randomCube(random)), 'orient-last-layer')
      if (texts.length === 0) continue
      const sequence = (texts[0].startsWith('U') ? texts.slice(1) : texts).join(' ')
      expect(taught.has(sequence), sequence).toBe(true)
      used.add(sequence)
    }
    expect(used.size).toBeGreaterThan(40)
  })

  test('the last layer is permuted with one taught sequence and turns of the top', () => {
    const taught = new Set(Object.values(PERMUTATIONS).map((text) => withoutTopTurns(text.split(' '))))
    const random = seededRandom(76)
    for (let n = 0; n < 300; n++) {
      const texts = textsOf(solveCfop(randomCube(random)), 'permute-last-layer')
      if (texts.every((text) => text.startsWith('U'))) {
        expect(texts.length).toBeLessThanOrEqual(1)
        continue
      }
      expect(taught.has(withoutTopTurns(texts)), texts.join(' ')).toBe(true)
    }
  })
})

describe('cross examples', () => {
  const solveCross = blockSolver({ pieces: CROSS })

  test.each(Object.entries(CROSS_EXAMPLES))('%s brings the cross home', (_, text) => {
    const start = before(text)
    expect(areSolved(start, CROSS)).toBe(false)
    expect(areSolved(applyTurns(start, text), CROSS)).toBe(true)
    // The solver's cross is never longer than the taught example.
    expect(solveCross(start)!.length).toBeLessThanOrEqual(text.split(' ').length)
  })
})

describe('pair examples', () => {
  const pair = { corners: [4], edges: [8] }
  const rest = { corners: [5, 6, 7], edges: [4, 5, 6, 7, 9, 10, 11] }

  test.each(Object.entries(PAIR_EXAMPLES))('%s puts the front-right pair in and keeps the rest', (_, text) => {
    const start = before(text)
    expect(areSolved(start, rest)).toBe(true)
    expect(areSolved(start, pair)).toBe(false)
    expect(areSolved(applyTurns(start, text), TWO_LAYERS)).toBe(true)
    // Only the pair and the top layer differ from a solved cube.
    expect(parseTurns(text).every((turn) => turn.kind === 'face')).toBe(true)
  })

  test.each(Object.entries(PAIR_EXAMPLES))('%s: the solver needs no more moves than the lesson', (_, text) => {
    const start = before(text)
    const turns = solvePairs(start)
    expect(areSolved(applyTurns(start, turns), TWO_LAYERS)).toBe(true)
    expect(turns.length).toBeLessThanOrEqual(text.split(' ').length)
  })
})

describe('solvePairs', () => {
  const solveCross = blockSolver({ pieces: CROSS })
  const withCross = (random: () => number) => {
    const cube = randomCube(random)
    return applyTurns(cube, solveCross(cube)!)
  }
  const faceMoves = (turns: readonly Turn[]) => turns.filter((turn) => turn.kind === 'face')

  test('refuses a cube without a cross', () => {
    expect(() => solvePairs(before('F'))).toThrow()
  })

  test('keeps the cross, and a pair that is in stays in', () => {
    const random = seededRandom(77)
    for (let n = 0; n < 100; n++) {
      const start = withCross(random)
      const turns = solvePairs(start)
      const end = applyTurns(start, turns)
      expect(areSolved(end, TWO_LAYERS)).toBe(true)
      // Pairs that were in at the start are never taken out: nothing is done at all when all four are.
      expect(solvePairs(end)).toEqual([])
      expect(faceMoves(turns).every((turn) => 'URLF'.includes(turn.family))).toBe(true)
    }
  })

  test('the plain way alone solves every cube, with top turns and three-move inserts', () => {
    const random = seededRandom(78)
    let total = 0
    let short = 0
    const count = 100
    for (let n = 0; n < count; n++) {
      const start = withCross(random)
      const plain = solvePairs(start, 0)
      expect(areSolved(applyTurns(start, plain), TWO_LAYERS)).toBe(true)
      // Between top turns, a side face goes one way and straight back.
      const sides = faceMoves(plain).filter((turn) => turn.family !== 'U')
      expect(sides.length % 2).toBe(0)
      for (let i = 0; i < sides.length; i += 2) {
        expect(sides[i + 1].family).toBe(sides[i].family)
        expect(sides[i + 1].quarters).toBe(4 - sides[i].quarters)
      }
      total += faceMoves(plain).length
      short += faceMoves(solvePairs(start)).length
    }
    console.log(
      `cfop pairs: plain way ${(total / count).toFixed(1)} moves, search ${(short / count).toFixed(1)} moves`,
    )
    expect(short).toBeLessThan(total)
  })

  test('the plain way reaches a pair wherever its pieces are, through any open slots', () => {
    // Corner places: position × 3 + twist; edge places: position × 2 + flip.
    const cornerOfSlot = [4, 5, 6, 7]
    const edgeOfSlot = [8, 9, 10, 11]
    for (let slot = 0; slot < 4; slot++) {
      for (let open = 0; open < 16; open++) {
        if (!((open >> slot) & 1)) continue
        const isOpen = (other: number) => ((open >> other) & 1) === 1
        const corners = [...TOP, ...cornerOfSlot.filter((_, other) => isOpen(other))]
        const edges = [...TOP, ...edgeOfSlot.filter((_, other) => isOpen(other))]
        for (const corner of corners) {
          for (const edge of edges) {
            for (let twist = 0; twist < 3; twist++) {
              for (let flip = 0; flip < 2; flip++) {
                const cost = plainCost(corner * 3 + twist, edge * 2 + flip, slot, open)
                expect(cost, `slot ${slot}, open ${open}, corner ${corner}/${twist}, edge ${edge}/${flip}`)
                  .toBeGreaterThanOrEqual(0)
                expect(cost).toBeLessThanOrEqual(20)
              }
            }
          }
        }
      }
    }
  })
})

describe('orientation sequences', () => {
  /** The shape the last-layer edges make before a sequence. */
  const shapeBefore = (text: string) => {
    const flips = before(text).eo.slice(0, 4)
    const up = flips.filter((flip) => flip === 0).length
    if (up !== 2) return up === 4 ? 'cross' : 'dot'
    return flips[0] === flips[2] ? 'line' : 'angle'
  }

  test('the seven with a cross are the shared corner sequences', () => {
    expect(CROSS_ORIENTATIONS).toBe(CORNER_ORIENTATIONS)
    expect(Object.keys(ORIENTATIONS)).toHaveLength(57)
  })

  test.each(Object.entries(ORIENTATIONS))('%s orients the last layer and keeps the first two', (_, text) => {
    const start = before(text)
    expect(lowerLayersSolved(start)).toBe(true)
    expect(lastLayerFacesUp(start)).toBe(false)
    expect(lastLayerFacesUp(applyTurns(start, text))).toBe(true)
    // No whole-cube turn in the middle of a sequence.
    expect(parseTurns(text).every((turn) => turn.kind !== 'cube')).toBe(true)
  })

  test('each is listed under the shape its edges make', () => {
    const groups = { cross: CROSS_ORIENTATIONS, line: LINE_ORIENTATIONS, angle: ANGLE_ORIENTATIONS, dot: DOT_ORIENTATIONS }
    for (const [shape, sequences] of Object.entries(groups)) {
      for (const [name, text] of Object.entries(sequences)) expect(shapeBefore(text), name).toBe(shape)
    }
    expect(Object.keys(LINE_ORIENTATIONS)).toHaveLength(15)
    expect(Object.keys(ANGLE_ORIENTATIONS)).toHaveLength(27)
    expect(Object.keys(DOT_ORIENTATIONS)).toHaveLength(8)
  })

  test('no two are the same case', () => {
    /** The case a sequence solves, however the top layer is turned first. */
    const caseOf = (text: string) =>
      U_TURNS.map((turn) => {
        const cube = applyTurns(before(text), turn)
        return `${cube.co.slice(0, 4)}/${cube.eo.slice(0, 4)}`
      }).sort()[0]
    expect(new Set(Object.values(ORIENTATIONS).map(caseOf)).size).toBe(57)
  })

  test('between them they orient all 216 ways the last layer can face, with one sequence each', () => {
    const taught = new Set<string>(Object.values(ORIENTATIONS))
    let count = 0
    let needNothing = 0
    for (let twists = 0; twists < 27; twists++) {
      for (let flips = 0; flips < 8; flips++) {
        const cube = solvedCube()
        cube.co[0] = twists % 3
        cube.co[1] = Math.floor(twists / 3) % 3
        cube.co[2] = Math.floor(twists / 9)
        cube.co[3] = (9 - cube.co[0] - cube.co[1] - cube.co[2]) % 3
        cube.eo[0] = flips & 1
        cube.eo[1] = (flips >> 1) & 1
        cube.eo[2] = (flips >> 2) & 1
        cube.eo[3] = (cube.eo[0] + cube.eo[1] + cube.eo[2]) % 2
        count++
        const turns = orientLastLayer(cube)
        expect(lastLayerFacesUp(applyTurns(cube, turns)), `${cube.co.slice(0, 4)}/${cube.eo.slice(0, 4)}`).toBe(true)
        if (turns.length === 0) {
          needNothing++
          continue
        }
        const sequence = turns[0].family === 'U' ? turns.slice(1) : turns
        expect(taught.has(formatTurns(sequence)), formatTurns(turns)).toBe(true)
      }
    }
    expect(count).toBe(216)
    expect(needNothing).toBe(1)
  })
})

describe('the solver on the lesson cubes', () => {
  test('a cube one orientation sequence from solved gets that stage only, plus a turn of the top at most', () => {
    for (const text of Object.values(ORIENTATIONS)) {
      const solution = solveCfop(enteredAs(before(text)))
      expect(stepsOf(solution, 'cross')).toEqual([])
      expect(stepsOf(solution, 'first-two-layers')).toEqual([])
      expect(stepsOf(solution, 'orient-last-layer').length).toBeGreaterThan(0)
    }
  })
})
