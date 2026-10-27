"use client"

import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"

import { MotionFloat, MotionHero } from "@/components/motion/motion-reveal"
import { Button } from "@/components/ui/button"
import type { BlockContent } from "@/content/blocks"
import type { HomeContent } from "@/lib/cms"

export function HeroSection({ hero, media }: { hero: HomeContent["hero"]; media: BlockContent<"home">["hero"] }) {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[calc(100svh-8.5rem)] scroll-mt-40 flex-col justify-center overflow-hidden bg-[#092f3d] text-white"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={media.posterImage}
        key={media.video}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_42%]"
      >
        {media.video ? <source src={media.video} type="video/mp4" /> : null}
      </video>
      {/* Dark gradient — video stays visible, text stays readable */}
      <div
        className="absolute inset-0 z-10 bg-[linear-gradient(105deg,rgba(4,31,42,0.82)_0%,rgba(4,31,42,0.62)_48%,rgba(4,31,42,0.28)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-12 sm:gap-12 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="max-w-2xl">
          <MotionHero delay={80} className="text-[11px] font-semibold tracking-[0.22em] text-[#ffcf4a] uppercase sm:text-xs">
            <p>
              {hero.eyebrow} <span className="px-1.5 text-white/45">·</span> {hero.years}
            </p>
          </MotionHero>
          <MotionHero delay={180} className="mt-4 sm:mt-5">
            <h1 className="font-heading text-4xl leading-[1.06] font-bold text-balance text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {hero.title}
            </h1>
          </MotionHero>
          <MotionHero delay={280} className="mt-4 max-w-xl sm:mt-5">
            <p className="text-base font-medium leading-7 text-white/88 sm:text-lg sm:leading-8">
              {hero.tagline}
              {hero.lede ? ` ${hero.lede}` : null}
            </p>
          </MotionHero>
          <MotionHero delay={420} className="mt-7 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full border-transparent bg-[#17b3c6] px-6 text-white shadow-[0_8px_24px_-8px_rgba(23,179,198,0.7)] hover:bg-[#0e98ac]"
            >
              <Link href="/ministries">Explore our mission</Link>
            </Button>
            <Link
              href="/vocations"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/55 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Join the mission
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </MotionHero>
        </div>

        <MotionFloat delay={360} className="lg:justify-self-end">
          <figure className="hero-quote-card max-w-md rounded-[1.75rem] border border-white/25 bg-white/12 px-6 py-6 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-7 sm:py-7">
            <blockquote className="font-heading text-xl leading-snug font-semibold text-white sm:text-2xl">
              “{hero.quote}”
            </blockquote>
            <figcaption className="mt-3 text-xs font-semibold tracking-[0.14em] text-[#ffcf4a] uppercase">
              Luke 4:18 · Oblate charism
            </figcaption>
          </figure>

          <dl className="mt-7 grid grid-cols-3 gap-4 sm:mt-8 sm:gap-6">
            <div>
              <dd className="font-heading text-3xl font-bold text-[#ffcf4a] sm:text-4xl">1847</dd>
              <dt className="mt-1 text-[10px] font-bold tracking-[0.16em] text-white/75 uppercase sm:text-[11px]">
                Founded
              </dt>
            </div>
            <div>
              <dd className="font-heading text-3xl font-bold text-[#ffcf4a] sm:text-4xl">1847</dd>
              <dt className="mt-1 text-[10px] font-bold tracking-[0.16em] text-white/75 uppercase sm:text-[11px]">
                Jaffna
              </dt>
            </div>
            <div>
              <dd className="font-heading text-3xl font-bold text-[#ffcf4a] sm:text-4xl">17+</dd>
              <dt className="mt-1 text-[10px] font-bold tracking-[0.16em] text-white/75 uppercase sm:text-[11px]">
                Ministries
              </dt>
            </div>
          </dl>
        </MotionFloat>
      </div>

      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 w-full fill-[var(--home-bg,#F8FBFF)] sm:h-12 dark:fill-[#071422]"
        viewBox="0 30 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 70c33-22 67-22 100 0c47 18 93 18 140 0c60-34 120-34 180 0c30 12 60 12 90 0c40-18 80-18 120 0c53 26 107 26 160 0c27-14 53-14 80 0c37 16 73 16 110 0c67-30 133-30 200 0c33 20 67 20 100 0c30-16 60-16 90 0c23 10 47 10 70 0V120H0Z" />
      </svg>

      <Link
        href="#welcome"
        aria-label="Scroll to welcome"
        className="absolute bottom-10 left-1/2 z-20 hidden size-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/45 bg-white/10 text-white backdrop-blur-sm transition hover:border-[#17b3c6] hover:text-[#17b3c6] sm:bottom-14 sm:flex"
      >
        <ArrowDown aria-hidden="true" className="size-4" />
      </Link>
    </section>
  )
}
