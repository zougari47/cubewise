import { Check, Copy, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { useLocale, useM } from '#/i18n'
import { copyText } from '#/lib/clipboard.ts'
import { pageUrl } from '#/lib/seo.ts'
import type { LinkTo } from './lesson-markdown.ts'

/** How long the button says what happened before it offers to copy again. */
const SHOWN_FOR_MS = 2000

/**
 * Copies the lesson being read to the clipboard as Markdown. `markdown`
 * writes it, given how to make the whole address of a page in this language.
 */
export function CopyMarkdown({
  markdown,
  className,
}: {
  markdown: (linkTo: LinkTo) => string
  className?: string
}) {
  const m = useM()
  const locale = useLocale()
  const [outcome, setOutcome] = useState<'copied' | 'failed' | null>(null)
  const text = m.learn.lesson

  useEffect(() => {
    if (!outcome) return
    const timer = setTimeout(() => setOutcome(null), SHOWN_FOR_MS)
    return () => clearTimeout(timer)
  }, [outcome])

  const copy = async () => {
    // Without a published address, as in a local build, the one in the address bar stands in.
    const linkTo: LinkTo = (path) => new URL(pageUrl(path, locale), window.location.origin).href
    setOutcome((await copyText(markdown(linkTo))) ? 'copied' : 'failed')
  }

  return (
    <Button variant="outline" size="sm" onClick={copy} className={className}>
      {outcome === 'copied' ? <Check /> : outcome === 'failed' ? <X /> : <Copy />}
      <span aria-live="polite">
        {outcome === 'copied'
          ? text.markdownCopied
          : outcome === 'failed'
            ? text.markdownCopyFailed
            : text.copyMarkdown}
      </span>
    </Button>
  )
}
