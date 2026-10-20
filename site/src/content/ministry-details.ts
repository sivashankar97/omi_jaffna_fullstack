export type MinistryStory = {
  heading: string
  paragraphs: string[]
}

export type MinistryDetail = {
  tagline: string
  overview: string[]
  focus: string[]
  highlights: { value: string; label: string }[]
  scripture?: { text: string; reference: string }
  /** "History & details" on the ministry page; when present it replaces the overview there. */
  stories: MinistryStory[]
}

/** Shape of a ministry page's text; the text itself is edited on each ministry in the CMS. */
export const emptyMinistryDetail: MinistryDetail = { tagline: "", overview: [], focus: [], highlights: [], stories: [] }

export const ministryStorySource =
  "Pathinathan Sathiyaseelan, OMI, “Present Ministries of the Oblates of Mary Immaculate in Jaffna Province”"
