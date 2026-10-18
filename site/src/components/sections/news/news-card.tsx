import Link from "next/link"

import type { NewsArticle } from "@/content/news"
import { newsSectionTitle } from "@/content/news"

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white text-[#023e8a] shadow-sm ring-1 ring-[#d5dee6] transition duration-300 hover:-translate-y-1 hover:ring-[#023e8a]"
    >
      <img
        src={article.cover.src}
        alt={article.cover.alt}
        className="h-52 w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#0077b6] uppercase">
          {newsSectionTitle(article.section)}
        </p>
        <h3 className="mt-2 font-heading text-2xl leading-tight font-semibold">
          {article.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#5c6b7a]">{article.description}</p>
        <p className="mt-4 text-xs font-semibold tracking-wide text-[#0077b6]">
          {article.dateLabel}
        </p>
      </div>
    </Link>
  )
}
