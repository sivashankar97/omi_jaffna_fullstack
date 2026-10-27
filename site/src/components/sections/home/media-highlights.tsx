"use client"

import Link from "next/link"
import { ArrowUpRight, CalendarDays, Images, Newspaper, Radio } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/layout/site-footer"
import { useSiteInfo } from "@/components/layout/site-info"
import { MotionReveal } from "@/components/motion/motion-reveal"
import type { HomeSectionsContent } from "@/content/blocks"
import { cn } from "cn"

function ArrowBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "absolute top-3.5 right-3.5 z-10 grid size-8 place-items-center rounded-full transition group-hover:rotate-45",
        dark
          ? "bg-white/10 text-white ring-1 ring-white/25"
          : "bg-[#e7fbff] text-[#023e8a] ring-1 ring-[#cfeef4]"
      )}
    >
      <ArrowUpRight className="size-3.5" />
    </span>
  )
}

function SocialRail({ shown }: { shown: boolean }) {
  const { social } = useSiteInfo()
  const socials = [
    { label: "YouTube", href: social.youtube, icon: YouTubeIcon, background: "#ff0000" },
    {
      label: "Instagram",
      href: social.instagram,
      icon: InstagramIcon,
      background: "linear-gradient(45deg, #f9ce34, #ee2a7b 50%, #6228d7)",
    },
    { label: "Facebook", href: social.facebook, icon: FacebookIcon, background: "#1877f2" },
  ]
  return (
    <nav
      aria-label="Province social media"
      className="pointer-events-none fixed top-1/2 right-0 z-40 w-16 -translate-y-1/2 overflow-hidden pr-3 sm:w-[4.25rem] sm:pr-5"
    >
      <div
        className="flex flex-col gap-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateX(0)" : "translateX(110%)",
        }}
      >
        {socials.map(({ label, href, icon: Icon, background }, index) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            tabIndex={shown ? 0 : -1}
            className="pointer-events-auto grid size-11 place-items-center rounded-full text-white shadow-[0_8px_20px_rgb(0_0_0/0.25)] ring-2 ring-white/70 hover:scale-110 sm:size-12 [&_svg]:size-6"
            style={{
              background,
              pointerEvents: shown ? "auto" : "none",
              transition: `transform 0.2s ease ${index * 40}ms`,
            }}
          >
            <Icon />
          </a>
        ))}
      </div>
    </nav>
  )
}

export function MediaHighlights({ content }: { content: HomeSectionsContent["media"] }) {
  const { social } = useSiteInfo()
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.25,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="media-highlights" className="calendar-stage scroll-mt-80 px-4 py-16 sm:px-8">
      <div className="relative mx-auto max-w-6xl">
        <MotionReveal from="up" className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">
            What you&apos;ll find in{" "}
            <span className="bg-gradient-to-r from-[#17b3c6] to-[#0e98ac] bg-clip-text text-transparent">Media</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5c6b7a] sm:text-base">
            Live broadcasts, province events, photo galleries and stories from the Oblate Province of Jaffna.
          </p>
        </MotionReveal>

        <div className="mt-10 grid gap-4 md:h-[34rem] md:grid-cols-3 md:gap-5">
          {/* Column 1 — tall Live + short News */}
          <div className="grid gap-4 md:grid-rows-[1.45fr_0.7fr] md:gap-5">
            <MotionReveal from="left" className="min-h-0">
              <a
                href={social.youtube}
                target="_blank"
                rel="noreferrer"
                className="group media-bento-card media-bento-shine calendar-glass-deep relative flex h-full min-h-64 flex-col overflow-hidden rounded-[1.75rem] p-5 sm:p-6 md:min-h-0"
              >
                <ArrowBadge dark />
                <div className="relative mb-4 min-h-32 flex-1 overflow-hidden rounded-2xl ring-1 ring-white/15">
                  <img
                    src={content.liveImage}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#03202b] via-[#03202b]/40 to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-[#ff5a5a] px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-white uppercase">
                    <span className="size-1.5 rounded-full bg-white motion-safe:animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="pr-10 font-heading text-2xl font-bold leading-tight text-white sm:text-[1.7rem]">
                  {content.liveTitle}
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm text-white/70">{content.liveText}</p>
              </a>
            </MotionReveal>

            <MotionReveal from="left" delay={120} className="min-h-0">
              <Link
                href="/news"
                className="group media-bento-card media-bento-shine calendar-glass relative flex h-full min-h-[8.5rem] items-center gap-4 overflow-hidden rounded-[1.75rem] p-5 md:min-h-0"
              >
                <ArrowBadge />
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7fbff] text-[#0e98ac] ring-1 ring-[#cfeef4]">
                  <Newspaper className="size-5" />
                </span>
                <p className="pr-8 font-heading text-xl font-bold leading-tight text-[#023e8a] sm:text-2xl">
                  Latest <span className="font-semibold text-[#5c6b7a]">province updates</span>
                </p>
              </Link>
            </MotionReveal>
          </div>

          {/* Column 2 — short Events + tall Photos */}
          <div className="grid gap-4 md:grid-rows-[0.7fr_1.45fr] md:gap-5">
            <MotionReveal from="up" delay={80} className="min-h-0">
              <Link
                href="/#calendar"
                className="group media-bento-card media-bento-shine calendar-glass relative flex h-full min-h-[8.5rem] flex-col justify-between overflow-hidden rounded-[1.75rem] p-5 md:min-h-0"
              >
                <ArrowBadge />
                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#e7fbff] text-[#0e98ac] ring-1 ring-[#cfeef4]">
                  <CalendarDays className="size-5" />
                </span>
                <p className="pr-10 font-heading text-xl font-bold leading-tight text-[#023e8a] sm:text-2xl">
                  {content.eventsTitle}{" "}
                  <span className="font-semibold text-[#5c6b7a]">{content.eventsText}</span>
                </p>
              </Link>
            </MotionReveal>

            <MotionReveal from="up" delay={140} className="min-h-0">
              <Link
                href="/media"
                className="group media-bento-card media-bento-shine relative flex h-full min-h-64 flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#17b3c6] via-[#0e98ac] to-[#023e8a] p-5 text-white shadow-[0_24px_48px_-28px_rgb(2_62_138/0.55)] ring-1 ring-white/25 sm:p-6 md:min-h-0"
              >
                <ArrowBadge dark />
                <span className="mb-4 flex size-14 items-center justify-center rounded-full border border-dashed border-white/55">
                  <Images className="size-6" />
                </span>
                <div className="mb-4 grid min-h-0 flex-1 grid-cols-3 gap-2">
                  {content.photos.slice(0, 3).map((src, index) => (
                    <span
                      key={`${index}-${src}`}
                      className="relative min-h-24 overflow-hidden rounded-xl ring-1 ring-white/25 md:min-h-0"
                    >
                      <img
                        src={src}
                        alt=""
                        className={cn(
                          "absolute inset-0 size-full object-cover transition duration-500",
                          index === 1 ? "group-hover:-translate-y-1" : "group-hover:translate-y-0.5"
                        )}
                      />
                    </span>
                  ))}
                </div>
                <p className="pr-10 font-heading text-2xl font-bold leading-tight sm:text-[1.7rem]">
                  Photos <span className="font-semibold text-white/80">from the Province</span>
                </p>
              </Link>
            </MotionReveal>
          </div>

          {/* Column 3 — tall image + short Media CTA */}
          <div className="grid gap-4 md:grid-rows-[1.45fr_0.7fr] md:gap-5">
            <MotionReveal from="right" delay={100} className="min-h-0">
              <Link
                href="/news"
                className="group media-bento-card media-bento-shine relative flex h-full min-h-64 overflow-hidden rounded-[1.75rem] md:min-h-0"
              >
                <img
                  src={content.eventsImage}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#03202b] via-[#03202b]/45 to-[#03202b]/10" />
                <span className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/25" />
                <ArrowBadge dark />
                <span className="relative mt-auto p-5 text-white sm:p-6">
                  <span className="block font-heading text-2xl font-bold leading-tight sm:text-[1.7rem]">
                    Province news
                  </span>
                  <span className="mt-1.5 block text-sm text-white/80">Stories, feasts and celebrations</span>
                </span>
              </Link>
            </MotionReveal>

            <MotionReveal from="right" delay={180} className="min-h-0">
              <Link
                href="/media"
                className="group media-bento-card media-bento-shine calendar-glass relative flex h-full min-h-[8.5rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-5 md:min-h-0"
              >
                <ArrowBadge />
                <span className="mb-3 flex size-9 items-center justify-center rounded-full bg-[#ffcf4a] text-[#03202b]">
                  <Radio className="size-4" />
                </span>
                <p className="pr-10 font-heading text-xl font-bold leading-tight text-[#023e8a] sm:text-2xl">
                  <span className="bg-gradient-to-r from-[#17b3c6] via-[#0e98ac] to-[#ffcf4a] bg-clip-text text-transparent">
                    Media
                  </span>{" "}
                  <span className="font-semibold text-[#5c6b7a]">that connects</span>
                </p>
              </Link>
            </MotionReveal>
          </div>
        </div>
      </div>

      {mounted ? createPortal(<SocialRail shown={inView} />, document.body) : null}
    </section>
  )
}
