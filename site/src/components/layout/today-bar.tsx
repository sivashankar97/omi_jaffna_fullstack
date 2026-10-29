"use client"

import Link from "next/link"
import { Cake, CalendarDays, Sparkles, X } from "lucide-react"
import { useSyncExternalStore } from "react"

import type { TodayHighlight } from "@/lib/cms"

const STORAGE_KEY = "omi-today-dismissed"
const TIME_ZONE = "Asia/Colombo"
/** Ticker speed: seconds per highlight, with a floor so a single short item does not race past. */
const SECONDS_PER_ITEM = 7
const MIN_LOOP_SECONDS = 18

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

function TickerItems({ items, copy }: { items: TodayHighlight[]; copy: number }) {
  return (
    <ul aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item) => {
        const Icon = ICONS[item.kind]
        return (
          <li key={`${copy}-${item.id}`} className="shrink-0">
            <Link
              href={item.href}
              tabIndex={copy > 0 ? -1 : undefined}
              className="flex items-center gap-2 whitespace-nowrap transition hover:text-[#ffcf4a]"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0 text-[#ffcf4a]" />
              <span className="text-[11px] font-semibold tracking-wide text-white/60 uppercase">{LABELS[item.kind]}</span>
              <span className="font-semibold">{item.title}</span>
              {item.detail ? <span className="text-white/65">· {item.detail}</span> : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function TodayBar({ items }: { items: TodayHighlight[] }) {
  const dismissed = useSyncExternalStore(subscribe, dismissedToday, () => false)

  if (!items.length || dismissed) return null

  const dateLabel = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short" }).format(
    new Date()
  )
  const loopSeconds = Math.max(MIN_LOOP_SECONDS, items.length * SECONDS_PER_ITEM)
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
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-2 px-3 text-[12px] sm:gap-3 sm:px-5 sm:text-[13px]">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#ffcf4a] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#03202b] uppercase sm:text-[11px]">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#03202b]/60 motion-reduce:hidden" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#03202b]" />
          </span>
          Today<span className="hidden font-semibold tracking-normal normal-case min-[400px]:inline"> · {dateLabel}</span>
          {items.length > 1 ? (
            <span className="rounded-full bg-[#03202b] px-1.5 text-[10px] tracking-normal text-[#ffcf4a] tabular-nums">
              {items.length}
            </span>
          ) : null}
        </span>

        <div className="today-ticker relative min-w-0 flex-1 overflow-hidden">
          <div className="today-ticker-track flex w-max" style={{ animationDuration: `${loopSeconds}s` }}>
            <TickerItems items={items} copy={0} />
            <TickerItems items={items} copy={1} />
          </div>
        </div>

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
