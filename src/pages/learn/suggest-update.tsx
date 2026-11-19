import { cn } from 'cn'
import { GitHubIcon } from '#/components/github-icon.tsx'
import { Button } from '#/components/ui/button'
import { useLocale, useM } from '#/i18n'
import { editUrl, sourcePath } from '#/lib/repo.ts'
import type { TextName } from './text-source.ts'

/** Opens the text of the lesson being read, in the language it is read in, on GitHub, ready to edit. */
export function SuggestUpdate({ text, className }: { text: TextName; className?: string }) {
  const m = useM()
  const locale = useLocale()
  return (
    <Button asChild variant="ghost" className={cn('text-muted-foreground', className)}>
      <a href={editUrl(sourcePath(locale, text))} target="_blank" rel="noopener noreferrer">
        <GitHubIcon />
        {m.learn.suggestUpdate}
      </a>
    </Button>
  )
}
