import { Link } from '@tanstack/react-router'
import { ForwardArrow } from '#/components/arrows.tsx'
import { Badge } from '#/components/ui/badge'
import { METHOD_IDS, stagesOf } from '#/core/methods/index.ts'
import { useM } from '#/i18n'
import { useLessonProgress } from './progress.ts'

/** The first page of the lessons: every method, to choose one to learn. */
export function MethodListPage() {
  const m = useM()
  const { completed } = useLessonProgress()
  const start = m.learn.beforeYouStart.card

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{m.learn.heading}</h1>
      <p className="mt-3 max-w-prose text-lg text-muted-foreground">{m.learn.lead}</p>

      <Link
        to="/{-$locale}/learn/before-you-start"
        className="group mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/40 bg-primary/10 p-5 transition-colors hover:border-primary/70"
      >
        <div className="max-w-prose">
          <h2 className="text-lg font-semibold">{start.heading}</h2>
          <p className="mt-1 text-muted-foreground">{start.body}</p>
        </div>
        <span className="flex items-center gap-2 font-medium text-primary">
          {start.action}
          <ForwardArrow className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </span>
      </Link>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">{m.learn.methodsHeading}</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {METHOD_IDS.map((method) => {
          const text = m.methods[method]
          const total = stagesOf(method).length
          const done = completed[method].length
          return (
            <li key={method}>
              <Link
                to="/{-$locale}/learn/$method"
                params={{ method }}
                className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    {text.name}
                    <ForwardArrow className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </h3>
                  <Badge variant="secondary">{text.level}</Badge>
                </div>
                <p className="mt-2 flex-1 text-muted-foreground">{text.summary}</p>
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  {m.learn.stageCount(total)}
                  {done > 0 && ` · ${m.learn.progress(done, total)}`}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
