import Link from "next/link"

import type { NewsArticle } from "@/content/news"

export function NewsTicker({ articles }: { articles: NewsArticle[] }) {
  const items = [...articles, ...articles]
  return (
    <div className="border-y border-[#0a5062]/40 bg-[#021a23] text-white">
      <div className="mx-auto flex max-w-6xl items-stretch">
        <p className="relative z-10 flex shrink-0 items-center gap-2 bg-[#ffcf4a] px-4 py-2.5 text-xs font-bold tracking-[0.2em] text-[#03202b] uppercase">
          <span aria-hidden="true" className="news-live-dot size-2 rounded-full bg-[#03202b]" />
          Latest
        </p>
        <div className="news-ticker relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_4%,black_96%,transparent)]">
          <ul className="news-ticker-track">
            {items.map((article, index) => (
              <li key={`${article.slug}-${index}`} aria-hidden={index >= articles.length || undefined}>
                <Link
                  href={`/news/${article.slug}`}
                  tabIndex={index >= articles.length ? -1 : undefined}
                  className="flex items-center gap-3 px-6 py-2.5 text-sm whitespace-nowrap text-white/85 transition hover:text-[#ffcf4a]"
                >
                  <span aria-hidden="true" className="text-[#17b3c6]">
                    ✦
                  </span>
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
