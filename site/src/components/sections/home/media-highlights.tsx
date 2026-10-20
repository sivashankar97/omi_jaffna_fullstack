"use client"

import Link from "next/link"
import { ArrowUpRight, CalendarDays, Images, Radio } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/layout/site-footer"
import { useSiteInfo } from "@/components/layout/site-info"
import { Reveal } from "@/components/motion/reveal"
import type { HomeSectionsContent } from "@/content/blocks"
import { cn } from "cn"

function SocialRail({ shown }: { shown: boolean }) {
  const { social } = useSiteInfo()
  const socials = [
    { label: "YouTube", href: social.youtube, icon: YouTubeIcon, background: "#ff0000" },
    { label: "WhatsApp", href: social.whatsapp, icon: WhatsAppIcon, background: "#25d366" },
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
      className="fixed top-1/2 right-3 z-40 flex -translate-y-1/2 flex-col gap-3 sm:right-5"
    >
      {socials.map(({ label, href, icon: Icon, background }, index) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          tabIndex={shown ? 0 : -1}
          className="grid size-11 place-items-center rounded-full text-white shadow-[0_8px_20px_rgb(0_0_0/0.25)] ring-2 ring-white/70 hover:scale-110 sm:size-12 [&_svg]:size-6"
          style={{
            background,
            opacity: shown ? 1 : 0,
            transform: shown ? "translateX(0)" : "translateX(140%)",
            pointerEvents: shown ? "auto" : "none",
            transition: `opacity 0.4s ease ${index * 70}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 70}ms, scale 0.2s ease`,
          }}
        >
          <Icon />
        </a>
      ))}
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
    <section ref={ref} id="media-highlights" className="scroll-mt-80 bg-white px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal from="left">
            <h2 className="font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">{content.title}</h2>
            <p className="mt-2 text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">{content.kicker}</p>
          </Reveal>
          <Reveal from="right" delay={120}>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 rounded-full bg-[#17b3c6] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f9fb4]"
            >
              Open media
              <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 md:h-[26rem] md:grid-cols-[1.4fr_1fr] md:grid-rows-2">
          <Reveal from="left" className="md:row-span-2">
            <a
              href={social.youtube}
              target="_blank"
              rel="noreferrer"
              className="group relative flex h-72 overflow-hidden rounded-[1.75rem] md:h-full"
            >
              <img
                src={content.liveImage}
                alt=""
                className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[#03202b] via-[#03202b]/40 to-transparent" />
              <span className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 text-white sm:p-8">
                <span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ff2d2d] px-3 py-1 text-[11px] font-bold tracking-[0.2em] uppercase">
                    <span className="size-2 rounded-full bg-white motion-safe:animate-pulse" />
                    Live
                  </span>
                  <span className="mt-3 block font-heading text-3xl font-semibold sm:text-4xl">{content.liveTitle}</span>
                  <span className="mt-1 block text-sm text-white/80">{content.liveText}</span>
                </span>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#ff0000] transition group-hover:rotate-45">
                  <Radio className="size-5" />
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal from="right" delay={150}>
            <Link
              href="/news"
              className="group relative flex h-48 overflow-hidden rounded-[1.75rem] md:h-full"
            >
              <img
                src={content.eventsImage}
                alt=""
                className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-r from-[#023e8a]/85 to-transparent" />
              <span className="relative my-auto flex items-center gap-4 p-6 text-white">
                <span className="grid size-12 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/50 backdrop-blur">
                  <CalendarDays className="size-5" />
                </span>
                <span>
                  <span className="block font-heading text-2xl font-semibold">{content.eventsTitle}</span>
                  <span className="text-sm text-white/80">{content.eventsText}</span>
                </span>
              </span>
            </Link>
          </Reveal>

          <Reveal from="right" delay={300}>
            <Link
              href="/media"
              className="group relative grid h-48 grid-cols-3 gap-1.5 overflow-hidden rounded-[1.75rem] bg-[#17b3c6] p-1.5 md:h-full"
            >
              {content.photos.slice(0, 3).map((src, index) => (
                <img
                  key={`${index}-${src}`}
                  src={src}
                  alt=""
                  className={cn(
                    "size-full rounded-[1.25rem] object-cover transition duration-500",
                    index === 1 ? "group-hover:-translate-y-1" : "group-hover:translate-y-1"
                  )}
                />
              ))}
              <span className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between rounded-b-[1.25rem] bg-gradient-to-t from-[#03202b]/90 to-transparent px-5 pt-10 pb-4 text-white">
                <span className="flex items-center gap-2 font-heading text-2xl font-semibold">
                  <Images className="size-5" />
                  Photos
                </span>
                <ArrowUpRight className="size-5 transition group-hover:rotate-45" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>

      {mounted ? createPortal(<SocialRail shown={inView} />, document.body) : null}
    </section>
  )
}
