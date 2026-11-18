import { describe, expect, test } from 'vitest'
import { KEYHOLE_STAGES } from '../../../core/methods/keyhole/stages.ts'
import { areSolved } from '../../../core/methods/shared/search.ts'
import { keyholeText } from '../../../i18n/en/keyhole.ts'
import { describeLessons } from '../lesson-contract.ts'
import { KEYHOLE_LESSONS } from './keyhole.ts'

describeLessons('keyhole', KEYHOLE_STAGES, KEYHOLE_LESSONS, keyholeText)

describe('keyhole lesson pictures', () => {
  test('before a keyhole or last-corner sequence, the cross and the corners drawn in colour are already home', () => {
    for (const stage of ['three-corners', 'keyhole-edges', 'last-corner'] as const) {
      for (const lessonCase of KEYHOLE_LESSONS[stage]) {
        const { corners = [], edges = [] } = lessonCase.shown
        const kept = {
          // The corner being placed in this case is the only one allowed to be away.
          corners: stage === 'keyhole-edges' ? corners : corners.filter((corner) => corner !== 4),
          edges: edges.filter((edge) => edge >= 4 && edge < 8),
        }
        expect(areSolved(lessonCase.start, kept), `${stage} / ${lessonCase.id}`).toBe(true)
      }
    }
  })

  test('no text has an em dash', () => {
    expect(JSON.stringify(keyholeText)).not.toMatch(/—/)
  })
})
