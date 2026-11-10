import { describe, expect, test } from 'vitest'
import {
  MOVE_CUBES,
  applyMoves,
  findUnsolvableReason,
  formatMoves,
  invertMoves,
  isSolved,
  parseMoves,
  randomCube,
  solvedCube,
} from './cubie.ts'
import { FACE_NORMALS, STICKER_PLACES, dot, stickerAt, turnClockwise } from './geometry.ts'
import { stickersFromCube } from './stickers.ts'
import { randomMoves, seededRandom } from './testing.ts'

// An independent model of the cube: 54 stickers as points in space, turned by
// rotating the points. It shares no tables with the move code, so agreement
// between the two checks the hand-written move and sticker tables.
function geometricStickers(moves: readonly number[]): number[] {
  let stickers = STICKER_PLACES.map((_, i) => Math.floor(i / 9))
  for (const move of moves) {
    const axis = FACE_NORMALS[Math.floor(move / 3)]
    for (let quarter = 0; quarter <= move % 3; quarter++) {
      const next = stickers.slice()
      STICKER_PLACES.forEach(({ place, normal }, i) => {
        if (dot(place, axis) !== 1) return
        const target = stickerAt(turnClockwise(place, axis), turnClockwise(normal, axis))
        if (target < 0) throw new Error('Sticker turned off the cube')
        next[target] = stickers[i]
      })
      stickers = next
    }
  }
  return stickers
}

describe('moves against the geometric model', () => {
  test('every single move matches', () => {
    for (let move = 0; move < 18; move++) {
      expect(stickersFromCube(applyMoves(solvedCube(), [move])), formatMoves([move])).toEqual(
        geometricStickers([move]),
      )
    }
  })

  test('random move sequences match', () => {
    const random = seededRandom(1)
    for (let n = 0; n < 200; n++) {
      const moves = randomMoves(random, 30)
      expect(stickersFromCube(applyMoves(solvedCube(), moves)), formatMoves(moves)).toEqual(
        geometricStickers(moves),
      )
    }
  })
})

describe('moves', () => {
  const repeat = (text: string, times: number) =>
    applyMoves(solvedCube(), Array.from({ length: times }, () => parseMoves(text)).flat())

  test('there are 18 of them', () => {
    expect(MOVE_CUBES).toHaveLength(18)
  })

  test('four quarter turns of a face return to solved', () => {
    for (let face = 0; face < 6; face++) {
      const quarter = face * 3
      expect(isSolved(applyMoves(solvedCube(), [quarter, quarter, quarter, quarter]))).toBe(true)
    }
  })

  test("R U R' U' returns to solved after exactly 6 repeats", () => {
    expect(isSolved(repeat("R U R' U'", 5))).toBe(false)
    expect(isSolved(repeat("R U R' U'", 6))).toBe(true)
  })

  test('R U returns to solved after exactly 105 repeats', () => {
    expect(isSolved(repeat('R U', 104))).toBe(false)
    expect(isSolved(repeat('R U', 105))).toBe(true)
  })
})

describe('notation', () => {
  const text = "R U2 F' D L2 B'"

  test('parses and formats back to the same text', () => {
    expect(formatMoves(parseMoves(text))).toBe(text)
    expect(parseMoves('  ')).toEqual([])
  })

  test('rejects unknown moves', () => {
    expect(() => parseMoves('R X')).toThrow()
    expect(() => parseMoves('R3')).toThrow()
  })

  test('inverts a sequence', () => {
    expect(formatMoves(invertMoves(parseMoves(text)))).toBe("B L2 D' F U2 R'")
  })

  test('a sequence followed by its inverse returns to solved', () => {
    const random = seededRandom(2)
    for (let n = 0; n < 50; n++) {
      const moves = randomMoves(random, 25)
      expect(isSolved(applyMoves(solvedCube(), [...moves, ...invertMoves(moves)]))).toBe(true)
    }
  })
})

describe('findUnsolvableReason', () => {
  test('accepts random cubes and scrambled cubes', () => {
    const random = seededRandom(3)
    for (let n = 0; n < 500; n++) {
      expect(findUnsolvableReason(randomCube(random))).toBeNull()
    }
    expect(findUnsolvableReason(applyMoves(solvedCube(), randomMoves(random, 40)))).toBeNull()
  })

  test('reports a twisted corner', () => {
    const cube = solvedCube()
    cube.co[0] = 1
    expect(findUnsolvableReason(cube)).toBe('twisted-corner')
  })

  test('reports a flipped edge', () => {
    const cube = solvedCube()
    cube.eo[3] = 1
    expect(findUnsolvableReason(cube)).toBe('flipped-edge')
  })

  test('reports two swapped pieces', () => {
    const cube = solvedCube()
    cube.ep[0] = 1
    cube.ep[1] = 0
    expect(findUnsolvableReason(cube)).toBe('swapped-pieces')
  })

  test('reports a piece that appears twice', () => {
    const cube = solvedCube()
    cube.cp[0] = 1
    expect(findUnsolvableReason(cube)).toBe('bad-pieces')
  })
})
