/**
 * CFOP solver: solves a cube the way speedsolvers do, in four stages. The
 * cross and the first two layers are found by search, as a person finds them
 * by looking; the last layer is done with one taught sequence to orient it
 * and one to permute it.
 *
 * The cross is built on the face the user entered as the top one, so the
 * cube is first turned over to put that face at the bottom.
 */
import type { CubieCube } from '../../cube/cubie.ts'
import { DEFAULT_ORIENTATION, turnCubeAbout } from '../../cube/orientation.ts'
import { lastLayerFacesUp, permuteLastLayer } from '../shared/last-layer.ts'
import { solveInStages } from '../shared/method.ts'
import type { MethodSolution } from '../shared/method.ts'
import { blockSolver, findSequence } from '../shared/search.ts'
import { U_TURNS, parseTurns } from '../shared/turns.ts'
import type { Turn } from '../shared/turns.ts'
import { solvePairs } from './pairs.ts'
import { ORIENTATIONS } from './sequences.ts'
import { CFOP_STAGES } from './stages.ts'
import type { CfopStage } from './stages.ts'

export type CfopSolution = MethodSolution<CfopStage>

/** The entered top face goes to the bottom; the front stays at the front. */
const START = turnCubeAbout(DEFAULT_ORIENTATION, 'z', 2)

/** The cross, in the fewest moves. */
const solveCross = blockSolver({ pieces: { edges: [4, 5, 6, 7] } })

const ORIENTATION_TURNS = Object.values(ORIENTATIONS).map(parseTurns)

/** Turns every last-layer piece to face up: the top layer is lined up, then one of the 57 sequences. */
export function orientLastLayer(view: CubieCube): Turn[] {
  if (lastLayerFacesUp(view)) return []
  const turns = findSequence(view, {
    before: U_TURNS,
    sequences: ORIENTATION_TURNS,
    done: lastLayerFacesUp,
  })
  if (!turns) throw new Error('The last layer does not match any known case')
  return turns
}

/**
 * Solves `cube` with CFOP. Throws if the cube is not solvable.
 */
export function solveCfop(cube: CubieCube): CfopSolution {
  return solveInStages(cube, START, CFOP_STAGES, {
    cross: (view) => {
      const turns = solveCross(view)
      if (!turns) throw new Error('CFOP solver could not make the cross')
      return turns
    },
    'first-two-layers': (view) => solvePairs(view),
    'orient-last-layer': orientLastLayer,
    'permute-last-layer': permuteLastLayer,
  })
}
