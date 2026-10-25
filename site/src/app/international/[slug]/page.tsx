import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { internationalCountryHref } from "@/config/navigation"
import { getMissionCountries, getMissionCountry } from "@/lib/cms"

type CountryPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return (await getMissionCountries()).map((country) => ({ slug: country.slug }))
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params
  const country = await getMissionCountry(slug)
  if (!country) return { title: "Mission country" }
  return {
    title: `${country.name} · International Mission`,
    description: country.summary || `Oblate mission in ${country.name}.`,
  }
}

export default async function InternationalCountryPage({ params }: CountryPageProps) {
  const { slug } = await params
  const countries = await getMissionCountries()
  const index = countries.findIndex((country) => country.slug === slug)
  const country = index >= 0 ? countries[index] : await getMissionCountry(slug)
  if (!country) notFound()

  const previous = countries[(index - 1 + countries.length) % countries.length]
  const next = countries[(index + 1) % countries.length]
  const paragraphs = country.body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

  return (
    <>
      <ScrollProgress />
      <header className="relative isolate overflow-hidden bg-[#03202b] px-4 pt-10 pb-16 text-white sm:px-8 sm:pt-14 sm:pb-20">
        {country.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={encodeURI(country.image)}
            alt=""
            className="history-kenburns absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#03202b] via-[#03202b]/85 to-[#03202b]/45" />

        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href="/international" className="transition hover:text-white">
              International
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <span className="text-white">{country.name}</span>
          </nav>

          <p className="mt-12 flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">
            Category {country.category}
            {country.region ? (
              <span className="inline-flex items-center gap-1 tracking-normal text-white/85 normal-case">
                <MapPin aria-hidden="true" className="size-4" /> {country.region}
              </span>
            ) : null}
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold text-balance sm:text-5xl">{country.name}</h1>
          {country.summary ? <p className="mt-5 max-w-2xl text-base leading-8 text-white/85">{country.summary}</p> : null}

          <Link
            href="/international"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ffcf4a] transition hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Back to international mission
          </Link>
        </div>
      </header>

      {paragraphs.length ? (
        <section className="bg-white px-4 py-14 text-[#102a43] sm:px-8 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-5 text-base leading-8 text-[#3d4b59]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {country.missions.length ? (
        <section className="bg-[#f7fbfd] px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Missions</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Work in {country.name}</h2>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {country.missions.map((mission, i) => (
                <Reveal key={`${mission.title}-${i}`} from="up" delay={i * 80} as="li">
                  <article className="h-full rounded-2xl border border-[#d9eef3] bg-white p-6">
                    <h3 className="font-heading text-xl font-semibold text-[#023e8a]">{mission.title}</h3>
                    {mission.summary ? <p className="mt-3 leading-7 text-[#3d4b59]">{mission.summary}</p> : null}
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {country.photos.length ? (
        <section className="bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Photos</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">From the mission</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {country.photos.map((photo) => (
                <li key={photo.src + photo.caption} className="group overflow-hidden rounded-2xl">
                  <figure className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={encodeURI(photo.src)}
                      alt={photo.alt || ""}
                      className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    {photo.caption ? (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#03202b]/85 to-transparent px-4 pt-10 pb-3 text-sm text-white">
                        {photo.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {!country.missions.length && !country.photos.length && !paragraphs.length ? (
        <section className="bg-white px-4 py-20 text-center text-[#5c6b7a] sm:px-8">
          <p>Missions and photos for {country.name} can be added in the CMS.</p>
        </section>
      ) : null}

      {countries.length > 1 && previous && next ? (
        <nav
          aria-label="Other countries"
          className="border-t border-[#e2f2f6] bg-[#f7fbfd] px-4 py-10 sm:px-8"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <Link
              href={internationalCountryHref(previous.slug)}
              className="text-sm font-semibold text-[#023e8a] transition hover:text-[#0e98ac]"
            >
              ← {previous.name}
            </Link>
            <Link href="/international" className="text-sm font-semibold text-[#5c6b7a] transition hover:text-[#023e8a]">
              All countries
            </Link>
            <Link
              href={internationalCountryHref(next.slug)}
              className="text-sm font-semibold text-[#023e8a] transition hover:text-[#0e98ac]"
            >
              {next.name} →
            </Link>
          </div>
        </nav>
      ) : null}
    </>
  )
}
