import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, ChevronRight, MapPin } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ShareButtons } from "@/components/sections/news/share-buttons"
import { isUpload } from "@/content/site-info"
import { getEvent } from "@/lib/cms"

type EventPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: "Event" }
  return { title: `${event.title} · Events`, description: event.summary || `${event.title}, ${event.dateLabel}` }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const photos = event.gallery.length ? event.gallery : event.image ? [{ src: event.image, alt: event.title, caption: "" }] : []
  const [cover, ...more] = photos

  return (
    <article className="bg-white text-[#102a43]">
      <header className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-8 sm:pt-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#6b7a88]">
          <Link href="/" className="transition hover:text-[#0a5062]">
            Home
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <Link href="/#calendar" className="transition hover:text-[#0a5062]">
            Calendar
          </Link>
          <ChevronRight aria-hidden="true" className="size-3.5" />
          <span className="text-[#0a8ea0]">Event</span>
        </nav>

        <p className="mt-8 text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">Province event</p>
        <h1 className="mt-3 font-heading text-3xl leading-[1.15] font-semibold text-balance text-[#03202b] sm:text-5xl">
          {event.title}
        </h1>
        {event.summary ? <p className="mt-5 text-lg leading-8 text-[#3d4b59] sm:text-xl">{event.summary}</p> : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#e6edf2] py-4">
          <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#3d4b59]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-4 text-[#0e98ac]" />
              {event.dateLabel}
            </span>
            {event.place ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4 text-[#0e98ac]" />
                {event.place}
              </span>
            ) : null}
          </p>
          <ShareButtons title={event.title} />
        </div>
      </header>

      {cover ? (
        <figure className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-[#eef6f8]">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(max-width:1024px) 100vw, 1024px"
              className="object-cover"
              unoptimized={isUpload(cover.src)}
              priority
            />
          </div>
          {cover.caption ? (
            <figcaption className="mt-3 border-l-2 border-[#17b3c6] pl-3 text-sm leading-6 text-[#6b7a88]">{cover.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="mx-auto max-w-[42rem] space-y-6 px-4 py-12 text-lg leading-9 text-[#22313f] sm:px-0">
        {event.paragraphs.length ? (
          event.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 60)}>{paragraph}</p>)
        ) : (
          <p className="text-[#5c6b7a]">{event.summary || "More details will be added soon."}</p>
        )}
      </div>

      {more.length ? (
        <section className="bg-[#f4fbfd] px-4 py-14 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading text-2xl font-semibold text-[#03202b] sm:text-3xl">Photos</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((photo, index) => (
                <li key={`${photo.src}-${index}`}>
                  <Reveal from="up" delay={(index % 3) * 80}>
                    <figure className="overflow-hidden rounded-[1.25rem] bg-white shadow-[0_18px_40px_-32px_rgba(10,60,80,0.45)]">
                      <div className="relative aspect-[4/3] bg-[#eef6f8]">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-cover"
                          unoptimized={isUpload(photo.src)}
                        />
                      </div>
                      {photo.caption ? <figcaption className="px-4 py-3 text-sm text-[#5c6b7a]">{photo.caption}</figcaption> : null}
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <Link
          href="/#calendar"
          className="inline-flex items-center gap-2 rounded-full bg-[#eef6f8] px-4 py-2 text-sm font-semibold text-[#0a5062] transition hover:bg-[#dff1f5]"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to the calendar
        </Link>
      </div>
    </article>
  )
}
