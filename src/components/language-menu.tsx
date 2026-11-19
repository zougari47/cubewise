import { Link } from '@tanstack/react-router'
import { Check, ChevronDown, Languages } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useLocale, useM } from '#/i18n'
import { cn } from '#/lib/utils'
import { LOCALES, LOCALE_NAMES, localeParam } from '#/i18n/locales.ts'

/** Opens the page being read in another language. Each language is shown by its own name. */
export function LanguageMenu({ className }: { className?: string }) {
  const m = useM()
  const current = useLocale()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={m.site.language}
          className={cn('group', className)}
        >
          <Languages />
          {LOCALE_NAMES[current]}
          <ChevronDown className="opacity-60 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <Link
              to="."
              params={{ locale: localeParam(locale) }}
              search={true}
              lang={locale}
              hrefLang={locale}
              aria-current={locale === current ? 'true' : undefined}
              className="justify-between"
            >
              {LOCALE_NAMES[locale]}
              {locale === current && <Check />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
