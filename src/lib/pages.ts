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
  ...METHOD_IDS.flatMap((method) => [
    `/learn/${method}`,
    ...stagesOf(method).map((stage) => `/learn/${method}/${stage}`),
  ]),
]
