"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarHeart, ChevronLeft, ChevronRight } from "lucide-react"

import type { newsPageDefaults } from "@/content/blocks"
import { cn } from "cn"

type Copy = typeof newsPageDefaults.ceremonies
type Ceremony = Copy["items"][number]

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const TONES = [
  { dot: "bg-[#17b3c6]", chip: "bg-[#e7fbff] text-[#0a5062] ring-[#cfeef4]" },
  { dot: "bg-[#e0a800]", chip: "bg-[#fff6d6] text-[#7a5600] ring-[#f4e2a1]" },
  { dot: "bg-[#c2410c]", chip: "bg-[#fff0e8] text-[#8a2f0a] ring-[#f6d3c2]" },
  { dot: "bg-[#023e8a]", chip: "bg-[#e8f0fb] text-[#023e8a] ring-[#cbdcf2]" },
  { dot: "bg-[#7c3aed]", chip: "bg-[#f3edff] text-[#5b21b6] ring-[#ddd0fb]" },
]

const key = (month: number, day: number) => `${month}-${day}`
const dateLabel = (item: Ceremony) => `${MONTHS[item.month - 1]} ${item.day}`

function valid(item: Ceremony) {
  const month = Number(item?.month)
  const day = Number(item?.day)
  return !!item?.title?.trim() && month >= 1 && month <= 12 && day >= 1 && day <= 31
}

function daysUntil(item: Ceremony, today: Date) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let next = new Date(today.getFullYear(), item.month - 1, item.day)
  if (next < start) next = new Date(today.getFullYear() + 1, item.month - 1, item.day)
  return Math.round((next.getTime() - start.getTime()) / 86_400_000)
}

export function OmiCeremonies({ copy }: { copy: Copy }) {
  const items = useMemo(
    () =>
      (copy.items ?? [])
        .filter(valid)
        .map((item) => ({ ...item, month: Number(item.month), day: Number(item.day) }))
        .sort((a, b) => a.month - b.month || a.day - b.day),
    [copy.items]
  )
  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category?.trim() || "Ceremonies"))],
    [items]
  )
  const tone = (item: Ceremony) => TONES[categories.indexOf(item.category?.trim() || "Ceremonies") % TONES.length]
  const byDay = useMemo(() => {
    const map = new Map<string, Ceremony[]>()
    for (const item of items) map.set(key(item.month, item.day), [...(map.get(key(item.month, item.day)) ?? []), item])
    return map
  }, [items])

  const [today, setToday] = useState<Date | null>(null)
  const [view, setView] = useState({ year: 2026, month: 1 })
  const [selected, setSelected] = useState<string>("")

  useEffect(() => {
    const now = new Date()
    setToday(now)
    const upcoming = [...items].sort((a, b) => daysUntil(a, now) - daysUntil(b, now))[0]
    setView({ year: now.getFullYear(), month: upcoming ? upcoming.month : now.getMonth() + 1 })
    if (upcoming) setSelected(key(upcoming.month, upcoming.day))
  }, [items])

  if (!items.length) return null

  const next = today ? [...items].sort((a, b) => daysUntil(a, today) - daysUntil(b, today))[0] : null
  const firstWeekday = new Date(view.year, view.month - 1, 1).getDay()
  const daysInMonth = new Date(view.year, view.month, 0).getDate()
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const monthItems = items.filter((item) => item.month === view.month)
  const shown = selected ? (byDay.get(selected) ?? []) : []

  function shift(delta: number) {
    setSelected("")
    setView(({ year, month }) => {
      const index = year * 12 + (month - 1) + delta
      return { year: Math.floor(index / 12), month: (index % 12) + 1 }
    })
  }

  function open(item: Ceremony) {
    setView((current) => ({ year: current.year, month: item.month }))
    setSelected(key(item.month, item.day))
    document.getElementById("omi-ceremonies-calendar")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <section id="omi-ceremonies" className="scroll-mt-80 px-4 pb-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">{copy.kicker}</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-[#023e8a] sm:text-4xl">{copy.title}</h2>
            {copy.summary ? <p className="mt-3 text-sm leading-7 text-[#5c6b7a] sm:text-base">{copy.summary}</p> : null}
          </div>
          {next && today ? (
            <button
              type="button"
              onClick={() => open(next)}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#06394a] to-[#0a5062] px-5 py-3 text-left text-white shadow-[0_18px_36px_-22px_rgba(2,62,138,0.7)] transition hover:-translate-y-0.5"
            >
              <CalendarHeart aria-hidden className="size-6 shrink-0 text-[#ffcf4a]" />
              <span>
                <span className="block text-[11px] font-semibold tracking-[0.18em] text-white/65 uppercase">
                  {daysUntil(next, today) === 0 ? "Today" : `Next · in ${daysUntil(next, today)} days`}
                </span>
                <span className="block font-heading text-base font-semibold">
                  {dateLabel(next)} — {next.title}
                </span>
              </span>
            </button>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div
            id="omi-ceremonies-calendar"
            className="rounded-[1.75rem] bg-white p-5 shadow-[0_24px_48px_-32px_rgba(2,62,138,0.35)] ring-1 ring-[#d7eef3] sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label="Previous month"
                className="grid size-10 place-items-center rounded-full bg-[#eef7fa] text-[#023e8a] transition hover:bg-[#17b3c6] hover:text-white"
              >
                <ChevronLeft className="size-5" />
              </button>
              <h3 className="font-heading text-xl font-semibold text-[#023e8a] sm:text-2xl" aria-live="polite">
                {MONTHS[view.month - 1]} {view.year}
              </h3>
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="Next month"
                className="grid size-10 place-items-center rounded-full bg-[#eef7fa] text-[#023e8a] transition hover:bg-[#17b3c6] hover:text-white"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-wide text-[#6b7a88] uppercase">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {cells.map((day, index) => {
                if (!day) return <span key={`blank-${index}`} />
                const dayKey = key(view.month, day)
                const list = byDay.get(dayKey) ?? []
                const isToday =
                  !!today &&
                  today.getFullYear() === view.year &&
                  today.getMonth() + 1 === view.month &&
                  today.getDate() === day
                const isSelected = selected === dayKey
                return (
                  <button
                    key={dayKey}
                    type="button"
                    disabled={!list.length}
                    onClick={() => setSelected(dayKey)}
                    aria-pressed={isSelected}
                    aria-label={list.length ? `${MONTHS[view.month - 1]} ${day}: ${list.map((c) => c.title).join(", ")}` : undefined}
                    className={cn(
                      "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition",
                      list.length
                        ? isSelected
                          ? "bg-[#17b3c6] font-bold text-white shadow-[0_10px_22px_-12px_rgba(14,152,172,0.9)]"
                          : "bg-[#e7fbff] font-semibold text-[#023e8a] ring-1 ring-[#cfeef4] hover:bg-[#d3f4fa]"
                        : "text-[#8a98a6]",
                      isToday && !isSelected && "ring-2 ring-[#ffcf4a]"
                    )}
                  >
                    {day}
                    {list.length ? (
                      <span className="absolute bottom-1.5 flex gap-0.5">
                        {list.slice(0, 3).map((item, i) => (
                          <span key={i} className={cn("size-1.5 rounded-full", isSelected ? "bg-white" : tone(item).dot)} />
                        ))}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>

            <div className="mt-5 min-h-24 rounded-2xl bg-[#f7fbfd] p-4 ring-1 ring-[#e3f1f5]">
              {shown.length ? (
                <ul className="space-y-3">
                  {shown.map((item) => (
                    <li key={item.title}>
                      <p className="text-xs font-semibold tracking-[0.16em] text-[#0e98ac] uppercase">
                        {dateLabel(item)}
                        {item.since ? ` · since ${item.since}` : ""}
                      </p>
                      <p className="mt-1 font-heading text-lg font-semibold text-[#023e8a]">{item.title}</p>
                      {item.description ? <p className="mt-1 text-sm leading-6 text-[#5c6b7a]">{item.description}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-6 text-[#6b7a88]">
                  {monthItems.length
                    ? `${monthItems.length} ${monthItems.length === 1 ? "ceremony" : "ceremonies"} in ${MONTHS[view.month - 1]}. Choose a highlighted date.`
                    : `No OMI ceremony in ${MONTHS[view.month - 1]}. Use the arrows to see other months.`}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {categories.map((category) => {
              const list = items.filter((item) => (item.category?.trim() || "Ceremonies") === category)
              return (
                <div key={category}>
                  <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-[#023e8a]">
                    <span aria-hidden className={cn("size-2.5 rounded-full", tone(list[0]).dot)} />
                    {category}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {list.map((item) => {
                      const active = selected === key(item.month, item.day) && view.month === item.month
                      return (
                        <li key={`${item.month}-${item.day}-${item.title}`}>
                          <button
                            type="button"
                            onClick={() => open(item)}
                            className={cn(
                              "flex w-full items-start gap-4 rounded-2xl bg-white p-3.5 text-left ring-1 transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px_rgba(14,152,172,0.45)]",
                              active ? "ring-2 ring-[#17b3c6]" : "ring-[#dfeaf0]"
                            )}
                          >
                            <span
                              className={cn(
                                "flex w-14 shrink-0 flex-col items-center rounded-xl py-1.5 ring-1",
                                tone(item).chip
                              )}
                            >
                              <span className="text-[10px] font-bold tracking-wider uppercase">
                                {MONTHS[item.month - 1].slice(0, 3)}
                              </span>
                              <span className="font-heading text-xl leading-none font-semibold">{item.day}</span>
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm leading-6 font-semibold text-[#102a43]">
                                {item.title}
                                {item.since ? <span className="font-normal text-[#6b7a88]"> ({item.since})</span> : null}
                              </span>
                              {item.description ? (
                                <span className="block text-xs leading-5 text-[#5c6b7a]">{item.description}</span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
