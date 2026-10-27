import type { Metadata } from "next"
import Image from "next/image"
import { ArrowUpRight, CalendarDays, Church, Globe, HeartHandshake, MapPin, Users } from "lucide-react"

import { MotionHero, MotionReveal } from "@/components/motion/motion-reveal"
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
          <MotionHero
            delay={100}
            className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm"
          >
            <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
            Oblate Province of Jaffna
          </MotionHero>
          <MotionHero delay={250} className="mt-4 font-heading text-5xl leading-[1.05] font-semibold sm:text-7xl">
            <h1>{whoWeAre.title}</h1>
          </MotionHero>
          <MotionHero
            delay={450}
            className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-xl sm:leading-9"
          >
            <p>{whoWeAre.summary}</p>
          </MotionHero>
        </div>
      </header>

      <section aria-label="Province at a glance" className="relative z-10 -mt-24 px-4 sm:-mt-28 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-6">
          {whoWeAre.stats.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length]
            const deep = index === 1
            return (
              <MotionReveal
                key={stat.label}
                from="up"
                delay={index * 120}
                className={
                  deep
                    ? "group media-bento-card media-bento-shine calendar-glass-deep relative overflow-hidden rounded-[1.75rem] p-7 text-center"
                    : "group media-bento-card media-bento-shine calendar-glass relative overflow-hidden rounded-[1.75rem] p-7 text-center"
                }
              >
                <span
                  className={
                    deep
                      ? "mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#ffcf4a] text-[#03202b]"
                      : "mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#e7fbff] text-[#0e98ac] ring-1 ring-[#cfeef4] transition group-hover:bg-[#17b3c6] group-hover:text-white group-hover:ring-[#17b3c6]"
                  }
                >
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <p className={`mt-4 font-heading text-4xl font-bold ${deep ? "text-white" : "text-[#023e8a]"}`}>
                  <CountUp value={stat.value} />
                </p>
                <p className={`mt-1 text-sm font-medium tracking-wide ${deep ? "text-white/75" : "text-[#5c6b7a]"}`}>
                  {stat.label}
                </p>
              </MotionReveal>
            )
          })}
        </div>
      </section>

      <section id="missionary-family" className="calendar-stage scroll-mt-80 px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading title={whoWeAre.family.title} subtitle={whoWeAre.family.subtitle} />
          <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <MotionReveal
              from="left"
              className="media-bento-card media-bento-shine calendar-glass relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8"
            >
              <div className="space-y-6">
                {whoWeAre.family.paragraphs.map((paragraph, index) => (
                  <div key={paragraph} className="flex gap-5">
                    <span className="mt-1 font-heading text-sm font-bold text-[#17b3c6]">0{index + 1}</span>
                    <p className="border-l-2 border-[#17b3c6]/35 pl-5 text-lg leading-8 text-[#3d4b59]">{paragraph}</p>
                  </div>
                ))}
              </div>
            </MotionReveal>
            <MotionReveal from="right" delay={120} className="relative">
              <div className="group media-bento-card media-bento-shine calendar-glass relative overflow-hidden rounded-[1.75rem] p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem]">
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
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section id="core-commitments" className="calendar-stage scroll-mt-80 px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            kicker={whoWeAre.commitments.kicker}
            title={whoWeAre.commitments.title}
            subtitle={whoWeAre.commitments.subtitle}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {whoWeAre.commitments.items.map((item, index) => {
              const Icon = commitmentIcons[index % commitmentIcons.length]
              const deep = index === 1
              return (
                <MotionReveal key={item.title} from="up" delay={index * 120} className="h-full">
                  <article
                    className={
                      deep
                        ? "group media-bento-card media-bento-shine calendar-glass-deep relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
                        : "group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
                    }
                  >
                    <span
                      className={
                        deep
                          ? "absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition group-hover:rotate-45"
                          : "absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-[#e7fbff] text-[#023e8a] ring-1 ring-[#cfeef4] transition group-hover:rotate-45"
                      }
                    >
                      <ArrowUpRight className="size-3.5" />
                    </span>
                    <span
                      className={
                        deep
                          ? "flex size-14 items-center justify-center rounded-2xl bg-[#ffcf4a] text-[#03202b]"
                          : "flex size-14 items-center justify-center rounded-2xl bg-[#e7fbff] text-[#0e98ac] ring-1 ring-[#cfeef4]"
                      }
                    >
                      <Icon aria-hidden="true" className="size-7" />
                    </span>
                    <h3
                      className={
                        deep
                          ? "mt-6 font-heading text-xl font-semibold text-white sm:text-2xl"
                          : "mt-6 font-heading text-xl font-semibold text-[#023e8a] sm:text-2xl"
                      }
                    >
                      {item.title}
                    </h3>
                    <p className={deep ? "mt-3 flex-1 leading-7 text-white/75" : "mt-3 flex-1 leading-7 text-[#5c6b7a]"}>
                      {item.text}
                    </p>
                  </article>
                </MotionReveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="history" className="calendar-stage relative isolate scroll-mt-80 overflow-hidden px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <MotionReveal from="left">
            <div className="group media-bento-card media-bento-shine relative min-h-[18rem] overflow-hidden rounded-[1.75rem] text-white sm:min-h-[22rem]">
              <Image
                src={images.historyImage}
                alt=""
                fill
                sizes="100vw"
                unoptimized={isUpload(images.historyImage)}
                className="object-cover object-[72%_center] transition duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(105deg,#03202b_0%,#03202b_32%,rgb(6_57_74/0.82)_52%,rgb(10_80_98/0.35)_72%,transparent_100%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[55%] backdrop-blur-md [mask-image:linear-gradient(90deg,black_0%,black_40%,transparent_100%)]"
              />
              <div className="relative z-10 max-w-xl px-7 py-9 sm:px-10 sm:py-12">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#ffcf4a] uppercase">Our history</p>
                <h2 className="mt-3 font-heading text-4xl leading-tight font-semibold sm:text-5xl">{briefHistory.title}</h2>
                <p className="mt-4 text-lg leading-8 text-white/85">{briefHistory.summary}</p>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section id="brief-history" className="calendar-stage scroll-mt-80 px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading kicker={briefHistory.kicker} title={briefHistory.heading} subtitle={briefHistory.subtitle} />

          <MotionReveal from="up" className="mx-auto mt-10 max-w-4xl">
            <p className="media-bento-card media-bento-shine calendar-glass overflow-hidden rounded-[1.75rem] border-l-4 border-[#ffcf4a] px-6 py-5 text-lg leading-8 text-[#3d4b59] italic sm:px-8">
              {briefHistory.intro}
            </p>
          </MotionReveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[16.5rem_1fr] lg:gap-7">
            <aside className="hidden lg:block">
              <ChapterNav chapters={chapters} />
            </aside>

            <div className="space-y-5">
              {chapters.map((chapter, index) => (
                <MotionReveal key={chapter.id} from="up" id={chapter.id} delay={(index % 3) * 60} className="scroll-mt-32">
                  <article className="group media-bento-card media-bento-shine calendar-glass relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7">
                    <span className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-[#e7fbff] text-[#023e8a] ring-1 ring-[#cfeef4] transition group-hover:rotate-45">
                      <ArrowUpRight className="size-3.5" />
                    </span>
                    <div className="flex flex-wrap items-center gap-3 pr-10">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-[#e7fbff] font-heading text-sm font-bold text-[#0e98ac] ring-1 ring-[#cfeef4]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full bg-[#e7fbff] px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#0e98ac] ring-1 ring-[#cfeef4]">
                        {chapter.years}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-2xl leading-snug font-semibold text-[#023e8a] sm:text-3xl">
                      {chapter.title}
                    </h3>
                    <div className="mt-4 space-y-4 text-base leading-7 text-[#3d4b59] sm:text-[17px] sm:leading-8">
                      {chapter.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <JourneyPath eras={journey.eras} />

      <BishopProfiles />
      <HistoricalArchive timeline={timeline} people={people} archive={archive} necrology={necrology} />

      <section id="development" className="calendar-stage scroll-mt-80 px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading kicker={development.kicker} title={development.title} subtitle={development.subtitle} />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {development.points.map((point, index) => (
              <MotionReveal
                key={point.title}
                from="up"
                delay={(index % 3) * 100}
                className="h-full"
              >
                <article className="group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6">
                  <span className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-[#e7fbff] text-[#023e8a] ring-1 ring-[#cfeef4] transition group-hover:rotate-45">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#023e8a] to-[#0a5062] font-heading text-sm font-bold text-[#ffcf4a]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-[#023e8a]">{point.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#5c6b7a]">{point.text}</p>
                </article>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal
            from="zoom"
            className="media-bento-card media-bento-shine calendar-glass-deep mt-8 grid items-center gap-8 overflow-hidden rounded-[1.75rem] p-8 text-white sm:p-10 lg:grid-cols-[auto_1fr]"
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
          </MotionReveal>
        </div>
      </section>
    </>
  )
}
