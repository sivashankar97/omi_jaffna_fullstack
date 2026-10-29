import type { NavItem } from "@/types"

type NavigationData = {
  ministries: readonly { number: string; title: string }[]
  parishes: readonly { name: string }[]
  formationHouses: readonly { name: string; slug?: string }[]
  /** Library section names from CMS block `library` (cardTitle). */
  librarySections?: Partial<Record<"magazine" | "libraries" | "books" | "articles", string>>
}

export function anchorId(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function ministryAnchor(number: string) {
  return `ministry-${number}`
}

export function ministrySlug(ministry: { number: string; title: string }) {
  return `${ministry.number}-${anchorId(ministry.title)}`
}

export function ministryHref(ministry: { number: string; title: string }) {
  return `/ministries/${ministrySlug(ministry)}`
}

export function ministrySectionHref(
  ministry: { number: string; title: string },
  sectionSlug: string
) {
  return `${ministryHref(ministry)}/${anchorId(sectionSlug)}`
}

export function parishAnchor(name: string) {
  return `parish-${anchorId(name)}`
}

export function houseAnchor(name: string) {
  return `house-${anchorId(name)}`
}

export function formationHref(house: { slug?: string }) {
  return `/vocations/${house.slug}`
}

export function bishopHref(bishop: { slug: string }) {
  return `/history/bishops/${bishop.slug}`
}

export function fatherHref(priest: { slug: string }) {
  return `/leadership/fathers/${anchorId(priest.slug)}`
}

export function councilHref(person: { slug: string }) {
  return `/leadership/council/${anchorId(person.slug)}`
}

export function formerProvincialHref(person: { slug: string }) {
  return `/leadership/former/${anchorId(person.slug)}`
}

export function internationalCountryHref(slug: string) {
  return `/international/${anchorId(slug)}`
}

export const mediaSections = [
  "Photo gallery",
  "Video",
  "Podcasts",
  "Interviews",
  "Homilies and reflections",
  "Testimonials",
] as const

export function buildNavigation({ ministries, parishes, formationHouses, librarySections = {} }: NavigationData): NavItem[] {
  return [
    {
      label: "Home",
      href: "/",
      description: "Province identity, charism, mission and the way in",
      sections: [
        { label: "Province", id: "hero" },
        { label: "Welcome", id: "welcome" },
        { label: "Daily inspiration", id: "daily-inspiration" },
        { label: "Our calling", id: "pillars" },
        { label: "Ministries", id: "ministries" },
        { label: "Latest news", id: "latest-news" },
        { label: "Media", id: "media-highlights" },
        { label: "Our journey", id: "journey" },
        { label: "Oblate family", id: "family" },
        { label: "Calendar", id: "calendar" },
        { label: "Join us", id: "join-us" },
        { label: "Contact us", id: "contact-us" },
        { label: "Mission map", id: "mission-map" },
      ],
    },
    {
      label: "History",
      href: "/history",
      description: "Who we are, the brief history, journey and development of the Province",
      sections: [
        { label: "Who we are", id: "who-we-are" },
        { label: "Brief history", id: "brief-history" },
        { label: "The journey", id: "journey" },
        { label: "Bishops", id: "bishops" },
        { label: "Historical archive", id: "historical-archive" },
        { label: "Development", id: "development" },
      ],
    },
    {
      label: "Charism",
      href: "/charism",
      description: "Evangelizing the poor, mission, vision and our story since 1847",
      sections: [
        { label: "Charism", id: "charism" },
        { label: "Spiritual life", id: "spiritual-life" },
        { label: "Missionary family", id: "missionary-family" },
        { label: "Core commitments", id: "core-commitments" },
        { label: "Mission with the poor", id: "identity" },
        { label: "Charism priorities", id: "priorities" },
        { label: "St. Eugene de Mazenod", id: "founder" },
        { label: "Journey of the Oblates", id: "oblate-journey" },
        { label: "How we live it", id: "how-we-live" },
        { label: "Mission", id: "mission" },
        { label: "Vision", id: "vision" },
        { label: "Motto", id: "motto" },
        { label: "About us", id: "about" },
        { label: "Arrival in Jaffna", id: "arrival" },
      ],
    },
    {
      label: "Leadership",
      href: "/leadership",
      description: "Provincial Superior, council and administration",
      sections: [
        { label: "Provincial Superior", id: "provincial-superior" },
        { label: "Provincial Council", id: "council" },
        { label: "Former Provincials", id: "former-provincials" },
        { label: "Oblate priests", id: "priests" },
      ],
    },
    {
      label: "Ministries",
      href: "/ministries",
      description: "Seventeen ministries and twelve parishes, one mission",
      sections: [
        { label: "Seventeen ministries", id: "all-ministries" },
        ...ministries.map((ministry) => ({
          label: ministry.title,
          id: ministryAnchor(ministry.number),
        })),
        { label: "Parish directory", id: "parish-directory" },
        ...parishes.map((parish) => ({
          label: parish.name,
          id: parishAnchor(parish.name),
        })),
      ],
    },
    {
      label: "Vocations",
      href: "/vocations",
      description: "Formation houses and the call to missionary life",
      sections: [
        { label: "The call", id: "the-call" },
        ...formationHouses.map((house) => ({
          label: house.name,
          id: houseAnchor(house.name),
          href: house.slug ? formationHref(house) : undefined,
        })),
        { label: "Begin the conversation", id: "discernment" },
      ],
    },
    {
      label: "International",
      href: "/international",
      description: "Missionaries serving beyond Sri Lanka",
      sections: [
        { label: "Sent from here", id: "sent" },
        { label: "Countries of mission", id: "countries" },
        { label: "Formation abroad", id: "formation-abroad" },
      ],
    },
    {
      label: "News",
      href: "/news",
      description: "Province news, feasts and pastoral updates",
      sections: [
        { label: "Province events", id: "province-events" },
        { label: "Parish events", id: "parish-events" },
        { label: "Liturgical celebrations", id: "liturgical" },
        { label: "Formation activities", id: "formation" },
        { label: "Youth events", id: "youth" },
        { label: "Social initiatives", id: "social" },
      ],
    },
    {
      label: "Library",
      href: "/library",
      description: "Magazines, libraries, new books and articles",
      sections: [
        { label: librarySections.magazine || "Magazine", id: "magazine", href: "/library/magazines" },
        { label: librarySections.libraries || "Libraries", id: "libraries", href: "/library/libraries" },
        { label: librarySections.books || "Books", id: "books", href: "/library/books" },
        { label: librarySections.articles || "Articles", id: "articles", href: "/library/articles" },
      ],
    },
    {
      label: "Media",
      href: "/media",
      description: "Photos, video, reflections, publications and digital mission",
      sections: [
        { label: "Digital mission", id: "digital-mission" },
        { label: "Social channels", id: "social-signals" },
        ...mediaSections.map((label) => ({
          label,
          id: anchorId(label),
        })),
        { label: "Publications", id: "publications" },
      ],
    },
    {
      label: "Contact",
      href: "/contact",
      description: "Provincial House, phone, email and enquiries",
      sections: [
        { label: "Provincial House", id: "thodarpaham" },
        { label: "Visit or write", id: "visit" },
        { label: "Enquiry", id: "enquiry" },
        { label: "Mission map", id: "mission-map" },
      ],
    },
  ]
}

export const mainNavigation = buildNavigation({ ministries: [], parishes: [], formationHouses: [] })

export const locales = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "si", label: "සිංහල" },
] as const
