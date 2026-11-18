import { createFileRoute, notFound } from '@tanstack/react-router'
import { isMethodId } from '#/core/methods/index.ts'
import { m } from '#/i18n'
import { pageHead } from '#/lib/seo.ts'
import { MethodPage } from '#/pages/learn/method-page.tsx'

export const Route = createFileRoute('/learn/$method/')({
  loader: ({ params }) => {
    if (!isMethodId(params.method)) throw notFound()
    return { method: params.method }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const text = m.methods[loaderData.method]
    return pageHead({ title: m.learn.method.pageTitle(text.name), description: text.summary })
  },
  component: () => <MethodPage method={Route.useLoaderData().method} />,
})
