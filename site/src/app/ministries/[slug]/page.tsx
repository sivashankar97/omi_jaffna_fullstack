import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronRight, Mail, MapPin, Phone, Quote } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { ministryImages } from "@/components/sections/ministry-card"
import { ministryHref, ministrySlug } from "@/config/navigation"
import { site } from "@/config/site"
import { ministryDetails } from "@/content/ministry-details"
import { ministryStories, ministryStorySource } from "@/content/ministry-stories"
import { getMinistries } from "@/lib/cms"

type MinistryPageProps = {
  params: Promise<{ slug: string }>
}

async function findMinistry(slug: string) {
  const ministries = await getMinistries()
  const index = ministries.findIndex((ministry) => ministrySlug(ministry) === slug)
  return { ministries, index, ministry: index >= 0 ? ministries[index] : undefined }
}

export async function generateStaticParams() {
  const ministries = await getMinistries()
  return ministries.map((ministry) => ({ slug: ministrySlug(ministry) }))
}

export async function generateMetadata({ params }: MinistryPageProps): Promise<Metadata> {
  const { slug } = await params
  const { ministry } = await findMinistry(slug)
  if (!ministry) return { title: "Ministry" }
  return { title: ministry.title, description: ministry.summary }
}

export default async function MinistryPage({ params }: MinistryPageProps) {
  const { slug } = await params
  const { ministries, index, ministry } = await findMinistry(slug)
  if (!ministry) notFound()

  const detail = ministryDetails[ministry.number]
  const story = ministryStories[ministry.number] ?? []
  const image = ministry.image ?? ministryImages[ministry.title]
  const previous = ministries[(index - 1 + ministries.length) % ministries.length]
  const next = ministries[(index + 1) % ministries.length]
  const others = ministries.filter((item) => item.number !== ministry.number).slice(0, 6)

  return (
    <>
      <ScrollProgress />
      <header className="relative isolate overflow-hidden bg-[#03202b] px-4 pt-10 pb-16 text-white sm:px-8 sm:pt-14 sm:pb-24">
        {image ? (
          <img
            src={encodeURI(image)}
            alt=""
            className="history-kenburns absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#03202b] via-[#03202b]/80 to-[#03202b]/40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#03202b]/90 via-[#03202b]/40 to-transparent" />

        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="history-rise flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href="/ministries" className="transition hover:text-white">
              Ministries
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <span className="text-white">{ministry.title}</span>
          </nav>

          <div className="mt-16 max-w-3xl sm:mt-24">
            <p
              className="history-rise flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.24em] text-[#ffcf4a] uppercase sm:text-sm"
              style={{ "--rise-delay": "100ms" } as React.CSSProperties}
            >
              <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
              Ministry {ministry.number}
              <span className="inline-flex items-center gap-1 tracking-normal text-white/85 normal-case">
                <MapPin aria-hidden="true" className="size-4" /> {ministry.place}
              </span>
            </p>
            <h1
              className="history-rise mt-4 font-heading text-4xl leading-[1.1] font-semibold text-balance sm:text-6xl"
              style={{ "--rise-delay": "250ms", color: "#ffffff" } as React.CSSProperties}
            >
              {ministry.title}
            </h1>
            {detail ? (
              <p
                className="history-rise mt-5 text-lg text-white/85 sm:text-xl"
                style={{ "--rise-delay": "400ms" } as React.CSSProperties}
              >
                {detail.tagline}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <section className="bg-white px-4 py-16 text-[#102a43] sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article>
            <Reveal from="up">
              <p className="border-l-4 border-[#17b3c6] pl-5 font-heading text-xl leading-9 text-[#023e8a] sm:text-2xl sm:leading-10">
                {ministry.summary}
              </p>
            </Reveal>

            {detail ? (
              <>
                {story.length === 0 ? (
                  <Reveal from="up" className="mt-10 space-y-5 text-lg leading-8 text-[#3d4b59]">
                    {detail.overview.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </Reveal>
                ) : null}

                <Reveal from="up">
                  <dl className="mt-12 grid grid-cols-3 gap-3 sm:gap-5">
                    {detail.highlights.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-3xl bg-gradient-to-br from-[#f4fbfd] to-white px-4 py-6 text-center ring-1 ring-[#d9eef3]"
                      >
                        <dd className="font-heading text-3xl font-semibold text-[#0a5062] sm:text-4xl">{item.value}</dd>
                        <dt className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-[#5c6b7a] uppercase sm:text-xs">
                          {item.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </Reveal>

                {story.length > 0 ? (
                  <section aria-labelledby="ministry-story" className="mt-16">
                    <Reveal from="up">
                      <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">
                        <BookOpen aria-hidden="true" className="size-4" /> From the Province history
                      </p>
                      <h2 id="ministry-story" className="mt-3 font-heading text-3xl font-semibold text-[#023e8a]">
                        History &amp; details
                      </h2>
                    </Reveal>

                    <ol className="relative mt-10 space-y-10 border-l-2 border-[#d9eef3] pl-8 sm:pl-10">
                      {story.map((block, blockIndex) => (
                        <Reveal key={block.heading} as="li" from="up" className="relative">
                          <span
                            aria-hidden="true"
                            className="absolute top-0.5 -left-[2.95rem] grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#17b3c6] to-[#0e98ac] font-heading text-sm font-semibold text-white shadow-[0_0_0_6px_#fff] sm:-left-[3.45rem]"
                          >
                            {String(blockIndex + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-heading text-2xl leading-snug font-semibold text-[#06394a]">
                            {block.heading}
                          </h3>
                          <div className="mt-4 space-y-4 text-[1.05rem] leading-8 text-[#3d4b59]">
                            {block.paragraphs.map((paragraph) => (
                              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                            ))}
                          </div>
                        </Reveal>
                      ))}
                    </ol>

                    <p className="mt-8 text-sm text-[#5c6b7a] italic">Source: {ministryStorySource}</p>
                  </section>
                ) : null}

                <Reveal from="up">
                  <h2 className="mt-14 font-heading text-3xl font-semibold text-[#023e8a]">What we do</h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {detail.focus.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-2xl bg-white p-5 leading-7 shadow-[0_14px_34px_-28px_rgba(2,62,138,0.5)] ring-1 ring-[#d9eef3] transition hover:-translate-y-0.5 hover:ring-[#17b3c6]/50"
                      >
                        <CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#17b3c6]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {detail.scripture ? (
                  <Reveal from="up">
                    <figure className="relative mt-14 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-8 py-10 text-white sm:px-12">
                      <Quote aria-hidden="true" className="absolute -top-3 -right-3 size-28 text-white/10" />
                      <blockquote className="relative font-heading text-2xl leading-snug italic sm:text-3xl">
                        “{detail.scripture.text}”
                      </blockquote>
                      <figcaption className="relative mt-4 text-sm font-semibold tracking-[0.18em] text-[#ffcf4a] uppercase">
                        {detail.scripture.reference}
                      </figcaption>
                    </figure>
                  </Reveal>
                ) : null}
              </>
            ) : (
              <p className="mt-10 rounded-3xl bg-[#f4fbfd] p-6 leading-7 text-[#5c6b7a] ring-1 ring-[#d9eef3]">
                Full details of this ministry will be published after confirmation with the Province. For now, please
                contact the Province office to learn more.
              </p>
            )}

            <nav aria-label="More ministries" className="mt-16 grid gap-4 border-t border-[#e2f2f6] pt-10 sm:grid-cols-2">
              <Link
                href={ministryHref(previous)}
                className="group rounded-2xl p-5 ring-1 ring-[#d9eef3] transition hover:bg-[#f4fbfd] hover:ring-[#17b3c6]/50"
              >
                <span className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">
                  <ArrowLeft aria-hidden="true" className="size-4 transition group-hover:-translate-x-1" /> Previous
                </span>
                <span className="mt-2 block font-heading text-lg font-semibold text-[#023e8a]">{previous.title}</span>
              </Link>
              <Link
                href={ministryHref(next)}
                className="group rounded-2xl p-5 text-right ring-1 ring-[#d9eef3] transition hover:bg-[#f4fbfd] hover:ring-[#17b3c6]/50"
              >
                <span className="flex items-center justify-end gap-2 text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">
                  Next <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" />
                </span>
                <span className="mt-2 block font-heading text-lg font-semibold text-[#023e8a]">{next.title}</span>
              </Link>
            </nav>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] bg-[#f4fbfd] p-6 ring-1 ring-[#d9eef3]">
              <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">At a glance</p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-[#5c6b7a]">Ministry</dt>
                  <dd className="mt-0.5 font-semibold text-[#023e8a]">
                    {ministry.number} · {ministry.title}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#5c6b7a]">Place</dt>
                  <dd className="mt-0.5 font-semibold text-[#023e8a]">{ministry.place}</dd>
                </div>
                <div>
                  <dt className="text-[#5c6b7a]">Served by</dt>
                  <dd className="mt-0.5 font-semibold text-[#023e8a]">Oblate Province of Jaffna</dd>
                </div>
              </dl>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] p-6 text-white">
              <span
                aria-hidden="true"
                className="charism-orb absolute -top-12 -right-10 size-40 rounded-full bg-[#17b3c6]/30 blur-3xl"
              />
              <p className="relative text-xs font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">Get involved</p>
              <p className="relative mt-3 font-heading text-xl leading-snug font-semibold">
                Would you like to support or join this ministry?
              </p>
              <div className="relative mt-5 space-y-2 text-sm">
                <a href={site.contact.phoneHref} className="flex items-center gap-2 text-white/85 hover:text-white">
                  <Phone aria-hidden="true" className="size-4 text-[#ffcf4a]" /> {site.contact.phone}
                </a>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex items-center gap-2 break-all text-white/85 hover:text-white"
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-[#ffcf4a]" /> {site.contact.email}
                </a>
              </div>
              <Link
                href="/contact#enquiry"
                className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffcf4a] px-5 py-3 text-sm font-semibold text-[#03202b] transition hover:bg-[#ffd966]"
              >
                Contact the Province <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] p-6 ring-1 ring-[#d9eef3]">
              <p className="text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">Other ministries</p>
              <ul className="mt-4 divide-y divide-[#e2f2f6]">
                {others.map((item) => (
                  <li key={item.number}>
                    <Link
                      href={ministryHref(item)}
                      className="group flex items-center gap-3 py-3 text-sm text-[#023e8a] transition hover:text-[#0e98ac]"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#eaf8fb] font-heading text-xs font-semibold text-[#0a5062]">
                        {item.number}
                      </span>
                      <span className="flex-1 font-semibold">{item.title}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className="size-4 text-[#17b3c6] transition group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/ministries"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0e98ac] hover:text-[#023e8a]"
              >
                View all ministries <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
