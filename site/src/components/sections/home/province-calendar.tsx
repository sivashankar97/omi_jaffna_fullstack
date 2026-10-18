"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import type { Gathering } from "@/lib/cms"
import { cn } from "cn"

function covers(event: Gathering, year: number, month: number, day: number) {
  const current = new Date(year, month, day).getTime()
  const start = new Date(event.year, event.month, event.day).getTime()
  const end = new Date(event.endYear, event.endMonth, event.endDay).getTime()
  return current >= start && current <= end
}

function touchesMonth(event: Gathering, year: number, month: number) {
  const first = new Date(year, month, 1).getTime()
  const last = new Date(year, month + 1, 0).getTime()
  const start = new Date(event.year, event.month, event.day).getTime()
  const end = new Date(event.endYear, event.endMonth, event.endDay).getTime()
  return start <= last && end >= first
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

const LOOP_SPEED = 0.35

function UpcomingLoop({
  events,
  openedId,
  onToggle,
}: {
  events: Gathering[]
  openedId: string | null
  onToggle: (id: string | null) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let offset = 0
    let frame = 0
    const step = () => {
      if (!pausedRef.current) {
        offset += LOOP_SPEED
        const first = track.children[0] as HTMLElement
        const copy = track.children[events.length] as HTMLElement | undefined
        const loopStart = copy ? copy.offsetTop - first.offsetTop : 0
        if (loopStart > 0 && offset >= loopStart) offset -= loopStart
        track.style.transform = `translate3d(0, ${-offset}px, 0)`
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [events.length])

  const pause = () => {
    pausedRef.current = true
  }
  const resume = () => {
    pausedRef.current = false
  }

  return (
    <div
      className="relative h-64 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div ref={trackRef} className="flex flex-col gap-2 py-2 will-change-transform">
        {[...events, ...events].map((event, index) => {
          const copy = index >= events.length
          const on = event.id === openedId
          return (
            <button
              key={`${event.id}-${index}`}
              type="button"
              aria-hidden={copy || undefined}
              tabIndex={copy ? -1 : undefined}
              aria-expanded={copy ? undefined : on}
              onClick={() => onToggle(on ? null : event.id)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors",
                on ? "border-[#17b3c6] bg-[#17b3c6] text-white" : "border-white/40 text-white hover:border-[#17b3c6]"
              )}
            >
              <span className="font-semibold">{event.title}</span>
              <span className="shrink-0 text-xs text-white/75">{event.dateLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ProvinceCalendar({ events: recentGatherings }: { events: Gathering[] }) {
  const [today, setToday] = useState<Date | null>(null)
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(9)
  const [day, setDay] = useState(11)
  const [openedId, setOpenedId] = useState<string | null>(null)

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
  }

  const isToday = (date: number) =>
    Boolean(today && date === today.getDate() && month === today.getMonth() && year === today.getFullYear())

  const dayEvent = recentGatherings.find((event) => covers(event, year, month, day)) ?? null
  const monthEvents = recentGatherings.filter((event) => touchesMonth(event, year, month))
  const opened = recentGatherings.find((event) => event.id === openedId) ?? null
  const upcoming = recentGatherings
    .filter((event) => {
      if (!today) return false
      const end = new Date(event.endYear, event.endMonth, event.endDay).getTime()
      const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      return end >= current
    })
    .sort(
      (left, right) =>
        new Date(left.year, left.month, left.day).getTime() -
        new Date(right.year, right.month, right.day).getTime()
    )
  const dayMark = (() => {
    if (!dayEvent || !today) return null
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const start = new Date(dayEvent.year, dayEvent.month, dayEvent.day).getTime()
    const end = new Date(dayEvent.endYear, dayEvent.endMonth, dayEvent.endDay).getTime()
    if (end < current) return "Past"
    if (start > current) return "Upcoming"
    return "Today"
  })()

  return (
    <section
      id="calendar"
      className="relative scroll-mt-80 overflow-hidden bg-[#071a21] px-4 py-24 text-white sm:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-[18%] size-40 rounded-full blur-2xl motion-safe:animate-[float-a_9s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, #fff1b8 0%, #ffcf4a 45%, transparent 72%)", opacity: 0.9 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[22%] -right-40 size-[30rem] rounded-full blur-3xl motion-safe:animate-[float-b_12s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, #b8f3f9 0%, #17b3c6 45%, transparent 72%)", opacity: 0.75 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 size-[34rem] rounded-full blur-3xl motion-safe:animate-[float-a_14s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, #7fe3ef 0%, #0f9fb4 50%, transparent 74%)", opacity: 0.7 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(rgb(255 255 255 / 0.9) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal from="left">
              <p className="max-w-[15rem] text-sm leading-5 text-[#7fe3ef]">
                Gatherings, feasts and celebrations of the Oblate Province of Jaffna
              </p>
            </Reveal>
            <Reveal from="right" delay={120} className="text-right">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className="grid size-9 place-items-center rounded-full border border-white/30 text-white/80 transition hover:border-[#17b3c6] hover:bg-[#17b3c6] hover:text-white"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className="grid size-9 place-items-center rounded-full border border-white/30 text-white/80 transition hover:border-[#17b3c6] hover:bg-[#17b3c6] hover:text-white"
                >
                  <ChevronRight className="size-4" />
                </button>
                <p className="ml-2 font-heading text-3xl font-bold leading-none">{year}</p>
              </div>
              <h2
                key={`${year}-${month}`}
                className="font-heading text-6xl leading-[0.9] font-extrabold tracking-tight lowercase motion-safe:animate-[title-sweep_0.7s_ease_both] sm:text-8xl"
              >
                {months[month]}
              </h2>
            </Reveal>
          </div>

          <Reveal from="zoom" delay={200} className="mt-8 overflow-hidden rounded-2xl border border-white/70 bg-[#071a21]/40 backdrop-blur-sm">
            <div className="grid grid-cols-7 rounded-2xl border-b border-white/70 py-3">
              {weekday.map((name) => (
                <span key={name} className="text-center text-base font-bold text-[#7fe3ef] sm:text-lg">
                  {name}
                </span>
              ))}
            </div>
            <div key={`${year}-${month}`} className="grid grid-cols-7 gap-y-2 px-2 py-5 sm:px-4">
              {cells.map((date, index) => {
                if (!date) return <span key={`empty-${index}`} className="h-11" />
                const marked = recentGatherings.find((event) => covers(event, year, month, date))
                const pressed = date === day
                return (
                  <span
                    key={date}
                    className="grid motion-safe:animate-[media-in_0.45s_ease_both]"
                    style={{ animationDelay: `${index * 18}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => setDay(date)}
                      aria-pressed={pressed}
                      aria-label={`${date} ${months[month]} ${year}`}
                      className={cn(
                        "relative mx-auto grid size-11 place-items-center rounded-xl border text-sm font-semibold transition hover:scale-110 sm:text-base",
                        pressed
                          ? "border-[#17b3c6] bg-[#17b3c6] font-bold text-white shadow-[0_0_24px_rgb(23_179_198/0.55)]"
                          : marked
                            ? "border-[#7fe3ef] text-white"
                            : "border-transparent text-white/85 hover:border-white/40",
                        isToday(date) && !pressed && "border-[#ffcf4a] text-[#ffcf4a]"
                      )}
                    >
                      {date}
                      {marked && !pressed ? (
                        <span className="absolute bottom-1 size-1 rounded-full bg-[#7fe3ef]" aria-hidden="true" />
                      ) : null}
                    </button>
                  </span>
                )
              })}
            </div>
          </Reveal>

          <Reveal from="up" delay={350} className="mt-6 flex flex-wrap gap-3">
            {monthEvents.length === 0 ? (
              <p className="rounded-xl border border-white/40 px-5 py-2.5 text-sm text-white/70">
                No gatherings listed for {months[month]}
              </p>
            ) : (
              monthEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    setDay(event.year === year && event.month === month ? event.day : 1)
                    setOpenedId(event.id)
                  }}
                  className="flex items-center gap-4 rounded-xl border border-white/70 px-5 py-2.5 text-sm transition hover:border-[#17b3c6] hover:bg-[#17b3c6]/15"
                >
                  <span className="font-bold text-[#7fe3ef]">
                    {event.year === year && event.month === month ? event.day : 1}
                  </span>
                  <span className="text-white">{event.title}</span>
                </button>
              ))
            )}
          </Reveal>
        </div>

        <div className="grid gap-5">
          <Reveal from="right" delay={250} className="rounded-3xl border border-white/25 bg-white/[0.06] p-6 backdrop-blur-md">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#7fe3ef] uppercase">Province day</p>
            <div key={`${year}-${month}-${day}`} className="mt-4 flex items-end gap-4 motion-safe:animate-[media-in_0.4s_ease_both]">
              <p className="font-heading text-7xl leading-none font-extrabold">{day}</p>
              <div className="pb-1">
                <p className="text-lg font-bold">{weekdayLong[(chosen.getDay() + 6) % 7]}</p>
                <p className="text-sm text-white/70">
                  {months[month]} {year}
                </p>
              </div>
            </div>
            <div className="mt-5 border-t border-dashed border-white/25 pt-5">
              {dayEvent ? (
                <>
                  <p className="text-xs font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">{dayMark}</p>
                  <p className="mt-2 text-lg leading-6 font-bold">{dayEvent.title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/75">{dayEvent.place}</p>
                </>
              ) : (
                <p className="text-sm leading-6 text-white/75">
                  {isToday(day) ? "This is today. " : ""}
                  The Province office has not published a schedule for this day. Gatherings appear here only after they are confirmed.
                </p>
              )}
            </div>
          </Reveal>

          <Reveal from="right" delay={400} className="rounded-3xl border border-white/25 bg-white/[0.06] p-6 backdrop-blur-md">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#7fe3ef] uppercase">Upcoming events</p>
            <div className="mt-4 grid gap-2">
              {today && upcoming.length === 0 ? (
                <p className="text-sm text-white/70">No upcoming gatherings are listed yet.</p>
              ) : null}
              {upcoming.length > 0 ? (
                <UpcomingLoop events={upcoming} openedId={openedId} onToggle={setOpenedId} />
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>

      {opened ? (
        <article
          key={opened.id}
          className="relative mx-auto mt-8 max-w-6xl rounded-3xl border border-white/25 bg-white/[0.07] p-6 backdrop-blur-md motion-safe:animate-[media-panel_0.5s_ease_both] sm:p-8"
        >
          <p className="text-xs font-bold tracking-[0.22em] text-[#7fe3ef] uppercase">{opened.dateLabel}</p>
          <h3 className="mt-3 font-heading text-3xl font-extrabold sm:text-4xl">{opened.title}</h3>
          <p className="mt-2 text-base font-semibold text-white/80">{opened.place}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/85">{opened.summary}</p>
        </article>
      ) : null}
    </section>
  )
}
