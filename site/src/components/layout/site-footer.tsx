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
  const exploreLinks = mainNavigation.slice(0, mid)
  const resourceLinks: { href: string; label: string }[] = [
    ...mainNavigation.slice(mid).map((item) => ({ href: item.href, label: item.label })),
    { href: site.familyPortal.login, label: "Father login" },
    { href: site.familyPortal.register, label: "Register" },
  ]

  const social = [
    { label: "Facebook", href: info.social.facebook, icon: FacebookIcon },
    { label: "YouTube", href: info.social.youtube, icon: YouTubeIcon },
    { label: "Instagram", href: info.social.instagram, icon: InstagramIcon },
    { label: "X", href: info.social.facebook, icon: XIcon },
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
    <footer className="site-footer relative isolate overflow-hidden text-white">
      <svg
        aria-hidden="true"
        className="relative z-10 -mb-px block h-14 w-full sm:h-20"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path fill="#0e98ac" d="M0,36 C240,72 480,8 720,32 C960,56 1200,64 1440,24 L1440,80 L0,80 Z" />
        <path fill="#06394a" d="M0,48 C260,76 500,16 760,40 C1020,64 1240,70 1440,36 L1440,80 L0,80 Z" />
      </svg>

      <div className="relative bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 pt-4 pb-8 sm:px-8 sm:pb-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/4 size-[22rem] rounded-full bg-[#17b3c6]/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 border-b border-white/15 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={info.logos.emblemImage}
                unoptimized={isUpload(info.logos.emblemImage)}
                alt=""
                width={44}
                height={44}
                className="size-11 object-contain"
              />
              <span>
                <span className="block text-sm font-semibold tracking-tight">{site.shortName}</span>
                <span className="block text-xs text-white/70">{site.congregation}</span>
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
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#17b3c6]"
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <FooterColumn title="Explore">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Resources">
              {resourceLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
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

            <div className="rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur-md">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">Stay connected</p>
              <p className="mt-3 text-sm leading-6 text-white/85">
                Get the latest news and updates from our mission.
              </p>
              <form
                action={`mailto:${info.contact.email}`}
                method="get"
                encType="text/plain"
                className="mt-4 flex overflow-hidden rounded-xl bg-white shadow-[0_10px_24px_-16px_rgb(0_0_0/0.45)]"
              >
                <label className="sr-only" htmlFor="footer-email">
                  Email
                </label>
                <input
                  id="footer-email"
                  name="body"
                  type="email"
                  required
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-[#023e8a] outline-none placeholder:text-[#9aa8b5]"
                />
                <button
                  type="submit"
                  className="m-1 grid size-9 shrink-0 place-items-center rounded-lg bg-[#17b3c6] text-white transition hover:bg-[#0e98ac]"
                  aria-label="Send"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {site.years.slice(-4)} {site.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                Cookies
              </Link>
            </div>
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

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M13.9 10.7 20.1 3.5h-1.5l-5.4 6.3L8.9 3.5H3.7l6.5 9.5L3.7 20.5h1.5l5.7-6.6 4.5 6.6h5.2l-6.7-9.8Zm-2 2.3-.7-1L5.7 4.6h2.3l4.3 6.2.7 1 5.7 8.1h-2.3l-4.5-6.9Z" />
    </svg>
  )
}
