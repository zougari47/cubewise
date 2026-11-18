import { describe, expect, test } from 'vitest'
import type { CubieCube } from '../../../core/cube/cubie.ts'
import { cubeAfterSteps } from '../../../core/cube/steps.ts'
import { stickersFromCube } from '../../../core/cube/stickers.ts'
import { BEGINNER_STAGES } from '../../../core/methods/beginner/stages.ts'
import { beginnerText } from '../../../i18n/en/beginner.ts'
import { describeLessons } from '../lesson-contract.ts'
import { lessonSteps } from '../lessons.ts'
import { BEGINNER_LESSONS, WHOLE_DAISY } from './beginner.ts'

describeLessons('beginner', BEGINNER_STAGES, BEGINNER_LESSONS, beginnerText)

describe('the cross lesson', () => {
  const PLACES = 'UR UF UL UB DR DF DL DB FR FL BL BR'.split(' ')
  /** Where each white edge is, by the colour of its other sticker; `*` when white faces sideways. */
  const whiteEdges = (cube: CubieCube) =>
    Object.fromEntries(
      [4, 5, 6, 7].map((piece, i) => {
        const place = cube.ep.indexOf(piece)
        return [['orange', 'green', 'red', 'blue'][i], PLACES[place] + (cube.eo[place] ? '*' : '')]
      }),
    )
  const petals = (cube: CubieCube) =>
    Object.values(whiteEdges(cube)).filter((place) => /^U.$/.test(place)).length
  const played = (id: string) => {
    const lessonCase = BEGINNER_LESSONS.cross.find((candidate) => candidate.id === id)!
    const steps = lessonSteps(lessonCase.sequence)
    return { start: lessonCase.start, end: cubeAfterSteps(lessonCase.start, steps, steps.length) }
  }

  test.each([
    ['middle', 'FR'],
    ['make-room', 'FR'],
    ['bottom', 'DR'],
    ['flipped-top', 'UF*'],
    ['flipped-bottom', 'DF*'],
  ])('%s starts with the orange-white edge at %s and ends with it as a petal on the right', (id, place) => {
    const { start, end } = played(id)
    expect(whiteEdges(start).orange).toBe(place)
    expect(whiteEdges(end).orange).toBe('UR')
    expect(petals(end)).toBeGreaterThan(petals(start))
  })

  test('the flipped cases show two petals and leave them where they are', () => {
    for (const id of ['flipped-top', 'flipped-bottom']) {
      const { start, end } = played(id)
      expect([whiteEdges(start).red, whiteEdges(start).blue], id).toEqual(['UL', 'UB'])
      expect([whiteEdges(end).red, whiteEdges(end).blue], id).toEqual(['UL', 'UB'])
    }
  })

  test('the pictures show the stickers the text describes', () => {
    const colours = (id: string) => stickersFromCube(played(id).start).map((face) => 'YOGWRB'[face])
    // Sticker numbers: top face 0-8, right face 9-17, front face 18-26, read row by row.
    expect(colours('middle')[23], 'white on the right of the front face').toBe('W')
    expect(colours('bottom')[16], 'orange at the bottom of the right face').toBe('O')
    expect([colours('flipped-top')[19], colours('flipped-top')[7]]).toEqual(['W', 'O'])
    expect(colours('flipped-bottom')[25], 'white at the bottom of the front face').toBe('W')
    expect([colours('line-up')[5], colours('line-up')[10]], 'green petal on the right').toEqual(['W', 'G'])
  })

  test('the cases with three petals keep them', () => {
    for (const id of ['middle', 'make-room', 'bottom']) {
      expect(petals(played(id).start), id).toBe(3)
      expect(petals(played(id).end), id).toBe(4)
    }
  })

  test('making room starts with a petal in the way', () => {
    expect(Object.values(whiteEdges(played('make-room').start))).toContain('UR')
  })

  test('the worked example adds one petal at a time, then drops all four', () => {
    const { start, end } = played('whole')
    expect(whiteEdges(start)).toEqual({ orange: 'FL', green: 'DR', red: 'BL', blue: 'DF*' })
    const counts = ["L'", 'U L2', "F' R", "U' R"].map((_, i, chunks) => {
      const steps = lessonSteps(chunks.slice(0, i + 1).join(' '))
      return petals(cubeAfterSteps(start, steps, steps.length))
    })
    expect(counts).toEqual([1, 2, 3, 4])
    expect(WHOLE_DAISY).toBe("L' U L2 F' R U' R")
    expect(whiteEdges(end)).toEqual({ orange: 'DR', green: 'DF', red: 'DL', blue: 'DB' })
  })
})
