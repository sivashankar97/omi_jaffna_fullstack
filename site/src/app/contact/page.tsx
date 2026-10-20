import type { Metadata } from "next"
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/layout/site-footer"
import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PageBanner } from "@/components/sections/page-banner"
import { site } from "@/config/site"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Oblate Province of Jaffna at Thodarpaham, Hospital Road.",
}

const fullAddress = "657/1 Hospital Road, Jaffna, Sri Lanka"
const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`
const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`

const ways = [
  {
    Icon: MapPin,
    label: "Visit us",
    value: "Thodarpaham, Provincial House",
    detail: fullAddress,
    href: directions,
    action: "Get directions",
    external: true,
  },
  {
    Icon: Phone,
    label: "Call the office",
    value: site.contact.phone,
    detail: "Province office, Jaffna",
    href: site.contact.phoneHref,
    action: "Call now",
    external: false,
  },
  {
    Icon: Mail,
    label: "Write an email",
    value: site.contact.email,
    detail: "We reply to every enquiry",
    href: `mailto:${site.contact.email}`,
    action: "Send email",
    external: false,
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: site.contact.phone,
    detail: "A message to the Province office",
    href: site.social.whatsapp,
    action: "Open WhatsApp",
    external: true,
  },
]

const socials = [
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YouTubeIcon },
  { label: "WhatsApp", href: site.social.whatsapp, Icon: WhatsAppIcon },
]

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <PageBanner
        id="thodarpaham"
        kicker="Contact us"
        title="We would be glad to hear from you"
        summary="Write to the Provincial House at Thodarpaham, Jaffna, call the office, or send an enquiry below. Every message is read by the Province office."
      >
        <a
          href={site.contact.phoneHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#ffcf4a] px-6 py-3 text-sm font-semibold text-[#03202b] shadow-[0_14px_30px_-14px_rgba(255,207,74,0.9)] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
        >
          <Phone aria-hidden="true" className="size-4" /> {site.contact.phone}
        </a>
        <a
          href="#enquiry"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
        >
          <Mail aria-hidden="true" className="size-4" /> Send an enquiry
        </a>
      </PageBanner>

      <section id="visit" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-16 text-[#023e8a] sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal from="up">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">Visit or write</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Ways to reach the Province</h2>
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ways.map(({ Icon, ...way }, index) => (
              <Reveal key={way.label} as="li" from="up" delay={index * 90} className="h-full">
                <a
                  href={way.href}
                  {...(way.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_18px_40px_-30px_rgba(2,62,138,0.45)] ring-1 ring-[#d9eef3] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgba(2,62,138,0.6)] hover:ring-[#17b3c6]/60"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#17b3c6] to-[#ffbf00] transition duration-500 group-hover:scale-x-100"
                  />
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#17b3c6] to-[#06394a] text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="mt-5 text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">{way.label}</span>
                  <span className="mt-1 font-heading text-lg font-semibold break-words text-[#023e8a]">
                    {way.value}
                  </span>
                  <span className="mt-1 flex-1 text-sm leading-6 text-[#5c6b7a]">{way.detail}</span>
                  <span className="mt-6 flex items-center justify-between border-t border-[#e2f2f6] pt-4 text-sm font-semibold text-[#023e8a]">
                    {way.action}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#17b3c6]"
                    />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-80 bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal from="up">
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(2,62,138,0.5)] ring-1 ring-[#d9eef3] sm:p-10">
              <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">Enquiry</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Send us a message</h2>
              <p className="mt-3 max-w-xl leading-7 text-[#3d4b59]">
                Vocations, parishes, publications, mission support or a pastoral concern. Choose a reason and the
                office will direct your message.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          <Reveal from="up" delay={120} className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] p-8 text-white">
              <span
                aria-hidden="true"
                className="charism-orb absolute -top-16 -right-12 size-48 rounded-full bg-[#17b3c6]/30 blur-3xl"
              />
              <p className="relative text-xs font-bold tracking-[0.22em] text-[#ffcf4a] uppercase">Provincial House</p>
              <h3 className="relative mt-3 font-heading text-2xl font-semibold" style={{ color: "#ffffff" }}>
                Thodarpaham, Jaffna
              </h3>
              <p className="relative mt-3 text-sm leading-6 text-white/80">{fullAddress}</p>
              <div className="relative mt-6 border-t border-white/15 pt-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">Provincial Superior</p>
                <p className="mt-1 font-heading text-lg font-semibold">Very Rev. Fr. Paul Jeyanthan Pachchek, OMI</p>
              </div>
              <div className="relative mt-6 flex gap-2">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-[#ffcf4a] hover:text-[#03202b]"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] ring-1 ring-[#d9eef3] shadow-[0_24px_50px_-36px_rgba(2,62,138,0.5)]">
              <iframe
                title="Map of the Provincial House, Thodarpaham, Jaffna"
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-64 w-full border-0"
              />
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-[#f4fbfd] px-5 py-4 text-sm font-semibold text-[#023e8a] transition hover:bg-[#eaf8fb]"
              >
                Get directions on Google Maps
                <ArrowUpRight aria-hidden="true" className="size-4 text-[#17b3c6]" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
