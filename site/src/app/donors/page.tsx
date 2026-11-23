import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { DonatePanel } from "@/components/sections/donors/donate-panel"
import { PartnersRanking } from "@/components/sections/donors/partners-ranking"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PageBanner } from "@/components/sections/page-banner"
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

      <PartnersRanking
        kicker={intro.kicker}
        title={intro.title}
        subtitle={intro.subtitle}
        donors={items}
      />

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
