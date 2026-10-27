import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/layout/site-footer"
import { getBlock, getSiteInfo } from "@/lib/cms"

export async function SocialSignals() {
  const [site, media] = await Promise.all([getSiteInfo(), getBlock("media-page")])
  const { social } = media
  const channels = [
    {
      name: "YouTube",
      handle: social.youtubeHandle,
      text: social.youtubeText,
      href: site.social.youtube,
      action: social.youtubeAction,
      Icon: YouTubeIcon,
      accent: "bg-[#ff3b30]",
      iconBg: "bg-[#ff3b30]",
      watermark: "text-[#ff3b30]",
    },
    {
      name: "Instagram",
      handle: social.instagramHandle,
      text: social.instagramText,
      href: site.social.instagram,
      action: social.instagramAction,
      Icon: InstagramIcon,
      accent: "bg-gradient-to-r from-[#f9a03f] via-[#e1306c] to-[#833ab4]",
      iconBg: "bg-gradient-to-br from-[#f9a03f] via-[#e1306c] to-[#833ab4]",
      watermark: "text-[#e1306c]",
    },
    {
      name: "Facebook",
      handle: social.facebookHandle,
      text: social.facebookText,
      href: site.social.facebook,
      action: social.facebookAction,
      Icon: FacebookIcon,
      accent: "bg-[#1877f2]",
      iconBg: "bg-[#1877f2]",
      watermark: "text-[#1877f2]",
    },
  ]

  return (
    <section id="social-signals" className="scroll-mt-80 bg-[#f4fafc] px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal from="up">
          <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase sm:text-sm">{social.kicker}</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-5xl">{social.title}</h2>
          {social.summary ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5c6b7a] sm:text-base">{social.summary}</p>
          ) : null}
        </Reveal>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {channels.map((channel, index) => (
            <Reveal key={channel.name} as="li" from="up" delay={index * 90} className="h-full">
              <a
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_40px_-28px_rgba(2,62,138,0.45)] ring-1 ring-[#d7eef3] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_48px_-22px_rgba(14,152,172,0.35)]"
              >
                <span aria-hidden="true" className={`h-1.5 w-full ${channel.accent}`} />
                <span className="relative flex flex-1 flex-col p-6 sm:p-7">
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-4 right-3 scale-[3.4] opacity-[0.07] ${channel.watermark}`}
                  >
                    <channel.Icon />
                  </span>
                  <span
                    className={`relative flex size-12 items-center justify-center rounded-2xl text-white shadow-sm ${channel.iconBg}`}
                  >
                    <span className="scale-125">
                      <channel.Icon />
                    </span>
                  </span>
                  <p className="relative mt-5 text-xs font-bold tracking-[0.18em] text-[#0e98ac] uppercase">
                    {channel.name}
                  </p>
                  <h3 className="relative mt-1 font-heading text-xl font-semibold text-[#023e8a] sm:text-2xl">
                    {channel.handle}
                  </h3>
                  <p className="relative mt-3 flex-1 text-sm leading-6 text-[#5c6b7a]">{channel.text}</p>
                  <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e98ac] transition group-hover:gap-2.5 group-hover:text-[#023e8a]">
                    {channel.action}
                    <ArrowUpRight className="size-4" />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
