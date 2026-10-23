import type { Metadata } from "next"
import Image from "next/image"
import { CalendarDays, Church, Globe, HeartHandshake, MapPin, Users } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { BishopProfiles } from "@/components/sections/history/bishop-profiles"
import { ChapterNav } from "@/components/sections/history/chapter-nav"
import { CountUp } from "@/components/sections/history/count-up"
import { HistoricalArchive } from "@/components/sections/history/historical-archive"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { JourneyPath } from "@/components/sections/home/journey-path"
import { SectionHeading } from "@/components/sections/section-heading"
import { isUpload } from "@/content/site-info"
import { getBlock, getNecrology, getTimeline } from "@/lib/cms"

export const metadata: Metadata = {
  title: "History",
  description:
    "Who we are, the brief history of the Oblate Province of Jaffna, our journey since 1847 and the development of the Province.",
}

const statIcons = [CalendarDays, Users, MapPin]
const commitmentIcons = [Church, HeartHandshake, Globe]

export default async function HistoryPage() {
  const [{ images, whoWeAre, briefHistory, development, archive, necrology }, journey, timeline, people] =
    await Promise.all([getBlock("history"), getBlock("journey"), getTimeline(), getNecrology()])
  const chapters = briefHistory.chapters.map((chapter, index) => ({ ...chapter, id: chapter.id || `chapter-${index + 1}` }))
  return (
    <>
      <ScrollProgress />
      <header
        id="who-we-are"
        className="relative isolate scroll-mt-80 overflow-hidden bg-[#03202b] px-4 pt-20 pb-36 text-white sm:px-8 sm:pt-28 sm:pb-44"
      >
        <div aria-hidden="true" className="history-kenburns absolute inset-0 -z-20">
          <Image
            src={images.heroImage}
            alt=""
            fill
            priority
            unoptimized={isUpload(images.heroImage)}
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(3,32,43,0.95)_0%,rgba(4,47,61,0.85)_50%,rgba(6,57,74,0.55)_100%)]"
        />
        <div className="mx-auto max-w-6xl">
          <p
            className="history-rise flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm"
            style={{ "--rise-delay": "100ms" } as React.CSSProperties}
          >
            <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
            Oblate Province of Jaffna
          </p>
          <h1
            className="history-rise mt-4 font-heading text-5xl leading-[1.05] font-semibold sm:text-7xl"
            style={{ "--rise-delay": "250ms" } as React.CSSProperties}
          >
            {whoWeAre.title}
          </h1>
          <p
            className="history-rise mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-xl sm:leading-9"
            style={{ "--rise-delay": "450ms" } as React.CSSProperties}
          >
            {whoWeAre.summary}
          </p>
        </div>
      </header>

      <section aria-label="Province at a glance" className="relative z-10 -mt-24 px-4 sm:-mt-28 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-6">
          {whoWeAre.stats.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length]
            return (
              <Reveal
                key={stat.label}
                from="up"
                delay={index * 120}
                className="group rounded-2xl border border-[#d8eef3] bg-white p-7 text-center shadow-[0_24px_50px_-28px_rgba(2,62,138,0.45)] transition duration-300 hover:-translate-y-1"
              >
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e7fbff] text-[#0e98ac] transition group-hover:bg-[#17b3c6] group-hover:text-white">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <p className="mt-4 font-heading text-4xl font-bold text-[#023e8a]">
                  <CountUp value={stat.value} />
                </p>
                <p className="mt-1 text-sm font-medium tracking-wide text-[#5c6b7a]">{stat.label}</p>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section id="missionary-family" className="scroll-mt-80 bg-white px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title={whoWeAre.family.title} subtitle={whoWeAre.family.subtitle} />
          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <Reveal from="left" className="space-y-6">
              {whoWeAre.family.paragraphs.map((paragraph, index) => (
                <div key={paragraph} className="flex gap-5">
                  <span className="mt-1 font-heading text-sm font-bold text-[#17b3c6]">0{index + 1}</span>
                  <p className="border-l-2 border-[#caf0f8] pl-5 text-lg leading-8 text-[#3d4b59]">{paragraph}</p>
                </div>
              ))}
            </Reveal>
            <Reveal from="right" delay={120} className="relative">
              <div
                aria-hidden="true"
                className="absolute -top-4 -right-4 h-full w-full rounded-[2rem] border-2 border-[#ffcf4a]"
              />
              <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(2,62,138,0.55)]">
                <Image
                  src={images.familyImage}
                  alt={images.familyImageAlt}
                  unoptimized={isUpload(images.familyImage)}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                />
                <span aria-hidden="true" className="history-shine pointer-events-none absolute inset-0" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="core-commitments" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            kicker={whoWeAre.commitments.kicker}
            title={whoWeAre.commitments.title}
            subtitle={whoWeAre.commitments.subtitle}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {whoWeAre.commitments.items.map((item, index) => {
              const Icon = commitmentIcons[index % commitmentIcons.length]
              return (
                <Reveal
                  key={item.title}
                  from="up"
                  delay={index * 120}
                  className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-[0_20px_45px_-30px_rgba(2,62,138,0.5)] ring-1 ring-[#d8eef3] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_-28px_rgba(2,62,138,0.55)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#17b3c6] to-[#ffbf00] transition duration-500 group-hover:scale-x-100"
                  />
                  <span className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#17b3c6] to-[#0e6a68] text-white shadow-md">
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

      <section
        id="history"
        className="relative isolate scroll-mt-80 overflow-hidden bg-[#03202b] px-4 py-20 text-white sm:px-8 sm:py-28"
      >
        <div aria-hidden="true" className="history-kenburns absolute inset-0 -z-20">
          <Image
            src={images.historyImage}
            alt=""
            fill
            sizes="100vw"
            unoptimized={isUpload(images.historyImage)}
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(3,32,43,0.96)_0%,rgba(4,47,61,0.88)_55%,rgba(6,57,74,0.7)_100%)]"
        />
        <Reveal from="left" className="mx-auto max-w-6xl">
          <h2 className="font-heading text-5xl leading-tight font-semibold sm:text-6xl">{briefHistory.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{briefHistory.summary}</p>
        </Reveal>
      </section>

      <section id="brief-history" className="scroll-mt-80 bg-white px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kicker={briefHistory.kicker} title={briefHistory.heading} subtitle={briefHistory.subtitle} />

          <Reveal from="up" className="mx-auto mt-12 max-w-4xl">
            <p className="rounded-2xl border-l-4 border-[#ffbf00] bg-[#fffbeb] px-6 py-5 text-lg leading-8 text-[#3d4b59] italic sm:px-8">
              {briefHistory.intro}
            </p>
          </Reveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <ChapterNav chapters={chapters} />
            </aside>

            <div className="space-y-14">
              {chapters.map((chapter, index) => (
                <Reveal key={chapter.id} from="up" id={chapter.id} className="scroll-mt-32">
                  <article className="relative border-b border-[#e2f2f6] pb-14 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-heading text-5xl leading-none font-bold text-[#caf0f8]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full bg-[#e7fbff] px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#0e98ac]">
                        {chapter.years}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-2xl leading-snug font-semibold text-[#023e8a] sm:text-3xl">
                      {chapter.title}
                    </h3>
                    <div className="mt-5 space-y-5 text-base leading-8 text-[#3d4b59] sm:text-[17px]">
                      {chapter.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <JourneyPath eras={journey.eras} />

      <BishopProfiles />
      <HistoricalArchive timeline={timeline} people={people} archive={archive} necrology={necrology} />

      <section id="development" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kicker={development.kicker} title={development.title} subtitle={development.subtitle} />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {development.points.map((point, index) => (
              <Reveal
                key={point.title}
                from="up"
                delay={(index % 3) * 120}
                className="group h-full rounded-2xl bg-white p-7 shadow-[0_20px_45px_-32px_rgba(2,62,138,0.5)] ring-1 ring-[#d8eef3] transition duration-300 hover:-translate-y-1 hover:ring-[#17b3c6]"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-[#023e8a] font-heading text-sm font-bold text-[#ffcf4a] transition group-hover:bg-[#17b3c6] group-hover:text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold text-[#023e8a]">{point.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[#5c6b7a]">{point.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal
            from="zoom"
            className="mt-10 grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] p-8 text-white shadow-[0_30px_60px_-30px_rgba(3,32,43,0.8)] sm:p-12 lg:grid-cols-[auto_1fr]"
          >
            <div className="flex gap-10">
              <div>
                <p className="font-heading text-6xl leading-none font-bold text-[#ffcf4a]">
                  <CountUp value={development.highlight.oblates} />
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[0.16em] text-white/75 uppercase">Oblates</p>
              </div>
              <div className="border-l border-white/20 pl-10">
                <p className="font-heading text-6xl leading-none font-bold text-[#7fe3ef]">
                  <CountUp value={development.highlight.scholastics} />
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[0.16em] text-white/75 uppercase">Scholastics</p>
              </div>
            </div>
            <p className="text-lg leading-8 text-white/85 lg:border-l lg:border-white/20 lg:pl-10">
              {development.highlight.text}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
