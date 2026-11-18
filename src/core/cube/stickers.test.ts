import { describe, expect, test } from 'vitest'
import { applyMoves, parseMoves, randomCube, solvedCube } from './cubie.ts'
import { cubeFromStickers, stickersFromCube } from './stickers.ts'
import { seededRandom } from './testing.ts'

const SOLVED = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'

const asLetters = (stickers: readonly number[]) => stickers.map((face) => 'URFDLB'[face]).join('')

/** A solved cube with some stickers repainted. */
function repainted(changes: Record<number, string>): string[] {
  const stickers = SOLVED.split('')
  for (const [index, colour] of Object.entries(changes)) stickers[Number(index)] = colour
  return stickers
}

/** A solved cube with two stickers exchanged. */
function exchanged(a: number, b: number): string[] {
  return repainted({ [a]: SOLVED[b], [b]: SOLVED[a] })
}

describe('stickersFromCube', () => {
  test('a solved cube has one colour per face', () => {
    expect(asLetters(stickersFromCube(solvedCube()))).toBe(SOLVED)
  })

  test('turning R moves the right column of each neighbouring face', () => {
    const cube = applyMoves(solvedCube(), parseMoves('R'))
    expect(asLetters(stickersFromCube(cube))).toBe(
      'UUFUUFUUFRRRRRRRRRFFDFFDFFDDDBDDBDDBLLLLLLLLLUBBUBBUBB',
    )
  })
})

describe('cubeFromStickers', () => {
  test('reads a solved cube as solved', () => {
    expect(cubeFromStickers(SOLVED)).toEqual({ ok: true, cube: solvedCube() })
  })

  test('random cubes survive a round trip through stickers', () => {
    const random = seededRandom(10)
    for (let n = 0; n < 500; n++) {
      const cube = randomCube(random)
      expect(cubeFromStickers(stickersFromCube(cube))).toEqual({ ok: true, cube })
    }
  })

  test('any colour scheme works, because centres decide the colours', () => {
    const cube = applyMoves(solvedCube(), parseMoves("R U2 F' D L2 B'"))
    const colours = ['pink', 'white', 'green', 'yellow', 'orange', 'blue']
    const stickers = stickersFromCube(cube).map((face) => colours[face])
    expect(cubeFromStickers(stickers)).toEqual({ ok: true, cube })
  })
})

describe('cubeFromStickers entry mistakes', () => {
  const errorOf = (stickers: ArrayLike<unknown>) => {
    const result = cubeFromStickers(stickers)
    return result.ok ? null : result.error
  }

  test('wrong number of stickers', () => {
    expect(errorOf(SOLVED.slice(1))).toEqual({ code: 'wrong-sticker-count' })
  })

  test('two centres with the same colour', () => {
    expect(errorOf(repainted({ 13: 'U' }))).toEqual({
      code: 'duplicate-centres',
      stickers: [4, 13],
    })
  })

  test('a colour that no centre has', () => {
    expect(errorOf(repainted({ 0: 'X', 20: '?' }))).toEqual({
      code: 'unknown-colour',
      stickers: [0, 20],
    })
  })

  test('a colour that does not appear nine times', () => {
    expect(errorOf(repainted({ 9: 'U' }))).toEqual({
      code: 'wrong-colour-count',
      counts: [10, 8, 9, 9, 9, 9],
    })
  })

  test('a corner with opposite colours on it', () => {
    expect(errorOf(exchanged(9, 27))).toEqual({
      code: 'impossible-piece',
      stickers: [8, 9, 20],
    })
  })

  test('an edge with the same colour on both sides', () => {
    expect(errorOf(exchanged(10, 7))).toEqual({
      code: 'impossible-piece',
      stickers: [5, 10],
    })
  })

  test('a piece entered twice', () => {
    // Corner UFL is painted as a second URF, and edge UR as a second UL so
    // that every colour still appears nine times.
    expect(errorOf(repainted({ 18: 'R', 38: 'F', 10: 'L' }))).toEqual({
      code: 'duplicate-piece',
      stickers: [8, 9, 20, 6, 18, 38],
    })
  })

  test('a corner twisted in place', () => {
    const cube = solvedCube()
    cube.co[0] = 1
    expect(errorOf(stickersFromCube(cube))).toEqual({ code: 'twisted-corner' })
  })

  test('an edge flipped in place', () => {
    const cube = solvedCube()
    cube.eo[0] = 1
    expect(errorOf(stickersFromCube(cube))).toEqual({ code: 'flipped-edge' })
  })

  test('two pieces swapped', () => {
    const cube = solvedCube()
    cube.ep[0] = 1
    cube.ep[1] = 0
    expect(errorOf(stickersFromCube(cube))).toEqual({ code: 'swapped-pieces' })
  })
})
