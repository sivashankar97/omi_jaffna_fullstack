import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, BookMarked, BookOpen, Library, Newspaper } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { LibraryLatest } from "@/components/sections/library/library-latest"
import { PageBanner } from "@/components/sections/page-banner"
import { librarySectionRoutes, type LibrarySectionId } from "@/content/library"
import { getBlock, getLibraryItems } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Library",
  description: "Magazines, Oblate libraries, new book releases and articles of the Province of Jaffna.",
}

const SECTION_ICONS = {
  magazine: Newspaper,
  libraries: Library,
  books: BookMarked,
  articles: BookOpen,
} as const

const SECTION_IMAGES: Record<LibrarySectionId, string> = {
  magazine: "/library/door-magazine.jpg",
  libraries: "/library/door-libraries.jpg",
  books: "/library/door-books.jpg",
  articles: "/library/door-articles.jpg",
}

const SECTION_ORDER: LibrarySectionId[] = ["magazine", "libraries", "books", "articles"]

function accentTitle(title: string, accent?: string) {
  if (!accent || !title.includes(accent)) return title
  const parts = title.split(accent)
  return (
    <>
      {parts[0]}
      <span className="text-[#17b3c6]">{accent}</span>
      {parts.slice(1).join(accent)}
    </>
  )
}

function accentQuote(quote: string, words: string[] = []) {
  if (!words.length) return quote
  const pattern = new RegExp(`\\b(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi")
  const nodes: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = pattern.exec(quote)) !== null) {
    if (match.index > last) nodes.push(quote.slice(last, match.index))
    nodes.push(
      <em key={key} className="font-medium italic text-white">
        {match[0]}
      </em>
    )
    key += 1
    last = match.index + match[0].length
  }
  if (last < quote.length) nodes.push(quote.slice(last))
  return nodes
}

export default async function LibraryHubPage() {
  const [items, copy] = await Promise.all([getLibraryItems(), getBlock("library")])
  const { hero, closing } = copy
  const counts = Object.fromEntries(
    SECTION_ORDER.map((id) => [id, items.filter((item) => item.section === id).length])
  ) as Record<LibrarySectionId, number>

  const accentWords = Array.isArray(closing.quoteAccentWords)
    ? (closing.quoteAccentWords as string[])
    : ["hope", "knowledge"]

  return (
    <>
      <ScrollProgress />
      <PageBanner
        id="library"
        kicker={hero.kicker}
        title={hero.title}
        summary={hero.summary}
        stats={[
          { value: String(counts.magazine), label: hero.magazinesLabel },
          { value: String(counts.libraries), label: hero.librariesLabel },
          { value: String(counts.books), label: hero.booksLabel },
          { value: String(counts.articles), label: hero.articlesLabel },
        ]}
      />

      <section className="relative isolate overflow-hidden bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-[28rem] rounded-full bg-[#17b3c6]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">{hero.collectionsKicker}</p>
            <h2 className="mt-2 max-w-3xl font-heading text-3xl font-semibold text-balance text-[#03202b] sm:text-4xl">
              {accentTitle(hero.collectionsTitle, hero.collectionsTitleAccent)}
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {SECTION_ORDER.map((id, index) => {
              const section = copy[id]
              const Icon = SECTION_ICONS[id]
              const count = counts[id]
              return (
                <Reveal key={id} from="up" delay={index * 80} as="li" className="h-full">
                  <Link
                    href={librarySectionRoutes[id]}
                    className="group relative flex h-full min-h-[23rem] flex-col overflow-hidden rounded-[1.75rem] border border-[#d5e6ec] bg-gradient-to-b from-[#eef8fb] via-[#f7fbfd] to-white p-5 shadow-[0_16px_40px_-28px_rgba(10,60,80,0.35)] transition duration-500 hover:-translate-y-1.5 hover:border-[#17b3c6] hover:shadow-[0_28px_56px_-28px_rgba(10,80,98,0.5)] sm:p-6"
                  >
                    <div className="relative z-10 flex items-start justify-between gap-2">
                      <span className="grid size-11 place-items-center rounded-xl bg-[#17b3c6] text-white shadow-[0_12px_24px_-12px_rgba(14,152,172,0.95)]">
                        <Icon className="size-5" />
                      </span>
                      <div className="relative -mr-3 -mt-3 h-32 w-[7.5rem] shrink-0 sm:h-36 sm:w-36">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={SECTION_IMAGES[id]}
                          alt=""
                          className="h-full w-full rounded-[1.25rem] object-cover shadow-[0_20px_40px_-16px_rgba(3,32,43,0.55)] transition duration-700 group-hover:scale-105 group-hover:-rotate-2"
                        />
                      </div>
                    </div>

                    <p className="relative z-10 mt-6 text-[11px] font-bold tracking-[0.16em] text-[#0e98ac] uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="relative z-10 mt-1 font-heading text-2xl font-semibold text-[#03202b] transition group-hover:text-[#0e98ac]">
                      {section.cardTitle}
                    </h3>
                    <p className="relative z-10 mt-2 flex-1 text-sm leading-6 text-[#5c6b7a]">{section.cardDescription}</p>

                    <div className="relative z-10 mt-6 flex items-center justify-between gap-3 border-t border-[#d9eef3] pt-4">
                      <span className="text-sm font-semibold text-[#023e8a]">
                        {count} {count === 1 ? "title" : "titles"}
                      </span>
                      <span className="grid size-9 place-items-center rounded-full bg-[#17b3c6] text-white transition group-hover:bg-[#0e98ac]">
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 transition group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#f7fbfd] px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">{hero.latestKicker}</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-[#03202b] sm:text-4xl">{hero.latestTitle}</h2>
          </Reveal>
          <div className="mt-8">
            <LibraryLatest
              items={items}
              labels={{
                title: hero.latestTitle,
                all: hero.latestAllLabel,
                magazines: hero.latestMagazinesLabel,
                books: hero.latestBooksLabel,
                articles: hero.latestArticlesLabel,
                releases: hero.latestReleasesLabel,
                viewAll: hero.latestViewAllLabel,
                download: copy.downloadLabel,
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-8 sm:py-16">
        <Reveal from="up" className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0a5062] via-[#0e98ac] to-[#17b3c6] px-7 py-10 text-white sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-16 size-64 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-6 right-16 hidden opacity-20 sm:block"
          >
            <BookOpen className="size-40" strokeWidth={1} />
          </div>
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-heading text-2xl leading-snug font-semibold sm:text-3xl">
                {accentQuote(closing.quote, accentWords)}
              </p>
              {closing.summary ? <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">{closing.summary}</p> : null}
            </div>
            {closing.ctaLabel ? (
              <Link
                href={closing.ctaHref || "/contact"}
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0a5062] transition hover:-translate-y-0.5 hover:bg-[#f4fbfd] lg:self-auto"
              >
                {closing.ctaLabel}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>
        </Reveal>
      </section>
    </>
  )
}
