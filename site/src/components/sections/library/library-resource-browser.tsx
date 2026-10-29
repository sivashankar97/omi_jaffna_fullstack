"use client"

import { useMemo, useState } from "react"
import { CalendarDays, Download, FileText, Layers, Sparkles } from "lucide-react"

import type { LibraryCategory } from "@/content/library"
import type { LibraryItem } from "@/lib/cms"

const COVER_TONES = [
  { from: "#03202b", via: "#0a5062", to: "#17b3c6" },
  { from: "#023e8a", via: "#0a5062", to: "#53b0c2" },
  { from: "#06394a", via: "#0e98ac", to: "#17b3c6" },
  { from: "#03202b", via: "#023e8a", to: "#0e98ac" },
  { from: "#0a5062", via: "#17b3c6", to: "#53b0c2" },
] as const

function coverTone(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return COVER_TONES[hash % COVER_TONES.length]
}

function BookVisual({ item, featured = false }: { item: LibraryItem; featured?: boolean }) {
  const tone = coverTone(item.id || item.title)
  return (
    <div className={`lib-book-scene ${featured ? "lib-book-scene--featured" : ""}`} aria-hidden="true">
      <div className="lib-book-3d">
        <div
          className="lib-book-cover"
          style={
            item.cover
              ? undefined
              : {
                  background: `linear-gradient(155deg, ${tone.from} 0%, ${tone.via} 48%, ${tone.to} 100%)`,
                }
          }
        >
          {item.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={encodeURI(item.cover)} alt="" className="lib-book-cover-img" />
          ) : (
            <div className="lib-book-cover-fallback">
              <span className="lib-book-cover-rule" />
              <p className="lib-book-cover-title">{item.title}</p>
              {item.categoryLabel ? <p className="lib-book-cover-cat">{item.categoryLabel}</p> : null}
            </div>
          )}
          <span className="lib-book-cover-sheen" />
          <span className="lib-book-cover-edge" />
        </div>
        <div className="lib-book-spine" style={{ background: `linear-gradient(180deg, ${tone.from}, ${tone.via})` }}>
          <span className="lib-book-spine-title">{item.title}</span>
        </div>
        <div className="lib-book-pages">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="lib-book-back" style={{ background: tone.from }} />
      </div>
      <div className="lib-book-shadow" />
    </div>
  )
}

function BookCard({
  item,
  downloadLabel,
  comingSoonLabel,
  index = 0,
}: {
  item: LibraryItem
  downloadLabel: string
  comingSoonLabel: string
  index?: number
}) {
  const className = "lib-book group"
  const style = { animationDelay: `${Math.min(index, 8) * 70}ms` }
  const label = item.pdfUrl ? `${item.title} — ${downloadLabel}` : item.title

  const body = (
    <>
      <BookVisual item={item} />
      <div className="lib-book-meta">
        {item.dateLabel ? <p className="lib-book-date">{item.dateLabel}</p> : null}
        <h3 className="lib-book-heading">{item.title}</h3>
        {item.author ? <p className="mt-1 text-xs font-medium text-[#5b7180]">by {item.author}</p> : null}
        {item.summary ? <p className="lib-book-summary">{item.summary}</p> : null}
        <div className="lib-book-cta">
          {item.pdfUrl ? (
            <span className="lib-book-download lib-book-download--soft">
              <Download aria-hidden="true" className="size-3.5" />
              {downloadLabel}
            </span>
          ) : (
            <span className="lib-book-soon">{comingSoonLabel}</span>
          )}
        </div>
      </div>
    </>
  )

  if (item.pdfUrl) {
    return (
      <a
        href={item.pdfUrl}
        download
        target="_blank"
        rel="noreferrer"
        className={className}
        style={style}
        aria-label={label}
      >
        {body}
      </a>
    )
  }

  return (
    <article className={className} style={style} aria-label={label}>
      {body}
    </article>
  )
}

function FeaturedIssue({
  item,
  downloadLabel,
  comingSoonLabel,
  pdfFormatLabel,
  sampleIssueLabel,
  categoryLabel,
}: {
  item: LibraryItem
  downloadLabel: string
  comingSoonLabel: string
  pdfFormatLabel: string
  sampleIssueLabel: string
  categoryLabel?: string
}) {
  const label = item.pdfUrl ? `${item.title} — ${downloadLabel}` : item.title
  const metaLabel = categoryLabel || item.categoryLabel || sampleIssueLabel

  const inner = (
    <>
      <div className="lib-featured-book">
        <BookVisual item={item} featured />
      </div>
      <div className="lib-featured-copy">
        {item.dateLabel ? <p className="lib-book-date">{item.dateLabel}</p> : null}
        <h3 className="lib-featured-title">{item.title}</h3>
        {item.author ? <p className="mt-2 text-sm font-medium text-[#5b7180]">by {item.author}</p> : null}
        {item.summary ? <p className="lib-featured-summary">{item.summary}</p> : null}
        <div className="mt-6">
          {item.pdfUrl ? (
            <span className="lib-book-download lib-book-download--primary">
              <Download aria-hidden="true" className="size-4" />
              {downloadLabel}
            </span>
          ) : (
            <span className="lib-book-soon">{comingSoonLabel}</span>
          )}
        </div>
        <ul className="lib-featured-meta">
          <li>
            <FileText aria-hidden="true" className="size-3.5" />
            {pdfFormatLabel}
          </li>
          <li>
            <Layers aria-hidden="true" className="size-3.5" />
            {metaLabel}
          </li>
          {item.dateLabel ? (
            <li>
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {item.dateLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )

  if (item.pdfUrl) {
    return (
      <a
        href={item.pdfUrl}
        download
        target="_blank"
        rel="noreferrer"
        className="lib-featured group"
        aria-label={label}
      >
        {inner}
      </a>
    )
  }

  return <article className="lib-featured">{inner}</article>
}

export function LibraryResourceBrowser({
  items,
  categories = [],
  emptyLabel = "No items published yet.",
  downloadLabel = "Download PDF",
  comingSoonLabel = "PDF coming soon",
  latestIssueLabel = "Latest issue",
  previousIssuesLabel = "Previous Issues",
  earlierIssuesKicker = "Earlier issues",
  previousIssuesSummaryPrefix = "Browse and download earlier issues of",
  pdfFormatLabel = "PDF Format",
  sampleIssueLabel = "Sample Issue",
}: {
  items: LibraryItem[]
  categories?: LibraryCategory[]
  emptyLabel?: string
  downloadLabel?: string
  comingSoonLabel?: string
  latestIssueLabel?: string
  previousIssuesLabel?: string
  earlierIssuesKicker?: string
  previousIssuesSummaryPrefix?: string
  pdfFormatLabel?: string
  sampleIssueLabel?: string
}) {
  const tabs = useMemo(() => {
    if (!categories.length) return []
    const withItems = categories.filter((category) => items.some((item) => item.category === category.id))
    return withItems.length ? withItems : categories
  }, [categories, items])

  const [active, setActive] = useState(tabs[0]?.id || "")
  const current = tabs.some((tab) => tab.id === active) ? active : tabs[0]?.id || ""
  const visible = categories.length ? items.filter((item) => item.category === current) : items
  const [featured, ...rest] = visible
  const activeTab = tabs.find((tab) => tab.id === current)
  const categoryName = activeTab?.label || featured?.categoryLabel || "this collection"

  return (
    <div className="lib-shelf">
      {tabs.length ? (
        <div
          role="tablist"
          aria-label="Categories"
          className="flex gap-1.5 overflow-x-auto rounded-2xl border border-[#d9eef3] bg-[#f4fbfd] p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const selected = tab.id === current
            const count = items.filter((item) => item.category === tab.id).length
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(tab.id)}
                className={
                  selected
                    ? "flex shrink-0 items-center gap-2 rounded-xl bg-[#023e8a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
                    : "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#5c6b7a] transition hover:bg-white hover:text-[#023e8a]"
                }
              >
                {tab.label}
                <span
                  className={
                    selected
                      ? "grid min-w-6 place-items-center rounded-full bg-[#17b3c6] px-1.5 py-0.5 text-[11px] font-bold text-white"
                      : "grid min-w-6 place-items-center rounded-full bg-white px-1.5 py-0.5 text-[11px] font-bold text-[#0e98ac]"
                  }
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      {visible.length && featured ? (
        <div className={tabs.length ? "mt-10 space-y-12" : "space-y-12"}>
          <section>
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">
              <Sparkles aria-hidden="true" className="size-3.5 text-[#ffcf4a]" />
              {latestIssueLabel}
            </p>
            <div className="mt-4">
              <FeaturedIssue
                item={featured}
                downloadLabel={downloadLabel}
                comingSoonLabel={comingSoonLabel}
                pdfFormatLabel={pdfFormatLabel}
                sampleIssueLabel={sampleIssueLabel}
                categoryLabel={categoryName}
              />
            </div>
          </section>

          {rest.length ? (
            <section>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-[#17b3c6]" />
                <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">{earlierIssuesKicker}</p>
              </div>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-[#03202b] sm:text-3xl">
                {previousIssuesLabel}
              </h2>
              <p className="mt-2 text-sm text-[#5c6b7a] sm:text-base">
                {previousIssuesSummaryPrefix} {categoryName}
              </p>
              <ul className="lib-shelf-grid mt-8">
                {rest.map((item, index) => (
                  <li key={item.id}>
                    <BookCard
                      item={item}
                      index={index + 1}
                      downloadLabel={downloadLabel}
                      comingSoonLabel={comingSoonLabel}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : (
        <div
          className={`rounded-[1.5rem] border border-dashed border-[#cfe4ea] bg-white/70 px-6 py-16 text-center ${
            tabs.length ? "mt-10" : ""
          }`}
        >
          <FileText aria-hidden="true" className="mx-auto size-10 text-[#17b3c6]/50" />
          <p className="mt-4 text-[#5c6b7a]">{emptyLabel}</p>
        </div>
      )}
    </div>
  )
}
