import { describe, expect, test } from 'vitest'
import { CORNER_ORIENTATIONS, PERMUTATIONS } from '../../../core/methods/shared/last-layer.ts'
import { areSolved } from '../../../core/methods/shared/search.ts'
import { eoLineDone } from '../../../core/methods/zz/eo-line.ts'
import { BLOCK_EXAMPLES, EO_LINE_EXAMPLES } from '../../../core/methods/zz/sequences.ts'
import { ZZ_STAGES } from '../../../core/methods/zz/stages.ts'
import { zzText } from '../../../i18n/en/zz.ts'
import { describeLessons } from '../lesson-contract.ts'
import { ZZ_LESSONS } from './zz.ts'

describeLessons('zz', ZZ_STAGES, ZZ_LESSONS, zzText)

describe('zz lesson cases', () => {
  const sequencesOf = (stage: (typeof ZZ_STAGES)[number]) =>
    ZZ_LESSONS[stage].map((lessonCase) => lessonCase.sequence).filter((sequence) => sequence !== '')

  test('every case plays a sequence from the tables the solver and its tests read', () => {
    expect(sequencesOf('eo-line')).toEqual(Object.values(EO_LINE_EXAMPLES))
    expect(sequencesOf('first-two-layers')).toEqual(Object.values(BLOCK_EXAMPLES))
    expect(sequencesOf('orient-last-layer-corners')).toEqual(Object.values(CORNER_ORIENTATIONS))
    expect(sequencesOf('permute-last-layer')).toEqual(Object.values(PERMUTATIONS))
  })

  test('the last-layer lessons list all 7 and all 21 cases', () => {
    expect(ZZ_LESSONS['orient-last-layer-corners']).toHaveLength(7)
    expect(ZZ_LESSONS['permute-last-layer']).toHaveLength(21)
  })

  test('the first stage is not done before its cases, and is done before every later case', () => {
    for (const lessonCase of ZZ_LESSONS['eo-line']) {
      expect(eoLineDone(lessonCase.start), lessonCase.id).toBe(lessonCase.sequence === '')
    }
    for (const stage of ZZ_STAGES.slice(1)) {
      for (const lessonCase of ZZ_LESSONS[stage]) {
        expect(eoLineDone(lessonCase.start), `${stage} / ${lessonCase.id}`).toBe(true)
      }
    }
  })

  test('before the last layer, the first two layers are home', () => {
    const twoLayers = { corners: [4, 5, 6, 7], edges: [4, 5, 6, 7, 8, 9, 10, 11] }
    for (const stage of ['orient-last-layer-corners', 'permute-last-layer'] as const) {
      for (const lessonCase of ZZ_LESSONS[stage]) {
        expect(areSolved(lessonCase.start, twoLayers), lessonCase.id).toBe(true)
      }
    }
  })

  test('text is within the lengths a lesson page expects, with no em dash', () => {
    for (const stage of ZZ_STAGES) {
      const { steps } = zzText.lessons[stage]
      expect(steps.length, stage).toBeGreaterThanOrEqual(3)
      expect(steps.length, stage).toBeLessThanOrEqual(6)
    }
    expect(JSON.stringify(zzText)).not.toMatch(/—/)
  })
})
