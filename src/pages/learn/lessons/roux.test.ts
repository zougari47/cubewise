import { describe, expect, test } from 'vitest'
import { stickersFromCube } from '../../../core/cube/stickers.ts'
import {
  FIRST_BLOCK_EXAMPLES,
  MIDDLE_EDGE_EXAMPLES,
  ORIENT_EXAMPLES,
  SECOND_BLOCK_EXAMPLES,
  SIDE_EDGE_EXAMPLES,
  TOP_CORNERS,
} from '../../../core/methods/roux/sequences.ts'
import { ROUX_STAGES } from '../../../core/methods/roux/stages.ts'
import { areSolved } from '../../../core/methods/shared/search.ts'
import { rouxText } from '../../../i18n/en/roux.ts'
import { describeLessons } from '../lesson-contract.ts'
import { ROUX_LESSONS } from './roux.ts'

describeLessons('roux', ROUX_STAGES, ROUX_LESSONS, rouxText)

describe('roux lesson cases', () => {
  const sequencesOf = (stage: (typeof ROUX_STAGES)[number]) =>
    ROUX_LESSONS[stage].map((lessonCase) => lessonCase.sequence).filter((sequence) => sequence !== '')

  test('every case plays a sequence from the tables the solver reads', () => {
    expect(sequencesOf('first-block')).toEqual(Object.values(FIRST_BLOCK_EXAMPLES))
    expect(sequencesOf('second-block')).toEqual(Object.values(SECOND_BLOCK_EXAMPLES))
    expect(sequencesOf('top-corners')).toEqual(Object.values(TOP_CORNERS))
    expect(sequencesOf('orient-last-edges')).toEqual(Object.values(ORIENT_EXAMPLES))
    expect(sequencesOf('side-edges')).toEqual(Object.values(SIDE_EDGE_EXAMPLES))
    expect(sequencesOf('middle-edges')).toEqual(Object.values(MIDDLE_EDGE_EXAMPLES))
  })

  test('the top-corners lesson lists all 42 cases', () => {
    expect(ROUX_LESSONS['top-corners']).toHaveLength(42)
  })

  test('before the second block, the first is home; before the top corners, both are', () => {
    for (const lessonCase of ROUX_LESSONS['second-block']) {
      expect(areSolved(lessonCase.start, { corners: [5, 6], edges: [6, 9, 10] }), lessonCase.id).toBe(true)
      expect(areSolved(lessonCase.start, lessonCase.shown), lessonCase.id).toBe(false)
    }
    for (const lessonCase of ROUX_LESSONS['top-corners']) {
      const blocks = { corners: [4, 5, 6, 7], edges: [4, 6, 8, 9, 10, 11] }
      expect(areSolved(lessonCase.start, blocks), lessonCase.id).toBe(true)
      expect(areSolved(lessonCase.start, lessonCase.shown), lessonCase.id).toBe(false)
    }
  })

  test('each top-corners case describes the corners its picture shows', () => {
    const colours = ['yellow', 'orange', 'green', 'white', 'red', 'blue']
    const pair = (a: number, b: number) =>
      a === b ? `both ${colours[a]}` : `${colours[a]} and ${colours[b]}`
    // Top stickers of the corners, clockwise from the front left; then the side stickers in view.
    const topStickers = [6, 8, 2, 0]
    const counts = ['No corner faces', 'One corner faces', 'Two corners face', '', 'All four corners face']
    for (const lessonCase of ROUX_LESSONS['top-corners']) {
      const stickers = stickersFromCube(lessonCase.start)
      const { body } = rouxText.lessons['top-corners'].cases[lessonCase.id]
      const facingUp = topStickers.filter((sticker) => stickers[sticker] === 0).length
      expect(body.startsWith(`${counts[facingUp]} up`), lessonCase.id).toBe(true)
      expect(body, lessonCase.id).toContain(
        `At the front the corner stickers are ${pair(stickers[18], stickers[20])}; ` +
          `on the right they are ${pair(stickers[9], stickers[11])}.`,
      )
    }
  })

  test('no text has an em dash', () => {
    expect(JSON.stringify(rouxText)).not.toMatch(/—/)
  })
})
