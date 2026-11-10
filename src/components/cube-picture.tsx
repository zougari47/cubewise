import { STICKER_PLACES } from '#/cube/geometry.ts'
import type { Vec3 } from '#/cube/geometry.ts'

/** Flattens a point on the cube onto the page, seen from the front-right and above. */
function project([x, y, z]: Vec3): string {
  return `${((x - z) * 0.866).toFixed(3)},${((x + z) * 0.5 - y).toFixed(3)}`
}

const add = (a: Vec3, b: Vec3, scale: number): Vec3 => [
  a[0] + b[0] * scale,
  a[1] + b[1] * scale,
  a[2] + b[2] * scale,
]

/** A square centred on `centre`, lying flat on the face that points along `normal`. */
function square(centre: Vec3, normal: Vec3, half: number): string {
  const across: Vec3 = normal[0] !== 0 ? [0, 0, 1] : [1, 0, 0]
  const along: Vec3 = normal[1] !== 0 ? [0, 0, 1] : [0, 1, 0]
  return [
    add(add(centre, across, -half), along, -half),
    add(add(centre, across, half), along, -half),
    add(add(centre, across, half), along, half),
    add(add(centre, across, -half), along, half),
  ]
    .map(project)
    .join(' ')
}

/** The three faces this picture shows: U, R and F. */
const VISIBLE = STICKER_PLACES.map((sticker, index) => ({ ...sticker, index })).filter(
  ({ index }) => index < 27,
)

const FACES: Vec3[] = [
  [0, 1, 0],
  [1, 0, 0],
  [0, 0, 1],
]

/**
 * A still picture of the cube as plain SVG: instant to load, readable without
 * JavaScript, and the same shape as the 3D cube that may replace it.
 */
export function CubePicture({
  colours,
  label,
  className,
}: {
  /** Screen colour of each of the 54 stickers. */
  colours: readonly string[]
  label: string
  className?: string
}) {
  return (
    <svg viewBox="-2.8 -3.2 5.6 6.4" role="img" aria-label={label} className={className}>
      {FACES.map((normal) => (
        <polygon
          key={normal.join()}
          points={square(add([0, 0, 0], normal, 1.5), normal, 1.5)}
          fill="#18181b"
          stroke="#18181b"
          strokeWidth={0.12}
          strokeLinejoin="round"
        />
      ))}
      {VISIBLE.map(({ place, normal, index }) => (
        <polygon
          key={index}
          points={square(add(place, normal, 0.5), normal, 0.36)}
          fill={colours[index]}
          stroke={colours[index]}
          strokeWidth={0.14}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
