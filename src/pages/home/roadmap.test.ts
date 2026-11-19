import { describe, expect, test } from 'vitest'
import { METHOD_IDS } from '../../core/methods/index.ts'
import { en } from '../../i18n/en.ts'
import { ROADMAP, roadmapColours, roadmapStops } from './roadmap.ts'

describe('the road map', () => {
  test('has every method once, steps before choices', () => {
    const stops = roadmapStops()
    expect(stops.map((stop) => stop.method).sort()).toEqual([...METHOD_IDS].sort())
    expect(stops.map((stop) => stop.method)).toEqual([
      'beginner',
      'keyhole',
      'cfop',
      'roux',
      'zz',
      'petrus',
    ])
    const kinds = stops.map((stop) => stop.kind)
    expect(kinds.lastIndexOf('step')).toBeLessThan(kinds.indexOf('choice'))
  })

  test('numbers the steps in order and gives every choice the number after them', () => {
    expect(roadmapStops().map((stop) => stop.number)).toEqual([1, 2, 3, 3, 3, 3])
  })

  test('says where the road starts, where it forks, and which stops are alternatives', () => {
    expect(roadmapStops().map((stop) => stop.lead)).toEqual(['start', 'next', 'fork', 'or', 'or', 'or'])
  })

  test('runs forwards on even rows and back on odd rows, turning between them', () => {
    const stops = roadmapStops()
    expect(stops.map((stop) => [stop.row, stop.column])).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 1],
      [2, 1],
      [2, 2],
    ])
    expect(stops.map((stop) => stop.turnsAfter)).toEqual([false, true, false, true, false, false])
    expect(stops.map((stop) => stop.isLast)).toEqual([false, false, false, false, false, true])
  })

  test('places a method added later without a turn after the last stop', () => {
    const methods = ['beginner', 'cfop', 'roux'] as const
    const stops = roadmapStops(methods)
    expect(stops.map((stop) => stop.lead)).toEqual(['start', 'fork', 'or'])
    expect(stops.map((stop) => [stop.row, stop.column])).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ])
    expect(stops.map((stop) => stop.turnsAfter)).toEqual([false, true, false])
  })

  test('gives the move count the solver hint gives', () => {
    for (const method of METHOD_IDS) {
      expect(en.methods[method].solverHint, method).toContain(`About ${ROADMAP[method].moves} moves`)
    }
  })

  test('pictures each method with its centres and some, but not all, pieces coloured', () => {
    const grey = roadmapColours('beginner')[0]
    for (const method of METHOD_IDS) {
      const colours = roadmapColours(method)
      expect(colours).toHaveLength(54)
      const coloured = colours.filter((colour) => colour !== grey).length
      expect(coloured, method).toBeGreaterThan(6)
      expect(coloured, method).toBeLessThan(54)
    }
  })
})
