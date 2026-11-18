import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from 'cn'
import { m } from '#/i18n'
import { THEME_CHOICES, useThemeChoice } from '#/lib/theme.ts'

const ICONS = { system: Monitor, light: Sun, dark: Moon }

/** Three small buttons to pick the system, light or dark theme. */
export function ThemeToggle({ className }: { className?: string }) {
  const { choice, setChoice } = useThemeChoice()
  return (
    <div
      role="radiogroup"
      aria-label={m.site.theme.label}
      className={cn('flex items-center gap-0.5 rounded-full border p-0.5', className)}
    >
      {THEME_CHOICES.map((option) => {
        const Icon = ICONS[option]
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={choice === option}
            aria-label={m.site.theme[option]}
            title={m.site.theme[option]}
            onClick={() => setChoice(option)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-checked:bg-accent aria-checked:text-foreground"
          >
            <Icon className="size-4" />
          </button>
        )
      })}
    </div>
  )
}
