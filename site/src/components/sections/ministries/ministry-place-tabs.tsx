import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"

import { ministrySectionHref } from "@/config/navigation"
import type { MinistryMajorSection } from "@/content/ministry-details"
import type { Ministry } from "@/lib/cms"

/** Place tabs only — each tab opens that place’s page. */
export function MinistryPlaceTabs({
  ministry,
  sections,
}: {
  ministry: Ministry
  sections: MinistryMajorSection[]
}) {
  if (!sections.length) return null

  return (
    <nav aria-label="Places" className="border-b border-[#d9eef3] bg-gradient-to-b from-[#f4fbfd] to-white">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-[#0e98ac] uppercase">Where we serve</p>
            <h2 className="mt-1 font-heading text-2xl font-semibold text-[#023e8a]">Places &amp; communities</h2>
          </div>
          <span className="shrink-0 rounded-full bg-[#e7fbff] px-3 py-1 text-xs font-bold text-[#0a5062] ring-1 ring-[#cfeef4]">
            {sections.length} {sections.length === 1 ? "place" : "places"}
          </span>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {sections.map((section, index) => (
            <li key={section.slug}>
              <Link
                href={ministrySectionHref(ministry, section.slug)}
                className="group flex h-full flex-col rounded-xl bg-gradient-to-br from-[#0e98ac] to-[#17b3c6] p-2.5 text-white shadow-[0_14px_28px_-20px_rgba(14,152,172,0.9)] transition duration-300 hover:-translate-y-0.5 hover:from-[#0a5062] hover:to-[#0e98ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a5062]"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="grid size-6 place-items-center rounded-md bg-white/20 font-heading text-[10px] font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.group ? (
                    <span className="truncate rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                      {section.group}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 line-clamp-2 font-heading text-[0.82rem] leading-snug font-semibold text-white">
                  {section.title}
                </span>
                <span className="mt-auto flex items-center justify-between gap-1.5 pt-2 text-[11px] text-white/85">
                  <span className="inline-flex min-w-0 items-center gap-1">
                    {section.place ? (
                      <>
                        <MapPin aria-hidden="true" className="size-3 shrink-0 text-white" />
                        <span className="truncate">{section.place}</span>
                      </>
                    ) : null}
                  </span>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[#0e98ac] shadow-sm transition group-hover:scale-110">
                    <ArrowUpRight aria-hidden="true" className="size-3" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
