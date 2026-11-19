import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { BackArrow, ForwardArrow } from '#/components/arrows.tsx'
import { Button } from '#/components/ui/button'
import { stagesOf } from '#/core/methods/index.ts'
import type { MethodId } from '#/core/methods/index.ts'
import { useM } from '#/i18n'
import type { LessonText } from '#/i18n/method-text.ts'
import { CopyMarkdown } from './copy-markdown.tsx'
import { LessonCaseCard } from './lesson-case.tsx'
import { lessonMarkdown } from './lesson-markdown.ts'
import { LessonParts } from './lesson-parts.tsx'
import { lessonSteps } from './lessons.ts'
import type { LessonCase } from './lessons.ts'
import { LESSONS } from './lessons/index.ts'
import { useLessonProgress } from './progress.ts'
import { SuggestUpdate } from './suggest-update.tsx'
import { lessonTextMethod } from './text-source.ts'

/** The lesson for one stage of a method. */
export function LessonPage({ method, stage }: { method: MethodId; stage: string }) {
  const m = useM()
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
  const pointer = m.learn.beforeYouStart.pointer
  const done = completed[method].includes(stage)
  /** Whether any sequence here needs more than face moves explained. */
  const beyondFaces = cases.some((lessonCase) =>
    lessonSteps(lessonCase.sequence).some((step) => step.moves.length !== 1),
  )

  const caseCard = (lessonCase: LessonCase) => (
    <LessonCaseCard
      key={lessonCase.id}
      lessonCase={lessonCase}
      title={lesson.cases[lessonCase.id].title}
      body={lesson.cases[lessonCase.id].body}
    />
  )

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/{-$locale}/learn/$method"
        params={{ method }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <BackArrow className="size-3.5" />
        {text.backToStages(methodText.name)}
      </Link>
      <p className="mt-6 text-sm font-medium text-muted-foreground">
        {text.stageOf(index + 1, stages.length)}
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{stageText[stage].name}</h1>
        <CopyMarkdown markdown={(linkTo) => lessonMarkdown({ m, method, stage, cases, linkTo })} />
      </div>

      <section className="mt-6 rounded-xl border bg-muted/40 p-5">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {text.goal}
        </h2>
        <p className="mt-1.5 text-lg">{lesson.goal}</p>
      </section>

      {lesson.parts ? (
        <LessonParts parts={lesson.parts} cases={cases} caseText={lesson.cases} />
      ) : (
        <>
          <h2 className="mt-10 text-xl font-semibold tracking-tight">{text.steps}</h2>
          <ol className="mt-4 list-decimal space-y-3 ps-5 marker:font-semibold marker:text-muted-foreground">
            {(lesson.steps ?? []).map((step) => (
              <li key={step} className="ps-1">
                {step}
              </li>
            ))}
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">{text.cases}</h2>
          <div className="mt-4 space-y-4">{cases.map(caseCard)}</div>
        </>
      )}

      <aside className="mt-8 rounded-xl border-s-4 border-primary bg-primary/10 p-4">
        <p className="font-semibold">{text.tip}</p>
        <p className="mt-1">{lesson.tip}</p>
      </aside>

      <p className="mt-6 text-sm text-muted-foreground">
        {text.notation}
        {beyondFaces && ` ${text.wideNotation}`} {pointer.question}{' '}
        <Link to="/{-$locale}/learn/before-you-start" className="underline underline-offset-4 hover:text-foreground">
          {pointer.link}
        </Link>
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button variant={done ? 'secondary' : 'default'} onClick={() => setDone(method, stage, !done)}>
          {done && <Check />}
          {done ? text.completed : text.markComplete}
        </Button>
        <Button asChild variant="outline">
          <Link to="/{-$locale}/solver" search={{ method }}>
            {text.tryIt}
          </Link>
        </Button>
        <SuggestUpdate text={lessonTextMethod(m.methods, method, stage)} className="ms-auto" />
      </div>

      <nav className="mt-10 flex justify-between gap-3 border-t pt-6">
        {previous ? (
          <Button asChild variant="ghost">
            <Link to="/{-$locale}/learn/$method/$stage" params={{ method, stage: previous }}>
              <BackArrow />
              {stageText[previous].name}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button asChild variant="ghost">
            <Link to="/{-$locale}/learn/$method/$stage" params={{ method, stage: next }}>
              {stageText[next].name}
              <ForwardArrow />
            </Link>
          </Button>
        )}
      </nav>
    </article>
  )
}
