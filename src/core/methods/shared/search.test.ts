import { describe, expect, test } from 'vitest'
import { isSolved, randomCube, solvedCube } from '../../cube/cubie.ts'
import { seededRandom } from '../../cube/testing.ts'
import { areSolved, blockSolver, distanceTable, findSequence, searchTurns } from './search.ts'
import { U_TURNS, applyTurns, formatTurns, turnLists } from './turns.ts'

describe('blockSolver', () => {
  test('finds the fewest moves for a known case', () => {
    const cross = blockSolver({ pieces: { edges: [4, 5, 6, 7] } })
    expect(formatTurns(cross(applyTurns(solvedCube(), "F R'"))!)).toBe("R F'")
  })

  test('brings the pieces home and keeps the ones listed as solved', () => {
    const square = { corners: [5], edges: [5, 6, 9] }
    const block = { corners: [5, 6], edges: [5, 6, 7, 9, 10] }
    const first = blockSolver({ pieces: square })
    const second = blockSolver({
      pieces: block,
      guides: [square, { corners: [6], edges: [7, 10] }],
    })
    const random = seededRandom(20)
    for (let n = 0; n < 10; n++) {
      const cube = randomCube(random)
      const afterFirst = applyTurns(cube, first(cube)!)
      expect(areSolved(afterFirst, square)).toBe(true)
      expect(first.estimate(afterFirst)).toBe(0)
      expect(areSolved(applyTurns(afterFirst, second(afterFirst)!), block)).toBe(true)
    }
  })

  test('works with only some of the moves', () => {
    const pair = blockSolver({ pieces: { corners: [4], edges: [8] }, generators: "R R2 R' U U2 U'" })
    const cube = applyTurns(solvedCube(), "R U R' U2 R U' R'")
    const turns = pair(cube)!
    expect(turns.every((turn) => 'RU'.includes(turn.family))).toBe(true)
    expect(areSolved(applyTurns(cube, turns), { corners: [4], edges: [8] })).toBe(true)
  })
})

describe('searchTurns', () => {
  test('finds the fewest turns of any kind', () => {
    const cube = applyTurns(solvedCube(), "M U2 M'")
    const turns = searchTurns(cube, { generators: "M M' M2 U U' U2", done: isSolved, maxDepth: 4 })
    expect(formatTurns(turns!)).toBe("M U2 M'")
  })

  test('gives up beyond the depth allowed', () => {
    const cube = applyTurns(solvedCube(), 'R U F')
    expect(searchTurns(cube, { generators: "R R' U U' F F'", done: isSolved, maxDepth: 2 })).toBeNull()
  })

  test('follows a distance table', () => {
    // How the four top edges are flipped, as a number.
    const key = (cube: { eo: number[] }) => cube.eo[0] + 2 * cube.eo[1] + 4 * cube.eo[2] + 8 * cube.eo[3]
    const generators = "U U' F F' R R' B B' L L'"
    const table = distanceTable({ size: 16, key, generators })
    expect(table[0]).toBe(0)
    expect(table[key(applyTurns(solvedCube(), 'F'))]).toBe(1)
  })
})

describe('findSequence', () => {
  test('lines the cube up, does the sequence and adjusts', () => {
    const sune = "R U R' U R U2 R'"
    const cube = applyTurns(solvedCube(), `U ${sune} U2 ${sune} U`)
    const turns = findSequence(cube, {
      before: U_TURNS,
      sequences: turnLists([sune, "R U2 R' U' R U' R'"]),
      after: U_TURNS,
      done: isSolved,
    })
    expect(turns).not.toBeNull()
    expect(isSolved(applyTurns(cube, turns!))).toBe(true)
  })
})
