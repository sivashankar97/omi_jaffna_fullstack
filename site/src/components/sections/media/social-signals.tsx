import { site } from "@/config/site"

const channels = [
  {
    name: "YouTube",
    handle: "Oblate Jaffna TV",
    text: "The official channel. Programmes are published there, including நற்கருணை ஆராதனை.",
    href: site.social.youtube,
    action: "Open the channel",
    className: "min-h-72 md:col-span-2 md:row-span-2 md:min-h-[28rem]",
    face: "bg-[#023e8a] text-white",
  },
  {
    name: "Instagram",
    handle: "@omi_jaffna",
    text: "Photographs and short notes from the Province account.",
    href: site.social.instagram,
    action: "Open Instagram",
    className: "min-h-56 md:col-span-1 md:row-span-2",
    face: "bg-[#e7fbff] text-[#023e8a]",
  },
  {
    name: "Facebook",
    handle: "Province page",
    text: "The public Facebook page shared for this Province.",
    href: site.social.facebook,
    action: "Open Facebook",
    className: "min-h-40 md:col-span-1",
    face: "bg-white text-[#023e8a]",
  },
  {
    name: "WhatsApp",
    handle: "021-2222721",
    text: "A message to the Province office. No chat history is shown here.",
    href: site.social.whatsapp,
    action: "Write on WhatsApp",
    className: "min-h-40 md:col-span-1",
    face: "bg-[#e7fbff] text-[#023e8a]",
  },
] as const

export function SocialSignals() {
  return (
    <section id="social-signals" className="scroll-mt-80 border-t border-[#90e0ef] bg-white px-4 py-10 text-[#023e8a] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-center gap-3 font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">
          <span className="signal-live inline-block size-3 rounded-full bg-[#26ae83]" aria-hidden="true" />
          Live channels
        </p>
        <h2 className="mt-3 max-w-2xl text-sm font-semibold tracking-[0.18em] text-[#0077b6] uppercase">
          Four doors, one mission
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5c6b7a] sm:text-base">
          Facebook, Instagram, YouTube and WhatsApp. Each tile opens the real Province address. Posts and follower counts stay on those sites.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {channels.map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className={`media-in flex flex-col justify-between rounded-3xl border-2 border-[#90e0ef] p-5 transition duration-300 hover:-translate-y-1 ${channel.className} ${channel.face}`}
            >
              <span>
                <span className="text-xs font-semibold tracking-[0.22em] uppercase">{channel.name}</span>
                <span className="mt-3 block font-heading text-2xl font-semibold sm:text-3xl">{channel.handle}</span>
                <span className="mt-3 block max-w-md text-sm leading-6 opacity-80">{channel.text}</span>
              </span>
              <span className="mt-6 text-sm font-semibold">{channel.action}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
