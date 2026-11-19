/**
 * Every page of the site, as an address without a language prefix. The build
 * reads this list to write each page out in every language.
 */
import { METHOD_IDS, stagesOf } from '../core/methods/index.ts'

export const PAGE_PATHS: string[] = [
  '/',
  '/solver',
  '/learn',
  '/learn/before-you-start',
  '/history',
  ...METHOD_IDS.flatMap((method) => [
    `/learn/${method}`,
    ...stagesOf(method).map((stage) => `/learn/${method}/${stage}`),
  ]),
]

/**
 * Pages that are written out like the rest but kept from search engines: what
 * they show is the visitor's own and exists only in their browser. `pageHead`
 * marks them, and a list made for search engines must leave them out.
 */
export const UNINDEXED_PATHS: readonly string[] = ['/history']
