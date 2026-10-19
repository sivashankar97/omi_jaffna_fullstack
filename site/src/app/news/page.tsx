import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, Mail, MapPin, Newspaper } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { NewsCard, NewsCategory, NewsCompact } from "@/components/sections/news/news-card"
import { NewsTicker } from "@/components/sections/news/news-ticker"
import { site } from "@/config/site"
import { newsSections } from "@/content/news"
import { getNews } from "@/lib/cms"

export const metadata: Metadata = {
  title: "News",
  description: "News, feasts and pastoral updates from the Oblate Province of Jaffna.",
}

const follow = [
  { label: "Facebook", href: site.social.facebook },
  { label: "Instagram", href: site.social.instagram },
  { label: "YouTube", href: site.social.youtube },
  { label: "WhatsApp", href: site.social.whatsapp },
]

export default async function NewsPage() {
  const newsArticles = await getNews()
  const [featured, ...others] = [...newsArticles].sort((a, b) => Number(Boolean(a.sample)) - Number(Boolean(b.sample)))
  const topStories = others.slice(0, 4)

  return (
    <article className="bg-[#f6f9fb] text-[#102a43]">
      <ScrollProgress />
      <header
        id="news-intro"
        className="relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 pt-16 pb-14 text-white sm:px-8 sm:pt-20"
      >
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -top-40 -right-32 -z-10 size-[26rem] rounded-full bg-[#17b3c6] opacity-25 blur-[120px]"
        />
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p
              className="history-rise flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm"
              style={{ "--rise-delay": "100ms" } as React.CSSProperties}
            >
              <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
              OMI Jaffna Newsroom
            </p>
            <h1
              className="history-rise mt-4 font-heading text-5xl leading-[1.05] font-semibold sm:text-7xl"
              style={{ "--rise-delay": "250ms", color: "#ffffff" } as React.CSSProperties}
            >
              Province News
            </h1>
            <p
              className="history-rise mt-5 text-base leading-8 text-white/80 sm:text-lg"
              style={{ "--rise-delay": "400ms" } as React.CSSProperties}
            >
              Events, celebrations and pastoral reports from the Oblate Province of Jaffna, island-wide and abroad.
            </p>
          </div>
          <dl
            className="history-rise grid grid-cols-2 gap-3"
            style={{ "--rise-delay": "550ms" } as React.CSSProperties}
          >
            <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-sm">
              <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">Stories</dt>
              <dd className="font-heading text-3xl font-semibold text-[#ffcf4a]">{newsArticles.length}</dd>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-sm">
              <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">Sections</dt>
              <dd className="font-heading text-3xl font-semibold text-[#ffcf4a]">{newsSections.length}</dd>
            </div>
          </dl>
        </div>
      </header>

      <NewsTicker articles={newsArticles} />

      {featured ? (
        <section aria-label="Top stories" className="bg-white px-4 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.6fr_1fr]">
            <Reveal from="up">
              <Link href={`/news/${featured.slug}`} className="group relative block overflow-hidden rounded-[1.75rem]">
                <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                  <img
                    src={featured.cover.src}
                    alt={featured.cover.alt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021a23] via-[#021a23]/55 to-transparent" />
                  <span aria-hidden="true" className="history-shine pointer-events-none absolute inset-0" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                  <span className="inline-block rounded-full bg-[#ffcf4a] px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-[#03202b] uppercase">
                    Featured
                  </span>
                  <div className="mt-4">
                    <NewsCategory article={featured} light />
                  </div>
                  <h2
                    className="mt-2 font-heading text-2xl leading-tight font-semibold text-balance sm:text-4xl"
                    style={{ color: "#ffffff" }}
                  >
                    {featured.title}
                  </h2>
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

            <Reveal from="up" delay={150}>
              <div className="flex items-center justify-between border-b-2 border-[#03202b] pb-3">
                <h2 className="font-heading text-xl font-semibold text-[#03202b]">Top stories</h2>
                <Newspaper aria-hidden="true" className="size-5 text-[#17b3c6]" />
              </div>
              <div className="divide-y divide-[#e6edf2]">
                {topStories.map((article, index) => (
                  <NewsCompact key={article.slug} article={article} rank={index + 1} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <nav aria-label="News sections" className="border-y border-[#e1e8ee] bg-white">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-8">
          {newsSections.map((section) => {
            const count = newsArticles.filter((article) => article.section === section.id).length
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className="inline-flex items-center gap-2 border-b-2 border-transparent px-3 py-4 text-sm font-semibold text-[#3d4b59] transition hover:border-[#17b3c6] hover:text-[#0a5062]"
                >
                  {section.title}
                  <span className="rounded-full bg-[#eef6f8] px-2 py-0.5 text-[11px] text-[#0a8ea0]">{count}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-4 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-16">
            {newsSections.map((section) => {
              const stories = newsArticles.filter((article) => article.section === section.id)
              const [lead, ...rest] = stories
              return (
                <section id={section.id} key={section.id} className="scroll-mt-80">
                  <Reveal
                    from="up"
                    className="mb-6 flex items-end justify-between gap-4 border-b border-[#dbe4ea] pb-3"
                  >
                    <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold text-[#03202b] sm:text-3xl">
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
                      {rest.length ? (
                        <div className="grid gap-6 sm:grid-cols-2">
                          {rest.map((article, index) => (
                            <Reveal key={article.slug} from="up" delay={(index % 2) * 120} className="h-full">
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
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-[#e1e8ee]">
              <h2 className="font-heading text-lg font-semibold text-[#03202b]">Sections</h2>
              <ul className="mt-3 divide-y divide-[#eef2f5]">
                {newsSections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-center justify-between py-2.5 text-sm text-[#3d4b59] transition hover:text-[#0a5062]"
                    >
                      {section.title}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 text-[#17b3c6] transition group-hover:translate-x-1"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#06394a] to-[#0a5062] p-6 text-white">
              <Mail aria-hidden="true" className="absolute -right-4 -bottom-4 size-24 text-white/10" />
              <h2 className="font-heading text-lg font-semibold" style={{ color: "#ffffff" }}>
                Share news with us
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Parishes and communities can send reports and photographs to the Province office.
              </p>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-4 inline-block rounded-full bg-[#ffcf4a] px-4 py-2 text-sm font-semibold text-[#03202b] transition hover:bg-[#ffd966]"
              >
                Email the newsroom
              </a>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-[#e1e8ee]">
              <h2 className="font-heading text-lg font-semibold text-[#03202b]">Follow the Province</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {follow.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-[#d5dee6] px-3 py-2 text-center text-sm font-semibold text-[#0a5062] transition hover:border-[#17b3c6] hover:bg-[#f4fbfd]"
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
