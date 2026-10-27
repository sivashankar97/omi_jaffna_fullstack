import Link from "next/link"

import type { NewsArticle } from "@/content/news"

export function NewsTicker({ articles }: { articles: NewsArticle[] }) {
  const items = [...articles, ...articles]
  return (
    <div className="border-y border-[#0e98ac]/35 bg-[#03202b] text-white">
      <div className="mx-auto flex max-w-6xl items-stretch overflow-hidden">
        <p className="relative z-10 flex shrink-0 items-center gap-1.5 bg-[#17b3c6] px-2.5 py-2.5 text-[10px] font-bold tracking-[0.16em] text-white uppercase sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.2em]">
          <span aria-hidden="true" className="news-live-dot size-2 rounded-full bg-[#ffcf4a]" />
          Latest
        </p>
        <div className="news-ticker relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_4%,black_96%,transparent)]">
          <ul className="news-ticker-track">
            {items.map((article, index) => (
              <li key={`${article.slug}-${index}`} aria-hidden={index >= articles.length || undefined}>
                <Link
                  href={`/news/${article.slug}`}
                  tabIndex={index >= articles.length ? -1 : undefined}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs whitespace-nowrap text-white/85 transition hover:text-[#ffcf4a] sm:px-6 sm:text-sm"
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
