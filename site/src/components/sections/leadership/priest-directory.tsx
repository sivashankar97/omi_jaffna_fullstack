"use client"

import { useMemo, useState } from "react"

import type { Priest, PriestPlace } from "@/content/priests"
import { cn } from "cn"

const filters = [
  { id: "all", label: "All" },
  { id: "sri-lanka", label: "In Sri Lanka" },
  { id: "abroad", label: "Outside Sri Lanka" },
  { id: "out-of-province", label: "Serving out of province" },
] as const

type FilterId = (typeof filters)[number]["id"]

function portraitInitials(name: string) {
  const words = name
    .replace(/,/g, " ")
    .replace(/\bOMI\b/gi, "")
    .replace(/Rev\.?\s*(Fr|Bro)\.?/gi, "")
    .split(/\s+/)
    .map((word) => word.replace(/\./g, ""))
    .filter((word) => word.length > 1)
  const first = words[0]?.[0] ?? "O"
  const second = words.length > 1 ? words[words.length - 1]?.[0] : words[0]?.[1]
  return `${first}${second ?? "M"}`.toUpperCase()
}

export function PriestDirectory({ priests }: { priests: Priest[] }) {
  const [place, setPlace] = useState<FilterId>("all")
  const [query, setQuery] = useState("")
  const term = query.trim().toLowerCase()

  const visible = useMemo(
    () =>
      priests.filter((priest) => {
        const matchesPlace = place === "all" || priest.place === place
        const matchesName = term.length === 0 || priest.name.toLowerCase().includes(term)
        return matchesPlace && matchesName
      }),
    [place, priests, term]
  )

  const groups: { id: PriestPlace; title: string }[] = [
    { id: "sri-lanka", title: "In Sri Lanka" },
    { id: "abroad", title: "Outside Sri Lanka" },
    { id: "out-of-province", title: "Serving out of province" },
  ]

  return (
    <section id="priests" className="scroll-mt-80 bg-white px-4 py-16 text-[#023e8a] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">
          Province list · 13 October 2026
        </p>
        <h2 className="mt-3 text-sm font-semibold tracking-[0.18em] text-[#0077b6] uppercase">Oblate priests</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5c6b7a]">
          Each card has a place for a portrait. The circles are a sample until a photograph is
          added beside the name. {priests.length} names are listed:{" "}
          {priests.filter((priest) => priest.place === "sri-lanka").length} in Sri Lanka,{" "}
          {priests.filter((priest) => priest.place === "abroad").length} outside Sri Lanka and{" "}
          {priests.filter((priest) => priest.place === "out-of-province").length} serving out of province.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const count =
                filter.id === "all"
                  ? priests.length
                  : priests.filter((priest) => priest.place === filter.id).length
              const selected = place === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPlace(filter.id)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                    selected
                      ? "border-[#023e8a] bg-[#023e8a] text-white"
                      : "border-[#90e0ef] bg-[#f7fbff] text-[#023e8a] hover:bg-[#e7fbff]"
                  )}
                >
                  {filter.label} · {count}
                </button>
              )
            })}
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a name"
            aria-label="Search a name"
            className="h-10 w-full rounded-full border-2 border-[#48cae4] bg-white px-4 text-sm text-[#023e8a] outline-none placeholder:text-[#5c6b7a] sm:max-w-xs"
          />
        </div>
        {visible.length === 0 ? (
          <p className="mt-10 text-sm text-[#5c6b7a]">No name matches that search.</p>
        ) : (
          groups.map((group) => {
            const people = visible.filter((priest) => priest.place === group.id)
            if (people.length === 0) return null
            return (
              <div key={group.id} className="mt-10">
                <h3 className="font-heading text-xl">{group.title}</h3>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {people.map((priest) => (
                    <li
                      key={priest.name}
                      className="rounded-2xl border border-[#d5dee6] bg-[#f7fbff] px-3 py-4 text-center"
                    >
                      {priest.image ? (
                        <img
                          src={priest.image}
                          alt={priest.name}
                          className="mx-auto size-24 rounded-full object-cover ring-4 ring-white"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="mx-auto flex size-24 items-center justify-center rounded-full bg-[#e7fbff] font-heading text-2xl font-semibold text-[#023e8a] ring-4 ring-white"
                        >
                          {portraitInitials(priest.name)}
                        </div>
                      )}
                      <p className="mt-3 text-sm leading-5 font-semibold">{priest.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
