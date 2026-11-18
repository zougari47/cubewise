import { createFileRoute } from '@tanstack/react-router'
import { m } from '#/i18n'
import { pageHead } from '#/lib/seo.ts'
import { MethodListPage } from '#/pages/learn/method-list.tsx'

export const Route = createFileRoute('/learn/')({
  head: () => pageHead({ title: m.learn.title, description: m.learn.description }),
  component: MethodListPage,
})
