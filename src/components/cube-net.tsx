import { cn } from '#/lib/utils'
import { useM } from '#/i18n'
import { hexOf } from '#/pages/solver/colours.ts'
import type { Paint } from '#/pages/solver/entry.ts'

/** Where each face (U R F D L B) sits in the unfolded cube: [column, row]. */
const FACE_CELLS = [
  [2, 1],
  [3, 2],
  [2, 2],
  [2, 3],
  [1, 2],
  [4, 2],
]

/**
 * The net: all six faces unfolded flat. Every sticker is a labelled button, so
 * this is also how the cube is read and edited without the 3D view.
 */
export function CubeNet({
  stickers,
  front,
  cursor,
  flagged,
  onStickerClick,
  className,
}: {
  stickers: readonly Paint[]
  /** The face currently at the front. */
  front: number
  /** The sticker the keyboard will paint next. */
  cursor: number
  /** Stickers to mark as wrong. */
  flagged: ReadonlySet<number>
  onStickerClick: (sticker: number) => void
  className?: string
}) {
  const m = useM()
  return (
    // The net is a drawing of the cube: left stays left in a right-to-left language.
    <div dir="ltr" className={cn('grid grid-cols-4 gap-1.5', className)}>
      {FACE_CELLS.map(([column, row], face) => (
        <div
          key={face}
          style={{ gridColumnStart: column, gridRowStart: row }}
          className={cn(
            'grid grid-cols-3 gap-0.5 rounded-md bg-zinc-900 p-0.5 ring-offset-2 ring-offset-background',
            face === front && 'ring-2 ring-sky-500',
          )}
        >
          {Array.from({ length: 9 }, (_, i) => {
            const sticker = face * 9 + i
            return (
              <button
                key={i}
                type="button"
                aria-label={m.solver.entry.stickerLabel(face, i + 1, stickers[sticker])}
                onClick={() => onStickerClick(sticker)}
                style={{ backgroundColor: hexOf(stickers[sticker]) }}
                className={cn(
                  'aspect-square rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                  flagged.has(sticker) && 'ring-2 ring-red-500 ring-inset',
                  face === front && sticker === cursor && !flagged.has(sticker) && 'ring-2 ring-sky-500 ring-inset',
                )}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
