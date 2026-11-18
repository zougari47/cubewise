import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { stagesOf } from '#/core/methods/index.ts'
import type { MethodId } from '#/core/methods/index.ts'
import { m } from '#/i18n'
import type { LessonText } from '#/i18n/method-text.ts'
import { LessonCaseCard } from './lesson-case.tsx'
import { lessonSteps } from './lessons.ts'
import { LESSONS } from './lessons/index.ts'
import { useLessonProgress } from './progress.ts'

/** The lesson for one stage of a method. */
export function LessonPage({ method, stage }: { method: MethodId; stage: string }) {
  const { completed, setDone } = useLessonProgress()
  const stages = stagesOf(method)
  const index = stages.indexOf(stage)
  const previous = stages[index - 1]
  const next = stages[index + 1]
  const methodText = m.methods[method]
  const stageText: Record<string, { name: string }> = methodText.stages
  const lesson = (methodText.lessons as Record<string, LessonText>)[stage]
  const cases = LESSONS[method][stage]
  const text = m.learn.lesson
  const done = completed[method].includes(stage)
  /** Whether any sequence here needs more than face moves explained. */
  const beyondFaces = cases.some((lessonCase) =>
    lessonSteps(lessonCase.sequence).some((step) => step.moves.length !== 1),
  )

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/learn/$method"
        params={{ method }}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {methodText.name}: {text.allStages.toLowerCase()}
      </Link>
      <p className="mt-6 text-sm font-medium text-muted-foreground">
        {text.stageOf(index + 1, stages.length)}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{stageText[stage].name}</h1>

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
        {cases.map((lessonCase) => (
          <LessonCaseCard
            key={lessonCase.id}
            lessonCase={lessonCase}
            title={lesson.cases[lessonCase.id].title}
            body={lesson.cases[lessonCase.id].body}
          />
        ))}
      </div>

      <aside className="mt-8 rounded-xl border-l-4 border-primary bg-primary/10 p-4">
        <p className="font-semibold">{text.tip}</p>
        <p className="mt-1">{lesson.tip}</p>
      </aside>

      <p className="mt-6 text-sm text-muted-foreground">
        {text.notation}
        {beyondFaces && ` ${text.wideNotation}`}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button variant={done ? 'secondary' : 'default'} onClick={() => setDone(method, stage, !done)}>
          {done && <Check />}
          {done ? text.completed : text.markComplete}
        </Button>
        <Button asChild variant="outline">
          <Link to="/solver" search={{ method }}>
            {text.tryIt}
          </Link>
        </Button>
      </div>

      <nav className="mt-10 flex justify-between gap-3 border-t pt-6">
        {previous ? (
          <Button asChild variant="ghost">
            <Link to="/learn/$method/$stage" params={{ method, stage: previous }}>
              <ArrowLeft />
              {stageText[previous].name}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button asChild variant="ghost">
            <Link to="/learn/$method/$stage" params={{ method, stage: next }}>
              {stageText[next].name}
              <ArrowRight />
            </Link>
          </Button>
        )}
      </nav>
    </article>
  )
}
