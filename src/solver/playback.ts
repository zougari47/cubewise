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

const inverse = (move: Move) => move - (move % 3) + (2 - (move % 3))

export function usePlayback(steps: readonly Step[] | null) {
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
    // Leave time to see the whole cube finish turning before the next move.
    const afterCubeTurn = state.done > 0 && steps[state.done - 1].move === undefined
    const wait = setTimeout(stepForward, afterCubeTurn ? 550 : 120)
    return () => clearTimeout(wait)
  }, [steps, state, stepForward])

  return { ...state, total, stepForward, stepBack, finishTurn, toggle, pause, restart }
}

export type Playback = ReturnType<typeof usePlayback>
