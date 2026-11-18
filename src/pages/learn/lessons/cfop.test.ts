import { describe, expect, test } from 'vitest'
import {
  CROSS_EXAMPLES,
  ORIENTATIONS,
  PAIR_EXAMPLES,
} from '../../../core/methods/cfop/sequences.ts'
import { CFOP_STAGES } from '../../../core/methods/cfop/stages.ts'
import { PERMUTATIONS } from '../../../core/methods/shared/last-layer.ts'
import { areSolved } from '../../../core/methods/shared/search.ts'
import { cfopText } from '../../../i18n/en/cfop.ts'
import { describeLessons } from '../lesson-contract.ts'
import { CFOP_LESSONS } from './cfop.ts'

describeLessons('cfop', CFOP_STAGES, CFOP_LESSONS, cfopText)

describe('cfop lesson cases', () => {
  const sequencesOf = (stage: (typeof CFOP_STAGES)[number]) =>
    CFOP_LESSONS[stage].map((lessonCase) => lessonCase.sequence).filter((sequence) => sequence !== '')

  test('every case plays a sequence from the tables the solver reads', () => {
    expect(sequencesOf('cross')).toEqual(Object.values(CROSS_EXAMPLES))
    expect(sequencesOf('first-two-layers')).toEqual(Object.values(PAIR_EXAMPLES))
    expect(sequencesOf('orient-last-layer')).toEqual(Object.values(ORIENTATIONS))
    expect(sequencesOf('permute-last-layer')).toEqual(Object.values(PERMUTATIONS))
  })

  test('the last-layer lessons list all 57 and all 21 cases', () => {
    expect(CFOP_LESSONS['orient-last-layer']).toHaveLength(57)
    expect(CFOP_LESSONS['permute-last-layer']).toHaveLength(21)
  })

  test('before a pair goes in, the cross and the other three slots are already home', () => {
    for (const lessonCase of CFOP_LESSONS['first-two-layers']) {
      const others = { corners: [5, 6, 7], edges: [4, 5, 6, 7, 9, 10, 11] }
      expect(areSolved(lessonCase.start, others), lessonCase.id).toBe(true)
      expect(areSolved(lessonCase.start, { corners: [4], edges: [8] }), lessonCase.id).toBe(false)
    }
  })

  test('before the last layer is oriented, the first two layers are home', () => {
    for (const lessonCase of CFOP_LESSONS['orient-last-layer']) {
      expect(areSolved(lessonCase.start, lessonCase.shown), lessonCase.id).toBe(true)
    }
  })

  test('no text has an em dash', () => {
    expect(JSON.stringify(cfopText)).not.toMatch(/—/)
  })
})
