import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, Mail, MapPin, Newspaper } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import {
  NewsCard,
  NewsCategory,
  NewsCompact,
  NewsSecondary,
} from "@/components/sections/news/news-card"
import { NewsTicker } from "@/components/sections/news/news-ticker"
import { newsSections } from "@/content/news"
import { getNews, getSiteInfo } from "@/lib/cms"

export const metadata: Metadata = {
  title: "News",
  description: "News, feasts and pastoral updates from the Oblate Province of Jaffna.",
}

export default async function NewsPage() {
  const [newsArticles, site] = await Promise.all([getNews(), getSiteInfo()])
  const follow = [
    { label: "Facebook", href: site.social.facebook },
    { label: "Instagram", href: site.social.instagram },
    { label: "YouTube", href: site.social.youtube },
  ]
  const sorted = [...newsArticles].sort((a, b) => Number(Boolean(a.sample)) - Number(Boolean(b.sample)))
  const [featured, ...rest] = sorted
  const secondary = rest.slice(0, 3)
  const topStories = rest.slice(0, 5)
  const moreStories = rest.slice(3)

  return (
    <article className="bg-[#f4fbfd] text-[#102a43]">
      <ScrollProgress />

      {/* Hero — brand teal/navy newsroom */}
      <header
        id="news-intro"
        className="relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 pt-16 pb-12 text-white sm:px-8 sm:pt-20 sm:pb-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 -z-10 size-[28rem] rounded-full bg-[#17b3c6]/30 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/4 -z-10 size-64 rounded-full bg-[#ffcf4a]/10 blur-[90px]"
        />
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm">
              <span aria-hidden="true" className="h-px w-10 bg-[#ffcf4a]" />
              OMI Jaffna Newsroom
            </p>
            <h1 className="mt-4 font-heading text-5xl leading-[1.05] font-semibold sm:text-7xl">
              Province <span className="text-[#7fe3ef]">News</span>
            </h1>
            <p className="mt-5 text-base leading-8 text-white/80 sm:text-lg">
              Events, celebrations and pastoral reports from the Oblate Province of Jaffna — island-wide and abroad.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/8 px-5 py-3 backdrop-blur-md">
              <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">Stories</dt>
              <dd className="font-heading text-3xl font-semibold text-[#ffcf4a]">{newsArticles.length}</dd>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/8 px-5 py-3 backdrop-blur-md">
              <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">Sections</dt>
              <dd className="font-heading text-3xl font-semibold text-[#7fe3ef]">{newsSections.length}</dd>
            </div>
          </dl>
        </div>
      </header>

      <NewsTicker articles={newsArticles} />

      {/* High-impact featured + 3 secondary (sports-news landing pattern) */}
      {featured ? (
        <section aria-label="Top stories" className="px-4 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">Headlines</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold text-[#023e8a] sm:text-4xl">Today&apos;s top stories</h2>
              </div>
              <Link
                href="#all-sections"
                className="hidden items-center gap-1.5 text-sm font-semibold text-[#17b3c6] transition hover:text-[#0e98ac] sm:inline-flex"
              >
                Browse all <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] lg:gap-6">
              <Reveal from="up">
                <Link
                  href={`/news/${featured.slug}`}
                  className="group relative block h-full min-h-[22rem] overflow-hidden rounded-[1.75rem] sm:min-h-[28rem]"
                >
                  <img
                    src={featured.cover.src}
                    alt={featured.cover.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03202b] via-[#03202b]/55 to-[#03202b]/10" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                    <span className="inline-flex rounded-full bg-[#17b3c6] px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-white uppercase">
                      Featured
                    </span>
                    <div className="mt-4">
                      <NewsCategory article={featured} light />
                    </div>
                    <h3 className="mt-2 font-heading text-2xl leading-tight font-semibold text-balance text-white sm:text-4xl">
                      {featured.title}
                    </h3>
                    <p className="mt-3 hidden max-w-2xl leading-7 text-white/80 sm:block">{featured.description}</p>
                    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium text-white/70">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays aria-hidden="true" className="size-3.5" />
                        {featured.dateLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin aria-hidden="true" className="size-3.5" />
                        {featured.place}
                      </span>
                    </p>
                  </div>
                </Link>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {secondary.map((article, index) => (
                  <Reveal key={article.slug} from="up" delay={80 + index * 80} className="h-full">
                    <NewsSecondary article={article} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Section chips */}
      <nav aria-label="News sections" className="sticky top-[4.5rem] z-20 border-y border-[#d5e8ef] bg-white/90 backdrop-blur-xl lg:top-[5.5rem]">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-8">
          {newsSections.map((section) => {
            const count = newsArticles.filter((article) => article.section === section.id).length
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#e7fbff] px-4 py-2 text-sm font-semibold text-[#0a5062] ring-1 ring-[#cfeef4] transition hover:bg-[#17b3c6] hover:text-white hover:ring-[#17b3c6]"
                >
                  {section.title}
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-[#0e98ac]">{count}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div id="all-sections" className="scroll-mt-80 px-4 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-16">
            {newsSections.map((section) => {
              const stories = newsArticles.filter((article) => article.section === section.id)
              const [lead, ...restStories] = stories
              return (
                <section id={section.id} key={section.id} className="scroll-mt-80">
                  <Reveal from="up" className="mb-6 flex items-end justify-between gap-4 border-b border-[#d5e8ef] pb-3">
                    <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold text-[#023e8a] sm:text-3xl">
                      <span
                        aria-hidden="true"
                        className="h-7 w-1.5 rounded-full bg-gradient-to-b from-[#ffcf4a] to-[#17b3c6]"
                      />
                      {section.title}
                    </h2>
                    <span className="shrink-0 text-xs font-semibold tracking-[0.16em] text-[#6b7a88] uppercase">
                      {stories.length} {stories.length === 1 ? "story" : "stories"}
                    </span>
                  </Reveal>
                  {lead ? (
                    <div className="space-y-6">
                      <Reveal from="up">
                        <NewsCard article={lead} horizontal />
                      </Reveal>
                      {restStories.length ? (
                        <div className="grid gap-5 sm:grid-cols-2">
                          {restStories.map((article, index) => (
                            <Reveal key={article.slug} from="up" delay={(index % 2) * 100} className="h-full">
                              <NewsCard article={article} />
                            </Reveal>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-[#c9d6df] bg-white px-6 py-8 text-center text-sm leading-6 text-[#6b7a88]">
                      No published story in this section yet. New reports will appear here once released by the Province
                      office.
                    </p>
                  )}
                </section>
              )
            })}

            {moreStories.length > 3 ? (
              <section aria-label="More headlines" className="scroll-mt-80">
                <Reveal from="up" className="mb-6 flex items-end justify-between gap-4 border-b border-[#d5e8ef] pb-3">
                  <h2 className="font-heading text-2xl font-semibold text-[#023e8a] sm:text-3xl">More headlines</h2>
                </Reveal>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {moreStories.slice(0, 6).map((article, index) => (
                    <Reveal key={article.slug} from="up" delay={(index % 3) * 80} className="h-full">
                      <NewsCard article={article} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-36 lg:self-start">
            <div className="overflow-hidden rounded-[1.5rem] bg-white p-6 ring-1 ring-[#dfeaf0] shadow-[0_18px_40px_-32px_rgb(14_152_172/0.35)]">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-[#023e8a]">Most read</h2>
                <Newspaper aria-hidden="true" className="size-5 text-[#17b3c6]" />
              </div>
              <div className="mt-1 divide-y divide-[#eef5f8]">
                {topStories.map((article, index) => (
                  <NewsCompact key={article.slug} article={article} rank={index + 1} />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#06394a] via-[#0a5062] to-[#17b3c6] p-6 text-white shadow-[0_22px_44px_-28px_rgb(14_152_172/0.55)]">
              <Mail aria-hidden="true" className="absolute -right-3 -bottom-3 size-24 text-white/10" />
              <h2 className="font-heading text-lg font-semibold">Share news with us</h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Parishes and communities can send reports and photographs to the Province office.
              </p>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-4 inline-flex rounded-full bg-[#ffcf4a] px-4 py-2.5 text-sm font-semibold text-[#03202b] transition hover:bg-[#ffd966]"
              >
                Email the newsroom
              </a>
            </div>

            <div className="rounded-[1.5rem] bg-white p-6 ring-1 ring-[#dfeaf0]">
              <h2 className="font-heading text-lg font-semibold text-[#023e8a]">Follow the Province</h2>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {follow.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-[#d5e8ef] bg-[#f4fbfd] px-3 py-2.5 text-center text-sm font-semibold text-[#0a5062] transition hover:border-[#17b3c6] hover:bg-[#17b3c6] hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
