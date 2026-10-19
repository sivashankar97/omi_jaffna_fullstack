import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/sections/section-heading"

const accents = ["#e94e77", "#2f80ed", "#f2994a", "#27ae60", "#8e5cf0", "#e2b100", "#eb5757", "#17b3c6"]

export function CharismWays({ ways }: { ways: string[] }) {
  return (
    <section id="how-we-live" className="relative scroll-mt-80 overflow-hidden bg-[#f4fbfd] px-4 py-20 sm:px-8 sm:py-24">
      <div
        aria-hidden="true"
        className="charism-orb pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[#caf0f8] opacity-60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="charism-orb pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-[#fff1c2] opacity-60 blur-3xl [animation-delay:-6s]"
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          kicker="Our way of life"
          title="How We Live the Charism"
          subtitle="Eight commitments that shape how Oblates walk with the people of God."
        />
        <ol className="mt-14 grid gap-5 sm:grid-cols-2">
          {ways.map((line, index) => {
            const accent = accents[index % accents.length]
            return (
              <Reveal
                key={line}
                as="li"
                from={index % 2 === 0 ? "left" : "right"}
                delay={Math.floor(index / 2) * 90}
                className="group h-full"
              >
                <div
                  className="relative flex h-full items-center gap-5 overflow-hidden rounded-2xl bg-white p-5 shadow-[0_18px_40px_-30px_rgba(2,62,138,0.55)] ring-1 ring-[#e2f2f6] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_26px_50px_-28px_rgba(2,62,138,0.55)] sm:p-6"
                  style={{ "--accent": accent } as React.CSSProperties}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 bg-[var(--accent)] transition-all duration-500 group-hover:w-1.5"
                  />
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl font-heading text-base font-bold text-[var(--accent)] transition duration-500 group-hover:scale-110"
                    style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, white)` }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-heading text-lg leading-snug font-medium text-[#023e8a] sm:text-xl">{line}</p>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
