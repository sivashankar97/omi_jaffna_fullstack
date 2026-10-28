import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { MotionItem, MotionReveal, MotionStagger } from "@/components/motion/motion-reveal"
import { isUpload } from "@/content/site-info"

export type WelcomeCard = {
  badge: string
  title: string
  text?: string
  image: string
  href: string
  tone?: string
}

type WelcomeSceneProps = {
  badge: string
  eyebrow?: string
  title: string
  lede: string
  image: string
  cards: WelcomeCard[]
}

/** Prefer the designed church scene when CMS still points at an old logo/upload. */
function welcomeHeroSrc(image: string) {
  const src = (image || "").trim()
  if (!src) return "/Herosection/welcome-church-sunset.jpg"
  if (/supabase\.co/i.test(src)) return "/Herosection/welcome-church-sunset.jpg"
  if (/welcome\.jpeg$/i.test(src)) return "/Herosection/welcome-church-sunset.jpg"
  return src
}

export function WelcomeScene({ badge, eyebrow, title, lede, image, cards }: WelcomeSceneProps) {
  const items = cards.slice(0, 3)
  const exploreHref = items[0]?.href ?? "/charism"
  const heroSrc = welcomeHeroSrc(image)

  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="grid items-stretch gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6">
        <MotionReveal from="left" className="min-h-0">
          <article className="welcome-hero-card relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[1.75rem] shadow-[0_28px_60px_-36px_rgba(3,32,43,0.55)] sm:min-h-[30rem] lg:min-h-full">
            <Image
              src={heroSrc}
              alt=""
              fill
              priority
              sizes="(max-width:1024px) 100vw, 55vw"
              className="object-cover object-[82%_52%]"
              unoptimized
            />

            {/* Reference overlay: teal from top-left; church + golden sky stay clear on the right */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(112deg,rgba(2,42,54,0.88)_0%,rgba(3,58,72,0.7)_24%,rgba(5,78,94,0.32)_46%,rgba(5,78,94,0.08)_60%,transparent_74%)]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -left-16 size-[22rem] rounded-full bg-[#17b3c6]/22 blur-3xl"
            />

            {/* Faint cross watermark on the photo side (reference) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 80 120"
              className="pointer-events-none absolute top-[46%] right-[8%] h-[64%] w-auto -translate-y-1/2 text-white/[0.15]"
            >
              <path fill="currentColor" d="M34 8h12v28h22v12H46v64H34V48H12V36h22V8z" />
            </svg>

            <div className="relative z-10 flex h-full flex-col p-6 sm:p-8 lg:p-9">
              <span className="inline-flex w-fit rounded-full bg-[#ffcf4a] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.2em] text-[#03202b] uppercase">
                {badge}
              </span>

              {eyebrow ? (
                <p
                  className="mt-7 flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase sm:text-xs"
                  style={{ color: "#7fe3ef" }}
                >
                  <span aria-hidden="true" className="h-px w-8 shrink-0 bg-[#ffcf4a] sm:w-10" />
                  {eyebrow}
                </p>
              ) : null}

              {/* Inline color beats [data-page-theme] h2 { color: var(--pt-ink) } */}
              <h2
                className="mt-4 max-w-lg font-heading text-3xl leading-[1.12] font-semibold sm:text-4xl lg:text-[2.55rem]"
                style={{ color: "#ffffff" }}
              >
                {title}
              </h2>

              <p
                className="mt-4 max-w-md flex-1 text-sm leading-7 sm:text-[0.95rem] sm:leading-8"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {lede}
              </p>

              <Link
                href={exploreHref}
                className="group mt-8 inline-flex items-center gap-3 self-start rounded-full bg-gradient-to-r from-[#17b3c6] to-[#0e98ac] py-2 pr-2 pl-5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(14,152,172,0.85)] transition hover:brightness-105"
              >
                Begin exploring
                <span className="grid size-9 place-items-center rounded-full bg-white text-[#0e98ac] transition group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </article>
        </MotionReveal>

        <MotionStagger as="ul" stagger={0.1} className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
          {items.map((card) => (
            <MotionItem key={card.badge + card.href} as="li" className="h-full">
              <Link
                href={card.href}
                className="group relative flex h-full min-h-[7.5rem] items-stretch gap-3.5 overflow-hidden rounded-[1.5rem] bg-white p-3.5 shadow-[0_16px_40px_-28px_rgba(10,60,80,0.35)] ring-1 ring-[#d7eef4] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-28px_rgba(10,60,80,0.42)] sm:min-h-0 sm:flex-col sm:gap-3 lg:min-h-[8.25rem] lg:flex-row lg:gap-4 lg:p-4"
              >
                <span className="relative block w-[38%] shrink-0 overflow-hidden rounded-[1.1rem] sm:aspect-[16/10] sm:w-full lg:aspect-auto lg:w-[9.75rem] lg:self-stretch">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width:1024px) 40vw, 160px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    unoptimized={isUpload(card.image)}
                  />
                </span>

                <span className="relative flex min-w-0 flex-1 flex-col justify-center py-1 pr-12 sm:pr-2 lg:pr-14">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#0e98ac] uppercase">
                    {card.badge}
                  </span>
                  <span className="mt-1.5 line-clamp-3 font-heading text-[0.95rem] leading-snug font-semibold text-[#023e8a] sm:text-base">
                    {card.title}
                  </span>
                </span>

                <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-2 text-xs font-semibold text-[#5c6b7a]">
                  <span className="hidden sm:inline">Open</span>
                  <span className="grid size-8 place-items-center rounded-full bg-[#17b3c6] text-white shadow-[0_8px_18px_-10px_rgba(14,152,172,0.9)] transition group-hover:translate-x-0.5">
                    <ArrowRight className="size-3.5" strokeWidth={2.5} />
                  </span>
                </span>
              </Link>
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </div>
  )
}
