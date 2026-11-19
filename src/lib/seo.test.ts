import { describe, expect, test } from 'vitest'
import { LOCALES } from '../i18n/locales.ts'
import { PAGE_PATHS, UNINDEXED_PATHS } from './pages.ts'
import { pageHead } from './seo.ts'

const head = (path: string, locale: (typeof LOCALES)[number]) =>
  pageHead({ title: 'Title', description: 'Description', locale, path })

describe('pageHead', () => {
  test('a page gives its canonical address and where it is in every language', () => {
    const { meta, links } = head('/solver', 'fr')
    expect(meta.some((tag) => 'name' in tag && tag.name === 'robots')).toBe(false)
    expect(links).toContainEqual({ rel: 'canonical', href: '/fr/solver' })
    expect(links.filter((link) => link.rel === 'alternate')).toHaveLength(LOCALES.length + 1)
  })

  test('a page kept from search engines says so in every language and advertises no address', () => {
    for (const path of UNINDEXED_PATHS) {
      for (const locale of LOCALES) {
        const { meta, links } = head(path, locale)
        expect(meta).toContainEqual({ name: 'robots', content: 'noindex, nofollow' })
        expect(links).toEqual([])
      }
    }
  })

  test('every page kept from search engines is still a page that is written out', () => {
    expect(UNINDEXED_PATHS).toContain('/history')
    for (const path of UNINDEXED_PATHS) expect(PAGE_PATHS).toContain(path)
  })
})
