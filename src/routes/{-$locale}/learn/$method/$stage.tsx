import { createFileRoute, notFound } from '@tanstack/react-router'
import { isMethodId, stagesOf } from '#/core/methods/index.ts'
import { messagesFor } from '#/i18n'
import { localeOfParam } from '#/i18n/locales.ts'
import type { MethodText } from '#/i18n/method-text.ts'
import { pageHead } from '#/lib/seo.ts'
import { LessonPage } from '#/pages/learn/lesson-page.tsx'

export const Route = createFileRoute('/{-$locale}/learn/$method/$stage')({
  loader: ({ params }) => {
    if (!isMethodId(params.method) || !stagesOf(params.method).includes(params.stage)) {
      throw notFound()
    }
    return { method: params.method, stage: params.stage }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const { method, stage } = loaderData
    const locale = localeOfParam(params.locale)
    const m = messagesFor(locale)
    const text: MethodText = m.methods[method]
    return pageHead({
      title: m.learn.lesson.pageTitle(
        text.stages[stage].name,
        text.name,
        stagesOf(method).indexOf(stage) + 1,
      ),
      description: text.lessons[stage].goal,
      locale,
      path: `/learn/${method}/${stage}`,
    })
  },
  component: () => {
    const { method, stage } = Route.useLoaderData()
    return <LessonPage method={method} stage={stage} />
  },
})
