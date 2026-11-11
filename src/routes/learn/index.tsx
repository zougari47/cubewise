import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import { BEGINNER_STAGES } from '#/beginner/stages.ts'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { m } from '#/i18n'
import { useLessonProgress } from '#/learn/progress.ts'
import { pageHead } from '#/lib/seo.ts'

export const Route = createFileRoute('/learn/')({
  head: () => pageHead({ title: m.learn.title, description: m.learn.description }),
  component: LearnPage,
})

function LearnPage() {
  const { completed } = useLessonProgress()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{m.learn.heading}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{m.learn.lead}</p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">{m.learn.stagesHeading}</h2>
      <ol className="mt-4 space-y-3">
        {BEGINNER_STAGES.map((stage, i) => (
          <li key={stage}>
            <Link
              to="/learn/beginner/$stage"
              params={{ stage }}
              className="group block rounded-xl border p-5 transition-colors hover:bg-muted/50"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {m.learn.stageNumber(i + 1)}
              </p>
              <h3 className="mt-0.5 flex flex-wrap items-center justify-between gap-2 text-lg font-semibold">
                <span className="flex items-center gap-2">
                  {m.learn.stages[stage].name}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </span>
                {completed.includes(stage) && (
                  <Badge variant="secondary">
                    <Check />
                    {m.learn.lesson.completed}
                  </Badge>
                )}
              </h3>
              <p className="mt-1.5 text-muted-foreground">{m.learn.stages[stage].summary}</p>
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-10 rounded-xl border bg-muted/40 p-6">
        <h2 className="text-lg font-semibold">{m.learn.practice.heading}</h2>
        <p className="mt-2 text-muted-foreground">{m.learn.practice.body}</p>
        <Button asChild className="mt-4">
          <Link to="/solver">
            {m.learn.practice.action}
            <ArrowRight />
          </Link>
        </Button>
      </section>
    </div>
  )
}
