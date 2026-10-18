import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { HomeContent } from "@/lib/cms"

export function HeroSection({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section id="hero" className="relative isolate flex min-h-[calc(100svh-17rem)] scroll-mt-80 flex-col justify-center overflow-hidden bg-[#092f3d] text-white">
      <Image
        src="/Herosection/Heroimage_4.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-[center_42%]"
      />
      <div
        className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(4,31,42,0.94)_0%,rgba(4,31,42,0.76)_46%,rgba(4,31,42,0.35)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto grid w-full max-w-7xl items-end gap-8 px-5 py-10 sm:gap-12 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#ffcf4a] uppercase sm:text-sm">
            {hero.eyebrow} <span className="px-2 text-white/55">/</span> {hero.years}
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.08] font-semibold text-balance sm:mt-5 sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-4 text-lg font-medium text-white sm:mt-5 sm:text-2xl">
            {hero.tagline}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:mt-4 sm:text-lg sm:leading-7">
            {hero.lede}
          </p>
          <div className="mt-6 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
            <Button asChild size="lg" className="h-12 gap-3 border-transparent bg-[#ffbf00] px-5 text-[#102a43] hover:bg-[#ffd24d]">
              <Link href="/ministries">
                Explore our mission
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <Link href="/vocations" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#ffcf4a]">
              Join the mission <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="border-l border-white/35 pl-6 sm:pl-8 lg:mb-2">
          <p className="max-w-sm font-heading text-xl leading-snug font-medium text-white sm:text-3xl">
            “{hero.quote}”
          </p>
          <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-white/30 pt-4 sm:mt-8 sm:pt-5">
            <div className="flex flex-col">
              <dt className="order-2 mt-1 text-xs text-white/75 sm:text-sm">Ceylon</dt>
              <dd className="order-1 font-heading text-2xl font-semibold text-[#ffcf4a] sm:text-3xl">1847</dd>
            </div>
            <div className="flex flex-col">
              <dt className="order-2 mt-1 text-xs text-white/75 sm:text-sm">Jaffna</dt>
              <dd className="order-1 font-heading text-2xl font-semibold text-[#ffcf4a] sm:text-3xl">1848</dd>
            </div>
            <div className="flex flex-col">
              <dt className="order-2 mt-1 text-xs text-white/75 sm:text-sm">Ministries</dt>
              <dd className="order-1 font-heading text-2xl font-semibold text-[#ffcf4a] sm:text-3xl">17</dd>
            </div>
          </dl>
        </div>
      </div>

      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12 w-full fill-white sm:h-20 dark:fill-[#071422]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 68c40-26 80-26 120 0s80 26 120 0 80-26 120 0 80 26 120 0 80-26 120 0 80 26 120 0 80-26 120 0 80 26 120 0 80-26 120 0 80 26 120 0 80-26 120 0 80 26 120 0V120H0Z" />
      </svg>

      <Link href="#welcome" aria-label="Scroll to welcome" className="absolute right-6 bottom-14 sm:bottom-24 z-20 hidden size-10 items-center justify-center border border-white/50 text-white transition-colors hover:border-[#ffcf4a] hover:text-[#ffcf4a] sm:flex">
        <ArrowDown aria-hidden="true" className="size-4" />
      </Link>
    </section>
  )
}
