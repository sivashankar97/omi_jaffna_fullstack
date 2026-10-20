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
  const social = [
    { label: "Facebook", href: info.social.facebook, external: true, icon: FacebookIcon },
    { label: "Instagram", href: info.social.instagram, external: true, icon: InstagramIcon },
    { label: "YouTube", href: info.social.youtube, external: true, icon: YouTubeIcon },
    { label: "WhatsApp", href: info.social.whatsapp, external: true, icon: WhatsAppIcon },
  ]
  return (
    <footer className="border-t border-white/40 bg-[#17b3c6] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:grid-cols-2 sm:px-6 sm:py-12 lg:grid-cols-4">
        <div className="min-w-0">
          <Image
            src={info.logos.emblemImage}
            unoptimized={isUpload(info.logos.emblemImage)}
            alt=""
            width={72}
            height={72}
            className="h-16 w-16 object-contain"
          />
          <p className="mt-4 font-heading text-xl font-semibold">{site.name}</p>
          <p className="mt-2 text-sm leading-6 text-white/85">{site.tagline}</p>
          <p className="mt-4 text-sm leading-6 break-words text-white">
            {info.contact.address}
            <br />
            <a className="hover:underline" href={info.contact.phoneHref}>
              {info.contact.phone}
            </a>
            <br />
            <a className="hover:underline" href={`mailto:${info.contact.email}`}>
              {info.contact.email}
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">Pages</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-white">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">
            Reserved area
          </p>
          <p className="mt-4 text-sm leading-6 text-white/85">
            Sign in or create an account for this Province site.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={site.familyPortal.login}
              className="rounded-full border-2 border-white bg-white px-4 py-2 text-sm font-semibold text-[#17b3c6] transition hover:bg-[#e6f7f4]"
            >
              Login
            </Link>
            <Link
              href={site.familyPortal.register}
              className="rounded-full border-2 border-white bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Register
            </Link>
          </div>
          <a
            href={site.familyPortal.colombo}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm font-medium hover:underline"
          >
            OMI Colombo Province
          </a>
          <a
            href={site.familyPortal.world}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-sm font-medium hover:underline"
          >
            OMI World
          </a>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">Connect</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {social.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  {...(item.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white text-[#17b3c6] transition hover:-translate-y-0.5 hover:bg-[#e6f7f4]"
                >
                  <Icon />
                </a>
              )
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-white/35 px-4 py-4 text-center text-xs text-white/90 sm:px-6">
        © {site.years.slice(-4)} {site.congregation}. Oblate Province of Jaffna.
      </div>
    </footer>
  )
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7Z" />
    </svg>
  )
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.7" cy="7.3" r="0.9" fill="currentColor" />
    </svg>
  )
}

export function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M21 8.2a2.7 2.7 0 0 0-1.9-1.9C17.5 6 12 6 12 6s-5.5 0-7.1.3A2.7 2.7 0 0 0 3 8.2 28 28 0 0 0 2.7 12 28 28 0 0 0 3 15.8a2.7 2.7 0 0 0 1.9 1.9C6.5 18 12 18 12 18s5.5 0 7.1-.3a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .3-3.8 28 28 0 0 0-.3-3.8ZM10.5 14.8V9.2L15.2 12l-4.7 2.8Z" />
    </svg>
  )
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12.1 3.2A8.7 8.7 0 0 0 4.6 16.3L3.4 20.6l4.4-1.2A8.7 8.7 0 1 0 12.1 3.2Zm5 12.3c-.2.6-1.2 1.1-1.7 1.2-.4.1-.9.1-1.5-.1-.3-.1-.8-.3-1.3-.5-2.3-1-3.8-3.4-3.9-3.5-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4.2.5.7 1.7.7 1.8.1.1.1.3 0 .4-.1.2-.2.3-.3.5l-.4.4c-.1.1-.2.3-.1.5.2.3.7 1.2 1.6 1.9 1.1.9 2 1.1 2.3 1.3.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1.2.1 1.4.7 1.6.8.2.1.4.2.4.3.1.2 0 .7-.2 1.3Z" />
    </svg>
  )
}
