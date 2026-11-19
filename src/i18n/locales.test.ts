import { describe, expect, test } from 'vitest'
import { METHOD_IDS, stagesOf } from '../core/methods/index.ts'
import { describeLessons } from '../pages/learn/lesson-contract.ts'
import { LESSONS } from '../pages/learn/lessons/index.ts'
import { ar } from './ar.ts'
import { en } from './en.ts'
import { fr } from './fr.ts'
import {
  LOCALES,
  directionOf,
  localeOfParam,
  localeOfPath,
  localeParam,
  localizedPath,
  unlocalizedPath,
} from './locales.ts'
import type { MethodText } from './method-text.ts'

describe('addresses', () => {
  test('English has no prefix and the other languages have theirs', () => {
    expect(localizedPath('/', 'en')).toBe('/')
    expect(localizedPath('/', 'fr')).toBe('/fr')
    expect(localizedPath('/learn/cfop', 'en')).toBe('/learn/cfop')
    expect(localizedPath('/learn/cfop', 'ar')).toBe('/ar/learn/cfop')
  })

  test('the language of an address is read from its prefix', () => {
    expect(localeOfPath('/')).toBe('en')
    expect(localeOfPath('/solver')).toBe('en')
    expect(localeOfPath('/fr')).toBe('fr')
    expect(localeOfPath('/ar/learn/cfop')).toBe('ar')
    // A page whose name merely starts like a language is not in that language.
    expect(localeOfPath('/french')).toBe('en')
  })

  test('an address without its prefix is the same page in English', () => {
    expect(unlocalizedPath('/')).toBe('/')
    expect(unlocalizedPath('/fr')).toBe('/')
    expect(unlocalizedPath('/fr/')).toBe('/')
    expect(unlocalizedPath('/ar/learn/cfop')).toBe('/learn/cfop')
    expect(unlocalizedPath('/learn/cfop')).toBe('/learn/cfop')
    for (const locale of LOCALES) {
      for (const path of ['/', '/solver', '/learn/beginner/cross']) {
        expect(unlocalizedPath(localizedPath(path, locale))).toBe(path)
        expect(localeOfPath(localizedPath(path, locale))).toBe(locale)
      }
    }
  })

  test('the route parameter is absent for English', () => {
    expect(localeParam('en')).toBeUndefined()
    expect(localeParam('fr')).toBe('fr')
    expect(localeOfParam(undefined)).toBe('en')
    expect(localeOfParam('ar')).toBe('ar')
    expect(localeOfParam('xx')).toBe('en')
  })

  test('only Arabic runs right to left', () => {
    expect(LOCALES.map(directionOf)).toEqual(['ltr', 'ltr', 'rtl'])
  })
})

/**
 * The shape of a piece of text: its keys, the length of its lists, and which
 * leaves are words and which are functions. The words themselves are left out.
 */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, shape((value as Record<string, unknown>)[key])]),
    )
  }
  return typeof value
}

/** Every string in a piece of text, with where it is. */
function strings(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]]
  if (value === null || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([key, inner]) => strings(inner, `${path}.${key}`))
}

/** The cube notation in a string: runs of turns such as R U R' U' or F2, apostrophes made plain. */
const notation = (text: string) =>
  (text.replace(/’/g, "'").match(/(?<![\p{L}\p{N}'])[UDLRFBMESxyzrudlfb][2']{1,2}(?![\p{L}\p{N}])/gu) ?? []).sort()

describe.each([
  ['fr', fr],
  ['ar', ar],
] as const)('the %s text', (locale, messages) => {
  test('has the same shape as the English text', () => {
    expect(shape(messages)).toEqual(shape(en))
  })

  test('leaves no string empty and has no em dash', () => {
    for (const [path, text] of strings(messages)) {
      expect(text.trim(), path).not.toBe('')
      expect(text, path).not.toMatch(/—/)
    }
  })

  test('keeps the notation of the English text, turn for turn', () => {
    const english = new Map(strings(en))
    for (const [path, text] of strings(messages)) {
      expect(notation(text), path).toEqual(notation(english.get(path)!))
    }
  })

  test('shows each part of a lesson the same cases as in English', () => {
    for (const method of METHOD_IDS) {
      const lessons: MethodText['lessons'] = messages.methods[method].lessons
      const english: MethodText['lessons'] = en.methods[method].lessons
      for (const stage of stagesOf(method)) {
        expect(
          lessons[stage].parts?.map((part) => part.cases),
          `${method}/${stage}`,
        ).toEqual(english[stage].parts?.map((part) => part.cases))
      }
    }
    expect(messages.learn.beforeYouStart.parts.map((part) => part.cases)).toEqual(
      en.learn.beforeYouStart.parts.map((part) => part.cases),
    )
  })

  if (locale === 'ar') {
    test('keeps notation left-to-right inside its right-to-left sentences', () => {
      for (const [path, text] of strings(messages)) {
        const outside = text.replace(/⁦[^⁩]*⁩/g, '')
        expect(notation(outside), path).toEqual([])
      }
    })
  }

  for (const method of METHOD_IDS) {
    describeLessons(`${locale} ${method}`, stagesOf(method), LESSONS[method], messages.methods[method])
  }
})
