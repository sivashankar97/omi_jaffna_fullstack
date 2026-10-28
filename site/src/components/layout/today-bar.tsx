"use client"

import Link from "next/link"
import { Cake, CalendarDays, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react"
import { useEffect, useState, useSyncExternalStore } from "react"

import type { TodayHighlight } from "@/lib/cms"

const STORAGE_KEY = "omi-today-dismissed"
const TIME_ZONE = "Asia/Colombo"

const ICONS = { birthday: Cake, event: CalendarDays, ceremony: Sparkles } as const
const LABELS = { birthday: "Birthday", event: "Event", ceremony: "Feast" } as const

function todayStamp() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date())
}

const listeners = new Set<() => void>()
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
function dismissedToday() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === todayStamp()
  } catch {
    return false
  }
}

export function TodayBar({ items }: { items: TodayHighlight[] }) {
  const dismissed = useSyncExternalStore(subscribe, dismissedToday, () => false)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (items.length <= 1 || paused) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 5000)
    return () => window.clearInterval(timer)
  }, [items.length, paused])

  if (!items.length || dismissed) return null

  const item = items[index % items.length]
  const Icon = ICONS[item.kind]
  const dateLabel = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short" }).format(
    new Date()
  )
  const step = (delta: number) => setIndex((current) => (current + delta + items.length) % items.length)
  const dismiss = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, todayStamp())
    } catch {}
    listeners.forEach((listener) => listener())
  }

  return (
    <div
      role="region"
      aria-label="Today in the Province"
      className="relative bg-gradient-to-r from-[#03202b] via-[#06394a] to-[#0a5062] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-2 px-3 text-[12px] sm:gap-3 sm:px-5 sm:text-[13px]">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#ffcf4a] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#03202b] uppercase sm:text-[11px]">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#03202b]/60 motion-reduce:hidden" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#03202b]" />
          </span>
          Today<span className="hidden font-semibold tracking-normal normal-case min-[400px]:inline"> · {dateLabel}</span>
        </span>

        <Link
          key={item.id}
          href={item.href}
          aria-live="polite"
          className="today-bar-item group flex min-w-0 flex-1 items-center gap-2 rounded-full py-1 pr-2 transition hover:text-[#ffcf4a]"
        >
          <Icon aria-hidden="true" className="size-4 shrink-0 text-[#ffcf4a]" />
          <span className="hidden shrink-0 text-[11px] font-semibold tracking-wide text-white/60 uppercase sm:inline">
            {LABELS[item.kind]}
          </span>
          <span className="truncate font-semibold">{item.title}</span>
          {item.detail && item.kind !== "birthday" ? (
            <span className="hidden truncate text-white/65 md:inline">· {item.detail}</span>
          ) : null}
        </Link>

        {items.length > 1 ? (
          <span className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous"
              className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="min-w-[2.25rem] text-center text-[11px] font-semibold text-white/70 tabular-nums">
              {(index % items.length) + 1}/{items.length}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next"
              className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </span>
        ) : null}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide today's highlights"
          className="shrink-0 rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
