import Image from "next/image"

import { MotionReveal } from "@/components/motion/motion-reveal"
import type { charismFounder } from "@/content/charism"
import { isUpload } from "@/content/site-info"

type Founder = typeof charismFounder

export function CharismFounder({ content }: { content: Founder }) {
  return (
    <section
      id="founder"
      className="relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-16 text-white sm:px-8 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 -left-24 -z-10 size-80 rounded-full bg-[#7fe3ef]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-24 -z-10 size-96 rounded-full bg-[#ffcf4a]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <MotionReveal from="up">
          <div className="group relative overflow-hidden rounded-[2rem] ring-1 ring-white/15 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.7)]">
            <div className="relative aspect-[16/10] sm:aspect-[16/8]">
              <Image
                src={content.image}
                alt={content.imageAlt}
                unoptimized={isUpload(content.image)}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover object-top transition duration-[1400ms] ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#03202b] via-[#03202b]/35 to-transparent"
            />
            <div className="absolute right-0 bottom-0 left-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-10">
              <div>
                <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase">
                  <span aria-hidden="true" className="h-px w-8 bg-[#ffcf4a]" />
                  {content.kicker}
                </p>
                <h2 className="mt-3 font-heading text-4xl leading-[1.05] font-semibold text-white sm:text-6xl">{content.name}</h2>
                <p className="mt-3 max-w-xl text-base text-white/80 sm:text-xl">{content.tagline}</p>
              </div>
              {content.years ? (
                <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-heading text-lg font-semibold text-[#7fe3ef] backdrop-blur-md">
                  {content.years}
                </span>
              ) : null}
            </div>
          </div>
        </MotionReveal>

        <ol className="relative mt-14 space-y-6 sm:mt-16 sm:space-y-8">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[1.35rem] w-px bg-gradient-to-b from-[#ffcf4a] via-[#7fe3ef]/60 to-transparent sm:left-1/2"
          />
          {content.chapters.map((chapter, index) => {
            const right = index % 2 === 1
            return (
              <MotionReveal
                key={chapter.title}
                as="li"
                from={right ? "right" : "left"}
                className="relative pl-14 sm:grid sm:grid-cols-2 sm:gap-12 sm:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1 left-0 grid size-11 place-items-center rounded-full bg-[#ffcf4a] font-heading text-sm font-bold text-[#03202b] ring-4 ring-[#06394a] sm:left-1/2 sm:-translate-x-1/2"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  className={
                    right
                      ? "rounded-[1.5rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm sm:col-start-2 sm:p-7"
                      : "rounded-[1.5rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm sm:col-start-1 sm:p-7"
                  }
                >
                  <h3 className="font-heading text-xl leading-snug font-semibold text-white sm:text-2xl">{chapter.title}</h3>
                  <div className="mt-4 space-y-3">
                    {chapter.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-[15px] leading-7 text-white/78">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </MotionReveal>
            )
          })}
        </ol>

        {content.quote ? (
          <MotionReveal from="up" className="mx-auto mt-16 max-w-4xl text-center">
            {content.quoteIntro ? (
              <p className="text-xs font-bold tracking-[0.24em] text-[#7fe3ef] uppercase">{content.quoteIntro}</p>
            ) : null}
            <span aria-hidden="true" className="mt-4 block font-heading text-7xl leading-none text-[#ffcf4a]/80">
              “
            </span>
            <blockquote className="font-heading text-2xl leading-snug font-semibold text-balance italic sm:text-4xl sm:leading-tight">
              {content.quote}
            </blockquote>
            <p className="mt-3 text-sm font-semibold text-[#ffcf4a]">— {content.name}</p>
            {content.closing ? (
              <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">{content.closing}</p>
            ) : null}
          </MotionReveal>
        ) : null}
      </div>
    </section>
  )
}
