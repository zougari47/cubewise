import { createFileRoute } from '@tanstack/react-router'
import { messagesFor } from '#/i18n'
import { localeOfParam } from '#/i18n/locales.ts'
import { pageHead } from '#/lib/seo.ts'
import { HistoryPage } from '#/pages/history/history-page.tsx'

export const Route = createFileRoute('/{-$locale}/history')({
  // The page is in `UNINDEXED_PATHS`, so this head keeps it out of search engines.
  head: ({ params }) => {
    const locale = localeOfParam(params.locale)
    const m = messagesFor(locale)
    return pageHead({ title: m.history.title, description: m.history.description, locale, path: '/history' })
  },
  component: HistoryPage,
})
