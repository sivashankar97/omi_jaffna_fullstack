import type { Metadata } from "next"

import { PageHero } from "@/components/layout/page-hero"
import { Reveal } from "@/components/motion/reveal"
import { CharismJoin } from "@/components/sections/charism/charism-join"
import { CharismVow } from "@/components/sections/charism/charism-vow"
import { CharismWays } from "@/components/sections/charism/charism-ways"
import { JourneyPath } from "@/components/sections/home/journey-path"
import { getCharismContent } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Charism",
  description:
    "Evangelizing the poor — the charism, mission and vision of the Oblate Province of Jaffna, and its story since 1847.",
}

export default async function CharismPage() {
  const content = await getCharismContent()
  return (
    <>
      <PageHero
        id="charism"
        tone="cyan"
        kicker={content.kicker}
        title={content.title}
        summary={content.summary}
      />
      <CharismJoin tone="hero" />
      <CharismWays ways={content.ways} />
      <CharismJoin tone="ways" />
      <CharismVow />
      <CharismJoin tone="vow" />
      <section id="about" className="scroll-mt-80 bg-white px-4 py-20 text-[#023e8a] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal from="up" id="who-we-are" className="text-center">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">About us</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">{content.aboutHeading}</h2>
            {content.about.map((paragraph) => (
              <p key={paragraph} className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#3d4b59]">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <div id="arrival" className="mt-12 grid scroll-mt-80 gap-6 md:grid-cols-2">
            <Reveal
              from="left"
              className="rounded-[2rem] bg-gradient-to-br from-[#0f9fb4] via-[#17b3c6] to-[#0e98ac] p-8 text-white shadow-md"
            >
              <p className="text-xs font-semibold tracking-[0.22em] text-white/80 uppercase">Arrival</p>
              <p className="mt-4 font-heading text-3xl leading-snug">
                {content.arrival}
              </p>
            </Reveal>
            <Reveal from="right" delay={150} className="rounded-[2rem] bg-[#f7fbff] p-8 ring-1 ring-[#cfe9ef]">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">The mission</p>
              <p className="mt-4 text-lg leading-8 text-[#3d4b59]">
                {content.mission}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
      <div id="history" className="scroll-mt-80">
        <JourneyPath />
      </div>
    </>
  )
}
