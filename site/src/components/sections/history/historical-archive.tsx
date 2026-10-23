"use client"

import { NecrologyRegister, type NecrologyCopy } from "@/components/sections/media/necrology-register"
import { YearJourney } from "@/components/sections/history/year-journey"
import { SectionHeading } from "@/components/sections/section-heading"
import type { NecrologyPerson, TimelineEntry } from "@/lib/cms"

type ArchiveCopy = {
  kicker: string
  title: string
  subtitle: string
  journeyTitle: string
  journeyIntro: string
}

export function HistoricalArchive({
  timeline,
  people,
  archive,
  necrology,
}: {
  timeline: TimelineEntry[]
  people: NecrologyPerson[]
  archive: ArchiveCopy
  necrology: NecrologyCopy
}) {
  return (
    <section id="historical-archive" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker={archive.kicker} title={archive.title} subtitle={archive.subtitle} />
        <div className="mt-12">
          <NecrologyRegister people={people} copy={necrology} />
        </div>
        {timeline.length > 0 ? (
          <YearJourney timeline={timeline} title={archive.journeyTitle} intro={archive.journeyIntro} />
        ) : null}
      </div>
    </section>
  )
}
