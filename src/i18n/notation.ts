/**
 * Keeps notation left-to-right inside right-to-left text. Without it the
 * apostrophe of a last turn such as U' jumps to the other end of the sequence.
 */
export const ltr = (notation: string) => `⁦${notation}⁩`
