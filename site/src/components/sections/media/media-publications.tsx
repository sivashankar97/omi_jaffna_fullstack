import Link from "next/link"

import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import type { Publication } from "@/lib/cms"
import { cn } from "cn"

const tones = [
  "bg-gradient-to-br from-[#06394a] via-[#0a5062] to-[#023e8a] text-white",
  "bg-white text-[#023e8a] ring-1 ring-[#d7eef3]",
  "bg-gradient-to-br from-[#17b3c6] via-[#0e98ac] to-[#0a6f7e] text-white",
  "bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] text-white",
]

export function MediaPublications({
  publications,
  copy,
}: {
  publications: Publication[]
  copy?: { kicker: string; title: string; summary: string }
}) {
  const heading = copy ?? {
    kicker: "Read",
    title: "Publications of the Province",
    summary: "Covers, editions and downloads will be added as each issue is approved for the website.",
  }

  return (
    <section id="publications" className="scroll-mt-80 bg-[#f4fafc] px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal from="up">
          <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase sm:text-sm">{heading.kicker}</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-5xl">{heading.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5c6b7a] sm:text-base">{heading.summary}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {publications.map((item, index) => {
            const tone = tones[index % tones.length]
            const light = tone.includes("bg-white")
            const action = item.href ? "Read now" : "Read issues"
            const className = cn(
              "group relative flex h-full min-h-[17rem] scroll-mt-80 flex-col justify-end overflow-hidden rounded-[1.5rem] p-7 shadow-[0_22px_44px_-28px_rgba(2,62,138,0.45)] transition duration-500 hover:-translate-y-1.5 sm:p-8",
              tone
            )
            const body = (
              <>
                {item.subtitle ? (
                  <p
                    className={cn(
                      "text-[10px] font-bold tracking-[0.22em] uppercase",
                      light ? "text-[#17b3c6]" : "text-white/70"
                    )}
                  >
                    {item.subtitle}
                  </p>
                ) : null}
                <h3 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{item.title}</h3>
                <p className={cn("mt-4 text-sm leading-7", light ? "text-[#5c6b7a]" : "text-white/85")}>{item.text}</p>
                <span
                  className={cn(
                    "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition group-hover:gap-2.5",
                    light ? "text-[#0e98ac]" : "text-[#7fe3ef]"
                  )}
                >
                  {action}
                  <ArrowUpRight className="size-4" />
                </span>
              </>
            )

            if (item.href?.startsWith("http")) {
              return (
                <Reveal key={item.id} from="up" delay={index * 100} className="h-full">
                  <a id={item.id} href={item.href} target="_blank" rel="noreferrer" className={className}>
                    {body}
                  </a>
                </Reveal>
              )
            }
            if (item.href) {
              return (
                <Reveal key={item.id} from="up" delay={index * 100} className="h-full">
                  <Link id={item.id} href={item.href} className={className}>
                    {body}
                  </Link>
                </Reveal>
              )
            }
            return (
              <Reveal key={item.id} from="up" delay={index * 100} className="h-full">
                <article id={item.id} className={className}>
                  {body}
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
