/** The shape of the text every method needs, so each language file supplies the same pieces. */

export interface LessonText {
  /** What the cube looks like when the stage is finished. */
  goal: string
  /** What to do, in order. */
  steps: string[]
  /** A title and a description for each lesson case, by case id. */
  cases: Record<string, { title: string; body: string }>
  tip: string
}

export interface MethodText<Stage extends string = string> {
  /** As it is known: "Beginner method", "CFOP", "Roux". */
  name: string
  /** A few words on who it is for, shown as a badge: "Start here", "Speedsolving". */
  level: string
  /** One or two sentences saying what the method does, for the list of methods. */
  summary: string
  /** The opening paragraph of the method's own page. */
  lead: string
  /** Shown under the method in the solver: about how many moves, and what to expect. */
  solverHint: string
  /** Stage names never mention a colour. */
  stages: Record<Stage, { name: string; summary: string }>
  lessons: Record<Stage, LessonText>
}
