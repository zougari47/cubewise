import { Link } from '@tanstack/react-router'
import { Check, ChevronDown, Copy, History, Play, Trash2, X } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import { CubeNet } from '#/components/cube-net.tsx'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { useLocale, useM } from '#/i18n'
import type { Locale } from '#/i18n/locales.ts'
import { copyText } from '#/lib/clipboard.ts'
import { cn } from '#/lib/utils'
import { stickersFromText } from '#/pages/solver/entry.ts'
import { HISTORY_LIMIT, isWholeCubeTurnText, moveCount, solutionText, stepsByStage, timeAgo } from './history.ts'
import type { SavedSolve } from './history.ts'
import { clearHistory, deleteSolve, useSolveHistory } from './store.ts'

/** How long the copy button says what happened before it offers to copy again. */
const SHOWN_FOR_MS = 2000
/** How often "5 minutes ago" is worked out again. */
const CLOCK_MS = 30_000

/**
 * The language dates are written in. Arabic keeps the digits the rest of the
 * site uses, so a time reads like the move count beside it.
 */
const DATE_LOCALES: Record<Locale, string> = { en: 'en-GB', fr: 'fr', ar: 'ar-u-nu-latn' }

/** The time now, kept fresh while the page is open. Browser only. */
function useNow(): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CLOCK_MS)
    return () => clearInterval(timer)
  }, [])
  return now
}

function useStageName(solve: SavedSolve): (stage: string) => string {
  const m = useM()
  const stages: Record<string, { name: string }> = solve.method === 'short' ? {} : m.methods[solve.method].stages
  return (stage) => stages[stage]?.name ?? stage
}

function Steps({ steps }: { steps: string[] }) {
  return (
    // Notation reads left to right in every language.
    <ol dir="ltr" className="flex flex-wrap gap-1.5 rtl:justify-end">
      {steps.map((step, i) => (
        <li
          key={i}
          className={cn(
            'min-w-9 rounded-md border px-2 py-1 text-center font-mono text-sm font-medium',
            isWholeCubeTurnText(step) && 'border-dashed',
          )}
        >
          {step}
        </li>
      ))}
    </ol>
  )
}

function CopySolution({ solve }: { solve: SavedSolve }) {
  const text = useM().history
  const stageName = useStageName(solve)
  const [outcome, setOutcome] = useState<'copied' | 'failed' | null>(null)

  useEffect(() => {
    if (!outcome) return
    const timer = setTimeout(() => setOutcome(null), SHOWN_FOR_MS)
    return () => clearTimeout(timer)
  }, [outcome])

  const copy = async () => setOutcome((await copyText(solutionText(solve, stageName))) ? 'copied' : 'failed')

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {outcome === 'copied' ? <Check /> : outcome === 'failed' ? <X /> : <Copy />}
      <span aria-live="polite">
        {outcome === 'copied' ? text.copied : outcome === 'failed' ? text.copyFailed : text.copy}
      </span>
    </Button>
  )
}

function SolveSolution({ solve, id }: { solve: SavedSolve; id: string }) {
  const stageName = useStageName(solve)
  const groups = stepsByStage(solve)
  return (
    <div id={id} className="space-y-4 border-t p-4">
      {groups.map(({ stage, steps }, i) =>
        stage === null ? (
          <Steps key={i} steps={steps} />
        ) : (
          steps.length > 0 && (
            <section key={stage} className="space-y-1.5">
              <h3 className="text-sm font-semibold">
                {i + 1}. {stageName(stage)}
              </h3>
              <Steps steps={steps} />
            </section>
          )
        ),
      )}
      <CopySolution solve={solve} />
    </div>
  )
}

function SolveCard({ solve, now }: { solve: SavedSolve; now: number }) {
  const m = useM()
  const locale = useLocale()
  const text = m.history
  const [open, setOpen] = useState(false)
  const solutionId = useId()
  const stickers = useMemo(() => stickersFromText(solve.stickers) ?? [], [solve.stickers])

  const { relative, absolute, iso } = useMemo(() => {
    const tag = DATE_LOCALES[locale]
    const ago = timeAgo(solve.solvedAt, now)
    return {
      relative: new Intl.RelativeTimeFormat(tag, { numeric: 'auto' }).format(ago.value, ago.unit),
      absolute: new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short' }).format(solve.solvedAt),
      iso: new Date(solve.solvedAt).toISOString(),
    }
  }, [locale, solve.solvedAt, now])

  return (
    <li className="rounded-xl border bg-card">
      <div className="flex items-start gap-4 p-4">
        <CubeNet stickers={stickers} label={text.netLabel} className="w-24 shrink-0 sm:w-32" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <h2 className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold">
              {solve.method === 'short' ? m.solver.method.short : m.methods[solve.method].name}
              <Badge variant="secondary">{m.solver.playback.moveCount(moveCount(solve))}</Badge>
            </h2>
            <p className="text-sm text-muted-foreground">
              <time dateTime={iso} title={absolute}>
                {relative}
              </time>
              <span aria-hidden> · </span>
              <span className="inline-block">{absolute}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/{-$locale}/solver" search={{ solve: solve.id }}>
                <Play />
                {text.replay}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              aria-expanded={open}
              aria-controls={open ? solutionId : undefined}
              onClick={() => setOpen(!open)}
            >
              <ChevronDown className={cn('transition-transform', open && 'rotate-180')} />
              {open ? text.hideSolution : text.showSolution}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => deleteSolve(solve.id)}>
              <Trash2 />
              {text.delete}
            </Button>
          </div>
        </div>
      </div>
      {open && <SolveSolution solve={solve} id={solutionId} />}
    </li>
  )
}

function ClearHistory({ count }: { count: number }) {
  const text = useM().history.clear
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 />
          {text.action}
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.body(count)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{text.cancel}</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              clearHistory()
              setOpen(false)
            }}
          >
            {text.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SolveList({ solves }: { solves: SavedSolve[] }) {
  const text = useM().history
  const now = useNow()

  if (solves.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed px-4 py-14 text-center">
        <History aria-hidden className="size-8 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">{text.empty.heading}</h2>
        <p className="mt-1 max-w-prose text-muted-foreground">{text.empty.body}</p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/{-$locale}/solver">{text.empty.action}</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm font-medium text-muted-foreground">
          {text.count(solves.length)}
        </p>
        <ClearHistory count={solves.length} />
      </div>
      <ul className="mt-3 space-y-3">
        {solves.map((solve) => (
          <SolveCard key={solve.id} solve={solve} now={now} />
        ))}
      </ul>
    </>
  )
}

/** The solve history: every cube the user has solved in this browser, newest first. */
export function HistoryPage() {
  const text = useM().history
  const solves = useSolveHistory()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{text.heading}</h1>
      <p className="mt-3 max-w-prose text-pretty text-muted-foreground">{text.lead(HISTORY_LIMIT)}</p>
      {/* The history is only in the browser: until it has been read, there is neither a list nor "no solves" to show. */}
      {solves === null ? <div aria-busy className="min-h-48" /> : <SolveList solves={solves} />}
    </div>
  )
}
