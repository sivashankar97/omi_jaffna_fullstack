import Image from "next/image"
import { Award, Crown, MapPin, Star } from "lucide-react"

import { MotionReveal } from "@/components/motion/motion-reveal"
import { SectionHeading } from "@/components/sections/section-heading"
import type { oblateJourney } from "@/content/charism"
import { isUpload } from "@/content/site-info"

type Journey = typeof oblateJourney

const witnessIcons = [Crown, Star, Award]

function StoryCard({
  card,
  deep = false,
}: {
  card: { title: string; badge: string; paragraphs: readonly string[] }
  deep?: boolean
}) {
  return (
    <article
      className={
        deep
          ? "media-bento-card media-bento-shine calendar-glass-deep relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-8"
          : "media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-8"
      }
    >
      {card.badge ? (
        <span
          className={
            deep
              ? "w-fit rounded-full bg-[#ffcf4a] px-3.5 py-1 text-xs font-bold tracking-wide text-[#03202b]"
              : "w-fit rounded-full bg-[#17b3c6] px-3.5 py-1 text-xs font-bold tracking-wide text-white"
          }
        >
          {card.badge}
        </span>
      ) : null}
      <h3
        className={
          deep
            ? "mt-5 font-heading text-xl leading-snug font-semibold text-white sm:text-2xl"
            : "mt-5 font-heading text-xl leading-snug font-semibold text-[#023e8a] sm:text-2xl"
        }
      >
        {card.title}
      </h3>
      <div className="mt-4 space-y-3">
        {card.paragraphs.map((paragraph) => (
          <p key={paragraph} className={deep ? "text-[15px] leading-7 text-white/78" : "text-[15px] leading-7 text-[#5c6b7a]"}>
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  )
}

export function CharismJourney({ content }: { content: Journey }) {
  const { expansion, sriLanka, witnesses } = content
  return (
    <section id="oblate-journey" className="calendar-stage relative scroll-mt-80 px-4 py-16 sm:px-8 sm:py-24">
      <div className="relative mx-auto max-w-6xl">
        <MotionReveal from="up">
          <div className="group relative overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-36px_rgb(2_62_138/0.55)]">
            <div className="relative aspect-[16/10] sm:aspect-[16/7]">
              <Image
                src={content.image}
                alt={content.imageAlt}
                unoptimized={isUpload(content.image)}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover sepia-[0.15] transition duration-[1400ms] ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#03202b]/90 via-[#03202b]/30 to-transparent"
            />
            <div className="absolute right-0 bottom-0 left-0 p-6 text-white sm:p-10">
              <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase">
                <span aria-hidden="true" className="h-px w-8 bg-[#ffcf4a]" />
                {content.kicker}
              </p>
              <h2 className="mt-3 max-w-3xl font-heading text-3xl leading-tight font-semibold text-balance text-white sm:text-5xl">
                {content.title}
              </h2>
            </div>
          </div>
        </MotionReveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
          {content.story.map((card, index) => (
            <MotionReveal key={card.title} from={index % 2 === 0 ? "left" : "right"} delay={(index % 2) * 100} className="h-full">
              <StoryCard card={card} deep={index % 2 === 1} />
            </MotionReveal>
          ))}
        </div>

        {expansion.title ? (
          <div className="mt-20">
            <SectionHeading title={expansion.title} subtitle={expansion.intro} />
            <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <span
                aria-hidden="true"
                className="absolute top-7 right-[12%] left-[12%] hidden h-0.5 bg-gradient-to-r from-[#17b3c6]/20 via-[#17b3c6] to-[#17b3c6]/20 lg:block"
              />
              {expansion.milestones.map((milestone, index) => (
                <MotionReveal key={`${milestone.year}-${milestone.text}`} as="li" from="up" delay={index * 90} className="relative h-full">
                  <div className="flex h-full flex-col items-center text-center">
                    <span className="relative z-10 grid size-14 place-items-center rounded-full bg-[#023e8a] font-heading text-base font-bold text-white ring-4 ring-[#f4fbfd] shadow-[0_12px_24px_-12px_rgb(2_62_138/0.7)]">
                      {milestone.year}
                    </span>
                    <div className="media-bento-card calendar-glass mt-4 flex w-full flex-1 items-center justify-center rounded-[1.4rem] px-5 py-5">
                      <p className="text-[15px] leading-7 text-[#3d4b59]">{milestone.text}</p>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </ol>
            {expansion.closing ? (
              <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-8 text-[#5c6b7a]">{expansion.closing}</p>
            ) : null}
          </div>
        ) : null}

        {sriLanka.title ? (
          <MotionReveal from="up" className="mt-20">
            <div className="media-bento-card media-bento-shine relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] p-7 text-white sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-[#ffcf4a]/10 blur-3xl"
              />
              <div className="relative grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-[#7fe3ef] ring-1 ring-white/15">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    {sriLanka.place}
                  </span>
                  <p className="mt-4 font-heading text-6xl leading-none font-bold text-[#ffcf4a] sm:text-7xl">{sriLanka.year}</p>
                  <h3 className="mt-4 font-heading text-2xl leading-snug font-semibold text-white">{sriLanka.title}</h3>
                </div>
                <div className="gap-8 sm:columns-2">
                  {sriLanka.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mb-4 break-inside-avoid text-base leading-8 text-white/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </MotionReveal>
        ) : null}

        {witnesses.title ? (
          <div className="mt-20">
            <SectionHeading title={witnesses.title} subtitle={witnesses.intro} />
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              {witnesses.items.map((item, index) => {
                const Icon = witnessIcons[Math.min(index, witnessIcons.length - 1)]
                return (
                  <MotionReveal
                    key={item.name}
                    from="up"
                    delay={(index % 3) * 100}
                    className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]"
                  >
                    <article className="group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fff6d6] text-[#b98900] ring-1 ring-[#ffe8a3]">
                        <Icon aria-hidden="true" className="size-6" />
                      </span>
                      <h3 className="mt-5 font-heading text-xl font-semibold text-[#023e8a]">{item.name}</h3>
                      <p className="mt-3 flex-1 text-[15px] leading-7 text-[#5c6b7a]">{item.text}</p>
                    </article>
                  </MotionReveal>
                )
              })}
            </div>
            {witnesses.closing ? (
              <p className="mx-auto mt-8 max-w-2xl text-center font-heading text-lg leading-8 font-medium text-[#023e8a] italic">
                {witnesses.closing}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-20 grid gap-5 md:grid-cols-2 md:gap-6">
          {content.future.map((card, index) => (
            <MotionReveal key={card.title} from={index % 2 === 0 ? "left" : "right"} delay={(index % 2) * 100} className="h-full">
              <StoryCard card={card} deep={index % 2 === 0} />
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
