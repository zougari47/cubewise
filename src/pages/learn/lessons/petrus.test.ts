import { describe, expect, test } from 'vitest'
import { bigBlockDone, smallBlockDone } from '../../../core/methods/petrus/blocks.ts'
import { edgesOriented } from '../../../core/methods/petrus/edges.ts'
import {
  BIG_BLOCK_EXAMPLES,
  EDGE_FLIPS,
  LAYER_EXAMPLES,
  SMALL_BLOCK_EXAMPLES,
} from '../../../core/methods/petrus/sequences.ts'
import { PETRUS_STAGES } from '../../../core/methods/petrus/stages.ts'
import { CORNER_ORIENTATIONS, PERMUTATIONS } from '../../../core/methods/shared/last-layer.ts'
import { areSolved } from '../../../core/methods/shared/search.ts'
import { petrusText } from '../../../i18n/en/petrus.ts'
import { describeLessons } from '../lesson-contract.ts'
import { PETRUS_LESSONS } from './petrus.ts'

describeLessons('petrus', PETRUS_STAGES, PETRUS_LESSONS, petrusText)

describe('petrus lesson cases', () => {
  const sequencesOf = (stage: (typeof PETRUS_STAGES)[number]) =>
    PETRUS_LESSONS[stage].map((lessonCase) => lessonCase.sequence).filter((sequence) => sequence !== '')

  test('every case plays a sequence from the tables the solver and its tests read', () => {
    expect(sequencesOf('small-block')).toEqual(Object.values(SMALL_BLOCK_EXAMPLES))
    expect(sequencesOf('big-block')).toEqual(Object.values(BIG_BLOCK_EXAMPLES))
    expect(sequencesOf('edge-orientation')).toEqual(Object.values(EDGE_FLIPS))
    expect(sequencesOf('first-two-layers')).toEqual(Object.values(LAYER_EXAMPLES))
    expect(sequencesOf('orient-last-layer-corners')).toEqual(Object.values(CORNER_ORIENTATIONS))
    expect(sequencesOf('permute-last-layer')).toEqual(Object.values(PERMUTATIONS))
  })

  test('the edge lesson lists all 14 sequences, and the last-layer lessons all 7 and all 21', () => {
    expect(PETRUS_LESSONS['edge-orientation'].map((lessonCase) => lessonCase.id)).toEqual(Object.keys(EDGE_FLIPS))
    expect(PETRUS_LESSONS['edge-orientation']).toHaveLength(14)
    expect(PETRUS_LESSONS['orient-last-layer-corners']).toHaveLength(7)
    expect(PETRUS_LESSONS['permute-last-layer']).toHaveLength(21)
  })

  test('each stage is not done before its cases, and the stages before it are', () => {
    const done = [smallBlockDone, bigBlockDone, edgesOriented]
    PETRUS_STAGES.forEach((stage, index) => {
      for (const lessonCase of PETRUS_LESSONS[stage]) {
        const name = `${stage} / ${lessonCase.id}`
        if (index < done.length) expect(done[index](lessonCase.start), name).toBe(lessonCase.sequence === '')
        for (const earlier of done.slice(0, index)) expect(earlier(lessonCase.start), name).toBe(true)
      }
    })
  })

  test('before the last layer, the first two layers are home', () => {
    const twoLayers = { corners: [4, 5, 6, 7], edges: [4, 5, 6, 7, 8, 9, 10, 11] }
    for (const stage of ['orient-last-layer-corners', 'permute-last-layer'] as const) {
      for (const lessonCase of PETRUS_LESSONS[stage]) {
        expect(areSolved(lessonCase.start, twoLayers), lessonCase.id).toBe(true)
      }
    }
  })

  test('text is within the lengths a lesson page expects, with no em dash', () => {
    for (const stage of PETRUS_STAGES) {
      const steps = petrusText.lessons[stage].steps ?? []
      expect(steps.length, stage).toBeGreaterThanOrEqual(3)
      expect(steps.length, stage).toBeLessThanOrEqual(6)
    }
    expect(JSON.stringify(petrusText)).not.toMatch(/—/)
  })
})
