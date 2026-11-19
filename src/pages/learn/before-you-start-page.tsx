import { Link } from '@tanstack/react-router'
import { BackArrow, ForwardArrow } from '#/components/arrows.tsx'
import { Button } from '#/components/ui/button'
import { useM } from '#/i18n'
import { BEFORE_YOU_START_CASES } from './before-you-start.ts'
import { CopyMarkdown } from './copy-markdown.tsx'
import { beforeYouStartMarkdown } from './lesson-markdown.ts'
import { LessonParts } from './lesson-parts.tsx'
import { SuggestUpdate } from './suggest-update.tsx'

/** What every method needs, for someone who has never solved a cube. */
export function BeforeYouStartPage() {
  const m = useM()
  const text = m.learn.beforeYouStart

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/{-$locale}/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <BackArrow className="size-3.5" />
        {m.learn.method.allMethods}
      </Link>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{text.name}</h1>
        <CopyMarkdown markdown={(linkTo) => beforeYouStartMarkdown({ m, linkTo })} />
      </div>
      <p className="mt-3 text-lg text-muted-foreground">{text.lead}</p>

      <LessonParts parts={text.parts} cases={BEFORE_YOU_START_CASES} caseText={text.cases} />

      <section className="mt-10 rounded-xl border bg-muted/40 p-6">
        <h2 className="text-lg font-semibold">{text.next.heading}</h2>
        <p className="mt-2 text-muted-foreground">{text.next.body}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/{-$locale}/learn/$method" params={{ method: 'beginner' }}>
              {text.next.action}
              <ForwardArrow />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/{-$locale}/learn">{text.next.allMethods}</Link>
          </Button>
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <SuggestUpdate text="before-you-start" />
      </div>
    </article>
  )
}
