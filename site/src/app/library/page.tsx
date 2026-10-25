import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, BookMarked, BookOpen, Library, Newspaper } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
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

const SECTION_ORDER: LibrarySectionId[] = ["magazine", "libraries", "books", "articles"]

export default async function LibraryHubPage() {
  const [items, copy] = await Promise.all([getLibraryItems(), getBlock("library")])
  const { hero, closing } = copy
  const counts = Object.fromEntries(
    SECTION_ORDER.map((id) => [id, items.filter((item) => item.section === id).length])
  ) as Record<LibrarySectionId, number>

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

      <section className="relative isolate overflow-hidden bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-[28rem] rounded-full bg-[#17b3c6]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 size-[24rem] rounded-full bg-[#ffcf4a]/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">{hero.collectionsKicker}</p>
            <h2 className="mt-2 max-w-2xl font-heading text-3xl font-semibold text-balance sm:text-4xl">
              {hero.collectionsTitle}
            </h2>
          </Reveal>

          <ul className="mt-12 grid gap-5 lg:grid-cols-2">
            {SECTION_ORDER.map((id, index) => {
              const section = copy[id]
              const Icon = SECTION_ICONS[id]
              const count = counts[id]
              return (
                <Reveal key={id} from="up" delay={index * 90} as="li" className="h-full">
                  <Link
                    href={librarySectionRoutes[id]}
                    className="group relative flex h-full overflow-hidden rounded-[1.75rem] border border-[#d5e6ec] bg-gradient-to-br from-[#f7fbfd] via-white to-[#eef8fb] p-7 transition duration-500 hover:-translate-y-1.5 hover:border-[#17b3c6] hover:shadow-[0_28px_56px_-30px_rgba(10,80,98,0.5)] sm:p-8"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute top-0 right-0 size-40 translate-x-10 -translate-y-10 rounded-full bg-[#17b3c6]/10 blur-2xl transition group-hover:bg-[#17b3c6]/20"
                    />
                    <div className="relative flex min-w-0 flex-1 flex-col">
                      <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#0a5062] to-[#17b3c6] text-white shadow-[0_14px_28px_-16px_rgba(14,152,172,0.9)]">
                        <Icon className="size-6" />
                      </span>
                      <p className="mt-6 text-[11px] font-bold tracking-[0.16em] text-[#0e98ac] uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 font-heading text-3xl font-semibold transition group-hover:text-[#0e98ac]">
                        {section.cardTitle}
                      </h3>
                      <p className="mt-3 flex-1 leading-7 text-[#5c6b7a]">{section.cardDescription}</p>
                      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#d9eef3] pt-5">
                        <span className="text-sm font-semibold text-[#023e8a]">
                          {count} {count === 1 ? "title" : "titles"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e98ac]">
                          {section.cardCta}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-center text-white sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 size-[22rem] rounded-full bg-[#ffcf4a]/15 blur-[100px]"
        />
        <Reveal from="up" className="relative mx-auto max-w-3xl">
          <p className="font-heading text-3xl leading-snug italic sm:text-4xl">“{closing.quote}”</p>
          {closing.ctaLabel ? (
            <Link
              href={closing.ctaHref || "/contact"}
              className="mt-10 inline-block rounded-full bg-[#ffcf4a] px-6 py-3 text-sm font-semibold text-[#03202b] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
            >
              {closing.ctaLabel}
            </Link>
          ) : null}
        </Reveal>
      </section>
    </>
  )
}
