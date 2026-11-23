import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, HandHeart } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { DonatePanel } from "@/components/sections/donors/donate-panel"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PageBanner } from "@/components/sections/page-banner"
import { SectionHeading } from "@/components/sections/section-heading"
import { isUpload } from "@/content/site-info"
import { getBlock } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Donors",
  description:
    "Foundations and solidarity partners who support the Oblate Province of Jaffna — Dontenwill, LBR, Misereor, Wilde Ganzen and more.",
}

type DonorItem = {
  name: string
  summary?: string
  website?: string
  region?: string
  image?: string
}

function DonorCardInner({ donor }: { donor: DonorItem }) {
  return (
    <>
      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-[#17b3c6] text-white shadow-[0_12px_24px_-12px_rgba(14,152,172,0.95)]">
          <HandHeart className="size-5" />
        </span>
        {donor.website ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-[#0e98ac] uppercase opacity-0 transition group-hover:opacity-100">
            Visit
            <ArrowUpRight className="size-3.5" />
          </span>
        ) : null}
      </div>

      <div className="relative z-10 mt-6 flex min-h-[5.5rem] items-center justify-center rounded-2xl border border-[#d5dee6]/80 bg-white px-4 py-5">
        {donor.image ? (
          <Image
            src={encodeURI(donor.image)}
            alt=""
            width={280}
            height={96}
            unoptimized={isUpload(donor.image) || donor.image.endsWith(".svg")}
            className="max-h-20 w-auto max-w-full object-contain"
          />
        ) : (
          <p className="font-heading text-xl font-semibold text-[#023e8a]">{donor.name}</p>
        )}
      </div>

      {donor.region ? (
        <p className="relative z-10 mt-5 text-[11px] font-bold tracking-[0.2em] text-[#17b3c6] uppercase">
          {donor.region}
        </p>
      ) : null}
      <h3 className="relative z-10 mt-1.5 font-heading text-2xl font-semibold text-[#03202b] transition group-hover:text-[#0e98ac]">
        {donor.name}
      </h3>
      {donor.summary ? (
        <p className="relative z-10 mt-3 flex-1 text-sm leading-7 text-[#5c6b7a]">{donor.summary}</p>
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-12 size-36 rounded-full bg-[#17b3c6]/10 blur-2xl transition duration-700 group-hover:bg-[#17b3c6]/20"
      />
    </>
  )
}

function DonorCard({ donor, index }: { donor: DonorItem; index: number }) {
  const className =
    "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#d5e6ec] bg-gradient-to-b from-[#eef8fb] via-[#f7fbfd] to-white p-6 shadow-[0_16px_40px_-28px_rgba(10,60,80,0.35)] transition duration-500 hover:-translate-y-1.5 hover:border-[#17b3c6] hover:shadow-[0_28px_56px_-28px_rgba(10,80,98,0.5)] sm:p-7"

  return (
    <Reveal from="up" delay={(index % 3) * 90} as="li" className="h-full">
      {donor.website ? (
        <a href={donor.website} target="_blank" rel="noreferrer" className={className}>
          <DonorCardInner donor={donor} />
        </a>
      ) : (
        <article className={className}>
          <DonorCardInner donor={donor} />
        </article>
      )}
    </Reveal>
  )
}

export default async function DonorsPage() {
  const copy = await getBlock("donors")
  const { hero, donate, intro, closing } = copy
  const items = (Array.isArray(copy.items) ? copy.items : []).filter(
    (item: DonorItem) => item?.name?.trim()
  ) as DonorItem[]

  return (
    <>
      <ScrollProgress />
      <PageBanner
        id="donors"
        kicker={hero.kicker}
        title={hero.title}
        summary={hero.summary}
        stats={[
          { value: String(items.length || "—"), label: hero.partnersLabel },
          { value: hero.countriesValue, label: hero.countriesLabel },
        ]}
      />

      <DonatePanel copy={donate} />

      <section
        id="partners"
        className="relative isolate scroll-mt-80 overflow-hidden bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-[28rem] rounded-full bg-[#17b3c6]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading kicker={intro.kicker} title={intro.title} subtitle={intro.subtitle} />

          {items.length ? (
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((donor, index) => (
                <DonorCard key={`${donor.name}-${index}`} donor={donor} index={index} />
              ))}
            </ul>
          ) : (
            <p className="mt-10 text-center text-[#5c6b7a]">Donor partners will appear here once published in the CMS.</p>
          )}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-center text-white sm:px-8">
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -bottom-40 left-1/3 -z-10 size-[26rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px]"
        />
        <Reveal from="up" className="mx-auto max-w-3xl">
          {closing.thanks ? <p className="mb-8 text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">{closing.thanks}</p> : null}
          <p className="font-heading text-3xl leading-snug italic sm:text-4xl">“{closing.quote}”</p>
          {closing.reference ? (
            <p className="mt-4 text-sm font-semibold tracking-[0.22em] text-[#ffcf4a] uppercase">{closing.reference}</p>
          ) : null}
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
