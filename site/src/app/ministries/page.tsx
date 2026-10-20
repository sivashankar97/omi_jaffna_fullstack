import type { Metadata } from "next"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { MinistryExplorer } from "@/components/sections/ministries/ministry-explorer"
import { PageBanner } from "@/components/sections/page-banner"
import { SectionHeading } from "@/components/sections/section-heading"
import { anchorId, parishAnchor } from "@/config/navigation"
import { getMinistries, getParishes, getSchools } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Ministries",
  description: "Seventeen ministries and twelve parishes of the Oblate Province of Jaffna.",
}

export default async function MinistriesPage() {
  const [ministries, parishes, schools] = await Promise.all([getMinistries(), getParishes(), getSchools()])
  return (
    <>
      <ScrollProgress />
      <PageBanner
        id="all-ministries"
        kicker="Our ministries"
        title="Many places. One mission."
        summary="From parishes and schools to youth centres, counselling, rehabilitation, peacebuilding, community development, formation and diaspora ministry."
        stats={[
          { value: String(ministries.length), label: "Ministries" },
          { value: String(parishes.length), label: "Parishes" },
          { value: "1", label: "Mission" },
        ]}
      />

      <section className="bg-[#f4fbfd] px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
        <SectionHeading
          kicker="Where we serve"
          title="Ministries of the Province"
          subtitle="Tap any ministry to read the full story of how Oblates serve there."
        />
        <div className="mt-14">
          <MinistryExplorer ministries={ministries} />
        </div>
      </section>

      <section id="parish-directory" className="scroll-mt-80 bg-white px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            kicker="Parish directory"
            title={`${parishes.length} parishes, one pastoral family`}
            subtitle="Each parish is a place of worship, accompaniment and missionary service. Mass times and clergy assignments will be published after confirmation by each parish."
          />
          <ol className="mt-12 grid gap-3 sm:grid-cols-2">
            {parishes.map((parish, index) => (
              <Reveal
                id={parishAnchor(parish.name)}
                key={parish.name}
                as="li"
                from={index % 2 === 0 ? "left" : "right"}
                delay={(index % 4) * 60}
                className="group flex scroll-mt-80 items-center gap-4 rounded-2xl border border-[#d5dee6] bg-white px-4 py-3 text-[#023e8a] shadow-sm transition hover:border-[#17b3c6] hover:shadow-[0_18px_40px_-24px_rgba(10,80,98,0.6)]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0a5062] to-[#17b3c6] font-heading text-base text-white transition group-hover:scale-110">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-semibold">{parish.name}</span>
                  <span className="block text-sm text-[#5c6b7a]">{parish.place}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {schools.length > 0 ? (
        <section id="schools" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              kicker="Schools and education"
              title="Schools served by the Oblates"
              subtitle="Schools where Oblates teach, lead or accompany students and staff."
            />
            <ul className="mt-12 grid gap-3 sm:grid-cols-2">
              {schools.map((school, index) => (
                <Reveal
                  key={school.name}
                  id={`school-${anchorId(school.name)}`}
                  as="li"
                  from={index % 2 === 0 ? "left" : "right"}
                  delay={(index % 4) * 60}
                  className="flex scroll-mt-80 items-center gap-4 rounded-2xl border border-[#d5dee6] bg-white px-4 py-3 shadow-sm"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0a5062] to-[#17b3c6] font-heading text-base text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-semibold">{school.name}</span>
                    {school.place ? <span className="block text-sm text-[#5c6b7a]">{school.place}</span> : null}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  )
}
