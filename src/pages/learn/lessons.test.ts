import { describe, expect, test } from 'vitest'
import { METHOD_IDS, stagesOf } from '../../core/methods/index.ts'
import { en } from '../../i18n/en.ts'
import { after, lessonColours, lessonOrientation, lessonSteps, solvedBy } from './lessons.ts'
import { LESSONS } from './lessons/index.ts'

describe('every method', () => {
  test('has lessons and text for each of its stages', () => {
    for (const method of METHOD_IDS) {
      expect(Object.keys(LESSONS[method]).sort(), method).toEqual([...stagesOf(method)].sort())
      expect(Object.keys(en.methods[method].stages).sort(), method).toEqual([...stagesOf(method)].sort())
    }
  })
})

describe('lessonColours', () => {
  const grey = '#a1a1aa'

  test('colours the centres and the shown pieces, and greys out the rest', () => {
    const daisy = LESSONS.beginner.cross[0]
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
    const line = LESSONS.beginner['last-layer-cross'].find((lessonCase) => lessonCase.id === 'line')!
    const top = lessonColours(line.start, line).slice(0, 9)
    // A line from left to right: the middle row is yellow, the other edges are not.
    expect(top).toEqual([grey, grey, grey, '#facc15', '#facc15', '#facc15', grey, grey, grey])
  })
})

describe('sequences that turn the whole cube', () => {
  test('still start from the cube they solve', () => {
    const lessonCase = solvedBy('wide', "y r U r' M x", { edges: [0, 1, 2, 3] })
    expect(lessonCase.start).not.toEqual(after(''))
    const steps = lessonSteps(lessonCase.sequence)
    expect(lessonOrientation(lessonCase, steps, 0)).not.toEqual(
      lessonOrientation(lessonCase, steps, steps.length),
    )
  })
})
