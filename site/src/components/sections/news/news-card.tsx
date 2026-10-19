import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"

import type { NewsArticle } from "@/content/news"
import { newsSectionTitle } from "@/content/news"

export function readingMinutes(article: NewsArticle) {
  const words = article.paragraphs.join(" ").split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function NewsCategory({ article, light = false }: { article: NewsArticle; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase ${
        light ? "text-[#ffcf4a]" : "text-[#0a8ea0]"
      }`}
    >
      <span aria-hidden="true" className={`h-3 w-1 rounded-full ${light ? "bg-[#ffcf4a]" : "bg-[#17b3c6]"}`} />
      {newsSectionTitle(article.section)}
      {article.sample ? (
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] tracking-[0.12em] ${
            light ? "bg-white/15 text-white" : "bg-[#fff4d1] text-[#8a6100]"
          }`}
        >
          Sample
        </span>
      ) : null}
    </span>
  )
}

export function NewsCard({ article, horizontal = false }: { article: NewsArticle; horizontal?: boolean }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className={`group flex h-full overflow-hidden rounded-2xl bg-white text-[#102a43] ring-1 ring-[#e1e8ee] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_56px_-32px_rgba(10,80,98,0.55)] hover:ring-[#17b3c6]/60 ${
        horizontal ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden ${horizontal ? "aspect-[16/10] md:aspect-auto md:w-1/2" : "aspect-[16/10]"}`}
      >
        <img
          src={article.cover.src}
          alt={article.cover.alt}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className={`flex flex-1 flex-col ${horizontal ? "p-6 md:p-8" : "p-5"}`}>
        <NewsCategory article={article} />
        <h3
          className={`mt-3 font-heading leading-snug font-semibold text-[#03202b] transition group-hover:text-[#0a8ea0] ${
            horizontal ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {article.title}
        </h3>
        <p className={`mt-3 flex-1 leading-7 text-[#5c6b7a] ${horizontal ? "text-base" : "line-clamp-3 text-sm"}`}>
          {article.description}
        </p>
        <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#eef2f5] pt-4 text-xs font-medium text-[#6b7a88]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {article.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3.5" />
            {article.place}
          </span>
        </p>
      </div>
    </Link>
  )
}

export function NewsCompact({ article, rank }: { article: NewsArticle; rank?: number }) {
  return (
    <Link href={`/news/${article.slug}`} className="group flex items-start gap-4 py-4">
      {rank ? (
        <span className="font-heading text-3xl leading-none font-semibold text-[#17b3c6]/40 transition group-hover:text-[#17b3c6]">
          {String(rank).padStart(2, "0")}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <NewsCategory article={article} />
        <p className="mt-1.5 font-heading text-base leading-snug font-semibold text-[#03202b] transition group-hover:text-[#0a8ea0]">
          {article.title}
        </p>
        <p className="mt-1 text-xs text-[#6b7a88]">{article.dateLabel}</p>
      </div>
      <img
        src={article.cover.src}
        alt=""
        className="size-16 shrink-0 rounded-xl object-cover transition duration-500 group-hover:scale-105"
      />
    </Link>
  )
}
