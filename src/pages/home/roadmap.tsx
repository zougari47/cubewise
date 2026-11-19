import { Link } from '@tanstack/react-router'
import { Flag, Split } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { ForwardArrow } from '#/components/arrows.tsx'
import { CubePicture } from '#/components/cube-picture.tsx'
import { Badge } from '#/components/ui/badge'
import { stagesOf } from '#/core/methods/index.ts'
import { useM } from '#/i18n'
import { cn } from '#/lib/utils'
import { ROADMAP, roadmapColours, roadmapStops } from './roadmap.ts'
import type { RoadmapStop } from './roadmap.ts'

const STOPS = roadmapStops()
const PICTURES = Object.fromEntries(STOPS.map(({ method }) => [method, roadmapColours(method)]))

/*
 * How the road is drawn. Nothing is measured: every stop draws its own
 * stretch of road as small SVG pieces placed with CSS, so the page is the
 * same before and after JavaScript runs.
 *
 * On a wide screen the road is a line 3rem below the top of each stop, with
 * the stop's picture in the middle of it. A stop draws the half that comes in
 * and the half that goes out, and the last stop of a row draws the turn down
 * to the next row, in the margin beside it. Pieces are drawn for a row that
 * runs left to right and flipped where the road runs the other way: on odd
 * rows, and on every row in a right-to-left language (but not both).
 *
 * On a narrow screen the road is one line down the side of the stops.
 */

/** Flips a piece drawn for a left-to-right row wherever this stop's row runs right to left. */
const flipOf = (stop: RoadmapStop) => (stop.row % 2 === 0 ? 'rtl:-scale-x-100' : 'ltr:-scale-x-100')

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
} as const

/** The road between two choices is dashed: neither comes before the other. */
const dashOf = (lead: RoadmapStop['lead'] | undefined) => (lead === 'or' ? '2 9' : undefined)

const delay = (seconds: number) => ({ '--road-delay': `${seconds}s` }) as CSSProperties

/** A line across, with the slight wave of one drawn by hand; it stretches to any width. */
function Across({ dash, className, style }: { dash?: string; className: string; style: CSSProperties }) {
  return (
    <div className={cn('road-across absolute top-7 hidden h-10 md:block', className)} style={style}>
      <svg viewBox="0 0 500 40" preserveAspectRatio="none" className="block size-full overflow-visible">
        <path d="M0,20 C155,10 345,30 500,20" strokeDasharray={dash} {...STROKE} />
      </svg>
    </div>
  )
}

/** A line down the side, for narrow screens; it stretches to any height. */
function Down({ dash, className, style }: { dash?: string; className: string; style: CSSProperties }) {
  return (
    <div className={cn('road-down absolute start-6 w-4 md:hidden', className)} style={style}>
      <svg viewBox="0 0 16 100" preserveAspectRatio="none" className="block size-full overflow-visible">
        <path d="M8,0 C4,30 12,68 8,100" strokeDasharray={dash} {...STROKE} />
      </svg>
    </div>
  )
}

/** The turn from the end of one row down to the start of the next: two fixed corners and a side that stretches. */
function Turn({ dash, className, style }: { dash?: string; className: string; style: CSSProperties }) {
  return (
    <div className={cn('road-down absolute top-12 hidden h-full w-12 md:block', className)} style={style}>
      <svg viewBox="0 0 48 48" className="absolute inset-x-0 top-0 size-12 overflow-visible">
        <path d="M0,0 C25,1 46,21 48,48" strokeDasharray={dash} {...STROKE} />
      </svg>
      <svg
        viewBox="0 0 48 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-12 h-[calc(100%-6rem)] w-12 overflow-visible"
      >
        <path d="M48,0 C45,32 51,66 48,100" strokeDasharray={dash} {...STROKE} />
      </svg>
      <svg viewBox="0 0 48 48" className="absolute inset-x-0 bottom-0 size-12 overflow-visible">
        <path d="M48,0 C47,27 24,46 0,48" strokeDasharray={dash} {...STROKE} />
      </svg>
    </div>
  )
}

/** The road of one stop: decoration only, the list itself says the order. */
function Road({ stop, next }: { stop: RoadmapStop; next: RoadmapStop | undefined }) {
  const forwards = stop.row % 2 === 0
  const flip = flipOf(stop)
  const hasSign = stop.lead !== 'next'
  const dashIn = dashOf(stop.lead)
  // After the last stop the road goes on as it came in.
  const dashOut = dashOf(next ? next.lead : stop.lead)
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 text-primary/70">
      {/* Wide screens: in from the row's start to the picture, out to its end, then the turn or the arrowhead. */}
      <Across dash={dashIn} className={cn('w-1/2', forwards ? 'start-0' : 'end-0', flip)} style={delay(0)} />
      <Across
        dash={dashOut}
        className={cn(
          forwards ? 'start-1/2' : 'end-1/2',
          stop.isLast ? (forwards ? 'end-5' : 'start-5') : forwards ? 'end-0' : 'start-0',
          flip,
        )}
        style={delay(0.45)}
      />
      {stop.turnsAfter && (
        <Turn dash={dashOut} className={cn(forwards ? 'start-full' : 'end-full', flip)} style={delay(0.9)} />
      )}
      {stop.isLast && (
        <svg
          viewBox="0 0 16 24"
          className={cn(
            'road-across absolute top-9 hidden h-6 w-4 overflow-visible md:block',
            forwards ? 'end-[1.125rem]' : 'start-[1.125rem]',
            flip,
          )}
          style={delay(0.9)}
        >
          <path d="M2,3 C7,7 11,10 14,12 C10,14 6,17 3,21" {...STROKE} />
        </svg>
      )}

      {/* Narrow screens: down to the picture, then down to the next stop or the arrowhead. */}
      <Down dash={dashIn} className={cn('top-0', hasSign ? 'h-[4.5rem]' : 'h-8')} style={delay(0)} />
      <Down
        dash={dashOut}
        className={cn(hasSign ? 'top-[4.5rem]' : 'top-8', stop.isLast ? 'bottom-3' : 'bottom-0')}
        style={delay(0.45)}
      />
      {stop.isLast && (
        <svg
          viewBox="0 0 24 16"
          className="road-down absolute start-5 bottom-[0.625rem] h-4 w-6 overflow-visible md:hidden"
          style={delay(0.9)}
        >
          <path d="M3,2 C7,6 10,10 12,14 C14,10 17,6 21,3" {...STROKE} />
        </svg>
      )}
    </div>
  )
}

/** The sign on the way into a stop: where the road starts, where it forks, or that the stop is one more choice. */
function Sign({ stop }: { stop: RoadmapStop }) {
  const m = useM()
  if (stop.lead === 'next') return null
  const forwards = stop.row % 2 === 0
  return (
    <p
      className={cn(
        'road-stop relative z-10 col-span-2 flex h-10 items-center',
        'md:absolute md:top-12 md:z-20 md:h-auto md:-translate-y-1/2',
        // After a turn the sign starts in the margin the turn is drawn in; between two stops it sits on the line between them.
        stop.place === 0
          ? forwards
            ? 'md:-start-12'
            : 'md:-end-12'
          : forwards
            ? 'md:start-0 md:-translate-x-1/2 rtl:md:translate-x-1/2'
            : 'md:end-0 md:translate-x-1/2 rtl:md:-translate-x-1/2',
      )}
      style={delay(0)}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap',
          stop.lead === 'or'
            ? 'border border-dashed border-primary/60 bg-background text-muted-foreground'
            : 'bg-primary text-primary-foreground shadow-sm',
        )}
      >
        {stop.lead === 'start' && <Flag className="size-3.5" />}
        {stop.lead === 'fork' && <Split className="size-3.5 rotate-90 rtl:-rotate-90" />}
        {m.home.roadmap.signs[stop.lead]}
      </span>
    </p>
  )
}

/**
 * Marks each stop as seen when it scrolls into view, which lets the style
 * sheet draw its road and bring in its card. Stops already on screen when the
 * page starts are left as they are, and so is everything for a visitor who
 * asked for reduced motion or has no JavaScript.
 */
function useRoadReveal() {
  const road = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const list = road.current
    if (!list || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const stops = Array.from(list.children) as HTMLElement[]
    for (const stop of stops) {
      if (stop.getBoundingClientRect().top < window.innerHeight * 0.85) stop.dataset.seen = ''
    }
    list.dataset.armed = ''
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.seen = ''
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    )
    for (const stop of stops) if (!('seen' in stop.dataset)) observer.observe(stop)
    return () => observer.disconnect()
  }, [])
  return road
}

/** Every method as a stop on one road: the steps in order, then the choices where it forks. */
export function Roadmap() {
  const m = useM()
  const road = useRoadReveal()
  const text = m.home.roadmap
  return (
    <ol ref={road} className="roadmap grid md:mx-12 md:grid-cols-2">
      {STOPS.map((stop, index) => {
        const method = m.methods[stop.method]
        const stopText = method.roadmap
        return (
          <li
            key={stop.method}
            className={cn(
              'relative grid grid-cols-[4.5rem_minmax(0,1fr)] content-start pb-8',
              'md:flex md:flex-col md:px-3 md:pt-[6.5rem] md:pb-16 md:[grid-column:var(--column)] md:[grid-row:var(--row)]',
              stop.place > 0 && 'md:[--road-wait:0.5s]',
              stop.isLast && 'pb-12',
            )}
            style={{ '--column': stop.column, '--row': stop.row + 1 } as CSSProperties}
          >
            <Road stop={stop} next={STOPS[index + 1]} />
            <Sign stop={stop} />

            <div
              className="road-stop relative z-10 size-16 md:absolute md:top-1 md:left-1/2 md:size-[5.5rem] md:-translate-x-1/2"
              style={delay(0.3)}
            >
              <div className="size-full rounded-full border-2 border-primary/50 bg-background p-1.5 shadow-sm md:p-2">
                <CubePicture colours={PICTURES[stop.method]} label={stopText.picture} className="size-full" />
              </div>
              <span
                aria-hidden
                className="absolute -start-1 -top-1 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular-nums md:size-7 md:text-sm"
              >
                {stop.number}
              </span>
            </div>

            <Link
              to="/{-$locale}/learn/$method"
              params={{ method: stop.method }}
              className="road-stop group relative z-10 flex min-w-0 flex-col rounded-2xl border bg-card p-4 shadow-lg sm:p-5 shadow-black/5 transition-colors hover:border-primary/50 hover:bg-accent md:flex-1"
              style={delay(0.4)}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                <h3 className="text-xl font-semibold tracking-tight">{method.name}</h3>
                <Badge variant="secondary">{method.level}</Badge>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{stopText.picture}</p>
              <p className="mt-3 text-pretty text-muted-foreground">{stopText.what}</p>
              <p className="mt-3 border-s-2 border-primary/50 ps-3 text-sm text-pretty">{stopText.pick}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-5 text-sm">
                <span className="text-muted-foreground">
                  {m.learn.stageCount(stagesOf(stop.method).length)} · {text.moves(ROADMAP[stop.method].moves)}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-primary">
                  {text.action}
                  <ForwardArrow className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
