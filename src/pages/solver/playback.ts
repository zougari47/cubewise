/** Playing a list of steps on the 3D cube: play, pause, and one step either way. */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CubeTurn } from '#/components/cube-view.tsx'
import type { Move } from '#/cube/cubie.ts'
import type { Step } from '#/cube/steps.ts'

interface PlaybackState {
  /** How many steps have been made. */
  done: number
  playing: boolean
  /** The move being animated, and whether it goes forward (+1) or back (-1). */
  turn: (CubeTurn & { direction: 1 | -1 }) | null
}

const STOPPED: PlaybackState = { done: 0, playing: false, turn: null }

/** The pause between two moves while playing, in milliseconds. */
export const DEFAULT_PAUSE_MS = 100
export const MAX_PAUSE_MS = 3000
/** A whole-cube turn gets at least this long, so it can be seen before the next move. */
const CUBE_TURN_PAUSE_MS = 550

const PAUSE_KEY = 'cubewise.playback.pause.v1'

/** The user's chosen pause between moves, kept on the device for next time. */
export function usePlaybackPause(): [number, (pauseMs: number) => void] {
  const [pauseMs, setPauseMs] = useState(DEFAULT_PAUSE_MS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PAUSE_KEY)
      const value = saved === null ? NaN : Number(saved)
      if (Number.isFinite(value)) setPauseMs(Math.min(MAX_PAUSE_MS, Math.max(0, value)))
    } catch {
      // Storage can be blocked; the default pause is used.
    }
  }, [])

  const choose = useCallback((value: number) => {
    setPauseMs(value)
    try {
      localStorage.setItem(PAUSE_KEY, String(value))
    } catch {
      // The choice still applies until the page is closed.
    }
  }, [])

  return [pauseMs, choose]
}

const inverse = (move: Move) => move - (move % 3) + (2 - (move % 3))

export function usePlayback(steps: readonly Step[] | null, pauseMs = DEFAULT_PAUSE_MS) {
  const [state, setState] = useState(STOPPED)
  const turnId = useRef(0)
  const total = steps?.length ?? 0

  useEffect(() => setState(STOPPED), [steps])

  const stepForward = useCallback(() => {
    if (!steps) return
    setState((now) => {
      if (now.turn || now.done >= steps.length) return now
      const move = steps[now.done].move
      // Turning the whole cube changes no sticker, so there is no move to animate.
      if (move === undefined) return { ...now, done: now.done + 1 }
      return { ...now, turn: { move, id: ++turnId.current, direction: 1 } }
    })
  }, [steps])

  const stepBack = useCallback(() => {
    if (!steps) return
    setState((now) => {
      if (now.turn || now.done === 0) return now
      const move = steps[now.done - 1].move
      if (move === undefined) return { ...now, playing: false, done: now.done - 1 }
      return {
        ...now,
        playing: false,
        turn: { move: inverse(move), id: ++turnId.current, direction: -1 },
      }
    })
  }, [steps])

  /** Call when the 3D cube has finished animating `turn`. */
  const finishTurn = useCallback(() => {
    setState((now) =>
      now.turn ? { ...now, done: now.done + now.turn.direction, turn: null } : now,
    )
  }, [])

  const toggle = useCallback(() => {
    if (!steps) return
    setState((now) => {
      if (now.playing) return { ...now, playing: false }
      // Pressing play at the end starts again from the beginning.
      if (now.done >= steps.length) return { done: 0, playing: true, turn: null }
      return { ...now, playing: true }
    })
  }, [steps])

  const pause = useCallback(() => setState((now) => ({ ...now, playing: false })), [])
  const restart = useCallback(() => setState(STOPPED), [])

  useEffect(() => {
    if (!steps || !state.playing || state.turn) return
    if (state.done >= steps.length) {
      setState((now) => ({ ...now, playing: false }))
      return
    }
    const afterCubeTurn = state.done > 0 && steps[state.done - 1].move === undefined
    const wait = setTimeout(stepForward, afterCubeTurn ? Math.max(CUBE_TURN_PAUSE_MS, pauseMs) : pauseMs)
    return () => clearTimeout(wait)
  }, [steps, state, stepForward, pauseMs])

  return { ...state, total, stepForward, stepBack, finishTurn, toggle, pause, restart }
}

export type Playback = ReturnType<typeof usePlayback>
