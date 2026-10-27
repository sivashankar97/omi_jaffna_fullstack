"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useState } from "react"
import { BookOpen, CirclePlay, Images, MessagesSquare, Mic, Newspaper, Quote, X } from "lucide-react"

import type { NewsArticle } from "@/content/news"
import type { Ministry } from "@/lib/cms"
import { useSiteInfo } from "@/components/layout/site-info"
import { MediaCircleArrow } from "@/components/sections/media/media-circle-arrow"
import { cn } from "cn"

const desks = [
  { id: "photo-gallery", label: "Photo gallery", Icon: Images },
  { id: "video", label: "Video", Icon: CirclePlay },
  { id: "podcasts", label: "Podcasts", Icon: Mic },
  { id: "articles", label: "Articles", Icon: Newspaper },
  { id: "interviews", label: "Interviews", Icon: MessagesSquare },
  { id: "homilies-and-reflections", label: "Homilies and reflections", Icon: BookOpen },
  { id: "testimonials", label: "Testimonials", Icon: Quote },
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
  {
    kicker: "Read",
    title: "Naan",
    text: "A Tamil magazine of the Province for personal growth, reflection and community life.",
    href: "/media#naan",
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
  quote,
  lede,
  photos,
  videoImage,
  desksCopy,
}: {
  news: NewsArticle[]
  ministries: Ministry[]
  quote: string
  lede: string
  photos: MediaPhoto[]
  videoImage: string
  desksCopy?: { kicker: string; title: string; summary: string }
}) {
  const [active, setActive] = useState<DeskId>("photo-gallery")
  const [photo, setPhoto] = useState<MediaPhoto | null>(null)
  const heading = desksCopy ?? {
    kicker: "Media desks",
    title: "Seven ways into the same mission",
    summary: "Choose a desk. Photographs are from the Province collection, not frames of one event.",
  }

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
    <section className="scroll-mt-80 bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase sm:text-sm">{heading.kicker}</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-5xl">{heading.title}</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#5c6b7a] sm:text-base lg:text-right">{heading.summary}</p>
        </div>

        <div
          role="tablist"
          aria-label="Media desks"
          className="mt-10 flex flex-wrap gap-2 rounded-full bg-[#eef7fa] p-1.5 ring-1 ring-[#d7eef3] lg:flex-nowrap lg:gap-1"
        >
          {desks.map(({ Icon, ...desk }) => {
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
                  "flex grow scroll-mt-80 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition duration-300 lg:gap-1.5 lg:px-2.5 lg:text-[0.78rem] xl:px-3 xl:text-sm",
                  selected
                    ? "bg-[#17b3c6] text-white shadow-[0_12px_28px_-14px_rgba(14,152,172,0.95)]"
                    : "text-[#3d4b59] hover:bg-white hover:text-[#023e8a]"
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn("size-4 shrink-0", selected ? "text-white" : "text-[#17b3c6]")}
                />
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
          className="media-panel mt-8 rounded-[1.75rem] bg-[#f7fbfd] p-4 shadow-[0_24px_48px_-32px_rgba(2,62,138,0.35)] ring-1 ring-[#d7eef3] sm:p-6 lg:p-7"
        >
          {active === "photo-gallery" ? <Gallery photos={photos} onOpen={setPhoto} /> : null}
          {active === "video" ? <VideoStage image={videoImage} /> : null}
          {active === "podcasts" ? <Playlist /> : null}
          {active === "articles" ? <Magazine newsArticles={news} /> : null}
          {active === "interviews" ? <Dialogue /> : null}
          {active === "homilies-and-reflections" ? <Readings quote={quote} lede={lede} /> : null}
          {active === "testimonials" ? <Witnesses ministries={ministries} /> : null}
        </div>
      </div>

      {photo ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#03202b]/85 p-4 sm:p-6"
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
          <figure className="relative z-10 w-full max-w-md sm:max-w-lg">
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="absolute -top-3 -right-3 z-20 flex size-10 items-center justify-center rounded-full bg-white text-[#023e8a] shadow-lg transition hover:bg-[#17b3c6] hover:text-white sm:-top-4 sm:-right-4"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={2.5} />
            </button>
            <img
              src={photo.src}
              alt={photo.alt}
              className="mx-auto max-h-[52svh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm text-white">{photo.caption}</figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  )
}

function Gallery({ photos, onOpen }: { photos: MediaPhoto[]; onOpen: (photo: MediaPhoto) => void }) {
  return (
    <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
      {photos.map((item, index) => (
        <li key={item.src} className="media-in" style={{ animationDelay: `${index * 50}ms` }}>
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left ring-1 ring-[#d7eef3] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(14,152,172,0.35)]"
          >
            <span className="relative block aspect-[4/3] overflow-hidden">
              <img
                src={item.src}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            </span>
            <span className="px-3.5 py-3.5 text-sm leading-6 text-[#023e8a]">{item.caption}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function VideoStage({ image }: { image: string }) {
  const site = useSiteInfo()
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
      <a
        href={site.social.youtube}
        target="_blank"
        rel="noreferrer"
        className="group media-in relative flex min-h-64 items-end overflow-hidden rounded-[1.5rem] p-6 text-white shadow-[0_22px_44px_-28px_rgba(2,62,138,0.55)] sm:min-h-80"
      >
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#023e8a] via-[#023e8a]/55 to-transparent" />
        <span className="relative flex w-full items-end justify-between gap-4">
          <span>
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-[#17b3c6] text-xl text-white shadow-lg">
              ▶
            </span>
            <span className="mt-4 block font-heading text-3xl font-semibold sm:text-4xl">Oblate Jaffna TV</span>
            <span className="mt-2 block max-w-md text-sm leading-6 text-white/90">
              Open the official YouTube channel of the Province.
            </span>
          </span>
          <MediaCircleArrow />
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
            className="media-in rounded-[1.25rem] bg-white p-5 shadow-[0_14px_32px_-24px_rgba(2,62,138,0.4)] ring-1 ring-[#d7eef3]"
            style={{ animationDelay: `${index * 60}ms` }}
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
        A podcast series has not been published. The rows below are the public voices already named by the Province: the channel, the bulletin and the magazines.
      </p>
      <ol className="calendar-glass mt-5 divide-y divide-[#d7eef3]/80 overflow-hidden rounded-3xl">
        {listens.map((item, index) => (
          <li key={item.title} className="media-in" style={{ animationDelay: `${index * 70}ms` }}>
            {item.external ? (
              <a href={social[item.href]} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-4 py-5 transition hover:bg-white/55 sm:px-6">
                <RowBody index={index} item={item} />
              </a>
            ) : (
              <Link href={item.href} className="flex items-center gap-4 px-4 py-5 transition hover:bg-white/55 sm:px-6">
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
        className="media-in media-bento-card media-bento-shine calendar-glass-deep flex min-h-72 flex-col justify-end rounded-3xl p-6 text-white"
      >
        <p className="text-xs font-semibold tracking-[0.22em] text-[#ffcf4a] uppercase">{lead.dateLabel}</p>
        <h3 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">{lead.title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">{lead.description}</p>
        <p className="mt-4 text-sm font-semibold text-[#7fe3ef]">Open the full report</p>
      </Link>
      <ul className="grid gap-3">
        {rest.map((article, index) => (
          <li key={article.slug} className="media-in" style={{ animationDelay: `${(index + 1) * 60}ms` }}>
            <Link
              href={`/news/${article.slug}`}
              className="media-bento-card calendar-glass block rounded-2xl p-4 transition hover:bg-white/80"
            >
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
              "media-bento-card mt-1 max-w-xl rounded-2xl px-4 py-3 text-sm leading-6",
              index % 2 === 0
                ? "calendar-glass-deep mr-auto rounded-tl-sm text-white"
                : "calendar-glass ml-auto rounded-tr-sm"
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
          <article
            key={item.kicker}
            className="media-in media-bento-card calendar-glass rounded-2xl border-l-4 border-[#17b3c6] p-5"
            style={{ animationDelay: `${index * 55}ms` }}
          >
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
            key={`${item.number}-${item.title}`}
            className="media-in media-bento-card media-bento-shine calendar-glass rounded-2xl p-4"
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
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

