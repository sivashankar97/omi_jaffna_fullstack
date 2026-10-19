"use client"

import { useEffect, useState } from "react"

import { cn } from "cn"

type Chapter = { id: string; title: string; years: string }

export function ChapterNav({ chapters }: { chapters: readonly Chapter[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const nodes = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((node): node is HTMLElement => node !== null)
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (!visible.length) return
        const index = nodes.indexOf(visible[0].target as HTMLElement)
        if (index >= 0) setActive(index)
      },
      { rootMargin: "-35% 0px -55% 0px" }
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [chapters])

  return (
    <nav aria-label="History chapters" className="sticky top-28">
      <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">Chapters</p>
      <div className="relative mt-4">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-0.5 rounded-full bg-[#e2f2f6]" />
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 w-0.5 rounded-full bg-gradient-to-b from-[#17b3c6] to-[#ffbf00] transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ height: `${((active + 1) / chapters.length) * 100}%` }}
        />
        <ol className="space-y-1">
          {chapters.map((chapter, index) => {
            const on = index === active
            return (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={on ? "step" : undefined}
                  className={cn(
                    "block py-2.5 pl-5 transition-all duration-500",
                    on ? "translate-x-1" : "opacity-60 hover:opacity-100"
                  )}
                >
                  <span className="block text-[11px] font-bold tracking-[0.16em] text-[#ffbf00]">
                    {String(index + 1).padStart(2, "0")} · {chapter.years}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-sm leading-5 transition-colors duration-500",
                      on ? "font-semibold text-[#023e8a]" : "font-medium text-[#3d4b59]"
                    )}
                  >
                    {chapter.title}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
