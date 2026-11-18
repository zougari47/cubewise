import { createFileRoute } from '@tanstack/react-router'
import { m } from '#/i18n'
import { pageHead } from '#/lib/seo.ts'
import { BeforeYouStartPage } from '#/pages/learn/before-you-start-page.tsx'

export const Route = createFileRoute('/learn/before-you-start')({
  head: () =>
    pageHead({
      title: m.learn.beforeYouStart.title,
      description: m.learn.beforeYouStart.description,
    }),
  component: BeforeYouStartPage,
})
