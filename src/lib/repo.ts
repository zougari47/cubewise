/** Where the site's source lives on GitHub, and the links into it. */

import type { Locale } from '../i18n/locales.ts'

export const REPO_URL = 'https://github.com/zougari47/cubewise'
export const REPO_BRANCH = 'main'

/**
 * The file that holds the text of a method in a language, or of a page with a
 * text file of its own such as "Before you start", from the root of the
 * repository.
 */
export function sourcePath(locale: Locale, name: string): string {
  return `src/i18n/${locale}/${name}.ts`
}

/** The address on GitHub that opens a file of the repository for editing. */
export function editUrl(path: string): string {
  return `${REPO_URL}/edit/${REPO_BRANCH}/${path.split('/').map(encodeURIComponent).join('/')}`
}

/**
 * The address on GitHub that opens a new issue, with its title and its body
 * already filled in when they are given.
 */
export function newIssueUrl({ title, body }: { title?: string; body?: string } = {}): string {
  const query = Object.entries({ title, body })
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join('&')
  return `${REPO_URL}/issues/new${query && `?${query}`}`
}
