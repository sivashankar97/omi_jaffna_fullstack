"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useMemo, useState, type ComponentType } from "react"
import {
  BookOpen,
  CirclePlay,
  Images,
  MessagesSquare,
  Mic,
  Music,
  Newspaper,
  Play,
  Quote,
  X,
} from "lucide-react"

import type { mediaPageDefaults } from "@/content/blocks"
import type { NewsArticle } from "@/content/news"
import type { Ministry } from "@/lib/cms"
import { useSiteInfo } from "@/components/layout/site-info"
import { MediaCircleArrow } from "@/components/sections/media/media-circle-arrow"
import { cn } from "cn"

const panels: Record<string, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  "photo-gallery": Images,
  video: CirclePlay,
  podcasts: Mic,
  songs: Music,
  articles: Newspaper,
  interviews: MessagesSquare,
  "homilies-and-reflections": BookOpen,
  testimonials: Quote,
}

type MediaContent = typeof mediaPageDefaults
export type MediaPhoto = { src: string; alt: string; caption: string; category?: string }
type VideoItem = MediaContent["videos"]["items"][number]
type AudioItem = {
  title: string
  category?: string
  artist?: string
  description?: string
  audio?: string
  coverImage?: string
  url?: string
  date?: string
}
type Social = ReturnType<typeof useSiteInfo>["social"]

function youtubeId(url: string) {
  return url.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/|live\/)([\w-]{11})/)?.[1] ?? ""
}

function isVideoFile(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.startsWith("/api/files/")
}

function resolveHref(url: string, social: Social) {
  if (url === "youtube" || url === "instagram" || url === "facebook") return social[url]
  return url
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href)
}

function fill(text: string, values: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}

function categoriesOf(items: { category?: string }[]) {
  return [...new Set(items.map((item) => item.category?.trim()).filter((value): value is string => !!value))]
}

function useCategory<T extends { category?: string }>(items: T[]) {
  const [category, setCategory] = useState("")
  const categories = useMemo(() => categoriesOf(items), [items])
  const visible = category ? items.filter((item) => item.category?.trim() === category) : items
  return { categories, category, setCategory, visible }
}

function CategoryChips({
  categories,
  category,
  onChange,
}: {
  categories: string[]
  category: string
  onChange: (value: string) => void
}) {
  if (categories.length < 2) return null
  return (
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {["", ...categories].map((value) => (
        <button
          key={value || "all"}
          type="button"
          aria-pressed={category === value}
          onClick={() => onChange(value)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition",
            category === value
              ? "bg-[#17b3c6] text-white ring-[#17b3c6]"
              : "bg-white text-[#3d4b59] ring-[#d7eef3] hover:text-[#023e8a]"
          )}
        >
          {value || "All"}
        </button>
      ))}
    </div>
  )
}

function Intro({ text }: { text?: string }) {
  return text ? <p className="mb-5 max-w-3xl text-sm leading-6 text-[#5c6b7a]">{text}</p> : null
}

export function MediaStudio({
  news,
  ministries,
  quote,
  lede,
  content,
}: {
  news: NewsArticle[]
  ministries: Ministry[]
  quote: string
  lede: string
  content: MediaContent
}) {
  const tabs = useMemo(() => {
    const seen = new Set<string>()
    return (content.desks.tabs ?? []).filter((tab) => {
      if (!tab?.panel || !panels[tab.panel] || seen.has(tab.panel)) return false
      seen.add(tab.panel)
      return true
    })
  }, [content.desks.tabs])
  const [active, setActive] = useState(tabs[0]?.panel ?? "")
  const [photo, setPhoto] = useState<MediaPhoto | null>(null)
  const heading = content.desks

  useLayoutEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace("#", "")
      if (tabs.some((tab) => tab.panel === id)) setActive(id)
    }
    openFromHash()
    window.addEventListener("hashchange", openFromHash)
    return () => window.removeEventListener("hashchange", openFromHash)
  }, [tabs])

  useEffect(() => {
    if (!photo) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhoto(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [photo])

  function choose(id: string) {
    setActive(id)
    const next = `${window.location.pathname}${window.location.search}#${id}`
    window.history.replaceState(null, "", next)
  }

  if (!tabs.length) return null

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
          className="mt-10 flex flex-wrap gap-2 rounded-[1.75rem] bg-[#eef7fa] p-1.5 ring-1 ring-[#d7eef3] xl:flex-nowrap xl:gap-1 xl:rounded-full"
        >
          {tabs.map((tab) => {
            const Icon = panels[tab.panel]
            const selected = tab.panel === active
            return (
              <button
                key={tab.panel}
                type="button"
                role="tab"
                id={tab.panel}
                aria-selected={selected}
                aria-controls={`${tab.panel}-panel`}
                onClick={() => choose(tab.panel)}
                className={cn(
                  "flex grow scroll-mt-80 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition duration-300 xl:gap-1.5 xl:px-2.5 xl:text-[0.78rem]",
                  selected
                    ? "bg-[#17b3c6] text-white shadow-[0_12px_28px_-14px_rgba(14,152,172,0.95)]"
                    : "text-[#3d4b59] hover:bg-white hover:text-[#023e8a]"
                )}
              >
                <Icon aria-hidden className={cn("size-4 shrink-0", selected ? "text-white" : "text-[#17b3c6]")} />
                {tab.label}
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
          {active === "photo-gallery" ? <Gallery photos={content.gallery} onOpen={setPhoto} /> : null}
          {active === "video" ? <VideoStage copy={content.videos} image={content.videoImage} /> : null}
          {active === "podcasts" ? (
            <AudioList intro={content.podcasts.intro} items={content.podcasts.items} />
          ) : null}
          {active === "songs" ? (
            <AudioList intro={content.songs.intro} emptyText={content.songs.emptyText} items={content.songs.items} />
          ) : null}
          {active === "articles" ? <Magazine newsArticles={news} copy={content.articles} /> : null}
          {active === "interviews" ? <Dialogue copy={content.interviews} /> : null}
          {active === "homilies-and-reflections" ? (
            <Readings copy={content.readings} values={{ homeQuote: quote, homeLede: lede }} />
          ) : null}
          {active === "testimonials" ? <Witnesses copy={content.testimonials} ministries={ministries} /> : null}
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
  const { categories, category, setCategory, visible } = useCategory(photos.filter((item) => item?.src))
  return (
    <div>
      <CategoryChips categories={categories} category={category} onChange={setCategory} />
      <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, index) => (
          <li key={`${item.src}-${index}`} className="media-in" style={{ animationDelay: `${index * 50}ms` }}>
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
    </div>
  )
}

function VideoStage({ copy, image }: { copy: MediaContent["videos"]; image: string }) {
  const site = useSiteInfo()
  const [playing, setPlaying] = useState<VideoItem | null>(null)
  const items = (copy.items ?? []).filter((item) => item?.title?.trim() || item?.url?.trim())
  const { categories, category, setCategory, visible } = useCategory(items)
  const notes = (copy.notes ?? []).filter((note) => note?.title || note?.text)

  useEffect(() => {
    if (!playing) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPlaying(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [playing])

  return (
    <div>
      <Intro text={copy.intro} />
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
              <span className="mt-4 block font-heading text-3xl font-semibold sm:text-4xl">{copy.channelTitle}</span>
              <span className="mt-2 block max-w-md text-sm leading-6 text-white/90">{copy.channelText}</span>
            </span>
            <MediaCircleArrow />
          </span>
        </a>
        {notes.length ? (
          <div className="grid gap-3">
            {notes.map((note, index) => (
              <article
                key={`${note.title}-${index}`}
                className="media-in rounded-[1.25rem] bg-white p-5 shadow-[0_14px_32px_-24px_rgba(2,62,138,0.4)] ring-1 ring-[#d7eef3]"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <h3 className="font-heading text-lg font-semibold">{note.title}</h3>
                <p className="mt-2 text-sm leading-6 break-words text-[#5c6b7a]">
                  {fill(note.text, { email: site.contact.email })}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      {items.length ? (
        <div className="mt-8">
          <CategoryChips categories={categories} category={category} onChange={setCategory} />
          <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, index) => {
              const url = item.url?.trim() ?? ""
              const id = youtubeId(url)
              const videoFile = !id && isVideoFile(url)
              const thumb = item.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : videoFile ? "" : image)
              const playable = !!id || videoFile
              const body = (
                <>
                  <span className="relative block aspect-video overflow-hidden bg-[#023e8a]">
                    {thumb ? (
                      <img src={thumb} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    ) : (
                      <video
                        src={`${url}#t=1`}
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute inset-0 grid place-items-center bg-[#023e8a]/20">
                      <span className="grid size-12 place-items-center rounded-full bg-[#17b3c6] text-white shadow-lg">
                        <Play className="size-5 translate-x-px fill-current" />
                      </span>
                    </span>
                  </span>
                  <span className="block px-4 py-4">
                    {item.category || item.date ? (
                      <span className="block text-xs font-semibold tracking-wide text-[#0077b6] uppercase">
                        {[item.category, item.date].filter(Boolean).join(" · ")}
                      </span>
                    ) : null}
                    <span className="mt-1 block font-heading text-lg font-semibold text-[#023e8a]">{item.title}</span>
                    {item.description ? (
                      <span className="mt-1 block text-sm leading-6 text-[#5c6b7a]">{item.description}</span>
                    ) : null}
                  </span>
                </>
              )
              const card =
                "group flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left ring-1 ring-[#d7eef3] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(14,152,172,0.35)]"
              return (
                <li key={`${item.title}-${index}`} className="media-in" style={{ animationDelay: `${index * 50}ms` }}>
                  {playable ? (
                    <button type="button" onClick={() => setPlaying(item)} className={card}>
                      {body}
                    </button>
                  ) : (
                    <a href={url || site.social.youtube} target="_blank" rel="noreferrer" className={card}>
                      {body}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {playing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#03202b]/90 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={playing.title}
        >
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Close video" onClick={() => setPlaying(null)} />
          <div className="relative z-10 w-full max-w-4xl">
            <button
              type="button"
              onClick={() => setPlaying(null)}
              className="absolute -top-3 -right-3 z-20 flex size-10 items-center justify-center rounded-full bg-white text-[#023e8a] shadow-lg transition hover:bg-[#17b3c6] hover:text-white sm:-top-4 sm:-right-4"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={2.5} />
            </button>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
              {youtubeId(playing.url) ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId(playing.url)}?autoplay=1&rel=0`}
                  title={playing.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <video
                  src={playing.url}
                  poster={playing.thumbnail || undefined}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full"
                />
              )}
            </div>
            <p className="mt-3 text-center text-sm text-white">{playing.title}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function AudioList({ intro, emptyText, items }: { intro?: string; emptyText?: string; items: AudioItem[] }) {
  const { social } = useSiteInfo()
  const list = (items ?? []).filter((item) => item?.title?.trim())
  const { categories, category, setCategory, visible } = useCategory(list)
  return (
    <div>
      <Intro text={intro} />
      {!list.length ? (
        emptyText ? (
          <p className="calendar-glass rounded-3xl px-6 py-8 text-center text-sm text-[#5c6b7a]">{emptyText}</p>
        ) : null
      ) : (
        <>
          <CategoryChips categories={categories} category={category} onChange={setCategory} />
          <ol className="calendar-glass divide-y divide-[#d7eef3]/80 overflow-hidden rounded-3xl">
            {visible.map((item, index) => {
              const href = item.url ? resolveHref(item.url.trim(), social) : ""
              const meta = [item.category, item.artist, item.date].filter(Boolean).join(" · ")
              const row = (
                <span className="flex items-start gap-4">
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt=""
                      className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-[#d7eef3] sm:size-20"
                    />
                  ) : (
                    <span className="font-heading text-2xl font-semibold text-[#0077b6]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    {meta ? (
                      <span className="block text-xs font-semibold tracking-[0.2em] text-[#0077b6] uppercase">{meta}</span>
                    ) : null}
                    <span className="mt-1 block font-heading text-xl font-semibold">{item.title}</span>
                    {item.description ? (
                      <span className="mt-1 block text-sm leading-6 text-[#5c6b7a]">{item.description}</span>
                    ) : null}
                  </span>
                </span>
              )
              return (
                <li
                  key={`${item.title}-${index}`}
                  className="media-in px-4 py-5 sm:px-6"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  {href && !item.audio ? (
                    isExternal(href) ? (
                      <a href={href} target="_blank" rel="noreferrer" className="block transition hover:opacity-80">
                        {row}
                      </a>
                    ) : (
                      <Link href={href} className="block transition hover:opacity-80">
                        {row}
                      </Link>
                    )
                  ) : (
                    row
                  )}
                  {item.audio ? (
                    <div className={cn("mt-3 flex flex-wrap items-center gap-3", item.coverImage ? "sm:pl-24" : "sm:pl-12")}>
                      <audio src={item.audio} controls preload="none" className="w-full max-w-md" />
                      {href ? (
                        <a
                          href={href}
                          target={isExternal(href) ? "_blank" : undefined}
                          rel="noreferrer"
                          className="text-sm font-semibold text-[#0e98ac] hover:text-[#023e8a]"
                        >
                          Open link
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </>
      )}
    </div>
  )
}

function Magazine({ newsArticles, copy }: { newsArticles: NewsArticle[]; copy: MediaContent["articles"] }) {
  const [lead, ...rest] = newsArticles
  if (!lead) return <Intro text={copy.intro || "No news has been published yet."} />
  return (
    <div>
      <Intro text={copy.intro} />
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Link
          href={`/news/${lead.slug}`}
          className="media-in media-bento-card media-bento-shine calendar-glass-deep flex min-h-72 flex-col justify-end rounded-3xl p-6 text-white"
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-[#ffcf4a] uppercase">{lead.dateLabel}</p>
          <h3 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">{lead.title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">{lead.description}</p>
          <p className="mt-4 text-sm font-semibold text-[#7fe3ef]">{copy.ctaLabel}</p>
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
    </div>
  )
}

function Dialogue({ copy }: { copy: MediaContent["interviews"] }) {
  const items = (copy.items ?? []).filter((item) => item?.q && item?.a)
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <Intro text={copy.intro} />
      {items.map((item, index) => (
        <div key={`${item.q}-${index}`} className="media-in" style={{ animationDelay: `${index * 40}ms` }}>
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

function Readings({ copy, values }: { copy: MediaContent["readings"]; values: Record<string, string> }) {
  const readings = (copy.items ?? [])
    .map((item) => ({ ...item, text: fill(item?.text ?? "", values).trim() }))
    .filter((item) => item.text && !/^\{\w+\}$/.test(item.text))
  return (
    <div className="mx-auto max-w-3xl">
      <Intro text={copy.intro} />
      <div className="mt-6 space-y-8">
        {readings.map((item, index) => (
          <article
            key={`${item.kicker}-${index}`}
            className="media-in media-bento-card calendar-glass rounded-2xl border-l-4 border-[#17b3c6] p-5"
            style={{ animationDelay: `${index * 55}ms` }}
          >
            <p className="text-xs font-semibold tracking-[0.22em] text-[#0077b6] uppercase">{item.kicker}</p>
            <p
              className={cn(
                "mt-2 text-[#023e8a]",
                index === 0 ? "font-heading text-3xl leading-tight font-semibold sm:text-5xl" : "text-lg leading-8"
              )}
            >
              {item.text}
            </p>
            {item.audio ? <audio src={item.audio} controls preload="none" className="mt-4 w-full max-w-md" /> : null}
          </article>
        ))}
      </div>
    </div>
  )
}

function Witnesses({ copy, ministries }: { copy: MediaContent["testimonials"]; ministries: Ministry[] }) {
  const items = (copy.items ?? []).filter((item) => item?.name?.trim() && item?.text?.trim())
  return (
    <div>
      <Intro text={copy.intro} />
      {items.length ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="media-in media-bento-card calendar-glass rounded-2xl p-5"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Quote aria-hidden className="size-6 text-[#17b3c6]" />
              <p className="mt-3 text-base leading-7 text-[#023e8a]">{item.text}</p>
              <div className="mt-4 flex items-center gap-3">
                {item.image ? <img src={item.image} alt="" className="size-11 rounded-full object-cover" /> : null}
                <div>
                  <p className="font-heading text-base font-semibold">{item.name}</p>
                  {item.place ? <p className="text-xs font-semibold tracking-wide text-[#0077b6] uppercase">{item.place}</p> : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
      )}
    </div>
  )
}
