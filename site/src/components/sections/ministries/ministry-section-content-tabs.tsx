"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, BookOpen, CalendarDays, Clock3, Images, MapPin, Newspaper, Play } from "lucide-react"

import {
  ministryStorySource,
  type MinistryFutureEvent,
  type MinistrySectionContent,
} from "@/content/ministry-details"

const TABS = [
  { id: "history", label: "History", Icon: BookOpen },
  { id: "articles", label: "Articles", Icon: Newspaper },
  { id: "photos", label: "Photos", Icon: Images },
  { id: "videos", label: "Videos", Icon: Play },
  { id: "events", label: "Events", Icon: CalendarDays },
] as const

type TabId = (typeof TABS)[number]["id"]

function parseDate(value: string) {
  if (!value.trim()) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(value: string) {
  const date = parseDate(value)
  if (!date) return value.trim() ? value : ""
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function dateParts(value: string) {
  const date = parseDate(value)
  if (!date) {
    return { day: "—", month: "TBA", weekday: "", year: "" }
  }
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    weekday: date.toLocaleDateString("en-GB", { weekday: "long" }),
    year: String(date.getFullYear()),
  }
}

function eventStatus(value: string, today: Date) {
  const date = parseDate(value)
  if (!date) return "scheduled" as const
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  if (start < now) return "past" as const
  if (start === now) return "today" as const
  return "upcoming" as const
}

function sortEvents(events: MinistryFutureEvent[]) {
  return [...events].sort((a, b) => {
    const left = parseDate(a.date)?.getTime() ?? Number.MAX_SAFE_INTEGER
    const right = parseDate(b.date)?.getTime() ?? Number.MAX_SAFE_INTEGER
    return left - right
  })
}

function tabCount(content: MinistrySectionContent, id: TabId) {
  if (id === "history") return content.history?.length ?? 0
  if (id === "articles") return content.articles?.length ?? 0
  if (id === "photos") return content.photos?.length ?? 0
  if (id === "videos") return content.videos?.length ?? 0
  return content.futureEvents?.length ?? 0
}

function EventDateBadge({
  date,
  tone = "default",
}: {
  date: string
  tone?: "default" | "featured" | "past"
}) {
  const parts = dateParts(date)
  const shell =
    tone === "featured"
      ? "border-[#17b3c6] bg-[#0e98ac] text-white shadow-[0_18px_36px_-24px_rgba(14,152,172,0.9)]"
      : tone === "past"
        ? "border-[#d7e4ea] bg-[#f4f8fa] text-[#5c6b7a]"
        : "border-[#cfeaf0] bg-white text-[#023e8a]"

  return (
    <time
      dateTime={date || undefined}
      className={`flex size-[4.75rem] shrink-0 flex-col items-center justify-center rounded-2xl border ${shell}`}
    >
      <span className="font-heading text-3xl leading-none font-bold tracking-tight">{parts.day}</span>
      <span
        className={`mt-1 text-[10px] font-bold tracking-[0.16em] uppercase ${
          tone === "featured" ? "text-white/85" : "text-[#0e98ac]"
        }`}
      >
        {parts.month}
      </span>
    </time>
  )
}

function EventsPanel({ events }: { events: MinistryFutureEvent[] }) {
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => {
    setToday(new Date())
  }, [])

  const ordered = sortEvents(events)
  const nextIndex = today
    ? ordered.findIndex((event) => eventStatus(event.date, today) !== "past")
    : 0
  const featured = ordered[nextIndex >= 0 ? nextIndex : 0]
  const rest = ordered.filter((event) => event !== featured)

  if (!featured) return null

  const featuredStatus = today ? eventStatus(featured.date, today) : "upcoming"
  const featuredParts = dateParts(featured.date)

  return (
    <div role="tabpanel" id="panel-events" aria-labelledby="tab-events" className="space-y-8">
      <article
        className="relative overflow-hidden rounded-[1.75rem] border border-[#d4ebf1] bg-gradient-to-br from-[#f7fcfd] via-white to-[#eef8fb] p-6 sm:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-[#17b3c6]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 size-52 rounded-full bg-[#ffcf4a]/20 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <EventDateBadge
            date={featured.date}
            tone={featuredStatus === "past" ? "past" : "featured"}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#023e8a] px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
                <CalendarDays aria-hidden="true" className="size-3" />
                {featuredStatus === "today"
                  ? "Happening today"
                  : featuredStatus === "past"
                    ? "Recent"
                    : "Next up"}
              </span>
              {featuredParts.weekday ? (
                <span className="text-xs font-semibold tracking-[0.08em] text-[#5c6b7a] uppercase">
                  {featuredParts.weekday}
                  {featuredParts.year ? ` · ${featuredParts.year}` : ""}
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-balance text-[#03202b] sm:text-3xl">
              {featured.title}
            </h3>
            {featured.place ? (
              <p className="mt-3 inline-flex items-start gap-2 text-sm font-semibold text-[#0e98ac]">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>{featured.place}</span>
              </p>
            ) : null}
            {featured.summary ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#3d4b59]">{featured.summary}</p>
            ) : null}
          </div>
        </div>
      </article>

      {rest.length ? (
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Schedule</p>
              <h4 className="mt-1 font-heading text-xl font-semibold text-[#023e8a]">More gatherings</h4>
            </div>
            <p className="text-sm text-[#5c6b7a]">
              {ordered.length} event{ordered.length === 1 ? "" : "s"} listed
            </p>
          </div>

          <ol className="relative space-y-0">
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[2.35rem] w-px bg-gradient-to-b from-[#17b3c6]/50 via-[#cfeaf0] to-transparent sm:left-[2.35rem]"
            />
            {rest.map((event, index) => {
              const status = today ? eventStatus(event.date, today) : "upcoming"
              const parts = dateParts(event.date)
              return (
                <li
                  key={`${event.title}-${event.date}-${index}`}
                  className="relative grid gap-4 py-5 sm:grid-cols-[4.75rem_minmax(0,1fr)] sm:gap-6"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="relative z-10">
                    <EventDateBadge date={event.date} tone={status === "past" ? "past" : "default"} />
                  </div>
                  <div
                    className={`rounded-2xl border px-5 py-4 transition ${
                      status === "past"
                        ? "border-[#e8eef2] bg-[#fafcfd]"
                        : "border-[#d9eef3] bg-white hover:border-[#17b3c6]/55 hover:shadow-[0_20px_40px_-32px_rgba(10,80,98,0.45)]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span
                        className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
                          status === "today"
                            ? "text-[#b45309]"
                            : status === "past"
                              ? "text-[#8a98a6]"
                              : "text-[#0e98ac]"
                        }`}
                      >
                        {status === "today" ? "Today" : status === "past" ? "Past" : "Upcoming"}
                      </span>
                      {parts.weekday ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5c6b7a]">
                          <Clock3 aria-hidden="true" className="size-3.5" />
                          {parts.weekday}
                        </span>
                      ) : null}
                    </div>
                    <h3
                      className={`mt-2 font-heading text-lg font-semibold sm:text-xl ${
                        status === "past" ? "text-[#4a5a68]" : "text-[#023e8a]"
                      }`}
                    >
                      {event.title}
                    </h3>
                    {event.place ? (
                      <p className="mt-2 inline-flex items-start gap-1.5 text-sm font-medium text-[#5c6b7a]">
                        <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                        <span>{event.place}</span>
                      </p>
                    ) : null}
                    {event.summary ? (
                      <p className="mt-2 text-sm leading-7 text-[#3d4b59]">{event.summary}</p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      ) : null}
    </div>
  )
}

export function MinistrySectionContentTabs({ content }: { content: MinistrySectionContent }) {
  const available = TABS.filter((tab) => tabCount(content, tab.id) > 0)
  const [active, setActive] = useState<TabId>(available[0]?.id ?? "history")
  if (!available.length) return null

  const current = available.some((t) => t.id === active) ? active : available[0].id

  return (
    <div>
      <div
        role="tablist"
        aria-label="Section content"
        className="flex gap-1.5 overflow-x-auto rounded-[1.5rem] bg-[#eef7fa] p-1.5 ring-1 ring-[#d7eef3] [-ms-overflow-style:none] [scrollbar-width:none] sm:rounded-full [&::-webkit-scrollbar]:hidden"
      >
        {available.map(({ Icon, ...tab }) => {
          const selected = tab.id === current
          const count = tabCount(content, tab.id)
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={
                selected
                  ? "flex grow shrink-0 items-center justify-center gap-2 rounded-full bg-[#17b3c6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(14,152,172,0.95)] transition sm:text-base"
                  : "flex grow shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#3d4b59] transition hover:bg-white hover:text-[#023e8a] sm:text-base"
              }
            >
              <Icon aria-hidden="true" className={selected ? "size-4 text-white" : "size-4 text-[#17b3c6]"} />
              {tab.label}
              <span
                className={
                  selected
                    ? "rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold text-white"
                    : "rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#0e98ac] ring-1 ring-[#d7eef3]"
                }
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="pt-8">
        {current === "history" ? (
          <div role="tabpanel" id="panel-history" aria-labelledby="tab-history" className="space-y-0">
            {content.history.map((block, i) => (
              <article
                key={`${block.heading}-${i}`}
                className="relative grid gap-4 border-b border-[#e8f2f6] py-8 first:pt-0 last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)]"
              >
                <p className="font-heading text-sm font-bold tracking-[0.14em] text-[#0e98ac] uppercase">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-[#06394a]">{block.heading}</h3>
                  <div className="mt-3 space-y-3 text-base leading-8 text-[#3d4b59]">
                    {block.paragraphs.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
            <p className="pt-4 text-sm text-[#5c6b7a] italic">Source: {ministryStorySource}</p>
          </div>
        ) : null}

        {current === "articles" ? (
          <ul role="tabpanel" id="panel-articles" aria-labelledby="tab-articles" className="grid gap-4">
            {content.articles.map((article) => {
              const href = article.href || "/news"
              const file = /\/api\/files\/|\.pdf($|\?)/i.test(href)
              return (
              <li key={article.title + article.date}>
                <Link
                  href={href}
                  {...(file || /^https?:/i.test(href) ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-[#e2f2f6] bg-white px-5 py-5 transition hover:-translate-y-0.5 hover:border-[#17b3c6]/55 hover:shadow-[0_22px_44px_-34px_rgba(10,80,98,0.5)]"
                >
                  {article.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={encodeURI(article.image)}
                      alt=""
                      className="hidden aspect-[4/3] w-32 shrink-0 rounded-xl object-cover sm:block"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    {article.date || file ? (
                      <p className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#0e98ac] uppercase">
                        {article.date ? formatDate(article.date) : null}
                        {file ? (
                          <span className="rounded-full bg-[#eaf8fb] px-2 py-0.5 text-[10px] tracking-wider text-[#0a5062]">
                            PDF
                          </span>
                        ) : null}
                      </p>
                    ) : null}
                    <h3 className="mt-1 font-heading text-xl font-semibold text-[#023e8a] transition group-hover:text-[#0e98ac]">
                      {article.title}
                    </h3>
                    {article.summary ? (
                      <p className="mt-2 leading-7 text-[#3d4b59]">{article.summary}</p>
                    ) : null}
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-[#17b3c6] opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </Link>
              </li>
              )
            })}
          </ul>
        ) : null}

        {current === "photos" ? (
          <ul
            role="tabpanel"
            id="panel-photos"
            aria-labelledby="tab-photos"
            className="grid gap-4 sm:grid-cols-2"
          >
            {content.photos.map((photo) => (
              <li key={photo.src + photo.caption} className="group overflow-hidden rounded-2xl">
                <figure className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI(photo.src)}
                    alt={photo.alt || ""}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  {photo.caption ? (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#03202b]/85 to-transparent px-4 pt-10 pb-3 text-sm text-white">
                      {photo.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        ) : null}

        {current === "videos" ? (
          <ul
            role="tabpanel"
            id="panel-videos"
            aria-labelledby="tab-videos"
            className="grid gap-4 sm:grid-cols-2"
          >
            {content.videos.map((video) => {
              const fileVideo =
                /\/api\/files\//.test(video.url || "") || /\.mp4($|\?)/i.test(video.url || "")
              return (
                <li key={video.title + video.url}>
                  {fileVideo ? (
                    <figure className="overflow-hidden rounded-2xl bg-[#03202b] text-white ring-1 ring-[#03202b]">
                      <video
                        controls
                        playsInline
                        poster={video.thumbnail ? encodeURI(video.thumbnail) : undefined}
                        className="aspect-video w-full bg-[#06394a]"
                        src={encodeURI(video.url)}
                      >
                        Your browser does not support this video.
                      </video>
                      <figcaption className="block p-4">
                        <span className="font-heading text-lg font-semibold">{video.title}</span>
                        {video.caption ? (
                          <span className="mt-1 block text-sm text-white/75">{video.caption}</span>
                        ) : null}
                      </figcaption>
                    </figure>
                  ) : (
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group block overflow-hidden rounded-2xl bg-[#03202b] text-white ring-1 ring-[#03202b] transition hover:ring-[#17b3c6]"
                    >
                      <span className="relative block aspect-video bg-[#06394a]">
                        {video.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={encodeURI(video.thumbnail)}
                            alt=""
                            className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                          />
                        ) : null}
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="grid size-14 place-items-center rounded-full bg-[#ffcf4a] text-[#03202b] shadow-[0_12px_28px_-10px_rgba(255,207,74,0.8)] transition group-hover:scale-110">
                            <Play aria-hidden="true" className="size-6 fill-current" />
                          </span>
                        </span>
                      </span>
                      <span className="block p-4">
                        <span className="font-heading text-lg font-semibold">{video.title}</span>
                        {video.caption ? (
                          <span className="mt-1 block text-sm text-white/75">{video.caption}</span>
                        ) : null}
                      </span>
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        ) : null}

        {current === "events" ? <EventsPanel events={content.futureEvents} /> : null}
      </div>
    </div>
  )
}
