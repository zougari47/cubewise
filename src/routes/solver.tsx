import { createFileRoute } from '@tanstack/react-router'
import { m } from '#/i18n'
import { pageHead } from '#/lib/seo.ts'
import { SolverApp } from '#/pages/solver/solver-app.tsx'

export const Route = createFileRoute('/solver')({
  head: () => pageHead({ title: m.solver.title, description: m.solver.description }),
  component: SolverPage,
})

function SolverPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">{m.solver.heading}</h1>
      <p className="mt-2 mb-6 text-muted-foreground">{m.solver.lead}</p>
      <SolverApp />
    </div>
  )
}
