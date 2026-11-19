import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '#/components/ui/popover'
import { LanguageMenu } from '#/components/language-menu.tsx'
import { ThemeToggle } from '#/components/theme-toggle.tsx'
import { useLocale, useM } from '#/i18n'
import { localeParam } from '#/i18n/locales.ts'

function Logo() {
  const colours = ['#dc2626', '#facc15', '#2563eb', '#16a34a', '#ffffff', '#f97316', '#2563eb', '#dc2626', '#16a34a']
  return (
    <span aria-hidden className="grid size-6 grid-cols-3 gap-px rounded-[5px] bg-zinc-900 p-0.5">
      {colours.map((colour, i) => (
        <span key={i} className="rounded-[1.5px]" style={{ backgroundColor: colour }} />
      ))}
    </span>
  )
}

export function SiteHeader() {
  const m = useM()
  // Given to every link here, because a page that was not found has no language of its own to pass on.
  const params = { locale: localeParam(useLocale()) }
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const linkClass =
    'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground'
  const menuLinkClass =
    'rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:text-foreground'
  // The menu is a popover anchored to the whole header, so it opens as a
  // full-width panel right under it and closes on an outside tap or Escape.
  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverAnchor asChild>
        <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link
              to="/{-$locale}"
              params={params}
              onClick={closeMenu}
              className="flex items-center gap-2 text-base font-semibold tracking-tight"
            >
              <Logo />
              {m.site.name}
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link to="/{-$locale}/solver" params={params} className={linkClass}>
                {m.site.nav.solver}
              </Link>
              <Link to="/{-$locale}/learn" params={params} className={linkClass}>
                {m.site.nav.learn}
              </Link>
              <Link to="/{-$locale}/history" params={params} className={linkClass}>
                {m.site.nav.history}
              </Link>
              <LanguageMenu className="ms-1" />
              <ThemeToggle className="ms-1" />
            </nav>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="sm:hidden"
                aria-label={menuOpen ? m.site.menu.close : m.site.menu.open}
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </PopoverTrigger>
          </div>
        </header>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        sideOffset={0}
        collisionPadding={0}
        className="w-screen gap-1 rounded-none border-b bg-background/85 px-4 py-3 shadow-none ring-0 backdrop-blur data-open:zoom-in-100 data-closed:zoom-out-100 sm:hidden"
      >
        <nav className="flex flex-col gap-1">
          <Link to="/{-$locale}/solver" params={params} className={menuLinkClass} onClick={closeMenu}>
            {m.site.nav.solver}
          </Link>
          <Link to="/{-$locale}/learn" params={params} className={menuLinkClass} onClick={closeMenu}>
            {m.site.nav.learn}
          </Link>
          <Link to="/{-$locale}/history" params={params} className={menuLinkClass} onClick={closeMenu}>
            {m.site.nav.history}
          </Link>
        </nav>
        <div className="mt-2 flex items-center justify-between border-t px-3 pt-3">
          <span className="text-sm font-medium text-muted-foreground">{m.site.language}</span>
          <LanguageMenu />
        </div>
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="text-sm font-medium text-muted-foreground">{m.site.theme.label}</span>
          <ThemeToggle />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function SiteFooter() {
  const m = useM()
  const params = { locale: localeParam(useLocale()) }
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <span>{m.site.footer}</span>
        <span>
          {m.site.builtBy}{' '}
          <a href="https://ahmedz.dev/" className="underline underline-offset-4 hover:text-foreground">
            {m.site.author}
          </a>
        </span>
        <nav className="flex gap-4">
          <Link to="/{-$locale}/solver" params={params} className="hover:text-foreground">
            {m.site.nav.solver}
          </Link>
          <Link to="/{-$locale}/learn" params={params} className="hover:text-foreground">
            {m.site.nav.learn}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
