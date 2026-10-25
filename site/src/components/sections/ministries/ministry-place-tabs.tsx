import Link from "next/link"

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
    <div className="border-b border-[#d9eef3] bg-white">
      <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-8">
        <div role="tablist" aria-label="Places" className="flex min-w-max gap-1">
          {sections.map((section) => (
            <Link
              key={section.slug}
              role="tab"
              href={ministrySectionHref(ministry, section.slug)}
              className="inline-flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-4 py-3.5 text-sm font-semibold text-[#023e8a] transition hover:border-[#48cae4]/50 hover:text-[#0e98ac] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#17b3c6]"
            >
              {section.group ? (
                <span className="text-[10px] font-bold tracking-wide text-[#5c6b7a] uppercase">{section.group}</span>
              ) : null}
              <span>
                {section.title}
                {section.place ? <span className="font-normal text-[#5c6b7a]"> — {section.place}</span> : null}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
