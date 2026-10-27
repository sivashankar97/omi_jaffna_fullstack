import Link from "next/link"
import { ArrowRight, ArrowUpRight, Compass, Eye, HandHeart } from "lucide-react"

import { MotionItem, MotionReveal, MotionStagger } from "@/components/motion/motion-reveal"
import { MinistryCard } from "@/components/sections/ministry-card"
import { ministryHref } from "@/config/navigation"
import { Button } from "@/components/ui/button"
import { JourneyPath } from "@/components/sections/home/journey-path"
import { HomeContact } from "@/components/sections/home/home-contact"
import { JoinUs } from "@/components/sections/home/join-us"
import { MediaHighlights } from "@/components/sections/home/media-highlights"
import { ProvinceCalendar } from "@/components/sections/home/province-calendar"
import { BirthdayFloat } from "@/components/sections/home/birthday-float"
import { WelcomeScene } from "@/components/sections/home/welcome-scene"
import { NewsMarquee } from "@/components/sections/news/news-marquee"
import { getBlock, getHomeContent, getMinistries, getNews, getProvinceCalendar, getTodaysBirthdays } from "@/lib/cms"

const pillarIcons = [HandHeart, Compass, Eye]

const pathStyles = [
  { id: "formation", accent: "#8cc8ff", shape: "3rem 0.75rem 3rem 0.75rem" },
  { id: "beyond", accent: "#ffb98f", shape: "10rem 10rem 1.5rem 1.5rem" },
  { id: "office", accent: "#bfe58a", shape: "0.75rem 3rem 0.75rem 3rem" },
]

export async function HomeSections() {
  const [ministries, latestNews, events, todaysBirthdays, { welcome }, home, journey] = await Promise.all([
    getMinistries(),
    getNews(),
    getProvinceCalendar(),
    getTodaysBirthdays(),
    getHomeContent(),
    getBlock("home-sections"),
    getBlock("journey"),
  ])
  const pillars = home.pillars.items.map((item, index) => ({ ...item, icon: pillarIcons[index % pillarIcons.length] }))
  const paths = home.paths.map((path, index) => ({ ...pathStyles[index % pathStyles.length], ...path }))
  return (
    <>
      <BirthdayFloat people={todaysBirthdays} />
      <section id="welcome" className="calendar-stage relative scroll-mt-28 overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <WelcomeScene
          badge={home.welcome.badge}
          eyebrow={home.welcome.eyebrow}
          title={home.welcome.title}
          highlight={home.welcome.highlight}
          lede={welcome[0] ? welcome[0] : home.welcome.lede}
          cards={home.welcome.cards ?? []}
        />
      </section>

      {home.inspiration?.quote ? (
        <section
          id="daily-inspiration"
          className="scroll-mt-28 relative isolate overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-16 text-center text-white sm:px-8 sm:py-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 size-[22rem] rounded-full bg-[#17b3c6] opacity-25 blur-[110px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-1/5 -z-10 size-[18rem] rounded-full bg-[#ffcf4a] opacity-10 blur-[100px]"
          />
          <MotionReveal from="up" className="mx-auto max-w-3xl">
            <p className="text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase sm:text-sm">
              {home.inspiration.kicker}
            </p>
            <blockquote className="mt-6 font-heading text-3xl leading-snug font-semibold italic sm:text-4xl sm:leading-snug">
              “{home.inspiration.quote}”
            </blockquote>
            {home.inspiration.attribution ? (
              <footer className="mt-5 text-sm font-semibold tracking-[0.18em] text-[#7fe3ef] uppercase">
                — {home.inspiration.attribution}
              </footer>
            ) : null}
          </MotionReveal>
        </section>
      ) : null}

      <section id="pillars" className="calendar-stage scroll-mt-80 overflow-hidden px-4 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <MotionReveal from="up" className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">{home.pillars.kicker}</p>
            <h2 className="mt-2 font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">{home.pillars.title}</h2>
            <span className="mx-auto mt-5 block h-1 w-14 rounded-full bg-gradient-to-r from-[#17b3c6] to-[#ffcf4a]" aria-hidden="true" />
          </MotionReveal>
          <MotionStagger stagger={0.1} className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
            {pillars.map((item, index) => {
              const Icon = item.icon
              const deep = index === 1
              return (
                <MotionItem key={item.title} className="h-full">
                  <Link
                    href={item.href}
                    className={
                      deep
                        ? "group media-bento-card media-bento-shine calendar-glass-deep relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
                        : "group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
                    }
                  >
                    <span
                      className={
                        deep
                          ? "absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition group-hover:rotate-45"
                          : "absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-[#e7fbff] text-[#023e8a] ring-1 ring-[#cfeef4] transition group-hover:rotate-45"
                      }
                    >
                      <ArrowUpRight className="size-3.5" />
                    </span>
                    <span
                      className={
                        deep
                          ? "flex size-14 items-center justify-center rounded-2xl bg-[#ffcf4a] text-[#03202b]"
                          : "flex size-14 items-center justify-center rounded-2xl bg-[#e7fbff] text-[#0e98ac] ring-1 ring-[#cfeef4]"
                      }
                    >
                      <Icon aria-hidden="true" className="size-7" strokeWidth={2.1} />
                    </span>
                    <h3
                      className={
                        deep
                          ? "mt-6 font-heading text-2xl font-semibold text-white sm:text-3xl"
                          : "mt-6 font-heading text-2xl font-semibold text-[#023e8a] sm:text-3xl"
                      }
                    >
                      {item.title}
                    </h3>
                    <p className={deep ? "mt-3 flex-1 text-sm leading-6 text-white/75" : "mt-3 flex-1 text-sm leading-6 text-[#5c6b7a]"}>
                      {item.text}
                    </p>
                    <span
                      className={
                        deep
                          ? "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7fe3ef] transition group-hover:gap-2.5"
                          : "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e98ac] transition group-hover:gap-2.5 group-hover:text-[#023e8a]"
                      }
                    >
                      Explore
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </Link>
                </MotionItem>
              )
            })}
          </MotionStagger>
          <MotionReveal from="up" delay={360} className="mt-10 flex justify-center">
            <Link
              href="/charism"
              className="media-bento-card inline-flex items-center gap-2 rounded-full border border-[#cfeef4] bg-white/95 px-6 py-2.5 text-sm font-bold tracking-wide text-[#0e98ac] uppercase shadow-[0_12px_28px_-18px_rgba(2,62,138,0.45)] backdrop-blur-md transition hover:border-[#17b3c6] hover:text-[#023e8a]"
            >
              Read more
              <ArrowUpRight className="size-4" />
            </Link>
          </MotionReveal>
        </div>
      </section>

      <section id="ministries" className="calendar-stage relative scroll-mt-80 overflow-hidden px-4 pt-16 pb-16 sm:px-8 sm:pt-20 sm:pb-20">
        <div className="relative mx-auto max-w-6xl">
          <MotionReveal from="left" className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">{home.ministries.kicker}</p>
              <h2 className="mt-2 font-heading text-4xl leading-tight font-semibold text-[#023e8a] sm:text-5xl">
                {home.ministries.title}
              </h2>
            </div>
            <Link
              href="/ministries"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e98ac] transition hover:text-[#023e8a]"
            >
              All ministries
              <ArrowRight aria-hidden="true" className="ministry-arrow size-4" />
            </Link>
          </MotionReveal>
          <MotionStagger stagger={0.08} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {ministries.slice(0, 6).map((ministry, index) => (
              <MotionItem key={`${ministry.number}-${ministry.title}`} className="h-full">
                <MinistryCard ministry={ministry} index={index} href={ministryHref(ministry)} />
              </MotionItem>
            ))}
          </MotionStagger>
          <MotionReveal from="up" delay={180} className="mt-10 flex justify-center sm:justify-end">
            <Button
              asChild
              className="media-bento-card group relative h-auto gap-2 rounded-full border border-[#cfeef4] bg-white/95 px-7 py-3 text-sm font-bold text-[#0e98ac] shadow-[0_12px_28px_-18px_rgba(2,62,138,0.45)] backdrop-blur-md hover:border-[#17b3c6] hover:bg-white hover:text-[#023e8a]"
            >
              <Link href="/ministries">
                View all ministries
                <ArrowRight aria-hidden="true" className="ministry-arrow size-4" />
              </Link>
            </Button>
          </MotionReveal>
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
              <MotionReveal
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
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="latest-news" className="news-home-stage relative scroll-mt-80 overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 size-[26rem] rounded-full bg-[#17b3c6]/18 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 -bottom-20 size-[22rem] rounded-full bg-[#ffcf4a]/14 blur-[100px]"
        />
        <MotionReveal from="up" className="relative mx-auto mb-8 max-w-6xl px-4 sm:mb-10 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">{home.news.kicker}</p>
              <h2 className="mt-2 font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">{home.news.title}</h2>
              <span
                aria-hidden="true"
                className="mt-4 block h-1 w-14 rounded-full bg-gradient-to-r from-[#17b3c6] to-[#ffcf4a]"
              />
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-full border border-[#cfeef4] bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#0e98ac] shadow-[0_10px_24px_-16px_rgba(2,62,138,0.4)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#17b3c6] hover:text-[#023e8a]"
            >
              All news
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </MotionReveal>
        <NewsMarquee articles={latestNews} />
      </section>

      <MediaHighlights content={home.media} />

      <JourneyPath eras={journey.eras} />

      <section id="family" className="family-stage relative scroll-mt-80 overflow-hidden px-4 py-16 sm:px-8 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-[26rem] rounded-full bg-[#17b3c6]/20 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-16 size-[22rem] rounded-full bg-[#ffcf4a]/15 blur-[100px]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.15fr_0.95fr] md:items-stretch">
          <MotionReveal className="family-glass flex flex-col justify-center rounded-[1.75rem] px-7 py-8 sm:px-9 sm:py-10">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">{home.family.kicker}</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">
              {home.family.title}
            </h2>
            <span aria-hidden="true" className="mt-5 block h-1 w-14 rounded-full bg-gradient-to-r from-[#17b3c6] to-[#ffcf4a]" />
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#3d4b59]">{home.family.text}</p>
          </MotionReveal>
          <MotionReveal delay={120} className="grid gap-3">
            <Link href="/news" className="family-link family-link-primary">
              <span>Province news</span>
              <ArrowUpRight className="size-4 opacity-70" aria-hidden="true" />
            </Link>
            <a
              href="https://www.omiworld.org/"
              target="_blank"
              rel="noreferrer"
              className="family-link family-link-soft"
            >
              <span>OMI World</span>
              <ArrowUpRight className="size-4 opacity-70" aria-hidden="true" />
            </a>
            <a
              href="https://omicolombo.org/"
              target="_blank"
              rel="noreferrer"
              className="family-link family-link-deep"
            >
              <span>OMI Colombo Province</span>
              <ArrowUpRight className="size-4 opacity-70" aria-hidden="true" />
            </a>
          </MotionReveal>
        </div>
      </section>

      <ProvinceCalendar events={events} />
      <JoinUs content={home.joinUs} />
      <HomeContact content={home.contact} />
    </>
  )
}
