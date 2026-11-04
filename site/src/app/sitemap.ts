import type { MetadataRoute } from "next"

import {
  anchorId,
  bishopHref,
  councilHref,
  fatherHref,
  formationHref,
  formerProvincialHref,
  internationalCountryHref,
  ministryHref,
  ministrySectionHref,
} from "@/config/navigation"
import { site } from "@/config/site"
import {
  getBishops,
  getEvents,
  getFormationHouses,
  getFormerProvincials,
  getLeadership,
  getMinistries,
  getMissionCountries,
  getNews,
  getPriests,
} from "@/lib/cms"

export const dynamic = "force-dynamic"

const staticPaths = [
  "/",
  "/about",
  "/charism",
  "/history",
  "/leadership",
  "/ministries",
  "/parishes",
  "/vocations",
  "/international",
  "/news",
  "/media",
  "/library",
  "/library/magazines",
  "/library/libraries",
  "/library/books",
  "/library/articles",
  "/publications",
  "/contact",
  "/privacy",
]

async function safe<T>(load: () => Promise<T>, fallback: T) {
  try {
    return await load()
  } catch {
    return fallback
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ministries, news, events, priests, leadership, former, bishops, countries, houses] = await Promise.all([
    safe(getMinistries, []),
    safe(getNews, []),
    safe(getEvents, []),
    safe(getPriests, []),
    safe(getLeadership, { superior: null, council: [] }),
    safe(getFormerProvincials, []),
    safe(getBishops, []),
    safe(getMissionCountries, []),
    safe(getFormationHouses, []),
  ])

  const paths = [
    ...staticPaths,
    ...ministries.flatMap((ministry) => [
      ministryHref(ministry),
      ...(ministry.detail?.majorSections ?? [])
        .filter((section) => anchorId(section.slug ?? ""))
        .map((section) => ministrySectionHref(ministry, section.slug)),
    ]),
    ...news.map((article) => `/news/${article.slug}`),
    ...events.map((event) => `/events/${event.id}`),
    ...priests.map(fatherHref),
    ...leadership.council.map(councilHref),
    ...former.map(formerProvincialHref),
    ...bishops.map(bishopHref),
    ...countries.map((country) => internationalCountryHref(country.slug)),
    ...houses.filter((house) => house.slug).map(formationHref),
  ]

  return [...new Set(paths)].map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" || path.startsWith("/news") ? "daily" : "weekly",
    priority: path === "/" ? 1 : staticPaths.includes(path) ? 0.8 : 0.6,
  }))
}
