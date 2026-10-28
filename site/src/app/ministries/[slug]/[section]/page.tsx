import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react"

import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { MinistrySectionContentTabs } from "@/components/sections/ministries/ministry-section-content-tabs"
import { anchorId, ministryHref, ministrySectionHref, ministrySlug } from "@/config/navigation"
import type { MinistryMajorSection } from "@/content/ministry-details"
import { getMinistries } from "@/lib/cms"

type SectionPageProps = {
  params: Promise<{ slug: string; section: string }>
}

function matchSection(sections: MinistryMajorSection[], sectionParam: string) {
  const needle = anchorId(sectionParam)
  return sections.find((item) => anchorId(item.slug) === needle)
}

async function findMinistryAndSection(slug: string, sectionParam: string) {
  const ministries = await getMinistries()
  const ministry = ministries.find((item) => ministrySlug(item) === slug)
  if (!ministry) return { ministry: undefined, section: undefined as MinistryMajorSection | undefined }
  const section = matchSection(ministry.detail?.majorSections ?? [], sectionParam)
  return { ministry, section }
}

export async function generateStaticParams() {
  const ministries = await getMinistries()
  return ministries.flatMap((ministry) =>
    (ministry.detail?.majorSections ?? []).map((section) => ({
      slug: ministrySlug(ministry),
      section: anchorId(section.slug),
    }))
  )
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { slug, section: sectionParam } = await params
  const { ministry, section } = await findMinistryAndSection(slug, sectionParam)
  if (!ministry || !section) return { title: "Ministry section" }
  return {
    title: `${section.title} · ${ministry.title}`,
    description: section.summary || ministry.summary,
  }
}

export default async function MinistrySectionPage({ params }: SectionPageProps) {
  const { slug, section: sectionParam } = await params
  const { ministry, section } = await findMinistryAndSection(slug, sectionParam)
  if (!ministry || !section) notFound()

  const siblings = ministry.detail?.majorSections ?? []

  return (
    <>
      <ScrollProgress />
      <header className="relative isolate flex min-h-[28rem] flex-col overflow-hidden bg-[#06394a] px-4 pt-20 pb-8 text-white sm:min-h-[32rem] sm:px-8 sm:pt-24 sm:pb-12">
        {section.image || ministry.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={encodeURI(section.image || ministry.image || "")}
            alt=""
            className="history-kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : null}

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between gap-10">
          <nav
            aria-label="Breadcrumb"
            className="flex w-fit flex-wrap items-center gap-1.5 rounded-full bg-[#03202b]/55 px-4 py-2 text-sm text-white/80 backdrop-blur-md"
          >
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href="/ministries" className="transition hover:text-white">
              Ministries
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href={ministryHref(ministry)} className="transition hover:text-white">
              {ministry.title}
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <span className="text-white">{section.title}</span>
          </nav>

          <div className="max-w-3xl rounded-[1.75rem] bg-[#03202b]/60 p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/15 backdrop-blur-md sm:p-8">
          <p className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">
            {section.group ? `${section.group} · ` : null}
            {ministry.title}
            {section.place ? (
              <span className="inline-flex items-center gap-1 tracking-normal text-white/85 normal-case">
                <MapPin aria-hidden="true" className="size-4" /> {section.place}
              </span>
            ) : null}
          </p>
          <h1
            className="mt-4 font-heading text-4xl font-semibold text-balance sm:text-5xl"
            style={{ color: "#ffffff" }}
          >
            {section.title}
          </h1>

          <Link
            href={ministryHref(ministry)}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#ffcf4a] transition hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Back to {ministry.title}
          </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-[#f7fbfd] to-white px-4 py-12 text-[#102a43] sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {siblings.length > 1 ? (
            <div className="mb-10">
              <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#0e98ac] uppercase">Other places</p>
              <div
                role="tablist"
                aria-label="Other places"
                className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
              >
                {siblings.map((item) => {
                  const active = anchorId(item.slug) === anchorId(section.slug)
                  return (
                    <Link
                      key={item.slug}
                      role="tab"
                      aria-selected={active}
                      href={ministrySectionHref(ministry, item.slug)}
                      className={
                        active
                          ? "inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full bg-[#0e98ac] px-4 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-[0_10px_22px_-12px_rgba(14,152,172,0.9)]"
                          : "inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap text-[#0a5062] ring-1 ring-[#d9eef3] transition hover:bg-[#e7fbff] hover:ring-[#17b3c6]"
                      }
                    >
                      {active ? <MapPin aria-hidden="true" className="size-3.5" /> : null}
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : null}

          <MinistrySectionContentTabs content={section} />
        </div>
      </section>
    </>
  )
}
