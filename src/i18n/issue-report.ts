/**
 * What a new issue about the solver starts with: room to describe it, then
 * what the page knows. English in every language, because maintainers read it.
 */
export function issueReportBody({
  stickers,
  method,
  problem,
}: {
  stickers: string
  method: string
  problem?: string
}): string {
  return [
    'What went wrong?',
    '',
    '',
    '',
    '---',
    `Entered colours (U R F D L B): ${stickers}`,
    `Method: ${method}`,
    ...(problem ? [`Problem shown: ${problem}`] : []),
  ].join('\n')
}
