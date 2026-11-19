import { describe, expect, test } from 'vitest'
import { METHOD_IDS, stagesOf } from '../../core/methods/index.ts'
import { ar } from '../../i18n/ar.ts'
import { en } from '../../i18n/en.ts'
import { fr } from '../../i18n/fr.ts'
import type { Messages } from '../../i18n/en.ts'
import type { LessonText } from '../../i18n/method-text.ts'
import { BEFORE_YOU_START_CASES } from './before-you-start.ts'
import { beforeYouStartMarkdown, lessonMarkdown } from './lesson-markdown.ts'
import { lessonSteps } from './lessons.ts'
import type { LessonCase } from './lessons.ts'
import { LESSONS } from './lessons/index.ts'

const linkTo = (path: string) => `https://cubewise.example${path}`

/** A sequence as a lesson shows it. */
const shown = (sequence: string) =>
  lessonSteps(sequence)
    .map((step) => step.text)
    .join(' ')

/** What any copied lesson must be, whatever it is about. */
function expectSane(markdown: string, cases: readonly LessonCase[], where: string) {
  expect(markdown.trim(), where).not.toBe('')
  expect(markdown, where).toMatch(/^# \S/)
  expect(markdown.match(/^# /gm), where).toHaveLength(1)
  expect(markdown, where).not.toMatch(/undefined|\[object Object\]|NaN/)
  // No pictures, and nothing standing in for one.
  expect(markdown, where).not.toMatch(/!\[|<img|<svg/)
  // None of the invisible direction marks that `ltr` adds.
  expect(markdown, where).not.toMatch(/[\u2066-\u2069‎‏‪-‮]/)
  // Every block of code is closed, and no blank run is longer than one line.
  expect((markdown.match(/^```$/gm) ?? []).length % 2, where).toBe(0)
  expect(markdown, where).not.toMatch(/\n{3,}/)
  expect(markdown.endsWith('\n'), where).toBe(true)
  for (const lessonCase of cases) {
    if (lessonCase.sequence === '') continue
    expect(markdown, `${where} / ${lessonCase.id}`).toContain(
      `\`\`\`\n${shown(lessonCase.sequence)}\n\`\`\``,
    )
  }
}

describe.each([
  ['en', en],
  ['fr', fr],
  ['ar', ar],
] as [string, Messages][])('lessons as Markdown in %s', (locale, m) => {
  test('every lesson of every method comes out whole', () => {
    for (const method of METHOD_IDS) {
      for (const stage of stagesOf(method)) {
        const where = `${locale} ${method}/${stage}`
        const cases = LESSONS[method][stage]
        const lesson = (m.methods[method].lessons as Record<string, LessonText>)[stage]
        const markdown = lessonMarkdown({ m, method, stage, cases, linkTo })

        expectSane(markdown, cases, where)
        const name = (m.methods[method].stages as Record<string, { name: string }>)[stage].name
        expect(markdown.startsWith(`# ${name.replace(/[\u2066\u2069]/g, '')}\n`), where).toBe(true)
        expect(markdown, where).toContain(`## ${m.learn.lesson.goal}\n\n`)
        expect(markdown, where).toContain(`## ${m.learn.lesson.tip}\n\n`)
        // Every case is there once, under a heading of its own.
        expect(markdown.match(/^### /gm) ?? [], where).toHaveLength(cases.length)
        for (const part of lesson.parts ?? []) {
          expect(markdown.match(/^## \d+\. /gm), where).toHaveLength(lesson.parts!.length)
          expect(part.body.length, where).toBeGreaterThan(0)
        }
        if (lesson.steps && !lesson.parts) {
          expect(markdown.match(/^\d+\. /gm), where).toHaveLength(lesson.steps.length)
        }
        expect(markdown.trimEnd().endsWith(`<https://cubewise.example/learn/${method}/${stage}>`), where).toBe(true)
      }
    }
  })

  test('"Before you start" comes out whole', () => {
    const markdown = beforeYouStartMarkdown({ m, linkTo })
    expectSane(markdown, BEFORE_YOU_START_CASES, `${locale} before-you-start`)
    expect(markdown.match(/^### /gm)).toHaveLength(BEFORE_YOU_START_CASES.length)
    expect(markdown.match(/^## \d+\. /gm)).toHaveLength(m.learn.beforeYouStart.parts.length)
    expect(markdown).toContain('](https://cubewise.example/learn/beginner)')
    expect(markdown.trimEnd().endsWith('<https://cubewise.example/learn/before-you-start>')).toBe(true)
  })

  test('without addresses there are no links and no source line', () => {
    const lesson = lessonMarkdown({ m, method: 'beginner', stage: 'cross', cases: LESSONS.beginner.cross })
    const basics = beforeYouStartMarkdown({ m })
    for (const markdown of [lesson, basics]) {
      expect(markdown).not.toMatch(/\]\(|https?:/)
      expect(markdown).not.toContain(m.learn.lesson.markdownSource)
    }
  })
})

describe('lessonMarkdown', () => {
  test('writes a lesson told in steps', () => {
    const cases = LESSONS.beginner['first-layer-corners']
    const text = en.methods.beginner.lessons['first-layer-corners']
    const markdown = lessonMarkdown({ m: en, method: 'beginner', stage: 'first-layer-corners', cases, linkTo })
    const blocks = markdown.split('\n\n')

    expect(blocks.slice(0, 5)).toEqual([
      '# First-layer corners',
      '*Beginner method · Stage 2 of 7*',
      '## Goal',
      text.goal,
      '## How to do it',
    ])
    expect(blocks[5].split('\n')[0]).toBe(`1. ${text.steps![0]}`)
    const first = blocks.indexOf(`### ${text.cases.right.title}`)
    expect(blocks.slice(first, first + 3)).toEqual([
      `### ${text.cases.right.title}`,
      text.cases.right.body,
      `\`\`\`\n${shown(cases[0].sequence)}\n\`\`\``,
    ])
    expect(markdown).toContain(`## Tip\n\n${text.tip}\n`)
    expect(markdown).toContain('[“Before you start” explains the pieces, the faces and how to read moves.](https://cubewise.example/learn/before-you-start)')
  })

  test('a case with nothing to play has no block of code', () => {
    const markdown = lessonMarkdown({ m: en, method: 'beginner', stage: 'cross', cases: LESSONS.beginner.cross })
    const text = en.methods.beginner.lessons.cross.cases.daisy
    expect(markdown).toMatch(new RegExp(`### ${text.title}\\n\\n.*\\n\\n#`))
  })

  test('explains wide turns only where a sequence uses more than face moves', () => {
    const plain = lessonMarkdown({ m: en, method: 'beginner', stage: 'cross', cases: LESSONS.beginner.cross })
    expect(plain).toContain(en.learn.lesson.notation)
    expect(plain).not.toContain(en.learn.lesson.wideNotation)
    const stage = stagesOf('roux').find((id) =>
      LESSONS.roux[id].some((lessonCase) => /[Mr]/.test(lessonCase.sequence)),
    )!
    const wide = lessonMarkdown({ m: en, method: 'roux', stage, cases: LESSONS.roux[stage] })
    expect(wide).toContain(en.learn.lesson.wideNotation)
  })

  test('turns notation kept left-to-right in Arabic into inline code', () => {
    const markdown = beforeYouStartMarkdown({ m: ar })
    expect(ar.learn.beforeYouStart.cases.practice.title).toContain('\u2066R U R’ U’\u2069')
    expect(markdown).toContain('### `R U R’ U’`')
  })

  test('only takes the marks off other text kept left-to-right', () => {
    expect(ar.methods.petrus.stages['small-block'].name).toContain('\u20662×2×2\u2069')
    const markdown = lessonMarkdown({ m: ar, method: 'petrus', stage: 'small-block', cases: LESSONS.petrus['small-block'] })
    expect(markdown.split('\n')[0]).toMatch(/^# [^`\u2066\u2069]* 2×2×2$/)
  })
})
