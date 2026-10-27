import Link from "next/link"
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react"

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
        light ? "text-[#7fe3ef]" : "text-[#17b3c6]"
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
      className={`group media-bento-card media-bento-shine flex h-full overflow-hidden rounded-[1.5rem] bg-white text-[#102a43] ring-1 ring-[#dfeaf0] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_56px_-32px_rgba(14,152,172,0.45)] hover:ring-[#17b3c6]/50 ${
        horizontal ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden ${horizontal ? "aspect-[16/10] md:aspect-auto md:w-[46%]" : "aspect-[16/10]"}`}
      >
        <img
          src={article.cover.src}
          alt={article.cover.alt}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#03202b]/35 via-transparent to-transparent opacity-80"
        />
      </div>
      <div className={`flex flex-1 flex-col ${horizontal ? "p-6 md:p-8" : "p-5"}`}>
        <NewsCategory article={article} />
        <h3
          className={`mt-3 font-heading leading-snug font-semibold text-[#023e8a] transition group-hover:text-[#0e98ac] ${
            horizontal ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {article.title}
        </h3>
        <p className={`mt-3 flex-1 leading-7 text-[#5c6b7a] ${horizontal ? "text-base" : "line-clamp-3 text-sm"}`}>
          {article.description}
        </p>
        <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#eef5f8] pt-4 text-xs font-medium text-[#6b7a88]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-3.5 text-[#17b3c6]" />
            {article.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3.5 text-[#17b3c6]" />
            {article.place}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[#17b3c6] opacity-0 transition group-hover:opacity-100">
            Read <ArrowUpRight className="size-3.5" />
          </span>
        </p>
      </div>
    </Link>
  )
}

/** Small secondary story used next to the featured hero. */
export function NewsSecondary({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex h-full gap-4 overflow-hidden rounded-[1.25rem] bg-white p-3 ring-1 ring-[#dfeaf0] transition hover:-translate-y-0.5 hover:ring-[#17b3c6]/55 hover:shadow-[0_18px_36px_-28px_rgba(14,152,172,0.55)]"
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
        <img
          src={article.cover.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1 py-1">
        <NewsCategory article={article} />
        <p className="mt-2 line-clamp-3 font-heading text-[15px] leading-snug font-semibold text-[#023e8a] transition group-hover:text-[#0e98ac]">
          {article.title}
        </p>
        <p className="mt-2 text-xs text-[#6b7a88]">{article.dateLabel}</p>
      </div>
    </Link>
  )
}

export function NewsCompact({ article, rank }: { article: NewsArticle; rank?: number }) {
  return (
    <Link href={`/news/${article.slug}`} className="group flex items-start gap-4 py-4">
      {rank ? (
        <span className="font-heading text-3xl leading-none font-semibold text-[#17b3c6]/35 transition group-hover:text-[#17b3c6]">
          {String(rank).padStart(2, "0")}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <NewsCategory article={article} />
        <p className="mt-1.5 font-heading text-base leading-snug font-semibold text-[#023e8a] transition group-hover:text-[#0e98ac]">
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
