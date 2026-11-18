import { createFileRoute } from '@tanstack/react-router'
import { isMethodId } from '#/core/methods/index.ts'
import type { MethodId } from '#/core/methods/index.ts'
import { m } from '#/i18n'
import { pageHead } from '#/lib/seo.ts'
import { SolverApp } from '#/pages/solver/solver-app.tsx'

export const Route = createFileRoute('/solver')({
  /** `?method=cfop` opens the solver with that method chosen, as the lessons do. */
  validateSearch: (search: Record<string, unknown>): { method?: MethodId } =>
    typeof search.method === 'string' && isMethodId(search.method) ? { method: search.method } : {},
  head: () => pageHead({ title: m.solver.title, description: m.solver.description }),
  component: SolverPage,
})

function SolverPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">{m.solver.heading}</h1>
      <p className="mt-2 mb-6 text-muted-foreground">{m.solver.lead}</p>
      <SolverApp initialMethod={Route.useSearch().method} />
    </div>
  )
}
