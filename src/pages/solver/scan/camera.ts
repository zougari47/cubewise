import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraStatus = 'starting' | 'ready' | 'unsupported' | 'denied' | 'missing' | 'failed'

/** The camera settings worth knowing when a scan goes wrong. */
const RETRIES = 2
const RETRY_AFTER_MS = 600

const REPORTED_SETTINGS = ['width', 'height', 'frameRate', 'facingMode', 'whiteBalanceMode', 'exposureMode']

/** Starts the camera into a `<video>`, and stops it when the component goes away. */
export function useCamera(video: React.RefObject<HTMLVideoElement | null>) {
  const [status, setStatus] = useState<CameraStatus>('starting')
  /** The browser's own name for what went wrong, e.g. `NotReadableError`. */
  const [errorName, setErrorName] = useState('')
  const [attempt, setAttempt] = useState(0)
  const stream = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return
    }
    let cancelled = false
    let timer = 0
    setStatus('starting')

    const start = (retriesLeft: number) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        .then((started) => {
          if (cancelled) {
            started.getTracks().forEach((track) => track.stop())
            return
          }
          stream.current = started
          if (video.current) {
            video.current.srcObject = started
            video.current.play().catch(() => {})
          }
          setStatus('ready')
        })
        .catch((error: unknown) => {
          if (cancelled) return
          const name = error instanceof Error ? error.name : ''
          const blocked = name === 'NotAllowedError' || name === 'SecurityError'
          const missing = name === 'NotFoundError' || name === 'OverconstrainedError'
          // A camera that was only just let go can still be busy for a moment.
          if (!blocked && !missing && retriesLeft > 0) {
            timer = window.setTimeout(() => start(retriesLeft - 1), RETRY_AFTER_MS)
            return
          }
          setErrorName(name)
          setStatus(blocked ? 'denied' : missing ? 'missing' : 'failed')
        })
    }
    // Started a moment later, so a component that is set up twice in a row
    // (as React does while developing) only ever opens the camera once.
    timer = window.setTimeout(() => start(RETRIES), 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      stream.current?.getTracks().forEach((track) => track.stop())
      stream.current = null
    }
  }, [video, attempt])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  /**
   * Stops (or lets) the camera re-tint the picture as the cube turns, so a
   * colour reads the same on every face. Only some cameras allow it; resolves
   * to whether this one did.
   */
  const holdWhiteBalance = useCallback(async (hold: boolean): Promise<boolean> => {
    const track = stream.current?.getVideoTracks()[0]
    if (!track || typeof track.getCapabilities !== 'function') return false
    const modes = (track.getCapabilities() as { whiteBalanceMode?: string[] }).whiteBalanceMode
    const mode = hold ? 'manual' : 'continuous'
    if (!modes?.includes(mode)) return false
    try {
      // Not in TypeScript's camera types yet.
      const constraint: Record<string, string> = { whiteBalanceMode: mode }
      await track.applyConstraints({ advanced: [constraint] })
      return true
    } catch {
      return false
    }
  }, [])

  const settings = useCallback((): Record<string, unknown> => {
    const all = (stream.current?.getVideoTracks()[0]?.getSettings() ?? {}) as Record<string, unknown>
    return Object.fromEntries(REPORTED_SETTINGS.filter((key) => key in all).map((key) => [key, all[key]]))
  }, [])

  return { status, errorName, retry, holdWhiteBalance, settings }
}
