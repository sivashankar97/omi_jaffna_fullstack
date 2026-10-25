"use client"

import Image from "next/image"
import Link from "next/link"
import { Cake, X } from "lucide-react"
import { useEffect, useState } from "react"

import { isUpload } from "@/content/site-info"

export type BirthdayPerson = {
  slug: string
  name: string
  image?: string
  href: string
}

function shortName(name: string) {
  return name
    .replace(/\s*,?\s*\bOMI\b/gi, "")
    .replace(/\b(Rev\.?\s*)?(Fr\.?|Bro\.?)\s*/gi, "")
    .trim()
}

export function BirthdayFloat({ people }: { people: BirthdayPerson[] }) {
  const [open, setOpen] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (people.length <= 1) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % people.length), 6000)
    return () => window.clearInterval(timer)
  }, [people.length])

  if (!people.length || !open) return null
  const person = people[index] ?? people[0]

  return (
    <aside
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:justify-end sm:p-0 md:right-6 md:bottom-6"
      aria-live="polite"
    >
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[#cfeef4] bg-white/95 shadow-[0_24px_60px_-28px_rgba(2,62,138,0.55)] backdrop-blur-md sm:w-[22rem]">
        <div className="flex items-start gap-3 bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-3 text-white">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ffcf4a] text-[#03202b]">
            <Cake aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.22em] text-[#ffcf4a] uppercase">Today’s birthday</p>
            <p className="mt-1 truncate font-heading text-lg font-semibold leading-tight">{shortName(person.name)}</p>
            {people.length > 1 ? (
              <p className="mt-1 text-xs text-white/70">
                {index + 1} of {people.length} Oblate fathers today
              </p>
            ) : (
              <p className="mt-1 text-xs text-white/70">Oblate Province of Jaffna</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Dismiss birthday notice"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          {person.image ? (
            <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#eef6f8] ring-1 ring-[#d7eef3]">
              <Image
                src={person.image}
                alt=""
                fill
                sizes="56px"
                className="object-contain object-bottom"
                unoptimized={isUpload(person.image)}
              />
            </span>
          ) : (
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#e7fbff] font-heading text-lg font-bold text-[#023e8a]">
              {shortName(person.name)
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#023e8a]">{person.name}</p>
            <Link
              href={person.href}
              className="mt-1 inline-flex text-sm font-semibold text-[#0e98ac] transition hover:text-[#023e8a]"
            >
              View profile
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
