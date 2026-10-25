"use client"

import { useMemo, useState } from "react"
import { Download, FileText } from "lucide-react"

import type { LibraryCategory } from "@/content/library"
import type { LibraryItem } from "@/lib/cms"

function ItemCard({
  item,
  downloadLabel,
  comingSoonLabel,
  featured = false,
}: {
  item: LibraryItem
  downloadLabel: string
  comingSoonLabel: string
  featured?: boolean
}) {
  return (
    <article
      className={`group flex h-full overflow-hidden rounded-[1.5rem] border border-[#d4e4ea] bg-white shadow-[0_18px_40px_-34px_rgba(10,60,80,0.55)] transition duration-500 hover:-translate-y-1 hover:border-[#17b3c6]/60 hover:shadow-[0_28px_56px_-30px_rgba(10,80,98,0.55)] ${
        featured ? "sm:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-gradient-to-br from-[#06394a] via-[#0a5062] to-[#17b3c6] ${
          featured ? "aspect-[4/5] sm:w-[42%] sm:aspect-auto sm:min-h-[22rem]" : "aspect-[3/4]"
        }`}
      >
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={encodeURI(item.cover)}
            alt=""
            className="h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-white/55">
            <FileText aria-hidden="true" className={featured ? "size-16" : "size-12"} />
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[#ffcf4a]/90" />
        {item.categoryLabel ? (
          <span className="absolute top-3 left-4 rounded-full bg-[#03202b]/75 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
            {item.categoryLabel}
          </span>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "p-7 sm:p-8" : "p-5"}`}>
        {item.dateLabel ? (
          <p className="text-[11px] font-bold tracking-[0.16em] text-[#0e98ac] uppercase">{item.dateLabel}</p>
        ) : null}
        <h3
          className={`mt-1.5 font-heading font-semibold text-[#03202b] ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {item.title}
        </h3>
        {item.summary ? (
          <p className={`mt-3 flex-1 leading-7 text-[#5c6b7a] ${featured ? "text-base" : "text-sm line-clamp-4"}`}>
            {item.summary}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        {item.pdfUrl ? (
          <a
            href={item.pdfUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#023e8a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e98ac]"
          >
            <Download aria-hidden="true" className="size-4" />
            {downloadLabel}
          </a>
        ) : (
          <p className="mt-6 text-sm text-[#8a98a6]">{comingSoonLabel}</p>
        )}
      </div>
    </article>
  )
}

export function LibraryResourceBrowser({
  items,
  categories = [],
  emptyLabel = "No items published yet.",
  downloadLabel = "Download PDF",
  comingSoonLabel = "PDF coming soon",
}: {
  items: LibraryItem[]
  categories?: LibraryCategory[]
  emptyLabel?: string
  downloadLabel?: string
  comingSoonLabel?: string
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

  return (
    <div>
      {tabs.length ? (
        <div
          role="tablist"
          aria-label="Categories"
          className="flex gap-1 overflow-x-auto rounded-2xl border border-[#d9eef3] bg-[#f4fbfd] p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    ? "flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#023e8a] shadow-sm"
                    : "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#5c6b7a] transition hover:bg-white/70 hover:text-[#023e8a]"
                }
              >
                {tab.label}
                <span
                  className={
                    selected
                      ? "rounded-full bg-[#e8f7fa] px-2 py-0.5 text-[11px] font-bold text-[#0e98ac]"
                      : "rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-bold text-[#8a98a6]"
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
        <div className={tabs.length ? "mt-10 space-y-6" : "space-y-6"}>
          <ItemCard
            item={featured}
            featured
            downloadLabel={downloadLabel}
            comingSoonLabel={comingSoonLabel}
          />
          {rest.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((item) => (
                <li key={item.id}>
                  <ItemCard item={item} downloadLabel={downloadLabel} comingSoonLabel={comingSoonLabel} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <div
          className={`rounded-[1.5rem] border border-dashed border-[#cfe4ea] bg-[#f7fbfd] px-6 py-16 text-center ${
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
