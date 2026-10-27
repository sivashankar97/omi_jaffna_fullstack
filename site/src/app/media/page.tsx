import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { ArrowRight } from "lucide-react"

import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { MediaPublications } from "@/components/sections/media/media-publications"
import { MediaStudio } from "@/components/sections/media/media-studio"
import { SocialSignals } from "@/components/sections/media/social-signals"
import { isUpload } from "@/content/site-info"
import { getBlock, getHomeContent, getMinistries, getNews, getPublications } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Media",
  description: "Digital mission, photos, video, reflections and publications of the Oblate Province of Jaffna.",
}

export default async function MediaPage() {
  const [news, ministries, publications, { hero }, photos] = await Promise.all([
    getNews(),
    getMinistries(),
    getPublications(),
    getHomeContent(),
    getBlock("media-page"),
  ])

  return (
    <>
      <ScrollProgress />
      <header
        id="digital-mission"
        className="relative isolate scroll-mt-80 overflow-hidden px-4 pt-20 pb-28 text-white sm:px-8 sm:pt-24 sm:pb-32"
      >
        <Image
          src={photos.topImage}
          alt=""
          unoptimized={isUpload(photos.topImage)}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-[#03202b]/92 via-[#06394a]/88 to-[#0a5062]/90"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#17b3c6]/25 mix-blend-multiply"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[8%] -z-10 size-[22rem] rounded-full bg-[#17b3c6]/30 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-[radial-gradient(ellipse_at_bottom,rgba(23,179,198,0.4),transparent_70%)]"
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 w-full text-[#f4fafc] sm:h-32"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64 C240,120 480,8 720,48 C960,88 1200,112 1440,40 L1440,120 L0,120 Z"
          />
          <path
            fill="currentColor"
            opacity="0.55"
            d="M0,88 C280,40 520,110 760,72 C1000,34 1240,20 1440,68 L1440,120 L0,120 Z"
          />
        </svg>

        <div className="relative mx-auto max-w-3xl">
          <p className="history-rise text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm">
            {photos.hero.kicker}
          </p>
          <h1 className="history-rise mt-4 font-heading text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-6xl">
            {photos.hero.title}
          </h1>
          <p className="history-rise mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
            {photos.hero.summary}
          </p>
          <Link
            href={photos.hero.ctaHref || "#social-signals"}
            className="history-rise mt-8 inline-flex items-center gap-2 rounded-full bg-[#17b3c6] px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_36px_-16px_rgba(23,179,198,0.9)] transition hover:bg-[#0e98ac]"
          >
            {photos.hero.cta || "Explore our media"}
            <ArrowRight className="size-4" strokeWidth={2.5} />
          </Link>
        </div>
      </header>

      <SocialSignals />
      <MediaStudio
        news={news}
        ministries={ministries}
        quote={hero.quote}
        lede={hero.lede}
        photos={photos.gallery}
        videoImage={photos.videoImage}
        desksCopy={photos.desks}
      />
      <MediaPublications publications={publications} copy={photos.publications} />
    </>
  )
}
