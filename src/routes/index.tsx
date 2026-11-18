import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Grid3x3, Play, WandSparkles } from 'lucide-react'
import { HomeCube } from '#/components/home-cube.tsx'
import { Button } from '#/components/ui/button'
import { m } from '#/i18n'
import { BEGINNER_STAGES } from '#/core/methods/beginner/stages.ts'
import { pageHead } from '#/lib/seo.ts'
import { COLOUR_HEX } from '#/pages/solver/colours.ts'

const faqStructuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: m.home.faq.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

export const Route = createFileRoute('/')({
  head: () => ({
    ...pageHead({ title: m.home.title, description: m.site.description }),
    scripts: [{ type: 'application/ld+json', children: faqStructuredData }],
  }),
  component: Home,
})

/** One icon and one cube colour for each "how it works" step, in order. */
const STEP_LOOKS = [
  { icon: Grid3x3, colour: COLOUR_HEX.R },
  { icon: WandSparkles, colour: COLOUR_HEX.Y },
  { icon: Play, colour: COLOUR_HEX.B },
]

/** On a wide screen each step card sits one notch lower than the one before it. */
const STEP_DROPS = ['', 'md:translate-y-5', 'md:translate-y-10']

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 size-[44rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
              {m.home.heading}
            </h1>
            <p className="mt-6 max-w-prose text-lg text-pretty text-muted-foreground">{m.home.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 px-5 text-base">
                <Link to="/solver">
                  {m.home.solveAction}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-5 text-base">
                <Link to="/learn">{m.home.learnAction}</Link>
              </Button>
            </div>
          </div>
          <HomeCube />
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">{m.home.how.heading}</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3 md:pb-10">
            {m.home.how.steps.map((step, i) => {
              const { icon: Icon, colour } = STEP_LOOKS[i]
              return (
                <li key={step.title} className={STEP_DROPS[i]}>
                  <div className="h-full rounded-2xl border bg-card p-6 shadow-lg shadow-black/10">
                    <span
                      aria-hidden
                      className="flex size-11 items-center justify-center rounded-xl"
                      style={{
                        color: colour,
                        backgroundColor: `color-mix(in oklch, ${colour} 22%, transparent)`,
                      }}
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold tracking-tight">{m.home.learn.heading}</h2>
        <p className="mt-3 max-w-prose text-lg text-muted-foreground">{m.home.learn.lead}</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BEGINNER_STAGES.map((stage, i) => (
            <li key={stage}>
              <Link
                to="/learn/$method/$stage"
                params={{ method: 'beginner', stage }}
                className="group flex h-full items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-sm font-semibold text-primary tabular-nums">
                  {i + 1}
                </span>
                <span className="font-medium">{m.methods.beginner.stages[stage].name}</span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/learn/$method" params={{ method: 'beginner' }}>
              {m.home.learn.action}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/learn">{m.home.learn.otherMethods}</Link>
          </Button>
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">{m.home.faq.heading}</h2>
          <dl className="mt-8 divide-y rounded-2xl border bg-card">
            {m.home.faq.items.map((item) => (
              <div key={item.question} className="p-6">
                <dt className="font-heading text-lg font-semibold">{item.question}</dt>
                <dd className="mt-2 text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
