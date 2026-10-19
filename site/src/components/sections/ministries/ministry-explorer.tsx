"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, ChevronLeft, ChevronRight, MapPin, Quote, X } from "lucide-react"
import { Dialog } from "radix-ui"

import { Reveal } from "@/components/motion/reveal"
import { MinistryCard, ministryImages } from "@/components/sections/ministry-card"
import { ministryAnchor } from "@/config/navigation"
import { ministryDetails } from "@/content/ministry-details"
import type { Ministry } from "@/lib/cms"

export function MinistryExplorer({ ministries }: { ministries: Ministry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    const match = window.location.hash.match(/^#ministry-(\d+)$/)
    if (!match) return
    const index = ministries.findIndex((ministry) => ministry.number === match[1])
    if (index >= 0 && ministryDetails[ministries[index].number]) setOpenIndex(index)
  }, [ministries])

  const active = openIndex === null ? null : ministries[openIndex]
  const detail = active ? ministryDetails[active.number] : undefined
  const image = active ? (active.image ?? ministryImages[active.title]) : undefined

  const step = (delta: number) =>
    setOpenIndex((current) => (current === null ? null : (current + delta + ministries.length) % ministries.length))

  return (
    <Dialog.Root open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {ministries.map((ministry, index) => (
          <Reveal
            id={ministryAnchor(ministry.number)}
            key={ministry.number}
            delay={(index % 3) * 90}
            className="h-full"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View details: ${ministry.title}`}
              className="block h-full w-full cursor-pointer rounded-[1.75rem] text-left transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(2,62,138,0.55)] focus-visible:ring-4 focus-visible:ring-[#17b3c6]/60 focus-visible:outline-none"
            >
              <MinistryCard ministry={ministry} index={index} actionLabel="View details" />
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#03202b]/70 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[61] flex max-h-[92svh] w-[min(56rem,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[2rem] bg-white text-[#102a43] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] focus:outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          {active ? (
            <>
              <Dialog.Close
                aria-label="Close"
                className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-[#03202b]/40 text-white backdrop-blur transition hover:rotate-90 hover:bg-[#03202b]/60"
              >
                <X className="size-5" />
              </Dialog.Close>
              <div key={active.number} className="animate-card-in min-h-0 flex-1 overflow-y-auto">
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] sm:h-64">
                  {image ? (
                    <img
                      key={image}
                      src={encodeURI(image)}
                      alt={active.title}
                      className="history-kenburns absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03202b] via-[#03202b]/55 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10">
                    <p className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.22em] text-[#ffcf4a] uppercase">
                      Ministry {active.number}
                      <span className="inline-flex items-center gap-1 tracking-normal text-white/80 normal-case">
                        <MapPin className="size-3.5" />
                        {active.place}
                      </span>
                    </p>
                    <Dialog.Title className="mt-2 font-heading text-3xl leading-tight font-semibold text-white sm:text-4xl">
                      {active.title}
                    </Dialog.Title>
                    {detail ? <p className="mt-1 text-sm text-white/80 sm:text-base">{detail.tagline}</p> : null}
                  </div>
                </div>

                <div className="px-6 py-8 sm:px-10">
                  <Dialog.Description className="text-base leading-8 text-[#3d4b59]">
                    {active.summary}
                  </Dialog.Description>

                  {detail ? (
                    <>
                      <div className="mt-6 space-y-4 leading-8 text-[#3d4b59]">
                        {detail.overview.map((paragraph) => (
                          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                        ))}
                      </div>

                      <dl className="mt-8 grid grid-cols-3 gap-3">
                        {detail.highlights.map((item) => (
                          <div
                            key={item.label}
                            className="rounded-2xl bg-[#f4fbfd] px-4 py-4 text-center ring-1 ring-[#17b3c6]/20"
                          >
                            <dd className="font-heading text-2xl font-semibold text-[#0a5062] sm:text-3xl">
                              {item.value}
                            </dd>
                            <dt className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-[#5c6b7a] uppercase">
                              {item.label}
                            </dt>
                          </div>
                        ))}
                      </dl>

                      <h3 className="mt-10 font-heading text-2xl font-semibold text-[#023e8a]">What we do</h3>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {detail.focus.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 rounded-2xl border border-[#d5dee6] bg-white p-4 leading-6"
                          >
                            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#17b3c6]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {detail.scripture ? (
                        <figure className="relative mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-[#06394a] to-[#0a5062] px-6 py-6 text-white sm:px-8">
                          <Quote aria-hidden="true" className="absolute -top-2 -right-2 size-20 text-white/10" />
                          <blockquote className="font-heading text-xl leading-snug italic">
                            “{detail.scripture.text}”
                          </blockquote>
                          <figcaption className="mt-2 text-sm font-semibold tracking-[0.16em] text-[#ffcf4a] uppercase">
                            {detail.scripture.reference}
                          </figcaption>
                        </figure>
                      ) : null}
                    </>
                  ) : (
                    <p className="mt-6 rounded-2xl bg-[#f4fbfd] p-5 text-sm leading-7 text-[#5c6b7a]">
                      Full details of this ministry will be published after confirmation with the Province.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e3ecf2] px-6 py-4 sm:px-10">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous ministry"
                    className="grid size-10 place-items-center rounded-full border border-[#d5dee6] text-[#0a5062] transition hover:border-[#17b3c6] hover:bg-[#f4fbfd]"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next ministry"
                    className="grid size-10 place-items-center rounded-full border border-[#d5dee6] text-[#0a5062] transition hover:border-[#17b3c6] hover:bg-[#f4fbfd]"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
                <Link
                  href="/contact"
                  className="rounded-full bg-[#0a5062] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#06394a]"
                >
                  Get involved
                </Link>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
