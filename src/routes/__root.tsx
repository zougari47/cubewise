import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Direction } from 'radix-ui'
import { SiteFooter, SiteHeader } from '#/components/site-header.tsx'
import { Button } from '#/components/ui/button'
import { loadMessages, messagesFor, useLocale, useM } from '#/i18n'
import { directionOf, localeOfPath, localeParam } from '#/i18n/locales.ts'
import { THEME_HEAD_SCRIPT } from '#/lib/theme.ts'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  // The text of the page's language is brought in before any route reads it.
  beforeLoad: async ({ location }) => {
    const locale = localeOfPath(location.pathname)
    await loadMessages(locale)
    return { locale }
  },
  head: ({ match }) => {
    const m = messagesFor(match.context.locale)
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0d0f1a' },
        // What a page that sets no head of its own gets, such as "not found".
        { title: m.home.title },
        { name: 'description', content: m.site.description },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    }
  },
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    // Tells the menus and sliders which way the page's language runs.
    <Direction.Provider dir={directionOf(useLocale())}>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </Direction.Provider>
  )
}

function NotFound() {
  const m = useM()
  const locale = useLocale()
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{m.site.notFound.title}</h1>
      <p className="mt-3 text-muted-foreground">{m.site.notFound.body}</p>
      <Button asChild className="mt-6">
        <Link to="/{-$locale}" params={{ locale: localeParam(locale) }}>
          {m.site.notFound.action}
        </Link>
      </Button>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  return (
    // The server sends the dark theme; the head script then switches to the
    // visitor's choice before the page is drawn, hence the hydration allowance.
    <html lang={locale} dir={directionOf(locale)} className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_HEAD_SCRIPT }} />
      </head>
      <body>
        {children}
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
