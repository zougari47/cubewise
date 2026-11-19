import { describe, expect, test } from 'vitest'
import {
  HISTORY_LIMIT,
  addSolve,
  historyText,
  moveCount,
  parseHistory,
  removeSolve,
  solutionText,
  stepsByStage,
  timeAgo,
} from './history.ts'
import type { NewSolve, SavedSolve } from './history.ts'

const SOLVED = 'WWWWWWWWW RRRRRRRRR GGGGGGGGG YYYYYYYYY OOOOOOOOO BBBBBBBBB'
/** The solved cube after U: the top row of each side face moves round. */
const AFTER_U = 'WWWWWWWWW BBBRRRRRR RRRGGGGGG YYYYYYYYY GGGOOOOOO OOOBBBBBB'

const short = (stickers = AFTER_U, solution = "U'"): NewSolve => ({
  stickers,
  method: 'short',
  solution,
  stages: [],
})

const beginner: NewSolve = {
  stickers: AFTER_U,
  method: 'beginner',
  solution: "x2 R U R' y U2",
  stages: [
    { stage: 'cross', count: 4 },
    { stage: 'first-layer-corners', count: 0 },
    { stage: 'middle-layer-edges', count: 2 },
  ],
}

/** A different cube for each number: the solved one with some centres recoloured in turn. */
const cube = (number: number) => {
  const keys = 'WYROBG'
  const faces = SOLVED.split(' ')
  const digits = [number % 6, Math.floor(number / 6) % 6, Math.floor(number / 36) % 6]
  digits.forEach((digit, face) => {
    faces[face] = faces[face].slice(0, 4) + keys[digit] + faces[face].slice(5)
  })
  return faces.join(' ')
}

describe('adding a solve', () => {
  test('puts the newest solve first', () => {
    let solves = addSolve([], short(cube(1)), 1000)
    solves = addSolve(solves, short(cube(2)), 2000)
    solves = addSolve(solves, short(cube(3)), 3000)
    expect(solves.map((solve) => solve.stickers)).toEqual([cube(3), cube(2), cube(1)])
    expect(solves.map((solve) => solve.solvedAt)).toEqual([3000, 2000, 1000])
  })

  test('keeps the cube, the method, the solution and the time', () => {
    const [solve] = addSolve([], beginner, 1234)
    expect(solve).toMatchObject({ ...beginner, solvedAt: 1234 })
    expect(solve.id).not.toBe('')
  })

  test('gives every solve an id of its own, even at the same instant', () => {
    let solves = addSolve([], short(cube(1)), 1000)
    solves = addSolve(solves, short(cube(2)), 1000)
    solves = addSolve(solves, short(cube(3)), 1000)
    expect(new Set(solves.map((solve) => solve.id)).size).toBe(3)
  })

  test('the same cube with the same method moves to the top instead of appearing twice', () => {
    let solves = addSolve([], short(cube(1)), 1000)
    const id = solves[0].id
    solves = addSolve(solves, short(cube(2)), 2000)
    solves = addSolve(solves, short(cube(1), 'U U U'), 3000)
    expect(solves).toHaveLength(2)
    expect(solves[0]).toMatchObject({ id, stickers: cube(1), solution: 'U U U', solvedAt: 3000 })
    expect(solves[1].stickers).toBe(cube(2))
  })

  test('the same cube with another method is a solve of its own', () => {
    const solves = addSolve(addSolve([], short(), 1000), beginner, 2000)
    expect(solves.map((solve) => solve.method)).toEqual(['beginner', 'short'])
  })

  test('a cube that was already solved is not kept', () => {
    const before = addSolve([], short(), 1000)
    expect(addSolve(before, short(SOLVED, ''), 2000)).toEqual(before)
    expect(addSolve([], { ...beginner, stickers: SOLVED, solution: '' }, 2000)).toEqual([])
  })

  test(`keeps the latest ${HISTORY_LIMIT} and drops the oldest`, () => {
    let solves: SavedSolve[] = []
    for (let i = 0; i < HISTORY_LIMIT + 5; i++) solves = addSolve(solves, short(cube(i)), i)
    expect(solves).toHaveLength(HISTORY_LIMIT)
    expect(solves[0].stickers).toBe(cube(HISTORY_LIMIT + 4))
    expect(solves.at(-1)?.stickers).toBe(cube(5))
    // Solving an old cube again makes room for nothing: the list stays full.
    solves = addSolve(solves, short(cube(5)), 9999)
    expect(solves).toHaveLength(HISTORY_LIMIT)
    expect(solves[0].stickers).toBe(cube(5))
    expect(solves.at(-1)?.stickers).toBe(cube(6))
  })

  test('does not change the list it was given', () => {
    const before = addSolve([], short(cube(1)), 1000)
    const copy = structuredClone(before)
    addSolve(before, short(cube(1)), 2000)
    addSolve(before, short(cube(2)), 2000)
    expect(before).toEqual(copy)
  })
})

describe('removing a solve', () => {
  test('takes out only the solve with that id', () => {
    const solves = addSolve(addSolve([], short(cube(1)), 1000), short(cube(2)), 2000)
    expect(removeSolve(solves, solves[0].id)).toEqual([solves[1]])
    expect(removeSolve(solves, 'no-such-id')).toEqual(solves)
  })
})

describe('reading the solution', () => {
  test('whole-cube turns are steps but not moves', () => {
    expect(moveCount(beginner)).toBe(4)
    expect(moveCount(short(AFTER_U, "R U2 F'"))).toBe(3)
  })

  test('a method solution is grouped by stage, a short solution is one group', () => {
    expect(stepsByStage(beginner)).toEqual([
      { stage: 'cross', steps: ['x2', 'R', 'U', "R'"] },
      { stage: 'first-layer-corners', steps: [] },
      { stage: 'middle-layer-edges', steps: ['y', 'U2'] },
    ])
    expect(stepsByStage(short(AFTER_U, "R U2 F'"))).toEqual([{ stage: null, steps: ['R', 'U2', "F'"] }])
  })

  test('is copied as one line, or one line per stage that has steps', () => {
    expect(solutionText(short(AFTER_U, "R U2 F'"), String)).toBe("R U2 F'")
    expect(solutionText(beginner, (stage) => stage.toUpperCase())).toBe(
      "CROSS: x2 R U R'\nMIDDLE-LAYER-EDGES: y U2",
    )
  })
})

describe('reading the history back', () => {
  const saved = addSolve(addSolve([], short(), 1000), beginner, 2000)

  test('gives back what was written', () => {
    expect(parseHistory(historyText(saved))).toEqual(saved)
    expect(parseHistory(historyText([]))).toEqual([])
  })

  test('nothing saved, or text that is not a list, is an empty history', () => {
    for (const text of [null, '', 'not json', '{"a":', 'null', '42', '"text"', '{}', '{"solves":[]}']) {
      expect(parseHistory(text)).toEqual([])
    }
  })

  test('leaves out what is not a usable solve and keeps the rest', () => {
    const [good] = saved
    const broken: unknown[] = [
      null,
      7,
      'solve',
      [],
      {},
      { ...good, id: '' },
      { ...good, id: 5 },
      { ...good, stickers: 'WWW' },
      { ...good, stickers: SOLVED.replace('W', '-') },
      { ...good, stickers: SOLVED.replace('W', 'X') },
      { ...good, stickers: undefined },
      { ...good, method: 'no-such-method' },
      { ...good, method: 'toString' },
      { ...good, solution: '' },
      { ...good, solution: ['R', 'U'] },
      { ...good, solvedAt: 'yesterday' },
      { ...good, solvedAt: null },
    ]
    const text = JSON.stringify([...broken.slice(0, 8), good, ...broken.slice(8), saved[1]])
    expect(parseHistory(text)).toEqual(saved)
  })

  test('shows a solve as a plain list of steps when its stages cannot be trusted', () => {
    const [solve] = saved
    const wrong: unknown[] = [
      'cross',
      [{ stage: 'cross', count: 1 }],
      [{ stage: 'a-stage-that-was-renamed', count: 6 }],
      [{ stage: 'cross', count: 3 }, { stage: 'cross', count: 3 }],
      [{ stage: 'cross', count: -1 }, { stage: 'middle-layer-edges', count: 7 }],
      [{ stage: 'cross' }],
      [null],
    ]
    for (const stages of wrong) {
      const [read] = parseHistory(JSON.stringify([{ ...solve, stages }]))
      expect(read).toEqual({ ...solve, stages: [] })
    }
    const [shortWithStages] = parseHistory(JSON.stringify([{ ...saved[1], stages: beginner.stages }]))
    expect(shortWithStages.stages).toEqual([])
  })

  test('drops what an older or newer version added, and tidies the spacing of the steps', () => {
    const [solve] = saved
    const [read] = parseHistory(JSON.stringify([{ ...solve, solution: `  ${solve.solution.replaceAll(' ', '  ')} `, extra: 1 }]))
    expect(read).toEqual(solve)
  })

  test('a repeated id or a repeated cube and method is read once', () => {
    const [first, second] = saved
    const text = JSON.stringify([first, { ...second, id: first.id }, { ...first, id: 'other' }, second])
    expect(parseHistory(text)).toEqual([first, second])
  })

  test(`reads no more than ${HISTORY_LIMIT} solves`, () => {
    const many = Array.from({ length: HISTORY_LIMIT + 20 }, (_, i) => ({
      ...short(cube(i)),
      id: `id${i}`,
      solvedAt: i,
    }))
    const read = parseHistory(JSON.stringify(many))
    expect(read).toHaveLength(HISTORY_LIMIT)
    expect(read[0].id).toBe('id0')
  })
})

describe('how long ago', () => {
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour

  test('uses the largest unit that fits', () => {
    const now = 1_000 * day
    expect(timeAgo(now - 30_000, now)).toEqual({ value: 0, unit: 'second' })
    expect(timeAgo(now - 5 * minute, now)).toEqual({ value: -5, unit: 'minute' })
    expect(timeAgo(now - 119 * minute, now)).toEqual({ value: -1, unit: 'hour' })
    expect(timeAgo(now - 2 * hour, now)).toEqual({ value: -2, unit: 'hour' })
    expect(timeAgo(now - 3 * day, now)).toEqual({ value: -3, unit: 'day' })
    expect(timeAgo(now - 65 * day, now)).toEqual({ value: -2, unit: 'month' })
    expect(timeAgo(now - 800 * day, now)).toEqual({ value: -2, unit: 'year' })
  })

  test('a time ahead of the clock counts as now', () => {
    expect(timeAgo(5000, 1000)).toEqual({ value: 0, unit: 'second' })
  })
})
