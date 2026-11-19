import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'
import { loadMessages } from '#/i18n'
import { localeOfPath } from '#/i18n/locales.ts'

// The prerendered page is already in its language. Its text is fetched before
// the page is taken over, because taking over does not run the root route's
// `beforeLoad` again, and every component reads the text straight away.
void loadMessages(localeOfPath(window.location.pathname)).then(() => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    )
  })
})
