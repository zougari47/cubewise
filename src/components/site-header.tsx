import { Link } from '@tanstack/react-router'
import { m } from '#/i18n'

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
  const linkClass =
    'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground'
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Logo />
          {m.site.name}
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/solver" className={linkClass}>
            {m.site.nav.solver}
          </Link>
          <Link to="/learn" className={linkClass}>
            {m.site.nav.learn}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <span>{m.site.footer}</span>
        <nav className="flex gap-4">
          <Link to="/solver" className="hover:text-foreground">
            {m.site.nav.solver}
          </Link>
          <Link to="/learn" className="hover:text-foreground">
            {m.site.nav.learn}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
