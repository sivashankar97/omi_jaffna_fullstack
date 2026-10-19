import type { Metadata } from "next"
import Image from "next/image"
import { Compass, Flame, Quote, Users } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { CharismJoin } from "@/components/sections/charism/charism-join"
import { CharismVow } from "@/components/sections/charism/charism-vow"
import { CharismWays } from "@/components/sections/charism/charism-ways"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { SectionHeading } from "@/components/sections/section-heading"
import { charismHero, charismIdentity, charismPriorities } from "@/content/charism"
import { getCharismContent } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Charism",
  description:
    "Evangelizing the poor — the charism, mission, vision and motto of the Oblate Province of Jaffna.",
}

const priorityIcons = [Flame, Users, Compass]

export default async function CharismPage() {
  const content = await getCharismContent()
  return (
    <>
      <ScrollProgress />
      <header
        id="charism"
        className="relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-24 text-white sm:px-8 sm:py-32"
      >
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -bottom-40 -left-32 -z-10 size-[28rem] rounded-full bg-[#17b3c6] opacity-25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -top-32 right-0 -z-10 size-[24rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px] [animation-delay:-7s]"
        />
        <svg
          aria-hidden="true"
          className="charism-cross-mark pointer-events-none absolute top-1/2 right-[8%] -z-10 hidden h-64 -translate-y-1/2 text-white/10 lg:block"
          viewBox="0 0 100 160"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M50 6v148M18 46h64" strokeLinecap="round" />
        </svg>
        <div className="mx-auto max-w-6xl">
          <p
            className="history-rise flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm"
            style={{ "--rise-delay": "100ms" } as React.CSSProperties}
          >
            <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
            {content.kicker}
          </p>
          <h1
            className="history-rise mt-4 font-heading text-5xl leading-[1.05] font-semibold sm:text-7xl"
            style={{ "--rise-delay": "250ms", color: "#ffffff" } as React.CSSProperties}
          >
            {charismHero.title}
          </h1>
          <p
            className="history-rise mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-xl sm:leading-9"
            style={{ "--rise-delay": "450ms" } as React.CSSProperties}
          >
            {charismHero.summary}
          </p>
        </div>
      </header>

      <section aria-label="Charism statement" className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <Reveal from="up" className="mx-auto max-w-4xl text-center">
          <p className="font-heading text-2xl leading-snug font-semibold text-balance text-[#023e8a] sm:text-4xl">
            {content.title}
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#5c6b7a]">{content.summary}</p>
        </Reveal>
      </section>

      <section id="identity" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <Reveal from="left">
            <p className="text-xs font-bold tracking-[0.28em] text-[#17b3c6] uppercase">{charismIdentity.kicker}</p>
            <h2 className="mt-3 font-heading text-3xl leading-tight font-semibold text-[#023e8a] sm:text-5xl">
              {charismIdentity.title}
            </h2>
            <span aria-hidden="true" className="mt-6 block h-1 w-16 rounded-full bg-gradient-to-r from-[#17b3c6] to-[#ffbf00]" />
            <div className="mt-8 space-y-5 text-lg leading-8 text-[#3d4b59]">
              {charismIdentity.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <blockquote className="relative rounded-2xl border-l-4 border-[#ffbf00] bg-white px-6 py-5 font-heading text-lg leading-8 font-semibold text-[#023e8a] italic shadow-[0_16px_36px_-28px_rgba(2,62,138,0.5)]">
                {charismIdentity.maxim}
              </blockquote>
              <p>{charismIdentity.closing}</p>
            </div>
          </Reveal>

          <Reveal from="right" delay={120} className="relative pb-10 lg:pb-0">
            <div
              aria-hidden="true"
              className="absolute -top-4 -right-4 h-full w-full rounded-[2rem] border-2 border-[#17b3c6]/50"
            />
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(2,62,138,0.55)] sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/Herosection/Heroimage_4.jpg"
                alt="Oblate church in Jaffna"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
              />
              <span aria-hidden="true" className="history-shine pointer-events-none absolute inset-0" />
            </div>
            <figure className="charism-float absolute -bottom-2 left-4 max-w-xs rounded-2xl bg-white px-6 py-5 shadow-[0_24px_50px_-24px_rgba(2,62,138,0.55)] sm:-left-8 lg:bottom-10">
              <Quote aria-hidden="true" className="size-6 text-[#ffbf00]" />
              <blockquote className="mt-2 font-heading text-xl font-semibold text-[#023e8a] italic">
                &ldquo;{charismIdentity.quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-2 text-sm font-medium text-[#0e98ac]">— {charismIdentity.quote.author}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section id="priorities" className="scroll-mt-80 bg-white px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            kicker={charismPriorities.kicker}
            title={charismPriorities.title}
            subtitle={charismPriorities.subtitle}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {charismPriorities.items.map((item, index) => {
              const Icon = priorityIcons[index]
              return (
                <Reveal
                  key={item.title}
                  from="up"
                  delay={index * 120}
                  className="group relative h-full overflow-hidden rounded-2xl bg-white p-8 shadow-[0_20px_45px_-30px_rgba(2,62,138,0.5)] ring-1 ring-[#d8eef3] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_-28px_rgba(2,62,138,0.55)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#17b3c6] to-[#ffbf00] transition duration-500 group-hover:scale-x-100"
                  />
                  <span className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#17b3c6] to-[#0e6a68] text-white shadow-md transition duration-500 group-hover:rotate-6">
                    <Icon aria-hidden="true" className="size-7" />
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-[#023e8a]">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#5c6b7a]">{item.text}</p>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <CharismWays ways={content.ways} />
      <CharismJoin tone="ways" />
      <CharismVow />
      <CharismJoin tone="vow" />
      <section id="about" className="scroll-mt-80 bg-white px-4 py-20 text-[#023e8a] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal from="up" id="who-we-are" className="text-center">
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl">{content.aboutHeading}</h2>
            {content.about.map((paragraph) => (
              <p key={paragraph} className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#3d4b59]">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <div id="arrival" className="mt-12 grid scroll-mt-80 gap-6 md:grid-cols-2">
            <Reveal
              from="left"
              className="rounded-[2rem] bg-gradient-to-br from-[#0f9fb4] via-[#17b3c6] to-[#0e98ac] p-8 text-white shadow-md"
            >
              <p className="text-xs font-semibold tracking-[0.22em] text-white/80 uppercase">Arrival</p>
              <p className="mt-4 font-heading text-3xl leading-snug">
                {content.arrival}
              </p>
            </Reveal>
            <Reveal from="right" delay={150} className="rounded-[2rem] bg-[#f7fbff] p-8 ring-1 ring-[#cfe9ef]">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">The mission</p>
              <p className="mt-4 text-lg leading-8 text-[#3d4b59]">
                {content.mission}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
