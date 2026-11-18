import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { m } from '#/i18n'
import { BEFORE_YOU_START_CASES } from './before-you-start.ts'
import { LessonParts } from './lesson-parts.tsx'

/** What every method needs, for someone who has never solved a cube. */
export function BeforeYouStartPage() {
  const text = m.learn.beforeYouStart

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/learn" className="text-sm text-muted-foreground hover:text-foreground">
        ← {m.learn.method.allMethods}
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{text.name}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{text.lead}</p>

      <LessonParts parts={text.parts} cases={BEFORE_YOU_START_CASES} caseText={text.cases} />

      <section className="mt-10 rounded-xl border bg-muted/40 p-6">
        <h2 className="text-lg font-semibold">{text.next.heading}</h2>
        <p className="mt-2 text-muted-foreground">{text.next.body}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/learn/$method" params={{ method: 'beginner' }}>
              {text.next.action}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/learn">{text.next.allMethods}</Link>
          </Button>
        </div>
      </section>
    </article>
  )
}
