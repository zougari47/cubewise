import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { METHOD_IDS, stagesOf } from '../../core/methods/index.ts'
import { ar } from '../../i18n/ar.ts'
import { en } from '../../i18n/en.ts'
import { fr } from '../../i18n/fr.ts'
import { sourcePath } from '../../lib/repo.ts'
import { lessonTextMethod } from './text-source.ts'

const MESSAGES = { en, fr, ar }

describe('lessonTextMethod', () => {
  test('a lesson written for its method is in that method’s text file', () => {
    expect(lessonTextMethod(en.methods, 'beginner', 'cross')).toBe('beginner')
    expect(lessonTextMethod(en.methods, 'keyhole', 'cross')).toBe('keyhole')
    expect(lessonTextMethod(en.methods, 'cfop', 'permute-last-layer')).toBe('cfop')
    expect(lessonTextMethod(en.methods, 'zz', 'permute-last-layer')).toBe('zz')
  })

  test('a lesson taken whole from another method is in that method’s text file', () => {
    expect(lessonTextMethod(en.methods, 'keyhole', 'last-layer-cross')).toBe('beginner')
  })

  test('in every language, every lesson gives a file that exists and that names its stage', () => {
    for (const [locale, messages] of Object.entries(MESSAGES) as [keyof typeof MESSAGES, typeof en][]) {
      for (const method of METHOD_IDS) {
        for (const stage of stagesOf(method)) {
          const textMethod = lessonTextMethod(messages.methods, method, stage)
          expect(textMethod, `${locale} ${method}/${stage}`).toBe(lessonTextMethod(en.methods, method, stage))
          const path = sourcePath(locale, textMethod)
          expect(existsSync(path), `${method}/${stage} → ${path}`).toBe(true)
          expect(readFileSync(path, 'utf8'), `${method}/${stage} → ${path}`).toContain(stage)
        }
      }
    }
  })
})
