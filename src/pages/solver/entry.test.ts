import { describe, expect, test } from 'vitest'
import { applyMoves, parseMoves, solvedCube } from '../../core/cube/cubie.ts'
import { frontFace } from '../../core/cube/orientation.ts'
import { stickersFromCube } from '../../core/cube/stickers.ts'
import {
  STANDARD_SCHEME,
  checkEntry,
  colourCounts,
  entryReducer,
  initialEntry,
  isSavedStickers,
} from './entry.ts'
import type { EntryAction, EntryState, Paint } from './entry.ts'

const run = (actions: EntryAction[], from: EntryState = initialEntry()) =>
  actions.reduce(entryReducer, from)

/** Sticker indexes of the F face, which starts at the front. */
const FRONT = 18


function stickersOf(scramble: string, scheme = STANDARD_SCHEME): Paint[] {
  const cube = applyMoves(solvedCube(), parseMoves(scramble))
  return stickersFromCube(cube).map((face) => scheme[face])
}

describe('a new entry', () => {
  test('has only the six centres painted, in the standard scheme', () => {
    const { stickers } = initialEntry()
    expect(stickers.filter((paint) => paint !== null)).toHaveLength(6)
    expect([4, 13, 22, 31, 40, 49].map((centre) => stickers[centre])).toEqual(STANDARD_SCHEME)
  })
})

describe('painting with the keyboard', () => {
  test('number then colour paints that sticker on the front face', () => {
    const state = run([
      { type: 'select', number: 3 },
      { type: 'paint', colour: 'R' },
    ])
    expect(state.stickers[FRONT + 2]).toBe('R')
  })

  test('after painting, the cursor moves to the next unpainted sticker', () => {
    const state = run([
      { type: 'paint', colour: 'R' },
      { type: 'paint', colour: 'B' },
      { type: 'paint', colour: 'G' },
      { type: 'paint', colour: 'Y' },
      // The centre (number 5) is already painted, so this lands on number 6.
      { type: 'paint', colour: 'O' },
    ])
    expect(state.stickers.slice(FRONT, FRONT + 9)).toEqual([
      'R', 'B', 'G', 'Y', 'G', 'O', null, null, null,
    ])
    expect(state.cursor).toBe(6)
  })

  test('the cursor stays put once the face is full', () => {
    const fill: EntryAction[] = Array.from({ length: 8 }, () => ({ type: 'paint', colour: 'W' }))
    const state = run(fill)
    expect(state.stickers.slice(FRONT, FRONT + 9).includes(null)).toBe(false)
    expect(run([{ type: 'paint', colour: 'Y' }], state).cursor).toBe(state.cursor)
  })

  test('the centre can be repainted for a cube with other colours', () => {
    const state = run([
      { type: 'select', number: 5 },
      { type: 'paint', colour: 'O' },
    ])
    expect(state.stickers[FRONT + 4]).toBe('O')
  })

  test('numbers outside 1–9 are ignored', () => {
    expect(run([{ type: 'select', number: 0 }]).cursor).toBe(0)
  })
})

describe('turning the cube', () => {
  test('numbers always mean the face now at the front', () => {
    const state = run([
      { type: 'turn', direction: 'right' },
      { type: 'select', number: 1 },
      { type: 'paint', colour: 'B' },
    ])
    expect(frontFace(state.orientation)).toBe(1)
    expect(state.stickers[9]).toBe('B')
  })

  test('the cursor starts at the first unpainted sticker of the new face', () => {
    const state = run([
      { type: 'paint-sticker', sticker: 9, colour: 'B' },
      { type: 'paint-sticker', sticker: 10, colour: 'B' },
      { type: 'turn', direction: 'right' },
    ])
    expect(state.cursor).toBe(2)
  })

  test('show-face jumps straight to a face', () => {
    expect(frontFace(run([{ type: 'show-face', face: 5 }]).orientation)).toBe(5)
  })
})

describe('correcting mistakes', () => {
  const painted = run([
    { type: 'paint', colour: 'R' },
    { type: 'paint', colour: 'B' },
  ])

  test('undo and redo step through the painted stickers', () => {
    const undone = run([{ type: 'undo' }], painted)
    expect(undone.stickers.slice(FRONT, FRONT + 2)).toEqual(['R', null])
    const redone = run([{ type: 'redo' }], undone)
    expect(redone.stickers.slice(FRONT, FRONT + 2)).toEqual(['R', 'B'])
  })

  test('undo with nothing to undo changes nothing', () => {
    const state = initialEntry()
    expect(run([{ type: 'undo' }], state)).toBe(state)
  })

  test('painting after an undo drops the redo history', () => {
    const state = run([{ type: 'undo' }, { type: 'paint', colour: 'G' }, { type: 'redo' }], painted)
    expect(state.future).toEqual([])
  })

  test('repainting a sticker the same colour adds no undo step', () => {
    const state = run([{ type: 'paint-sticker', sticker: FRONT, colour: 'R' }], painted)
    expect(state.past).toHaveLength(painted.past.length)
  })

  test('clear-face unpaints the front face but keeps its centre', () => {
    const state = run([{ type: 'clear-face' }], painted)
    expect(state.stickers.slice(FRONT, FRONT + 9)).toEqual([
      null, null, null, null, 'G', null, null, null, null,
    ])
    expect(run([{ type: 'undo' }], state).stickers).toEqual(painted.stickers)
  })

  test('reset goes back to a new entry, and can be undone', () => {
    const state = run([{ type: 'turn', direction: 'up' }, { type: 'reset' }], painted)
    expect(state.stickers).toEqual(initialEntry().stickers)
    expect(frontFace(state.orientation)).toBe(2)
    expect(run([{ type: 'undo' }], state).stickers).toEqual(painted.stickers)
  })
})

describe('saved stickers', () => {
  test('a saved set is loaded', () => {
    const stickers = stickersOf("R U R' U'")
    expect(run([{ type: 'load', stickers }]).stickers).toEqual(stickers)
  })

  test('damaged saved data is rejected', () => {
    expect(isSavedStickers(['W'])).toBe(false)
    expect(isSavedStickers(new Array(54).fill('X'))).toBe(false)
    expect(isSavedStickers('nonsense')).toBe(false)
    const state = initialEntry()
    expect(run([{ type: 'load', stickers: ['W'] }], state)).toBe(state)
  })
})

describe('filling the whole cube', () => {
  test('paints every sticker, shows the front again, and can be undone', () => {
    const before = run([
      { type: 'paint', colour: 'R' },
      { type: 'turn', direction: 'right' },
    ])
    const stickers = stickersOf("R U R' U'")
    const filled = run([{ type: 'fill', stickers }], before)
    expect(filled.stickers).toEqual(stickers)
    expect(frontFace(filled.orientation)).toBe(2)
    expect(run([{ type: 'undo' }], filled).stickers).toEqual(before.stickers)
  })

  test('rejects a damaged set', () => {
    const state = initialEntry()
    expect(run([{ type: 'fill', stickers: ['W'] }], state)).toBe(state)
  })
})

describe('colourCounts', () => {
  test('counts painted stickers per colour', () => {
    expect(colourCounts(initialEntry().stickers)).toEqual({ W: 1, Y: 1, R: 1, O: 1, B: 1, G: 1 })
    expect(colourCounts(stickersOf('R U F'))).toEqual({ W: 9, Y: 9, R: 9, O: 9, B: 9, G: 9 })
  })
})

describe('checkEntry', () => {
  test('lists unpainted stickers first', () => {
    const check = checkEntry(initialEntry().stickers)
    expect(check.ok).toBe(false)
    if (!check.ok) {
      expect(check.problem.code).toBe('unpainted')
      expect(check.problem).toHaveProperty('stickers.length', 48)
    }
  })

  test('returns the cube and the standard scheme for a scrambled cube', () => {
    const scramble = "R U2 F' D L2 B'"
    expect(checkEntry(stickersOf(scramble))).toEqual({
      ok: true,
      cube: applyMoves(solvedCube(), parseMoves(scramble)),
      scheme: STANDARD_SCHEME,
    })
  })

  test("returns the user's own colour scheme when centres differ", () => {
    const scheme = ['Y', 'G', 'R', 'W', 'B', 'O'] as const
    const check = checkEntry(stickersOf('R U', [...scheme]))
    expect(check).toMatchObject({ ok: true, scheme })
  })

  test('passes on problems found in the stickers', () => {
    const stickers = stickersOf('R U')
    stickers[13] = stickers[4]
    expect(checkEntry(stickers)).toEqual({
      ok: false,
      problem: { code: 'duplicate-centres', stickers: [4, 13] },
    })
  })
})
