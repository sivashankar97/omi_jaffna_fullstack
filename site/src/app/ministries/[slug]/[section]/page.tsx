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
      <header className="relative isolate overflow-hidden bg-[#03202b] px-4 pt-10 pb-14 text-white sm:px-8 sm:pt-14 sm:pb-16">
        {section.image || ministry.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={encodeURI(section.image || ministry.image || "")}
            alt=""
            className="history-kenburns absolute inset-0 -z-20 h-full w-full object-cover opacity-50"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#03202b] via-[#03202b]/85 to-[#03202b]/50" />

        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
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

          <p className="mt-12 flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">
            {section.group ? `${section.group} · ` : null}
            {ministry.title}
            {section.place ? (
              <span className="inline-flex items-center gap-1 tracking-normal text-white/85 normal-case">
                <MapPin aria-hidden="true" className="size-4" /> {section.place}
              </span>
            ) : null}
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold text-balance sm:text-5xl">
            {section.title}
          </h1>

          <Link
            href={ministryHref(ministry)}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ffcf4a] transition hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Back to {ministry.title}
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-b from-[#f7fbfd] to-white px-4 py-12 text-[#102a43] sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {siblings.length > 1 ? (
            <div
              role="tablist"
              aria-label="Other places"
              className="mb-10 flex flex-wrap gap-2 border-b border-[#d9eef3] pb-px"
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
                        ? "-mb-px border-b-2 border-[#0e98ac] px-3 py-2.5 text-sm font-semibold text-[#023e8a]"
                        : "px-3 py-2.5 text-sm font-semibold text-[#5c6b7a] transition hover:text-[#023e8a]"
                    }
                  >
                    {item.title}
                  </Link>
                )
              })}
            </div>
          ) : null}

          <MinistrySectionContentTabs content={section} />
        </div>
      </section>
    </>
  )
}
