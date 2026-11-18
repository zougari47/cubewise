import { describe, expect, test } from 'vitest'
import { isSolved, randomCube, solvedCube } from '../cube/cubie.ts'
import { cubeAfterSteps } from '../cube/steps.ts'
import { seededRandom } from '../cube/testing.ts'
import { METHOD_IDS, stagesOf } from './index.ts'
import { METHOD_SOLVERS } from './solvers.ts'

describe.each(METHOD_IDS)('the %s solver', (method) => {
  const solve = METHOD_SOLVERS[method]

  test('solves random cubes, listing every stage in order', () => {
    const random = seededRandom(1)
    for (let n = 0; n < 10; n++) {
      const cube = randomCube(random)
      const solution = solve(cube)
      expect(solution.stages.map((stage) => stage.stage)).toEqual([...stagesOf(method)])
      const steps = solution.stages.flatMap((stage) => stage.steps)
      expect(isSolved(cubeAfterSteps(cube, steps, steps.length))).toBe(true)
    }
  })

  test('a solved cube needs no moves', () => {
    const steps = solve(solvedCube()).stages.flatMap((stage) => stage.steps)
    expect(steps.filter((step) => step.moves.length > 0)).toEqual([])
  })

  test('refuses an unsolvable cube', () => {
    const cube = solvedCube()
    cube.co[0] = 1
    expect(() => solve(cube)).toThrow(/twisted-corner/)
  })
})
