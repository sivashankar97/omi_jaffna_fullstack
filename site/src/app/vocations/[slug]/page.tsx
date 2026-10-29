import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ChevronRight, MapPin } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { PageBanner } from "@/components/sections/page-banner"
import { RichBody } from "@/components/sections/rich-body"
import { formationHref } from "@/config/navigation"
import { isUpload } from "@/content/site-info"
import { getBlock, getFormationHouse, getFormationHouses } from "@/lib/cms"

type FormationPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: FormationPageProps): Promise<Metadata> {
  const { slug } = await params
  const house = await getFormationHouse(slug)
  if (!house) return { title: "Formation house" }
  return { title: `${house.name} · Vocations`, description: house.tagline || `${house.name}, ${house.place}` }
}

export default async function FormationHousePage({ params }: FormationPageProps) {
  const { slug } = await params
  const [house, houses, copy] = await Promise.all([getFormationHouse(slug), getFormationHouses(), getBlock("vocations")])
  if (!house) notFound()

  const index = houses.findIndex((item) => item.slug === house.slug)
  const previous = index > 0 ? houses[index - 1] : undefined
  const next = index >= 0 && index < houses.length - 1 ? houses[index + 1] : undefined
  const note = copy.journey.stageNotes.find((item) => item.match && house.name.includes(item.match))
  const stage = house.stage || note?.stage
  const photos = house.gallery

  return (
    <article className="bg-white text-[#102a43]">
      <PageBanner
        id="formation-house"
        kicker={stage ? `Formation · ${stage}` : "Formation house"}
        title={house.name}
        summary={house.tagline || note?.text || ""}
      >
        {house.place ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
            <MapPin aria-hidden="true" className="size-4 text-[#ffcf4a]" />
            {house.place}
          </span>
        ) : null}
      </PageBanner>

      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-5xl flex-wrap items-center gap-1.5 px-4 pt-8 text-xs font-medium text-[#6b7a88] sm:px-8"
      >
        <Link href="/vocations" className="transition hover:text-[#0a5062]">
          Vocations
        </Link>
        <ChevronRight aria-hidden="true" className="size-3.5" />
        <Link href="/vocations#formation-journey" className="transition hover:text-[#0a5062]">
          Formation journey
        </Link>
        <ChevronRight aria-hidden="true" className="size-3.5" />
        <span className="text-[#0a8ea0]">{house.name}</span>
      </nav>

      {house.image ? (
        <figure className="mx-auto mt-8 max-w-5xl px-4 sm:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-[#eef6f8]">
            <Image
              src={house.image}
              alt={house.name}
              fill
              sizes="(max-width:1024px) 100vw, 1024px"
              className="object-cover"
              unoptimized={isUpload(house.image)}
              priority
            />
          </div>
        </figure>
      ) : null}

      <div className="mx-auto max-w-[44rem] px-4 py-12 sm:px-0 sm:py-16">
        {house.blocks.length ? (
          <RichBody blocks={house.blocks} />
        ) : (
          <p className="text-lg leading-9 text-[#5c6b7a]">{note?.text || "More details will be added soon."}</p>
        )}
      </div>

      {photos.length ? (
        <section className="bg-[#f4fbfd] px-4 py-14 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading text-2xl font-semibold text-[#03202b] sm:text-3xl">Photos</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo, photoIndex) => (
                <li key={`${photo.src}-${photoIndex}`}>
                  <Reveal from="up" delay={(photoIndex % 3) * 80}>
                    <figure className="overflow-hidden rounded-[1.25rem] bg-white shadow-[0_18px_40px_-32px_rgba(10,60,80,0.45)]">
                      <div className="relative aspect-[4/3] bg-[#eef6f8]">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-cover"
                          unoptimized={isUpload(photo.src)}
                        />
                      </div>
                      {photo.caption ? <figcaption className="px-4 py-3 text-sm text-[#5c6b7a]">{photo.caption}</figcaption> : null}
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {previous || next ? (
        <nav aria-label="Formation journey" className="mx-auto grid max-w-5xl gap-4 px-4 pt-12 sm:grid-cols-2 sm:px-8">
          {previous ? (
            <Link
              href={formationHref(previous)}
              className="group rounded-[1.25rem] border border-[#d5dee6] p-5 transition hover:border-[#17b3c6] hover:shadow-[0_18px_40px_-30px_rgba(10,80,98,0.55)]"
            >
              <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">
                <ArrowLeft aria-hidden="true" className="size-3.5 transition group-hover:-translate-x-0.5" />
                Previous stage
              </span>
              <span className="mt-2 block font-heading text-lg font-semibold text-[#023e8a]">{previous.name}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={formationHref(next)}
              className="group rounded-[1.25rem] border border-[#d5dee6] p-5 text-right transition hover:border-[#17b3c6] hover:shadow-[0_18px_40px_-30px_rgba(10,80,98,0.55)]"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">
                Next stage
                <ArrowRight aria-hidden="true" className="size-3.5 transition group-hover:translate-x-0.5" />
              </span>
              <span className="mt-2 block font-heading text-lg font-semibold text-[#023e8a]">{next.name}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-10 sm:px-8">
        <Link
          href="/vocations#formation-journey"
          className="inline-flex items-center gap-2 rounded-full bg-[#eef6f8] px-4 py-2 text-sm font-semibold text-[#0a5062] transition hover:bg-[#dff1f5]"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to the formation journey
        </Link>
        <Link
          href={copy.hero.primaryHref || "/contact"}
          className="rounded-full bg-[#ffcf4a] px-5 py-2.5 text-sm font-semibold text-[#03202b] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
        >
          {copy.hero.primaryCta}
        </Link>
      </div>
    </article>
  )
}
