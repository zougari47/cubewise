import { createFileRoute } from '@tanstack/react-router'
import { messagesFor } from '#/i18n'
import { localeOfParam } from '#/i18n/locales.ts'
import { pageHead } from '#/lib/seo.ts'
import { BeforeYouStartPage } from '#/pages/learn/before-you-start-page.tsx'

export const Route = createFileRoute('/{-$locale}/learn/before-you-start')({
  head: ({ params }) => {
    const locale = localeOfParam(params.locale)
    const text = messagesFor(locale).learn.beforeYouStart
    return pageHead({
      title: text.title,
      description: text.description,
      locale,
      path: '/learn/before-you-start',
    })
  },
  component: BeforeYouStartPage,
})
