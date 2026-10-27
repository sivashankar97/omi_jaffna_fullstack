import type { Metadata } from "next"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/layout/site-footer"
import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PageBanner } from "@/components/sections/page-banner"
import { getLeadership, getSiteInfo } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Oblate Province of Jaffna at Thodarpaham, Hospital Road, and find addresses for all Oblate houses.",
}

export default async function ContactPage() {
  const [{ contact, social, houses }, { superior }] = await Promise.all([getSiteInfo(), getLeadership()])
  const fullAddress = [contact.address, contact.city].filter(Boolean).join(", ")
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`

  const ways = [
    {
      Icon: MapPin,
      label: "Visit us",
      value: contact.officeName || "Provincial House",
      detail: fullAddress,
      href: contact.mapLink || directions,
      action: "Get directions",
      external: true,
    },
    {
      Icon: Phone,
      label: "Call the office",
      value: contact.phone,
      detail: contact.hours || "Province office, Jaffna",
      href: contact.phoneHref,
      action: "Call now",
      external: false,
    },
    {
      Icon: Mail,
      label: "Write an email",
      value: contact.email,
      detail: "We reply to every enquiry",
      href: `mailto:${contact.email}`,
      action: "Send email",
      external: false,
    },
  ]

  const socials = [
    { label: "Facebook", href: social.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: social.instagram, Icon: InstagramIcon },
    { label: "YouTube", href: social.youtube, Icon: YouTubeIcon },
  ]

  return (
    <>
      <ScrollProgress />
      <PageBanner
        id="thodarpaham"
        kicker="Contact us"
        title="We would be glad to hear from you"
        summary="Write to the Provincial House at Thodarpaham, Jaffna, call the office, or send an enquiry below. Addresses for all Oblate houses are listed on this page."
      >
        <a
          href={contact.phoneHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#ffcf4a] px-6 py-3 text-sm font-semibold text-[#03202b] shadow-[0_14px_30px_-14px_rgba(255,207,74,0.9)] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
        >
          <Phone aria-hidden="true" className="size-4" /> {contact.phone}
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
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {houses?.length ? (
        <section id="houses" className="scroll-mt-80 bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal from="up">
              <p className="text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">Oblate houses</p>
              <h2 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Addresses across the Province</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5c6b7a] sm:text-base">
                Provincial House, community houses and formation communities. Edit this list any time in the CMS under
                Logos, address &amp; social links.
              </p>
            </Reveal>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {houses.map((house, index) => {
                const href =
                  house.mapLink ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${house.address}, Sri Lanka`)}`
                return (
                  <Reveal key={`${house.name}-${house.address}`} as="li" from="up" delay={(index % 3) * 80} className="h-full">
                    <article className="flex h-full flex-col rounded-3xl bg-[#f4fbfd] p-6 ring-1 ring-[#d9eef3]">
                      <p className="text-[11px] font-bold tracking-[0.18em] text-[#0e98ac] uppercase">
                        {house.kind || "House"}
                      </p>
                      <h3 className="mt-2 font-heading text-xl font-semibold text-[#023e8a]">{house.name}</h3>
                      {house.place ? <p className="mt-1 text-sm font-medium text-[#5c6b7a]">{house.place}</p> : null}
                      <p className="mt-3 flex-1 text-sm leading-6 text-[#3d4b59]">{house.address}</p>
                      <div className="mt-4 space-y-1 border-t border-[#d9eef3] pt-4 text-sm">
                        {house.phone ? (
                          <a href={`tel:${house.phone.replace(/\s/g, "")}`} className="block font-semibold text-[#023e8a] hover:text-[#0e98ac]">
                            {house.phone}
                          </a>
                        ) : null}
                        {house.email ? (
                          <a href={`mailto:${house.email}`} className="block break-all text-[#0e98ac] hover:underline">
                            {house.email}
                          </a>
                        ) : null}
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#023e8a] hover:text-[#17b3c6]"
                        >
                          Open in Maps
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section id="enquiry" className="scroll-mt-80 bg-[#f4fbfd] px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
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
                {contact.officeName || "Thodarpaham, Jaffna"}
              </h3>
              <p className="relative mt-3 text-sm leading-6 text-white/80">{fullAddress}</p>
              {contact.hours ? <p className="relative mt-2 text-xs text-white/60">{contact.hours}</p> : null}
              {superior ? (
                <div className="relative mt-6 border-t border-white/15 pt-5">
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">Provincial Superior</p>
                  <p className="mt-1 font-heading text-lg font-semibold">{superior.name}</p>
                </div>
              ) : null}
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

            <div className="overflow-hidden rounded-[2rem] shadow-[0_24px_50px_-36px_rgba(2,62,138,0.5)] ring-1 ring-[#d9eef3]">
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
                className="flex items-center justify-between bg-white px-5 py-4 text-sm font-semibold text-[#023e8a] transition hover:bg-[#eaf8fb]"
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
