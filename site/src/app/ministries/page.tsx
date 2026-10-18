import type { Metadata } from "next"

import { PageHero } from "@/components/layout/page-hero"
import { Reveal } from "@/components/motion/reveal"
import { MinistryCard } from "@/components/sections/ministry-card"
import { ministryAnchor, parishAnchor } from "@/config/navigation"
import { getMinistries, getParishes } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Ministries",
  description: "Seventeen ministries and twelve parishes of the Oblate Province of Jaffna.",
}

export default async function MinistriesPage() {
  const [ministries, parishes] = await Promise.all([getMinistries(), getParishes()])
  return (
    <>
      <PageHero
        id="all-ministries"
        tone="white"
        kicker={`${ministries.length} ministries`}
        title="Many places. One mission."
        summary="From parishes and schools to youth centres, counselling, rehabilitation, peacebuilding, community development, formation and diaspora ministry."
      />
      <section className="bg-[#f7fbff] px-4 py-14 text-[#023e8a] sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((ministry, index) => (
            <Reveal id={ministryAnchor(ministry.number)} key={ministry.number} delay={(index % 4) * 70} className="h-full">
              <MinistryCard ministry={ministry} index={index} />
            </Reveal>
          ))}
        </div>
      </section>
      <section id="parish-directory" className="scroll-mt-80 bg-white px-4 py-20 text-[#023e8a] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal from="up" className="text-center">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">Parish directory</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">{parishes.length} parishes, one pastoral family</h2>
            <p className="mx-auto mt-4 max-w-3xl leading-7 text-[#3d4b59]">
              Each parish is a place of worship, accompaniment and missionary service. Mass times and clergy assignments
              will be published only after confirmation by the responsible parish, with a last-verified date.
            </p>
          </Reveal>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2">
            {parishes.map((parish, index) => (
              <Reveal
                id={parishAnchor(parish.name)}
                key={parish.name}
                as="li"
                from={index % 2 === 0 ? "left" : "right"}
                delay={(index % 4) * 60}
                className="flex scroll-mt-80 items-center gap-4 rounded-full border-2 border-[#17b3c6]/50 bg-white px-4 py-3 text-[#023e8a] hover:border-[#17b3c6] hover:bg-[#e7fbff]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#17b3c6] font-heading text-base text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-medium">{parish.name}</span>
                  <span className="block text-sm text-[#5c6b7a]">{parish.place}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
