import { cn } from 'cn'
import githubMark from '#/assets/github.svg'

/**
 * The GitHub mark, drawn in the colour of the text around it: the file is
 * used as a mask over a block of the current colour, so it follows the theme.
 */
export function GitHubIcon({ className }: { className?: string }) {
  const mask = `url("${githubMark}") center / contain no-repeat`
  return (
    <span
      aria-hidden
      className={cn('inline-block size-4 shrink-0 bg-current', className)}
      style={{ mask, WebkitMask: mask }}
    />
  )
}
