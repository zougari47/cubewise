import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ForwardArrow } from '#/components/arrows.tsx'
import { Badge } from '#/components/ui/badge'
import { METHOD_IDS, stagesOf } from '#/core/methods/index.ts'
import { useM } from '#/i18n'
import type { SolverAboutPart } from '#/i18n/en/solver-about.ts'
import { SuggestUpdate } from '#/pages/learn/suggest-update.tsx'

const LINK = 'inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline'

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="text-2xl font-bold tracking-tight text-balance">{heading}</h2>
      {children}
    </section>
  )
}

function Paragraphs({ body }: { body: readonly string[] }) {
  return body.map((paragraph) => (
    <p key={paragraph} className="mt-3 leading-7 text-pretty">
      {paragraph}
    </p>
  ))
}

function Parts({ parts, last }: { parts: readonly SolverAboutPart[]; last?: ReactNode }) {
  return parts.map((part, i) => (
    <div key={part.title} className="mt-6">
      <h3 className="text-lg font-semibold">{part.title}</h3>
      <Paragraphs body={part.body} />
      {i === parts.length - 1 && last}
    </div>
  ))
}

/**
 * What the solver is and how to use it, under the tool, for someone who came
 * from a search: plain words, and links on to the lessons. It is all in the
 * prerendered page and adds nothing to download but its text.
 */
export function SolverAbout() {
  const m = useM()
  const text = m.solver.about

  return (
    <article className="mx-auto mt-16 max-w-3xl border-t pt-12">
      <Section heading={text.what.heading}>
        <Paragraphs body={text.what.body} />
      </Section>

      <Section heading={text.enter.heading}>
        <Paragraphs body={text.enter.body} />
        <Parts parts={text.enter.parts ?? []} />
        <div className="mt-6 rounded-xl border bg-muted/40 p-5">
          <h3 className="text-lg font-semibold">{text.enter.tips.title}</h3>
          <ul className="mt-3 list-disc space-y-2 ps-5 marker:text-primary">
            {text.enter.tips.items.map((tip) => (
              <li key={tip} className="leading-7 text-pretty">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section heading={text.solutions.heading}>
        <Paragraphs body={text.solutions.body} />
        <Parts
          parts={text.solutions.parts ?? []}
          last={
            <>
              <ul className="mt-4 divide-y rounded-xl border bg-card">
                {METHOD_IDS.map((method) => (
                  <li key={method} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3">
                    <Link to="/{-$locale}/learn/$method" params={{ method }} className={LINK}>
                      {m.methods[method].name}
                      <ForwardArrow className="size-4" />
                    </Link>
                    <span className="flex items-center gap-3 text-sm text-muted-foreground">
                      {m.learn.stageCount(stagesOf(method).length)}
                      <Badge variant="secondary">{m.methods[method].level}</Badge>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <Link to="/{-$locale}/learn/$method" params={{ method: 'beginner' }} className={LINK}>
                  {text.solutions.startAction}
                  <ForwardArrow className="size-4" />
                </Link>
                <Link to="/{-$locale}/learn" className={LINK}>
                  {text.solutions.allMethods}
                  <ForwardArrow className="size-4" />
                </Link>
              </p>
            </>
          }
        />
      </Section>

      <Section heading={text.reading.heading}>
        <Paragraphs body={text.reading.body} />
        <p className="mt-4">
          <Link to="/{-$locale}/learn/before-you-start" className={LINK}>
            {text.reading.action}
            <ForwardArrow className="size-4" />
          </Link>
        </p>
      </Section>

      <Section heading={text.how.heading}>
        <Paragraphs body={text.how.body} />
      </Section>

      <Section heading={text.problems.heading}>
        <Paragraphs body={text.problems.body} />
        <Parts parts={text.problems.parts ?? []} />
      </Section>

      <Section heading={text.faq.heading}>
        <dl className="mt-5 divide-y rounded-2xl border bg-card">
          {text.faq.items.map((item) => (
            <div key={item.question} className="p-5">
              <dt className="font-heading text-lg font-semibold">{item.question}</dt>
              <dd className="mt-2 leading-7 text-muted-foreground">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <div className="mt-6 flex justify-end">
        <SuggestUpdate text="solver-about" />
      </div>
    </article>
  )
}
