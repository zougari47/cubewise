import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { stagesOf } from '#/core/methods/index.ts'
import type { MethodId } from '#/core/methods/index.ts'
import { m } from '#/i18n'
import { useLessonProgress } from './progress.ts'

/** One method: what it is, and its stages in order, each leading to a lesson. */
export function MethodPage({ method }: { method: MethodId }) {
  const { completed } = useLessonProgress()
  const text = m.methods[method]
  const stageText: Record<string, { name: string; summary: string }> = text.stages

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/learn" className="text-sm text-muted-foreground hover:text-foreground">
        ← {m.learn.method.allMethods}
      </Link>
      <h1 className="mt-6 flex flex-wrap items-center gap-3 text-3xl font-semibold tracking-tight">
        {text.name}
        <Badge variant="secondary">{text.level}</Badge>
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{text.lead}</p>
      {method === 'beginner' && (
        <p className="mt-3 text-muted-foreground">
          {m.learn.beforeYouStart.pointer.question}{' '}
          <Link to="/learn/before-you-start" className="underline underline-offset-4 hover:text-foreground">
            {m.learn.beforeYouStart.pointer.link}
          </Link>
        </p>
      )}

      <h2 className="mt-10 text-xl font-semibold tracking-tight">{m.learn.method.stagesHeading}</h2>
      <ol className="mt-4 space-y-3">
        {stagesOf(method).map((stage, i) => (
          <li key={stage}>
            <Link
              to="/learn/$method/$stage"
              params={{ method, stage }}
              className="group block rounded-xl border p-5 transition-colors hover:bg-muted/50"
            >
              <p className="text-sm font-medium text-muted-foreground">{m.learn.stageNumber(i + 1)}</p>
              <h3 className="mt-0.5 flex flex-wrap items-center justify-between gap-2 text-lg font-semibold">
                <span className="flex items-center gap-2">
                  {stageText[stage].name}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </span>
                {completed[method].includes(stage) && (
                  <Badge variant="secondary">
                    <Check />
                    {m.learn.lesson.completed}
                  </Badge>
                )}
              </h3>
              <p className="mt-1.5 text-muted-foreground">{stageText[stage].summary}</p>
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-10 rounded-xl border bg-muted/40 p-6">
        <h2 className="text-lg font-semibold">{m.learn.practice.heading}</h2>
        <p className="mt-2 text-muted-foreground">{m.learn.practice.body(text.name)}</p>
        <Button asChild className="mt-4">
          <Link to="/solver" search={{ method }}>
            {m.learn.practice.action}
            <ArrowRight />
          </Link>
        </Button>
      </section>
    </div>
  )
}
