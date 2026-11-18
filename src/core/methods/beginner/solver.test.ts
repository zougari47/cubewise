import { describe, expect, test } from 'vitest'
import { applyMoves, isSolved, parseMoves, randomCube, solvedCube } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { cubeFaceSeenAs } from '../../cube/orientation.ts'
import { cubeAfterSteps } from '../../cube/steps.ts'
import { seededRandom } from '../../cube/testing.ts'
import { SEQUENCES } from './sequences.ts'
import { solveBeginner } from './solver.ts'
import { BEGINNER_STAGES } from './stages.ts'

const allSteps = (cube: CubieCube) => solveBeginner(cube).stages.flatMap((stage) => stage.steps)

describe('solveBeginner', () => {
  test('solves random cubes', () => {
    const random = seededRandom(40)
    let longest = 0
    for (let n = 0; n < 200; n++) {
      const cube = randomCube(random)
      const steps = allSteps(cube)
      expect(isSolved(cubeAfterSteps(cube, steps, steps.length))).toBe(true)
      longest = Math.max(longest, steps.length)
    }
    expect(longest).toBeLessThan(220)
  })

  test('lists the seven stages in order', () => {
    const solution = solveBeginner(randomCube(seededRandom(41)))
    expect(solution.stages.map((stage) => stage.stage)).toEqual([...BEGINNER_STAGES])
  })

  test('a solved cube needs no steps', () => {
    expect(allSteps(solvedCube())).toEqual([])
  })

  test('starts with the entered top face at the bottom and the front unchanged', () => {
    const { start } = solveBeginner(solvedCube())
    expect(cubeFaceSeenAs(start, 3)).toBe(0)
    expect(cubeFaceSeenAs(start, 2)).toBe(2)
  })

  test('the cross takes at most 8 moves and never turns the whole cube', () => {
    const random = seededRandom(42)
    for (let n = 0; n < 100; n++) {
      const cross = solveBeginner(randomCube(random)).stages[0].steps
      expect(cross.length).toBeLessThanOrEqual(8)
      expect(cross.every((step) => step.moves.length === 1)).toBe(true)
    }
  })

  test('each stage finishes its own pieces and keeps the earlier ones', () => {
    // Piece numbers on the cube as entered: its top layer is solved first.
    const first = [0, 1, 2, 3]
    const middle = [8, 9, 10, 11]
    const last = [4, 5, 6, 7]
    const edgesDone = (cube: CubieCube, edges: number[]) =>
      edges.every((i) => cube.ep[i] === i && cube.eo[i] === 0)
    const cornersDone = (cube: CubieCube, corners: number[]) =>
      corners.every((i) => cube.cp[i] === i && cube.co[i] === 0)
    const checks: ((cube: CubieCube) => boolean)[] = [
      (cube) => edgesDone(cube, first),
      (cube) => cornersDone(cube, first),
      (cube) => edgesDone(cube, middle),
      (cube) => last.every((i) => cube.eo[i] === 0),
      (cube) => edgesDone(cube, last),
      (cube) => last.every((i) => cube.cp[i] === i),
      (cube) => isSolved(cube),
    ]

    const random = seededRandom(43)
    for (let n = 0; n < 50; n++) {
      const cube = randomCube(random)
      const solution = solveBeginner(cube)
      const steps = solution.stages.flatMap((stage) => stage.steps)
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

  test('after the cross, uses only the taught sequences, top turns and whole-cube turns', () => {
    const taught = Object.values(SEQUENCES).map((text) => text.split(' '))
    const random = seededRandom(44)
    for (let n = 0; n < 30; n++) {
      const stages = solveBeginner(randomCube(random)).stages.slice(1)
      const faces = new Set(stages.flatMap((stage) => stage.steps.map((step) => step.text[0])))
      const allowed = new Set(['y', 'U', ...taught.flat().map((move) => move[0])])
      expect([...faces].every((face) => allowed.has(face))).toBe(true)
    }
  })

  test('step text follows the cube as it is turned', () => {
    // One move from solved on the entered front face: the cube is turned over
    // first, and the front is still the front.
    const cube = applyMoves(solvedCube(), parseMoves('F'))
    const steps = allSteps(cube)
    expect(steps.map((step) => step.text).join(' ')).toBe("F'")
    expect(steps[0].moves).toEqual(parseMoves("F'"))
  })

  test('refuses an unsolvable cube', () => {
    const cube = solvedCube()
    cube.co[0] = 1
    expect(() => solveBeginner(cube)).toThrow(/twisted-corner/)
  })
})
