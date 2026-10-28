import type { Metadata } from "next"
import Image from "next/image"
import { ChevronRight, Church, Globe, HandHeart, Heart, HeartHandshake, Users } from "lucide-react"

import { MotionHero, MotionReveal } from "@/components/motion/motion-reveal"
import { CharismVow } from "@/components/sections/charism/charism-vow"
import { CharismWays } from "@/components/sections/charism/charism-ways"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { SectionHeading } from "@/components/sections/section-heading"
import { isUpload } from "@/content/site-info"
import { getBlock, getCharismContent } from "@/lib/cms"

const commitmentIcons = [Church, HeartHandshake, Globe]

export const metadata: Metadata = {
  title: "Charism",
  description:
    "Evangelizing the poor — the charism, mission, vision and motto of the Oblate Province of Jaffna.",
}

const priorityIcons = [HandHeart, Users, Heart]

function splitHeroTitle(title: string) {
  const parts = title.trim().split(/\s+/)
  if (parts.length < 2) return { lead: title, accent: "" }
  return { lead: parts.slice(0, -1).join(" "), accent: parts.at(-1) ?? "" }
}

function splitIdentityTitle(title: string) {
  const match = title.match(/^(.*?)(\bthe Poor\b)(.*)$/i)
  if (!match) return { before: title, accent: "", after: "" }
  return { before: match[1] ?? "", accent: match[2] ?? "", after: match[3] ?? "" }
}

function highlightSince(heading: string) {
  const match = heading.match(/^(.*?)(since\s+\d{4})(.*)$/i)
  if (!match) return { before: heading, accent: "", after: "" }
  return { before: match[1] ?? "", accent: match[2] ?? "", after: match[3] ?? "" }
}

export default async function CharismPage() {
  const [content, sections] = await Promise.all([getCharismContent(), getBlock("charism")])
  const {
    hero: charismHero,
    missionaryFamily,
    coreCommitments,
    identity: charismIdentity,
    priorities: charismPriorities,
  } = sections
  const heroTitle = splitHeroTitle(charismHero.title)
  const identityTitle = splitIdentityTitle(charismIdentity.title)
  const aboutTitle = highlightSince(content.aboutHeading)

  return (
    <>
      <ScrollProgress />
      <header
        id="charism"
        className="charism-hero relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 pt-24 pb-32 text-white sm:px-8 sm:pt-28 sm:pb-40"
      >
        <Image
          src={sections.images.identityImage}
          alt=""
          fill
          priority
          unoptimized={isUpload(sections.images.identityImage)}
          sizes="100vw"
          className="pointer-events-none absolute inset-0 -z-20 object-cover object-[70%_center] opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,#03202b_0%,rgb(6_57_74/0.92)_42%,rgb(10_80_98/0.55)_72%,rgb(23_179_198/0.25)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[8%] hidden size-56 -translate-y-1/2 rounded-full bg-[#7fe3ef]/25 blur-3xl lg:block"
        />
        <div
          aria-hidden="true"
          className="charism-cross-mark pointer-events-none absolute top-[18%] right-[7%] hidden text-[7rem] leading-none text-white/35 lg:block"
        >
          ✝
        </div>

        <div className="relative mx-auto max-w-6xl">
          <MotionHero delay={100} className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm">
            <span aria-hidden="true" className="h-px w-8 bg-[#ffcf4a] sm:w-10" />
            {content.kicker}
          </MotionHero>
          <MotionHero delay={250} className="mt-4 font-heading text-5xl leading-[1.05] font-semibold sm:text-7xl">
            <h1>
              <span className="text-white">{heroTitle.lead}</span>
              {heroTitle.accent ? (
                <>
                  {" "}
                  <span className="text-[#7fe3ef]">{heroTitle.accent}</span>
                </>
              ) : null}
            </h1>
          </MotionHero>
          <MotionHero delay={450} className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-xl sm:leading-9">
            <p>{charismHero.summary}</p>
          </MotionHero>
        </div>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -mb-px h-20 w-full sm:h-28"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path fill="#7fe3ef" fillOpacity="0.35" d="M0,72 C220,110 420,28 700,58 C980,88 1200,108 1440,48 L1440,120 L0,120 Z" />
          <path fill="#cfeef4" fillOpacity="0.7" d="M0,84 C260,118 480,40 760,68 C1040,96 1240,112 1440,64 L1440,120 L0,120 Z" />
          <path fill="#f4fbfd" d="M0,96 C280,120 520,56 800,80 C1080,104 1280,116 1440,76 L1440,120 L0,120 Z" />
        </svg>
      </header>

      <section
        aria-label="Charism statement"
        className="calendar-stage relative z-10 -mt-3 px-4 pt-8 pb-16 sm:-mt-4 sm:px-8 sm:pt-10 sm:pb-20"
      >
        <MotionReveal from="up" className="mx-auto max-w-5xl">
          <div className="media-bento-card media-bento-shine calendar-glass relative flex flex-col items-start gap-6 overflow-hidden rounded-[2rem] px-7 py-8 shadow-[0_28px_56px_-32px_rgb(2_62_138/0.35)] sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:py-10">
            <span className="grid size-[4.25rem] shrink-0 place-items-center rounded-full bg-[#e7fbff] text-[#17b3c6] ring-1 ring-[#cfeef4] shadow-[0_12px_24px_-14px_rgb(14_152_172/0.55)]">
              <HandHeart aria-hidden="true" className="size-7" />
            </span>
            <span aria-hidden="true" className="hidden h-20 w-px shrink-0 bg-[#17b3c6]/30 sm:block" />
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-2xl leading-snug font-semibold text-[#023e8a] sm:text-[2rem] sm:leading-snug">
                {content.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#5c6b7a] sm:text-lg sm:leading-8">
                {content.summary}
              </p>
            </div>
          </div>
        </MotionReveal>
      </section>

      <section id="missionary-family" className="calendar-stage scroll-mt-80 px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading title={missionaryFamily.title} subtitle={missionaryFamily.subtitle} />
          <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <MotionReveal
              from="left"
              className="media-bento-card media-bento-shine calendar-glass relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8"
            >
              <div className="space-y-6">
                {missionaryFamily.paragraphs.map((paragraph, index) => (
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
                    src={sections.images.familyImage}
                    alt={sections.images.familyImageAlt}
                    unoptimized={isUpload(sections.images.familyImage)}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03202b]/25 to-transparent" />
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section id="core-commitments" className="calendar-stage scroll-mt-80 px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            kicker={coreCommitments.kicker}
            title={coreCommitments.title}
            subtitle={coreCommitments.subtitle}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {coreCommitments.items.map((item, index) => {
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

      <section id="identity" className="calendar-stage scroll-mt-80 px-4 py-14 sm:px-8 sm:py-16">
        <div className="relative mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <MotionReveal from="left" className="h-full">
            <div className="media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-9">
              <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] text-[#17b3c6] uppercase">
                <span aria-hidden="true" className="h-px w-7 bg-[#17b3c6]" />
                {charismIdentity.kicker}
              </p>
              <h2 className="mt-4 font-heading text-3xl leading-tight font-semibold text-[#023e8a] sm:text-[2.35rem]">
                {identityTitle.accent ? (
                  <>
                    {identityTitle.before}
                    <span className="text-[#17b3c6]">{identityTitle.accent}</span>
                    {identityTitle.after}
                  </>
                ) : (
                  charismIdentity.title
                )}
              </h2>

              {charismIdentity.paragraphs[0] ? (
                <p className="mt-5 text-[15px] leading-7 text-[#5c6b7a] sm:text-base sm:leading-8">
                  {charismIdentity.paragraphs[0]}
                </p>
              ) : null}

              <blockquote className="relative mt-5 rounded-2xl border-l-4 border-[#17b3c6] bg-[#e7fbff] px-5 py-4 pl-6 font-heading text-[15px] leading-7 font-semibold text-[#023e8a] italic sm:text-base sm:leading-8">
                <span aria-hidden="true" className="absolute top-1 left-4 font-heading text-5xl leading-none text-[#17b3c6]/45">
                  “
                </span>
                <span className="relative z-[1]">{charismIdentity.maxim}</span>
              </blockquote>

              {charismIdentity.paragraphs[1] ? (
                <p className="mt-5 text-[15px] leading-7 text-[#5c6b7a] sm:text-base sm:leading-8">
                  {charismIdentity.paragraphs[1]}
                </p>
              ) : null}
              <p className="mt-4 text-sm leading-7 text-[#5c6b7a]">{charismIdentity.closing}</p>
            </div>
          </MotionReveal>

          <MotionReveal from="right" delay={120} className="h-full min-h-[22rem]">
            <div className="group media-bento-card media-bento-shine relative h-full min-h-[22rem] overflow-hidden rounded-[1.75rem]">
              <Image
                src={sections.images.identityImage}
                alt={sections.images.identityImageAlt}
                unoptimized={isUpload(sections.images.identityImage)}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#03202b]/60 via-transparent to-transparent"
              />
              <figure className="absolute right-4 bottom-4 left-4 max-w-sm rounded-2xl border border-white/25 bg-[#06394a]/78 px-5 py-4 text-white shadow-[0_18px_40px_-24px_rgb(3_32_43/0.65)] backdrop-blur-md sm:right-auto sm:left-5 sm:px-6 sm:py-5">
                <span aria-hidden="true" className="font-heading text-4xl leading-none text-[#7fe3ef]/80">
                  “
                </span>
                <blockquote className="mt-1 font-heading text-lg leading-snug font-semibold italic sm:text-xl">
                  {charismIdentity.quote.text}
                </blockquote>
                <figcaption className="mt-2 text-sm text-white/80">— {charismIdentity.quote.author}</figcaption>
              </figure>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section id="priorities" className="calendar-stage scroll-mt-80 px-4 py-14 sm:px-8 sm:py-16">
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            kicker={charismPriorities.kicker}
            title={charismPriorities.title}
            subtitle={charismPriorities.subtitle}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {charismPriorities.items.map((item, index) => {
              const Icon = priorityIcons[index % priorityIcons.length]
              const deep = index === 1
              return (
                <MotionReveal key={item.title} from="up" delay={index * 100} className="h-full">
                  <article
                    className={
                      deep
                        ? "group media-bento-card media-bento-shine calendar-glass-deep relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
                        : "group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
                    }
                  >
                    <span className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-[#17b3c6] text-white shadow-[0_8px_16px_-10px_rgb(14_152_172/0.7)] transition group-hover:translate-x-0.5">
                      <ChevronRight className="size-3.5" />
                    </span>
                    <span
                      className={
                        deep
                          ? "flex size-14 items-center justify-center rounded-full bg-[#ffcf4a] text-[#03202b]"
                          : "flex size-14 items-center justify-center rounded-full bg-[#e7fbff] text-[#17b3c6] ring-1 ring-[#cfeef4]"
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

      <CharismWays ways={content.ways} />
      <CharismVow
        mission={sections.mission}
        vision={sections.vision}
        motto={sections.motto}
        crossImage={sections.images.crossImage}
      />

      <section id="about" className="calendar-stage scroll-mt-80 px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <MotionReveal from="up" id="who-we-are" className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-semibold sm:text-5xl">
              {aboutTitle.accent ? (
                <>
                  {aboutTitle.before}
                  <span className="text-[#17b3c6]">{aboutTitle.accent}</span>
                  {aboutTitle.after}
                </>
              ) : (
                content.aboutHeading
              )}
            </h2>
            {content.about.map((paragraph) => (
              <p key={paragraph} className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#5c6b7a] sm:text-lg">
                {paragraph}
              </p>
            ))}
          </MotionReveal>

          <div id="arrival" className="mt-10 grid scroll-mt-80 gap-5 md:grid-cols-2 md:gap-6">
            <MotionReveal from="left">
              <div className="group media-bento-card media-bento-shine relative grid min-h-[16rem] overflow-hidden rounded-[1.75rem] text-white sm:grid-cols-[1.05fr_0.95fr]">
                <div className="relative z-10 flex flex-col justify-center bg-gradient-to-r from-[#03202b] via-[#06394a] to-[#06394a]/70 p-7 sm:p-8">
                  <p className="text-xs font-semibold tracking-[0.22em] text-[#ffcf4a] uppercase">Arrival</p>
                  <p className="mt-3 font-heading text-xl leading-snug sm:text-2xl">{content.arrival}</p>
                </div>
                <div className="relative min-h-[10rem] sm:min-h-0">
                  <Image
                    src={sections.images.identityImage}
                    alt=""
                    fill
                    unoptimized={isUpload(sections.images.identityImage)}
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </MotionReveal>
            <MotionReveal from="right" delay={120}>
              <div className="media-bento-card media-bento-shine calendar-glass relative flex h-full min-h-[16rem] flex-col justify-center overflow-hidden rounded-[1.75rem] p-7 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">The mission</p>
                <p className="mt-3 text-lg leading-8 text-[#3d4b59]">{content.mission}</p>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>
    </>
  )
}
