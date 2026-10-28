"use client"

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import type { JourneyEra } from "@/content/journey"
import { cn } from "cn"

/** Full auto timeline — keeps stepping through every stop in a loop. */
const INTERVAL = 3200

export function JourneyPath({ eras: journeyEras }: { eras: readonly JourneyEra[] }) {
  const { stops, eraStart } = useMemo(() => {
    const stops = journeyEras.flatMap((era) => era.years.map((year) => ({ ...year, era })))
    return { stops, eraStart: journeyEras.map((era) => stops.findIndex((stop) => stop.era === era)) }
  }, [journeyEras])
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [offset, setOffset] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)

  const current = stops[active]

  // Continuous auto-move (does not pause on hover — only via Play/Pause or reduced-motion).
  useEffect(() => {
    if (!playing || stops.length < 2) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % stops.length)
    }, INTERVAL)
    return () => window.clearInterval(id)
  }, [playing, stops.length])

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current
      const track = trackRef.current
      const column = track?.children[active] as HTMLElement | undefined
      if (!viewport || !track || !column) return
      const max = Math.max(track.scrollWidth - viewport.clientWidth, 0)
      const target = column.offsetLeft - viewport.clientWidth * 0.18
      setOffset(Math.min(Math.max(target, 0), max))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [active])

  const go = (index: number) => setActive((index + stops.length) % stops.length)
  if (!current) return null

  return (
    <section id="journey" className="journey-stage relative scroll-mt-80 overflow-hidden px-4 py-20 text-white sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-40 size-[36rem] rounded-full bg-[#17b3c6]/12 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 size-[28rem] rounded-full bg-black/50 blur-[110px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="journey-glass mx-auto max-w-3xl px-6 py-8 text-center sm:px-10 sm:py-9">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#7fe3ef]/90 uppercase">Province timeline</p>
          <h2 className="mt-2 font-heading text-4xl font-semibold text-white sm:text-5xl">Our journey</h2>
          <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-white/85 uppercase">
            {current.era.range} · {current.era.title}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {journeyEras.map((era, index) => {
            const on = current.era === era
            return (
              <button
                key={`${index}-${era.title}`}
                type="button"
                onClick={() => go(eraStart[index])}
                aria-pressed={on}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-bold tracking-wide transition",
                  on ? "journey-chip-on" : "journey-chip"
                )}
              >
                {era.range}
              </button>
            )
          })}
        </div>
      </div>

      <div ref={viewportRef} className="relative mx-auto mt-10 max-w-7xl overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[15rem] h-0 border-t border-dashed border-white/35"
        />
        <ol
          ref={trackRef}
          className="relative flex transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translate3d(${-offset}px, 0, 0)` }}
        >
          {stops.map((stop, index) => {
            const on = index === active
            const above = index % 2 === 0
            const events = (
              <div
                className={cn(
                  "journey-event ml-[7px] flex max-h-[13rem] flex-col gap-2.5 overflow-y-auto border-l-2 border-dotted pl-3 text-[12.5px] [scrollbar-width:thin] leading-5 transition duration-500",
                  on ? "journey-event-on border-[#17b3c6] text-white" : "border-white/25 text-white/55"
                )}
              >
                {stop.events.map((event) => (
                  <p key={`${event.date}-${event.text}`}>
                    {event.date ? (
                      <span
                        className={cn(
                          "mb-0.5 block text-[10px] font-bold tracking-[0.14em] uppercase",
                          on ? "text-[#ffcf4a]" : "text-[#17b3c6]/80"
                        )}
                      >
                        {event.date}
                      </span>
                    ) : null}
                    {event.text}
                  </p>
                ))}
              </div>
            )

            return (
              <li key={stop.year} className="grid w-60 shrink-0 grid-rows-[14rem_2rem_14rem] px-3 sm:w-64">
                <div className="flex flex-col justify-end pb-3">{above ? events : null}</div>
                <button
                  type="button"
                  onClick={() => go(index)}
                  aria-current={on ? "step" : undefined}
                  aria-label={`${stop.year}`}
                  className="relative flex items-center gap-3 text-left"
                >
                  <span
                    className={cn(
                      "relative z-10 block size-4 shrink-0 rounded-full border-2 transition duration-500",
                      on
                        ? "scale-125 border-white bg-[#17b3c6] shadow-[0_0_0_6px_rgb(23_179_198/0.3)]"
                        : "border-[#17b3c6] bg-[#06394a]"
                    )}
                  />
                  <span
                    className={cn(
                      "font-heading text-3xl leading-none font-bold transition duration-500",
                      on ? "text-white" : "text-white/70"
                    )}
                  >
                    {stop.year}
                  </span>
                </button>
                <div className="pt-3">{above ? null : events}</div>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="relative mx-auto mt-6 flex max-w-6xl items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Previous year"
          className="journey-control flex size-11 items-center justify-center rounded-full text-white transition hover:brightness-110"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause timeline" : "Play timeline"}
          className="journey-control-on flex size-11 items-center justify-center rounded-full text-white transition hover:brightness-110"
        >
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next year"
          className="journey-control flex size-11 items-center justify-center rounded-full text-white transition hover:brightness-110"
        >
          <ChevronRight className="size-5" />
        </button>
        <span className="ml-2 text-xs font-semibold tracking-[0.16em] text-white/70">
          {active + 1} / {stops.length}
        </span>
      </div>
    </section>
  )
}
