import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarCheck2 } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { CouncilPortrait } from "@/components/sections/leadership/council-portrait"
import { PriestDirectory } from "@/components/sections/leadership/priest-directory"
import { SectionHeading } from "@/components/sections/section-heading"
import { anchorId, councilHref, formerProvincialHref } from "@/config/navigation"
import { portraitCrops, type PortraitCrop } from "@/content/leadership"
import { isUpload } from "@/content/site-info"
import { getBlock, getFormerProvincials, getLeadership, getPriests } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Leadership",
  description: "Provincial leadership of the Oblate Province of Jaffna.",
}

function initials(name: string) {
  const words = name.replace(/Rev\.?|Fr\.?|OMI|,/gi, "").trim().split(/\s+/)
  return `${words[0]?.[0] ?? ""}${words.length > 1 ? words[words.length - 1][0] : ""}`.toUpperCase()
}

function cropStyle(crop: PortraitCrop): React.CSSProperties {
  const width = 100 / crop.span
  const height = width * (crop.h / crop.w)
  return {
    position: "absolute",
    maxWidth: "none",
    width: `${width}%`,
    left: `${50 - crop.fx * width}%`,
    top: `${42 - crop.fy * height}%`,
  }
}

export default async function LeadershipPage() {
  const [leadership, formerProvincials, priests, sections] = await Promise.all([
    getLeadership(),
    getFormerProvincials(),
    getPriests(),
    getBlock("leadership"),
  ])
  const { superior } = leadership
  const council = leadership.council
  const councilTerm = council.find((person) => person.term)?.term ?? "2026 – 2029"
  const { hero, superior: superiorHeading } = sections

  return (
    <>
      <ScrollProgress />
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-white sm:px-8 sm:py-28">
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -bottom-40 -left-32 -z-10 size-[28rem] rounded-full bg-[#17b3c6] opacity-25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -top-32 right-0 -z-10 size-[24rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px] [animation-delay:-7s]"
        />
        <div className="mx-auto max-w-6xl">
          <p
            className="history-rise flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm"
            style={{ "--rise-delay": "100ms" } as React.CSSProperties}
          >
            <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
            {hero.kicker}
          </p>
          <h1
            className="history-rise mt-4 font-heading text-5xl leading-[1.05] font-semibold sm:text-7xl"
            style={{ "--rise-delay": "250ms" } as React.CSSProperties}
          >
            {hero.title}
          </h1>
          <p
            className="history-rise mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-xl sm:leading-9"
            style={{ "--rise-delay": "450ms" } as React.CSSProperties}
          >
            {hero.summary}
          </p>
        </div>
      </header>

      {superior ? (
      <section id="provincial-superior" className="scroll-mt-80 overflow-hidden bg-white px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kicker={superiorHeading.kicker} title={superiorHeading.title} />

          <div className="mt-16 grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal from="zoom" className="relative mx-auto w-full max-w-md">
              <div className="relative aspect-[4/5]">
                <div
                  aria-hidden="true"
                  className="leader-ring absolute bottom-0 left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full border-2 border-dashed border-[#17b3c6]/40"
                />
                <div
                  aria-hidden="true"
                  className="absolute bottom-[4%] left-1/2 aspect-square w-[84%] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#caf0f8] via-[#48cae4] to-[#0e6a68] shadow-[0_40px_80px_-30px_rgba(14,106,104,0.65)]"
                />
                <div className="absolute inset-x-0 bottom-[4%] top-0 overflow-hidden rounded-b-full">
                  {superior.image ? (
                    <Image
                      src={superior.image}
                      alt={superior.name}
                      fill
                      priority
                      unoptimized={isUpload(superior.image)}
                      sizes="(min-width: 1024px) 28rem, 90vw"
                      className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(3,32,43,0.35)]"
                    />
                  ) : null}
                </div>
              </div>
              <div className="charism-float absolute right-0 bottom-10 rounded-2xl bg-white px-5 py-3 shadow-[0_20px_45px_-20px_rgba(2,62,138,0.5)] ring-1 ring-[#e2f2f6] sm:-right-4">
                <p className="text-[11px] font-bold tracking-[0.18em] text-[#17b3c6] uppercase">Since</p>
                <p className="font-heading text-2xl font-bold text-[#023e8a]">{superior.since}</p>
              </div>
            </Reveal>

            <Reveal from="right" delay={150}>
              <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#17b3c6] uppercase">
                <span aria-hidden="true" className="h-px w-8 bg-[#17b3c6]" />
                {superior.role}
              </p>
              <h2 className="mt-4 font-heading text-3xl leading-tight font-semibold text-[#023e8a] sm:text-4xl">
                {superior.name}
              </h2>
              <p className="mt-3 inline-flex rounded-full bg-[#e7fbff] px-4 py-1.5 text-sm font-semibold text-[#0e98ac]">
                {superior.term}
              </p>
              <p className="mt-6 text-lg leading-8 text-[#3d4b59]">{superior.bio}</p>

              <ol className="mt-8 grid gap-4 sm:grid-cols-2">
                {superior.terms.map((term, index) => (
                  <li
                    key={term.label}
                    className="group rounded-2xl border border-[#e2f2f6] bg-[#f4fbfd] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#17b3c6] hover:bg-white hover:shadow-[0_20px_40px_-28px_rgba(2,62,138,0.5)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-[#023e8a] text-[#ffcf4a] transition group-hover:bg-[#17b3c6] group-hover:text-white">
                        <CalendarCheck2 aria-hidden="true" className="size-4" />
                      </span>
                      <p className="font-heading font-semibold text-[#023e8a]">
                        {term.label}
                        <span className="ml-2 text-xs font-bold text-[#ffbf00]">0{index + 1}</span>
                      </p>
                    </div>
                    <dl className="mt-4 space-y-1.5 text-sm text-[#5c6b7a]">
                      <div className="flex justify-between gap-3">
                        <dt>Appointed</dt>
                        <dd className="font-semibold text-[#023e8a]">{term.appointed}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Installed</dt>
                        <dd className="font-semibold text-[#023e8a]">{term.installed}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>
      ) : null}

      <section id="council" className="relative isolate scroll-mt-80 overflow-visible bg-[#f4fbfd] px-4 py-20 sm:px-8 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-[4%] hidden h-48 w-40 -translate-y-1/2 opacity-40 sm:block"
          style={{
            backgroundImage: "radial-gradient(circle, rgb(23 179 198 / 0.35) 1.25px, transparent 1.3px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            kicker={councilTerm}
            title="Provincial Council"
            subtitle="Working together for the life and mission of the Province."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-12 pt-14 sm:mt-12 sm:gap-x-6 sm:gap-y-14 sm:pt-16">
            {council.map((person, index) => {
              const photo = person.image
              return (
                <Reveal
                  key={`${person.role}-${person.name}`}
                  id={`council-${anchorId(person.name)}`}
                  from="up"
                  delay={(index % 4) * 80}
                  className="group scroll-mt-80 w-full max-w-[15.5rem] overflow-visible sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] lg:max-w-none"
                >
                  <Link
                    href={councilHref(person)}
                    className="relative block h-full overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-[#17b3c6] focus-visible:ring-offset-2"
                    aria-label={`Open profile for ${person.name}`}
                  >
                    {/* Teal plate; portrait sits edge-to-edge and pops slightly above the top */}
                    <article className="relative aspect-[4/5] overflow-visible transition duration-500 group-hover:-translate-y-1.5">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-b from-[#2bc4d6] via-[#17b3c6] to-[#0e98ac] shadow-[0_22px_40px_-24px_rgb(14_152_172/0.65)] transition duration-500 group-hover:shadow-[0_28px_48px_-22px_rgb(14_152_172/0.75)]"
                      />

                      {photo ? (
                        <CouncilPortrait src={photo} alt={person.name} />
                      ) : (
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                          <span className="flex size-28 items-center justify-center rounded-full bg-white/20 font-heading text-3xl font-bold text-white ring-2 ring-white/30">
                            {initials(person.name)}
                          </span>
                        </div>
                      )}

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[46%] rounded-b-[1.75rem] bg-gradient-to-t from-[#0a5062]/95 via-[#0e98ac]/55 to-transparent"
                      />

                      <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-3 p-4 sm:p-5">
                        <div className="min-w-0 pr-1">
                          <p className="font-heading text-[15px] leading-snug font-semibold text-white sm:text-base">
                            {person.name}
                          </p>
                          <p className="mt-1 text-xs leading-snug text-white/85 sm:text-[13px]">{person.role}</p>
                        </div>
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#17b3c6] shadow-[0_8px_18px_-10px_rgb(3_32_43/0.45)] transition group-hover:translate-x-0.5">
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </span>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="former-provincials" className="scroll-mt-80 bg-white px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            kicker="Our heritage"
            title="Former Provincials"
            subtitle="Dates follow the list currently published by the Province and will be confirmed with Province archives."
          />
          <ol className="relative mt-14 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-7 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-[#17b3c6] before:to-[#ffbf00] sm:before:left-1/2">
            {formerProvincials.map((person, index) => {
              const right = index % 2 === 1
              const photo = person.image
              const crop = photo ? portraitCrops[photo] : undefined
              return (
                <Reveal
                  key={`${person.name}-${person.dates}`}
                  id={`former-${anchorId(person.name)}`}
                  as="li"
                  from={right ? "right" : "left"}
                  delay={60}
                  className={`group relative scroll-mt-80 pl-14 sm:w-1/2 sm:pl-0 ${right ? "sm:ml-auto sm:pl-10" : "sm:pr-10"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 left-7 h-0.5 w-7 -translate-y-1/2 bg-[#48cae4]/60 sm:w-10 ${
                      right ? "sm:left-0" : "sm:right-0 sm:left-auto"
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 left-7 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#17b3c6] shadow-[0_0_0_4px_rgba(23,179,198,0.2)] ${
                      right ? "sm:left-0" : "sm:right-0 sm:left-auto sm:translate-x-1/2"
                    }`}
                  />
                  <Link
                    href={formerProvincialHref(person)}
                    className={`flex items-center gap-4 rounded-full bg-[#f4fbfd] py-2 pr-6 pl-2 ring-1 ring-[#e2f2f6] transition duration-300 outline-none group-hover:bg-white group-hover:shadow-[0_18px_40px_-28px_rgba(2,62,138,0.5)] group-hover:ring-[#48cae4]/60 focus-visible:ring-2 focus-visible:ring-[#17b3c6] focus-visible:ring-offset-2 ${
                      right ? "sm:flex-row-reverse sm:pr-2 sm:pl-6 sm:text-right" : ""
                    }`}
                    aria-label={`Open profile for ${person.name}`}
                  >
                    <span className="relative block size-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#90e0ef] via-[#0077b6] to-[#023e8a] shadow-[0_12px_26px_-12px_rgba(2,62,138,0.75)] ring-4 ring-white transition duration-500 group-hover:scale-110 group-hover:ring-[#ffcf4a] sm:size-20">
                      {photo && crop ? (
                        <img src={photo} alt={person.name} loading="lazy" style={cropStyle(crop)} />
                      ) : photo ? (
                        <img src={photo} alt={person.name} loading="lazy" className="size-full object-cover object-top" />
                      ) : (
                        <span className="flex size-full items-center justify-center font-heading text-base font-bold text-white">
                          {initials(person.name)}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold tracking-[0.16em] text-[#ffbf00]">{person.dates}</p>
                      <p className="mt-1 font-heading text-lg leading-snug font-semibold text-[#023e8a]">{person.name}</p>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </section>

      <PriestDirectory priests={priests} />
    </>
  )
}
