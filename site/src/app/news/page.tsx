import type { Metadata } from "next"

import { NewsCard } from "@/components/sections/news/news-card"
import { newsSections } from "@/content/news"
import { getNews } from "@/lib/cms"

export const metadata: Metadata = {
  title: "News",
  description: "News, feasts and pastoral updates from the Oblate Province of Jaffna.",
}

export default async function NewsPage() {
  const newsArticles = await getNews()
  return (
    <article>
      <header
        id="news-intro"
        className="relative scroll-mt-80 overflow-hidden bg-gradient-to-br from-white via-[#e7fbff] to-[#caf0f8] text-[#023e8a]"
      >
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
          <p className="max-w-3xl font-heading text-4xl leading-tight font-semibold text-balance text-[#023e8a] sm:text-6xl">
            Province news
          </p>
          <h1 className="mt-4 text-sm font-semibold tracking-[0.22em] text-[#0077b6] uppercase">
            A living record of the Province
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5c6b7a]">
            Each card opens the full report: the date, the place, the published account and photographs from the Province. Mass times stay off this page until a parish confirms them.
          </p>
        </div>
      </header>

      <nav aria-label="News sections" className="border-b border-[#90e0ef] bg-white">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-8">
          {newsSections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                className="inline-block rounded-full px-3 py-1.5 text-sm font-semibold text-[#023e8a] transition hover:bg-[#e7fbff]"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-[#f7fbff] px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-16">
          {newsSections.map((section) => {
            const stories = newsArticles.filter((article) => article.section === section.id)
            return (
              <section id={section.id} key={section.id} className="scroll-mt-80">
                <h2 className="font-heading text-3xl font-semibold text-[#023e8a]">{section.title}</h2>
                {stories.length === 0 ? (
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5c6b7a]">
                    No published story is listed in this section yet.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stories.map((article) => (
                      <NewsCard key={article.slug} article={article} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </article>
  )
}
