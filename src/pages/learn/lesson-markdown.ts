/**
 * A lesson as Markdown, for copying: the same words and sequences the page
 * shows, in the language of the page, without the pictures. It is built from
 * the lesson cases and the site text, so a new lesson or an edited sentence
 * needs nothing here.
 */
import { stagesOf } from '../../core/methods/index.ts'
import type { MethodId } from '../../core/methods/index.ts'
import type { Messages } from '../../i18n/en.ts'
import type { LessonPart, LessonText, MethodText } from '../../i18n/method-text.ts'
import { BEFORE_YOU_START_CASES } from './before-you-start.ts'
import { lessonSteps } from './lessons.ts'
import type { LessonCase } from './lessons.ts'

/** The whole address of a page of the site in the lesson's language, from its address without a language prefix. */
export type LinkTo = (path: string) => string

type CaseText = Record<string, { title: string; body: string }>

/**
 * Text that `ltr` wrapped to keep it left-to-right. The invisible marks it
 * uses show up as stray boxes or warnings in plain editors, so they are taken
 * off. Notation becomes inline code instead, which keeps it apart from the
 * sentence just as well; anything else, such as 2×2×2, is left as it is.
 */
const ISOLATED = /\u2066([^\u2066\u2069]*)\u2069/g
const DIRECTION_MARKS = /[\u2066-\u2069]/g
const NOTATION = /^[UDLRFBMESxyzrudlfb][2'’]{0,2}([ ,]+[UDLRFBMESxyzrudlfb][2'’]{0,2})*$/

/** A piece of site text as it goes into Markdown. */
function plain(text: string): string {
  return text
    .replace(ISOLATED, (_, inner: string) => (NOTATION.test(inner) ? `\`${inner}\`` : inner))
    .replace(DIRECTION_MARKS, '')
    .trim()
}

/** A sequence as the page shows it, one step after another, in a block of its own. */
function sequenceBlock(sequence: string): string[] {
  const steps = lessonSteps(sequence)
  if (steps.length === 0) return []
  return [['```', steps.map((step) => step.text).join(' '), '```'].join('\n')]
}

/** One case: its name, its description and, when it has one, its sequence. */
function caseBlocks(lessonCase: LessonCase, text: CaseText, level: string): string[] {
  const { title, body } = text[lessonCase.id]
  return [`${level} ${plain(title)}`, plain(body), ...sequenceBlock(lessonCase.sequence)]
}

/** A lesson told in numbered parts, each followed by the cases it shows. */
function partBlocks(
  parts: readonly LessonPart[],
  cases: readonly LessonCase[],
  text: CaseText,
): string[] {
  return parts.flatMap((part, number) => [
    `## ${number + 1}. ${plain(part.title)}`,
    ...part.body.map(plain),
    ...(part.cases ?? []).flatMap((id) =>
      caseBlocks(cases.find((lessonCase) => lessonCase.id === id)!, text, '###'),
    ),
  ])
}

const link = (label: string, url: string) => `[${plain(label)}](${url})`

/** The closing line that says where the lesson comes from. */
const sourceLine = (m: Messages, url: string) => `${m.learn.lesson.markdownSource} <${url}>`

const document = (blocks: readonly string[]) => `${blocks.join('\n\n')}\n`

/**
 * The lesson for one stage of a method. The cases are handed in, not looked
 * up, so that "Before you start" does not download every method's lessons
 * with this file. With `linkTo`, the Markdown links to
 * the pages it mentions and ends with a line giving the lesson's own address.
 */
export function lessonMarkdown({
  m,
  method,
  stage,
  cases,
  linkTo,
}: {
  m: Messages
  method: MethodId
  stage: string
  /** The cases of that stage, from the method's lessons. */
  cases: readonly LessonCase[]
  linkTo?: LinkTo
}): string {
  const methodText: MethodText = m.methods[method]
  const lesson: LessonText = methodText.lessons[stage]
  const text = m.learn.lesson
  const pointer = m.learn.beforeYouStart.pointer
  const stages = stagesOf(method)
  const beyondFaces = cases.some((lessonCase) =>
    lessonSteps(lessonCase.sequence).some((step) => step.moves.length !== 1),
  )

  const body = lesson.parts
    ? partBlocks(lesson.parts, cases, lesson.cases)
    : [
        `## ${text.steps}`,
        (lesson.steps ?? []).map((step, number) => `${number + 1}. ${plain(step)}`).join('\n'),
        `## ${text.cases}`,
        ...cases.flatMap((lessonCase) => caseBlocks(lessonCase, lesson.cases, '###')),
      ]

  const notation = [
    text.notation,
    ...(beyondFaces ? [text.wideNotation] : []),
    pointer.question,
    linkTo ? link(pointer.link, linkTo('/learn/before-you-start')) : pointer.link,
  ]

  return document([
    `# ${plain(methodText.stages[stage].name)}`,
    `*${plain(methodText.name)} · ${text.stageOf(stages.indexOf(stage) + 1, stages.length)}*`,
    `## ${text.goal}`,
    plain(lesson.goal),
    ...body,
    `## ${text.tip}`,
    plain(lesson.tip),
    '---',
    notation.map(plain).join(' '),
    ...(linkTo ? [sourceLine(m, linkTo(`/learn/${method}/${stage}`))] : []),
  ])
}

/** The "Before you start" lesson. */
export function beforeYouStartMarkdown({ m, linkTo }: { m: Messages; linkTo?: LinkTo }): string {
  const text = m.learn.beforeYouStart
  return document([
    `# ${plain(text.name)}`,
    plain(text.lead),
    ...partBlocks(text.parts, BEFORE_YOU_START_CASES, text.cases),
    `## ${plain(text.next.heading)}`,
    plain(text.next.body),
    ...(linkTo
      ? [
          [
            `- ${link(text.next.action, linkTo('/learn/beginner'))}`,
            `- ${link(text.next.allMethods, linkTo('/learn'))}`,
          ].join('\n'),
          '---',
          sourceLine(m, linkTo('/learn/before-you-start')),
        ]
      : []),
  ])
}
