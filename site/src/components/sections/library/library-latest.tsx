"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays } from "lucide-react"

import { librarySectionRoutes, type LibrarySectionId } from "@/content/library"
import type { LibraryItem } from "@/lib/cms"

const FALLBACK_COVERS = [
  "/library/latest-1.jpg",
  "/library/latest-2.jpg",
  "/library/latest-3.jpg",
  "/library/latest-4.jpg",
  "/library/latest-5.jpg",
] as const

const SECTION_CHIP: Record<LibrarySectionId, string> = {
  magazine: "Magazine",
  libraries: "Library",
  books: "Book",
  articles: "Article",
}

type FilterId = "all" | "magazine" | "books" | "articles" | "releases"

type Labels = {
  title: string
  all: string
  magazines: string
  books: string
  articles: string
  releases: string
  viewAll: string
  download: string
}

export function LibraryLatest({
  items,
  labels,
  limit = 5,
}: {
  items: LibraryItem[]
  labels: Labels
  limit?: number
}) {
  const [filter, setFilter] = useState<FilterId>("all")

  const tabs: { id: FilterId; label: string }[] = [
    { id: "all", label: labels.all },
    { id: "magazine", label: labels.magazines },
    { id: "books", label: labels.books },
    { id: "articles", label: labels.articles },
    { id: "releases", label: labels.releases },
  ]

  const filtered = useMemo(() => {
    if (filter === "all") return items
    if (filter === "releases") return items.filter((item) => item.section === "books")
    return items.filter((item) => item.section === filter)
  }, [filter, items])

  const visible = filtered.slice(0, limit)

  const viewAllHref =
    filter === "magazine"
      ? librarySectionRoutes.magazine
      : filter === "books" || filter === "releases"
        ? librarySectionRoutes.books
        : filter === "articles"
          ? librarySectionRoutes.articles
          : librarySectionRoutes.articles

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Latest filters"
          className="flex gap-1 overflow-x-auto rounded-full border border-[#d9eef3] bg-[#f4fbfd] p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const selected = tab.id === filter
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(tab.id)}
                className={
                  selected
                    ? "shrink-0 rounded-full bg-[#17b3c6] px-4 py-2 text-sm font-semibold text-white shadow-sm"
                    : "shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-[#5c6b7a] transition hover:bg-white hover:text-[#023e8a]"
                }
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1.5 self-end text-sm font-semibold text-[#0e98ac] transition hover:text-[#023e8a] sm:self-auto"
        >
          {labels.viewAll}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {visible.length ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {visible.map((item, index) => {
            const cover = item.cover || FALLBACK_COVERS[index % FALLBACK_COVERS.length]
            const chip = SECTION_CHIP[item.section]
            const className =
              "group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#d9eef3] bg-white shadow-[0_18px_40px_-34px_rgba(10,60,80,0.5)] transition duration-400 hover:-translate-y-1 hover:border-[#17b3c6]/50 hover:shadow-[0_28px_48px_-30px_rgba(10,80,98,0.45)]"

            const body = (
              <>
                <div className="relative aspect-square overflow-hidden bg-[#e8f7fa]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI(cover)}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="inline-flex w-fit rounded-full bg-[#e8f7fa] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] text-[#0e98ac] uppercase">
                    {chip}
                  </span>
                  <h3 className="mt-2.5 line-clamp-2 font-heading text-[0.95rem] font-semibold leading-snug text-[#03202b] transition group-hover:text-[#0e98ac]">
                    {item.title}
                  </h3>
                  {item.dateLabel ? (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#8a98a6]">
                      <CalendarDays aria-hidden="true" className="size-3.5" />
                      {item.dateLabel}
                    </p>
                  ) : (
                    <div className="mt-2 h-4" />
                  )}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-[#023e8a]">
                    {labels.download}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 text-[#17b3c6] transition group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </>
            )

            return (
              <li key={item.id}>
                {item.pdfUrl ? (
                  <a
                    href={item.pdfUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                    aria-label={`${item.title} — ${labels.download}`}
                  >
                    {body}
                  </a>
                ) : (
                  <article className={className}>{body}</article>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-10 rounded-[1.35rem] border border-dashed border-[#cfe4ea] bg-[#f7fbfd] px-6 py-12 text-center text-[#5c6b7a]">
          No titles in this filter yet.
        </p>
      )}
    </div>
  )
}
