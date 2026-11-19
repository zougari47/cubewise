/**
 * The languages of the site and how each appears in an address. English is
 * the default and has no prefix (`/learn`); the others have one (`/fr/learn`).
 */
export const LOCALES = ['en', 'fr', 'ar'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/** Each language by its own name, as the language menu shows it. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
}

/** The language and region that share cards are tagged with (`og:locale`). */
export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_GB',
  fr: 'fr_FR',
  ar: 'ar_AR',
}

const RTL: readonly Locale[] = ['ar']

export function isLocale(value: unknown): value is Locale {
  return (LOCALES as readonly unknown[]).includes(value)
}

export function directionOf(locale: Locale): 'ltr' | 'rtl' {
  return RTL.includes(locale) ? 'rtl' : 'ltr'
}

/** The `locale` route parameter of a language: nothing for the default one. */
export function localeParam(locale: Locale): Locale | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale
}

/** The language of a route's `locale` parameter. */
export function localeOfParam(param: string | undefined): Locale {
  return isLocale(param) ? param : DEFAULT_LOCALE
}

/** The language an address is in, from its prefix. */
export function localeOfPath(pathname: string): Locale {
  const first = pathname.split('/')[1]
  return isLocale(first) ? first : DEFAULT_LOCALE
}

/** An address without its language prefix: `/fr/learn` gives `/learn`. */
export function unlocalizedPath(pathname: string): string {
  const locale = localeOfPath(pathname)
  if (locale === DEFAULT_LOCALE && pathname.split('/')[1] !== DEFAULT_LOCALE) return pathname
  return pathname.slice(locale.length + 1) || '/'
}

/** The address of a page in a language: `/learn` in French is `/fr/learn`. */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}
