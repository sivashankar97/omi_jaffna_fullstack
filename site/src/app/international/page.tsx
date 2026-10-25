import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Globe2, GraduationCap, MapPin } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PageBanner } from "@/components/sections/page-banner"
import { SectionHeading } from "@/components/sections/section-heading"
import { anchorId, internationalCountryHref } from "@/config/navigation"
import {
  getBlock,
  getFormationAbroad,
  getMissionCountries,
  type FormationAbroadPlace,
  type MissionCountry,
} from "@/lib/cms"

export const metadata: Metadata = {
  title: "International Mission",
  description: "Oblates of the Jaffna Province serving beyond Sri Lanka.",
}

type CategoryCopy = { kicker: string; title: string; subtitle: string }

function CountryCard({
  country,
  index,
  cta,
}: {
  country: MissionCountry
  index: number
  cta: string
}) {
  const region = country.region || "Mission"
  return (
    <Reveal
      id={`country-${anchorId(country.slug)}`}
      as="li"
      from="up"
      delay={(index % 4) * 100}
      className="h-full scroll-mt-80"
    >
      <Link
        href={internationalCountryHref(country.slug)}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#d5dee6] bg-white p-6 transition duration-500 hover:-translate-y-1.5 hover:border-[#17b3c6] hover:shadow-[0_28px_56px_-30px_rgba(10,80,98,0.6)]"
      >
        {country.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={encodeURI(country.image)}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-15"
          />
        ) : (
          <Globe2
            aria-hidden="true"
            className="absolute -right-6 -bottom-6 size-28 text-[#17b3c6]/10 transition duration-700 group-hover:rotate-45 group-hover:text-[#17b3c6]/20"
          />
        )}
        <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#0a5062] to-[#17b3c6] text-white">
          <MapPin className="size-5" />
        </span>
        <p className="mt-5 text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">{region}</p>
        <h3 className="mt-1 font-heading text-2xl font-semibold text-[#023e8a] transition group-hover:text-[#0e98ac]">
          {country.name}
        </h3>
        {country.summary ? (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#5c6b7a]">{country.summary}</p>
        ) : null}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e98ac]">
          {cta}
          <ArrowUpRight aria-hidden="true" className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </Reveal>
  )
}

function CategorySection({
  id,
  copy,
  countries,
  cta,
}: {
  id: string
  copy: CategoryCopy
  countries: MissionCountry[]
  cta: string
}) {
  if (!countries.length) return null
  return (
    <section id={id} className="scroll-mt-80 px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
      <SectionHeading kicker={copy.kicker} title={copy.title} subtitle={copy.subtitle} />
      <ul className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map((country, index) => (
          <CountryCard key={country.slug} country={country} index={index} cta={cta} />
        ))}
      </ul>
    </section>
  )
}

function FormationCard({ place, index }: { place: FormationAbroadPlace; index: number }) {
  return (
    <Reveal key={place.slug} id={`abroad-${anchorId(place.slug)}`} from="zoom" delay={index * 120} className="h-full scroll-mt-80">
      <article className="group h-full rounded-[1.75rem] bg-[#f4fbfd] p-7 text-center shadow-[0_20px_50px_-35px_rgba(10,80,98,0.6)] ring-1 ring-[#d5dee6] transition duration-500 hover:-translate-y-2 hover:ring-[#17b3c6]">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffcf4a]/20 text-[#b07d00] transition duration-500 group-hover:scale-110 group-hover:bg-[#ffcf4a]">
          <GraduationCap className="size-8" strokeWidth={1.6} />
        </span>
        <h3 className="mt-5 font-heading text-3xl font-semibold text-[#023e8a]">{place.name}</h3>
        <p className="mt-1 text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">{place.region}</p>
        {place.summary ? <p className="mt-4 leading-7 text-[#5c6b7a]">{place.summary}</p> : null}
      </article>
    </Reveal>
  )
}

export default async function InternationalPage() {
  const [missionCountries, formationAbroad, sections] = await Promise.all([
    getMissionCountries(),
    getFormationAbroad(),
    getBlock("international"),
  ])
  const { hero, category1: cat1Copy, category2: cat2Copy, countryCardCta, formation, closing } = sections
  const category1 = missionCountries.filter((country) => country.category === "1")
  const category2 = missionCountries.filter((country) => country.category === "2")

  return (
    <>
      <ScrollProgress />
      <PageBanner
        id="sent"
        kicker={hero.kicker}
        title={hero.title}
        summary={hero.summary}
        stats={[
          { value: hero.countriesValue, label: hero.countriesLabel },
          { value: hero.continentsValue, label: hero.continentsLabel },
          { value: hero.studyAbroadValue, label: hero.studyAbroadLabel },
        ]}
      />

      <div className="bg-white">
        <CategorySection id="category-1" copy={cat1Copy} countries={category1} cta={countryCardCta} />
      </div>
      <div className="bg-[#f4fbfd]">
        <CategorySection id="category-2" copy={cat2Copy} countries={category2} cta={countryCardCta} />
      </div>

      {formationAbroad.length ? (
        <section id="formation-abroad" className="scroll-mt-80 bg-white px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
          <SectionHeading kicker={formation.kicker} title={formation.title} subtitle={formation.subtitle} />
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
            {formationAbroad.map((place, index) => (
              <FormationCard key={place.slug} place={place} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-center text-white sm:px-8">
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -bottom-40 left-1/3 -z-10 size-[26rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px]"
        />
        <Reveal from="up" className="mx-auto max-w-3xl">
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
