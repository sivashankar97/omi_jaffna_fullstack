export const newsSections = [
  { id: "province-events", title: "Province events" },
  { id: "parish-events", title: "Parish events" },
  { id: "liturgical", title: "Liturgical celebrations" },
  { id: "formation", title: "Formation activities" },
  { id: "youth", title: "Youth events" },
  { id: "social", title: "Social initiatives" },
] as const

export type NewsSectionId = (typeof newsSections)[number]["id"]

export type NewsImage = {
  src: string
  alt: string
  caption: string
}

export type NewsArticle = {
  slug: string
  section: NewsSectionId
  title: string
  description: string
  dateLabel: string
  place: string
  cover: NewsImage
  paragraphs: string[]
  gallery: NewsImage[]
  sample?: boolean
}

export function newsSectionTitle(id: NewsSectionId) {
  return newsSections.find((section) => section.id === id)?.title ?? "News"
}
