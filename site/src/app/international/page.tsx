import type { Metadata } from "next"
import Link from "next/link"
import { Globe2, GraduationCap, MapPin, Plane } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PageBanner } from "@/components/sections/page-banner"
import { SectionHeading } from "@/components/sections/section-heading"
import { anchorId } from "@/config/navigation"
import { getFormationAbroad, getMissionCountries } from "@/lib/cms"

export const metadata: Metadata = {
  title: "International Mission",
  description: "Oblates of the Jaffna Province serving beyond Sri Lanka.",
}

const regions: Record<string, string> = {
  Mexico: "Americas",
  Kenya: "Africa",
  Denmark: "Europe",
  Italy: "Europe",
  "United Kingdom": "Europe",
  Norway: "Europe",
  Australia: "Oceania",
  Pakistan: "Asia",
  France: "Europe",
  Philippines: "Asia",
  Rome: "Europe",
}

const formationNotes: Record<string, string> = {
  Philippines: "Studies and formation alongside Oblates from across Asia.",
  Australia: "Higher studies and pastoral experience in a multicultural Church.",
  Rome: "Specialised studies close to the heart of the universal Church and the Oblate General House.",
}

export default async function InternationalPage() {
  const [missionCountries, formationAbroad] = await Promise.all([getMissionCountries(), getFormationAbroad()])
  return (
    <>
      <ScrollProgress />
      <PageBanner
        id="sent"
        kicker="The mission comes full circle"
        title="Missionaries once came here. Now the Province also sends."
        summary="Oblates from the Province serve in Mexico, Kenya, Denmark, Italy, the United Kingdom, Norway, Australia and Pakistan. Diaspora chaplaincy is also identified in France."
        stats={[
          { value: String(missionCountries.length), label: "Countries" },
          { value: String(formationAbroad.length), label: "Study abroad" },
          { value: "5", label: "Continents" },
        ]}
      />

      <section id="countries" className="scroll-mt-80 bg-white px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
        <SectionHeading
          kicker="Sent to the nations"
          title="Countries of mission"
          subtitle="Wherever they are sent, Oblates of Jaffna carry the same charism: to be close to the poor and to proclaim Christ."
        />
        <ul className="mx-auto mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {missionCountries.map((country, index) => (
            <Reveal
              key={country}
              id={`country-${anchorId(country)}`}
              as="li"
              from="up"
              delay={(index % 4) * 100}
              className="h-full scroll-mt-80"
            >
              <article className="group relative h-full overflow-hidden rounded-[1.5rem] border border-[#d5dee6] bg-white p-6 transition duration-500 hover:-translate-y-1.5 hover:border-[#17b3c6] hover:shadow-[0_28px_56px_-30px_rgba(10,80,98,0.6)]">
                <Globe2
                  aria-hidden="true"
                  className="absolute -right-6 -bottom-6 size-28 text-[#17b3c6]/10 transition duration-700 group-hover:rotate-45 group-hover:text-[#17b3c6]/20"
                />
                <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#0a5062] to-[#17b3c6] text-white">
                  <MapPin className="size-5" />
                </span>
                <p className="mt-5 text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">
                  {regions[country] ?? "Mission"}
                </p>
                <h3 className="mt-1 font-heading text-2xl font-semibold text-[#023e8a]">{country}</h3>
              </article>
            </Reveal>
          ))}
        </ul>
        <Reveal from="up" className="mx-auto mt-10 max-w-6xl">
          <p className="flex items-start gap-3 rounded-2xl bg-[#f4fbfd] p-5 text-sm leading-7 text-[#3d4b59] ring-1 ring-[#17b3c6]/20">
            <Plane aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#0a5062]" />
            Diaspora chaplaincy accompanies Tamil Catholic communities abroad, including in France. Current assignments
            will be shown on an interactive map once verified with the Province.
          </p>
        </Reveal>
      </section>

      <section id="formation-abroad" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
        <SectionHeading
          kicker="Formation abroad"
          title="Formation beyond Sri Lanka"
          subtitle="Young Oblates are also formed in international communities, preparing them for a mission without borders."
        />
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
          {formationAbroad.map((place, index) => (
            <Reveal key={place} id={`abroad-${anchorId(place)}`} from="zoom" delay={index * 120} className="h-full scroll-mt-80">
              <article className="group h-full rounded-[1.75rem] bg-white p-7 text-center shadow-[0_20px_50px_-35px_rgba(10,80,98,0.6)] ring-1 ring-[#d5dee6] transition duration-500 hover:-translate-y-2 hover:ring-[#17b3c6]">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffcf4a]/20 text-[#b07d00] transition duration-500 group-hover:scale-110 group-hover:bg-[#ffcf4a]">
                  <GraduationCap className="size-8" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-heading text-3xl font-semibold text-[#023e8a]">{place}</h3>
                <p className="mt-1 text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">{regions[place] ?? "Abroad"}</p>
                {formationNotes[place] ? <p className="mt-4 leading-7 text-[#5c6b7a]">{formationNotes[place]}</p> : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-center text-white sm:px-8">
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -bottom-40 left-1/3 -z-10 size-[26rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px]"
        />
        <Reveal from="up" className="mx-auto max-w-3xl">
          <p className="font-heading text-3xl leading-snug italic sm:text-4xl">
            “Go into all the world and proclaim the Good News to the whole creation.”
          </p>
          <p className="mt-4 text-sm font-semibold tracking-[0.22em] text-[#ffcf4a] uppercase">Mark 16:15</p>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-full bg-[#ffcf4a] px-6 py-3 text-sm font-semibold text-[#03202b] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
          >
            Connect with our missionaries
          </Link>
        </Reveal>
      </section>
    </>
  )
}
