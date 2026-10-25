"use client"

import Link from "next/link"
import { Cake, CalendarDays, ChevronLeft, ChevronRight, Cross } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import type { Gathering, GatheringKind } from "@/lib/cms"
import { cn } from "cn"

function occurrence(event: Gathering, year: number): Gathering {
  if (!event.annual) return event
  return { ...event, year, endYear: year, endMonth: event.month, endDay: event.day }
}

function covers(event: Gathering, year: number, month: number, day: number) {
  const item = occurrence(event, year)
  const current = new Date(year, month, day).getTime()
  const start = new Date(item.year, item.month, item.day).getTime()
  const end = new Date(item.endYear, item.endMonth, item.endDay).getTime()
  return current >= start && current <= end
}

function touchesMonth(event: Gathering, year: number, month: number) {
  const item = occurrence(event, year)
  const first = new Date(year, month, 1).getTime()
  const last = new Date(year, month + 1, 0).getTime()
  const start = new Date(item.year, item.month, item.day).getTime()
  const end = new Date(item.endYear, item.endMonth, item.endDay).getTime()
  return start <= last && end >= first
}

function nextOccurrence(event: Gathering, from: Date) {
  if (!event.annual) return new Date(event.year, event.month, event.day)
  let next = new Date(from.getFullYear(), event.month, event.day)
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  if (next.getTime() < today.getTime()) next = new Date(from.getFullYear() + 1, event.month, event.day)
  return next
}

const months = [
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

const weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const weekdayLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const kindMeta: Record<GatheringKind, { label: string; dot: string; Icon: typeof Cake; tone: string }> = {
  event: { label: "Event", dot: "bg-[#17b3c6]", Icon: CalendarDays, tone: "text-[#0e98ac]" },
  birthday: { label: "Birthday", dot: "bg-[#ffbf00]", Icon: Cake, tone: "text-[#9a6b00]" },
  "death-anniversary": { label: "Anniversary", dot: "bg-[#8b5cf6]", Icon: Cross, tone: "text-[#5b21b6]" },
}

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1).getDay()
  const pad = (first + 6) % 7
  const count = new Date(year, month + 1, 0).getDate()
  const cells: Array<number | null> = [
    ...Array.from({ length: pad }, () => null),
    ...Array.from({ length: count }, (_, index) => index + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function cleanTitle(title: string) {
  return title.replace(/\s—\s(Birthday|Death anniversary)$/i, "").trim()
}

function kindRank(kind: GatheringKind) {
  if (kind === "event") return 0
  if (kind === "birthday") return 1
  return 2
}

function CompactRow({
  event,
  active,
  onSelect,
}: {
  event: Gathering
  active?: boolean
  onSelect: () => void
}) {
  const meta = kindMeta[event.kind]
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full min-w-0 items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition",
        active
          ? "border-[#17b3c6] bg-[#e7fbff]"
          : "border-[#e2f2f6] bg-white/70 hover:border-[#90e0ef] hover:bg-white"
      )}
    >
      <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-[#023e8a]">{cleanTitle(event.title)}</span>
        <span className={cn("text-[10px] font-bold tracking-wide uppercase", meta.tone)}>
          {meta.label} · {event.dateLabel}
        </span>
      </span>
      <span className="shrink-0 text-xs font-bold text-[#17b3c6]">{String(event.day).padStart(2, "0")}</span>
    </button>
  )
}

export function ProvinceCalendar({ events: entries }: { events: Gathering[] }) {
  const [today, setToday] = useState<Date | null>(null)
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(9)
  const [day, setDay] = useState(11)
  const [openedId, setOpenedId] = useState<string | null>(null)
  const [listTab, setListTab] = useState<"month" | "upcoming" | "past">("month")

  useEffect(() => {
    const now = new Date()
    setToday(now)
    setYear(now.getFullYear())
    setMonth(now.getMonth())
    setDay(now.getDate())
  }, [])

  const cells = monthCells(year, month)
  const chosen = new Date(year, month, day)

  function shiftMonth(step: number) {
    const next = new Date(year, month + step, 1)
    const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
    setYear(next.getFullYear())
    setMonth(next.getMonth())
    setDay((current) => Math.min(current, last))
    setOpenedId(null)
  }

  const isToday = (date: number) =>
    Boolean(today && date === today.getDate() && month === today.getMonth() && year === today.getFullYear())

  const dayEvents = useMemo(
    () =>
      entries
        .filter((event) => covers(event, year, month, day))
        .sort((a, b) => kindRank(a.kind) - kindRank(b.kind) || a.title.localeCompare(b.title)),
    [entries, year, month, day]
  )

  const monthEvents = useMemo(
    () =>
      entries
        .filter((event) => touchesMonth(event, year, month))
        .sort(
          (a, b) =>
            kindRank(a.kind) - kindRank(b.kind) || a.day - b.day || a.title.localeCompare(b.title)
        ),
    [entries, year, month]
  )

  const labelDate = (when: Date) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(when)

  const upcoming = useMemo(() => {
    if (!today) return [] as Gathering[]
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const mapped = entries
      .map((event) => ({ event, when: nextOccurrence(event, today) }))
      .filter(({ when }) => when.getTime() >= start.getTime())
      .sort((a, b) => kindRank(a.event.kind) - kindRank(b.event.kind) || a.when.getTime() - b.when.getTime())

    const provinceEvents = mapped.filter(({ event }) => event.kind === "event").slice(0, 6)
    const others = mapped.filter(({ event }) => event.kind !== "event").slice(0, 6)
    return [...provinceEvents, ...others].slice(0, 8).map(({ event, when }) => ({
      ...occurrence(event, when.getFullYear()),
      dateLabel: labelDate(when),
    }))
  }, [entries, today])

  const past = useMemo(() => {
    if (!today) return [] as Gathering[]
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const rows: { event: Gathering; when: Date }[] = []

    for (const event of entries) {
      if (!event.annual) {
        const end = new Date(event.endYear, event.endMonth, event.endDay).getTime()
        if (end < startOfToday) {
          rows.push({ event, when: new Date(event.year, event.month, event.day) })
        }
        continue
      }
      const thisYear = new Date(today.getFullYear(), event.month, event.day)
      if (thisYear.getTime() < startOfToday) {
        rows.push({ event: occurrence(event, today.getFullYear()), when: thisYear })
      } else {
        rows.push({
          event: occurrence(event, today.getFullYear() - 1),
          when: new Date(today.getFullYear() - 1, event.month, event.day),
        })
      }
    }

    rows.sort((a, b) => kindRank(a.event.kind) - kindRank(b.event.kind) || b.when.getTime() - a.when.getTime())
    const provinceEvents = rows.filter(({ event }) => event.kind === "event").slice(0, 6)
    const others = rows.filter(({ event }) => event.kind !== "event").slice(0, 6)
    return [...provinceEvents, ...others].slice(0, 8).map(({ event, when }) => ({
      ...event,
      dateLabel: labelDate(when),
      day: when.getDate(),
      month: when.getMonth(),
      year: when.getFullYear(),
      endDay: when.getDate(),
      endMonth: when.getMonth(),
      endYear: when.getFullYear(),
    }))
  }, [entries, today])

  const opened = entries.find((event) => event.id === openedId) ?? dayEvents[0] ?? null
  const listItems =
    listTab === "month" ? monthEvents.slice(0, 8) : listTab === "upcoming" ? upcoming : past
  const listEmptyCopy =
    listTab === "month"
      ? "Nothing in this month yet."
      : listTab === "upcoming"
        ? "No upcoming items yet."
        : "No past items yet."

  const monthCounts = {
    event: monthEvents.filter((item) => item.kind === "event").length,
    birthday: monthEvents.filter((item) => item.kind === "birthday").length,
    death: monthEvents.filter((item) => item.kind === "death-anniversary").length,
  }

  return (
    <section id="calendar" className="calendar-stage relative scroll-mt-80 px-4 py-12 sm:px-8 sm:py-16">
      <div className="relative mx-auto max-w-5xl">
        <Reveal from="up" className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">Province calendar</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-[#023e8a] sm:text-4xl">
              Events, birthdays &amp; remembrances
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-[#5c6b7a]">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#17b3c6]" /> Event
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#ffbf00]" /> Birthday
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#8b5cf6]" /> Anniversary
            </span>
          </div>
        </Reveal>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(16.5rem,0.85fr)] lg:gap-5">
          <Reveal from="left" className="calendar-glass overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between gap-3 border-b border-[#d7eef3]/80 px-4 py-3.5 sm:px-5">
              <div className="min-w-0">
                <p className="font-heading text-2xl font-bold text-[#023e8a] sm:text-3xl">
                  {months[month]} <span className="text-[#17b3c6]">{year}</span>
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className="grid size-9 place-items-center rounded-full bg-white/80 text-[#023e8a] ring-1 ring-[#90e0ef]/70 transition hover:bg-[#17b3c6] hover:text-white"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className="grid size-9 place-items-center rounded-full bg-white/80 text-[#023e8a] ring-1 ring-[#90e0ef]/70 transition hover:bg-[#17b3c6] hover:text-white"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="px-3 py-3 sm:px-4 sm:py-4">
              <div className="mb-1.5 grid grid-cols-7">
                {weekday.map((name) => (
                  <div key={name} className="py-1.5 text-center text-[10px] font-bold tracking-wider text-[#0e98ac] uppercase">
                    {name}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {cells.map((date, index) => {
                  if (!date) return <div key={`e-${index}`} className="h-10 sm:h-11" />
                  const marks = entries.filter((event) => covers(event, year, month, date))
                  const selected = date === day
                  const todayCell = isToday(date)
                  const kinds = (["event", "birthday", "death-anniversary"] as GatheringKind[]).filter((kind) =>
                    marks.some((mark) => mark.kind === kind)
                  )
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => {
                        setDay(date)
                        setOpenedId(marks[0]?.id ?? null)
                      }}
                      aria-pressed={selected}
                      className={cn(
                        "calendar-day relative flex h-10 flex-col items-center justify-center rounded-xl sm:h-11",
                        selected
                          ? "calendar-day-selected"
                          : todayCell
                            ? "calendar-day-today"
                            : marks.length
                              ? "calendar-day-marked"
                              : "calendar-day-idle"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-bold",
                          selected ? "text-white" : todayCell ? "text-[#0e98ac]" : "text-[#023e8a]"
                        )}
                      >
                        {date}
                      </span>
                      {kinds.length ? (
                        <span className="absolute bottom-1 flex gap-0.5">
                          {kinds.map((kind) => (
                            <span
                              key={kind}
                              className={cn("size-1 rounded-full", selected ? "bg-white/90" : kindMeta[kind].dot)}
                            />
                          ))}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-center text-[11px] text-[#5c6b7a]">
                {monthCounts.event} events · {monthCounts.birthday} birthdays · {monthCounts.death} anniversaries
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal from="right" className="calendar-glass-deep flex h-[9.75rem] flex-col rounded-3xl p-4">
              <p className="shrink-0 text-[10px] font-bold tracking-[0.18em] text-[#7fe3ef] uppercase">Selected day</p>
              <div className="mt-2 flex shrink-0 items-end gap-3">
                <p className="font-heading text-4xl leading-none font-extrabold text-white">{day}</p>
                <div className="min-w-0 pb-0.5">
                  <p className="truncate text-sm font-semibold text-white">
                    {weekdayLong[(chosen.getDay() + 6) % 7]}
                  </p>
                  <p className="text-xs text-white/65">
                    {months[month]} {year}
                  </p>
                </div>
              </div>
              <div className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto border-t border-white/15 pt-3">
                {dayEvents.length === 0 ? (
                  <p className="text-xs leading-5 text-white/70">Nothing listed for this day.</p>
                ) : (
                  dayEvents.slice(0, 5).map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setOpenedId(event.id)}
                      className="flex w-full min-w-0 items-center gap-2 rounded-lg bg-white/10 px-2.5 py-1.5 text-left hover:bg-white/15"
                    >
                      <span className={cn("size-1.5 shrink-0 rounded-full", kindMeta[event.kind].dot)} />
                      <span className="truncate text-xs font-semibold text-white">{cleanTitle(event.title)}</span>
                    </button>
                  ))
                )}
              </div>
            </Reveal>

            <Reveal from="right" delay={80} className="calendar-glass flex h-[22.5rem] flex-col rounded-3xl p-4">
              <div className="flex shrink-0 items-center justify-between gap-2">
                <div className="inline-flex max-w-full flex-wrap rounded-full bg-[#e7fbff] p-0.5 ring-1 ring-[#90e0ef]/60">
                  {(
                    [
                      ["month", "Month"],
                      ["upcoming", "Upcoming"],
                      ["past", "Past"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setListTab(id)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase transition sm:px-3 sm:text-[11px]",
                        listTab === id ? "bg-[#17b3c6] text-white" : "text-[#023e8a]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#5c6b7a]">{listItems.length}</span>
              </div>

              <ul className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
                {listItems.length === 0 ? (
                  <li className="flex h-full items-center justify-center py-3 text-center text-xs text-[#5c6b7a]">
                    {listEmptyCopy}
                  </li>
                ) : (
                  listItems.map((event) => (
                    <li key={`${listTab}-${event.id}-${event.year}-${event.month}-${event.day}`}>
                      <CompactRow
                        event={event}
                        active={opened?.id === event.id}
                        onSelect={() => {
                          setYear(event.year)
                          setMonth(event.month)
                          setDay(event.day)
                          setOpenedId(event.id)
                        }}
                      />
                    </li>
                  ))
                )}
              </ul>

              <p className="mt-2 h-4 shrink-0 text-center text-[11px] font-semibold text-[#0e98ac]">
                {listTab === "month" && monthEvents.length > 8
                  ? `+${monthEvents.length - 8} more this month`
                  : "\u00a0"}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal from="up" delay={60} className="calendar-glass mt-4 min-h-[6.5rem] rounded-3xl px-4 py-4 sm:px-5">
          {opened ? (
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className={cn("text-[10px] font-bold tracking-[0.16em] uppercase", kindMeta[opened.kind].tone)}>
                  {kindMeta[opened.kind].label} · {opened.dateLabel}
                </p>
                <h3 className="mt-1 truncate font-heading text-xl font-semibold text-[#023e8a]">
                  {cleanTitle(opened.title)}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-[#5c6b7a]">{opened.summary || opened.place}</p>
              </div>
              {opened.href ? (
                <Link
                  href={opened.href}
                  className="shrink-0 rounded-full bg-[#17b3c6] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0e98ac]"
                >
                  Open
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-[#5c6b7a]">Select a day or list item to see details here.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
