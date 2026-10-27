import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import { mainNavigation as defaultNavigation } from "@/config/navigation"
import type { NavItem } from "@/types"
import { site } from "@/config/site"
import { isUpload, siteInfoDefaults, type SiteInfo } from "@/content/site-info"

export function SiteFooter({
  navigation: mainNavigation = defaultNavigation,
  info = siteInfoDefaults,
}: {
  navigation?: NavItem[]
  info?: SiteInfo
}) {
  const mid = Math.ceil(mainNavigation.length / 2)
  const provinceLinks = mainNavigation.slice(0, mid)
  const exploreLinks = mainNavigation.slice(mid)

  const social = [
    { label: "Facebook", href: info.social.facebook, icon: FacebookIcon },
    { label: "Instagram", href: info.social.instagram, icon: InstagramIcon },
    { label: "YouTube", href: info.social.youtube, icon: YouTubeIcon },
  ]

  const contactRows = [
    {
      label: info.contact.email,
      href: `mailto:${info.contact.email}`,
      icon: MailIcon,
      external: false,
    },
    {
      label: info.contact.phone,
      href: info.contact.phoneHref,
      icon: PhoneIcon,
      external: false,
    },
    {
      label: info.contact.address,
      href: info.contact.mapLink,
      icon: PinIcon,
      external: true,
    },
  ]

  return (
    <footer className="site-footer relative isolate overflow-hidden px-3 pb-6 pt-10 text-white sm:px-6 sm:pb-8 sm:pt-14">
      {/* Atmosphere so glass has color to refract */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(165deg,#0e98ac_0%,#17b3c6_42%,#0a8fa0_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 -z-10 size-[28rem] rounded-full bg-white/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 -z-10 size-[22rem] rounded-full bg-[#06394a]/35 blur-3xl"
      />

      <div className="footer-glass mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
        {/* Columns + glass widget — Pinterest-style footer layout */}
        <div className="grid gap-10 px-6 py-9 sm:px-8 sm:py-10 lg:grid-cols-[1fr_1fr_1fr_1.05fr] lg:gap-8">
          <FooterColumn title="Province">
            {provinceLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Explore">
            {exploreLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            {contactRows.map((row) => {
              const Icon = row.icon
              return (
                <li key={row.label}>
                  <a
                    href={row.href}
                    {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="footer-link flex items-start gap-2.5"
                  >
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                      <Icon />
                    </span>
                    <span className="pt-1 leading-5">{row.label}</span>
                  </a>
                </li>
              )
            })}
          </FooterColumn>

          {/* Floating glass card — like the social widget in the reference */}
          <div className="footer-widget flex flex-col justify-between gap-5 rounded-2xl p-5">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">Members</p>
              <p className="mt-2 text-sm leading-6 text-white/90">{site.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={site.familyPortal.login}
                  className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/35 transition hover:bg-white hover:text-[#0a5062]"
                >
                  Login
                </Link>
                <Link
                  href={site.familyPortal.register}
                  className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#17b3c6] transition hover:bg-[#e7fbff]"
                >
                  Register
                </Link>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-white/80">
              <a
                href={site.familyPortal.colombo}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-white"
              >
                OMI Colombo Province
              </a>
              <a
                href={site.familyPortal.world}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-white"
              >
                OMI World
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar — logo / copyright / social */}
        <div className="flex flex-col gap-4 border-t border-white/20 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src={info.logos.emblemImage}
              unoptimized={isUpload(info.logos.emblemImage)}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 object-contain"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold tracking-tight text-white">{site.shortName}</span>
              <span className="block truncate text-xs text-white/70">
                © {site.years.slice(-4)} {site.congregation}
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {social.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/25 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#17b3c6]"
                >
                  <Icon />
                </a>
              )
            })}
            <Link
              href="/contact"
              className="ml-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:bg-white/15 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title}>
      <p className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm text-white/90">{children}</ul>
    </nav>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8.5 4.5h3l1 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  )
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7Z" />
    </svg>
  )
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.7" cy="7.3" r="0.9" fill="currentColor" />
    </svg>
  )
}

export function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M21 8.2a2.7 2.7 0 0 0-1.9-1.9C17.5 6 12 6 12 6s-5.5 0-7.1.3A2.7 2.7 0 0 0 3 8.2 28 28 0 0 0 2.7 12 28 28 0 0 0 3 15.8a2.7 2.7 0 0 0 1.9 1.9C6.5 18 12 18 12 18s5.5 0 7.1-.3a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .3-3.8 28 28 0 0 0-.3-3.8ZM10.5 14.8V9.2L15.2 12l-4.7 2.8Z" />
    </svg>
  )
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12.1 3.2A8.7 8.7 0 0 0 4.6 16.3L3.4 20.6l4.4-1.2A8.7 8.7 0 1 0 12.1 3.2Zm5 12.3c-.2.6-1.2 1.1-1.7 1.2-.4.1-.9.1-1.5-.1-.3-.1-.8-.3-1.3-.5-2.3-1-3.8-3.4-3.9-3.5-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4.2.5.7 1.7.7 1.8.1.1.1.3 0 .4-.1.2-.2.3-.3.5l-.4.4c-.1.1-.2.3-.1.5.2.3.7 1.2 1.6 1.9 1.1.9 2 1.1 2.3 1.3.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1.2.1 1.4.7 1.6.8.2.1.4.2.4.3.1.2 0 .7-.2 1.3Z" />
    </svg>
  )
}
