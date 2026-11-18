/**
 * The drawings for the scan guide: a person showing a cube to a laptop's
 * webcam, and to a phone's back camera. They are not part of the site; `render.mjs`
 * plays them in a browser and records each as a GIF in `public/scan-guide`.
 */
import { COLOUR_HEX } from '#/pages/solver/colours.ts'
import type { ColourKey } from '#/pages/solver/entry.ts'

const WATERMARK = 'cube.ahmedz.dev'

/**
 * One step takes 3.2 s: the cube is held still and captured (a tick), then a
 * hand turns it to the next face. Six steps show the six faces in the order
 * the scan asks for: four sides, then the top, then the bottom. Sizes are in
 * `cqw`, so a drawing scales with its box.
 */
const STEP_S = 3.2
const STEPS = 6
/** How long the whole animation lasts before it repeats, in seconds. */
export const ALL_S = STEP_S * STEPS

/** The cube's turns for a camera on the given side; `way` is +1 for the right, -1 for the left. */
const cubeTurns = (name: string, way: 1 | -1) => `
@keyframes ${name} {
  0%, 9.17% { transform: rotateZ(0deg) rotateY(0deg); }
  14.17%, 25.83% { transform: rotateZ(0deg) rotateY(${way * 90}deg); }
  30.83%, 42.5% { transform: rotateZ(0deg) rotateY(${way * 180}deg); }
  47.5%, 59.17% { transform: rotateZ(0deg) rotateY(${way * 270}deg); }
  64.17%, 75.83% { transform: rotateZ(${way * 90}deg) rotateY(${way * 270}deg); }
  80.83%, 92.5% { transform: rotateZ(${way * -90}deg) rotateY(${way * 270}deg); }
  97.5%, 100% { transform: rotateZ(0deg) rotateY(${way * 360}deg); }
}`

export const ANIMATION = `
.sg-scene { position: relative; width: 100%; overflow: hidden; container-type: inline-size; --cube: 15cqw; }
.sg-layer { position: absolute; inset: 0; width: 100%; height: 100%; }
.sg-cube { position: absolute; width: var(--cube); height: var(--cube); translate: -50% -50%; perspective: 70cqw; }
.sg-view, .sg-spin { position: absolute; inset: 0; transform-style: preserve-3d; }
.sg-view-right { transform: rotateX(-22deg) rotateY(-30deg); }
.sg-view-left { transform: rotateX(-22deg) rotateY(30deg); }
.sg-face { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 5%; padding: 6%; border-radius: 9%; background: #18181b; backface-visibility: hidden; }
.sg-face > span { border-radius: 16%; }
.sg-spin-right { animation: sg-spin-right ${ALL_S}s ease-in-out infinite; }
.sg-spin-left { animation: sg-spin-left ${ALL_S}s ease-in-out infinite; }
.sg-push-right { animation: sg-push-right ${STEP_S}s ease-in-out infinite; }
.sg-push-left { animation: sg-push-left ${STEP_S}s ease-in-out infinite; }
.sg-tick { transform-box: fill-box; transform-origin: center; animation: sg-tick ${STEP_S}s ease-out infinite; }
.sg-sight { animation: sg-sight ${STEP_S}s linear infinite; }
.sg-step { opacity: 0; animation: sg-step ${ALL_S}s steps(1, end) infinite; }
${Array.from({ length: STEPS }, (_, step) => `.sg-at-${step + 1} { animation-delay: ${(step - STEPS) * STEP_S}s; }`).join('\n')}
${cubeTurns('sg-spin-right', 1)}
${cubeTurns('sg-spin-left', -1)}
@keyframes sg-push-right { 0%, 55% { transform: translate(-5px, 0); } 85% { transform: translate(6px, 0); } 93% { transform: translate(1px, -5px); } 100% { transform: translate(-5px, 0); } }
@keyframes sg-push-left { 0%, 55% { transform: translate(5px, 0); } 85% { transform: translate(-6px, 0); } 93% { transform: translate(-1px, -4px); } 100% { transform: translate(5px, 0); } }
@keyframes sg-tick { 0%, 20% { opacity: 0; transform: scale(0.4); } 28%, 48% { opacity: 1; transform: scale(1); } 54%, 100% { opacity: 0; transform: scale(1); } }
@keyframes sg-sight { 0%, 50% { opacity: 1; } 58%, 88% { opacity: 0.2; } 96%, 100% { opacity: 1; } }
@keyframes sg-step { 0% { opacity: 1; } 16.667% { opacity: 0; } }
`

/** The colour behind the drawings, used to hide lines that pass behind something. */
const PAPER = 'var(--paper)'
const CAMERA = '#10b981'
const LINE = 1.4

/** The six faces of the drawn cube: how each is turned into place, and its stickers. */
const CUBE_FACES: { turn: string; colours: ColourKey[] }[] = [
  { turn: 'rotateY(0deg)', colours: ['R', 'W', 'G', 'Y', 'G', 'O', 'W', 'G', 'R'] },
  { turn: 'rotateY(90deg)', colours: ['B', 'Y', 'O', 'G', 'R', 'W', 'R', 'B', 'Y'] },
  { turn: 'rotateY(180deg)', colours: ['O', 'G', 'W', 'R', 'B', 'Y', 'G', 'O', 'B'] },
  { turn: 'rotateY(-90deg)', colours: ['Y', 'R', 'B', 'W', 'O', 'G', 'O', 'Y', 'W'] },
  { turn: 'rotateX(90deg)', colours: ['G', 'B', 'Y', 'O', 'W', 'R', 'B', 'W', 'O'] },
  { turn: 'rotateX(-90deg)', colours: ['W', 'O', 'R', 'B', 'Y', 'G', 'Y', 'R', 'G'] },
]

/** Drawings are laid out on this grid; `at` turns a point on it into a place in the box. */
export const WIDTH = 260
export const HEIGHT = 180
const at = (x: number, y: number) => ({ left: `${(x / WIDTH) * 100}%`, top: `${(y / HEIGHT) * 100}%` })

/** A real 3D cube that shows the camera each of its six faces in turn. */
function Cube({ x, y, towards }: { x: number; y: number; towards: 'left' | 'right' }) {
  return (
    <div aria-hidden className="sg-cube" style={at(x, y)}>
      <div className={`sg-view sg-view-${towards}`}>
        <div className={`sg-spin sg-spin-${towards}`}>
          {CUBE_FACES.map((face) => (
            <div
              key={face.turn}
              className="sg-face"
              style={{ transform: `${face.turn} translateZ(calc(var(--cube) / 2))` }}
            >
              {face.colours.map((colour, cell) => (
                <span key={cell} style={{ backgroundColor: COLOUR_HEX[colour] }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Layer({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="sg-layer"
      fill="none"
      stroke="currentColor"
      strokeWidth={LINE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

/**
 * An arm or a finger: a line drawn thick, then again thinner in the paper
 * colour, which leaves an outline with rounded ends and joints.
 */
function Limb({ d, width, className }: { d: string; width: number; className?: string }) {
  return (
    <g className={className}>
      <path d={d} strokeWidth={width} />
      <path d={d} stroke={PAPER} strokeWidth={width - LINE * 2} />
    </g>
  )
}

/** The seated person from the side, facing right; arms and hands are drawn per scene. */
function Person() {
  return (
    <>
      {/* Body */}
      <path d="M40 75 C 31 79, 27 100, 27 161 L 70 161 C 70 100, 66 85, 56 77 Z" fill={PAPER} />
      <path d="M40 75 Q 48 82 56 77" />
      {/* Neck, then the head in profile */}
      <path d="M41 58 L 40 75 L 56 77 L 55.5 64 Z" fill={PAPER} stroke="none" />
      <path d="M41 58 L 40 75 M55.5 64.5 L 56 77" />
      <path
        d="M57.5 27.5 C 46 22, 35 28, 34.5 40 C 34 49, 37 55, 41 58.5 L 55.5 64.8 C 60 66.5, 64.5 63.5, 64.8 59 L 63.6 56.6 L 65.4 54.6 L 64.4 51.6 L 68.4 49.4 L 64.2 41 C 64.6 36, 62.5 30.5, 57.5 27.5 Z"
        fill={PAPER}
      />
      {/* Hairline, a few strands, ear, eye, brow and mouth */}
      <path d="M61 30.5 C 58 36, 53 38, 51 43.5 C 47.5 43.5, 45 46.5, 45 51 C 45 55, 43 57, 41 58.5" />
      <path d="M39 34.5 C 44 30.5, 51 29.5, 56.5 31 M37.5 41.5 C 41 36.5, 47 34.5, 52.5 35.5 M38 49.5 C 39.5 45, 43 42, 47 41" strokeWidth="1" />
      <path d="M50.5 46.5 C 46.8 45.6, 46.4 53, 50 53.6" />
      <path d="M58.6 43.8 q 2 -1.5 4 -0.2 M57.6 40.4 q 3 -2 6 -0.8 M63.6 56.6 l -3.2 0.5" strokeWidth="1.1" />
    </>
  )
}

/** A hand cupped under the cube: the palm, a finger behind and the thumb in front. */
function HoldingHand({ x, y, thumb, thumbClass }: { x: number; y: number; thumb: 'left' | 'right'; thumbClass?: string }) {
  const side = thumb === 'left' ? 1 : -1
  return (
    <g transform={`translate(${x} ${y})`}>
      <Limb d={`M${side * 15} 0 L ${side * 17} -9 L ${side * 16} -16`} width={5.6} />
      <path d="M-20 -1 C -19 9, 19 9, 20 -1 C 12 -4, -12 -4, -20 -1 Z" fill={PAPER} />
      <Limb d={`M${side * -14} 0 L ${side * -13.5} -10 L ${side * -11} -18`} width={6.2} className={thumbClass} />
    </g>
  )
}

/** A green tick in a circle: the face was captured. */
function Tick({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="none">
      <g className="sg-tick">
        <circle r="9" fill={CAMERA} />
        <path d="M-4.2 0.4 L -1.2 3.4 L 4.4 -2.8" stroke="#fff" strokeWidth="2.2" />
      </g>
    </g>
  )
}

/** What the camera sees: dashed lines from the lens to the cube. */
function Sight({ from, to }: { from: [number, number]; to: [number, number][] }) {
  return (
    <g stroke={CAMERA} strokeWidth="1.5" strokeDasharray="3 5" className="sg-sight">
      {to.map(([x, y]) => (
        <path key={y} d={`M${from[0]} ${from[1]} L ${x} ${y}`} />
      ))}
    </g>
  )
}

/** Which of the six faces is being shown, counting up with the animation, and the site's address. */
function StepCount() {
  return (
    <g stroke="none" fill="currentColor" fontSize="11" fontWeight="600" textAnchor="middle">
      <text x="252" y="175" fontSize="7.5" fontWeight="500" textAnchor="end" opacity="0.55">
        {WATERMARK}
      </text>
      <rect x="214" y="8" width="38" height="19" rx="9.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {Array.from({ length: STEPS }, (_, step) => (
        <text key={step} x="233" y="21.5" className={`sg-step sg-at-${step + 1}`}>
          {step + 1} / {STEPS}
        </text>
      ))}
    </g>
  )
}

function LaptopScene() {
  return (
    <>
      <Layer>
        <path d="M10 161.5 H 250" opacity="0.5" />
        {/* The far arm, reaching over the cube. */}
        <Limb d="M58 90 L 100 83 L 130 66" width={11} />
        <Person />
        {/* The laptop, its screen facing the person, with the webcam at the top. */}
        <rect x="184" y="153" width="60" height="8" rx="4" fill={PAPER} />
        <Limb d="M240 153 L 251 94" width={6} />
      </Layer>
      <Cube x={142} y={101} towards="right" />
      <Layer>
        <circle cx="246.8" cy="101" r="2.8" fill={CAMERA} stroke="none" />
        <Sight from={[243, 101]} to={[[172, 86], [172, 120]]} />
        <Tick x={232} y={76} />
        {/* The near arm holds the cube from below. */}
        <Limb d="M52 94 L 90 143 L 126 134" width={12} />
        <HoldingHand x={141} y={131} thumb="left" />
        {/* The far hand rests on top; its fingers push the cube round. */}
        <g className="sg-push-right">
          <Limb d="M131 64 L 126 71 L 127.5 77.5" width={5.8} />
          <Limb d="M135.5 66 L 135.5 75 L 134.5 80.5" width={5.6} />
          <Limb d="M141 66 L 141 77.5 L 140 84" width={5.6} />
          <Limb d="M146.5 66 L 146.5 77 L 145.5 83" width={5.6} />
          <Limb d="M152 66 L 152 73.5 L 151 79" width={5.4} />
          <rect x="127" y="57.5" width="31" height="11.5" rx="5.7" fill={PAPER} />
        </g>
      </Layer>
    </>
  )
}

function PhoneScene() {
  return (
    <>
      <Layer>
        {/* The far arm, holding the phone. */}
        <Limb d="M56 92 L 86 115 L 107 101" width={11} />
        <Person />
      </Layer>
      <Cube x={198} y={100} towards="left" />
      <Layer>
        {/* The phone, seen edge on, its back camera towards the cube. */}
        <rect x="102" y="88" width="11" height="20" rx="5.5" fill={PAPER} />
        <rect x="111" y="60" width="9.5" height="50" rx="3.5" fill={PAPER} />
        <rect x="120.5" y="65" width="3.6" height="9" rx="1.5" fill={CAMERA} stroke="none" />
        <Limb d="M108 85.5 L 117.5 85.5 L 121.5 86.5" width={4.8} />
        <Limb d="M108 91 L 118 91 L 122 92" width={4.8} />
        <Limb d="M108 96.5 L 118 96.5 L 122 97.5" width={4.8} />
        <Limb d="M108 102 L 117 102 L 120.5 103" width={4.6} />
        <Sight from={[127, 69.5]} to={[[168, 84], [168, 118]]} />
        <Tick x={116} y={42} />
        {/* The near arm holds the cube and turns it with the thumb. */}
        <Limb d="M52 98 L 104 152 L 182 134" width={12} />
        <HoldingHand x={198} y={130} thumb="right" thumbClass="sg-push-left" />
      </Layer>
    </>
  )
}

export function Scene({ device }: { device: 'laptop' | 'phone' }) {
  return (
    <div className="sg-scene" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
      {device === 'laptop' ? <LaptopScene /> : <PhoneScene />}
      <Layer>
        <StepCount />
      </Layer>
    </div>
  )
}
