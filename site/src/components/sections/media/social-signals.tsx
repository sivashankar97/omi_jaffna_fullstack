import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/layout/site-footer"
import { getSiteInfo } from "@/lib/cms"

const channelList = (site: {
  social: Record<"youtube" | "instagram" | "facebook" | "whatsapp", string>
  contact: { phone: string }
}) => [
  {
    name: "YouTube",
    handle: "Oblate Jaffna TV",
    text: "The official channel. Programmes are published there, including நற்கருணை ஆராதனை.",
    href: site.social.youtube,
    action: "Watch on YouTube",
    Icon: YouTubeIcon,
    accent: "from-[#ff4e45] to-[#c4302b]",
  },
  {
    name: "Instagram",
    handle: "@omi_jaffna",
    text: "Photographs and short notes from the Province account.",
    href: site.social.instagram,
    action: "Follow on Instagram",
    Icon: InstagramIcon,
    accent: "from-[#f9a03f] via-[#e1306c] to-[#833ab4]",
  },
  {
    name: "Facebook",
    handle: "Province page",
    text: "The public Facebook page shared for this Province.",
    href: site.social.facebook,
    action: "Open Facebook",
    Icon: FacebookIcon,
    accent: "from-[#4c8bf5] to-[#1659c7]",
  },
  {
    name: "WhatsApp",
    handle: site.contact.phone,
    text: "A message to the Province office. No chat history is shown here.",
    href: site.social.whatsapp,
    action: "Write on WhatsApp",
    Icon: WhatsAppIcon,
    accent: "from-[#3ddc84] to-[#128c4b]",
  },
]

export async function SocialSignals() {
  const channels = channelList(await getSiteInfo())
  return (
    <section id="social-signals" className="calendar-stage scroll-mt-80 px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
      <div className="relative mx-auto max-w-6xl">
        <Reveal from="up" className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#17b3c6] opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#17b3c6]" />
              </span>
              Live channels
            </p>
            <h2 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Four doors, one mission</h2>
          </div>
          <p className="max-w-md leading-7 text-[#3d4b59]">
            Each card opens the real Province account. Posts and follower counts stay on those sites.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ Icon, ...channel }, index) => (
            <Reveal key={channel.name} as="li" from="up" delay={index * 90} className="h-full">
              <a
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className="group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#17b3c6] to-[#ffbf00] transition duration-500 group-hover:scale-x-100"
                />
                <span
                  className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-3 ${channel.accent}`}
                >
                  <Icon />
                </span>
                <span className="mt-5 text-xs font-bold tracking-[0.2em] text-[#0e98ac] uppercase">{channel.name}</span>
                <span className="mt-1 font-heading text-xl font-semibold text-[#023e8a]">{channel.handle}</span>
                <span className="mt-2 flex-1 text-sm leading-6 text-[#5c6b7a]">{channel.text}</span>
                <span className="mt-6 flex items-center justify-between border-t border-[#d7eef3]/80 pt-4 text-sm font-semibold text-[#023e8a]">
                  {channel.action}
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
  )
}
