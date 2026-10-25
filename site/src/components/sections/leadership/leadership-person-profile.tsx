import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { isUpload } from "@/content/site-info"
import type { LeadershipPhoto } from "@/lib/cms"

export type LeadershipProfilePerson = {
  slug: string
  name: string
  role: string
  term?: string
  summary: string
  bio: string
  image?: string
  gallery: LeadershipPhoto[]
}

type LeadershipPersonProfileProps = {
  person: LeadershipProfilePerson
  kind: "council" | "former"
  previous?: LeadershipProfilePerson | null
  next?: LeadershipProfilePerson | null
  hrefFor: (person: { slug: string }) => string
}

function initials(name: string) {
  const words = name
    .replace(/\b(Rev\.?|Fr\.?|Very|Rt\.?|OMI)\b/gi, "")
    .replace(/[.,]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return "OM"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export function LeadershipPersonProfile({
  person,
  kind,
  previous,
  next,
  hrefFor,
}: LeadershipPersonProfileProps) {
  const sectionHref = kind === "council" ? "/leadership#council" : "/leadership#former-provincials"
  const sectionLabel = kind === "council" ? "Provincial Council" : "Former Provincials"
  const kindLabel = kind === "council" ? "Council member" : "Former Provincial"
  const paragraphs = person.bio
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
  const gallery = person.gallery.length
    ? person.gallery
    : person.image
      ? [{ src: person.image, alt: person.name, caption: "" }]
      : []

  return (
    <>
      <ScrollProgress />
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 pt-10 pb-20 text-white sm:px-8 sm:pt-14 sm:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-32 -z-10 size-[28rem] rounded-full bg-[#17b3c6] opacity-25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 -z-10 size-[24rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px]"
        />

        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href="/leadership" className="transition hover:text-white">
              Leadership
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href={sectionHref} className="transition hover:text-white">
              {sectionLabel}
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <span className="text-white">{person.name}</span>
          </nav>

          <div className="mt-14 flex flex-col gap-10 lg:mt-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-5 sm:gap-6">
              {person.image ? (
                <span className="relative size-28 shrink-0 overflow-hidden rounded-[1.5rem] bg-white/10 ring-2 ring-[#ffcf4a]/80 sm:size-36">
                  <Image
                    src={person.image}
                    alt=""
                    fill
                    sizes="144px"
                    className={
                      kind === "former"
                        ? "object-cover object-top"
                        : "object-contain object-bottom p-1"
                    }
                    unoptimized={isUpload(person.image)}
                  />
                </span>
              ) : (
                <span className="flex size-28 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/10 font-heading text-3xl font-bold ring-2 ring-[#ffcf4a]/80 sm:size-36 sm:text-4xl">
                  {initials(person.name)}
                </span>
              )}
              <div>
                <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm">
                  <span aria-hidden="true" className="h-px w-10 bg-[#ffcf4a]" />
                  {kindLabel}
                </p>
                <h1 className="mt-3 font-heading text-3xl leading-tight font-semibold sm:text-5xl">{person.name}</h1>
                {person.role ? <p className="mt-3 text-base text-[#7fe3ef] sm:text-lg">{person.role}</p> : null}
                {person.term ? (
                  <p className="mt-3 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20">
                    {person.term}
                  </p>
                ) : null}
              </div>
            </div>
            <Link
              href={sectionHref}
              className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {sectionLabel}
            </Link>
          </div>
        </div>
      </header>

      {person.summary || paragraphs.length ? (
        <section className="bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal from="up">
              <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Profile</p>
              <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">About</h2>
              {person.summary ? <p className="mt-6 text-lg leading-8 text-[#3d4b59]">{person.summary}</p> : null}
              {paragraphs.length ? (
                <div className="mt-6 space-y-5 text-base leading-8 text-[#3d4b59]">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="bg-white px-4 py-16 text-center text-[#5c6b7a] sm:px-8">
          <p>A fuller biography can be added for {person.name} in the CMS.</p>
        </section>
      )}

      {gallery.length ? (
        <section className="bg-[#f4fbfd] px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Gallery</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Photos</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((photo, index) => (
                <li
                  key={`${photo.src}-${index}`}
                  className="group overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_40px_-32px_rgba(10,60,80,0.45)]"
                >
                  <figure>
                    <div className="relative aspect-[4/5] bg-[#eef6f8]">
                      <Image
                        src={photo.src}
                        alt={photo.alt || person.name}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                        unoptimized={isUpload(photo.src)}
                      />
                    </div>
                    {photo.caption ? (
                      <figcaption className="px-4 py-3 text-sm text-[#5c6b7a]">{photo.caption}</figcaption>
                    ) : null}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {previous && next ? (
        <nav aria-label={`Other ${sectionLabel.toLowerCase()}`} className="border-t border-[#e2f2f6] bg-white px-4 py-10 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <Link
              href={hrefFor(previous)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#023e8a] transition hover:text-[#0e98ac]"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {previous.name}
            </Link>
            <Link href={sectionHref} className="text-sm font-semibold text-[#5c6b7a] transition hover:text-[#023e8a]">
              All {sectionLabel.toLowerCase()}
            </Link>
            <Link
              href={hrefFor(next)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#023e8a] transition hover:text-[#0e98ac]"
            >
              {next.name}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </nav>
      ) : null}
    </>
  )
}
