import { BEGINNER_STAGES } from '../../../core/methods/beginner/stages.ts'
import { beginnerText } from '../../../i18n/en/beginner.ts'
import { describeLessons } from '../lesson-contract.ts'
import { BEGINNER_LESSONS } from './beginner.ts'

describeLessons('beginner', BEGINNER_STAGES, BEGINNER_LESSONS, beginnerText)
