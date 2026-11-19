import { Outlet, createFileRoute, notFound } from '@tanstack/react-router'
import { DEFAULT_LOCALE, isLocale } from '#/i18n/locales.ts'

/**
 * Every page sits under an optional language prefix: `/learn` is English,
 * `/fr/learn` French. English has no prefix, so `/en/learn` is not a page.
 */
export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: ({ params }) => {
    const { locale } = params
    if (locale !== undefined && (!isLocale(locale) || locale === DEFAULT_LOCALE)) throw notFound()
  },
  component: Outlet,
})
