import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { BEGINNER_STAGES } from '#/beginner/stages.ts'
import type { BeginnerStage } from '#/beginner/stages.ts'
import { Button } from '#/components/ui/button'
import { m } from '#/i18n'
import { LessonCaseCard } from '#/learn/lesson-case.tsx'
import { LESSON_CASES } from '#/learn/lessons.ts'
import { useLessonProgress } from '#/learn/progress.ts'
import { pageHead } from '#/lib/seo.ts'

const isStage = (value: string): value is BeginnerStage =>
  BEGINNER_STAGES.includes(value as BeginnerStage)

export const Route = createFileRoute('/learn/beginner/$stage')({
  loader: ({ params }) => {
    if (!isStage(params.stage)) throw notFound()
    return { stage: params.stage }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const number = BEGINNER_STAGES.indexOf(loaderData.stage) + 1
    return pageHead({
      title: m.learn.lesson.pageTitle(m.learn.stages[loaderData.stage].name, number),
      description: m.learn.lessons[loaderData.stage].goal,
    })
  },
  component: LessonPage,
})

function LessonPage() {
  const { stage } = Route.useLoaderData()
  const { completed, setDone } = useLessonProgress()
  const index = BEGINNER_STAGES.indexOf(stage)
  const previous = BEGINNER_STAGES[index - 1]
  const next = BEGINNER_STAGES[index + 1]
  const lesson = m.learn.lessons[stage]
  const cases: Record<string, { title: string; body: string }> = lesson.cases
  const text = m.learn.lesson
  const done = completed.includes(stage)

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/learn" className="text-sm text-muted-foreground hover:text-foreground">
        ← {text.allStages}
      </Link>
      <p className="mt-6 text-sm font-medium text-muted-foreground">
        {text.stageOf(index + 1, BEGINNER_STAGES.length)}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{m.learn.stages[stage].name}</h1>

      <section className="mt-6 rounded-xl border bg-muted/40 p-5">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {text.goal}
        </h2>
        <p className="mt-1.5 text-lg">{lesson.goal}</p>
      </section>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">{text.steps}</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-muted-foreground">
        {lesson.steps.map((step) => (
          <li key={step} className="pl-1">
            {step}
          </li>
        ))}
      </ol>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">{text.cases}</h2>
      <div className="mt-4 space-y-4">
        {LESSON_CASES[stage].map((lessonCase) => (
          <LessonCaseCard
            key={lessonCase.id}
            lessonCase={lessonCase}
            title={cases[lessonCase.id].title}
            body={cases[lessonCase.id].body}
          />
        ))}
      </div>

      <aside className="mt-8 rounded-xl border-l-4 border-sky-500 bg-sky-50 p-4">
        <p className="font-semibold">{text.tip}</p>
        <p className="mt-1">{lesson.tip}</p>
      </aside>

      <p className="mt-6 text-sm text-muted-foreground">{text.notation}</p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button variant={done ? 'secondary' : 'default'} onClick={() => setDone(stage, !done)}>
          {done && <Check />}
          {done ? text.completed : text.markComplete}
        </Button>
        <Button asChild variant="outline">
          <Link to="/solver">{text.tryIt}</Link>
        </Button>
      </div>

      <nav className="mt-10 flex justify-between gap-3 border-t pt-6">
        {previous ? (
          <Button asChild variant="ghost">
            <Link to="/learn/beginner/$stage" params={{ stage: previous }}>
              <ArrowLeft />
              {m.learn.stages[previous].name}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button asChild variant="ghost">
            <Link to="/learn/beginner/$stage" params={{ stage: next }}>
              {m.learn.stages[next].name}
              <ArrowRight />
            </Link>
          </Button>
        )}
      </nav>
    </article>
  )
}
