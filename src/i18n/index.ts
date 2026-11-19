/**
 * The text of the site in the language of the page. Each language is a file
 * of its own that is downloaded only when a page in that language is opened:
 * the root route loads it with `loadMessages` before anything is drawn, and
 * components then read it with `useM`.
 */
import { useRouteContext } from '@tanstack/react-router'
import type { Messages } from './en.ts'
import type { Locale } from './locales.ts'

export type { Messages }

const loaders: Record<Locale, () => Promise<Messages>> = {
  en: () => import('./en.ts').then((file) => file.en),
  fr: () => import('./fr.ts').then((file) => file.fr),
  ar: () => import('./ar.ts').then((file) => file.ar),
}

const loaded: Partial<Record<Locale, Messages>> = {}

/** Downloads the text of a language, once. */
export async function loadMessages(locale: Locale): Promise<Messages> {
  return (loaded[locale] ??= await loaders[locale]())
}

/** The text of a language that `loadMessages` has already brought in. */
export function messagesFor(locale: Locale): Messages {
  const messages = loaded[locale]
  if (!messages) throw new Error(`The text for "${locale}" is read before it is loaded`)
  return messages
}

/**
 * The language of the page being shown. It is what the root route worked out
 * in `beforeLoad`, not the address bar: on the way to a page in another
 * language the address changes first, before that language's text is in.
 */
export function useLocale(): Locale {
  return useRouteContext({ from: '__root__', select: (context) => context.locale })
}

/** The text of the site in the language of the page being shown. */
export function useM(): Messages {
  return messagesFor(useLocale())
}
