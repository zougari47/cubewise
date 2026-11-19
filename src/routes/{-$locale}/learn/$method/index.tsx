import { createFileRoute, notFound } from '@tanstack/react-router'
import { isMethodId } from '#/core/methods/index.ts'
import { messagesFor } from '#/i18n'
import { localeOfParam } from '#/i18n/locales.ts'
import { pageHead } from '#/lib/seo.ts'
import { MethodPage } from '#/pages/learn/method-page.tsx'

export const Route = createFileRoute('/{-$locale}/learn/$method/')({
  loader: ({ params }) => {
    if (!isMethodId(params.method)) throw notFound()
    return { method: params.method }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const { method } = loaderData
    const locale = localeOfParam(params.locale)
    const m = messagesFor(locale)
    const text = m.methods[method]
    return pageHead({
      title: m.learn.method.pageTitle(text.name),
      description: text.summary,
      locale,
      path: `/learn/${method}`,
    })
  },
  component: () => <MethodPage method={Route.useLoaderData().method} />,
})
