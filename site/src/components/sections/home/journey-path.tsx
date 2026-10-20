"use client"

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import type { JourneyEra } from "@/content/journey"
import { cn } from "cn"

const INTERVAL = 3800

export function JourneyPath({ eras: journeyEras }: { eras: readonly JourneyEra[] }) {
  const { stops, eraStart } = useMemo(() => {
    const stops = journeyEras.flatMap((era) => era.years.map((year) => ({ ...year, era })))
    return { stops, eraStart: journeyEras.map((era) => stops.findIndex((stop) => stop.era === era)) }
  }, [journeyEras])
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [offset, setOffset] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)

  const current = stops[active]

  useEffect(() => {
    if (!playing || hovered) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setTimeout(() => setActive((index) => (index + 1) % stops.length), INTERVAL)
    return () => window.clearTimeout(id)
  }, [active, playing, hovered, stops.length])

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
    <section
      id="journey"
      className="relative scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-white sm:px-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-40 size-[36rem] rounded-full bg-[#17b3c6] opacity-25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 size-[28rem] rounded-full bg-[#0f9fb4] opacity-15 blur-[110px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-semibold text-white sm:text-5xl">Our journey</h2>
          <p className="mt-3 text-sm font-semibold tracking-[0.22em] text-[#7fe3ef] uppercase">
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
                  on
                    ? "border-[#17b3c6] bg-[#17b3c6] text-white"
                    : "border-white/25 text-white/75 hover:border-[#17b3c6] hover:text-white"
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
          className="pointer-events-none absolute inset-x-0 top-[15rem] h-0 border-t border-dashed border-white/30"
        />
        <ol
          ref={trackRef}
          className="relative flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translate3d(${-offset}px, 0, 0)` }}
        >
          {stops.map((stop, index) => {
            const on = index === active
            const above = index % 2 === 0
            const events = (
              <div
                className={cn(
                  "ml-[7px] flex max-h-[13rem] flex-col gap-2.5 overflow-y-auto border-l-2 border-dotted pl-3 text-[12.5px] [scrollbar-width:thin] leading-5 transition duration-500",
                  on ? "border-[#7fe3ef] text-white" : "border-white/30 text-white/55"
                )}
              >
                {stop.events.map((event) => (
                  <p key={`${event.date}-${event.text}`}>
                    {event.date ? (
                      <span
                        className={cn(
                          "mb-0.5 block text-[10px] font-bold tracking-[0.14em] uppercase",
                          on ? "text-[#ffcf4a]" : "text-[#7fe3ef]/70"
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
                      on ? "scale-125 border-[#ffcf4a] bg-[#ffcf4a] shadow-[0_0_0_6px_rgb(255_207_74/0.2)]" : "border-[#7fe3ef] bg-[#06303d]"
                    )}
                  />
                  <span
                    className={cn(
                      "font-heading text-3xl leading-none font-bold transition duration-500",
                      on ? "text-[#ffcf4a]" : "text-white/80"
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
          className="flex size-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-[#17b3c6] hover:bg-[#17b3c6]"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause timeline" : "Play timeline"}
          className="flex size-11 items-center justify-center rounded-full bg-[#17b3c6] text-white transition hover:bg-[#0f9fb4]"
        >
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next year"
          className="flex size-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-[#17b3c6] hover:bg-[#17b3c6]"
        >
          <ChevronRight className="size-5" />
        </button>
        <span className="ml-2 text-xs font-semibold tracking-[0.16em] text-white/60">
          {active + 1} / {stops.length}
        </span>
      </div>
    </section>
  )
}
