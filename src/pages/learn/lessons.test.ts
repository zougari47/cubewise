import { describe, expect, test } from 'vitest'
import { BEGINNER_STAGES } from '../../core/methods/beginner/stages.ts'
import { applyMoves, isSolved, parseMoves } from '../../core/cube/cubie.ts'
import { en } from '../../i18n/en.ts'
import { LESSON_CASES, lessonColours } from './lessons.ts'

describe('lesson cases', () => {
  test('every stage has at least one case', () => {
    for (const stage of BEGINNER_STAGES) {
      expect(LESSON_CASES[stage].length, stage).toBeGreaterThan(0)
    }
  })

  test('every case has a title and a description', () => {
    for (const stage of BEGINNER_STAGES) {
      const texts = en.learn.lessons[stage].cases
      expect(Object.keys(texts).sort(), stage).toEqual(
        LESSON_CASES[stage].map((lessonCase) => lessonCase.id).sort(),
      )
    }
  })

  test('every sequence solves the cube its picture starts from', () => {
    for (const stage of BEGINNER_STAGES) {
      for (const lessonCase of LESSON_CASES[stage]) {
        if (lessonCase.sequence === '') continue
        const end = applyMoves(lessonCase.start, parseMoves(lessonCase.sequence))
        expect(isSolved(end), `${stage} / ${lessonCase.id}`).toBe(true)
      }
    }
  })
})

describe('lessonColours', () => {
  const grey = '#a1a1aa'

  test('colours the centres and the shown pieces, and greys out the rest', () => {
    const daisy = LESSON_CASES.cross[0]
    const colours = lessonColours(daisy.start, daisy)
    expect(colours).toHaveLength(54)
    // Top face: yellow centre, four white petals, grey corners.
    expect(colours.slice(0, 9)).toEqual([
      grey, '#ffffff', grey,
      '#ffffff', '#facc15', '#ffffff',
      grey, '#ffffff', grey,
    ])
  })

  test('shows only the top-colour sticker of pieces marked that way', () => {
    const line = LESSON_CASES['last-layer-cross'].find((lessonCase) => lessonCase.id === 'line')!
    const top = lessonColours(line.start, line).slice(0, 9)
    // A line from left to right: the middle row is yellow, the other edges are not.
    expect(top).toEqual([grey, grey, grey, '#facc15', '#facc15', '#facc15', grey, grey, grey])
  })
})
