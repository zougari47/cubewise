import { Box } from 'lucide-react'
import { Suspense, lazy, useMemo, useState } from 'react'
import { CubePicture } from '#/components/cube-picture.tsx'
import { PlaybackButtons } from '#/components/playback-buttons.tsx'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { rotateStickers } from '#/core/cube/orientation.ts'
import { cubeAfterSteps, isWholeCubeTurn } from '#/core/cube/steps.ts'
import { useM } from '#/i18n'
import { cn } from '#/lib/utils'
import { usePlayback } from '#/pages/solver/playback.ts'
import { lessonColours, lessonOrientation, lessonSteps } from './lessons.ts'
import type { LessonCase } from './lessons.ts'

const CubeView = lazy(() => import('#/components/cube-view.tsx'))

/**
 * One case of a lesson: a 2D picture of the cube before the sequence, the
 * sequence itself, and a 3D player that is only downloaded when asked for.
 */
export function LessonCaseCard({
  lessonCase,
  title,
  body,
}: {
  lessonCase: LessonCase
  title: string
  body: string
}) {
  const m = useM()
  const [live, setLive] = useState(false)
  const steps = useMemo(() => lessonSteps(lessonCase.sequence), [lessonCase])
  const playback = usePlayback(steps)

  const orientation = lessonOrientation(lessonCase, steps, playback.done)
  const colours = lessonColours(cubeAfterSteps(lessonCase.start, steps, playback.done), lessonCase)
  const picture = (
    <CubePicture
      colours={rotateStickers(colours, orientation)}
      label={title}
      className="size-full p-[6%]"
    />
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
        <div className="mx-auto aspect-square w-44 overflow-hidden rounded-xl bg-muted/50">
          {live ? (
            <Suspense fallback={picture}>
              <CubeView
                colours={colours}
                orientation={orientation}
                turn={playback.turn}
                onTurnEnd={playback.finishTurn}
                className="size-full"
              />
            </Suspense>
          ) : (
            picture
          )}
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground">{body}</p>
          {steps.length > 0 && (
            <>
              <p dir="ltr" className="flex flex-wrap gap-1.5 rtl:justify-end" aria-label={lessonCase.sequence}>
                {steps.map((step, i) => (
                  <span
                    key={i}
                    className={cn(
                      'rounded-md border px-2 py-0.5 font-mono text-sm font-medium',
                      isWholeCubeTurn(step) && 'border-dashed',
                      i === playback.done &&
                        live &&
                        'border-solid border-primary bg-primary text-primary-foreground',
                    )}
                  >
                    {step.text}
                  </span>
                ))}
              </p>
              {live ? (
                <PlaybackButtons playback={playback} />
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setLive(true)
                    playback.toggle()
                  }}
                >
                  <Box />
                  {m.learn.lesson.watch}
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
