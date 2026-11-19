import { DEFAULT_LOCALE, LOCALES, OG_LOCALES, localizedPath } from '#/i18n/locales.ts'
import type { Locale } from '#/i18n/locales.ts'
import { UNINDEXED_PATHS } from './pages.ts'

/**
 * Where the site is published, without a trailing slash, so that the
 * addresses given to search engines are whole. It is set at build time (see
 * `vite.config.ts`); without it, as in local builds, they stay relative.
 */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')

/** The whole address of a page in a language. */
export function pageUrl(path: string, locale: Locale): string {
  return `${SITE_URL}${localizedPath(path, locale)}`
}

/**
 * The `<head>` entries every page needs: title, description and share-card
 * tags in the page's language, its own address as the canonical one, and
 * where the same page is in every other language. A page in `UNINDEXED_PATHS`
 * instead tells search engines to leave it out, and advertises no address.
 *
 * `path` is the page's address without a language prefix, such as `/learn`.
 */
export function pageHead({
  title,
  description,
  locale,
  path,
}: {
  title: string
  description: string
  locale: Locale
  path: string
}) {
  const url = pageUrl(path, locale)
  const indexed = !UNINDEXED_PATHS.includes(path)
  return {
    meta: [
      { title },
      ...(indexed ? [] : [{ name: 'robots', content: 'noindex, nofollow' }]),
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: OG_LOCALES[locale] },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: indexed
      ? [
          { rel: 'canonical', href: url },
          ...LOCALES.map((other) => ({ rel: 'alternate', hrefLang: other, href: pageUrl(path, other) })),
          { rel: 'alternate', hrefLang: 'x-default', href: pageUrl(path, DEFAULT_LOCALE) },
        ]
      : [],
  }
}

/** A `<script>` entry for a route head that holds structured data (JSON-LD) for search engines. */
function structuredData(data: Record<string, unknown>) {
  return { type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', ...data }) }
}

/** The questions and answers a page shows, as structured data. */
export function faqStructuredData(items: readonly { question: string; answer: string }[], locale: Locale) {
  return structuredData({
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  })
}

/** A tool of the site that is free and runs in the browser, as structured data. */
export function webApplicationStructuredData({
  name,
  description,
  locale,
  path,
}: {
  name: string
  description: string
  locale: Locale
  path: string
}) {
  return structuredData({
    '@type': 'WebApplication',
    name,
    description,
    url: pageUrl(path, locale),
    inLanguage: locale,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })
}
