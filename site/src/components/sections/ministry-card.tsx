import Link from "next/link"
import {
  Accessibility,
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

const tones = [
  { deep: "#1e3a8a", glow: "#3557c9", soft: "#e0e7ff" },
  { deep: "#065f46", glow: "#11906b", soft: "#d5f7e8" },
  { deep: "#6b21a8", glow: "#9046cf", soft: "#f1e6ff" },
  { deep: "#9f1239", glow: "#c9395f", soft: "#ffe4e9" },
  { deep: "#92400e", glow: "#c26a1d", soft: "#fdf0d2" },
  { deep: "#0f766e", glow: "#18a69b", soft: "#d2f8f2" },
  { deep: "#1f2937", glow: "#435369", soft: "#e6e9ee" },
  { deep: "#075985", glow: "#0f86c2", soft: "#dcf0fd" },
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

export const ministryImages: Record<string, string> = {
  Administration: "/Administration.jpg",
  "Mission Preaching": "/ministries/mission_Preaching.jpg",
  "Hospital & Prison Chaplaincy": "/ministries/Hospital & Prison Chaplaincy.jpeg",
  "Formal Education": "/ministries/Formal Education.jpg",
  "Non-Formal Education": "/ministries/Non-Formal Education.jpg",
  "Youth Animation": "/ministries/Youth Animation.jpg",
}

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
  const tone = tones[index % tones.length]
  const Icon = icons[index % icons.length]
  const curveRight = index % 2 === 1
  const image = ministry.image ?? ministryImages[ministry.title]

  return (
    <article className="ministry-tile group flex h-full flex-col overflow-hidden rounded-[1.75rem]">
      <div
        className="relative flex h-52 items-center justify-center overflow-hidden"
        style={{ backgroundColor: tone.soft }}
      >
        {image ? (
          <img
            src={encodeURI(image)}
            alt={ministry.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <>
            <span
              aria-hidden="true"
              className="ministry-tile-orb absolute -top-10 -left-8 size-36 rounded-full"
              style={{ backgroundColor: tone.deep }}
            />
            <span
              aria-hidden="true"
              className="ministry-tile-orb absolute -right-6 -bottom-12 size-28 rounded-full"
              style={{ backgroundColor: tone.deep }}
            />
            <Icon
              aria-hidden="true"
              className="ministry-tile-icon relative size-16"
              strokeWidth={1.6}
              style={{ color: tone.deep }}
            />
          </>
        )}
      </div>
      <div
        className={`relative -mt-10 flex flex-1 flex-col px-6 pt-8 pb-7 text-left text-white ${
          curveRight ? "rounded-tr-[3.5rem]" : "rounded-tl-[3.5rem]"
        }`}
        style={{ backgroundImage: `linear-gradient(145deg, ${tone.deep} 0%, ${tone.glow} 100%)` }}
      >
        <span className="text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase">
          {ministry.number} · {ministry.place}
        </span>
        <h3 className="mt-2 font-heading text-2xl leading-tight font-semibold text-white">{ministry.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/85">{ministry.summary}</p>
        {href ? (
          <Link
            href={href}
            className="mt-auto inline-block self-start border-b-2 border-[#ffcf4a] pt-5 pb-0.5 text-xs font-bold tracking-[0.16em] text-white uppercase"
          >
            Read more
          </Link>
        ) : actionLabel ? (
          <span className="mt-auto inline-flex items-center gap-2 self-start border-b-2 border-[#ffcf4a] pt-5 pb-0.5 text-xs font-bold tracking-[0.16em] text-white uppercase">
            {actionLabel}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        ) : null}
      </div>
    </article>
  )
}
