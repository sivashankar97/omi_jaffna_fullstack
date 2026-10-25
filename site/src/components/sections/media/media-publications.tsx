import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import type { Publication } from "@/lib/cms"
import { cn } from "cn"

const tones = [
  "calendar-glass-deep text-white",
  "calendar-glass text-[#023e8a]",
  "bg-gradient-to-br from-[#17b3c6] via-[#0e98ac] to-[#023e8a] text-white ring-1 ring-white/25 shadow-[0_24px_48px_-28px_rgb(2_62_138/0.55)]",
]

export function MediaPublications({ publications }: { publications: Publication[] }) {
  return (
    <section id="publications" className="calendar-stage scroll-mt-80 px-4 py-20 text-[#023e8a] sm:px-8">
      <div className="relative mx-auto max-w-6xl">
        <Reveal from="up">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">Read</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Publications of the Province</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[#3d4b59]">
            Covers, editions and downloads will be added as each issue is approved for the website.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publications.map((item, index) => (
            <Reveal key={item.id} from="up" delay={index * 120} className="h-full">
              <article
                id={item.id}
                className={cn(
                  "group media-bento-card media-bento-shine relative flex h-full min-h-[18rem] scroll-mt-80 flex-col justify-end overflow-hidden rounded-[2rem] p-8",
                  tones[index % tones.length]
                )}
              >
                <p className="text-xs tracking-[0.24em] uppercase opacity-80">{item.subtitle}</p>
                <h3 className="mt-3 font-heading text-5xl">{item.title}</h3>
                <p className="mt-4 max-w-sm leading-7 opacity-90">{item.text}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-5 inline-flex items-center gap-1.5 self-start border-b-2 border-current pb-0.5 text-sm font-semibold transition group-hover:gap-2.5"
                  >
                    Read the latest issue
                    <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
