import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { HomeCube } from '#/components/home-cube.tsx'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { m } from '#/i18n'
import { BEGINNER_STAGES } from '#/beginner/stages.ts'
import { pageHead } from '#/lib/seo.ts'

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

function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {m.home.heading}
          </h1>
          <p className="mt-5 max-w-prose text-lg text-pretty text-muted-foreground">{m.home.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/solver">
                {m.home.solveAction}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/learn">{m.home.learnAction}</Link>
            </Button>
          </div>
        </div>
        <HomeCube />
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">{m.home.how.heading}</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {m.home.how.steps.map((step, i) => (
              <li key={step.title}>
                <Card className="h-full">
                  <CardHeader>
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <CardTitle className="mt-2 text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">{step.body}</CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">{m.home.learn.heading}</h2>
        <p className="mt-3 max-w-prose text-muted-foreground">{m.home.learn.lead}</p>
        <ol className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {BEGINNER_STAGES.map((stage, i) => (
            <li key={stage} className="flex items-baseline gap-3">
              <span className="text-sm font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
              <span className="font-medium">{m.learn.stages[stage].name}</span>
            </li>
          ))}
        </ol>
        <Button asChild variant="outline" className="mt-8">
          <Link to="/learn">
            {m.home.learn.action}
            <ArrowRight />
          </Link>
        </Button>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">{m.home.faq.heading}</h2>
          <dl className="mt-6 space-y-6">
            {m.home.faq.items.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold">{item.question}</dt>
                <dd className="mt-1.5 text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
