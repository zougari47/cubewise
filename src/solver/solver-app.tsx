import { ClientOnly } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Eraser,
  Pause,
  Pencil,
  Play,
  Redo2,
  RotateCcw,
  SkipBack,
  StepBack,
  StepForward,
  Undo2,
} from 'lucide-react'
import { Suspense, lazy, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { CubeNet } from '#/components/cube-net.tsx'
import { CubePicture } from '#/components/cube-picture.tsx'
import type { CubeTurn } from '#/components/cube-view.tsx'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Kbd } from '#/components/ui/kbd'
import { applyMoves, formatMoves } from '#/cube/cubie.ts'
import type { CubieCube, Move } from '#/cube/cubie.ts'
import { DEFAULT_ORIENTATION, frontFace, frontStickers } from '#/cube/orientation.ts'
import type { TurnDirection } from '#/cube/orientation.ts'
import { stickersFromCube } from '#/cube/stickers.ts'
import { m } from '#/i18n'
import { cn } from '#/lib/utils'
import { COLOUR_HEX, hexOf } from './colours.ts'
import {
  COLOUR_KEYS,
  checkEntry,
  colourCounts,
  entryReducer,
  initialEntry,
  isColourKey,
  isSavedStickers,
} from './entry.ts'
import type { ColourKey, EntryProblem } from './entry.ts'
import { solveShort, warmUpSolver } from './solver-client.ts'

const CubeView = lazy(() => import('#/components/cube-view.tsx'))

const STORAGE_KEY = 'cubewise.entry.v1'
const CURSOR_FRAME = '#0ea5e9'
const PROBLEM_FRAME = '#ef4444'

interface Solution {
  cube: CubieCube
  /** The user's centre colours, in U R F D L B order. */
  scheme: ColourKey[]
  moves: Move[]
}

interface Playback {
  /** How many moves have been made. */
  done: number
  playing: boolean
  /** The move being animated, and whether it goes forward (+1) or back (-1). */
  turn: (CubeTurn & { step: 1 | -1 }) | null
}

const STOPPED: Playback = { done: 0, playing: false, turn: null }

const inverse = (move: Move) => move - (move % 3) + (2 - (move % 3))

function problemText(problem: EntryProblem | 'failed', counts: Record<ColourKey, number>): string {
  const text = m.solver.problems
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

function KeyHints({ hints }: { hints: { keys: string[]; text: string }[] }) {
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

export function SolverApp() {
  const [entry, dispatch] = useReducer(entryReducer, undefined, initialEntry)
  const [activeColour, setActiveColour] = useState<ColourKey>('W')
  const [problem, setProblem] = useState<EntryProblem | 'failed' | null>(null)
  const [solving, setSolving] = useState(false)
  const [solution, setSolution] = useState<Solution | null>(null)
  const [playback, setPlayback] = useState<Playback>(STOPPED)
  const [loaded, setLoaded] = useState(false)
  const turnId = useRef(0)

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

  const solve = useCallback(() => {
    if (solving) return
    const check = checkEntry(entry.stickers)
    if (!check.ok) {
      setProblem(check.problem)
      return
    }
    setSolving(true)
    solveShort(check.cube)
      .then((moves) => {
        setSolution({ cube: check.cube, scheme: check.scheme, moves })
        setPlayback(STOPPED)
      })
      .catch(() => setProblem('failed'))
      .finally(() => setSolving(false))
  }, [entry.stickers, solving])

  // --- Playing the solution

  const stepForward = useCallback(() => {
    if (!solution) return
    setPlayback((now) => {
      if (now.turn || now.done >= solution.moves.length) return now
      return { ...now, turn: { move: solution.moves[now.done], id: ++turnId.current, step: 1 } }
    })
  }, [solution])

  const stepBack = useCallback(() => {
    if (!solution) return
    setPlayback((now) => {
      if (now.turn || now.done === 0) return now
      const move = inverse(solution.moves[now.done - 1])
      return { ...now, playing: false, turn: { move, id: ++turnId.current, step: -1 } }
    })
  }, [solution])

  const finishTurn = useCallback(() => {
    setPlayback((now) => (now.turn ? { ...now, done: now.done + now.turn.step, turn: null } : now))
  }, [])

  const togglePlay = useCallback(() => {
    if (!solution) return
    setPlayback((now) => {
      if (now.playing) return { ...now, playing: false }
      // Pressing play at the end starts again from the beginning.
      if (now.done >= solution.moves.length) return { done: 0, playing: true, turn: null }
      return { ...now, playing: true }
    })
  }, [solution])

  const editCube = useCallback(() => {
    setSolution(null)
    setPlayback(STOPPED)
  }, [])

  useEffect(() => {
    if (!solution || !playback.playing || playback.turn) return
    if (playback.done >= solution.moves.length) {
      setPlayback((now) => ({ ...now, playing: false }))
      return
    }
    const pause = setTimeout(stepForward, 120)
    return () => clearTimeout(pause)
  }, [solution, playback, stepForward])

  // --- Keyboard

  const onKey = useRef<(event: KeyboardEvent) => void>(() => {})
  onKey.current = (event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
    const key = event.key
    const command = event.ctrlKey || event.metaKey

    if (solution) {
      if (command || event.altKey) return
      if (key === ' ') togglePlay()
      else if (key === 'ArrowRight') stepForward()
      else if (key === 'ArrowLeft') stepBack()
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
    const cube = applyMoves(solution.cube, solution.moves.slice(0, playback.done))
    return stickersFromCube(cube).map((face) => COLOUR_HEX[solution.scheme[face]])
  }, [entry.stickers, solution, playback.done])

  const frames = useMemo(() => {
    const map = new Map<number, string>()
    if (solution) return map
    map.set(cursorSticker, CURSOR_FRAME)
    for (const sticker of flagged) map.set(sticker, PROBLEM_FRAME)
    return map
  }, [solution, cursorSticker, flagged])

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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-2xl border bg-muted/40">
        <ClientOnly fallback={picture}>
          <Suspense fallback={picture}>
            <CubeView
              colours={colours}
              orientation={solution ? DEFAULT_ORIENTATION : entry.orientation}
              numbers={!solution}
              frames={frames}
              turn={playback.turn}
              onTurnEnd={finishTurn}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              {m.solver.playback.heading}
              <Badge variant="secondary">{m.solver.playback.moveCount(solution.moves.length)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {solution.moves.length === 0 ? (
              <p>{m.solver.playback.alreadySolved}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {m.solver.playback.hold(solution.scheme[2], solution.scheme[0])}
                </p>
                <ol aria-label={formatMoves(solution.moves)} className="flex flex-wrap gap-1.5">
                  {solution.moves.map((move, i) => (
                    <li
                      key={i}
                      aria-current={i === playback.done ? 'step' : undefined}
                      className={cn(
                        'min-w-9 rounded-md border px-2 py-1 text-center font-mono text-sm font-medium',
                        i < playback.done && 'border-transparent bg-muted text-muted-foreground',
                        i === playback.done && 'border-primary bg-primary text-primary-foreground',
                      )}
                    >
                      {formatMoves([move])}
                    </li>
                  ))}
                </ol>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={m.solver.playback.restart}
                    disabled={playback.done === 0 && !playback.turn}
                    onClick={() => setPlayback(STOPPED)}
                  >
                    <SkipBack />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={m.solver.playback.back}
                    disabled={playback.done === 0}
                    onClick={stepBack}
                  >
                    <StepBack />
                  </Button>
                  <Button onClick={togglePlay} className="flex-1">
                    {playback.playing ? <Pause /> : <Play />}
                    {playback.playing ? m.solver.playback.pause : m.solver.playback.play}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={m.solver.playback.forward}
                    disabled={playback.done >= solution.moves.length}
                    onClick={() => {
                      setPlayback((now) => ({ ...now, playing: false }))
                      stepForward()
                    }}
                  >
                    <StepForward />
                  </Button>
                </div>
                <p aria-live="polite" className="text-sm font-medium">
                  {playback.done >= solution.moves.length
                    ? m.solver.playback.done
                    : m.solver.playback.progress(playback.done, solution.moves.length)}
                </p>
                <p className="text-sm text-muted-foreground">{m.solver.playback.notation}</p>
                <KeyHints hints={m.solver.playback.keys} />
              </>
            )}
            <Button variant="outline" onClick={editCube} className="w-full">
              <Pencil />
              {m.solver.playback.edit}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-5">
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
              <h2 className="text-sm font-semibold">{m.solver.method.label}</h2>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" aria-pressed className="border-foreground">
                  {m.solver.method.short}
                </Button>
                <Button variant="outline" disabled>
                  {m.solver.method.beginner}
                  <Badge variant="secondary">{m.solver.method.soon}</Badge>
                </Button>
              </div>
            </section>

            {problem && (
              <Alert variant="destructive" aria-live="assertive">
                <AlertTitle>{m.solver.problems.title}</AlertTitle>
                <AlertDescription>{problemText(problem, counts)}</AlertDescription>
              </Alert>
            )}

            <Button size="lg" onClick={solve} disabled={solving} className="w-full">
              {solving ? m.solver.entry.solving : m.solver.entry.solve}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
