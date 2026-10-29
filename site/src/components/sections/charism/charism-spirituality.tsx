import Image from "next/image"
import { Flame, Footprints, MapPin, Sparkles, Users } from "lucide-react"

import { MotionReveal } from "@/components/motion/motion-reveal"
import type { charismSpirituality } from "@/content/charism"
import { isUpload } from "@/content/site-info"

const themeIcons = [Flame, Footprints, Users, Sparkles]

type Spirituality = typeof charismSpirituality

export function CharismSpirituality({ content }: { content: Spirituality }) {
  const [lead, ...rest] = content.paragraphs
  return (
    <section id="spiritual-life" className="calendar-stage relative scroll-mt-80 px-4 py-16 sm:px-8 sm:py-20">
      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <MotionReveal from="left" className="h-full">
            <div className="media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-9">
              <p className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] text-[#17b3c6] uppercase">
                <span aria-hidden="true" className="h-px w-7 bg-[#17b3c6]" />
                {content.kicker}
              </p>
              <h2 className="mt-4 font-heading text-3xl leading-tight font-semibold text-balance text-[#023e8a] sm:text-[2.6rem]">
                {content.title}
              </h2>
              {content.subtitle ? (
                <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#e7fbff] px-3.5 py-1.5 text-xs font-bold tracking-wide text-[#0e98ac] ring-1 ring-[#cfeef4]">
                  <span aria-hidden="true">✝</span>
                  {content.subtitle}
                </p>
              ) : null}
              {lead ? (
                <p className="mt-6 font-heading text-lg leading-8 font-medium text-[#023e8a] sm:text-xl sm:leading-9">{lead}</p>
              ) : null}
              {rest.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-[15px] leading-7 text-[#5c6b7a] sm:text-base sm:leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal from="right" delay={120} className="h-full min-h-[20rem]">
            <div className="group media-bento-card media-bento-shine relative h-full min-h-[20rem] overflow-hidden rounded-[1.75rem]">
              <Image
                src={content.image}
                alt={content.imageAlt}
                unoptimized={isUpload(content.image)}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[88%_center] transition duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#03202b]/75 via-[#03202b]/10 to-transparent"
              />
              <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4 text-white">
                {content.imageQuote ? (
                  <p className="font-heading text-xl leading-snug font-semibold italic sm:text-2xl">“{content.imageQuote}”</p>
                ) : (
                  <span />
                )}
                {content.imageBadge ? (
                  <span className="shrink-0 rounded-full bg-[#ffcf4a] px-3 py-1 text-xs font-bold text-[#03202b]">
                    {content.imageBadge}
                  </span>
                ) : null}
              </div>
            </div>
          </MotionReveal>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
          {content.themes.map((theme, index) => {
            const Icon = themeIcons[index % themeIcons.length]
            const deep = index % 4 === 1 || index % 4 === 2
            return (
              <MotionReveal key={theme.title} from={index % 2 === 0 ? "left" : "right"} delay={(index % 2) * 100} className="h-full">
                <article
                  className={
                    deep
                      ? "group media-bento-card media-bento-shine calendar-glass-deep relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-8"
                      : "group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-8"
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      deep
                        ? "absolute top-5 right-6 font-heading text-6xl leading-none font-bold text-white/10"
                        : "absolute top-5 right-6 font-heading text-6xl leading-none font-bold text-[#17b3c6]/15"
                    }
                  >
                    {String(index + 1).padStart(2, "0")}
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
                        ? "mt-6 pr-12 font-heading text-xl leading-snug font-semibold text-white sm:text-2xl"
                        : "mt-6 pr-12 font-heading text-xl leading-snug font-semibold text-[#023e8a] sm:text-2xl"
                    }
                  >
                    {theme.title}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {theme.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className={deep ? "text-[15px] leading-7 text-white/78" : "text-[15px] leading-7 text-[#5c6b7a]"}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {theme.quote ? (
                    <blockquote
                      className={
                        deep
                          ? "mt-5 rounded-2xl border-l-4 border-[#ffcf4a] bg-white/8 px-5 py-3.5 font-heading text-base leading-7 font-semibold text-white italic"
                          : "mt-5 rounded-2xl border-l-4 border-[#17b3c6] bg-[#e7fbff] px-5 py-3.5 font-heading text-base leading-7 font-semibold text-[#023e8a] italic"
                      }
                    >
                      “{theme.quote}”
                      {theme.quoteBy ? (
                        <span
                          className={
                            deep
                              ? "mt-1 block text-xs font-bold tracking-wide text-[#ffcf4a] not-italic"
                              : "mt-1 block text-xs font-bold tracking-wide text-[#0e98ac] not-italic"
                          }
                        >
                          — {theme.quoteBy}
                        </span>
                      ) : null}
                    </blockquote>
                  ) : null}
                </article>
              </MotionReveal>
            )
          })}
        </div>

        {content.sriLanka.title ? (
          <MotionReveal from="up" className="mt-8">
            <div className="media-bento-card media-bento-shine relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] p-7 text-white sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-[#7fe3ef]/20 blur-3xl"
              />
              <div className="relative grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-[#7fe3ef] ring-1 ring-white/15">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    {content.sriLanka.place}
                  </span>
                  <p className="mt-4 font-heading text-6xl leading-none font-bold text-[#ffcf4a] sm:text-7xl">
                    {content.sriLanka.year}
                  </p>
                  <h3 className="mt-4 font-heading text-2xl leading-snug font-semibold text-white">{content.sriLanka.title}</h3>
                </div>
                <div className="space-y-4">
                  {content.sriLanka.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-8 text-white/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </MotionReveal>
        ) : null}
      </div>
    </section>
  )
}
