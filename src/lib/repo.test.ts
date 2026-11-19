import { existsSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { METHOD_IDS } from '../core/methods/index.ts'
import { LOCALES } from '../i18n/locales.ts'
import { REPO_BRANCH, REPO_URL, editUrl, newIssueUrl, sourcePath } from './repo.ts'

describe('sourcePath', () => {
  test('gives the text file of a method in a language, and every method has one in every language', () => {
    expect(sourcePath('en', 'cfop')).toBe('src/i18n/en/cfop.ts')
    expect(sourcePath('fr', 'cfop')).toBe('src/i18n/fr/cfop.ts')
    expect(sourcePath('ar', 'cfop')).toBe('src/i18n/ar/cfop.ts')
    for (const locale of LOCALES) {
      for (const method of METHOD_IDS) {
        expect(existsSync(sourcePath(locale, method)), `${locale} ${method}`).toBe(true)
      }
    }
  })

  test('gives the text file of a page that has its own', () => {
    expect(sourcePath('en', 'before-you-start')).toBe('src/i18n/en/before-you-start.ts')
    expect(sourcePath('ar', 'solver-about')).toBe('src/i18n/ar/solver-about.ts')
    for (const locale of LOCALES) {
      expect(existsSync(sourcePath(locale, 'before-you-start')), locale).toBe(true)
      expect(existsSync(sourcePath(locale, 'solver-about')), locale).toBe(true)
    }
  })
})

describe('editUrl', () => {
  test('opens the file for editing on the main branch', () => {
    expect(editUrl('src/i18n/en/cfop.ts')).toBe(`${REPO_URL}/edit/${REPO_BRANCH}/src/i18n/en/cfop.ts`)
    expect(REPO_URL).toBe('https://github.com/zougari47/cubewise')
    expect(REPO_BRANCH).toBe('main')
  })
})

describe('newIssueUrl', () => {
  test('opens an empty new issue when nothing is given', () => {
    expect(newIssueUrl()).toBe(`${REPO_URL}/issues/new`)
    expect(newIssueUrl({})).toBe(`${REPO_URL}/issues/new`)
    expect(newIssueUrl({ title: '', body: undefined })).toBe(`${REPO_URL}/issues/new`)
  })

  test('fills in the title and the body', () => {
    expect(newIssueUrl({ title: 'Solver', body: 'Method' })).toBe(
      `${REPO_URL}/issues/new?title=Solver&body=Method`,
    )
    expect(newIssueUrl({ body: 'Method' })).toBe(`${REPO_URL}/issues/new?body=Method`)
  })

  test('escapes what would break the address, and reads back unchanged', () => {
    const body = 'What went wrong?\n\nMethod: CFOP & more #1 = 100% + "R U R\'"'
    const url = newIssueUrl({ title: 'A title?', body })
    expect(url).not.toMatch(/[\s#"]/)
    expect(url.split('?')).toHaveLength(2)
    const query = new URL(url).searchParams
    expect(query.get('title')).toBe('A title?')
    expect(query.get('body')).toBe(body)
  })
})
