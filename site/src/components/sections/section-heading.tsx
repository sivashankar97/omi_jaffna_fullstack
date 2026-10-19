import { Reveal } from "@/components/motion/reveal"

export function SectionHeading({
  kicker,
  title,
  subtitle,
  light = false,
}: {
  kicker?: string
  title: string
  subtitle?: string
  light?: boolean
}) {
  return (
    <Reveal from="up" className="mx-auto max-w-3xl text-center">
      {kicker ? (
        <p className={`text-xs font-bold tracking-[0.28em] uppercase ${light ? "text-[#ffcf4a]" : "text-[#17b3c6]"}`}>
          {kicker}
        </p>
      ) : null}
      <h2
        className={`mt-3 font-heading text-3xl leading-tight font-semibold text-balance sm:text-5xl ${
          light ? "text-white" : "text-[#023e8a]"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-4 text-base sm:text-lg ${light ? "text-white/75" : "text-[#5c6b7a]"}`}>{subtitle}</p>
      ) : null}
      <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden="true">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#ffbf00]" />
        <span className="text-sm text-[#ffbf00]">✝</span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#ffbf00]" />
      </div>
    </Reveal>
  )
}
