import { Suspense, lazy, useEffect, useState } from 'react'
import { CubePicture } from '#/components/cube-picture.tsx'
import { applyMoves, parseMoves, solvedCube } from '#/cube/cubie.ts'
import { stickersFromCube } from '#/cube/stickers.ts'
import { m } from '#/i18n'
import { COLOUR_HEX } from '#/pages/solver/colours.ts'
import { STANDARD_SCHEME } from '#/pages/solver/entry.ts'

const CubeView = lazy(() => import('#/components/cube-view.tsx'))

const SCRAMBLE = "R U2 F' D L2 B' R' U F2 D' L U2"
const COLOURS = stickersFromCube(applyMoves(solvedCube(), parseMoves(SCRAMBLE))).map(
  (face) => COLOUR_HEX[STANDARD_SCHEME[face]],
)

/**
 * The cube on the home page. It starts as a still picture so the page loads
 * instantly. With a mouse it becomes 3D by itself once the browser is idle;
 * on a touch screen it stays a picture until tapped, to save mobile data.
 * Once 3D, it spins slowly and can be dragged round.
 */
export function HomeCube() {
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => setLive(true), { timeout: 3000 })
      return () => cancelIdleCallback(handle)
    }
    const handle = setTimeout(() => setLive(true), 1500)
    return () => clearTimeout(handle)
  }, [])

  const picture = <CubePicture colours={COLOURS} label={m.home.cubeAlt} className="size-full p-[8%]" />

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {live ? (
        <Suspense fallback={picture}>
          <CubeView colours={COLOURS} spin draggable className="size-full" />
        </Suspense>
      ) : (
        <button
          type="button"
          onClick={() => setLive(true)}
          aria-label={m.home.load3d}
          className="size-full cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {picture}
        </button>
      )}
    </div>
  )
}
