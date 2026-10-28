import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Images,
  Mail,
  MapPin,
  Navigation,
  Newspaper,
  Phone,
  Play,
  Users,
} from "lucide-react"

import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { MinistrySectionContentTabs } from "@/components/sections/ministries/ministry-section-content-tabs"
import { anchorId, ministryHref, ministrySectionHref, ministrySlug } from "@/config/navigation"
import type { MinistryFutureEvent, MinistryMajorSection } from "@/content/ministry-details"
import { getMinistries, getSiteInfo } from "@/lib/cms"

type SectionPageProps = {
  params: Promise<{ slug: string; section: string }>
}

function matchSection(sections: MinistryMajorSection[], sectionParam: string) {
  const needle = anchorId(sectionParam)
  return sections.find((item) => anchorId(item.slug) === needle)
}

async function findMinistryAndSection(slug: string, sectionParam: string) {
  const ministries = await getMinistries()
  const ministry = ministries.find((item) => ministrySlug(item) === slug)
  if (!ministry) return { ministry: undefined, section: undefined as MinistryMajorSection | undefined }
  const section = matchSection(ministry.detail?.majorSections ?? [], sectionParam)
  return { ministry, section }
}

function eventTime(event: MinistryFutureEvent) {
  const time = new Date(event.date).getTime()
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time
}

function eventDate(value: string) {
  const date = new Date(value)
  if (!value.trim() || Number.isNaN(date.getTime())) return { day: "—", month: "TBA", full: value }
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    full: date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
  }
}

function mosaicSpan(index: number, shown: number) {
  if (index === 0) return "col-span-2 row-span-2"
  if (shown === 2) return "col-span-2 row-span-2"
  if (shown === 3 || (shown === 4 && index === 3)) return "col-span-2"
  return ""
}

export async function generateStaticParams() {
  const ministries = await getMinistries()
  return ministries.flatMap((ministry) =>
    (ministry.detail?.majorSections ?? []).map((section) => ({
      slug: ministrySlug(ministry),
      section: anchorId(section.slug),
    }))
  )
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { slug, section: sectionParam } = await params
  const { ministry, section } = await findMinistryAndSection(slug, sectionParam)
  if (!ministry || !section) return { title: "Ministry section" }
  return {
    title: `${section.title} · ${ministry.title}`,
    description: section.summary || ministry.summary,
  }
}

export default async function MinistrySectionPage({ params }: SectionPageProps) {
  const { slug, section: sectionParam } = await params
  const [{ ministry, section }, { contact }] = await Promise.all([
    findMinistryAndSection(slug, sectionParam),
    getSiteInfo(),
  ])
  if (!ministry || !section) notFound()

  const siblings = ministry.detail?.majorSections ?? []
  const position = siblings.findIndex((item) => anchorId(item.slug) === anchorId(section.slug))
  const prev = position > 0 ? siblings[position - 1] : undefined
  const next = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : undefined
  const placeNo = section.listNo || String(position + 1).padStart(2, "0")
  const filled = (list?: string[]) => (list ?? []).map((line) => line.trim()).filter(Boolean)
  const placeFocus = filled(section.focus)
  const focus = placeFocus.length ? placeFocus : filled(ministry.detail?.focus)
  const about = filled(section.about)
  const photos = section.photos ?? []
  const events = [...(section.futureEvents ?? [])].sort((a, b) => eventTime(a) - eventTime(b)).slice(0, 3)
  const summary = section.summary || ministry.summary
  const mapQuery = encodeURIComponent([section.title, section.place, "Sri Lanka"].filter(Boolean).join(", "))
  const mapUrl = section.mapUrl?.trim() || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
  const local = section.contact ?? {}
  const phone = local.phone?.trim() || contact.phone
  const phoneHref = local.phone?.trim() ? `tel:${local.phone.replace(/[^\d+]/g, "")}` : contact.phoneHref
  const email = local.email?.trim() || contact.email

  const stats = [
    { label: "Stories", value: section.history?.length ?? 0, Icon: BookOpen },
    { label: "Articles", value: section.articles?.length ?? 0, Icon: Newspaper },
    { label: "Photos", value: photos.length, Icon: Images },
    { label: "Videos", value: section.videos?.length ?? 0, Icon: Play },
    { label: "Events", value: section.futureEvents?.length ?? 0, Icon: CalendarDays },
  ]
  const hasContent = stats.some((stat) => stat.value > 0)

  return (
    <>
      <ScrollProgress />
      <header className="relative isolate flex min-h-[30rem] flex-col overflow-hidden bg-[#06394a] px-4 pt-20 pb-20 text-white sm:min-h-[34rem] sm:px-8 sm:pt-24 sm:pb-24">
        {section.image || ministry.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={encodeURI(section.image || ministry.image || "")}
            alt=""
            className="history-kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : null}

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between gap-10">
          <nav
            aria-label="Breadcrumb"
            className="flex w-fit flex-wrap items-center gap-1.5 rounded-full bg-[#03202b]/55 px-4 py-2 text-sm text-white/80 backdrop-blur-md"
          >
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href="/ministries" className="transition hover:text-white">
              Ministries
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href={ministryHref(ministry)} className="transition hover:text-white">
              {ministry.title}
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <span className="text-white">{section.title}</span>
          </nav>

          <div className="max-w-3xl rounded-[1.75rem] bg-[#03202b]/60 p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/15 backdrop-blur-md sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#ffcf4a] px-3 py-1 font-heading text-xs font-bold tracking-wide text-[#03202b]">
                Place {placeNo}
                {siblings.length > 1 ? ` of ${String(siblings.length).padStart(2, "0")}` : ""}
              </span>
              <span className="text-xs font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">{ministry.title}</span>
            </div>
            <h1
              className="mt-4 font-heading text-4xl font-semibold text-balance sm:text-5xl"
              style={{ color: "#ffffff" }}
            >
              {section.title}
            </h1>
            {summary ? <p className="mt-4 line-clamp-3 max-w-2xl text-base leading-7 text-white/85">{summary}</p> : null}
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              {section.place ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium ring-1 ring-white/20">
                  <MapPin aria-hidden="true" className="size-4 text-[#ffcf4a]" /> {section.place}
                </span>
              ) : null}
              {section.group ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium ring-1 ring-white/20">
                  <Users aria-hidden="true" className="size-4 text-[#ffcf4a]" /> {section.group}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-b from-[#f7fbfd] to-white px-4 pb-16 text-[#102a43] sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <ul className="relative z-10 -mt-12 grid grid-cols-2 gap-2.5 rounded-[1.75rem] bg-white p-3 shadow-[0_28px_60px_-36px_rgba(3,32,43,0.55)] ring-1 ring-[#d9eef3] sm:grid-cols-5 sm:gap-3 sm:p-4">
            {stats.map(({ label, value, Icon }) => (
              <li key={label} className="last:col-span-2 sm:last:col-span-1">
                <a
                  href="#place-content"
                  className="flex items-center gap-3 rounded-2xl bg-[#f4fbfd] px-3.5 py-3 ring-1 ring-[#e2f2f6] transition hover:bg-[#e7fbff] hover:ring-[#17b3c6]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0e98ac] to-[#17b3c6] text-white">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span>
                    <span className="block font-heading text-2xl leading-none font-bold text-[#023e8a]">{value}</span>
                    <span className="mt-1 block text-xs font-semibold tracking-wide text-[#5c6b7a] uppercase">
                      {label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
            <div className="min-w-0 space-y-12">
              <section aria-labelledby="about-place">
                <p className="text-xs font-bold tracking-[0.22em] text-[#0e98ac] uppercase">About this place</p>
                <h2 id="about-place" className="mt-2 font-heading text-3xl font-semibold text-[#023e8a]">
                  {section.title}
                  {section.place ? <span className="text-[#0e98ac]"> · {section.place}</span> : null}
                </h2>
                {summary ? (
                  <p className="mt-5 border-l-4 border-[#17b3c6] pl-5 text-lg leading-8 text-[#3d4b59]">{summary}</p>
                ) : null}
                {about.length ? (
                  <div className="mt-5 space-y-4 leading-7 text-[#3d4b59]">
                    {about.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 leading-7 text-[#5c6b7a]">
                    {section.title} is one of the communities served through the{" "}
                    <Link href={ministryHref(ministry)} className="font-semibold text-[#0e98ac] hover:text-[#023e8a]">
                      {ministry.title}
                    </Link>{" "}
                    of the Oblate Province of Jaffna
                    {section.group ? `, within the ${section.group} group` : ""}.
                  </p>
                )}

                {focus.length ? (
                  <div className="mt-8 rounded-[1.75rem] bg-[#f4fbfd] p-6 ring-1 ring-[#d9eef3]">
                    <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">
                      How the mission serves here
                    </p>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {focus.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#3d4b59]">
                          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#17b3c6]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>

              {photos.length ? (
                <section aria-labelledby="place-glimpses">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[0.22em] text-[#0e98ac] uppercase">Glimpses</p>
                      <h2 id="place-glimpses" className="mt-2 font-heading text-2xl font-semibold text-[#023e8a]">
                        Life at {section.title}
                      </h2>
                    </div>
                    <a href="#place-content" className="text-sm font-semibold text-[#0e98ac] hover:text-[#023e8a]">
                      All {photos.length} photos
                    </a>
                  </div>
                  <ul className="mt-5 grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-4">
                    {photos.slice(0, 5).map((photo, index) => (
                      <li
                        key={photo.src + index}
                        className={`group relative overflow-hidden rounded-2xl bg-[#e2f2f6] ${mosaicSpan(
                          index,
                          Math.min(photos.length, 5)
                        )}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={encodeURI(photo.src)}
                          alt={photo.alt || ""}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        {index === 0 && photo.caption ? (
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#03202b]/85 to-transparent px-4 pt-10 pb-3 text-sm text-white">
                            {photo.caption}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section id="place-content" aria-labelledby="place-content-title" className="scroll-mt-28">
                <p className="text-xs font-bold tracking-[0.22em] text-[#0e98ac] uppercase">Explore</p>
                <h2 id="place-content-title" className="mt-2 mb-6 font-heading text-2xl font-semibold text-[#023e8a]">
                  Stories, news &amp; media
                </h2>
                {hasContent ? (
                  <MinistrySectionContentTabs content={section} />
                ) : (
                  <p className="rounded-2xl bg-[#f4fbfd] px-5 py-6 text-[#5c6b7a] ring-1 ring-[#d9eef3]">
                    Stories, photos and events from {section.title} will appear here soon.
                  </p>
                )}
              </section>

              {prev || next ? (
                <nav aria-label="Previous and next place" className="grid gap-3 border-t border-[#e2f2f6] pt-8 sm:grid-cols-2">
                  {prev ? (
                    <Link
                      href={ministrySectionHref(ministry, prev.slug)}
                      className="group rounded-2xl px-5 py-4 ring-1 ring-[#d9eef3] transition hover:bg-[#f4fbfd] hover:ring-[#17b3c6]"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.16em] text-[#0e98ac] uppercase">
                        <ArrowLeft aria-hidden="true" className="size-3.5 transition group-hover:-translate-x-0.5" />
                        Previous place
                      </span>
                      <span className="mt-2 block font-heading text-lg font-semibold text-[#023e8a]">{prev.title}</span>
                      {prev.place ? <span className="text-sm text-[#5c6b7a]">{prev.place}</span> : null}
                    </Link>
                  ) : (
                    <span className="hidden sm:block" />
                  )}
                  {next ? (
                    <Link
                      href={ministrySectionHref(ministry, next.slug)}
                      className="group rounded-2xl px-5 py-4 text-right ring-1 ring-[#d9eef3] transition hover:bg-[#f4fbfd] hover:ring-[#17b3c6]"
                    >
                      <span className="flex items-center justify-end gap-1.5 text-xs font-bold tracking-[0.16em] text-[#0e98ac] uppercase">
                        Next place
                        <ArrowRight aria-hidden="true" className="size-3.5 transition group-hover:translate-x-0.5" />
                      </span>
                      <span className="mt-2 block font-heading text-lg font-semibold text-[#023e8a]">{next.title}</span>
                      {next.place ? <span className="text-sm text-[#5c6b7a]">{next.place}</span> : null}
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] bg-[#f4fbfd] p-6 ring-1 ring-[#d9eef3]">
                <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">Place details</p>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-[#5c6b7a]">Place number</dt>
                    <dd className="mt-0.5 font-semibold text-[#023e8a]">
                      {placeNo}
                      {siblings.length > 1 ? ` of ${siblings.length}` : ""}
                    </dd>
                  </div>
                  {section.place ? (
                    <div>
                      <dt className="text-[#5c6b7a]">Location</dt>
                      <dd className="mt-0.5 font-semibold text-[#023e8a]">{section.place}</dd>
                    </div>
                  ) : null}
                  {section.group ? (
                    <div>
                      <dt className="text-[#5c6b7a]">Community group</dt>
                      <dd className="mt-0.5 font-semibold text-[#023e8a]">{section.group}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-[#5c6b7a]">Ministry</dt>
                    <dd className="mt-0.5">
                      <Link href={ministryHref(ministry)} className="font-semibold text-[#023e8a] hover:text-[#0e98ac]">
                        {ministry.number} · {ministry.title}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#5c6b7a]">Served by</dt>
                    <dd className="mt-0.5 font-semibold text-[#023e8a]">Oblate Province of Jaffna</dd>
                  </div>
                </dl>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0e98ac] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a5062]"
                >
                  <Navigation aria-hidden="true" className="size-4" /> Find on map
                </a>
              </div>

              {events.length ? (
                <div className="rounded-[2rem] p-6 ring-1 ring-[#d9eef3]">
                  <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">On the calendar</p>
                  <ul className="mt-4 space-y-3">
                    {events.map((event, index) => {
                      const date = eventDate(event.date)
                      return (
                        <li key={`${event.title}-${index}`} className="flex gap-3">
                          <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#0e98ac] to-[#17b3c6] text-white">
                            <span className="font-heading text-lg leading-none font-bold">{date.day}</span>
                            <span className="text-[9px] font-bold tracking-wider">{date.month}</span>
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm leading-snug font-semibold text-[#023e8a]">{event.title}</span>
                            <span className="mt-0.5 block text-xs text-[#5c6b7a]">{date.full}</span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] p-6 text-white">
                <span
                  aria-hidden="true"
                  className="charism-orb absolute -top-12 -right-10 size-40 rounded-full bg-[#17b3c6]/30 blur-3xl"
                />
                <p className="relative text-xs font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">Visit or support</p>
                <p className="relative mt-3 font-heading text-xl leading-snug font-semibold">
                  Want to visit or help the community at {section.title}?
                </p>
                <div className="relative mt-5 space-y-2 text-sm">
                  {local.name?.trim() ? (
                    <p className="flex items-start gap-2 text-white">
                      <Users aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#ffcf4a]" />
                      <span>
                        <span className="block font-semibold">{local.name}</span>
                        {local.role?.trim() ? <span className="block text-xs text-white/70">{local.role}</span> : null}
                      </span>
                    </p>
                  ) : null}
                  {phone ? (
                    <a href={phoneHref} className="flex items-center gap-2 text-white/85 hover:text-white">
                      <Phone aria-hidden="true" className="size-4 text-[#ffcf4a]" /> {phone}
                    </a>
                  ) : null}
                  {email ? (
                    <a href={`mailto:${email}`} className="flex items-center gap-2 break-all text-white/85 hover:text-white">
                      <Mail aria-hidden="true" className="size-4 shrink-0 text-[#ffcf4a]" /> {email}
                    </a>
                  ) : null}
                </div>
                <Link
                  href="/contact#enquiry"
                  className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffcf4a] px-5 py-3 text-sm font-semibold text-[#03202b] transition hover:bg-[#ffd966]"
                >
                  Contact the Province <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>

              {siblings.length > 1 ? (
                <div className="rounded-[2rem] p-6 ring-1 ring-[#d9eef3]">
                  <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">
                    All places · {siblings.length}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {siblings.map((item, index) => {
                      const active = anchorId(item.slug) === anchorId(section.slug)
                      return (
                        <li key={item.slug}>
                          <Link
                            href={ministrySectionHref(ministry, item.slug)}
                            aria-current={active ? "page" : undefined}
                            className={`group flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition ${
                              active ? "bg-[#0e98ac] text-white" : "text-[#023e8a] hover:bg-[#f4fbfd]"
                            }`}
                          >
                            <span
                              className={`grid size-7 shrink-0 place-items-center rounded-lg font-heading text-[11px] font-bold ${
                                active ? "bg-white/20 text-white" : "bg-[#eaf8fb] text-[#0a5062]"
                              }`}
                            >
                              {item.listNo || String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-semibold">{item.title}</span>
                              {item.place ? (
                                <span className={`block truncate text-xs ${active ? "text-white/80" : "text-[#5c6b7a]"}`}>
                                  {item.place}
                                </span>
                              ) : null}
                            </span>
                            {active ? null : (
                              <ChevronRight
                                aria-hidden="true"
                                className="size-4 text-[#17b3c6] transition group-hover:translate-x-0.5"
                              />
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}

              <Link
                href={ministryHref(ministry)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e98ac] hover:text-[#023e8a]"
              >
                <ArrowLeft aria-hidden="true" className="size-4" /> Back to {ministry.title}
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
