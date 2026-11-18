import { useSyncExternalStore } from 'react'

/** What the visitor picked: follow the device, or always light or dark. */
export type ThemeChoice = 'system' | 'light' | 'dark'

export const THEME_CHOICES: ThemeChoice[] = ['system', 'light', 'dark']

const STORAGE_KEY = 'cubewise-theme'
const CHANGE_EVENT = 'cubewise-theme-change'
const DARK_QUERY = '(prefers-color-scheme: dark)'
/** The page background of each theme, for the browser's own bars. */
const BROWSER_BAR = { light: '#f8f9fd', dark: '#0d0f1a' }

/**
 * Runs in the page head before anything is drawn, so a stored choice never
 * flashes the wrong theme. It repeats the logic of `applyTheme` in plain
 * script because it runs before the app code has loaded.
 */
export const THEME_HEAD_SCRIPT = `(function(){try{var c=localStorage.getItem('${STORAGE_KEY}');var d=c==='dark'||(c!=='light'&&matchMedia('${DARK_QUERY}').matches);document.documentElement.classList.toggle('dark',d);var b=document.querySelector('meta[name="theme-color"]');if(b)b.content=d?'${BROWSER_BAR.dark}':'${BROWSER_BAR.light}'}catch(e){}})()`

function readChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
  return 'system'
}

function applyTheme(choice: ThemeChoice) {
  const dark = choice === 'dark' || (choice === 'system' && window.matchMedia(DARK_QUERY).matches)
  document.documentElement.classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? BROWSER_BAR.dark : BROWSER_BAR.light)
}

function subscribe(onChange: () => void) {
  const update = () => {
    applyTheme(readChoice())
    onChange()
  }
  const system = window.matchMedia(DARK_QUERY)
  system.addEventListener('change', update)
  window.addEventListener('storage', update)
  window.addEventListener(CHANGE_EVENT, update)
  return () => {
    system.removeEventListener('change', update)
    window.removeEventListener('storage', update)
    window.removeEventListener(CHANGE_EVENT, update)
  }
}

function setThemeChoice(choice: ThemeChoice) {
  try {
    if (choice === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // See readChoice.
  }
  applyTheme(choice)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** The visitor's theme choice, kept in local storage and shared between tabs. */
export function useThemeChoice() {
  const choice = useSyncExternalStore(subscribe, readChoice, (): ThemeChoice => 'system')
  return { choice, setChoice: setThemeChoice }
}
