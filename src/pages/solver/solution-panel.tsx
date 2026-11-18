import { Link } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { PlaybackButtons } from '#/components/playback-buttons.tsx'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Kbd } from '#/components/ui/kbd'
import { Slider } from '#/components/ui/slider'
import { cubeFaceSeenAs } from '#/core/cube/orientation.ts'
import { isWholeCubeTurn } from '#/core/cube/steps.ts'
import { m } from '#/i18n'
import { cn } from '#/lib/utils'
import type { ColourKey } from './entry.ts'
import { MAX_PAUSE_MS } from './playback.ts'
import type { Playback } from './playback.ts'
import type { SolvedSteps } from './solver.worker.ts'

export function KeyHints({ hints }: { hints: { keys: string[]; text: string }[] }) {
  return (
    <ul className="hidden space-y-1.5 text-sm text-muted-foreground md:block">
      {hints.map((hint) => (
        <li key={hint.text} className="flex items-center gap-2">
          <span className="flex shrink-0 gap-0.5">
            {hint.keys.map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </span>
          {hint.text}
        </li>
      ))}
    </ul>
  )
}

function StepChips({
  solved,
  from,
  count,
  done,
}: {
  solved: SolvedSteps
  from: number
  count: number
  done: number
}) {
  const current = useRef<HTMLLIElement>(null)
  useEffect(() => {
    current.current?.scrollIntoView({ block: 'nearest' })
  }, [done])

  return (
    <ol className="flex flex-wrap gap-1.5">
      {solved.steps.slice(from, from + count).map((step, offset) => {
        const index = from + offset
        return (
          <li
            key={index}
            ref={index === done ? current : undefined}
            aria-current={index === done ? 'step' : undefined}
            className={cn(
              'min-w-9 rounded-md border px-2 py-1 text-center font-mono text-sm font-medium',
              isWholeCubeTurn(step) && 'border-dashed',
              index < done && 'border-transparent bg-muted text-muted-foreground',
              index === done && 'border-solid border-primary bg-primary text-primary-foreground',
            )}
          >
            {step.text}
          </li>
        )
      })}
    </ol>
  )
}

/** The solution beside the 3D cube: how to hold it, the steps, and the controls. */
export function SolutionPanel({
  solved,
  scheme,
  playback,
  pauseMs,
  onPauseChange,
  onEdit,
}: {
  solved: SolvedSteps
  /** The user's centre colours, in U R F D L B order. */
  scheme: ColourKey[]
  playback: Playback
  /** The pause between two moves while playing, in milliseconds. */
  pauseMs: number
  onPauseChange: (pauseMs: number) => void
  onEdit: () => void
}) {
  const text = m.solver.playback
  const total = solved.steps.length
  const moveCount = solved.steps.filter((step) => !isWholeCubeTurn(step)).length
  const byStage = solved.method !== 'short'
  const stageNames: Record<string, { name: string }> =
    solved.method === 'short' ? {} : m.methods[solved.method].stages

  let from = 0
  const stages = solved.stages.map((stage) => {
    const start = from
    from += stage.count
    return { ...stage, from: start }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          {text.heading}
          <Badge variant="secondary">{text.moveCount(moveCount)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {total === 0 ? (
          <p>{text.alreadySolved}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {text.hold(
                scheme[cubeFaceSeenAs(solved.start, 2)],
                scheme[cubeFaceSeenAs(solved.start, 0)],
              )}
            </p>

            <div
              aria-label={solved.steps.map((step) => step.text).join(' ')}
              className="max-h-72 space-y-4 overflow-y-auto pr-1"
            >
              {byStage ? (
                stages.map((stage, i) => (
                  <section key={stage.stage} className="space-y-1.5">
                    <h3 className="flex items-baseline justify-between gap-2 text-sm font-semibold">
                      <span>
                        {i + 1}. {stageNames[stage.stage].name}
                      </span>
                      <Link
                        to="/learn/$method/$stage"
                        params={{ method: solved.method as string, stage: stage.stage }}
                        className="text-xs font-normal text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        {text.lesson}
                      </Link>
                    </h3>
                    {stage.count === 0 ? (
                      <p className="text-sm text-muted-foreground">{text.stageDone}</p>
                    ) : (
                      <StepChips solved={solved} from={stage.from} count={stage.count} done={playback.done} />
                    )}
                  </section>
                ))
              ) : (
                <StepChips solved={solved} from={0} count={total} done={playback.done} />
              )}
            </div>

            <PlaybackButtons playback={playback} />
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span id="playback-pause" className="font-medium">
                  {text.pauseLabel}
                </span>
                <span className="text-muted-foreground tabular-nums">{text.pauseValue(pauseMs)}</span>
              </div>
              <Slider
                aria-labelledby="playback-pause"
                min={0}
                max={MAX_PAUSE_MS}
                step={100}
                value={[pauseMs]}
                onValueChange={([value]) => onPauseChange(value)}
              />
            </div>
            <p aria-live="polite" className="text-sm font-medium">
              {playback.done >= total ? text.done : text.progress(playback.done, total)}
            </p>
            <p className="text-sm text-muted-foreground">
              {text.notation}
              {solved.steps.some(isWholeCubeTurn) && ` ${text.wholeCubeNotation}`}
              {solved.steps.some((step) => step.layers) && ` ${text.wideNotation}`}
            </p>
            <KeyHints hints={text.keys} />
          </>
        )}
        <Button variant="outline" onClick={onEdit} className="w-full">
          <Pencil />
          {text.edit}
        </Button>
      </CardContent>
    </Card>
  )
}
