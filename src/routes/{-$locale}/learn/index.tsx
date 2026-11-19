import { createFileRoute } from '@tanstack/react-router'
import { messagesFor } from '#/i18n'
import { localeOfParam } from '#/i18n/locales.ts'
import { pageHead } from '#/lib/seo.ts'
import { MethodListPage } from '#/pages/learn/method-list.tsx'

export const Route = createFileRoute('/{-$locale}/learn/')({
  head: ({ params }) => {
    const locale = localeOfParam(params.locale)
    const m = messagesFor(locale)
    return pageHead({ title: m.learn.title, description: m.learn.description, locale, path: '/learn' })
  },
  component: MethodListPage,
})
