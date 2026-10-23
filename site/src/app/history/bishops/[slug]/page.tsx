import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ChevronRight, Cross, MapPin } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { bishopHref } from "@/config/navigation"
import { isUpload } from "@/content/site-info"
import { getBishop, getBishops } from "@/lib/cms"

type BishopPageProps = {
  params: Promise<{ slug: string }>
}

function initials(name: string) {
  const words = name
    .replace(/\b(Rt\.?|Rev\.?|Arch\.?|Bp\.?|Bishop|Archbishop|Mgr\.?|Cardinal|H\.?\s*E\.?)\b/gi, "")
    .replace(/[.,]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return "OB"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export async function generateStaticParams() {
  return (await getBishops()).map((bishop) => ({ slug: bishop.slug }))
}

export async function generateMetadata({ params }: BishopPageProps): Promise<Metadata> {
  const { slug } = await params
  const bishop = await getBishop(slug)
  if (!bishop) return { title: "Bishop" }
  return {
    title: bishop.name,
    description:
      bishop.excerpt ||
      `${bishop.name} — Oblate bishop. Born ${bishop.born} (${bishop.bornAt}), died ${bishop.died} (${bishop.diedAt}).`,
  }
}

export default async function BishopProfilePage({ params }: BishopPageProps) {
  const { slug } = await params
  const bishops = await getBishops()
  const index = bishops.findIndex((bishop) => bishop.slug === slug)
  const bishop = index >= 0 ? bishops[index] : undefined
  if (!bishop) notFound()

  const previous = bishops[(index - 1 + bishops.length) % bishops.length]
  const next = bishops[(index + 1) % bishops.length]
  const memorial =
    bishop.excerpt ||
    `${bishop.name} is remembered among the Oblate bishops in the historical archive of the Province of Jaffna.`

  return (
    <>
      <ScrollProgress />
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 pt-10 pb-20 text-white sm:px-8 sm:pt-14 sm:pb-28">
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -bottom-40 -left-32 -z-10 size-[28rem] rounded-full bg-[#17b3c6] opacity-25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -top-32 right-0 -z-10 size-[24rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px] [animation-delay:-7s]"
        />

        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="history-rise flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href="/history" className="transition hover:text-white">
              History
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <Link href="/history#bishops" className="transition hover:text-white">
              Bishops
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
            <span className="text-white">{bishop.name}</span>
          </nav>

          <div className="mt-14 flex flex-col gap-8 sm:mt-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-5 sm:gap-6">
              {bishop.image ? (
                <span className="relative size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-[#ffcf4a]/80 sm:size-24">
                  <Image
                    src={bishop.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized={isUpload(bishop.image)}
                  />
                </span>
              ) : (
                <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-white/10 font-heading text-2xl font-bold ring-2 ring-[#ffcf4a]/80 sm:size-24 sm:text-3xl">
                  {initials(bishop.name)}
                </span>
              )}
              <div>
                <p
                  className="history-rise flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm"
                  style={{ "--rise-delay": "100ms" } as React.CSSProperties}
                >
                  <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
                  Oblate bishop
                </p>
                <h1
                  className="history-rise mt-3 font-heading text-3xl leading-tight font-semibold sm:text-5xl"
                  style={{ "--rise-delay": "250ms" } as React.CSSProperties}
                >
                  {bishop.name}
                </h1>
                <p
                  className="history-rise mt-3 text-sm text-white/75"
                  style={{ "--rise-delay": "400ms" } as React.CSSProperties}
                >
                  {bishop.no ? `Province necrology · Register no. ${bishop.no}` : "Province of Jaffna"}
                </p>
              </div>
            </div>
            <Link
              href="/history#bishops"
              className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              All bishops
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <Reveal from="up">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Life dates</h2>
            <p className="mt-3 max-w-xl leading-7 text-[#5c6b7a]">
              From the Province register of Oblates who served in Ceylon and Jaffna. Dates are written day, month,
              year.
            </p>
            <dl className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-[#f4fbfd] p-6 ring-1 ring-[#d8eef3]">
                <dt className="text-xs font-bold tracking-[0.18em] text-[#17b3c6] uppercase">Born</dt>
                <dd className="mt-3 font-heading text-3xl font-semibold text-[#023e8a]">{bishop.born || "—"}</dd>
                {bishop.bornAt ? (
                  <dd className="mt-2 flex items-start gap-2 text-[#5c6b7a]">
                    <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#17b3c6]" />
                    {bishop.bornAt}
                  </dd>
                ) : null}
              </div>
              <div className="rounded-[1.75rem] bg-[#f4fbfd] p-6 ring-1 ring-[#d8eef3]">
                <dt className="text-xs font-bold tracking-[0.18em] text-[#17b3c6] uppercase">Called home</dt>
                <dd className="mt-3 font-heading text-3xl font-semibold text-[#023e8a]">{bishop.died || "—"}</dd>
                {bishop.diedAt ? (
                  <dd className="mt-2 flex items-start gap-2 text-[#5c6b7a]">
                    <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#17b3c6]" />
                    {bishop.diedAt}
                  </dd>
                ) : null}
              </div>
            </dl>
            {bishop.body ? (
              <div className="mt-12 space-y-4 text-base leading-7 text-[#5c6b7a] whitespace-pre-line">
                <h2 className="font-heading text-2xl font-semibold text-[#023e8a]">Biography</h2>
                <p>{bishop.body}</p>
              </div>
            ) : null}
          </Reveal>

          <Reveal from="right" delay={120} className="rounded-[2rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] p-8 text-white sm:p-10">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#ffcf4a] uppercase">
              <Cross aria-hidden="true" className="size-4" /> In memoriam
            </p>
            <p className="mt-5 font-heading text-2xl leading-snug font-semibold sm:text-3xl">
              Eternal rest grant unto him, O Lord, and let perpetual light shine upon him.
            </p>
            <p className="mt-6 text-sm leading-7 text-white/80 whitespace-pre-line">{memorial}</p>
            <Link
              href="/history#historical-archive"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#7fe3ef] transition hover:text-white"
            >
              Open the historical archive
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <nav
        aria-label="Other bishops"
        className="border-t border-[#d8eef3] bg-[#f4fbfd] px-4 py-10 text-[#023e8a] sm:px-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={bishopHref(previous)}
            className="group flex max-w-md items-start gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-[#d8eef3] transition hover:ring-[#17b3c6]"
          >
            <ArrowLeft aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#17b3c6]" />
            <span>
              <span className="block text-[11px] font-bold tracking-[0.16em] text-[#17b3c6] uppercase">Previous</span>
              <span className="mt-1 block font-heading font-semibold group-hover:text-[#0e98ac]">{previous.name}</span>
            </span>
          </Link>
          <Link
            href={bishopHref(next)}
            className="group flex max-w-md items-start gap-3 rounded-2xl bg-white px-4 py-3 text-right ring-1 ring-[#d8eef3] transition hover:ring-[#17b3c6] sm:ml-auto sm:flex-row-reverse"
          >
            <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#17b3c6]" />
            <span>
              <span className="block text-[11px] font-bold tracking-[0.16em] text-[#17b3c6] uppercase">Next</span>
              <span className="mt-1 block font-heading font-semibold group-hover:text-[#0e98ac]">{next.name}</span>
            </span>
          </Link>
        </div>
      </nav>
    </>
  )
}
