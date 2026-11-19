/** The shape of the text every method needs, so each language file supplies the same pieces. */

/** One section of a lesson told in parts: a heading, a few short paragraphs, and the cases that show it. */
export interface LessonPart {
  title: string
  body: string[]
  /** Ids of the lesson cases shown under this part, in order. */
  cases?: string[]
}

export interface LessonText {
  /** What the cube looks like when the stage is finished. */
  goal: string
  /** What to do, in order, with the cases listed together after them. */
  steps?: string[]
  /**
   * The lesson told in parts instead, each with its own cases beside the
   * words that explain them. Every case must belong to exactly one part.
   */
  parts?: LessonPart[]
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
  /** The method as a stop on the home page's road map. */
  roadmap: {
    /** What the stop's picture shows, in a few words. */
    picture: string
    /** One or two sentences on what makes the method different from the others. */
    what: string
    /** One sentence on who should pick it. */
    pick: string
  }
  /** Stage names never mention a colour. */
  stages: Record<Stage, { name: string; summary: string }>
  lessons: Record<Stage, LessonText>
}
