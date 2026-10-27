import { BookOpen, ChevronRight, Church, Cross, HeartHandshake, Sparkles, Users, Waves } from "lucide-react"

import { MotionReveal } from "@/components/motion/motion-reveal"
import { SectionHeading } from "@/components/sections/section-heading"

const wayIcons = [Cross, Users, HeartHandshake, Church, BookOpen, Sparkles, Waves, Users]

export function CharismWays({ ways }: { ways: string[] }) {
  return (
    <section id="how-we-live" className="calendar-stage relative scroll-mt-80 overflow-hidden px-4 py-14 sm:px-8 sm:py-16">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          kicker="Our way of life"
          title="How We Live the Charism"
          subtitle="Eight commitments that shape how Oblates walk with the people of God."
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2">
          {ways.map((line, index) => {
            const Icon = wayIcons[index % wayIcons.length]
            return (
              <MotionReveal
                key={line}
                as="li"
                from={index % 2 === 0 ? "left" : "right"}
                delay={Math.floor(index / 2) * 70}
                className="h-full"
              >
                <div className="group media-bento-card media-bento-shine calendar-glass relative flex h-full items-center gap-4 overflow-hidden rounded-[1.5rem] px-4 py-4 sm:gap-5 sm:px-5 sm:py-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#17b3c6] font-heading text-sm font-bold text-white shadow-[0_10px_20px_-12px_rgb(14_152_172/0.8)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center text-[#17b3c6]">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={2.1} />
                  </span>
                  <p className="min-w-0 flex-1 pr-2 font-heading text-[15px] leading-snug font-medium text-[#023e8a] sm:text-base">
                    {line}
                  </p>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-[#17b3c6] transition group-hover:translate-x-0.5"
                  />
                </div>
              </MotionReveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
