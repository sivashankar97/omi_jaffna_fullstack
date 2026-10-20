"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useState } from "react"

import type { NewsArticle } from "@/content/news"
import type { Ministry, TimelineEntry } from "@/lib/cms"
import { useSiteInfo } from "@/components/layout/site-info"
import { cn } from "cn"

const desks = [
  { id: "photo-gallery", label: "Photo gallery" },
  { id: "video", label: "Video" },
  { id: "podcasts", label: "Podcasts" },
  { id: "articles", label: "Articles" },
  { id: "interviews", label: "Interviews" },
  { id: "homilies-and-reflections", label: "Homilies and reflections" },
  { id: "testimonials", label: "Testimonials" },
  { id: "historical-archive", label: "Historical archive" },
] as const

type DeskId = (typeof desks)[number]["id"]

export type MediaPhoto = { src: string; alt: string; caption: string }

const listens = [
  {
    kicker: "Watch",
    title: "Oblate Jaffna TV",
    text: "The official YouTube channel of the Province. New programmes are published there.",
    href: "youtube",
    external: true,
  },
  {
    kicker: "Read",
    title: "Yazha-Thoni",
    text: "The official news bulletin of the Oblate Province of Jaffna. The Lyre Boat.",
    href: "/media#yazha-thoni",
    external: false,
  },
  {
    kicker: "Read",
    title: "Zeal",
    text: "A scholastic publication of reflections, articles and community news.",
    href: "/media#zeal",
    external: false,
  },
] as const

const answers = [
  {
    q: "Who is speaking?",
    a: "The Oblate Province of Jaffna, part of the Missionary Oblates of Mary Immaculate. These lines are published Province statements, not a recorded interview.",
  },
  {
    q: "When did the mission reach this island?",
    a: "The Oblate missionary presence in Sri Lanka began in 1847. The first Oblates reached Jaffna in 1848.",
  },
  {
    q: "What is the charism?",
    a: "Evangelizing the poor. Presence, accompaniment, education, compassion, justice, reconciliation and service.",
  },
  {
    q: "What is the mission?",
    a: "Empowered by the Good News, we work for a healing society in and through the light of the Good News.",
  },
  {
    q: "What is the vision?",
    a: "A life towards a renewed, just and free society.",
  },
  {
    q: "Who leads the Province now?",
    a: "Very Rev. Fr. Paul Jeyanthan Pachchek, OMI, Provincial Superior, 2023–2026. The house is Thodarpaham, 657/1 Hospital Road, Jaffna.",
  },
] as const

type Reading = { kicker: string; text: string }

const fixedReadings: Reading[] = [
  {
    kicker: "Charism",
    text: "Evangelizing the poor. Presence, accompaniment, education, compassion, justice, reconciliation and service.",
  },
  {
    kicker: "Mission",
    text: "Empowered by the Good News, we work for a healing society in and through the light of the Good News.",
  },
  {
    kicker: "Vision",
    text: "A life towards a renewed, just and free society.",
  },
]

function isDesk(value: string): value is DeskId {
  return desks.some((desk) => desk.id === value)
}

export function MediaStudio({
  news,
  ministries,
  timeline,
  quote,
  lede,
  photos,
  videoImage,
}: {
  news: NewsArticle[]
  ministries: Ministry[]
  timeline: TimelineEntry[]
  quote: string
  lede: string
  photos: MediaPhoto[]
  videoImage: string
}) {
  const [active, setActive] = useState<DeskId>("photo-gallery")
  const [photo, setPhoto] = useState<MediaPhoto | null>(null)

  useLayoutEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace("#", "")
      if (!isDesk(id)) return
      setActive(id)
    }
    openFromHash()
    window.addEventListener("hashchange", openFromHash)
    return () => window.removeEventListener("hashchange", openFromHash)
  }, [])

  useEffect(() => {
    if (!photo) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhoto(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [photo])

  function choose(id: DeskId) {
    setActive(id)
    const next = `${window.location.pathname}${window.location.search}#${id}`
    window.history.replaceState(null, "", next)
  }

  return (
    <section className="border-t border-[#90e0ef] bg-white px-4 py-10 text-[#023e8a] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">Media desks</p>
        <h2 className="mt-3 max-w-2xl text-sm font-semibold tracking-[0.18em] text-[#0077b6] uppercase">
          Eight ways to enter the same mission
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5c6b7a] sm:text-base">
          Choose a desk. Each one opens in its own form. Photographs are from the Province collection. They are not offered as frames of one event.
        </p>

        <div
          role="tablist"
          aria-label="Media desks"
          className="mt-6 flex gap-2 overflow-x-auto pb-1"
        >
          {desks.map((desk) => {
            const selected = desk.id === active
            return (
              <button
                key={desk.id}
                type="button"
                role="tab"
                id={desk.id}
                aria-selected={selected}
                aria-controls={`${desk.id}-panel`}
                onClick={() => choose(desk.id)}
                className={cn(
                  "scroll-mt-80 shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold transition",
                  selected
                    ? "border-[#023e8a] bg-[#023e8a] text-white"
                    : "border-[#90e0ef] bg-[#e7fbff] text-[#023e8a] hover:bg-[#caf0f8]"
                )}
              >
                {desk.label}
              </button>
            )
          })}
        </div>

        <div
          key={active}
          role="tabpanel"
          id={`${active}-panel`}
          aria-labelledby={active}
          className="media-panel mt-8"
        >
          {active === "photo-gallery" ? <Gallery photos={photos} onOpen={setPhoto} /> : null}
          {active === "video" ? <VideoStage image={videoImage} /> : null}
          {active === "podcasts" ? <Playlist /> : null}
          {active === "articles" ? <Magazine newsArticles={news} /> : null}
          {active === "interviews" ? <Dialogue /> : null}
          {active === "homilies-and-reflections" ? <Readings quote={quote} lede={lede} /> : null}
          {active === "testimonials" ? <Witnesses ministries={ministries} /> : null}
          {active === "historical-archive" ? <Archive timeline={timeline} /> : null}
        </div>
      </div>

      {photo ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#053228]/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close photograph"
            onClick={() => setPhoto(null)}
          />
          <figure className="relative z-10 w-full max-w-4xl">
            <img src={photo.src} alt={photo.alt} className="max-h-[78svh] w-full rounded-2xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white">{photo.caption}</figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  )
}

function Gallery({ photos, onOpen }: { photos: MediaPhoto[]; onOpen: (photo: MediaPhoto) => void }) {
  return (
    <div>
      <p className="text-sm leading-6 text-[#5c6b7a]">
        Tap a photograph to open it large. Six pictures from the collection held for this website.
      </p>
      <ul className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
        {photos.map((item, index) => (
          <li key={item.src} className="media-in" style={{ animationDelay: `${index * 40}ms` }}>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="group block w-full overflow-hidden rounded-2xl border-2 border-[#90e0ef] bg-[#e7fbff] text-left"
            >
              <img src={item.src} alt="" className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-52" />
              <span className="block px-3 py-3 text-sm leading-5 text-[#023e8a]">{item.caption}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function VideoStage({ image }: { image: string }) {
  const site = useSiteInfo()
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
      <a
        href={site.social.youtube}
        target="_blank"
        rel="noreferrer"
        className="media-in relative flex min-h-64 items-end overflow-hidden rounded-3xl border-2 border-[#90e0ef] bg-[#023e8a] p-6 text-white sm:min-h-80"
      >
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <span className="relative">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-[#023e8a]">
            ▶
          </span>
          <span className="mt-4 block font-heading text-3xl font-semibold sm:text-4xl">Oblate Jaffna TV</span>
          <span className="mt-2 block max-w-md text-sm leading-6 text-white/90">
            Open the official YouTube channel. The arch behind this title is a Province photograph, not a frame from a film.
          </span>
        </span>
      </a>
      <div className="grid gap-3">
        {[
          ["Channel", "Oblate Jaffna TV, the official YouTube channel of the Oblate Province of Jaffna."],
          ["On the channel", "நற்கருணை ஆராதனை is one programme listed there. This page does not invent a full catalogue."],
          ["Write", site.contact.email],
        ].map(([title, text], index) => (
          <article
            key={title}
            className="media-in rounded-2xl border-2 border-[#90e0ef] bg-[#e7fbff] p-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <h3 className="font-heading text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#5c6b7a]">{text}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function Playlist() {
  const { social } = useSiteInfo()
  return (
    <div>
      <p className="text-sm leading-6 text-[#5c6b7a]">
        A podcast series has not been published. The rows below are the public voices already named by the Province: the channel, the bulletin and the magazine.
      </p>
      <ol className="mt-5 divide-y divide-[#90e0ef] overflow-hidden rounded-3xl border-2 border-[#90e0ef]">
        {listens.map((item, index) => (
          <li key={item.title} className="media-in bg-white" style={{ animationDelay: `${index * 60}ms` }}>
            {item.external ? (
              <a href={social[item.href]} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-4 py-5 transition hover:bg-[#e7fbff] sm:px-6">
                <RowBody index={index} item={item} />
              </a>
            ) : (
              <Link href={item.href} className="flex items-center gap-4 px-4 py-5 transition hover:bg-[#e7fbff] sm:px-6">
                <RowBody index={index} item={item} />
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

function RowBody({
  index,
  item,
}: {
  index: number
  item: (typeof listens)[number]
}) {
  return (
    <>
      <span className="font-heading text-2xl font-semibold text-[#0077b6]">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold tracking-[0.2em] text-[#0077b6] uppercase">{item.kicker}</span>
        <span className="mt-1 block font-heading text-xl font-semibold">{item.title}</span>
        <span className="mt-1 block text-sm leading-6 text-[#5c6b7a]">{item.text}</span>
      </span>
    </>
  )
}

function Magazine({ newsArticles }: { newsArticles: NewsArticle[] }) {
  const [lead, ...rest] = newsArticles
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <Link
        href={`/news/${lead.slug}`}
        className="media-in flex min-h-72 flex-col justify-end rounded-3xl border-2 border-[#90e0ef] bg-[#e7fbff] p-6"
      >
        <p className="text-xs font-semibold tracking-[0.22em] text-[#0077b6] uppercase">{lead.dateLabel}</p>
        <h3 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">{lead.title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c6b7a] sm:text-base">{lead.description}</p>
        <p className="mt-4 text-sm font-semibold">Open the full report</p>
      </Link>
      <ul className="grid gap-3">
        {rest.map((article, index) => (
          <li key={article.slug} className="media-in" style={{ animationDelay: `${(index + 1) * 50}ms` }}>
            <Link href={`/news/${article.slug}`} className="block rounded-2xl border-2 border-[#90e0ef] bg-white p-4 transition hover:bg-[#e7fbff]">
              <p className="text-xs font-semibold tracking-wide text-[#0077b6]">{article.dateLabel}</p>
              <h3 className="mt-1 font-heading text-lg font-semibold">{article.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5c6b7a]">{article.place}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Dialogue() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <p className="text-sm leading-6 text-[#5c6b7a]">
        No recorded interview is published on this page. The answers are the Province’s own published lines.
      </p>
      {answers.map((item, index) => (
        <div key={item.q} className="media-in" style={{ animationDelay: `${index * 40}ms` }}>
          <p className={cn("max-w-md text-sm font-semibold", index % 2 === 0 ? "mr-auto" : "ml-auto text-right")}>
            {item.q}
          </p>
          <p
            className={cn(
              "mt-1 max-w-xl rounded-2xl border-2 border-[#90e0ef] bg-[#e7fbff] px-4 py-3 text-sm leading-6",
              index % 2 === 0 ? "mr-auto rounded-tl-sm" : "ml-auto rounded-tr-sm bg-white"
            )}
          >
            {item.a}
          </p>
        </div>
      ))}
    </div>
  )
}

function Readings({ quote, lede }: { quote: string; lede: string }) {
  const readings = [
    { kicker: "The sending", text: quote },
    { kicker: "The journey", text: lede },
    ...fixedReadings,
  ].filter((item) => item.text)
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm leading-6 text-[#5c6b7a]">
        Homily manuscripts are not published here. These are the texts the Province already gives for prayer and mission.
      </p>
      <div className="mt-6 space-y-8">
        {readings.map((item, index) => (
          <article key={item.kicker} className="media-in border-l-4 border-[#90e0ef] pl-5" style={{ animationDelay: `${index * 45}ms` }}>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#0077b6] uppercase">{item.kicker}</p>
            <p className={cn("mt-2 text-[#023e8a]", index === 0 ? "font-heading text-3xl leading-tight font-semibold sm:text-5xl" : "text-lg leading-8")}>
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

function Witnesses({ ministries }: { ministries: Ministry[] }) {
  return (
    <div>
      <p className="max-w-2xl text-sm leading-6 text-[#5c6b7a]">
        Personal testimonies are not published until a person has agreed to the words. What follows is the public list of seventeen ministries, the works through which the Province already serves.
      </p>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ministries.map((item, index) => (
          <li
            key={item.number}
            className="media-in rounded-2xl border-2 border-[#90e0ef] bg-[#e7fbff] p-4"
            style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
          >
            <p className="font-heading text-2xl font-semibold text-[#0077b6]">{item.number}</p>
            <h3 className="mt-2 font-heading text-lg font-semibold">{item.title}</h3>
            <p className="mt-1 text-xs font-semibold tracking-wide text-[#0077b6] uppercase">{item.place}</p>
            <p className="mt-2 text-sm leading-6 text-[#5c6b7a]">{item.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Archive({ timeline }: { timeline: TimelineEntry[] }) {
  const [year, setYear] = useState<string>(timeline[timeline.length - 1].year)
  const current = timeline.find((item) => item.year === year) ?? timeline[0]

  return (
    <div>
      <p className="text-sm leading-6 text-[#5c6b7a]">
        Open a year. The line is the published journey of the Oblate Province of Jaffna, from 1816 to 2026.
      </p>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {timeline.map((item) => (
          <button
            key={item.year}
            type="button"
            onClick={() => setYear(item.year)}
            aria-pressed={item.year === year}
            className={cn(
              "shrink-0 rounded-2xl border-2 px-4 py-3 font-heading text-xl font-semibold",
              item.year === year ? "border-[#023e8a] bg-[#023e8a] text-white" : "border-[#90e0ef] bg-white text-[#023e8a]"
            )}
          >
            {item.year}
          </button>
        ))}
      </div>
      <article key={current.year} className="media-in mt-4 rounded-3xl border-2 border-[#90e0ef] bg-[#e7fbff] p-6 sm:p-8">
        <p className="font-heading text-5xl font-semibold sm:text-7xl">{current.year}</p>
        <p className="mt-4 max-w-2xl text-lg leading-8">{current.text}</p>
      </article>
    </div>
  )
}
