import { createFileRoute } from '@tanstack/react-router'
import { messagesFor } from '#/i18n'
import { localeOfParam } from '#/i18n/locales.ts'
import { faqStructuredData, pageHead } from '#/lib/seo.ts'
import { HomePage } from '#/pages/home/home-page.tsx'

export const Route = createFileRoute('/{-$locale}/')({
  head: ({ params }) => {
    const locale = localeOfParam(params.locale)
    const m = messagesFor(locale)
    return {
      ...pageHead({ title: m.home.title, description: m.site.description, locale, path: '/' }),
      scripts: [faqStructuredData(m.home.faq.items, locale)],
    }
  },
  component: HomePage,
})
