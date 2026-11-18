import { beforeAll, describe, expect, test } from 'vitest'
import {
  applyMoves,
  formatMoves,
  isSolved,
  parseMoves,
  randomCube,
  solvedCube,
} from './cubie.ts'
import type { CubieCube } from './cubie.ts'
import { prepareSolver, solve } from './solver.ts'
import { randomMoves, seededRandom } from './testing.ts'

/** The solution solves the cube and never turns the same face twice in a row. */
function expectGoodSolution(cube: CubieCube, solution: readonly number[]): void {
  const text = formatMoves(solution)
  expect(isSolved(applyMoves(cube, solution)), text).toBe(true)
  for (let i = 1; i < solution.length; i++) {
    expect(Math.floor(solution[i] / 3), text).not.toBe(Math.floor(solution[i - 1] / 3))
  }
}

describe('solve', () => {
  beforeAll(() => {
    prepareSolver()
  })

  test('a solved cube needs no moves', () => {
    expect(solve(solvedCube())).toEqual([])
  })

  test('every single move is undone in one move', () => {
    for (let move = 0; move < 18; move++) {
      const cube = applyMoves(solvedCube(), [move])
      const solution = solve(cube)
      expect(solution, formatMoves([move])).toHaveLength(1)
      expectGoodSolution(cube, solution)
    }
  })

  test('short scrambles get solutions no longer than the scramble', () => {
    const random = seededRandom(20)
    for (let n = 0; n < 60; n++) {
      const scramble = randomMoves(random, 1 + (n % 6))
      const cube = applyMoves(solvedCube(), scramble)
      const solution = solve(cube, { timeBudgetMs: 2000, targetLength: 0 })
      expectGoodSolution(cube, solution)
      expect(solution.length, formatMoves(scramble)).toBeLessThanOrEqual(scramble.length)
    }
  })

  test('random cubes are solved in at most 22 moves', () => {
    const random = seededRandom(21)
    for (let n = 0; n < 60; n++) {
      const cube = randomCube(random)
      // Stops as soon as 22 is reached; the budget is only a safety net.
      const solution = solve(cube, { targetLength: 22, timeBudgetMs: 5000 })
      expectGoodSolution(cube, solution)
      expect(solution.length).toBeLessThanOrEqual(22)
    }
  })

  test('the first solution is valid even with no time to improve it', () => {
    const random = seededRandom(22)
    for (let n = 0; n < 200; n++) {
      const cube = randomCube(random)
      const solution = solve(cube, { timeBudgetMs: 0 })
      expectGoodSolution(cube, solution)
      expect(solution.length).toBeLessThanOrEqual(30)
    }
  })

  test.each([
    ['superflip', "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2"],
    ['checkerboard', 'U2 D2 R2 L2 F2 B2'],
    ['four half turns', 'R2 L2 U2 D2'],
    ['a long scramble of phase-2 moves only', "U R2 D' F2 U2 L2 D B2 U' R2 D2 F2 U L2 D'"],
  ])('solves %s', (_name, scramble) => {
    const cube = applyMoves(solvedCube(), parseMoves(scramble))
    expectGoodSolution(cube, solve(cube))
  })

  test('refuses an unsolvable cube', () => {
    const cube = solvedCube()
    cube.co[0] = 1
    expect(() => solve(cube)).toThrow(/twisted-corner/)
  })
})
