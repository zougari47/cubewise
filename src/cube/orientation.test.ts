import { describe, expect, test } from 'vitest'
import {
  DEFAULT_ORIENTATION,
  frontFace,
  frontStickers,
  orientationShowing,
  turnCube,
} from './orientation.ts'
import type { TurnDirection } from './orientation.ts'

const [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5]
const faceStickers = (face: number) => Array.from({ length: 9 }, (_, i) => face * 9 + i)
const turned = (...directions: TurnDirection[]) => directions.reduce(turnCube, DEFAULT_ORIENTATION)

describe('turnCube', () => {
  test('starts with F at the front, read in the usual order', () => {
    expect(frontFace(DEFAULT_ORIENTATION)).toBe(F)
    expect(frontStickers(DEFAULT_ORIENTATION)).toEqual(faceStickers(F))
  })

  test.each([
    ['right', R],
    ['left', L],
    ['up', U],
    ['down', D],
  ] as const)('%s brings that face to the front, read in the usual order', (direction, face) => {
    const orientation = turned(direction)
    expect(frontFace(orientation)).toBe(face)
    expect(frontStickers(orientation)).toEqual(faceStickers(face))
  })

  test('two turns to the right show the back face', () => {
    expect(frontFace(turned('right', 'right'))).toBe(B)
    expect(frontStickers(turned('right', 'right'))).toEqual(faceStickers(B))
  })

  test('opposite turns cancel, and four turns come back round', () => {
    expect(turned('right', 'left')).toEqual(DEFAULT_ORIENTATION)
    expect(turned('up', 'down')).toEqual(DEFAULT_ORIENTATION)
    expect(turned('up', 'up', 'up', 'up')).toEqual(DEFAULT_ORIENTATION)
  })

  test('a face reached sideways from the top is read rotated', () => {
    // Top to the front, then the right face: R is seen with B above it and U
    // to its left, so its usual right column (stickers 11, 14, 17) is the top row.
    const orientation = turned('up', 'right')
    expect(frontFace(orientation)).toBe(R)
    expect(frontStickers(orientation)).toEqual([11, 14, 17, 10, 13, 16, 9, 12, 15])
  })
})

describe('orientationShowing', () => {
  test('shows each face in its usual reading order', () => {
    for (const face of [U, R, F, D, L, B]) {
      expect(frontFace(orientationShowing(face))).toBe(face)
      expect(frontStickers(orientationShowing(face))).toEqual(faceStickers(face))
    }
  })
})
