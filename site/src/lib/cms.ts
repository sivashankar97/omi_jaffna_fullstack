import { cache } from "react"

import { anchorId } from "@/config/navigation"
import { homeContent } from "@/content/home"
import { mapLocations as builtInMapLocations, type MapKind, type MapLocation } from "@/content/map-locations"
import { newsArticles as builtInNews, newsSections, type NewsArticle, type NewsSectionId } from "@/content/news"
import { priests as builtInPriests, type Priest, type PriestPlace } from "@/content/priests"
import {
  council as builtInCouncil,
  formationAbroad as builtInFormationAbroad,
  formationHouses as builtInFormationHouses,
  formerProvincials as builtInFormerProvincials,
  ministries as builtInMinistries,
  missionCountries as builtInMissionCountries,
  parishes as builtInParishes,
  recentGatherings as builtInGatherings,
  timeline as builtInTimeline,
} from "@/content/province"

const API_ORIGIN = process.env.API_ORIGIN ?? process.env.URL ?? "http://localhost:4000"
const TIME_ZONE = "Asia/Colombo"

type CmsType =
  | "page"
  | "ministry"
  | "parish"
  | "news"
  | "event"
  | "timeline"
  | "leadership"
  | "formation"
  | "international"
  | "publication"
  | "location"
  | "priest"

export type CmsItem = {
  id: string
  type: CmsType
  slug: string
  title: string
  excerpt: string
  body: string
  location_text: string
  image_url: string
  media_url: string
  event_date: string | null
  featured: boolean
  sort_order: number
  published_at: string | null
  last_verified_at: string | null
  meta: Record<string, unknown>
}

export type Ministry = { number: string; title: string; place: string; summary: string; image?: string }
export type Parish = { name: string; place: string }
export type TimelineEntry = { year: string; text: string }
export type CouncilMember = { role: string; name: string }
export type FormerProvincial = { name: string; dates: string }
export type FormationHouse = { name: string; place: string }
export type Publication = { id: string; title: string; subtitle: string; text: string; href?: string }
export type Gathering = {
  id: string
  title: string
  dateLabel: string
  place: string
  summary: string
  year: number
  month: number
  day: number
  endYear: number
  endMonth: number
  endDay: number
  face: string
  ink: string
}
export type Leadership = {
  superior: { name: string; term: string; summary: string } | null
  council: CouncilMember[]
}
export type HomeContent = {
  hero: { eyebrow: string; title: string; tagline: string; years: string; quote: string; lede: string }
  welcome: string[]
}
export type CharismContent = {
  kicker: string
  title: string
  summary: string
  ways: string[]
  aboutHeading: string
  about: string[]
  arrival: string
  mission: string
}

/** Published items of one type, or null when the CMS is unreachable. */
const fetchItems = cache(async (type: CmsType): Promise<CmsItem[] | null> => {
  try {
    const response = await fetch(`${API_ORIGIN}/api/public/items?type=${type}&lang=en`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    })
    if (!response.ok) return null
    const data = (await response.json()) as { items: CmsItem[] }
    return data.items
  } catch {
    return null
  }
})

/** CMS items when at least one is published, otherwise the site's built-in content. */
async function fromCms<T>(
  type: CmsType,
  map: (items: CmsItem[]) => T,
  fallback: T,
  include: (item: CmsItem) => boolean = () => true
): Promise<T> {
  const items = (await fetchItems(type))?.filter(include)
  return items && items.length > 0 ? map(items) : fallback
}

const text = (item: CmsItem | undefined, key: string) => {
  const value = item?.meta[key]
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : ""
}

const list = (item: CmsItem | undefined, key: string) => {
  const value = item?.meta[key]
  return Array.isArray(value) ? value.map(String).map((line) => line.trim()).filter(Boolean) : []
}

const dateParts = (value: string) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(value))
  const part = (name: string) => Number(parts.find((p) => p.type === name)?.value)
  return { year: part("year"), month: part("month") - 1, day: part("day") }
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "long", year: "numeric" }).format(
    new Date(value)
  )

const formatMonth = (value: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, month: "long", year: "numeric" }).format(new Date(value))

const paragraphs = (value: string) =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

/** CMS titles are often "Name — District"; the site shows the two parts separately. */
const splitTitle = (title: string) => {
  const [name, district = ""] = title.split(/\s+—\s+/)
  return { name: name.trim(), district: district.trim() }
}

export const getMinistries = () =>
  fromCms<Ministry[]>(
    "ministry",
    (items) =>
      items.map((item, index) => ({
        number: String(item.sort_order || index + 1).padStart(2, "0"),
        title: item.title,
        place: item.location_text,
        summary: item.excerpt,
        image: item.image_url || undefined,
      })),
    [...builtInMinistries]
  )

export const getParishes = () =>
  fromCms<Parish[]>(
    "parish",
    (items) => items.map((item) => ({ name: item.title, place: item.location_text })),
    [...builtInParishes]
  )

export const getTimeline = () =>
  fromCms<TimelineEntry[]>(
    "timeline",
    (items) =>
      items
        .map((item) => ({ year: text(item, "date_display") || item.title, text: item.excerpt || item.body || item.title }))
        .sort((left, right) => left.year.localeCompare(right.year)),
    [...builtInTimeline]
  )

export const getFormationHouses = () =>
  fromCms<FormationHouse[]>(
    "formation",
    (items) => items.map((item) => ({ name: item.title, place: item.location_text })),
    [...builtInFormationHouses]
  )

const isFormationAbroad = (item: CmsItem) => text(item, "kind") === "formation"

export const getMissionCountries = () =>
  fromCms<string[]>(
    "international",
    (items) => items.map((item) => item.title),
    [...builtInMissionCountries],
    (item) => !isFormationAbroad(item)
  )

export const getFormationAbroad = () =>
  fromCms<string[]>("international", (items) => items.map((item) => item.title), [...builtInFormationAbroad], isFormationAbroad)

export const getPublications = (fallback: Publication[]) =>
  fromCms<Publication[]>(
    "publication",
    (items) =>
      items.map((item) => {
        const [title, subtitle = ""] = item.title.split(/\s+[—–-]\s+/)
        return {
          id: anchorId(title),
          title,
          subtitle: text(item, "subtitle") || subtitle,
          text: item.excerpt,
          href: item.media_url || undefined,
        }
      }),
    fallback
  )

const isSuperior = (item: CmsItem) => /provincial superior/i.test(text(item, "role"))
const isFormerProvincial = (item: CmsItem) => /former provincial/i.test(text(item, "role"))

export const getLeadership = () =>
  fromCms<Leadership>(
    "leadership",
    (items) => {
      const superior = items.find(isSuperior)
      return {
        superior: superior
          ? {
              name: superior.title,
              term: text(superior, "term") || text(superior, "term_in_source"),
              summary: superior.excerpt,
            }
          : null,
        council: items
          .filter((item) => !isSuperior(item))
          .map((item) => ({ role: text(item, "role") || "Council", name: item.title })),
      }
    },
    { superior: null, council: [...builtInCouncil] },
    (item) => !isFormerProvincial(item)
  )

export const getFormerProvincials = () =>
  fromCms<FormerProvincial[]>(
    "leadership",
    (items) => items.map((item) => ({ name: item.title, dates: text(item, "term") || item.excerpt })),
    [...builtInFormerProvincials],
    isFormerProvincial
  )

const priestPlaces = new Set<PriestPlace>(["sri-lanka", "abroad", "out-of-province"])

export const getPriests = () =>
  fromCms<Priest[]>(
    "priest",
    (items) =>
      items.map((item) => {
        const place = text(item, "place") as PriestPlace
        return {
          name: item.title,
          place: priestPlaces.has(place) ? place : "sri-lanka",
          image: item.image_url || undefined,
        }
      }),
    builtInPriests
  )

const mapKinds = new Set<MapKind>(["parish", "house", "ministry", "formation"])
const hasCoordinates = (item: CmsItem) =>
  Number.isFinite(Number(item.meta.lat)) && Number.isFinite(Number(item.meta.lng)) && item.meta.lat != null

export const getMapLocations = () =>
  fromCms<MapLocation[]>(
    "location",
    (items) =>
      items.map((item) => {
        const { name, district } = splitTitle(item.title)
        const kind = text(item, "kind") as MapKind
        return {
          id: item.slug,
          name,
          district: text(item, "district") || district,
          address: item.location_text,
          purpose: text(item, "purpose") || item.excerpt,
          contact: text(item, "contact") || undefined,
          phone: text(item, "phone") || undefined,
          email: text(item, "email") || undefined,
          kind: mapKinds.has(kind) ? kind : "house",
          lat: Number(item.meta.lat),
          lng: Number(item.meta.lng),
          lastVerified: item.last_verified_at ? formatMonth(item.last_verified_at) : "",
        }
      }),
    builtInMapLocations,
    hasCoordinates
  )

const getPage = async (slug: string) => (await fetchItems("page"))?.find((item) => item.slug === slug)

export async function getHomeContent(): Promise<HomeContent> {
  const page = await getPage("home")
  const { hero } = homeContent
  return {
    hero: {
      eyebrow: text(page, "eyebrow") || hero.eyebrow,
      title: text(page, "headline") || hero.title,
      tagline: page?.excerpt.trim() || hero.tagline,
      years: text(page, "years") || hero.years,
      quote: text(page, "quote") || hero.quote,
      lede: text(page, "lede") || hero.lede,
    },
    welcome: page && paragraphs(page.body).length ? paragraphs(page.body) : [homeContent.welcome],
  }
}

export async function getCharismContent(): Promise<CharismContent> {
  const [charism, about, history] = await Promise.all([getPage("charism"), getPage("who-we-are"), getPage("history")])
  return {
    kicker: charism?.excerpt.trim() || "Evangelizing the poor",
    title: text(charism, "headline") || "The Gospel must go out and reach people where they are",
    summary:
      paragraphs(charism?.body ?? "")[0] ||
      "For the Oblate, poverty is not only the lack of material resources. It also appears through abandonment, exclusion, displacement, addiction, disability, loneliness, injustice, conflict and loss of hope.",
    ways: list(charism, "ways").length
      ? list(charism, "ways")
      : [
          "Go where people need the Gospel.",
          "Listen before speaking and accompany before judging.",
          "Serve people whose dignity is threatened.",
          "Build communities of faith and hope.",
          "Promote justice, peace and reconciliation.",
          "Care for creation and future generations.",
          "Form young people and future missionaries.",
          "Treat digital platforms as new missionary spaces.",
        ],
    aboutHeading: text(about, "headline") || "A missionary family in Sri Lanka since 1847",
    about: about && paragraphs(about.body).length
      ? paragraphs(about.body)
      : [
          "The Missionary Oblates of Mary Immaculate were founded by St Eugene de Mazenod. The Province of Jaffna belongs to that worldwide family, with a particular presence among Tamil-speaking people and communities, serving the people of God island-wide and abroad.",
        ],
    arrival:
      text(history, "arrival") ||
      "The first Oblates landed at Galle on 28 November 1847. On 10 March 1848 they reached Jaffna.",
    mission:
      paragraphs(history?.body ?? "")[0] ||
      "They began by learning Tamil, entering the culture of the people, and walking into villages, coastal communities and islands. Education, pastoral care and accompaniment through peace, suffering and social change became the shape of the mission.",
  }
}

const sectionIds = new Set<string>(newsSections.map((section) => section.id))

function toNewsArticle(item: CmsItem): NewsArticle {
  const cover = {
    src: item.image_url || "/Herosection/Heroimage_3.jpg",
    alt: item.title,
    caption: item.title,
  }
  const date = item.event_date ?? item.published_at
  const section = text(item, "section")
  const gallery = Array.isArray(item.meta.gallery)
    ? (item.meta.gallery as Partial<NewsArticle["cover"]>[])
        .filter((image) => typeof image?.src === "string")
        .map((image) => ({ src: image.src!, alt: image.alt ?? item.title, caption: image.caption ?? "" }))
    : []
  return {
    slug: item.slug,
    section: (sectionIds.has(section) ? section : "province-events") as NewsSectionId,
    title: item.title,
    description: item.excerpt,
    dateLabel: text(item, "date_display") || (date ? formatDate(date) : ""),
    place: item.location_text,
    cover,
    paragraphs: paragraphs(item.body).length ? paragraphs(item.body) : [item.excerpt || item.title],
    gallery: gallery.length ? gallery : [cover],
    sample: item.meta.sample === true,
  }
}

export const getNews = (fallback: NewsArticle[] = builtInNews) =>
  fromCms<NewsArticle[]>("news", (items) => items.map(toNewsArticle), fallback)

export async function getNewsArticle(slug: string) {
  return (await getNews()).find((article) => article.slug === slug)
}

const palette = [
  { face: "#d4f6fa", ink: "#023e8a" },
  { face: "#fde4ec", ink: "#9d174d" },
  { face: "#ece4fb", ink: "#5b21b6" },
  { face: "#ffedd5", ink: "#9a3412" },
] as const

export const getEvents = () =>
  fromCms<Gathering[]>(
    "event",
    (items) =>
      items.map((item, index) => {
        const start = dateParts(item.event_date!)
        const endDate = text(item, "end_date")
        const end = /^\d{4}-\d{2}-\d{2}$/.test(endDate) ? dateParts(`${endDate}T12:00:00+05:30`) : start
        return {
          id: item.slug,
          title: item.title,
          dateLabel: text(item, "date_display") || formatDate(item.event_date!),
          place: item.location_text,
          summary: item.excerpt,
          year: start.year,
          month: start.month,
          day: start.day,
          endYear: end.year,
          endMonth: end.month,
          endDay: end.day,
          ...palette[index % palette.length],
        }
      }),
    [...builtInGatherings],
    (item) => Boolean(item.event_date)
  )
