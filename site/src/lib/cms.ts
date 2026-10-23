import { cache } from "react"

import { anchorId } from "@/config/navigation"
import { blocks, mergeContent, type BlockContent, type BlockId } from "@/content/blocks"
import { emptyMinistryDetail, type MinistryDetail } from "@/content/ministry-details"
import type { MapKind, MapLocation } from "@/content/map-locations"
import { newsSections, type NewsArticle, type NewsSectionId } from "@/content/news"
import type { Priest, PriestPlace } from "@/content/priests"

const API_ORIGIN = (
  process.env.API_URL ||
  process.env.API_ORIGIN ||
  process.env.URL ||
  "http://127.0.0.1:4000"
).replace(/\/+$/, "")
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
  | "bishop"
  | "necrology"
  | "school"

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

export type Ministry = {
  number: string
  title: string
  place: string
  summary: string
  image?: string
  detail?: MinistryDetail
}
export type Parish = { name: string; place: string }
export type TimelineEntry = { year: string; text: string }
export type Bishop = {
  slug: string
  name: string
  no: number
  born: string
  bornAt: string
  died: string
  diedAt: string
  excerpt: string
  body: string
  image?: string
}
export type NecrologyRole = "bishop" | "father" | "brother" | "scholastic"
export type NecrologyPerson = {
  no: number
  name: string
  born: string
  bornAt: string
  died: string
  diedAt: string
  role: NecrologyRole
}
export type CouncilMember = { role: string; name: string; image?: string; cover?: boolean; term?: string }
export type FormerProvincial = { name: string; dates: string; image?: string }
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
export type SuperiorTerm = { label: string; appointed: string; installed: string }
export type Leadership = {
  superior: {
    name: string
    role: string
    term: string
    since: string
    bio: string
    image?: string
    terms: SuperiorTerm[]
  } | null
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
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) return null
    const data = (await response.json()) as { items: CmsItem[] }
    return data.items
  } catch (err) {
    if ((err as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE") throw err
    console.error(`[cms] Failed to fetch ${type}:`, err)
    return null
  }
})

/** Published CMS items of one type, mapped for the site. All content lives in the CMS. */
async function fromCms<T>(
  type: CmsType,
  map: (items: CmsItem[]) => T,
  include: (item: CmsItem) => boolean = () => true
): Promise<T> {
  return map((await fetchItems(type))?.filter(include) ?? [])
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
  fromCms<Ministry[]>("ministry", (items) =>
    items.map((item, index) => ({
      number: String(item.sort_order || index + 1).padStart(2, "0"),
      title: item.title,
      place: item.location_text,
      summary: item.excerpt,
      image: item.image_url || undefined,
      detail: item.meta.detail ? mergeContent(emptyMinistryDetail, item.meta.detail) : undefined,
    }))
  )

export const getParishes = () =>
  fromCms<Parish[]>("parish", (items) => items.map((item) => ({ name: item.title, place: item.location_text })))

export const getSchools = () =>
  fromCms<Parish[]>(
    "school",
    (items) =>
      items.map((item) => {
        const { name, district } = splitTitle(item.title)
        return { name, place: item.location_text || district }
      })
  )

export const getTimeline = () =>
  fromCms<TimelineEntry[]>("timeline", (items) =>
    items.map((item) => ({
      year: text(item, "date_display") || item.title,
      text: item.excerpt || item.body || item.title,
    }))
  )

export const getBishops = () =>
  fromCms<Bishop[]>("bishop", (items) =>
    items.map((item) => {
      const registerNo = Number(text(item, "register_no") || item.sort_order || 0)
      return {
        slug: item.slug,
        name: item.title,
        no: Number.isFinite(registerNo) ? registerNo : 0,
        born: text(item, "born"),
        bornAt: text(item, "born_at"),
        died: text(item, "died"),
        diedAt: text(item, "died_at"),
        excerpt: item.excerpt,
        body: item.body,
        image: item.image_url || undefined,
      }
    })
  )

export const getBishop = async (slug: string) =>
  (await getBishops()).find((bishop) => bishop.slug === slug)

const necrologyRoles = new Set<NecrologyRole>(["bishop", "father", "brother", "scholastic"])

function roleFromName(name: string): NecrologyRole {
  if (/^(Rt\.|Mgr\.)/.test(name)) return "bishop"
  if (name.startsWith("Bro.")) return "brother"
  if (name.startsWith("Sch.")) return "scholastic"
  return "father"
}

export const getNecrology = () =>
  fromCms<NecrologyPerson[]>("necrology", (items) =>
    items.map((item) => {
      const registerNo = Number(text(item, "register_no") || item.sort_order || 0)
      const roleMeta = text(item, "role") as NecrologyRole
      return {
        no: Number.isFinite(registerNo) ? registerNo : 0,
        name: item.title,
        born: text(item, "born"),
        bornAt: text(item, "born_at"),
        died: text(item, "died"),
        diedAt: text(item, "died_at"),
        role: necrologyRoles.has(roleMeta) ? roleMeta : roleFromName(item.title),
      }
    })
  )

export const getFormationHouses = () =>
  fromCms<FormationHouse[]>("formation", (items) =>
    items.map((item) => ({ name: item.title, place: item.location_text }))
  )

const isFormationAbroad = (item: CmsItem) => text(item, "kind") === "formation"

export const getMissionCountries = () =>
  fromCms<string[]>(
    "international",
    (items) => items.map((item) => item.title),
    (item) => !isFormationAbroad(item)
  )

export const getFormationAbroad = () =>
  fromCms<string[]>("international", (items) => items.map((item) => item.title), isFormationAbroad)

export const getPublications = () =>
  fromCms<Publication[]>("publication", (items) =>
    items.map((item) => {
      const [title, subtitle = ""] = item.title.split(/\s+[—–-]\s+/)
      return {
        id: anchorId(title),
        title,
        subtitle: text(item, "subtitle") || subtitle,
        text: item.excerpt,
        href: item.media_url || undefined,
      }
    })
  )

const isSuperior = (item: CmsItem) => /provincial superior/i.test(text(item, "role"))
const isFormerProvincial = (item: CmsItem) => /former provincial/i.test(text(item, "role"))

const superiorTerms = (item: CmsItem): SuperiorTerm[] => {
  const value = item.meta.terms
  if (!Array.isArray(value)) return []
  return value
    .filter((term): term is Record<string, unknown> => typeof term === "object" && term !== null)
    .map((term) => ({
      label: String(term.label ?? "").trim(),
      appointed: String(term.appointed ?? "").trim(),
      installed: String(term.installed ?? "").trim(),
    }))
    .filter((term) => term.label)
}

export const getLeadership = () =>
  fromCms<Leadership>(
    "leadership",
    (items) => {
      const superior = items.find(isSuperior)
      return {
        superior: superior
          ? {
              name: superior.title,
              role: text(superior, "role"),
              term: text(superior, "term") || text(superior, "term_in_source"),
              since: text(superior, "since"),
              bio: superior.body || superior.excerpt,
              image: superior.image_url || undefined,
              terms: superiorTerms(superior),
            }
          : null,
        council: items
          .filter((item) => !isSuperior(item))
          .map((item) => ({
            role: text(item, "role") || "Council",
            name: item.title,
            image: item.image_url || undefined,
            cover: text(item, "fit") === "cover",
            term: text(item, "term") || text(item, "term_in_source") || undefined,
          })),
      }
    },
    (item) => !isFormerProvincial(item)
  )

export const getFormerProvincials = () =>
  fromCms<FormerProvincial[]>(
    "leadership",
    (items) =>
      items.map((item) => ({
        name: item.title,
        dates: text(item, "term") || item.excerpt,
        image: item.image_url || undefined,
      })),
    isFormerProvincial
  )

const priestPlaces = new Set<PriestPlace>(["sri-lanka", "abroad", "out-of-province"])

export const getPriests = () =>
  fromCms<Priest[]>("priest", (items) =>
    items.map((item) => {
      const place = text(item, "place") as PriestPlace
      return {
        name: item.title,
        place: priestPlaces.has(place) ? place : "sri-lanka",
        image: item.image_url || undefined,
      }
    })
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
    hasCoordinates
  )

const getPage = async (slug: string) => (await fetchItems("page"))?.find((item) => item.slug === slug)

/** One editable block (see content/blocks.ts) with the CMS edits applied. */
export async function getBlock<K extends BlockId>(id: K): Promise<BlockContent<K>> {
  const page = await getPage(id)
  return mergeContent(blocks[id].defaults, page?.meta.sections) as BlockContent<K>
}

export const getSiteInfo = () => getBlock("site-info")

export async function getHomeContent(): Promise<HomeContent> {
  const page = await getPage("home")
  return {
    hero: {
      eyebrow: text(page, "eyebrow"),
      title: text(page, "headline"),
      tagline: page?.excerpt.trim() ?? "",
      years: text(page, "years"),
      quote: text(page, "quote"),
      lede: text(page, "lede"),
    },
    welcome: paragraphs(page?.body ?? ""),
  }
}

export async function getCharismContent(): Promise<CharismContent> {
  const charism = await getPage("charism")
  return {
    kicker: charism?.excerpt.trim() ?? "",
    title: text(charism, "headline"),
    summary: paragraphs(charism?.body ?? "")[0] ?? "",
    ways: list(charism, "ways"),
    aboutHeading: text(charism, "about_heading"),
    about: list(charism, "about"),
    arrival: text(charism, "arrival"),
    mission: text(charism, "mission"),
  }
}

const sectionIds = new Set<string>(newsSections.map((section) => section.id))

function toNewsArticle(item: CmsItem, fallbackImage: string): NewsArticle {
  const cover = {
    src: item.image_url || fallbackImage,
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

export async function getNews() {
  const { newsImage } = await getSiteInfo()
  return fromCms<NewsArticle[]>("news", (items) => items.map((item) => toNewsArticle(item, newsImage)))
}

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
    (item) => Boolean(item.event_date)
  )
