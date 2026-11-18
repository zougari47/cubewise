/**
 * The interactive 3D cube. This file pulls in the 3D library, so it must only
 * ever be loaded with `lazy(() => import(...))`, never imported directly by a page.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { CanvasTexture, Matrix4, Quaternion, Shape, ShapeGeometry, Vector3 } from 'three'
import type { Group } from 'three'
import { FACE_NORMALS, dot, stickerAt } from '#/core/cube/geometry.ts'
import type { Vec3 } from '#/core/cube/geometry.ts'
import { DEFAULT_ORIENTATION } from '#/core/cube/orientation.ts'
import type { Orientation } from '#/core/cube/orientation.ts'
import type { Move } from '#/core/cube/cubie.ts'

/** One move to animate. Give each new turn a new `id`. */
export interface CubeTurn {
  move: Move
  id: number
  /**
   * Which layers turn, counted from the move's face: 1 is the face itself, 0
   * the middle layer. Default: the face alone. When a middle layer turns, the
   * centres move, so `orientation` changes with the turn's end and is not
   * animated a second time.
   */
  layers?: readonly number[]
}

export interface CubeViewProps {
  /** Screen colour of each of the 54 stickers. */
  colours: readonly string[]
  /** How the whole cube is turned; changes are animated. */
  orientation?: Orientation
  /** Show sticker numbers 1–9 on the face in front. */
  numbers?: boolean
  /** Stickers to outline, and the outline colour of each. */
  frames?: ReadonlyMap<number, string>
  /** A move to animate on top of `colours`. */
  turn?: CubeTurn | null
  /** How long one quarter turn takes. */
  turnMs?: number
  /** Called once when the `turn` animation finishes. */
  onTurnEnd?: () => void
  onStickerClick?: (sticker: number) => void
  /** Slowly spin the cube for show. */
  spin?: boolean
  /** Let the user drag the cube round freely. For show only: it ignores `orientation`. */
  draggable?: boolean
  className?: string
}

interface StickerMesh {
  sticker: number
  /** Turns a square facing the viewer to face this sticker's way. */
  quaternion: Quaternion
}

interface Cubie {
  home: Vec3
  stickers: StickerMesh[]
}

const TOWARDS_VIEWER = new Vector3(0, 0, 1)
const SCREEN_UP = new Vector3(0, 1, 0)
const SCREEN_RIGHT = new Vector3(1, 0, 0)
const SCRATCH = new Quaternion()

const CUBIES: Cubie[] = []
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      if (x === 0 && y === 0 && z === 0) continue
      const home: Vec3 = [x, y, z]
      const stickers = FACE_NORMALS.filter((normal) => dot(home, normal) === 1).map((normal) => ({
        sticker: stickerAt(home, normal),
        quaternion: new Quaternion().setFromUnitVectors(TOWARDS_VIEWER, new Vector3(...normal)),
      }))
      CUBIES.push({ home, stickers })
    }
  }
}

function roundedSquare(size: number, radius: number): ShapeGeometry {
  const half = size / 2
  const shape = new Shape()
  shape.moveTo(-half + radius, -half)
  shape.lineTo(half - radius, -half)
  shape.quadraticCurveTo(half, -half, half, -half + radius)
  shape.lineTo(half, half - radius)
  shape.quadraticCurveTo(half, half, half - radius, half)
  shape.lineTo(-half + radius, half)
  shape.quadraticCurveTo(-half, half, -half, half - radius)
  shape.lineTo(-half, -half + radius)
  shape.quadraticCurveTo(-half, -half, -half + radius, -half)
  return new ShapeGeometry(shape)
}

function numberTexture(number: number): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')!
  context.font = '700 84px system-ui, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.lineJoin = 'round'
  context.lineWidth = 12
  context.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  context.strokeText(String(number), 64, 70)
  context.fillStyle = '#18181b'
  context.fillText(String(number), 64, 70)
  return new CanvasTexture(canvas)
}

function quaternionOf(orientation: Orientation): Quaternion {
  const [a, b, c] = orientation
  const matrix = new Matrix4().set(
    a[0], a[1], a[2], 0,
    b[0], b[1], b[2], 0,
    c[0], c[1], c[2], 0,
    0, 0, 0, 1,
  )
  return new Quaternion().setFromRotationMatrix(matrix)
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

function Scene({
  colours,
  orientation = DEFAULT_ORIENTATION,
  numbers = false,
  frames,
  turn = null,
  turnMs = 350,
  onTurnEnd,
  onStickerClick,
  spin = false,
  draggable = false,
}: CubeViewProps) {
  const invalidate = useThree((state) => state.invalidate)
  const canvas = useThree((state) => state.gl.domElement)
  const drag = useRef({ active: false, x: 0, y: 0, yaw: 0, pitch: 0 })
  const whole = useRef<Group>(null)
  const numberGroup = useRef<Group>(null)
  const cubieGroups = useRef<(Group | null)[]>([])
  const animation = useRef({ id: -1, progress: 0, done: true, applied: false, movedCentres: false })
  const onTurnEndRef = useRef(onTurnEnd)
  onTurnEndRef.current = onTurnEnd

  const target = useMemo(() => quaternionOf(orientation), [orientation])
  const stickerShape = useMemo(() => roundedSquare(0.84, 0.12), [])
  const numberTextures = useMemo(
    () => Array.from({ length: 9 }, (_, i) => numberTexture(i + 1)),
    [],
  )

  useLayoutEffect(() => {
    whole.current?.quaternion.copy(target)
    // Only on mount: later changes are animated in the frame loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    invalidate()
  })

  useEffect(() => {
    if (!draggable) return
    const state = drag.current
    const down = (event: PointerEvent) => {
      state.active = true
      state.x = event.clientX
      state.y = event.clientY
      canvas.setPointerCapture(event.pointerId)
    }
    const move = (event: PointerEvent) => {
      if (!state.active) return
      state.yaw += (event.clientX - state.x) * 0.01
      state.pitch += (event.clientY - state.y) * 0.01
      state.x = event.clientX
      state.y = event.clientY
      invalidate()
    }
    const up = () => {
      state.active = false
    }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)
    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
    }
  }, [draggable, canvas, invalidate])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    let moving = false

    // The last turn is over once it is taken away or replaced by the next one.
    const turnEnded = animation.current.applied && animation.current.id !== (turn?.id ?? -1)
    if (turnEnded) {
      CUBIES.forEach((cubie, i) => {
        cubieGroups.current[i]?.quaternion.identity()
        cubieGroups.current[i]?.position.set(...cubie.home)
      })
      animation.current.applied = false
    }

    const group = whole.current
    if (group) {
      if (turnEnded && animation.current.movedCentres) {
        // A wide or slice turn has just ended: the cube is already where it should be.
        group.quaternion.copy(target)
        animation.current.movedCentres = false
      }
      if (spin || draggable) {
        // Free turning, about the screen's own up and sideways axes.
        const pulled = drag.current
        const yaw = pulled.yaw + (spin && !pulled.active ? delta * 0.5 : 0)
        if (yaw !== 0) group.quaternion.premultiply(SCRATCH.setFromAxisAngle(SCREEN_UP, yaw))
        if (pulled.pitch !== 0) {
          group.quaternion.premultiply(SCRATCH.setFromAxisAngle(SCREEN_RIGHT, pulled.pitch))
        }
        pulled.yaw = 0
        pulled.pitch = 0
        moving = spin
      } else if (group.quaternion.angleTo(target) > 0.002) {
        group.quaternion.rotateTowards(target, delta * 7)
        moving = true
      } else {
        group.quaternion.copy(target)
      }
    }
    if (numberGroup.current) numberGroup.current.visible = numbers && !moving

    const state = animation.current
    if (turn && state.id !== turn.id) {
      state.id = turn.id
      state.progress = 0
      state.done = false
    } else if (!turn) {
      state.id = -1
    }
    if (turn && !state.done) {
      const face = Math.floor(turn.move / 3)
      const quarters = (turn.move % 3) + 1
      // Clockwise seen from outside is a negative angle about the face's own axis.
      const fullAngle = quarters === 3 ? Math.PI / 2 : (-quarters * Math.PI) / 2
      state.progress = Math.min(1, state.progress + (delta * 1000) / (turnMs * (quarters === 2 ? 1.5 : 1)))
      const axis = new Vector3(...FACE_NORMALS[face])
      const angle = fullAngle * easeInOut(state.progress)
      const layers = turn.layers ?? [1]
      state.movedCentres = layers.includes(0)
      CUBIES.forEach((cubie, i) => {
        const cubieGroup = cubieGroups.current[i]
        if (!cubieGroup || !layers.includes(dot(cubie.home, FACE_NORMALS[face]))) return
        cubieGroup.quaternion.setFromAxisAngle(axis, angle)
        cubieGroup.position.set(...cubie.home).applyQuaternion(cubieGroup.quaternion)
      })
      state.applied = true
      moving = true
      if (state.progress >= 1) {
        state.done = true
        onTurnEndRef.current?.()
      }
    }

    if (moving) invalidate()
  })

  return (
    <>
      <group ref={whole}>
        {CUBIES.map((cubie, i) => (
          <group
            key={i}
            position={cubie.home}
            ref={(element) => {
              cubieGroups.current[i] = element
            }}
          >
            <mesh>
              <boxGeometry args={[0.97, 0.97, 0.97]} />
              <meshBasicMaterial color="#18181b" />
            </mesh>
            {cubie.stickers.map(({ sticker, quaternion }) => (
              <group key={sticker} quaternion={quaternion}>
                {frames?.has(sticker) && (
                  <mesh position={[0, 0, 0.488]}>
                    <planeGeometry args={[0.97, 0.97]} />
                    <meshBasicMaterial color={frames.get(sticker)} />
                  </mesh>
                )}
                <mesh
                  position={[0, 0, frames?.has(sticker) ? 0.492 : 0.49]}
                  scale={frames?.has(sticker) ? 0.86 : 1}
                  geometry={stickerShape}
                  onClick={
                    onStickerClick &&
                    ((event) => {
                      event.stopPropagation()
                      onStickerClick(sticker)
                    })
                  }
                >
                  <meshBasicMaterial color={colours[sticker]} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>
      <group ref={numberGroup} visible={false}>
        {numberTextures.map((texture, i) => (
          <mesh key={i} position={[(i % 3) - 1, 1 - Math.floor(i / 3), 1.53]} raycast={() => null}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={texture} transparent depthWrite={false} />
          </mesh>
        ))}
      </group>
    </>
  )
}

export default function CubeView({ className, ...scene }: CubeViewProps) {
  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [3.4, 3.1, 7.2], fov: 36 }}
      className={className}
      style={
        scene.draggable
          ? { cursor: 'grab', touchAction: 'pan-y' }
          : scene.onStickerClick
            ? { cursor: 'pointer' }
            : undefined
      }
    >
      <Scene {...scene} />
    </Canvas>
  )
}
