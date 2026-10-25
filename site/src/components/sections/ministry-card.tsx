import Link from "next/link"
import {
  Accessibility,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Church,
  Flame,
  GraduationCap,
  Handshake,
  Heart,
  HeartPulse,
  Home,
  Landmark,
  Leaf,
  Lightbulb,
  MessageCircle,
  Smile,
  Sun,
  Users,
} from "lucide-react"

import type { Ministry } from "@/lib/cms"
import { cn } from "cn"

const accents = [
  { badge: "bg-[#e7fbff] text-[#0e98ac]", bar: "from-[#17b3c6] to-[#0e98ac]" },
  { badge: "bg-[#fff6d9] text-[#9a6b00]", bar: "from-[#ffcf4a] to-[#e6b422]" },
  { badge: "bg-[#e8f0ff] text-[#023e8a]", bar: "from-[#023e8a] to-[#0a5062]" },
  { badge: "bg-[#e7fbff] text-[#06394a]", bar: "from-[#0e98ac] to-[#06394a]" },
  { badge: "bg-[#fff6d9] text-[#03202b]", bar: "from-[#17b3c6] to-[#ffcf4a]" },
  { badge: "bg-[#e8f0ff] text-[#0e98ac]", bar: "from-[#06394a] to-[#17b3c6]" },
] as const

const icons = [
  Landmark,
  BookOpen,
  HeartPulse,
  GraduationCap,
  Lightbulb,
  Users,
  Smile,
  Church,
  BookMarked,
  MessageCircle,
  Accessibility,
  Heart,
  Leaf,
  Flame,
  Handshake,
  Sun,
  Home,
] as const

export function MinistryCard({
  ministry,
  index,
  href,
  actionLabel,
}: {
  ministry: Ministry
  index: number
  href?: string
  actionLabel?: string
}) {
  const accent = accents[index % accents.length]
  const Icon = icons[index % icons.length]
  const image = ministry.image
  const cta = actionLabel ?? "Read more"

  const body = (
    <>
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent.bar)} />
      <div className="relative h-44 overflow-hidden bg-[#eef6f8] sm:h-48">
        {image ? (
          <img
            src={encodeURI(image)}
            alt=""
            className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#e7fbff] via-[#f4fbfd] to-[#fff6d9]">
            <Icon aria-hidden="true" className="size-14 text-[#0e98ac]/50" strokeWidth={1.5} />
          </span>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-[#03202b]/25 via-transparent to-transparent" />
        <span
          className={cn(
            "absolute top-3 left-3 flex size-10 items-center justify-center rounded-2xl ring-1 ring-white/60 backdrop-blur-sm",
            accent.badge
          )}
        >
          <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
        </span>
        <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/85 text-[#023e8a] ring-1 ring-[#cfeef4] transition group-hover:rotate-45">
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#0e98ac] uppercase">
          {ministry.number} · {ministry.place}
        </span>
        <h3 className="mt-2 font-heading text-xl leading-tight font-semibold text-[#023e8a] sm:text-2xl">
          {ministry.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5c6b7a]">{ministry.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-sm font-semibold text-[#0e98ac] transition group-hover:gap-2.5 group-hover:text-[#023e8a]">
          {cta}
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </>
  )

  const shell =
    "ministry-tile group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem]"

  if (href) {
    return (
      <Link href={href} aria-label={`${cta}: ${ministry.title}`} className={shell}>
        {body}
      </Link>
    )
  }

  return <article className={shell}>{body}</article>
}
