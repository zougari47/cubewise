import { describe, expect, test } from 'vitest'
import { findUnsolvableReason, isSolved, solvedCube } from '../../cube/cubie.ts'
import {
  CORNER_ORIENTATIONS,
  PERMUTATIONS,
  lastLayerFacesUp,
  lowerLayersSolved,
  orientLastLayerCorners,
  permuteLastLayer,
} from './last-layer.ts'
import { U_TURNS, applyTurns } from './turns.ts'

function permutationsOf(items: number[]): number[][] {
  if (items.length <= 1) return [items]
  return items.flatMap((item, i) =>
    permutationsOf([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest]),
  )
}

describe('corner orientation sequences', () => {
  test.each(Object.entries(CORNER_ORIENTATIONS))('%s twists corners and nothing else', (_, text) => {
    const cube = applyTurns(solvedCube(), text)
    expect(lowerLayersSolved(cube)).toBe(true)
    expect(cube.eo).toEqual(solvedCube().eo)
    expect(cube.co.slice(0, 4).some((twist) => twist !== 0)).toBe(true)
  })

  test('between them they solve every way the corners can be twisted', () => {
    let solvedWithNothing = 0
    for (let code = 0; code < 27; code++) {
      const cube = solvedCube()
      cube.co[0] = code % 3
      cube.co[1] = Math.floor(code / 3) % 3
      cube.co[2] = Math.floor(code / 9)
      cube.co[3] = (9 - cube.co[0] - cube.co[1] - cube.co[2]) % 3
      const turns = orientLastLayerCorners(cube)
      if (turns.length === 0) solvedWithNothing++
      expect(lastLayerFacesUp(applyTurns(cube, turns)), `twists ${cube.co.slice(0, 4)}`).toBe(true)
    }
    expect(solvedWithNothing).toBe(1)
  })
})

describe('permutation sequences', () => {
  test.each(Object.entries(PERMUTATIONS))('%s moves last-layer pieces and turns none', (_, text) => {
    const cube = applyTurns(solvedCube(), text)
    expect(lastLayerFacesUp(cube)).toBe(true)
    expect(U_TURNS.some((turn) => isSolved(applyTurns(cube, turn)))).toBe(false)
  })

  test('no two are the same case', () => {
    /** The case a sequence solves, however the top layer is turned before and after. */
    const caseOf = (text: string) =>
      U_TURNS.flatMap((before) =>
        U_TURNS.map((after) =>
          JSON.stringify(applyTurns(applyTurns(applyTurns(solvedCube(), before), text), after)),
        ),
      ).sort()[0]
    expect(new Set(Object.values(PERMUTATIONS).map(caseOf)).size).toBe(21)
  })

  test('between them they solve every arrangement of the last layer', () => {
    let count = 0
    for (const corners of permutationsOf([0, 1, 2, 3])) {
      for (const edges of permutationsOf([0, 1, 2, 3])) {
        const cube = solvedCube()
        cube.cp.splice(0, 4, ...corners)
        cube.ep.splice(0, 4, ...edges)
        if (findUnsolvableReason(cube) !== null) continue
        count++
        expect(isSolved(applyTurns(cube, permuteLastLayer(cube))), `${corners} / ${edges}`).toBe(true)
      }
    }
    expect(count).toBe(288)
  })
})
