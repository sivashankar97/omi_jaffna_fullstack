export type PriestPlace = "sri-lanka" | "abroad" | "out-of-province"

export type PriestPhoto = {
  src: string
  alt: string
  caption: string
}

export type Priest = {
  slug: string
  name: string
  place: PriestPlace
  role: string
  summary: string
  bio: string
  /** Birthday as stored in CMS (`YYYY-MM-DD` or `DD.MM.YYYY`). */
  born?: string
  image?: string
  gallery: PriestPhoto[]
}
