import { createFileRoute } from '@tanstack/react-router'
import { isMethodId } from '#/core/methods/index.ts'
import type { MethodId } from '#/core/methods/index.ts'
import { messagesFor, useM } from '#/i18n'
import { localeOfParam } from '#/i18n/locales.ts'
import { faqStructuredData, pageHead, webApplicationStructuredData } from '#/lib/seo.ts'
import { SolverAbout } from '#/pages/solver/solver-about.tsx'
import { SolverApp } from '#/pages/solver/solver-app.tsx'

export const Route = createFileRoute('/{-$locale}/solver')({
  /** `?method=cfop` opens the solver with that method chosen, as the lessons do. */
  validateSearch: (search: Record<string, unknown>): { method?: MethodId } =>
    typeof search.method === 'string' && isMethodId(search.method) ? { method: search.method } : {},
  head: ({ params }) => {
    const locale = localeOfParam(params.locale)
    const m = messagesFor(locale)
    const { title, description, heading, about } = m.solver
    return {
      ...pageHead({ title, description, locale, path: '/solver' }),
      scripts: [
        webApplicationStructuredData({ name: `${m.site.name}: ${heading}`, description, locale, path: '/solver' }),
        faqStructuredData(about.faq.items, locale),
      ],
    }
  },
  component: SolverPage,
})

function SolverPage() {
  const m = useM()
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">{m.solver.heading}</h1>
      <p className="mt-2 mb-6 max-w-prose text-pretty text-muted-foreground">{m.solver.lead}</p>
      <SolverApp initialMethod={Route.useSearch().method} />
      <SolverAbout />
    </div>
  )
}
