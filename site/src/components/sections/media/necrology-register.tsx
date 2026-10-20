"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { Cross, Search, X } from "lucide-react"

import { necrology } from "@/content/necrology"
import { cn } from "cn"

type Role = "bishop" | "father" | "brother" | "scholastic"

const roles: { id: "all" | Role; label: string }[] = [
  { id: "all", label: "All" },
  { id: "bishop", label: "Bishops" },
  { id: "father", label: "Fathers" },
  { id: "brother", label: "Brothers" },
  { id: "scholastic", label: "Scholastics" },
]

const eras = [
  { id: "all", label: "Every era" },
  { id: "1800", label: "1800s" },
  { id: "1900", label: "1900s" },
  { id: "2000", label: "2000s" },
] as const

const roleLabel: Record<Role, string> = {
  bishop: "Bishop",
  father: "Father",
  brother: "Brother",
  scholastic: "Scholastic",
}

function roleOf(name: string): Role {
  if (/^(Rt\.|Mgr\.)/.test(name)) return "bishop"
  if (name.startsWith("Bro.")) return "brother"
  if (name.startsWith("Sch.")) return "scholastic"
  return "father"
}

function yearOf(date: string) {
  return Number(date.slice(-4))
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[.,]/g, " ").replace(/\s+/g, " ").trim()
}

const people = necrology.map((person) => ({
  ...person,
  role: roleOf(person.name),
  search: normalize(`${person.name} ${person.bornAt} ${person.diedAt} ${person.born} ${person.died}`),
}))

const firstYear = Math.min(...people.map((person) => yearOf(person.died)))
const lastYear = Math.max(...people.map((person) => yearOf(person.died)))

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return text
  const pattern = new RegExp(`(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi")
  return text.split(pattern).map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="rounded bg-[#ffe58a] px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function NecrologyRegister() {
  const [query, setQuery] = useState("")
  const [role, setRole] = useState<(typeof roles)[number]["id"]>("all")
  const [era, setEra] = useState<(typeof eras)[number]["id"]>("all")
  const search = useDeferredValue(normalize(query))
  const terms = useMemo(() => search.split(" ").filter(Boolean), [search])
  const listRef = useRef<HTMLOListElement>(null)
  const registerRef = useRef<HTMLDivElement>(null)

  const visible = useMemo(
    () =>
      people.filter((person) => {
        if (role !== "all" && person.role !== role) return false
        if (era !== "all" && Math.floor(yearOf(person.died) / 100) * 100 !== Number(era)) return false
        return terms.every((term) => person.search.includes(term))
      }),
    [terms, role, era]
  )

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 })
  }, [terms, role, era])

  const filtered = query.trim() !== "" || role !== "all" || era !== "all"

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    registerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function reset() {
    setQuery("")
    setRole("all")
    setEra("all")
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a3d7a] via-[#0a5062] to-[#06394a] p-6 text-white sm:p-8">
        <span
          aria-hidden="true"
          className="charism-orb absolute -top-16 -right-10 size-56 rounded-full bg-[#17b3c6]/25 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="charism-orb absolute -bottom-20 left-10 size-48 rounded-full bg-[#ffbf00]/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#ffcf4a] uppercase">
              <Cross aria-hidden="true" className="size-4" /> In memoriam
            </p>
            <h3 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl" style={{ color: "#ffffff" }}>
              Oblates who served in Ceylon and Jaffna
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
              The register of {people.length} Oblate bishops, priests, brothers and scholastics who gave their lives to
              the mission on this island, from {firstYear} to {lastYear}. Eternal rest grant unto them, O Lord.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center lg:min-w-80">
            {[
              [String(people.length), "Oblates"],
              [String(firstYear), "First entry"],
              [String(lastYear), "Latest"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/10 px-3 py-3 ring-1 ring-white/15 backdrop-blur">
                <dt className="sr-only">{label}</dt>
                <dd className="font-heading text-2xl font-semibold text-[#ffcf4a] sm:text-3xl">{value}</dd>
                <dd className="mt-1 text-[0.7rem] font-semibold tracking-[0.14em] text-white/75 uppercase">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {roles.map((item) => {
            const count = item.id === "all" ? people.length : people.filter((person) => person.role === item.id).length
            const selected = role === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setRole(item.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                  selected
                    ? "border-[#0a3d7a] bg-[#0a3d7a] text-white"
                    : "border-[#bfe6ef] bg-[#f6fcfd] text-[#0a3d7a] hover:bg-[#eaf8fb]"
                )}
              >
                {item.label} · {count}
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={era}
            onChange={(event) => setEra(event.target.value as (typeof eras)[number]["id"])}
            aria-label="Year of death"
            className="h-10 rounded-full border-2 border-[#bfe6ef] bg-white px-4 text-sm font-semibold text-[#0a3d7a] outline-none focus:border-[#5cc6d8]"
          >
            {eras.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <form role="search" onSubmit={submit} className="flex items-center gap-2 sm:w-96">
            <label className="relative block min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#0e7fa0]"
              />
              <input
                type="text"
                inputMode="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setQuery("")
                }}
                placeholder="Search a name or place"
                aria-label="Search a name or place"
                className="h-10 w-full rounded-full border-2 border-[#5cc6d8] bg-white pr-9 pl-10 text-sm text-[#0a3d7a] outline-none transition placeholder:text-[#55697a] focus:border-[#0e98ac] focus:shadow-[0_0_0_4px_rgba(23,179,198,0.18)]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-[#55697a] transition hover:bg-[#eaf8fb] hover:text-[#0a3d7a]"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              ) : null}
            </label>
            <button
              type="submit"
              className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#17b3c6] to-[#0a3d7a] px-5 text-sm font-semibold text-white shadow-[0_10px_22px_-12px_rgba(10,61,122,0.8)] transition hover:brightness-110"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div ref={registerRef} className="mt-4 flex scroll-mt-28 flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#0e7fa0] uppercase" aria-live="polite">
          Showing {visible.length} of {people.length}
          {query.trim() ? <span className="normal-case tracking-normal"> for “{query.trim()}”</span> : null}
        </p>
        {filtered ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-full px-3 py-1 text-xs font-semibold text-[#0a3d7a] ring-1 ring-[#bfe6ef] transition hover:bg-[#eaf8fb]"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="mt-2 overflow-hidden rounded-3xl border-2 border-[#bfe6ef] bg-white">
        <div className="hidden grid-cols-[4.5rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b-2 border-[#bfe6ef] bg-[#eaf8fb] px-5 py-3 text-xs font-bold tracking-[0.14em] text-[#0e7fa0] uppercase md:grid">
          <span>No</span>
          <span>Name</span>
          <span>Born</span>
          <span>Called home</span>        </div>
        {visible.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-heading text-lg font-semibold text-[#0a3d7a]">No name matches that search.</p>
            <p className="mt-1 text-sm text-[#55697a]">
              {role !== "all" || era !== "all"
                ? "A role or era filter is also on. Search the whole register instead."
                : "Check the spelling, or try a place such as Jaffna or Mannar."}
            </p>
            {role !== "all" || era !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setRole("all")
                  setEra("all")
                }}
                className="mt-4 rounded-full bg-[#0a3d7a] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Search all {people.length}
              </button>
            ) : null}
          </div>
        ) : (
          <ol
            ref={listRef}
            className="max-h-[min(68svh,40rem)] divide-y divide-[#e2f2f6] overflow-y-auto overscroll-contain [scrollbar-color:#5cc6d8_transparent] [scrollbar-width:thin]">
            {visible.map((person) => (
              <li
                key={person.no}
                className="group grid grid-cols-[3rem_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-4 transition hover:bg-[#f4fbfd] md:grid-cols-[4.5rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-4 md:px-5"
              >
                <span className="row-span-3 flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#bfe6ef] via-[#0e7fa0] to-[#0a3d7a] font-heading text-sm font-semibold text-white ring-4 ring-[#eaf8fb] transition group-hover:ring-[#ffcf4a]/60 md:row-span-1 md:size-12">
                  {person.no}
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-base leading-snug font-semibold text-[#0a3d7a]">
                    <Highlight text={person.name} terms={terms} />
                  </span>
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.12em] uppercase",
                      person.role === "bishop"
                        ? "bg-[#fff4cc] text-[#8a6500]"
                        : person.role === "father"
                          ? "bg-[#eaf8fb] text-[#0e7fa0]"
                          : "bg-[#eef2ff] text-[#3949ab]"
                    )}
                  >
                    {roleLabel[person.role]}
                  </span>
                </span>
                <span className="col-start-2 text-sm leading-5 text-[#55697a] md:col-start-auto">
                  <span className="font-semibold text-[#0a3d7a] md:hidden">Born </span>
                  <span className="font-semibold text-[#0a3d7a]">{person.born}</span>
                  <span className="block text-xs">
                    <Highlight text={person.bornAt} terms={terms} />
                  </span>
                </span>
                <span className="col-start-2 text-sm leading-5 text-[#55697a] md:col-start-auto">
                  <span className="font-semibold text-[#0a3d7a] md:hidden">Died </span>
                  <span className="font-semibold text-[#0a3d7a]">{person.died}</span>
                  <span className="block text-xs">
                    <Highlight text={person.diedAt} terms={terms} />
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <p className="mt-3 text-xs text-[#55697a]">
        Scroll inside the register to see every name. Dates are written day, month, year, as in the Province list.
      </p>
    </div>
  )
}
