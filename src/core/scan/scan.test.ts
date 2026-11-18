import { describe, expect, test } from 'vitest'
import { randomCube } from '../cube/cubie.ts'
import { cubeFromStickers, stickersFromCube } from '../cube/stickers.ts'
import { seededRandom } from '../cube/testing.ts'
import { cheapestPairing, guessCube, nameCentres } from './classify.ts'
import { colourDistance, hexToRgb, rgbToHex, rgbToLab } from './colour.ts'
import type { Rgb } from './colour.ts'
import { findFace } from './detect.ts'
import { GUIDE, faceChange, sampleFace, steadyColours } from './sample.ts'
import { SCAN_FACES, SCAN_STICKERS, placeScan } from './sequence.ts'

/** How each colour usually looks to a camera; colour `n` belongs to face `n` (U R F D L B). */
const USUAL: Rgb[] = [
  [215, 215, 210], // white
  [190, 40, 45], // red
  [40, 155, 80], // green
  [215, 200, 50], // yellow
  [230, 110, 40], // orange
  [35, 85, 175], // blue
]

const clamp = (value: number) => Math.max(0, Math.min(255, value))

/**
 * Scans a random cube the way the page does and returns how many of the 54
 * stickers were guessed wrong. Every face is lit a little differently.
 */
function scan(seed: number, look: (colour: Rgb) => Rgb, noise: number): number {
  const random = seededRandom(seed)
  const truth = stickersFromCube(randomCube(random))
  const read = new Array<Rgb>(54)
  for (const stickers of SCAN_STICKERS) {
    const light = 0.8 + random() * 0.3
    for (const sticker of stickers) {
      read[sticker] = look(USUAL[truth[sticker]]).map((value) =>
        clamp(value * light + (random() - 0.5) * 2 * noise),
      ) as Rgb
    }
  }
  return guessCube(read).filter((face, sticker) => face !== truth[sticker]).length
}

describe('colours', () => {
  test('white and black are the ends of lightness, with no hue', () => {
    const white = rgbToLab([255, 255, 255])
    expect(white[0]).toBeCloseTo(100, 1)
    expect(Math.hypot(white[1], white[2])).toBeLessThan(0.01)
    expect(rgbToLab([0, 0, 0])[0]).toBeCloseTo(0, 5)
  })

  test('a shadowed red is nearer to red than to orange', () => {
    const red = rgbToLab([185, 40, 45])
    const orange = rgbToLab([225, 105, 40])
    const darkRed = rgbToLab([130, 28, 32])
    expect(colourDistance(darkRed, red)).toBeLessThan(colourDistance(darkRed, orange))
  })

  test('hex colours convert both ways', () => {
    expect(hexToRgb('#f97316')).toEqual([249, 115, 22])
    expect(rgbToHex([249, 115, 22])).toBe('#f97316')
  })
})

describe('the scan sequence', () => {
  test('shows every face once, starting with the front', () => {
    expect(SCAN_FACES[0]).toBe(2)
    expect([...SCAN_FACES].sort()).toEqual([0, 1, 2, 3, 4, 5])
  })

  test('fills every sticker exactly once, with each centre in the middle cell', () => {
    expect(SCAN_STICKERS.flat().sort((a, b) => a - b)).toEqual(Array.from({ length: 54 }, (_, i) => i))
    SCAN_STICKERS.forEach((stickers, step) => expect(stickers[4]).toBe(SCAN_FACES[step] * 9 + 4))
  })

  test('places captured faces in sticker order', () => {
    const placed = placeScan(SCAN_STICKERS)
    expect(placed).toEqual(Array.from({ length: 54 }, (_, i) => i))
  })
})

describe('guessing the whole cube', () => {
  test('gets every sticker when the camera sees the usual colours', () => {
    for (let seed = 1; seed <= 200; seed++) expect(scan(seed, (colour) => colour, 8), `seed ${seed}`).toBe(0)
  })

  test('does not depend on the colour of the light', () => {
    // A warm lamp: everything redder and much less blue.
    const warm = (colour: Rgb): Rgb => [clamp(colour[0] * 1.08 + 12), colour[1] * 0.9, colour[2] * 0.55]
    const cool = (colour: Rgb): Rgb => [colour[0] * 0.85, colour[1] * 0.95, clamp(colour[2] * 1.15 + 10)]
    const dim = (colour: Rgb): Rgb => colour.map((value) => value * 0.55) as Rgb
    for (let seed = 1; seed <= 100; seed++) {
      expect(scan(seed, warm, 8), `warm, seed ${seed}`).toBe(0)
      expect(scan(seed, cool, 8), `cool, seed ${seed}`).toBe(0)
      expect(scan(seed, dim, 8), `dim, seed ${seed}`).toBe(0)
    }
  })

  test('tells red from orange when the camera sees them nearly alike', () => {
    // Orange pulled most of the way to red.
    const close = (colour: Rgb): Rgb => (colour === USUAL[4] ? [215, 80, 42] : colour)
    let wrong = 0
    for (let seed = 1; seed <= 200; seed++) wrong += scan(seed, close, 8)
    expect(wrong / 200).toBeLessThan(0.1)
  })

  test('always answers with real pieces, each used once, even from nonsense', () => {
    const random = seededRandom(3)
    for (let round = 0; round < 20; round++) {
      const read = Array.from({ length: 54 }, () => [random() * 255, random() * 255, random() * 255] as Rgb)
      const result = cubeFromStickers(guessCube(read))
      const pieceError = !result.ok && ['impossible-piece', 'duplicate-piece', 'wrong-colour-count'].includes(result.error.code)
      expect(pieceError).toBe(false)
    }
  })

  test('names the centres, each with a different colour', () => {
    const dim = USUAL.map((colour) => colour.map((value) => value * 0.6) as Rgb)
    expect(nameCentres([dim[3], dim[0], dim[5], dim[1], dim[4], dim[2]], USUAL)).toEqual([3, 0, 5, 1, 4, 2])
    const same = nameCentres(USUAL.map(() => USUAL[1]), USUAL)
    expect(new Set(same).size).toBe(6)
  })

  test('pairs rows and columns at the least total cost', () => {
    expect(
      cheapestPairing([
        [4, 1, 3],
        [2, 0, 5],
        [3, 2, 2],
      ]),
    ).toEqual([1, 0, 2])
  })
})

describe('reading a face from a picture', () => {
  /** A square picture with a 3×3 face drawn inside the guide, with dark borders. */
  function picture(size: number, cells: Rgb[], glare = false) {
    const data = new Uint8ClampedArray(size * size * 4)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = ((x + 0.5) / size - GUIDE.x) / GUIDE.size
        const v = ((y + 0.5) / size - GUIDE.y) / GUIDE.size
        let colour: Rgb = [90, 90, 90]
        if (u >= 0 && u < 1 && v >= 0 && v < 1) {
          const col = Math.floor(u * 3)
          const row = Math.floor(v * 3)
          const inCellX = u * 3 - col
          const inCellY = v * 3 - row
          const edge = Math.min(inCellX, 1 - inCellX, inCellY, 1 - inCellY)
          colour = edge < 0.12 ? [10, 10, 10] : cells[row * 3 + col]
          // A small white reflection near the middle of every sticker.
          if (glare && Math.hypot(inCellX - 0.45, inCellY - 0.45) < 0.07) colour = [255, 255, 255]
        }
        data.set([...colour, 255], (y * size + x) * 4)
      }
    }
    return { data, width: size, height: size }
  }

  const cells: Rgb[] = [...USUAL, USUAL[0], USUAL[1], USUAL[2]]

  test('reads the nine stickers in reading order, without the borders', () => {
    const samples = sampleFace(picture(240, cells))
    samples.forEach((sample, i) => {
      expect(sample.colour).toEqual(cells[i])
      expect(sample.spread).toBe(0)
    })
  })

  test('leaves glare out of the reading', () => {
    const samples = sampleFace(picture(240, cells, true))
    samples.forEach((sample, i) => expect(sample.colour).toEqual(cells[i]))
  })

  test('reports a high spread when the face is not lined up', () => {
    const shifted = sampleFace(picture(240, cells), { ...GUIDE, x: GUIDE.x + GUIDE.size / 6 })
    expect(Math.max(...shifted.map((sample) => sample.spread))).toBeGreaterThan(30)
  })

  test('measures how much a face changed between two readings', () => {
    const before = sampleFace(picture(240, cells))
    const after = sampleFace(picture(240, [...cells.slice(0, 8), [0, 0, 0]]))
    expect(faceChange(before, before)).toBe(0)
    expect(faceChange(before, after)).toBeGreaterThan(100)
  })

  test('takes the middle of several readings, ignoring one bad frame', () => {
    const good = sampleFace(picture(240, cells))
    const bad = sampleFace(picture(240, cells.map(() => [255, 255, 255] as Rgb)))
    expect(steadyColours([good, bad, good, good, good])).toEqual(cells)
  })
})

describe('finding a face in a picture', () => {
  /**
   * A square picture of a room with a cube face in it.
   * @param gap how much of each sticker's edge is dark; 0 for a cube with no borders
   */
  function room(size: number, face: { x: number; y: number; size: number } | null, cells: Rgb[], gap: number, seed = 1) {
    const random = seededRandom(seed)
    const data = new Uint8ClampedArray(size * size * 4)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // A plain wall, a little darker towards one corner, with camera noise.
        const shade = 150 - (60 * (x + y)) / (2 * size)
        let colour: Rgb = [shade, shade * 0.95, shade * 0.9]
        if (face) {
          const u = (x + 0.5 - face.x) / face.size
          const v = (y + 0.5 - face.y) / face.size
          if (u >= 0 && u < 1 && v >= 0 && v < 1) {
            const col = Math.floor(u * 3)
            const row = Math.floor(v * 3)
            const inCellX = u * 3 - col
            const inCellY = v * 3 - row
            const edge = Math.min(inCellX, 1 - inCellX, inCellY, 1 - inCellY)
            colour = edge < gap ? [15, 15, 15] : cells[row * 3 + col]
          }
        }
        data.set([...colour.map((value) => clamp(value + (random() - 0.5) * 10)), 255], (y * size + x) * 4)
      }
    }
    return { data, width: size, height: size }
  }

  const mixed: Rgb[] = [USUAL[1], USUAL[0], USUAL[2], USUAL[3], USUAL[4], USUAL[5], USUAL[2], USUAL[1], USUAL[0]]
  const places = [
    { x: 20, y: 30, size: 60 },
    { x: 70, y: 10, size: 84 },
    { x: 8, y: 52, size: 100 },
    { x: 95, y: 95, size: 48 },
    { x: 15, y: 12, size: 132 },
  ]

  const expectFound = (picture: ReturnType<typeof room>, face: { x: number; y: number; size: number }, label: string) => {
    const found = findFace(picture)
    expect(found, label).not.toBeNull()
    if (!found) return
    // Within a sixth of a sticker of the truth.
    const slack = face.size / 18
    expect(Math.abs(found.x * picture.width - face.x), `${label} x`).toBeLessThan(slack)
    expect(Math.abs(found.y * picture.height - face.y), `${label} y`).toBeLessThan(slack)
    expect(Math.abs(found.size * picture.width - face.size), `${label} size`).toBeLessThan(2 * slack)
  }

  test('finds a cube with dark borders wherever it is held', () => {
    places.forEach((face, i) => expectFound(room(160, face, mixed, 0.1, i + 1), face, `place ${i}`))
  })

  test('finds a cube with no borders between its stickers', () => {
    places.forEach((face, i) => expectFound(room(160, face, mixed, 0, i + 1), face, `place ${i}`))
  })

  test('the stickers read from the found square are the right colours', () => {
    const face = places[1]
    const picture = room(240, { x: face.x * 1.5, y: face.y * 1.5, size: face.size * 1.5 }, mixed, 0.1)
    const found = findFace(room(160, face, mixed, 0.1))
    expect(found).not.toBeNull()
    sampleFace(picture, found!).forEach((sample, cell) => {
      expect(Math.hypot(...sample.colour.map((value, c) => value - mixed[cell][c]))).toBeLessThan(12)
    })
  })

  test('finds a face of one colour by its dark borders', () => {
    const face = places[0]
    expectFound(room(160, face, mixed.map(() => USUAL[5]), 0.1), face, 'one colour')
  })

  test('finds nothing in an empty room or in noise', () => {
    expect(findFace(room(160, null, mixed, 0))).toBeNull()
    const random = seededRandom(9)
    const data = new Uint8ClampedArray(160 * 160 * 4).map(() => random() * 255)
    expect(findFace({ data, width: 160, height: 160 })).toBeNull()
  })

  test('is quick enough to run on every reading', () => {
    const picture = room(160, places[2], mixed, 0.1)
    const started = performance.now()
    for (let i = 0; i < 10; i++) findFace(picture)
    expect((performance.now() - started) / 10).toBeLessThan(40)
  })
})
