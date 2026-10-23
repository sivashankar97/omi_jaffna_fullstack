import type { Metadata } from "next"
import Image from "next/image"

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
        className="relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-white sm:px-8 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -bottom-40 -left-32 -z-10 size-[28rem] rounded-full bg-[#17b3c6] opacity-25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -top-32 right-0 -z-10 size-[24rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[120px] [animation-delay:-7s]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p
              className="history-rise flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm"
              style={{ "--rise-delay": "100ms" } as React.CSSProperties}
            >
              <span aria-hidden="true" className="history-line h-px w-10 bg-[#ffcf4a]" />
              Digital mission
            </p>
            <h1
              className="history-rise mt-4 font-heading text-4xl leading-[1.1] font-semibold text-balance sm:text-6xl"
              style={{ "--rise-delay": "250ms", color: "#ffffff" } as React.CSSProperties}
            >
              The screen is also a mission field
            </h1>
            <p
              className="history-rise mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg"
              style={{ "--rise-delay": "450ms" } as React.CSSProperties}
            >
              Technology should serve evangelization, human dignity and community. The church, the village, the school
              and the smartphone are all places where the Gospel can be shared.
            </p>
          </div>

          <div
            className="history-rise relative mx-auto w-full max-w-md"
            style={{ "--rise-delay": "350ms" } as React.CSSProperties}
          >
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#17b3c6]/40 to-[#ffcf4a]/30 blur-2xl"
            />
            <div className="charism-float relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
              <div className="group relative aspect-square overflow-hidden rounded-[1.5rem]">
                <Image
                  src={photos.topImage}
                  alt={photos.topImageAlt}
                  unoptimized={isUpload(photos.topImage)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                />
                <span aria-hidden="true" className="history-shine pointer-events-none absolute inset-0" />
              </div>
            </div>
          </div>
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
      />
      <MediaPublications publications={publications} />
    </>
  )
}
