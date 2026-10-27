import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Compass, Heart, HandHeart, MapPin, MessageCircle, Sparkles, Users } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PageBanner } from "@/components/sections/page-banner"
import { SectionHeading } from "@/components/sections/section-heading"
import { houseAnchor } from "@/config/navigation"
import { getBlock, getFormationHouses } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Vocations",
  description: "Discern a missionary vocation with the Oblate Province of Jaffna.",
}

const SIGN_ICONS = [Heart, HandHeart, Users, Compass] as const
const STEP_ICONS = [Sparkles, MessageCircle, BookOpen] as const

export default async function VocationsPage() {
  const [formationHouses, copy] = await Promise.all([getFormationHouses(), getBlock("vocations")])
  const { hero, signs, journey, discernment } = copy

  return (
    <>
      <ScrollProgress />
      <PageBanner id="the-call" kicker={hero.kicker} title={hero.title} summary={hero.summary}>
        <Link
          href={hero.primaryHref || "/contact"}
          className="rounded-full bg-[#ffcf4a] px-6 py-3 text-sm font-semibold text-[#03202b] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
        >
          {hero.primaryCta}
        </Link>
        <Link
          href={hero.secondaryHref || "#formation-journey"}
          className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          {hero.secondaryCta}
        </Link>
      </PageBanner>

      <section className="bg-white px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
        <SectionHeading kicker={signs.kicker} title={signs.title} subtitle={signs.subtitle} />
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signs.items.map((sign, index) => {
            const Icon = SIGN_ICONS[index % SIGN_ICONS.length]
            return (
              <Reveal key={sign.title} from="up" delay={index * 110} className="h-full">
                <article className="group h-full rounded-[1.75rem] border border-[#d5dee6] bg-white p-7 transition duration-500 hover:-translate-y-2 hover:border-[#17b3c6] hover:shadow-[0_30px_60px_-30px_rgba(10,80,98,0.55)]">
                  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#0a5062] to-[#17b3c6] text-white transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Icon className="size-7" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-6 font-heading text-2xl font-semibold text-[#023e8a]">{sign.title}</h3>
                  <p className="mt-3 leading-7 text-[#5c6b7a]">{sign.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section
        id="formation-journey"
        className="relative isolate scroll-mt-80 overflow-hidden bg-[#f4fbfd] px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24"
      >
        <SectionHeading kicker={journey.kicker} title={journey.title} subtitle={journey.subtitle} />
        <ol className="relative mx-auto mt-16 max-w-4xl">
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-[#17b3c6] via-[#0a5062] to-[#ffcf4a] sm:left-1/2"
          />
          {formationHouses.map((house, index) => {
            const note = journey.stageNotes.find((item) => house.name.includes(item.match))
            const right = index % 2 === 1
            return (
              <Reveal
                id={houseAnchor(house.name)}
                key={house.name}
                as="li"
                from={right ? "right" : "left"}
                delay={index * 80}
                className={`relative mb-10 pl-16 last:mb-0 sm:w-1/2 sm:pl-0 ${right ? "sm:ml-auto sm:pl-12" : "sm:pr-12"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-6 left-6 grid size-10 -translate-x-1/2 place-items-center rounded-full bg-white font-heading text-sm font-semibold text-[#0a5062] shadow-md ring-4 ring-[#17b3c6]/30 ${
                    right ? "sm:left-0" : "sm:right-0 sm:left-auto sm:translate-x-1/2"
                  }`}
                >
                  {index + 1}
                </span>
                <article className="rounded-[1.5rem] border border-[#d5dee6] bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(10,80,98,0.55)]">
                  {note ? (
                    <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">{note.stage}</p>
                  ) : null}
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-[#023e8a]">{house.name}</h3>
                  {house.place ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5c6b7a]">
                      <MapPin aria-hidden="true" className="size-4 text-[#ffbf00]" />
                      {house.place}
                    </p>
                  ) : null}
                  {note ? <p className="mt-4 leading-7 text-[#3d4b59]">{note.text}</p> : null}
                </article>
              </Reveal>
            )
          })}
        </ol>
      </section>

      <section
        id="discernment"
        className="relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-white sm:px-8 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -top-40 -right-32 -z-10 size-[26rem] rounded-full bg-[#17b3c6] opacity-20 blur-[120px]"
        />
        <SectionHeading light kicker={discernment.kicker} title={discernment.title} />
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
          {discernment.steps.map((item, index) => {
            const Icon = STEP_ICONS[index % STEP_ICONS.length]
            return (
              <Reveal key={item.title} from="zoom" delay={index * 120} className="h-full">
                <article className="h-full rounded-[1.75rem] border border-white/15 bg-white/5 p-7 text-center backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:bg-white/10">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#ffcf4a] text-[#03202b]">
                    <Icon className="size-6" />
                  </span>
                  <p className="mt-4 text-xs font-bold tracking-[0.22em] text-[#ffcf4a] uppercase">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-semibold" style={{ color: "#ffffff" }}>
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-white/75">{item.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
        <Reveal from="up" delay={200} className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            href={discernment.primaryHref || "/contact"}
            className="rounded-full bg-[#ffcf4a] px-6 py-3 text-sm font-semibold text-[#03202b] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
          >
            {discernment.primaryCta}
          </Link>
          <Link
            href={discernment.secondaryHref || "/charism"}
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            {discernment.secondaryCta}
          </Link>
        </Reveal>
      </section>
    </>
  )
}
