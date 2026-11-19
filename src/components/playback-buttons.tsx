import { Pause, Play, SkipBack, StepBack, StepForward } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useM } from '#/i18n'
import type { Playback } from '#/pages/solver/playback.ts'

/** Restart, step back, play/pause and step forward for a playback. */
export function PlaybackButtons({ playback }: { playback: Playback }) {
  const text = useM().solver.playback
  return (
    // Back is on the left and forward on the right in every language, as on any player.
    <div dir="ltr" className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label={text.restart}
        disabled={playback.done === 0 && !playback.turn}
        onClick={playback.restart}
      >
        <SkipBack />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label={text.back}
        disabled={playback.done === 0}
        onClick={playback.stepBack}
      >
        <StepBack />
      </Button>
      <Button onClick={playback.toggle} className="flex-1">
        {playback.playing ? <Pause /> : <Play />}
        {playback.playing ? text.pause : text.play}
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label={text.forward}
        disabled={playback.done >= playback.total}
        onClick={() => {
          playback.pause()
          playback.stepForward()
        }}
      >
        <StepForward />
      </Button>
    </div>
  )
}
