import { ClientOnly } from '@tanstack/react-router'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Camera, Eraser, Redo2, RotateCcw, Undo2 } from 'lucide-react'
import { Suspense, lazy, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { CubeNet } from '#/components/cube-net.tsx'
import { CubePicture } from '#/components/cube-picture.tsx'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { CubieCube } from '#/core/cube/cubie.ts'
import { METHOD_IDS } from '#/core/methods/index.ts'
import { frontFace, frontStickers } from '#/core/cube/orientation.ts'
import type { TurnDirection } from '#/core/cube/orientation.ts'
import { cubeAfterSteps } from '#/core/cube/steps.ts'
import { stickersFromCube } from '#/core/cube/stickers.ts'
import { useM } from '#/i18n'
import type { Messages } from '#/i18n'
import { issueReportBody } from '#/i18n/issue-report.ts'
import { copyText } from '#/lib/clipboard.ts'
import { newIssueUrl } from '#/lib/repo.ts'
import { cn } from '#/lib/utils'
import { findSolve, saveSolve } from '#/pages/history/store.ts'
import { COLOUR_HEX, hexOf } from './colours.ts'
import {
  COLOUR_KEYS,
  checkEntry,
  colourCounts,
  entryReducer,
  initialEntry,
  isColourKey,
  isSavedStickers,
  stickersFromText,
  stickersText,
} from './entry.ts'
import type { ColourKey, EntryProblem, Paint } from './entry.ts'
import { usePlayback, usePlaybackPause } from './playback.ts'
import { ReportIssue } from './report-issue.tsx'
import { HistoryLink, KeyHints, SolutionPanel } from './solution-panel.tsx'
import { solveCube, warmUpSolver } from './solver-client.ts'
import type { SolveMethod, SolvedSteps } from './solver.worker.ts'

const CubeView = lazy(() => import('#/components/cube-view.tsx'))
const ScanPanel = lazy(() => import('./scan/scan-panel.tsx'))

const STORAGE_KEY = 'cubewise.entry.v1'
const CURSOR_FRAME = '#0ea5e9'
const PROBLEM_FRAME = '#ef4444'

interface Solution {
  cube: CubieCube
  /** The user's centre colours, in U R F D L B order. */
  scheme: ColourKey[]
  solved: SolvedSteps
}

function problemText(
  text: Messages['solver']['problems'],
  problem: EntryProblem | 'failed',
  counts: Record<ColourKey, number>,
): string {
  if (problem === 'failed') return text.failed
  switch (problem.code) {
    case 'unpainted':
      return text.unpainted(problem.stickers.length)
    case 'wrong-colour-count':
      return text['wrong-colour-count'](
        COLOUR_KEYS.filter((colour) => counts[colour] !== 9).map((colour) => ({
          colour,
          count: counts[colour],
        })),
      )
    default:
      return text[problem.code]
  }
}

export function SolverApp({
  initialMethod,
  reopen,
  onReopened,
}: {
  initialMethod?: SolveMethod
  /** The id of a solve in the history to open the solver on. */
  reopen?: string
  /** Called once that solve has been looked up, found or not. */
  onReopened?: () => void
}) {
  const m = useM()
  const [entry, dispatch] = useReducer(entryReducer, undefined, initialEntry)
  const [activeColour, setActiveColour] = useState<ColourKey>('W')
  const [problem, setProblem] = useState<EntryProblem | 'failed' | null>(null)
  const [solving, setSolving] = useState(false)
  const [method, setMethod] = useState<SolveMethod>('short')
  const [solution, setSolution] = useState<Solution | null>(null)

  // Set after the first render, which must match the prerendered page.
  useEffect(() => {
    if (initialMethod) setMethod(initialMethod)
  }, [initialMethod])
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  /** The stickers a scan filled in, while they are still untouched. */
  const [scanned, setScanned] = useState<Paint[] | null>(null)
  /** Details of the last scan, for reporting one that went wrong. */
  const [scanReport, setScanReport] = useState<{ text: string; copied: boolean } | null>(null)
  const [pauseMs, setPauseMs] = usePlaybackPause()
  const playback = usePlayback(solution?.solved.steps ?? null, pauseMs)

  const front = frontStickers(entry.orientation)
  const cursorSticker = front[entry.cursor]
  const counts = useMemo(() => colourCounts(entry.stickers), [entry.stickers])

  // --- Saving and restoring the entered colours

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (isSavedStickers(saved)) dispatch({ type: 'load', stickers: saved })
    } catch {
      // Unreadable saved data is simply ignored.
    }
    setLoaded(true)
    warmUpSolver()
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.stickers))
    } catch {
      // Storage can be full or blocked; entering colours still works.
    }
  }, [entry.stickers, loaded])

  useEffect(() => {
    setProblem(null)
  }, [entry.stickers])

  // --- Entering colours

  const paintSticker = useCallback(
    (sticker: number) => {
      const face = Math.floor(sticker / 9)
      if (face !== frontFace(entry.orientation)) dispatch({ type: 'show-face', face })
      else dispatch({ type: 'paint-sticker', sticker, colour: activeColour })
    },
    [entry.orientation, activeColour],
  )

  /** Solves these stickers; `keep` puts a solve that succeeds in the history. */
  const solveStickers = useCallback((stickers: readonly Paint[], solveMethod: SolveMethod, keep: boolean) => {
    const check = checkEntry(stickers)
    if (!check.ok) {
      setProblem(check.problem)
      return
    }
    setSolving(true)
    solveCube(check.cube, solveMethod)
      .then((solved) => {
        setSolution({ cube: check.cube, scheme: check.scheme, solved })
        if (!keep) return
        saveSolve({
          stickers: stickersText(stickers),
          method: solveMethod,
          solution: solved.steps.map((step) => step.text).join(' '),
          stages: solved.stages,
        })
      })
      .catch(() => setProblem('failed'))
      .finally(() => setSolving(false))
  }, [])

  const solve = useCallback(() => {
    if (!solving) solveStickers(entry.stickers, method, true)
  }, [entry.stickers, solving, method, solveStickers])

  // --- Opening a solve from the history

  // The cube and method of the solve are filled in and solved again, to be
  // played. It was solved before, so this is not a new solve for the history;
  // the cube that was on the page is one undo away.
  useEffect(() => {
    if (!reopen) return
    const saved = findSolve(reopen)
    const stickers = saved ? stickersFromText(saved.stickers) : null
    onReopened?.()
    if (!saved || !stickers) return
    dispatch({ type: 'fill', stickers })
    setMethod(saved.method)
    solveStickers(stickers, saved.method, false)
  }, [reopen, onReopened, solveStickers])

  const editCube = useCallback(() => setSolution(null), [])

  const finishScan = useCallback((stickers: Paint[], report: string) => {
    dispatch({ type: 'fill', stickers })
    setScanned(stickers)
    setScanReport({ text: report, copied: false })
    setScanning(false)
  }, [])
  const cancelScan = useCallback(() => setScanning(false), [])
  const copyScanReport = () => {
    if (!scanReport) return
    void copyText(scanReport.text).then((copied) => {
      if (copied) setScanReport({ ...scanReport, copied: true })
    })
  }

  // --- Keyboard

  const onKey = useRef<(event: KeyboardEvent) => void>(() => {})
  onKey.current = (event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest('input, textarea, select, [contenteditable="true"], [role="slider"], [role="dialog"]')) return
    const key = event.key
    const command = event.ctrlKey || event.metaKey

    if (scanning) {
      if (key === 'Escape') cancelScan()
      return
    }

    if (solution) {
      if (command || event.altKey) return
      if (key === ' ') playback.toggle()
      else if (key === 'ArrowRight') {
        playback.pause()
        playback.stepForward()
      } else if (key === 'ArrowLeft') playback.stepBack()
      else if (key.toLowerCase() === 'e') editCube()
      else return
      event.preventDefault()
      return
    }

    if (command) {
      const letter = key.toLowerCase()
      if (letter === 'z') dispatch({ type: event.shiftKey ? 'redo' : 'undo' })
      else if (letter === 'y') dispatch({ type: 'redo' })
      else return
      event.preventDefault()
      return
    }
    if (event.altKey) return

    const arrows: Record<string, TurnDirection> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
    }
    const colour = key.toUpperCase()
    if (key >= '1' && key <= '9') {
      dispatch({ type: 'select', number: Number(key) })
    } else if (isColourKey(colour)) {
      setActiveColour(colour)
      dispatch({ type: 'paint', colour })
    } else if (key in arrows) {
      dispatch({ type: 'turn', direction: arrows[key] })
    } else if (key === 'Enter' && target?.tagName !== 'BUTTON') {
      solve()
    } else {
      return
    }
    event.preventDefault()
  }

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKey.current(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  // --- What the cube shows

  const flagged = useMemo(() => {
    const stickers = problem && problem !== 'failed' && 'stickers' in problem ? problem.stickers : []
    return new Set(problem && problem !== 'failed' && problem.code === 'unpainted' ? [] : stickers)
  }, [problem])

  const colours = useMemo(() => {
    if (!solution) return entry.stickers.map(hexOf)
    const cube = cubeAfterSteps(solution.cube, solution.solved.steps, playback.done)
    return stickersFromCube(cube).map((face) => COLOUR_HEX[solution.scheme[face]])
  }, [entry.stickers, solution, playback.done])

  const frames = useMemo(() => {
    const map = new Map<number, string>()
    if (solution) return map
    map.set(cursorSticker, CURSOR_FRAME)
    for (const sticker of flagged) map.set(sticker, PROBLEM_FRAME)
    return map
  }, [solution, cursorSticker, flagged])

  // A report starts with what the page knows: the colours, the method, and
  // the problem on screen, if there is one. It is in English whatever the
  // page's language, for the maintainers who read it.
  const reportHref = useMemo(
    () =>
      newIssueUrl({
        body: issueReportBody({
          stickers: stickersText(entry.stickers),
          method,
          problem: problem ? (problem === 'failed' ? problem : problem.code) : undefined,
        }),
      }),
    [entry.stickers, method, problem],
  )

  const picture = (
    <CubePicture colours={colours} label={m.solver.loading3d} className="size-full p-[8%]" />
  )

  const turnButton = (direction: TurnDirection, Icon: typeof ArrowUp, place: string) => (
    <Button
      variant="outline"
      size="icon"
      aria-label={m.solver.entry.turn[direction]}
      onClick={() => dispatch({ type: 'turn', direction })}
      className={cn('absolute rounded-full bg-background/80', place)}
    >
      <Icon />
    </Button>
  )

  if (scanning) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <Suspense fallback={<p className="text-sm text-muted-foreground">{m.solver.scan.starting}</p>}>
          <ScanPanel onDone={finishScan} onCancel={cancelScan} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]">
      {/* The cube and the arrows round it are a picture of the real cube: left stays left. */}
      <div
        dir="ltr"
        className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-2xl border bg-muted/40"
      >
        <ClientOnly fallback={picture}>
          <Suspense fallback={picture}>
            <CubeView
              colours={colours}
              orientation={
                solution
                  ? (solution.solved.steps[playback.done - 1]?.orientation ?? solution.solved.start)
                  : entry.orientation
              }
              numbers={!solution}
              frames={frames}
              turn={playback.turn}
              onTurnEnd={playback.finishTurn}
              onStickerClick={solution ? undefined : paintSticker}
              className="size-full"
            />
          </Suspense>
        </ClientOnly>
        {!solution && (
          <>
            {turnButton('up', ArrowUp, 'top-3 left-1/2 -translate-x-1/2')}
            {turnButton('down', ArrowDown, 'bottom-3 left-1/2 -translate-x-1/2')}
            {turnButton('left', ArrowLeft, 'top-1/2 left-3 -translate-y-1/2')}
            {turnButton('right', ArrowRight, 'top-1/2 right-3 -translate-y-1/2')}
          </>
        )}
      </div>

      {solution ? (
        <SolutionPanel
          solved={solution.solved}
          scheme={solution.scheme}
          playback={playback}
          pauseMs={pauseMs}
          onPauseChange={setPauseMs}
          onEdit={editCube}
          reportHref={reportHref}
        />
      ) : (
        <Card>
          <CardContent className="space-y-5">
            <Button variant="outline" size="lg" onClick={() => setScanning(true)} className="w-full">
              <Camera />
              {m.solver.scan.open}
            </Button>
            {scanned === entry.stickers && (
              <Alert aria-live="polite">
                <AlertDescription>{m.solver.scan.done}</AlertDescription>
              </Alert>
            )}
            {scanReport && (
              <Button variant="ghost" size="sm" onClick={copyScanReport} className="text-muted-foreground">
                {scanReport.copied ? m.solver.scan.reportCopied : m.solver.scan.copyReport}
              </Button>
            )}

            <section className="space-y-2">
              <h2 className="text-sm font-semibold">{m.solver.entry.colours}</h2>
              <div className="grid grid-cols-6 gap-2">
                {COLOUR_KEYS.map((colour) => (
                  <button
                    key={colour}
                    type="button"
                    aria-label={m.solver.entry.paletteLabel(colour, counts[colour])}
                    aria-pressed={colour === activeColour}
                    onClick={() => setActiveColour(colour)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg border p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                      colour === activeColour && 'border-foreground bg-muted',
                    )}
                  >
                    <span
                      className="flex aspect-square w-full items-center justify-center rounded-md border border-black/15 text-sm font-semibold text-black/70"
                      style={{ backgroundColor: COLOUR_HEX[colour] }}
                    >
                      {colour}
                    </span>
                    <span
                      className={cn(
                        'text-xs tabular-nums',
                        counts[colour] > 9 ? 'font-semibold text-destructive' : 'text-muted-foreground',
                      )}
                    >
                      {counts[colour]}/9
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{m.solver.entry.coloursHint}</p>
            </section>

            <KeyHints hints={m.solver.entry.keyboardSteps} />

            <section className="space-y-2">
              <h2 className="text-sm font-semibold">{m.solver.entry.allFaces}</h2>
              <CubeNet
                stickers={entry.stickers}
                front={frontFace(entry.orientation)}
                cursor={cursorSticker}
                flagged={flagged}
                onStickerClick={paintSticker}
                className="mx-auto max-w-80"
              />
              <p className="text-sm text-muted-foreground">{m.solver.entry.allFacesHint}</p>
            </section>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                disabled={entry.past.length === 0}
                onClick={() => dispatch({ type: 'undo' })}
              >
                <Undo2 />
                {m.solver.entry.undo}
              </Button>
              <Button
                variant="outline"
                disabled={entry.future.length === 0}
                onClick={() => dispatch({ type: 'redo' })}
              >
                <Redo2 />
                {m.solver.entry.redo}
              </Button>
              <Button variant="outline" onClick={() => dispatch({ type: 'clear-face' })}>
                <Eraser />
                {m.solver.entry.clearFace}
              </Button>
              <Button variant="outline" onClick={() => dispatch({ type: 'reset' })}>
                <RotateCcw />
                {m.solver.entry.reset}
              </Button>
            </div>

            <section className="space-y-2">
              <h2 id="solve-method" className="text-sm font-semibold">
                {m.solver.method.label}
              </h2>
              <Select value={method} onValueChange={(value) => setMethod(value as SolveMethod)}>
                <SelectTrigger aria-labelledby="solve-method" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">{m.solver.method.short}</SelectItem>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>{m.solver.method.methodsGroup}</SelectLabel>
                    {METHOD_IDS.map((id) => (
                      <SelectItem key={id} value={id}>
                        {m.methods[id].name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {method === 'short' ? m.solver.method.shortHint : m.methods[method].solverHint}
              </p>
            </section>

            {problem && (
              <Alert variant="destructive" aria-live="assertive">
                <AlertTitle>{m.solver.problems.title}</AlertTitle>
                <AlertDescription>{problemText(m.solver.problems, problem, counts)}</AlertDescription>
              </Alert>
            )}

            <Button size="lg" onClick={solve} disabled={solving} className="w-full">
              {solving ? m.solver.entry.solving : m.solver.entry.solve}
            </Button>
            <ReportIssue href={reportHref} />
            <HistoryLink />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
