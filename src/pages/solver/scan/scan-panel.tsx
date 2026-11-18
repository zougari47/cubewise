/**
 * Filling the cube in from the camera: the user shows one face at a time and
 * turns the cube when told to. Each face is found wherever it is held and
 * captured by itself; the colours are worked out from all six together, then
 * checked once against the pictures taken. Loaded on demand; the logic is in
 * `src/core/scan`.
 */
import { Camera, Check, RotateCcw, Undo2, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { m } from '#/i18n'
import { cn } from '#/lib/utils'
import { guessCube, nameCentres } from '#/core/scan/classify.ts'
import { rgbToHex } from '#/core/scan/colour.ts'
import type { Rgb } from '#/core/scan/colour.ts'
import { findFace } from '#/core/scan/detect.ts'
import { GUIDE, faceChange, sampleFace, steadyColours } from '#/core/scan/sample.ts'
import type { Guide, StickerSample } from '#/core/scan/sample.ts'
import { SCAN_FACES, SCAN_FACE_COUNT, SCAN_STICKERS, placeScan } from '#/core/scan/sequence.ts'
import { COLOUR_HEX } from '../colours.ts'
import { COLOUR_KEYS } from '../entry.ts'
import type { ColourKey, Paint } from '../entry.ts'
import { useCamera } from './camera.ts'
import { ScanGuide } from './scan-guide.tsx'

const GUIDE_SEEN_KEY = 'cubewise.scan.guide-seen.v1'

/** Side of the small square picture the stickers are read from, in pixels. */
const READ_SIZE = 240
/** Side of the smaller picture the face is looked for in. */
const FIND_SIZE = 160
/** Side of the picture kept of each captured face until the scan ends. */
const PICTURE_SIZE = 240
/** How much around the face its picture shows, as a share of the face. */
const PICTURE_MARGIN = 0.04
/** Time between readings. */
const READ_EVERY_MS = 120
/** A face is captured by itself after staying still this long. */
const HOLD_MS = 500
/** How many of the latest still readings go into a captured face. */
const READINGS_KEPT = 8
/** Largest per-sticker change between readings that still counts as still. */
const STILL_CHANGE = 22
/** A face must differ from the last captured one by this much in some sticker to be a new face. */
const NEW_FACE_CHANGE = 55
/** After a retake, nothing is captured for this long, so the cube can be moved first. */
const RETAKE_PAUSE_MS = 1500
/** How long the tick shown after a capture stays. */
const TICK_MS = 700

/** How each colour usually looks to a camera, in `COLOUR_KEYS` order (W Y R O B G). */
const USUAL: Rgb[] = [
  [215, 215, 210],
  [215, 200, 50],
  [190, 40, 45],
  [230, 110, 40],
  [35, 85, 175],
  [40, 155, 80],
]

interface CapturedFace {
  /** What the camera read for each of the nine stickers. */
  read: Rgb[]
  /** The picture taken of the face, to check the colours against; null if it could not be taken. */
  picture: string | null
}

/** The colours of all six faces, as positions in `COLOUR_KEYS`, in capture order. */
interface Review {
  /** The colours first guessed. */
  guess: number[][]
  /** The colours after the user's fixes. */
  labels: number[][]
}

/** The colour of every sticker, worked out from all six captured faces together. */
function guessColours(faces: CapturedFace[]): number[][] {
  const read = placeScan(faces.map((face) => face.read))
  const faceOf = guessCube(read)
  const colourOf = nameCentres(
    Array.from({ length: 6 }, (_, face) => read[face * 9 + 4]),
    USUAL,
  )
  return SCAN_STICKERS.map((stickers) => stickers.map((sticker) => colourOf[faceOf[sticker]]))
}

/**
 * The part of the camera picture inside `guide`, as an image address; null if
 * it cannot be taken. The guide is measured on the centre square the page shows.
 */
function takePicture(source: HTMLVideoElement | null, guide: Guide): string | null {
  if (!source || source.readyState < 2 || source.videoWidth === 0) return null
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = PICTURE_SIZE
  const context = canvas.getContext('2d')
  if (!context) return null
  const size = Math.min(1, guide.size * (1 + 2 * PICTURE_MARGIN))
  const left = Math.max(0, Math.min(1 - size, guide.x - guide.size * PICTURE_MARGIN))
  const top = Math.max(0, Math.min(1 - size, guide.y - guide.size * PICTURE_MARGIN))
  const side = Math.min(source.videoWidth, source.videoHeight)
  context.drawImage(
    source,
    (source.videoWidth - side) / 2 + left * side,
    (source.videoHeight - side) / 2 + top * side,
    size * side,
    size * side,
    0,
    0,
    PICTURE_SIZE,
    PICTURE_SIZE,
  )
  return canvas.toDataURL('image/jpeg', 0.85)
}

/** Everything about a finished scan, for working out why one went wrong. */
function scanReport(
  faces: CapturedFace[],
  review: Review,
  camera: Record<string, unknown>,
  whiteBalanceHeld: boolean,
): string {
  const keys = (labels: number[]) => labels.map((label) => COLOUR_KEYS[label]).join('')
  return JSON.stringify({
    version: 2,
    camera,
    whiteBalanceHeld,
    faces: faces.map((face, step) => ({
      face: SCAN_FACES[step],
      read: face.read.map((colour) => colour.map(Math.round)),
      guess: keys(review.guess[step]),
      final: keys(review.labels[step]),
    })),
  })
}

export default function ScanPanel({
  onDone,
  onCancel,
}: {
  onDone: (stickers: Paint[], report: string) => void
  onCancel: () => void
}) {
  const text = m.solver.scan
  const video = useRef<HTMLVideoElement>(null)
  const { status, errorName, retry: restartCamera, holdWhiteBalance, settings } = useCamera(video)
  const [faces, setFaces] = useState<CapturedFace[]>([])
  /** Set once all six faces are in, while the user checks the colours. */
  const [review, setReview] = useState<Review | null>(null)
  const [activeColour, setActiveColour] = useState(0)
  /** The face the camera sees now; `fresh` is false while it is still the one just captured. */
  const [live, setLive] = useState<{ guide: Guide; samples: StickerSample[]; fresh: boolean } | null>(null)
  /** How far through the hold-still time the current face is, 0–1. */
  const [hold, setHold] = useState(0)
  /** Counts captures, to show a tick after each. */
  const [ticked, setTicked] = useState(0)
  const [tick, setTick] = useState(false)
  const whiteBalanceHeld = useRef(false)
  /** The guide opens by itself the first time, and from its button after that. */
  const [guideOpen, setGuideOpen] = useState(false)
  useEffect(() => {
    try {
      if (localStorage.getItem(GUIDE_SEEN_KEY)) return
      localStorage.setItem(GUIDE_SEEN_KEY, '1')
    } catch {
      // Without storage the guide simply opens each time.
    }
    setGuideOpen(true)
  }, [])

  const reading = useRef<{
    faces: CapturedFace[]
    /** The latest readings in a row with no movement between them. */
    still: StickerSample[][]
    stillSince: number | null
    /** Where the face was found in the latest reading. */
    found: Guide | null
    /** The face captured last, to tell when the cube has been turned. */
    last: StickerSample[] | null
    pausedUntil: number
    read: CanvasRenderingContext2D | null
    find: CanvasRenderingContext2D | null
  }>({ faces: [], still: [], stillSince: null, found: null, last: null, pausedUntil: 0, read: null, find: null })

  /** The centre square of the camera picture as it is now, the same square the page shows. */
  const readFrame = useCallback((): ImageData | null => {
    const state = reading.current
    if (!state.read) {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = READ_SIZE
      state.read = canvas.getContext('2d', { willReadFrequently: true })
      const small = document.createElement('canvas')
      small.width = small.height = FIND_SIZE
      state.find = small.getContext('2d', { willReadFrequently: true })
    }
    const source = video.current
    if (!state.read || !source || source.readyState < 2 || source.videoWidth === 0) return null
    const side = Math.min(source.videoWidth, source.videoHeight)
    state.read.drawImage(
      source,
      (source.videoWidth - side) / 2,
      (source.videoHeight - side) / 2,
      side,
      side,
      0,
      0,
      READ_SIZE,
      READ_SIZE,
    )
    return state.read.getImageData(0, 0, READ_SIZE, READ_SIZE)
  }, [])

  const putFaces = useCallback((next: CapturedFace[]) => {
    const state = reading.current
    state.faces = next
    state.still = []
    state.stillSince = null
    const last = next.at(-1)
    state.last = last ? last.read.map((colour) => ({ colour, spread: 0 })) : null
    setHold(0)
    setFaces(next)
  }, [])

  const capture = useCallback(
    (read: Rgb[], guide: Guide) => {
      const all = [...reading.current.faces, { read, picture: takePicture(video.current, guide) }]
      putFaces(all)
      navigator.vibrate?.(60)
      setLive((seen) => seen && { ...seen, fresh: false })
      setTicked((count) => count + 1)
      if (all.length === SCAN_FACE_COUNT) {
        const guess = guessColours(all)
        setReview({ guess, labels: guess })
      }
    },
    [putFaces],
  )

  useEffect(() => {
    if (ticked === 0) return
    setTick(true)
    const timer = window.setTimeout(() => setTick(false), TICK_MS)
    return () => window.clearTimeout(timer)
  }, [ticked])

  // --- Keeping the camera's colours steady once the first face is in

  const started = faces.length > 0
  useEffect(() => {
    if (status !== 'ready') return
    void holdWhiteBalance(started).then((held) => (whiteBalanceHeld.current = held && started))
  }, [status, started, holdWhiteBalance])

  // --- Finding and reading the face

  const paused = review !== null || guideOpen
  useEffect(() => {
    if (status !== 'ready' || paused) return
    const timer = window.setInterval(() => {
      const pixels = readFrame()
      const state = reading.current
      if (!pixels || !state.read || !state.find) return
      state.find.drawImage(state.read.canvas, 0, 0, FIND_SIZE, FIND_SIZE)
      const guide = findFace(state.find.getImageData(0, 0, FIND_SIZE, FIND_SIZE))
      state.found = guide
      if (!guide) {
        state.still = []
        state.stillSince = null
        setLive(null)
        setHold(0)
        return
      }
      const samples = sampleFace(pixels, guide)
      const previous = state.still.at(-1)
      const still = previous !== undefined && faceChange(previous, samples) < STILL_CHANGE
      state.still = still ? [...state.still, samples].slice(-READINGS_KEPT) : [samples]
      // Still showing the face just captured: wait for the cube to be turned.
      const fresh = state.last === null || faceChange(state.last, samples) > NEW_FACE_CHANGE
      setLive({ guide, samples, fresh })

      const now = performance.now()
      if (!still || !fresh || now < state.pausedUntil) {
        state.stillSince = null
        setHold(0)
        return
      }
      state.stillSince ??= now
      const held = (now - state.stillSince) / HOLD_MS
      if (held >= 1) capture(steadyColours(state.still), guide)
      else setHold(held)
    }, READ_EVERY_MS)
    return () => window.clearInterval(timer)
  }, [status, paused, readFrame, capture])

  /** Captures at once: the face where it was found, or else whatever is inside the square. */
  const captureNow = () => {
    const state = reading.current
    if (state.found && state.still.length > 0) {
      capture(steadyColours(state.still), state.found)
      return
    }
    const pixels = readFrame()
    if (pixels) capture(sampleFace(pixels, GUIDE).map((sample) => sample.colour), GUIDE)
  }

  const retake = () => {
    reading.current.pausedUntil = performance.now() + RETAKE_PAUSE_MS
    putFaces(faces.slice(0, -1))
  }

  const scanAgain = () => {
    setReview(null)
    setLive(null)
    putFaces([])
  }

  // --- Checking the colours

  const paint = (step: number, cell: number) => {
    if (!review) return
    const labels = review.labels.map((face) => face.slice())
    labels[step][cell] = activeColour
    setReview({ ...review, labels })
  }

  const accept = () => {
    if (!review) return
    const stickers = placeScan(review.labels.map((face) => face.map((label) => COLOUR_KEYS[label])))
    onDone(stickers, scanReport(faces, review, settings(), whiteBalanceHeld.current))
  }

  const step = Math.min(faces.length, SCAN_FACE_COUNT - 1)
  const ready = status === 'ready'
  const failed = status !== 'ready' && status !== 'starting'
  const hex = (label: number) => COLOUR_HEX[COLOUR_KEYS[label]]
  const shown = live?.guide ?? GUIDE

  return (
    <>
      <div
        className={cn(
          'relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-2xl border bg-black',
          review && 'hidden',
        )}
      >
        <video
          ref={video}
          muted
          playsInline
          aria-label={text.videoLabel}
          className="size-full object-cover"
        />
        {ready && (
          <div
            aria-hidden
            className={cn(
              'absolute grid grid-cols-3 rounded-lg',
              live
                ? cn('outline-3', live.fresh ? 'outline-emerald-400' : 'outline-white/80')
                : 'outline-2 outline-white/40 outline-dashed',
            )}
            style={{
              left: `${shown.x * 100}%`,
              top: `${shown.y * 100}%`,
              width: `${shown.size * 100}%`,
              height: `${shown.size * 100}%`,
            }}
          >
            {live?.samples.map((sample, cell) => (
              <div key={cell} className="flex items-end justify-end border border-white/60 p-[6%]">
                <span
                  className="size-[26%] rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: rgbToHex(sample.colour) }}
                />
              </div>
            ))}
          </div>
        )}
        {tick && (
          <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="flex size-20 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="size-10" />
            </span>
          </div>
        )}
        {status === 'starting' && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
            {text.starting}
          </p>
        )}
      </div>

      {review && (
        <div className="mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-2">
          {review.labels.map((labels, face) => (
            <div key={face} className="flex items-center gap-2 rounded-xl border bg-neutral-900 p-2">
              {/* What the camera saw, so the cube need not be picked up again to check it. */}
              {faces[face]?.picture && (
                <img
                  src={faces[face].picture}
                  alt={text.pictureLabel(face + 1)}
                  className="aspect-square w-0 flex-1 rounded-md object-cover"
                />
              )}
              <div className="grid aspect-square w-0 flex-1 grid-cols-3 gap-[3%]">
                {labels.map((label, cell) => (
                  <button
                    key={cell}
                    type="button"
                    aria-label={text.checkSticker(face + 1, cell + 1, COLOUR_KEYS[label])}
                    onClick={() => paint(face, cell)}
                    className="rounded-[12%] outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
                    style={{ backgroundColor: hex(label) }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="space-y-5">
          <header className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{review ? text.reviewHeading : text.heading}</h2>
              {!review && <ScanGuide open={guideOpen} onOpenChange={setGuideOpen} />}
            </div>
            {!failed && !review && <p className="text-sm text-muted-foreground">{text.progress(step + 1)}</p>}
          </header>

          {failed ? (
            <Alert variant="destructive">
              <AlertDescription>
                {text.errors[status]}
                {errorName && <span className="mt-1 block text-xs opacity-70">{errorName}</span>}
              </AlertDescription>
            </Alert>
          ) : review ? (
            <>
              <p className="text-base font-medium text-pretty">{text.check}</p>
              <div className="grid grid-cols-6 gap-2">
                {COLOUR_KEYS.map((colour: ColourKey, label) => (
                  <button
                    key={colour}
                    type="button"
                    aria-label={m.colourNames[colour]}
                    aria-pressed={label === activeColour}
                    onClick={() => setActiveColour(label)}
                    className={cn(
                      'rounded-lg border p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                      label === activeColour && 'border-foreground bg-muted',
                    )}
                  >
                    <span
                      className="flex aspect-square w-full items-center justify-center rounded-md border border-black/15 text-sm font-semibold text-black/70"
                      style={{ backgroundColor: COLOUR_HEX[colour] }}
                    >
                      {colour}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p aria-live="polite" className="text-base font-medium text-pretty">
                {text.steps[step]}
              </p>

              <div className="space-y-1.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-emerald-500 transition-[width] duration-100"
                    style={{ width: `${hold * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {!live ? text.looking : live.fresh ? text.holdStill : text.turnNow}
                </p>
              </div>

              <div aria-hidden className="grid grid-cols-6 gap-2">
                {Array.from({ length: SCAN_FACE_COUNT }, (_, face) => (
                  <div
                    key={face}
                    className={cn(
                      'aspect-square overflow-hidden rounded-md border bg-muted',
                      face === faces.length && 'border-foreground ring-2 ring-sky-500',
                    )}
                  >
                    {faces[face]?.picture && <img src={faces[face].picture} alt="" className="size-full object-cover" />}
                    {faces[face] && !faces[face].picture && (
                      <span className="flex size-full items-center justify-center">
                        <Check className="size-4" />
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">{text.tips}</p>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            {!failed &&
              (review ? (
                <Button size="lg" className="col-span-2" onClick={accept}>
                  <Check />
                  {text.use}
                </Button>
              ) : (
                <Button size="lg" className="col-span-2" disabled={!ready} onClick={captureNow}>
                  <Camera />
                  {text.capture}
                </Button>
              ))}
            {!failed &&
              (review ? (
                <Button variant="outline" onClick={scanAgain}>
                  <RotateCcw />
                  {text.again}
                </Button>
              ) : (
                <Button variant="outline" disabled={faces.length === 0} onClick={retake}>
                  <Undo2 />
                  {text.retake}
                </Button>
              ))}
            {failed && status !== 'unsupported' && (
              <Button onClick={restartCamera}>
                <RotateCcw />
                {text.tryAgain}
              </Button>
            )}
            <Button variant="outline" onClick={onCancel} className={cn(status === 'unsupported' && 'col-span-2')}>
              <X />
              {text.cancel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
