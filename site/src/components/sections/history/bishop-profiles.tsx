import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Cross } from "lucide-react"

import { MotionReveal } from "@/components/motion/motion-reveal"
import { SectionHeading } from "@/components/sections/section-heading"
import { bishopHref } from "@/config/navigation"
import { isUpload } from "@/content/site-info"
import { getBishops } from "@/lib/cms"

function initials(name: string) {
  const words = name
    .replace(/\b(Rt\.?|Rev\.?|Arch\.?|Bp\.?|Bishop|Archbishop|Mgr\.?|Cardinal|H\.?\s*E\.?)\b/gi, "")
    .replace(/[.,]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return "OB"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export async function BishopProfiles() {
  const bishops = await getBishops()
  if (!bishops.length) return null

  return (
    <section id="bishops" className="calendar-stage scroll-mt-80 px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          kicker="Oblate bishops"
          title="Bishops of our story"
          subtitle="Open any card for that bishop’s own profile page."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bishops.map((bishop, index) => (
            <MotionReveal key={bishop.slug} as="li" from="up" delay={(index % 3) * 80} className="h-full">
              <Link
                href={bishopHref(bishop)}
                className="group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem]"
              >
                <div className="relative flex items-center gap-4 bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-5 py-5 text-white">
                  <span className="absolute top-3.5 right-3.5 grid size-8 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition group-hover:rotate-45">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                  {bishop.image ? (
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-[#ffcf4a]/70">
                      <Image
                        src={bishop.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized={isUpload(bishop.image)}
                      />
                    </span>
                  ) : (
                    <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/10 font-heading text-lg font-bold ring-2 ring-[#ffcf4a]/70 transition group-hover:scale-105">
                      {initials(bishop.name)}
                    </span>
                  )}
                  <div className="min-w-0 pr-8">
                    <p className="text-[11px] font-bold tracking-[0.18em] text-[#ffcf4a] uppercase">Bishop</p>
                    <h3 className="mt-1 font-heading text-lg leading-snug font-semibold">{bishop.name}</h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-[11px] font-bold tracking-wide text-[#17b3c6] uppercase">Born</dt>
                      <dd className="mt-1 font-semibold text-[#023e8a]">{bishop.born || "—"}</dd>
                      <dd className="text-[#5c6b7a]">{bishop.bornAt}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold tracking-wide text-[#17b3c6] uppercase">Died</dt>
                      <dd className="mt-1 font-semibold text-[#023e8a]">{bishop.died || "—"}</dd>
                      <dd className="text-[#5c6b7a]">{bishop.diedAt}</dd>
                    </div>
                  </dl>
                  {bishop.excerpt ? <p className="text-sm leading-6 text-[#5c6b7a]">{bishop.excerpt}</p> : null}
                  <p className="mt-auto flex items-center justify-between gap-2 border-t border-[#d7eef3]/80 pt-4 text-xs font-semibold tracking-wide text-[#5c6b7a] uppercase">
                    <span className="inline-flex items-center gap-2">
                      <Cross aria-hidden="true" className="size-3.5 text-[#17b3c6]" />
                      {bishop.no ? `Register no. ${bishop.no}` : "Oblate bishop"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#0e98ac] normal-case tracking-normal group-hover:gap-2">
                      Profile
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </span>
                  </p>
                </div>
              </Link>
            </MotionReveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
