import { describe, expect, test } from 'vitest'
import { isSolved, randomCube, solvedCube } from '../../cube/cubie.ts'
import type { CubieCube } from '../../cube/cubie.ts'
import { cubeFaceSeenAs } from '../../cube/orientation.ts'
import { cubeAfterSteps } from '../../cube/steps.ts'
import { seededRandom } from '../../cube/testing.ts'
import { SEQUENCES as BEGINNER } from '../beginner/sequences.ts'
import { solveBeginner } from '../beginner/solver.ts'
import { countMoves } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { areSolved, countSolved } from '../shared/search.ts'
import { applyTurns, invertTurns, parseTurns, viewOf } from '../shared/turns.ts'
import { KEYHOLE_INSERTS, LAST_CORNERS } from './sequences.ts'
import { solveKeyhole } from './solver.ts'
import { KEYHOLE_STAGES } from './stages.ts'
import type { KeyholeStage } from './stages.ts'

const BOTTOM = [4, 5, 6, 7]
const MIDDLE = [8, 9, 10, 11]
const TOP = [0, 1, 2, 3]

const allSteps = (solution: MethodSolution) => solution.stages.flatMap((stage) => stage.steps)
const movesOf = (solution: MethodSolution, stages: readonly string[]) =>
  solution.stages
    .filter((stage) => stages.includes(stage.stage))
    .reduce((sum, stage) => sum + stage.steps.filter((step) => step.moves.length > 0).length, 0)

/** The cube that `sequence` solves, held the usual way. */
const before = (sequence: string) => applyTurns(solvedCube(), invertTurns(parseTurns(sequence)))

/** What one stage of a solution tells the user to do. */
const texts = (stage: KeyholeStage, solution: MethodSolution<KeyholeStage>) =>
  solution.stages.find((entry) => entry.stage === stage)!.steps.map((step) => step.text)

describe('solveKeyhole', () => {
  test('solves random cubes, in fewer moves than the beginner method', () => {
    const random = seededRandom(60)
    const count = 300
    let total = 0
    let longest = 0
    let beginnerTotal = 0
    let firstTwoLayers = 0
    let beginnerFirstTwoLayers = 0
    for (let n = 0; n < count; n++) {
      const cube = randomCube(random)
      const solution = solveKeyhole(cube)
      const steps = allSteps(solution)
      expect(isSolved(cubeAfterSteps(cube, steps, steps.length))).toBe(true)
      const moves = countMoves(solution)
      total += moves
      longest = Math.max(longest, moves)
      firstTwoLayers += movesOf(solution, ['three-corners', 'keyhole-edges', 'last-corner'])

      const beginner = solveBeginner(cube)
      beginnerTotal += countMoves(beginner)
      beginnerFirstTwoLayers += movesOf(beginner, ['first-layer-corners', 'middle-layer-edges'])
    }
    console.log(
      `keyhole: average ${(total / count).toFixed(1)} moves, longest ${longest}; ` +
        `beginner on the same cubes: average ${(beginnerTotal / count).toFixed(1)}. ` +
        `Corners and middle-layer edges: keyhole ${(firstTwoLayers / count).toFixed(1)}, ` +
        `beginner ${(beginnerFirstTwoLayers / count).toFixed(1)}`,
    )
    expect(longest).toBeLessThan(190)
    expect(total).toBeLessThan(beginnerTotal)
    expect(firstTwoLayers / count).toBeLessThan(beginnerFirstTwoLayers / count - 8)
  })

  test('lists the eight stages in order', () => {
    const solution = solveKeyhole(randomCube(seededRandom(61)))
    expect(solution.stages.map((stage) => stage.stage)).toEqual([...KEYHOLE_STAGES])
  })

  test('a solved cube needs no steps', () => {
    expect(allSteps(solveKeyhole(solvedCube()))).toEqual([])
  })

  test('starts with the entered top face at the bottom and the front unchanged', () => {
    const { start } = solveKeyhole(solvedCube())
    expect(cubeFaceSeenAs(start, 3)).toBe(0)
    expect(cubeFaceSeenAs(start, 2)).toBe(2)
  })

  test('refuses an unsolvable cube', () => {
    const cube = solvedCube()
    cube.co[0] = 1
    expect(() => solveKeyhole(cube)).toThrow(/twisted-corner/)
  })

  test('each stage reaches its goal and keeps the earlier ones', () => {
    // Piece numbers on the cube as entered: its top layer is solved first.
    const first = [0, 1, 2, 3]
    const middle = [8, 9, 10, 11]
    const last = [4, 5, 6, 7]
    const checks: ((cube: CubieCube) => boolean)[] = [
      (cube) => areSolved(cube, { edges: first }),
      (cube) => countSolved(cube, { corners: first }) >= 3,
      (cube) => areSolved(cube, { edges: middle }),
      (cube) => areSolved(cube, { corners: first }),
      (cube) => last.every((i) => cube.eo[i] === 0),
      (cube) => areSolved(cube, { edges: last }),
      (cube) => last.every((i) => cube.cp[i] === i),
      (cube) => isSolved(cube),
    ]

    const random = seededRandom(62)
    for (let n = 0; n < 100; n++) {
      const cube = randomCube(random)
      const solution = solveKeyhole(cube)
      const steps = allSteps(solution)
      let count = 0
      solution.stages.forEach((stage, index) => {
        count += stage.steps.length
        const reached = cubeAfterSteps(cube, steps, count)
        for (let earlier = 0; earlier <= index; earlier++) {
          expect(checks[earlier](reached), `${stage.stage} / check ${earlier + 1}`).toBe(true)
        }
      })
    }
  })

  test('the cross takes at most 8 moves and never turns the whole cube', () => {
    const random = seededRandom(63)
    for (let n = 0; n < 100; n++) {
      const cross = solveKeyhole(randomCube(random)).stages[0].steps
      expect(cross.length).toBeLessThanOrEqual(8)
      expect(cross.every((step) => step.moves.length === 1)).toBe(true)
    }
  })

  test('each stage after the cross uses only its taught sequences and adjusting turns', () => {
    const facesOf = (sequences: readonly string[]) => sequences.flatMap((s) => s.split(' ').map((t) => t[0]))
    const allowed: Partial<Record<KeyholeStage, Set<string>>> = {
      'three-corners': new Set([
        'y',
        'U',
        ...facesOf([BEGINNER.cornerFacingRight, BEGINNER.cornerFacingFront, BEGINNER.cornerFacingUp]),
      ]),
      'keyhole-edges': new Set(['y', 'U', 'D', ...facesOf(Object.values(KEYHOLE_INSERTS))]),
      'last-corner': new Set(['y', 'U', ...facesOf(Object.values(LAST_CORNERS))]),
      'last-layer-cross': new Set(['U', ...facesOf([BEGINNER.lastLayerCross])]),
      'last-layer-edges': new Set(['U', ...facesOf([BEGINNER.lastLayerEdges])]),
      'last-layer-corner-positions': new Set(['y', ...facesOf([BEGINNER.lastLayerCornerCycle])]),
      'last-layer-corner-twists': new Set(['U', ...facesOf([BEGINNER.lastLayerCornerTwist])]),
    }
    const random = seededRandom(64)
    for (let n = 0; n < 60; n++) {
      for (const stage of solveKeyhole(randomCube(random)).stages) {
        const faces = allowed[stage.stage]
        if (!faces) continue
        for (const step of stage.steps) expect(faces.has(step.text[0]), `${stage.stage}: ${step.text}`).toBe(true)
      }
    }
  })

  test('the last corner takes one sequence, after holding the cube and turning the top', () => {
    const sequences = Object.values(LAST_CORNERS)
    const random = seededRandom(66)
    const used = new Set<string>()
    for (let n = 0; n < 150; n++) {
      const solution = solveKeyhole(randomCube(random))
      const text = texts('last-corner', solution).join(' ')
      if (text === '') continue
      // The top turn may have joined the first move of the sequence, so compare what they do.
      const stage = solution.stages.find((entry) => entry.stage === 'last-corner')!
      expect(stage.steps.filter((step) => step.moves.length > 0).length).toBeLessThanOrEqual(10)
      const match = sequences.find((sequence) =>
        ['', 'U ', "U' ", 'U2 '].some((top) =>
          ['', 'y ', "y' ", 'y2 '].some(
            (hold) => tidied(hold + top + sequence) === text,
          ),
        ),
      )
      expect(match, text).toBeDefined()
      used.add(match!)
    }
    expect(used.size).toBe(sequences.length)
  })
})

/** Notation with top turns that follow each other joined, as the solver writes it. */
function tidied(text: string): string {
  const joined: string[] = []
  const quarters = (turn: string) => (turn.endsWith('2') ? 2 : turn.endsWith("'") ? 3 : 1)
  for (const turn of text.trim().split(/\s+/)) {
    const previous = joined.at(-1)
    if (previous === undefined || previous[0] !== turn[0]) {
      joined.push(turn)
      continue
    }
    joined.pop()
    const sum = (quarters(previous) + quarters(turn)) % 4
    if (sum !== 0) joined.push(turn[0] + ['', '', '2', "'"][sum])
  }
  return joined.join(' ')
}

describe('keyhole sequences', () => {
  const others = { corners: [5, 6, 7], edges: [...BOTTOM, 9, 10, 11] }

  test('the right-hand inserts fill the front-right place and change only it, the keyhole and the top layer', () => {
    for (const name of ['rightFromFront', 'rightFromSide'] as const) {
      const start = before(KEYHOLE_INSERTS[name])
      expect(areSolved(start, others), name).toBe(true)
      // The edge waits in the top layer; another piece is in its place.
      expect(start.ep[8], name).not.toBe(8)
      expect(isSolved(applyTurns(start, KEYHOLE_INSERTS[name])), name).toBe(true)
    }
    const front = before(KEYHOLE_INSERTS.rightFromFront)
    // Flip 0 at the top front shows the front colour on top; flip 1 at the top right shows the right colour on top.
    expect([front.ep[1], front.eo[1]]).toEqual([8, 0])
    const side = before(KEYHOLE_INSERTS.rightFromSide)
    expect([side.ep[0], side.eo[0]]).toEqual([8, 1])
  })

  test('the left-hand inserts are their mirror images at the front left', () => {
    const kept = { corners: [4, 6, 7], edges: [...BOTTOM, 8, 10, 11] }
    for (const name of ['leftFromFront', 'leftFromSide'] as const) {
      const start = before(KEYHOLE_INSERTS[name])
      expect(areSolved(start, kept), name).toBe(true)
      expect(start.ep[9], name).not.toBe(9)
      expect(isSolved(applyTurns(start, KEYHOLE_INSERTS[name])), name).toBe(true)
    }
    const front = before(KEYHOLE_INSERTS.leftFromFront)
    expect([front.ep[1], front.eo[1]]).toEqual([9, 0])
    const side = before(KEYHOLE_INSERTS.leftFromSide)
    expect([side.ep[2], side.eo[2]]).toEqual([9, 1])
  })

  test('an insert only works with the keyhole below: it takes the corner under the place away', () => {
    for (const [name, corner] of [
      ['rightFromFront', 4],
      ['rightFromSide', 4],
      ['leftFromFront', 5],
      ['leftFromSide', 5],
    ] as const) {
      const reached = applyTurns(solvedCube(), KEYHOLE_INSERTS[name])
      expect(reached.cp[corner], name).not.toBe(corner)
      expect(countSolved(reached, { corners: BOTTOM }), name).toBe(3)
      expect(areSolved(reached, { edges: BOTTOM }), name).toBe(true)
      expect(countSolved(reached, { edges: MIDDLE }), name).toBe(3)
    }
  })

  test('the last-corner sequences start from the case they are named for and keep the two layers', () => {
    // Twist 1 of the corner above its place shows the first-layer colour on the right, 2 on the front;
    // in its place it is the other way round.
    const cases = {
      facingRight: { position: 0, twist: 1 },
      facingFront: { position: 0, twist: 2 },
      facingUp: { position: 0, twist: 0 },
      twistedFacingRight: { position: 4, twist: 2 },
      twistedFacingFront: { position: 4, twist: 1 },
    } as const
    const kept = { corners: [5, 6, 7], edges: [...BOTTOM, ...MIDDLE] }
    for (const [name, { position, twist }] of Object.entries(cases)) {
      const sequence = LAST_CORNERS[name as keyof typeof LAST_CORNERS]
      const start = before(sequence)
      expect(areSolved(start, kept), name).toBe(true)
      expect([start.cp[position], start.co[position]], name).toEqual([4, twist])
      expect(isSolved(applyTurns(start, sequence)), name).toBe(true)
    }
  })

  test('the last-corner set is complete: every place and twist of the last corner is solved', () => {
    const sequences = Object.values(LAST_CORNERS)
    const done = (cube: CubieCube) => areSolved(cube, { corners: BOTTOM, edges: [...BOTTOM, ...MIDDLE] })
    for (const position of [...TOP, 4]) {
      for (let twist = 0; twist < 3; twist++) {
        if (position === 4 && twist === 0) continue
        const cube = solvedCube()
        const other = position === 4 ? 0 : position
        if (position !== 4) {
          cube.cp[position] = 4
          cube.cp[4] = position
        }
        cube.co[position] = twist
        if (position === 4) cube.co[other] = (3 - twist) % 3
        const solved = ['', 'U', "U'", 'U2'].some((top) =>
          sequences.some((sequence) => done(applyTurns(applyTurns(cube, top), sequence))),
        )
        expect(solved, `position ${position}, twist ${twist}`).toBe(true)
      }
    }
  })

  test('the keyhole set is complete: any middle-layer edge in the top layer goes in with one insert', () => {
    // Every top place and flip, for the front-right edge with the keyhole below it.
    const inserts = [KEYHOLE_INSERTS.rightFromFront, KEYHOLE_INSERTS.rightFromSide]
    for (const position of TOP) {
      for (let flip = 0; flip < 2; flip++) {
        const cube = solvedCube()
        cube.ep[position] = 8
        cube.ep[8] = position
        cube.eo[position] = flip
        const solved = ['', 'U', "U'", 'U2'].some((top) =>
          inserts.some((insert) => {
            const end = applyTurns(applyTurns(cube, top), insert)
            return areSolved(end, { corners: [5, 6, 7], edges: [...BOTTOM, ...MIDDLE] })
          }),
        )
        expect(solved, `position ${position}, flip ${flip}`).toBe(true)
      }
    }
  })

  test('solves cubes whose middle-layer edges are all stuck in wrong places', () => {
    // Two layers solved, then the middle-layer edges moved round or flipped where they are.
    for (const scramble of ["R2 U2 R2 U2 R2", "R U R' U' F' U' F U R U' R' U' F' U F", "F2 U2 F2 U2 F2 R2 U2 R2 U2 R2"]) {
      const cube = applyTurns(solvedCube(), scramble)
      const held = viewOf(cube, solveKeyhole(cube).start)
      expect(countSolved(held, { edges: MIDDLE })).toBeLessThan(4)
      const solution = solveKeyhole(cube)
      const steps = allSteps(solution)
      expect(isSolved(cubeAfterSteps(cube, steps, steps.length))).toBe(true)
    }
  })
})
