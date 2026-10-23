"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { TimelineEntry } from "@/lib/cms"
import { cn } from "cn"

type YearJourneyProps = {
  timeline: TimelineEntry[]
  title: string
  intro: string
}

export function YearJourney({ timeline, title, intro }: YearJourneyProps) {
  const [year, setYear] = useState(timeline[timeline.length - 1]?.year ?? "")
  const railRef = useRef<HTMLDivElement>(null)
  const index = Math.max(
    0,
    timeline.findIndex((item) => item.year === year)
  )
  const current = timeline[index] ?? timeline[0]

  useLayoutEffect(() => {
    const rail = railRef.current
    const button = rail?.querySelector<HTMLElement>(`[data-year="${CSS.escape(year)}"]`)
    if (!rail || !button) return
    const left = button.offsetLeft - rail.clientWidth / 2 + button.offsetWidth / 2
    rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
  }, [year])

  useEffect(() => {
    if (!timeline.length) return
    if (!timeline.some((item) => item.year === year)) {
      setYear(timeline[timeline.length - 1]?.year ?? timeline[0].year)
    }
  }, [timeline, year])

  if (!current) return null

  const go = (next: number) => {
    const target = timeline[(next + timeline.length) % timeline.length]
    if (target) setYear(target.year)
  }

  return (
    <div className="mt-16 sm:mt-20">
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">Chronicle</p>
        <h3 className="mt-2 font-heading text-3xl font-semibold text-[#023e8a] sm:text-4xl">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#5c6b7a] sm:text-base">{intro}</p>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] text-white shadow-[0_30px_60px_-36px_rgba(3,32,43,0.85)] sm:mt-10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-[#17b3c6]/25 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-10 size-64 rounded-full bg-[#ffbf00]/10 blur-3xl"
        />

        <div className="relative border-b border-white/10 px-4 pt-6 pb-4 sm:px-8 sm:pt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#7fe3ef] uppercase">
              Milestone {index + 1} of {timeline.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous year"
                className="flex size-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next year"
                className="flex size-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <div
            ref={railRef}
            className="relative -mx-1 overflow-x-auto px-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[1.35rem] right-4 left-4 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent sm:top-[1.5rem]"
            />
            <ol className="relative flex w-max min-w-full items-start justify-between gap-3 sm:gap-4">
              {timeline.map((item, itemIndex) => {
                const selected = item.year === year
                return (
                  <li key={item.year} className="flex w-[4.75rem] shrink-0 flex-col items-center sm:w-[5.5rem]">
                    <button
                      type="button"
                      data-year={item.year}
                      onClick={() => setYear(item.year)}
                      aria-pressed={selected}
                      aria-label={`Show ${item.year}`}
                      className={cn(
                        "relative z-10 flex size-11 items-center justify-center rounded-full text-[11px] font-bold transition sm:size-12 sm:text-xs",
                        selected
                          ? "bg-[#ffcf4a] text-[#03202b] shadow-[0_0_0_6px_rgba(255,207,74,0.22)] scale-105"
                          : "bg-white/10 text-white/80 ring-1 ring-white/20 hover:bg-white/20 hover:text-white"
                      )}
                    >
                      {itemIndex + 1}
                    </button>
                    <span
                      className={cn(
                        "mt-2 max-w-full truncate text-center text-[11px] font-semibold tracking-wide sm:text-xs",
                        selected ? "text-[#ffcf4a]" : "text-white/55"
                      )}
                    >
                      {item.year}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <article
          key={current.year}
          className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-12"
        >
          <div className="history-rise">
            <p className="text-xs font-bold tracking-[0.24em] text-[#ffcf4a] uppercase">Selected year</p>
            <p className="mt-3 font-heading text-[clamp(2.75rem,10vw,5.5rem)] leading-none font-semibold tracking-tight">
              {current.year}
            </p>
            <div className="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-[#ffcf4a] to-[#17b3c6]" />
          </div>
          <div className="history-rise" style={{ "--rise-delay": "120ms" } as React.CSSProperties}>
            <p className="text-base leading-8 text-white/90 sm:text-lg sm:leading-9">{current.text}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {index > 0 ? (
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 ring-1 ring-white/15 transition hover:bg-white/15"
                >
                  ← {timeline[index - 1].year}
                </button>
              ) : null}
              {index < timeline.length - 1 ? (
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  className="rounded-full bg-[#17b3c6] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  {timeline[index + 1].year} →
                </button>
              ) : null}
            </div>
          </div>
        </article>
      </div>

    </div>
  )
}
