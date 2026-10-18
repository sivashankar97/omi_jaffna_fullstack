"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"

import type { NewsArticle } from "@/content/news"

const SPEED = 0.6

export function NewsMarquee({ articles }: { articles: NewsArticle[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let offset = 0
    let frame = 0
    const step = () => {
      if (!pausedRef.current) {
        const half = (track.children[articles.length] as HTMLElement | undefined)?.offsetLeft ?? 0
        offset -= SPEED
        if (-offset >= half) offset += half
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

  return (
    <div className="relative">
      <div
        className="overflow-hidden py-4"
        onPointerEnter={pause}
        onPointerLeave={resume}
        onPointerDown={pause}
        onFocus={pause}
        onBlur={resume}
      >
        <div ref={trackRef} className="flex w-max gap-6 will-change-transform">
          {[...articles, ...articles].map((article, index) => (
            <Link
              key={`${article.slug}-${index}`}
              href={`/news/${article.slug}`}
              aria-hidden={index >= articles.length}
              tabIndex={index >= articles.length ? -1 : undefined}
              className="group flex w-72 shrink-0 flex-col overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_rgb(2_40_70/0.1)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_40px_rgb(2_40_70/0.18)] sm:w-80"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.cover.src}
                  alt={article.cover.alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                {article.sample ? (
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-[#0e7f91] uppercase">
                    Sample
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#17b3c6] uppercase">
                  {article.place}
                </p>
                <h3 className="mt-2 font-heading text-lg leading-snug font-semibold text-[#0b2a4a]">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5c6b7a]">{article.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f7fbff] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#f7fbff] via-[#f7fbff]/80 to-transparent"
      />
      <Link
        href="/news"
        aria-label="More news"
        className="absolute top-1/2 right-4 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#17b3c6] text-white shadow-lg ring-4 ring-white transition hover:scale-110 hover:bg-[#0f9fb4] sm:right-8"
      >
        <ArrowRight className="size-6" />
      </Link>
    </div>
  )
}
