import { describe, expect, test } from 'vitest'
import { solvedCube } from '../../core/cube/cubie.ts'
import type { CubieCube } from '../../core/cube/cubie.ts'
import { rotateStickers } from '../../core/cube/orientation.ts'
import { cubeAfterSteps } from '../../core/cube/steps.ts'
import { stickersFromCube } from '../../core/cube/stickers.ts'
import { METHOD_IDS } from '../../core/methods/index.ts'
import { beforeYouStartText as text } from '../../i18n/en/before-you-start.ts'
import { BEFORE_YOU_START_CASES, PRACTICE_ROUND, PRACTICE_ROUNDS } from './before-you-start.ts'
import { after, lessonColours, lessonOrientation, lessonSteps } from './lessons.ts'

const GREY = '#a1a1aa'
const caseOf = (id: string) => BEFORE_YOU_START_CASES.find((lessonCase) => lessonCase.id === id)!
const ids = BEFORE_YOU_START_CASES.map((lessonCase) => lessonCase.id)

/**
 * The 54 stickers as the picture of a case draws them, after the first `done`
 * steps: a colour letter, or `.` for grey. The picture shows the top face
 * (0–8), the right face (9–17) and the front face (18–26), each read row by row.
 */
function drawn(id: string, done = 0): string[] {
  const lessonCase = caseOf(id)
  const steps = lessonSteps(lessonCase.sequence)
  const cube = cubeAfterSteps(lessonCase.start, steps, done)
  const hex = lessonColours(cube, lessonCase)
  const letters = stickersFromCube(cube).map((face, i) => (hex[i] === GREY ? '.' : 'YOGWRB'[face]))
  return rotateStickers(letters, lessonOrientation(lessonCase, steps, done))
}
const top = (stickers: string[]) => stickers.slice(0, 9).join('')
const right = (stickers: string[]) => stickers.slice(9, 18).join('')
const front = (stickers: string[]) => stickers.slice(18, 27).join('')
/** The colour letters of every sticker after `sequence` on a solved cube, all six faces. */
const coloursAfter = (sequence: string) => stickersFromCube(after(sequence)).map((face) => 'YOGWRB'[face])
const endOf = (id: string): CubieCube => {
  const steps = lessonSteps(caseOf(id).sequence)
  return cubeAfterSteps(caseOf(id).start, steps, steps.length)
}

describe('before you start', () => {
  test('is not a method', () => {
    expect(METHOD_IDS as readonly string[]).not.toContain('before-you-start')
  })

  test('every part has a title and words, and the parts show every case once', () => {
    for (const part of text.parts) {
      expect(part.title).not.toBe('')
      expect(part.body.length, part.title).toBeGreaterThan(0)
      expect(part.cases?.length ?? 0, part.title).toBeGreaterThan(0)
    }
    expect(new Set(ids).size).toBe(ids.length)
    expect(text.parts.flatMap((part) => part.cases ?? [])).toEqual(ids)
  })

  test('every case has a title and a description, and no text is left over', () => {
    expect(Object.keys(text.cases).sort()).toEqual([...ids].sort())
    for (const id of ids) {
      expect(text.cases[id].title, id).not.toBe('')
      expect(text.cases[id].body, id).not.toBe('')
    }
  })

  test('no text has an em dash', () => {
    expect(JSON.stringify(text)).not.toMatch(/—/)
  })

  test('every sequence uses only moves of one face', () => {
    for (const lessonCase of BEFORE_YOU_START_CASES) {
      for (const step of lessonSteps(lessonCase.sequence)) {
        expect(step.text, lessonCase.id).toMatch(/^[UDLRFB]['2]?$/)
      }
    }
  })

  test('the piece counts add up', () => {
    const cube = solvedCube()
    expect(text.parts[0].body.join(' ')).toMatch(/26 pieces.*There are 6\..*There are 12\..*There are 8\./)
    expect([cube.ep.length, cube.cp.length, 6 + cube.ep.length + cube.cp.length]).toEqual([12, 8, 26])
  })
})

describe('the pictures show what the text says', () => {
  test('pieces: a yellow and green edge, and a yellow, orange and green corner', () => {
    const stickers = drawn('pieces')
    expect(top(stickers)).toBe('....Y..YY')
    expect(right(stickers)).toBe('O...O....')
    expect(front(stickers)).toBe('.GG.G....')
  })

  test('hold: yellow on top, orange on the right, green at the front, centres only', () => {
    const stickers = drawn('hold')
    expect([top(stickers), right(stickers), front(stickers)]).toEqual(['....Y....', '....O....', '....G....'])
  })

  test('hidden: white on top, blue on the right, red at the front', () => {
    const stickers = drawn('hidden')
    expect([top(stickers), right(stickers), front(stickers)]).toEqual(['....W....', '....B....', '....R....'])
  })

  test('the faces: each pair is coloured and the pieces between them are grey', () => {
    expect([top(drawn('up-down')), right(drawn('up-down')), front(drawn('up-down'))]).toEqual([
      'YYYYYYYYY',
      'OOO.O.OOO',
      'GGG.G.GGG',
    ])
    expect([top(drawn('right-left')), right(drawn('right-left')), front(drawn('right-left'))]).toEqual([
      'Y.YYYYY.Y',
      'OOOOOOOOO',
      'G.GGGGG.G',
    ])
    expect([top(drawn('front-back')), right(drawn('front-back')), front(drawn('front-back'))]).toEqual([
      'YYY.Y.YYY',
      'O.OOOOO.O',
      'GGGGGGGGG',
    ])
  })

  test('the layers: the bottom rows match their centres, and the last layer is grey', () => {
    const first = drawn('first-layer')
    expect([top(first), right(first), front(first)]).toEqual(['....Y....', '....O.OOO', '....G.GGG'])
    const two = drawn('two-layers')
    expect([top(two), right(two), front(two)]).toEqual(['....Y....', '...OOOOOO', '...GGGGGG'])
  })
})

describe('the moves do what the text says', () => {
  test('the letters name the faces as the cube is held', () => {
    // Centres in U R F D L B order.
    const centres = stickersFromCube(solvedCube()).filter((_, i) => i % 9 === 4)
    expect(centres.map((face) => 'YOGWRB'[face]).join('')).toBe('YOGWRB')
    expect(text.parts[2].body[1]).toMatch(/U is the yellow face, D the white, F the green, B the blue, R the orange and L the red/)
  })

  test('R, R’ and R2: the second move undoes the first, and the cube ends a half turn away', () => {
    expect(caseOf('three-ways').sequence).toBe("R R' R2")
    expect(after("R R'")).toEqual(solvedCube())
    expect(endOf('three-ways')).toEqual(after('R2'))
    expect(after('R2 R2')).toEqual(solvedCube())
    expect(after('R R')).toEqual(after('R2'))
    expect(after("R' R'")).toEqual(after('R2'))
  })

  test('R sends the green stickers on the right of the front up to the top', () => {
    expect(caseOf('right').sequence).toBe('R')
    expect(front(drawn('right'))).toBe('GGGGGGGGG')
    const end = drawn('right', 1)
    expect(top(end)).toBe('YYGYYGYYG')
    expect(right(end)).toBe('OOOOOOOOO')
  })

  test('L sends the green stickers on the left of the front down, and yellow comes down from the top', () => {
    expect(caseOf('left').sequence).toBe('L')
    expect(front(drawn('left'))).toBe('GGGGGGGGG')
    expect(front(drawn('left', 1))).toBe('YGGYGGYGG')
    // The bottom face, read with the front nearest: its left column is now green.
    const bottom = coloursAfter('L').slice(27, 36)
    expect([bottom[0], bottom[3], bottom[6]]).toEqual(['G', 'G', 'G'])
  })

  test('D sends the bottom row of the front to the right, and U sends the top row to the left', () => {
    expect(caseOf('down').sequence).toBe('D')
    expect(right(drawn('down', 1))).toBe('OOOOOOGGG')
    // The left face: its top row is green after U.
    expect(coloursAfter('U').slice(36, 39)).toEqual(['G', 'G', 'G'])
    expect(right(coloursAfter('U'))).toBe('BBBOOOOOO')
  })

  test('B sends the orange stickers at the back of the right face to the back row of the top', () => {
    expect(caseOf('back').sequence).toBe('B')
    expect(top(drawn('back', 1))).toBe('OOOYYYYYY')
    expect(front(drawn('back', 1))).toBe('GGGGGGGGG')
  })

  test('the single moves start from a solved cube', () => {
    for (const id of ['three-ways', 'right', 'left', 'down', 'back', 'practice']) {
      expect(caseOf(id).start, id).toEqual(solvedCube())
    }
  })

  test('the practice sequence comes back to where it started after six times, and not before', () => {
    expect(PRACTICE_ROUND).toBe("R U R' U'")
    expect(text.parts[5].body.join(' ')).toContain('R U R’ U’')
    expect(text.parts[5].body.join(' ')).toContain('six times')
    expect(PRACTICE_ROUNDS).toBe(6)
    const rounds = (count: number) => after(Array(count).fill(PRACTICE_ROUND).join(' '))
    for (let count = 1; count < PRACTICE_ROUNDS; count++) {
      expect(rounds(count), `${count} times`).not.toEqual(solvedCube())
    }
    expect(rounds(PRACTICE_ROUNDS)).toEqual(solvedCube())
    expect(lessonSteps(caseOf('practice').sequence)).toHaveLength(24)
    expect(endOf('practice')).toEqual(solvedCube())
    // It is the same on a scrambled cube.
    const scramble = "F2 L' D B U2 R F'"
    expect(after(`${scramble} ${caseOf('practice').sequence}`)).toEqual(after(scramble))
  })
})
