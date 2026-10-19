import type { Metadata } from "next"
import Image from "next/image"
import { CalendarCheck2 } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PriestDirectory } from "@/components/sections/leadership/priest-directory"
import { SectionHeading } from "@/components/sections/section-heading"
import { councilImages, provincialSuperior } from "@/content/leadership"
import { getFormerProvincials, getLeadership, getPriests } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Leadership",
  description: "Provincial leadership of the Oblate Province of Jaffna.",
}

function initials(name: string) {
  const words = name.replace(/Rev\.?|Fr\.?|OMI|,/gi, "").trim().split(/\s+/)
  return `${words[0]?.[0] ?? ""}${words.length > 1 ? words[words.length - 1][0] : ""}`.toUpperCase()
}

export default async function LeadershipPage() {
  const [{ council }, formerProvincials, priests] = await Promise.all([
    getLeadership(),
    getFormerProvincials(),
    getPriests(),
  ])
  const superior = provincialSuperior

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
            Province leadership
          </p>
          <h1
            className="history-rise mt-4 font-heading text-5xl leading-[1.05] font-semibold sm:text-7xl"
            style={{ "--rise-delay": "250ms" } as React.CSSProperties}
          >
            Leadership
          </h1>
          <p
            className="history-rise mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-xl sm:leading-9"
            style={{ "--rise-delay": "450ms" } as React.CSSProperties}
          >
            From Thodarpaham in Jaffna, the Provincial Superior and Council coordinate the missionary life of the
            Province. Administration exists to enable mission.
          </p>
        </div>
      </header>

      <section id="provincial-superior" className="scroll-mt-80 overflow-hidden bg-white px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kicker="Provincial Superior" title="Our Provincial Leader" />

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
                  <Image
                    src={superior.image}
                    alt={superior.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 28rem, 90vw"
                    className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(3,32,43,0.35)]"
                  />
                </div>
              </div>
              <div className="charism-float absolute right-0 bottom-10 rounded-2xl bg-white px-5 py-3 shadow-[0_20px_45px_-20px_rgba(2,62,138,0.5)] ring-1 ring-[#e2f2f6] sm:-right-4">
                <p className="text-[11px] font-bold tracking-[0.18em] text-[#17b3c6] uppercase">Since</p>
                <p className="font-heading text-2xl font-bold text-[#023e8a]">2023</p>
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

      <section id="council" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            kicker="2026 – 2029"
            title="Provincial Council"
            subtitle="The Council supports the Provincial Superior in guiding the mission and life of the Province."
          />
          <div className="mx-auto mt-16 grid max-w-5xl gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {council.map((person, index) => {
              const photo = councilImages[person.name]
              return (
                <Reveal key={`${person.role}-${person.name}`} from="up" delay={(index % 3) * 120} className="group">
                  <article className="relative mx-auto aspect-[4/5] w-full max-w-xs transition duration-500 group-hover:-translate-y-2">
                    <div
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 left-0 w-[46%] overflow-hidden rounded-t-[3rem] rounded-b-[1.5rem] shadow-[0_30px_60px_-30px_rgba(3,32,43,0.7)]"
                      style={{ background: "linear-gradient(180deg, #17b3c6 0%, #0e98ac 38%)" }}
                    >
                      <span className="absolute inset-x-0 top-5 flex justify-center font-heading text-6xl font-bold tracking-wide text-white/15 uppercase [writing-mode:vertical-rl] rotate-180">
                        Council
                      </span>
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-[38%] bottom-0 rounded-[1.5rem] rounded-tl-none shadow-[0_30px_60px_-30px_rgba(3,32,43,0.7)]"
                      style={{ background: "linear-gradient(180deg, #0e98ac 0%, #0a5062 70%, #06394a 100%)" }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-[38%] right-5 z-10 h-1 w-10 rounded-full bg-[#ffcf4a] transition-all duration-500 group-hover:w-16"
                    />

                    {photo ? (
                      <div className="absolute inset-x-0 top-[5%] bottom-0 z-10 overflow-hidden rounded-b-[1.5rem]">
                        <Image
                          src={photo}
                          alt={person.name}
                          fill
                          sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
                          className="origin-bottom object-contain object-bottom drop-shadow-[0_18px_24px_rgba(3,32,43,0.45)] transition duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 top-[22%] z-10 flex justify-center">
                        <span className="flex size-32 items-center justify-center rounded-full bg-white/15 font-heading text-4xl font-bold text-white ring-4 ring-white/25 backdrop-blur-sm transition duration-500 group-hover:scale-105">
                          {initials(person.name)}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 z-20 h-[45%] rounded-b-[1.5rem] bg-gradient-to-t from-[#03202b] via-[#03202b]/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 z-30 p-5">
                      <p className="text-[11px] font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">{person.role}</p>
                      <p className="mt-1 font-heading text-lg leading-snug font-semibold text-white">{person.name}</p>
                    </div>
                  </article>
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
          <ol className="relative mt-14 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[1.1rem] before:w-0.5 before:bg-gradient-to-b before:from-[#17b3c6] before:to-[#ffbf00] sm:before:left-1/2 sm:before:-translate-x-1/2">
            {formerProvincials.map((person, index) => {
              const right = index % 2 === 1
              return (
                <Reveal
                  key={`${person.name}-${person.dates}`}
                  as="li"
                  from={right ? "right" : "left"}
                  delay={60}
                  className={`relative pl-12 sm:w-1/2 sm:pl-0 ${right ? "sm:ml-auto sm:pl-10" : "sm:pr-10"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-6 left-3 size-3.5 rounded-full border-2 border-white bg-[#17b3c6] shadow-[0_0_0_4px_rgba(23,179,198,0.2)] ${
                      right ? "sm:-left-[0.45rem]" : "sm:right-[-0.45rem] sm:left-auto"
                    }`}
                  />
                  <div
                    className={`rounded-2xl bg-[#f4fbfd] px-5 py-4 ring-1 ring-[#e2f2f6] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_-28px_rgba(2,62,138,0.5)] ${
                      right ? "" : "sm:text-right"
                    }`}
                  >
                    <p className="text-xs font-bold tracking-[0.16em] text-[#ffbf00]">{person.dates}</p>
                    <p className="mt-1 font-heading text-lg font-semibold text-[#023e8a]">{person.name}</p>
                  </div>
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
