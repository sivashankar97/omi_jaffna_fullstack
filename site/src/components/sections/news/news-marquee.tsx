"use client"

import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { useEffect, useRef } from "react"

import type { NewsArticle } from "@/content/news"
import { cn } from "cn"

const SPEED = 0.55

export function NewsMarquee({ articles }: { articles: NewsArticle[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track || articles.length === 0) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let offset = 0
    let frame = 0
    const step = () => {
      if (!pausedRef.current) {
        const half = (track.children[articles.length] as HTMLElement | undefined)?.offsetLeft ?? 0
        offset -= SPEED
        if (half > 0 && -offset >= half) offset += half
        track.style.transform = `translate3d(${offset}px, 0, 0)`
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [articles.length])

  const pause = () => {
    pausedRef.current = true
  }
  const resume = () => {
    pausedRef.current = false
  }

  if (articles.length === 0) return null

  return (
    <div className="relative">
      <div
        className="overflow-hidden py-2 sm:py-4"
        onPointerEnter={pause}
        onPointerLeave={resume}
        onPointerDown={pause}
        onFocus={pause}
        onBlur={resume}
      >
        <div ref={trackRef} className="news-marquee-track flex w-max gap-5 will-change-transform sm:gap-6">
          {[...articles, ...articles].map((article, index) => (
            <Link
              key={`${article.slug}-${index}`}
              href={`/news/${article.slug}`}
              aria-hidden={index >= articles.length}
              tabIndex={index >= articles.length ? -1 : undefined}
              className={cn(
                "news-marquee-card group media-bento-card media-bento-shine relative flex w-72 shrink-0 flex-col overflow-hidden rounded-[1.65rem] sm:w-80",
                "calendar-glass"
              )}
              style={{ animationDelay: `${(index % articles.length) * 60}ms` }}
            >
              <div className="relative h-44 overflow-hidden sm:h-48">
                <img
                  src={article.cover.src}
                  alt={article.cover.alt}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#03202b]/55 via-[#03202b]/10 to-transparent opacity-80 transition duration-500 group-hover:opacity-95"
                />
                {article.sample ? (
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-[#0e7f91] uppercase shadow-sm">
                    Sample
                  </span>
                ) : null}
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0a5062] uppercase backdrop-blur-sm">
                  <CalendarDays aria-hidden="true" className="size-3 text-[#17b3c6]" />
                  {article.dateLabel}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-[#17b3c6] uppercase">
                  <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                  {article.place}
                </p>
                <h3 className="mt-2 font-heading text-lg leading-snug font-semibold text-[#0b2a4a] transition group-hover:text-[#0e98ac]">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5c6b7a]">{article.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-[#17b3c6] transition group-hover:gap-2.5 group-hover:text-[#023e8a]">
                  Read story
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#eef8fb] to-transparent sm:w-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#eef8fb] via-[#eef8fb]/85 to-transparent sm:w-44"
      />
      <Link
        href="/news"
        aria-label="More news"
        className="news-marquee-cta absolute top-1/2 right-3 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#17b3c6] text-white shadow-[0_14px_28px_-10px_rgba(23,179,198,0.7)] ring-4 ring-white/90 transition hover:scale-110 hover:bg-[#0e98ac] sm:right-8 sm:size-14"
      >
        <ArrowRight className="size-5 sm:size-6" />
      </Link>
    </div>
  )
}
