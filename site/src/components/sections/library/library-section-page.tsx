import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { LibraryResourceBrowser } from "@/components/sections/library/library-resource-browser"
import { PageBanner } from "@/components/sections/page-banner"
import type { LibraryCategory, LibrarySectionId } from "@/content/library"
import { categoriesForSection } from "@/content/library"
import { getBlock, getLibraryItems } from "@/lib/cms"

type SectionCopy = {
  pageKicker: string
  pageTitle: string
  pageSummary: string
  empty: string
}

export async function LibrarySectionPage({ section }: { section: LibrarySectionId }) {
  const [items, copy] = await Promise.all([getLibraryItems(section), getBlock("library")])
  const sectionCopy = copy[section] as SectionCopy
  const categories: LibraryCategory[] = categoriesForSection(section, copy)

  return (
    <>
      <ScrollProgress />
      <PageBanner
        id={section}
        kicker={sectionCopy.pageKicker}
        title={sectionCopy.pageTitle}
        summary={sectionCopy.pageSummary}
        stats={[{ value: String(items.length), label: items.length === 1 ? "Title" : "Titles" }]}
      />
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#eef8fb] via-[#f7fbfd] to-white px-4 py-14 text-[#102a43] sm:px-8 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,rgba(23,179,198,0.16),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-[#ffcf4a]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(3,32,43,0.04))]"
        />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/library"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0e98ac] transition hover:text-[#023e8a]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {copy.backLabel}
          </Link>
          <LibraryResourceBrowser
            items={items}
            categories={categories}
            emptyLabel={sectionCopy.empty}
            downloadLabel={copy.downloadLabel}
            comingSoonLabel={copy.comingSoonLabel}
            latestIssueLabel={copy.latestIssueLabel}
            previousIssuesLabel={copy.previousIssuesLabel}
            earlierIssuesKicker={copy.earlierIssuesKicker}
            previousIssuesSummaryPrefix={copy.previousIssuesSummaryPrefix}
            pdfFormatLabel={copy.pdfFormatLabel}
            sampleIssueLabel={copy.sampleIssueLabel}
          />
        </div>
      </section>
    </>
  )
}
