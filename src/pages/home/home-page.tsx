import { Link } from '@tanstack/react-router'
import { Check, Grid3x3, Play, WandSparkles } from 'lucide-react'
import { ForwardArrow } from '#/components/arrows.tsx'
import { HomeCube } from '#/components/home-cube.tsx'
import { Button } from '#/components/ui/button'
import { BEGINNER_STAGES } from '#/core/methods/beginner/stages.ts'
import { useM } from '#/i18n'
import { COLOUR_HEX } from '#/pages/solver/colours.ts'
import { Roadmap } from './roadmap.tsx'

/** One icon and one cube colour for each "how it works" step, in order. */
const STEP_LOOKS = [
  { icon: Grid3x3, colour: COLOUR_HEX.R },
  { icon: WandSparkles, colour: COLOUR_HEX.Y },
  { icon: Play, colour: COLOUR_HEX.B },
]

/** On a wide screen each step card sits one notch lower than the one before it. */
const STEP_DROPS = ['', 'md:translate-y-5', 'md:translate-y-10']

/**
 * The home page: what the site does, how the solver works, the road map of
 * every method, where a newcomer starts, and the questions people ask.
 */
export function HomePage() {
  const m = useM()
  const start = m.learn.beforeYouStart.card
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 end-0 size-[44rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
              {m.home.heading}
            </h1>
            <p className="mt-6 max-w-prose text-lg text-pretty text-muted-foreground">{m.home.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 px-5 text-base">
                <Link to="/{-$locale}/solver">
                  {m.home.solveAction}
                  <ForwardArrow />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-5 text-base">
                <Link to="/{-$locale}/learn">{m.home.learnAction}</Link>
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {m.home.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-1.5">
                  <Check aria-hidden className="size-4 text-primary" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <HomeCube />
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-3xl font-bold tracking-tight">{m.home.how.heading}</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3 md:pb-10">
            {m.home.how.steps.map((step, i) => {
              const { icon: Icon, colour } = STEP_LOOKS[i]
              return (
                <li key={step.title} className={STEP_DROPS[i]}>
                  <div className="h-full rounded-2xl border bg-card p-6 shadow-lg shadow-black/10">
                    <div className="flex items-center justify-between">
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
                      <span aria-hidden className="font-heading text-4xl font-bold text-foreground/10 tabular-nums">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="overflow-x-clip">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{m.home.roadmap.heading}</h2>
            <p className="mt-4 text-lg text-pretty text-muted-foreground">{m.home.roadmap.lead}</p>
          </div>
          <div className="mt-10 md:mt-14">
            <Roadmap />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 md:-mt-4">
            <p className="max-w-prose text-sm text-muted-foreground">{m.home.roadmap.movesNote}</p>
            <Button asChild variant="outline">
              <Link to="/{-$locale}/learn">
                {m.home.roadmap.allMethods}
                <ForwardArrow />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-balance">{m.home.learn.heading}</h2>
            <p className="mt-3 max-w-prose text-lg text-pretty text-muted-foreground">{m.home.learn.lead}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/{-$locale}/learn/$method" params={{ method: 'beginner' }}>
                  {m.home.learn.action}
                  <ForwardArrow />
                </Link>
              </Button>
            </div>
            <Link
              to="/{-$locale}/learn/before-you-start"
              className="group mt-8 block rounded-xl border border-primary/40 bg-primary/10 p-5 transition-colors hover:border-primary/70"
            >
              <h3 className="text-lg font-semibold">{start.heading}</h3>
              <p className="mt-1 text-muted-foreground">{start.body}</p>
              <span className="mt-3 flex items-center gap-2 font-medium text-primary">
                {start.action}
                <ForwardArrow className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </span>
            </Link>
          </div>
          <ol className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {BEGINNER_STAGES.map((stage, i) => {
              const text = m.methods.beginner.stages[stage]
              return (
                <li key={stage}>
                  <Link
                    to="/{-$locale}/learn/$method/$stage"
                    params={{ method: 'beginner', stage }}
                    className="group flex h-full items-center gap-4 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/50 hover:bg-accent"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-semibold text-primary tabular-nums">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{text.name}</span>
                      <span className="hidden text-sm text-muted-foreground lg:line-clamp-1">{text.summary}</span>
                    </span>
                    <ForwardArrow className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
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

      <section className="px-4 pb-16 md:pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-primary/30 bg-primary/10 px-6 py-12 text-center md:py-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{m.home.closing.heading}</h2>
          <p className="mx-auto mt-4 max-w-prose text-lg text-pretty text-muted-foreground">{m.home.closing.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-5 text-base">
              <Link to="/{-$locale}/solver">
                {m.home.solveAction}
                <ForwardArrow />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5 text-base">
              <Link to="/{-$locale}/learn/$method" params={{ method: 'beginner' }}>
                {m.home.closing.learnAction}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
