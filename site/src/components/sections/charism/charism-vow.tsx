"use client"

import Image from "next/image"
import { BookOpen, Eye, Target } from "lucide-react"

import { MotionReveal } from "@/components/motion/motion-reveal"
import { isUpload } from "@/content/site-info"

export function CharismVow({
  mission,
  vision,
  motto: charismMotto,
  crossImage,
}: {
  mission: string
  vision: string
  motto: string
  crossImage: string
}) {
  const cards = [
    {
      id: "mission",
      label: "Mission",
      title: "Guided by the Good News",
      text: mission,
      icon: BookOpen,
      shell: "bg-[#ffe8ee]/90 ring-[#f5c2ce]/70",
      accent: "bg-[#e94e77]",
      iconTone: "bg-white text-[#e94e77]",
      titleTone: "text-[#023e8a]",
      textTone: "text-[#5c6b7a]",
    },
    {
      id: "vision",
      label: "Vision",
      title: "Vision",
      text: vision,
      icon: Eye,
      shell: "bg-[#e8f3ff]/95 ring-[#b7d7ff]/80",
      accent: "bg-[#2f80ed]",
      iconTone: "bg-white text-[#2f80ed]",
      titleTone: "text-[#023e8a]",
      textTone: "text-[#5c6b7a]",
    },
    {
      id: "motto",
      label: "Motto",
      title: "Motto",
      text: charismMotto,
      icon: Target,
      shell: "bg-[#fff4d6]/95 ring-[#ffe08a]/80",
      accent: "bg-[#e2b100]",
      iconTone: "bg-white text-[#b8860b]",
      titleTone: "text-[#023e8a]",
      textTone: "text-[#5c6b7a]",
    },
  ] as const

  return (
    <section
      id="mission-vision"
      className="calendar-stage relative isolate scroll-mt-80 overflow-hidden px-4 py-16 sm:px-8 sm:py-20"
    >
      {/* Soft blue atmospheric wash + orbs (reference) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_40%,#d4f3f8_0%,transparent_55%),radial-gradient(ellipse_at_80%_20%,#e7fbff_0%,transparent_50%),linear-gradient(180deg,#f4fbfd_0%,#eef8fb_55%,#f7fbff_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[8%] left-[6%] -z-10 size-56 rounded-full bg-white/70 blur-2xl sm:size-72"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[28%] left-[22%] -z-10 size-40 rounded-full bg-[#7fe3ef]/25 blur-3xl sm:size-52"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] bottom-[18%] -z-10 size-48 rounded-full bg-white/60 blur-2xl"
      />
      {/* Soft leaf silhouettes */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-40 w-56 text-[#17b3c6]/15 sm:h-52 sm:w-72"
        viewBox="0 0 280 160"
        fill="currentColor"
      >
        <path d="M12 148c28-42 58-78 98-98 8 36-6 72-34 98-22 20-46 18-64 0Z" />
        <path d="M88 152c22-36 48-62 82-74 4 30-8 58-30 78-18 16-36 14-52-4Z" />
        <path d="M40 120c18-28 40-48 68-58 2 24-8 48-26 66-14 14-30 12-42-8Z" opacity="0.7" />
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-36 w-48 text-[#0e98ac]/12 sm:h-44 sm:w-60"
        viewBox="0 0 240 140"
        fill="currentColor"
      >
        <path d="M228 132c-24-36-50-66-86-82-6 30 6 60 30 82 18 18 40 16 56 0Z" />
        <path d="M170 136c-18-30-40-52-70-62-2 26 8 50 26 68 14 14 30 12 44-6Z" opacity="0.75" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <MotionReveal from="left" className="flex justify-center lg:justify-start">
          <div className="relative flex min-h-[22rem] w-full max-w-md items-center justify-center sm:min-h-[26rem]">
            {/* Soft halo behind the cross — open, no hard white frame */}
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.95)_0%,rgb(231_251_255/0.55)_42%,transparent_72%)] sm:size-[20rem]"
            />
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-[12rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7fe3ef]/20 blur-2xl sm:size-[15rem]"
            />
            <Image
              src={crossImage}
              alt="Oblate cross"
              width={420}
              height={560}
              unoptimized={isUpload(crossImage) || crossImage.includes("?")}
              className="relative z-10 mx-auto h-auto max-h-[24rem] w-full max-w-[15rem] object-contain drop-shadow-[0_28px_40px_rgb(2_62_138/0.22)] sm:max-h-[28rem] sm:max-w-[17rem]"
            />
          </div>
        </MotionReveal>

        <div className="grid gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <MotionReveal key={card.id} from="right" delay={40 + index * 90} id={card.id}>
                <div
                  className={`media-bento-card media-bento-shine scroll-mt-80 relative flex gap-4 overflow-hidden rounded-[1.5rem] px-5 py-5 ring-1 backdrop-blur-md sm:gap-5 sm:px-6 sm:py-6 ${card.shell}`}
                >
                  <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${card.accent}`} />
                  <span className={`mt-0.5 grid size-11 shrink-0 place-items-center rounded-full ${card.iconTone}`}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#5c6b7a] uppercase">{card.label}</p>
                    <h2 className={`mt-1 font-heading text-xl font-semibold sm:text-2xl ${card.titleTone}`}>
                      {card.title}
                    </h2>
                    <p className={`mt-2 text-[15px] leading-7 sm:text-base sm:leading-8 ${card.textTone}`}>{card.text}</p>
                  </div>
                </div>
              </MotionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
