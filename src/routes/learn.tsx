import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { m } from '#/i18n'
import { BEGINNER_STAGES } from '#/learn/stages.ts'
import { pageHead } from '#/lib/seo.ts'

export const Route = createFileRoute('/learn')({
  head: () => pageHead({ title: m.learn.title, description: m.learn.description }),
  component: LearnPage,
})

function LearnPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{m.learn.heading}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{m.learn.lead}</p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">{m.learn.stagesHeading}</h2>
      <ol className="mt-4 space-y-3">
        {BEGINNER_STAGES.map((stage, i) => (
          <li key={stage}>
            <Card>
              <CardHeader>
                <p className="text-sm font-medium text-muted-foreground">
                  {m.learn.stageNumber(i + 1)}
                </p>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-lg">
                  {m.learn.stages[stage].name}
                  <Badge variant="secondary">{m.learn.soon}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {m.learn.stages[stage].summary}
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <section className="mt-10 rounded-xl border bg-muted/40 p-6">
        <h2 className="text-lg font-semibold">{m.learn.meanwhile.heading}</h2>
        <p className="mt-2 text-muted-foreground">{m.learn.meanwhile.body}</p>
        <Button asChild className="mt-4">
          <Link to="/solver">
            {m.learn.meanwhile.action}
            <ArrowRight />
          </Link>
        </Button>
      </section>
    </div>
  )
}
