import { describe, expect, test } from 'vitest'
import { applyMoves, isSolved, parseMoves, randomCube, solvedCube } from '../../cube/cubie.ts'
import { DEFAULT_ORIENTATION, rotateStickers, turnCubeAbout } from '../../cube/orientation.ts'
import { cubeAfterSteps } from '../../cube/steps.ts'
import { cubeFromStickers, stickersFromCube } from '../../cube/stickers.ts'
import { seededRandom } from '../../cube/testing.ts'
import {
  applyTurns,
  formatTurns,
  invertTurns,
  parseTurns,
  stepsFromTurns,
  tidy,
  viewOf,
} from './turns.ts'

describe('parseTurns', () => {
  test('reads face, wide, slice and whole-cube turns', () => {
    expect(formatTurns(parseTurns("R U2 F' r Rw' M2 E S' x y2 z'"))).toBe("R U2 F' r r' M2 E S' x y2 z'")
  })

  test('refuses anything else', () => {
    expect(() => parseTurns('R Q')).toThrow(/Unknown turn "Q"/)
  })
})

describe('tidy', () => {
  test('joins turns of one family and drops those that cancel', () => {
    expect(formatTurns(tidy(parseTurns("R R U U' y y y M M2 F")))).toBe("R2 y' M' F")
  })
})

describe('viewOf', () => {
  test('matches the stickers seen after turning the whole cube', () => {
    const random = seededRandom(7)
    for (const axis of ['x', 'y', 'z'] as const) {
      for (let quarters = 1; quarters <= 3; quarters++) {
        const cube = randomCube(random)
        const turn = turnCubeAbout(DEFAULT_ORIENTATION, axis, quarters)
        const seen = cubeFromStickers(rotateStickers(stickersFromCube(cube), turn))
        expect(seen.ok && seen.cube).toEqual(viewOf(cube, turn))
      }
    }
  })
})

describe('applyTurns', () => {
  test('face turns are the plain moves', () => {
    const cube = randomCube(seededRandom(8))
    expect(applyTurns(cube, "R U' F2 D L B")).toEqual(applyMoves(cube, parseMoves("R U' F2 D L B")))
  })

  test('a whole-cube turn leaves a solved cube solved', () => {
    expect(isSolved(applyTurns(solvedCube(), "x y' z2"))).toBe(true)
  })

  test.each([
    ['r', "L x"],
    ['l', "R x'"],
    ['u', 'D y'],
    ['d', "U y'"],
    ['f', 'B z'],
    ['b', "F z'"],
    ['M', "R L' x'"],
    ['E', "U D' y'"],
    ['S', "F' B z"],
    ['M2', 'R2 L2 x2'],
  ])('%s is the same as %s', (turn, same) => {
    const cube = randomCube(seededRandom(9))
    expect(applyTurns(cube, turn)).toEqual(applyTurns(cube, same))
  })

  test('well-known sequences with slices and wide turns do what they should', () => {
    // Flips four edges; doing it twice flips them back.
    const once = applyTurns(solvedCube(), "M' U M' U M' U M' U")
    expect(isSolved(once)).toBe(false)
    expect(once.eo.filter((flip) => flip === 1)).toHaveLength(4)
    expect(isSolved(applyTurns(once, "M' U M' U M' U M' U"))).toBe(true)
    // A wide sequence that only twists last-layer corners keeps the two lower layers.
    const twisted = applyTurns(solvedCube(), "r U R' U' r' F R F'")
    expect(twisted.ep.slice(4)).toEqual([4, 5, 6, 7, 8, 9, 10, 11])
    expect(twisted.cp.slice(4)).toEqual([4, 5, 6, 7])
    // The H permutation swaps two pairs of edges: twice is solved.
    const h = "M2 U M2 U2 M2 U M2"
    expect(isSolved(applyTurns(applyTurns(solvedCube(), h), h))).toBe(true)
  })

  test('undone by the inverse turns', () => {
    const cube = randomCube(seededRandom(10))
    const turns = parseTurns("R u' M x F2 S' z y r2 E")
    expect(applyTurns(applyTurns(cube, turns), invertTurns(turns))).toEqual(cube)
  })
})

describe('stepsFromTurns', () => {
  test('the steps do to the entered cube what the turns do to the view', () => {
    const random = seededRandom(11)
    const start = turnCubeAbout(turnCubeAbout(DEFAULT_ORIENTATION, 'x', 1), 'y', 3)
    const turns = parseTurns("R u' M x F2 S' z y r2 E L' b D")
    for (let n = 0; n < 5; n++) {
      const cube = randomCube(random)
      const { steps, orientation } = stepsFromTurns(turns, start)
      const end = cubeAfterSteps(cube, steps, steps.length)
      expect(viewOf(end, orientation)).toEqual(applyTurns(viewOf(cube, start), turns))
    }
  })

  test('a wide turn names the layers that turn and the face left behind', () => {
    const { steps } = stepsFromTurns(parseTurns('r'))
    expect(steps[0].moves).toEqual(parseMoves('L'))
    expect(steps[0].layers).toEqual({ move: parseMoves('R')[0], layers: [1, 0] })
    expect(steps[0].orientation).toEqual(turnCubeAbout(DEFAULT_ORIENTATION, 'x', 1))
  })
})
