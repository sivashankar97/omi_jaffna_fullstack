import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { cn } from "cn"

export type WelcomeCard = {
  badge: string
  title: string
  text?: string
  image: string
  href: string
  tone?: "teal" | "gold"
}

type WelcomeSceneProps = {
  badge: string
  eyebrow?: string
  title: string
  highlight?: string
  lede: string
  cards: WelcomeCard[]
}

function TitleWithHighlight({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight) return <>{title}</>
  const needle = highlight.trim()
  const index = title.toLowerCase().indexOf(needle.toLowerCase())
  if (index < 0) return <>{title}</>
  const before = title.slice(0, index)
  const mark = title.slice(index, index + needle.length)
  const after = title.slice(index + needle.length)
  return (
    <>
      {before}
      <span className="bg-gradient-to-r from-[#17b3c6] via-[#0e98ac] to-[#ffcf4a] bg-clip-text text-transparent">
        {mark}
      </span>
      {after}
    </>
  )
}

export function WelcomeScene({ badge, eyebrow, title, highlight, lede, cards }: WelcomeSceneProps) {
  const items = cards.slice(0, 3)

  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="grid items-stretch gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
        <Reveal from="left" className="min-h-0">
          <div className="media-bento-card media-bento-shine calendar-glass-deep relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-[#ffcf4a] px-3 py-1 text-[10px] font-bold tracking-[0.22em] text-[#03202b] uppercase">
                {badge}
              </span>
              {eyebrow ? (
                <p className="text-xs font-semibold tracking-[0.18em] text-[#7fe3ef] uppercase">{eyebrow}</p>
              ) : null}
            </div>
            <h2 className="mt-6 font-heading text-3xl leading-tight font-semibold text-white sm:text-4xl lg:text-[2.65rem]">
              <TitleWithHighlight title={title} highlight={highlight} />
            </h2>
            <p className="mt-4 max-w-md flex-1 text-sm leading-7 text-white/75 sm:text-base">{lede}</p>
            <Link
              href={items[0]?.href ?? "/charism"}
              className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/15"
            >
              Begin exploring
              <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
            </Link>
          </div>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
          {items.map((card, index) => (
            <Reveal
              key={card.badge + card.href}
              as="li"
              from="right"
              delay={80 + index * 100}
              className="h-full"
            >
              <Link
                href={card.href}
                className="group media-bento-card media-bento-shine calendar-glass relative flex h-full min-h-[9.5rem] overflow-hidden rounded-[1.75rem] sm:min-h-0 sm:flex-col lg:min-h-[8.75rem] lg:flex-row"
              >
                <span className="relative block w-[42%] shrink-0 overflow-hidden sm:aspect-[16/10] sm:w-full lg:aspect-auto lg:w-[11.5rem] lg:self-stretch">
                  <img
                    src={card.image}
                    alt=""
                    className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 lg:bg-gradient-to-t lg:from-[#03202b]/20 lg:to-transparent" />
                </span>
                <span className="relative flex min-w-0 flex-1 flex-col justify-center px-4 py-3.5 sm:px-5 sm:py-4">
                  <span
                    className={cn(
                      "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase",
                      card.tone === "gold"
                        ? "bg-[#fff6d9] text-[#9a6b00]"
                        : "bg-[#e7fbff] text-[#0e98ac]"
                    )}
                  >
                    {card.badge}
                  </span>
                  <span className="mt-2 line-clamp-3 font-heading text-base leading-snug font-semibold text-[#023e8a] sm:text-lg">
                    {card.title}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0e98ac] transition group-hover:gap-2 group-hover:text-[#023e8a]">
                    Open
                    <ArrowUpRight className="size-3.5 transition group-hover:rotate-45" />
                  </span>
                </span>
                <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-[#e7fbff] text-[#023e8a] ring-1 ring-[#cfeef4] transition group-hover:rotate-45">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}
