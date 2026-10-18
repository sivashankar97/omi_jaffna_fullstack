import type { Metadata } from "next"

import { PageHero } from "@/components/layout/page-hero"
import { Reveal } from "@/components/motion/reveal"
import { PriestDirectory } from "@/components/sections/leadership/priest-directory"
import { getFormerProvincials, getLeadership, getPriests } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Leadership",
  description: "Provincial leadership of the Oblate Province of Jaffna.",
}

export default async function LeadershipPage() {
  const [{ superior, council }, formerProvincials, priests] = await Promise.all([
    getLeadership(),
    getFormerProvincials(),
    getPriests(),
  ])
  return (
    <>
      <PageHero
        id="provincial-superior"
        tone="black"
        kicker={superior?.term || "2023–2026"}
        title={superior?.name ?? "Very Rev. Fr. Paul Jeyanthan Pachchek, OMI"}
        summary={
          superior?.summary ||
          "Provincial Superior. From Thodarpaham in Jaffna, the Province coordinates its missionary life. Administration exists to enable mission."
        }
      />
      <section id="council" className="scroll-mt-80 bg-white px-4 py-16 text-[#023e8a] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl">Provincial Council 2026–2029</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {council.map((person, index) => (
              <Reveal key={`${person.role}-${person.name}`} delay={index * 80}>
                <article className="lead-card rounded-2xl p-5 text-[#023e8a] transition duration-300 hover:-translate-y-1">
                  <p className="text-xs tracking-[0.2em] uppercase">{person.role}</p>
                  <p className="mt-2 font-heading text-2xl">{person.name}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section id="former-provincials" className="scroll-mt-80 bg-[#f7fbff] px-4 py-16 text-[#023e8a] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl">Former Provincials</h2>
          <p className="mt-3 max-w-2xl text-sm text-[#5c6b7a]">
            Dates below follow the list currently published by the Province. Where years overlap, the chronology will be confirmed with Province archives before it is treated as a final historical record.
          </p>
          <ul className="lead-rule mt-8">
            {formerProvincials.map((person) => (
              <li key={`${person.name}-${person.dates}`} className="flex flex-wrap justify-between gap-2 py-3">
                <span>{person.name}</span>
                <span className="font-semibold text-[#0077b6]">{person.dates}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <PriestDirectory priests={priests} />
    </>
  )
}
