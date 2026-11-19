import { GitHubIcon } from '#/components/github-icon.tsx'
import { Button } from '#/components/ui/button'
import { useM } from '#/i18n'

/** Asks whether something went wrong, and opens a new issue on GitHub about it. */
export function ReportIssue({ href }: { href: string }) {
  const m = useM()
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
      {m.solver.report.question}
      <Button asChild variant="outline" size="sm">
        <a href={href} target="_blank" rel="noopener noreferrer">
          <GitHubIcon />
          {m.solver.report.action}
        </a>
      </Button>
    </p>
  )
}
