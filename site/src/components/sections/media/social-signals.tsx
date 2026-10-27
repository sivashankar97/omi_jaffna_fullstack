import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/layout/site-footer"
import { getSiteInfo } from "@/lib/cms"

const channelList = (site: {
  social: Record<"youtube" | "instagram" | "facebook", string>
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
              Social
            </p>
            <h2 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Follow the Province</h2>
          </div>
        </Reveal>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {channels.map((channel, index) => (
            <Reveal key={channel.name} as="li" from="up" delay={index * 90} className="h-full">
              <a
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className="group media-bento-card media-bento-shine calendar-glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6"
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${channel.accent} text-white`}
                >
                  <channel.Icon />
                </span>
                <p className="mt-5 text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">{channel.name}</p>
                <h3 className="mt-1 font-heading text-xl font-semibold text-[#023e8a]">{channel.handle}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#5c6b7a]">{channel.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e98ac] transition group-hover:gap-2.5">
                  {channel.action}
                  <ArrowUpRight className="size-3.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
