import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, MapPin } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { fatherHref } from "@/config/navigation"
import { isUpload } from "@/content/site-info"
import type { PriestPlace } from "@/content/priests"
import { getFatherPosts, getPriest, getPriests } from "@/lib/cms"

type FatherPageProps = {
  params: Promise<{ slug: string }>
}

const placeLabels: Record<PriestPlace, string> = {
  "sri-lanka": "Serving in Sri Lanka",
  abroad: "Serving outside Sri Lanka",
  "out-of-province": "Serving out of province",
}

function initials(name: string) {
  const words = name
    .replace(/\b(Rev\.?|Fr\.?|Bro\.?|OMI)\b/gi, "")
    .replace(/[.,]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return "OM"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export async function generateStaticParams() {
  return (await getPriests()).map((priest) => ({ slug: priest.slug }))
}

export async function generateMetadata({ params }: FatherPageProps): Promise<Metadata> {
  const { slug } = await params
  const priest = await getPriest(slug)
  if (!priest) return { title: "Oblate Father" }
  return {
    title: `${priest.name} · Leadership`,
    description: priest.summary || priest.role || `Profile of ${priest.name}, Oblate Province of Jaffna.`,
  }
}

export default async function FatherProfilePage({ params }: FatherPageProps) {
  const { slug } = await params
  const priests = await getPriests()
  const index = priests.findIndex((priest) => priest.slug === slug)
  const priest = index >= 0 ? priests[index] : await getPriest(slug)
  if (!priest) notFound()
  const posts = await getFatherPosts(priest.slug)

  const previous = priests[(index - 1 + priests.length) % priests.length]
  const next = priests[(index + 1) % priests.length]
  const paragraphs = priest.bio
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
  const gallery = priest.gallery.length
    ? priest.gallery
    : priest.image
      ? [{ src: priest.image, alt: priest.name, caption: "" }]
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
            <Link href="/leadership#priests" className="transition hover:text-white">
              Oblate priests
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <span className="text-white">{priest.name}</span>
          </nav>

          <div className="mt-14 flex flex-col gap-10 lg:mt-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-5 sm:gap-6">
              {priest.image ? (
                <span className="relative size-28 shrink-0 overflow-hidden rounded-[1.5rem] bg-white/10 ring-2 ring-[#ffcf4a]/80 sm:size-36">
                  <Image
                    src={priest.image}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-contain object-bottom p-1"
                    unoptimized={isUpload(priest.image)}
                  />
                </span>
              ) : (
                <span className="flex size-28 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/10 font-heading text-3xl font-bold ring-2 ring-[#ffcf4a]/80 sm:size-36 sm:text-4xl">
                  {initials(priest.name)}
                </span>
              )}
              <div>
                <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm">
                  <span aria-hidden="true" className="h-px w-10 bg-[#ffcf4a]" />
                  Oblate Father
                </p>
                <h1 className="mt-3 font-heading text-3xl leading-tight font-semibold sm:text-5xl">{priest.name}</h1>
                {priest.role ? <p className="mt-3 text-base text-[#7fe3ef] sm:text-lg">{priest.role}</p> : null}
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/75">
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-[#17b3c6]" />
                  {placeLabels[priest.place]}
                </p>
              </div>
            </div>
            <Link
              href="/leadership#priests"
              className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              All Oblate priests
            </Link>
          </div>
        </div>
      </header>

      {(priest.summary || paragraphs.length) ? (
        <section className="bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal from="up">
              <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Profile</p>
              <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">About</h2>
              {priest.summary ? <p className="mt-6 text-lg leading-8 text-[#3d4b59]">{priest.summary}</p> : null}
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
          <p>A fuller biography can be added for {priest.name} in the CMS.</p>
        </section>
      )}

      {gallery.length ? (
        <section className="bg-[#f4fbfd] px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Gallery</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Photos</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((photo, index) => (
                <li key={`${photo.src}-${index}`} className="group overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_40px_-32px_rgba(10,60,80,0.45)]">
                  <figure>
                    <div className="relative aspect-[4/5] bg-[#eef6f8]">
                      <Image
                        src={photo.src}
                        alt={photo.alt || priest.name}
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

      {posts.news.length ? (
        <section className="bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">By {priest.name}</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Articles</h2>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.news.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={post.href}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-[#f4fbfd] ring-1 ring-[#e2f2f6] transition hover:shadow-[0_18px_40px_-28px_rgba(10,60,80,0.5)]"
                  >
                    {post.image ? (
                      <span className="relative block aspect-[16/10] bg-[#eef6f8]">
                        <Image
                          src={post.image}
                          alt=""
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                          unoptimized={isUpload(post.image)}
                        />
                      </span>
                    ) : null}
                    <span className="flex flex-1 flex-col p-5">
                      {post.dateLabel ? <span className="text-xs font-semibold text-[#0e98ac]">{post.dateLabel}</span> : null}
                      <span className="mt-2 font-heading text-lg leading-snug font-semibold">{post.title}</span>
                      {post.excerpt ? <span className="mt-2 line-clamp-3 text-sm leading-6 text-[#5c6b7a]">{post.excerpt}</span> : null}
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold">
                        Read article <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {posts.events.length ? (
        <section className="bg-[#f4fbfd] px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Shared by {priest.name}</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Events</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {posts.events.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={post.href}
                    className="flex h-full gap-4 rounded-[1.25rem] bg-white p-5 ring-1 ring-[#e2f2f6] transition hover:ring-[#90e0ef]"
                  >
                    {post.image ? (
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#eef6f8]">
                        <Image src={post.image} alt="" fill sizes="64px" className="object-cover" unoptimized={isUpload(post.image)} />
                      </span>
                    ) : (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#d4f6fa] text-[#023e8a]">
                        <CalendarDays aria-hidden="true" className="size-5" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block font-heading text-lg leading-snug font-semibold">{post.title}</span>
                      <span className="mt-1 block text-sm font-semibold text-[#0e98ac]">
                        {[post.dateLabel, post.place].filter(Boolean).join(" · ")}
                      </span>
                      {post.excerpt ? <span className="mt-2 block text-sm leading-6 text-[#5c6b7a]">{post.excerpt}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {priests.length > 1 && previous && next ? (
        <nav aria-label="Other fathers" className="border-t border-[#e2f2f6] bg-white px-4 py-10 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <Link
              href={fatherHref(previous)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#023e8a] transition hover:text-[#0e98ac]"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {previous.name}
            </Link>
            <Link href="/leadership#priests" className="text-sm font-semibold text-[#5c6b7a] transition hover:text-[#023e8a]">
              All priests
            </Link>
            <Link
              href={fatherHref(next)}
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
