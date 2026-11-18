import type { LessonPart } from '#/i18n/method-text.ts'
import { LessonCaseCard } from './lesson-case.tsx'
import type { LessonCase } from './lessons.ts'

/**
 * A lesson told in numbered parts: each has a heading, a few paragraphs and,
 * directly under them, the cases that show what the words say.
 */
export function LessonParts({
  parts,
  cases,
  caseText,
}: {
  parts: readonly LessonPart[]
  cases: readonly LessonCase[]
  /** A title and a description for each case, by case id. */
  caseText: Record<string, { title: string; body: string }>
}) {
  return parts.map((part, number) => (
    <section key={part.title} className="mt-10">
      <h2 className="flex items-baseline gap-3 text-xl font-semibold tracking-tight">
        <span className="flex size-7 shrink-0 items-center justify-center self-center rounded-md bg-primary/15 text-sm font-semibold text-primary tabular-nums">
          {number + 1}
        </span>
        {part.title}
      </h2>
      {part.body.map((paragraph) => (
        <p key={paragraph} className="mt-3">
          {paragraph}
        </p>
      ))}
      {part.cases && (
        <div className="mt-4 space-y-4">
          {part.cases.map((id) => (
            <LessonCaseCard
              key={id}
              lessonCase={cases.find((lessonCase) => lessonCase.id === id)!}
              title={caseText[id].title}
              body={caseText[id].body}
            />
          ))}
        </div>
      )}
    </section>
  ))
}
