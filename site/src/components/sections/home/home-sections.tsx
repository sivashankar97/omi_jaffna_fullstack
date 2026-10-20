import Link from "next/link"
import { ArrowRight, Compass, Eye, HandHeart } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { MinistryCard } from "@/components/sections/ministry-card"
import { ministryAnchor } from "@/config/navigation"
import { Button } from "@/components/ui/button"
import { JourneyPath } from "@/components/sections/home/journey-path"
import { HomeContact } from "@/components/sections/home/home-contact"
import { JoinUs } from "@/components/sections/home/join-us"
import { MediaHighlights } from "@/components/sections/home/media-highlights"
import { ProvinceCalendar } from "@/components/sections/home/province-calendar"
import { NewsMarquee } from "@/components/sections/news/news-marquee"
import { getBlock, getEvents, getHomeContent, getMinistries, getNews } from "@/lib/cms"

const pillarIcons = [HandHeart, Compass, Eye]

const pathStyles = [
  { id: "formation", accent: "#8cc8ff", shape: "3rem 0.75rem 3rem 0.75rem" },
  { id: "beyond", accent: "#ffb98f", shape: "10rem 10rem 1.5rem 1.5rem" },
  { id: "office", accent: "#bfe58a", shape: "0.75rem 3rem 0.75rem 3rem" },
]

export async function HomeSections() {
  const [ministries, latestNews, events, { welcome }, home, journey] = await Promise.all([
    getMinistries(),
    getNews(),
    getEvents(),
    getHomeContent(),
    getBlock("home-sections"),
    getBlock("journey"),
  ])
  const pillars = home.pillars.items.map((item, index) => ({ ...item, icon: pillarIcons[index % pillarIcons.length] }))
  const paths = home.paths.map((path, index) => ({ ...pathStyles[index % pathStyles.length], ...path }))
  return (
    <>
      <section id="welcome" className="welcome-stage relative scroll-mt-80 px-4 py-16 sm:px-8 sm:py-20">
        <div className="welcome-band" aria-hidden="true" />
        <Reveal className="welcome-card relative mx-auto grid max-w-6xl overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
          <div className="px-7 py-10 sm:px-12 sm:py-14">
            <p className="welcome-ink font-heading text-4xl leading-tight font-semibold sm:text-5xl">Welcome</p>
            <h2 className="welcome-soft mt-3 text-sm font-semibold tracking-[0.22em] uppercase">
              {home.welcome.kicker}
            </h2>
            {welcome.map((paragraph) => (
              <p key={paragraph} className="welcome-soft mt-5 max-w-xl text-base leading-7">
                {paragraph}
              </p>
            ))}
            <dl className="mt-7 grid max-w-md grid-cols-3 gap-3">
              {home.welcome.stats.map((stat) => (
                <div key={stat.label} className="welcome-stat rounded-2xl px-3 py-3">
                  <dt className="welcome-soft text-[11px] tracking-[0.16em] uppercase">{stat.label}</dt>
                  <dd className="welcome-ink mt-1 font-heading text-2xl font-semibold sm:text-3xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/charism#about" className="welcome-btn-solid rounded-full px-5 py-2.5 text-sm font-bold">
                Our story
              </Link>
              <Link href="/ministries" className="welcome-btn-soft rounded-full px-5 py-2.5 text-sm font-bold">
                Our ministries
              </Link>
            </div>
          </div>
          <div className="welcome-photo flex items-center justify-center p-6 sm:p-10">
            <img
              src={home.welcome.image}
              alt={home.welcome.imageAlt}
              className="welcome-float h-auto max-h-[26rem] w-full rounded-[1.4rem] object-contain"
            />
          </div>
        </Reveal>
      </section>

      <section id="pillars" className="pillar-stage scroll-mt-80 overflow-hidden px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <Reveal from="up">
            <p className="pillar-kicker text-sm font-semibold tracking-[0.22em] uppercase">{home.pillars.kicker}</p>
            <h2 className="pillar-title mt-2 font-heading text-4xl font-semibold sm:text-5xl">{home.pillars.title}</h2>
            <span className="pillar-rule mx-auto mt-5 block" aria-hidden="true" />
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {pillars.map((item, index) => {
              const Icon = item.icon
              return (
                <Reveal
                  key={item.title}
                  from={index === 0 ? "left" : index === 2 ? "right" : "up"}
                  delay={index === 1 ? 0 : 150}
                  className="h-full"
                >
                  <Link href={item.href} className="pillar-item group flex h-full flex-col items-center px-4 py-6">
                    <span className="pillar-icon flex size-20 items-center justify-center rounded-full">
                      <Icon aria-hidden="true" className="size-9" strokeWidth={2.2} />
                    </span>
                    <h3 className="pillar-name mt-6 font-heading text-2xl font-semibold">{item.title}</h3>
                    <p className="pillar-text mt-3 max-w-xs text-sm leading-6">{item.text}</p>
                  </Link>
                </Reveal>
              )
            })}
          </div>
          <Reveal from="up" delay={450}>
            <Link href="/charism" className="pillar-btn mt-10 inline-block rounded-full px-7 py-3 text-sm font-bold tracking-wide uppercase">
              Read more
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="ministries" className="ministry-stage relative scroll-mt-80 overflow-hidden px-4 pt-20 pb-20 sm:px-8">
        <span aria-hidden="true" className="ministry-blob ministry-blob-left" />
        <span aria-hidden="true" className="ministry-blob ministry-blob-right" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal from="left">
            <p className="ministry-heading font-heading text-4xl leading-tight font-semibold sm:text-5xl">
              {home.ministries.title}
            </p>
            <h2 className="ministry-sub mt-2 text-sm font-semibold tracking-[0.22em] uppercase">
              {home.ministries.kicker}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.slice(0, 6).map((ministry, index) => (
              <Reveal
                key={ministry.number}
                from={index % 3 === 0 ? "left" : index % 3 === 2 ? "right" : "zoom"}
                delay={(index % 3) * 120}
                className="h-full"
              >
                <MinistryCard
                  ministry={ministry}
                  index={index}
                  href={`/ministries#${ministryAnchor(ministry.number)}`}
                />
              </Reveal>
            ))}
          </div>
          <Reveal from="right" delay={150} className="mt-12 flex justify-end">
            <Button
              asChild
              className="lightning-ring group relative h-auto gap-2 rounded-full border-0 bg-[#17b3c6] px-7 py-3 text-sm font-bold text-white hover:bg-[#0f9fb4]"
            >
              <Link href="/ministries">
                All ministries
                <ArrowRight aria-hidden="true" className="ministry-arrow size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden py-10 sm:py-14">
        <div className="relative w-full px-6 py-20 sm:px-10 sm:py-28">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_24px_40px_rgb(6_22_60/0.28)]"
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="paths-blob-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0f9fb4" />
                <stop offset="55%" stopColor="#17b3c6" />
                <stop offset="100%" stopColor="#0e98ac" />
              </linearGradient>
              <radialGradient id="paths-blob-glow-a" cx="0.12" cy="0.1" r="0.35">
                <stop offset="0%" stopColor="#7fe3ef" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7fe3ef" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="paths-blob-glow-b" cx="0.9" cy="0.95" r="0.35">
                <stop offset="0%" stopColor="#087f91" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#087f91" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M0 40C150 0 300 50 450 30S750 0 1000 40V262C850 300 700 250 550 270S250 300 0 262Z"
              fill="url(#paths-blob-fill)"
            />
            <path d="M0 40C150 0 300 50 450 30S750 0 1000 40V262C850 300 700 250 550 270S250 300 0 262Z" fill="url(#paths-blob-glow-a)" />
            <path d="M0 40C150 0 300 50 450 30S750 0 1000 40V262C850 300 700 250 550 270S250 300 0 262Z" fill="url(#paths-blob-glow-b)" />
          </svg>
          <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-3 lg:items-stretch">
            {paths.map((path, index) => (
              <Reveal
                key={path.id}
                from={index === 0 ? "left" : index === 2 ? "right" : "up"}
                delay={index === 1 ? 0 : 150}
                className="h-full"
              >
                <Link
                  id={path.id}
                  href={path.href}
                  className="paths-glass flex h-full scroll-mt-80 flex-col px-7 pb-8 text-white transition duration-300 hover:-translate-y-1.5"
                  style={{ borderRadius: path.shape, paddingTop: index === 1 ? "4.5rem" : "2rem" }}
                >
                  <span
                    className="w-fit rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-[#06364a] uppercase"
                    style={{ backgroundColor: path.accent }}
                  >
                    {path.kicker}
                  </span>
                  <h2 className="mt-4 font-heading text-2xl leading-tight font-semibold text-white sm:text-3xl">
                    {path.title}
                  </h2>
                  <span aria-hidden="true" className="mt-5 block border-t-2 border-dotted border-white/35" />
                  <p className="mt-5 flex gap-3 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/90">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: path.accent }}
                    />
                    {path.text}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="latest-news" className="scroll-mt-80 bg-[#f7fbff] pt-4 pb-16">
        <Reveal from="up" className="mx-auto mb-6 max-w-6xl px-4 sm:px-8">
          <h2 className="font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">{home.news.title}</h2>
          <p className="mt-2 text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">{home.news.kicker}</p>
        </Reveal>
        <NewsMarquee articles={latestNews} />
      </section>

      <MediaHighlights content={home.media} />

      <JourneyPath eras={journey.eras} />

      <section id="family" className="scroll-mt-80 bg-[#f7fbff] px-4 py-16 text-[#023e8a] sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
          <Reveal>
            <p className="font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">
              {home.family.title}
            </p>
            <h2 className="mt-3 text-sm font-semibold tracking-[0.18em] text-[#0077b6] uppercase">
              {home.family.kicker}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-[#5c6b7a]">{home.family.text}</p>
          </Reveal>
          <Reveal delay={120} className="grid gap-3">
            <Link
              href="/news"
              className="rounded-2xl bg-[#0077b6] px-5 py-4 font-semibold text-white transition hover:bg-[#023e8a]"
            >
              Province news
            </Link>
            <a
              href="https://www.omiworld.org/"
              className="rounded-2xl bg-[#ffbf00] px-5 py-4 font-semibold text-[#023e8a] transition hover:bg-[#ffd24d]"
            >
              OMI World
            </a>
            <a
              href="https://omicolombo.org/"
              className="rounded-2xl bg-[#5b21b6] px-5 py-4 font-semibold text-white transition hover:bg-[#4c1d95]"
            >
              OMI Colombo Province
            </a>
          </Reveal>
        </div>
      </section>

      <ProvinceCalendar events={events} />
      <JoinUs content={home.joinUs} />
      <HomeContact content={home.contact} />
    </>
  )
}
