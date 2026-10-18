import { AutoSlide } from "@/components/motion/auto-slide"
import { cn } from "cn"

const light = "bg-gradient-to-br from-white via-[#e7fbff] to-[#caf0f8] text-[#023e8a]"

const tones = {
  black: light,
  cyan: light,
  gold: light,
  white: light,
} as const

type PageHeroProps = {
  id?: string
  kicker: string
  title: string
  summary: string
  tone?: keyof typeof tones
}

export function PageHero({
  id,
  kicker,
  title,
  summary,
  tone = "white",
}: PageHeroProps) {
  return (
    <header id={id} className={cn("scroll-mt-80 overflow-hidden px-4 py-14 sm:px-8 sm:py-20", tones[tone])}>
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="max-w-3xl font-heading text-4xl leading-tight font-semibold text-balance sm:text-6xl">{kicker}</p>
          <h1 className="mt-4 text-sm font-semibold tracking-[0.22em] uppercase">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 sm:text-lg">{summary}</p>
        </div>
        <AutoSlide className="h-64 w-full sm:h-80" label={title} />
      </div>
    </header>
  )
}
