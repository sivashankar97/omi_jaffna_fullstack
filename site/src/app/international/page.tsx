import type { Metadata } from "next"

import { PageHero } from "@/components/layout/page-hero"
import { Reveal } from "@/components/motion/reveal"
import { getFormationAbroad, getMissionCountries } from "@/lib/cms"

export const metadata: Metadata = {
  title: "International Mission",
  description: "Oblates of the Jaffna Province serving beyond Sri Lanka.",
}

export default async function InternationalPage() {
  const [missionCountries, formationAbroad] = await Promise.all([getMissionCountries(), getFormationAbroad()])
  return (
    <>
      <PageHero
        id="sent"
        tone="cyan"
        kicker="The mission comes full circle"
        title="Missionaries once came here. Now the Province also sends."
        summary="Oblates from the Province serve in Mexico, Kenya, Denmark, Italy, the United Kingdom, Norway, Australia and Pakistan. Diaspora chaplaincy is also identified in France."
      />
      <section id="countries" className="scroll-mt-80 bg-[#f7fbff] px-4 py-16 text-[#023e8a] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl">Countries of mission</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {missionCountries.map((country, index) => (
              <Reveal
                key={country}
                as="li"
                delay={index * 70}
                className="rounded-full border-2 border-[#023e8a] bg-white px-4 py-2 font-semibold text-[#023e8a]"
              >
                {country}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section id="formation-abroad" className="scroll-mt-80 bg-white px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl">Formation beyond Sri Lanka</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {formationAbroad.map((place) => (
              <p key={place} className="rounded-2xl border-2 border-[#023e8a] bg-[#f7fbff] p-6 font-heading text-2xl text-[#023e8a]">
                {place}
              </p>
            ))}
          </div>
          <p className="mt-8 max-w-2xl leading-8">
            Country lists and current assignments will be shown as an interactive map only after they are verified with the Province.
          </p>
        </div>
      </section>
    </>
  )
}
