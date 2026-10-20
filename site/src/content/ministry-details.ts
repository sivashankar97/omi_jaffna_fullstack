export type MinistryDetail = {
  tagline: string
  overview: string[]
  focus: string[]
  highlights: { value: string; label: string }[]
  scripture?: { text: string; reference: string }
}

/** Shape of a ministry's popup text; the text itself is edited on each ministry in the CMS. */
export const emptyMinistryDetail: MinistryDetail = { tagline: "", overview: [], focus: [], highlights: [] }
