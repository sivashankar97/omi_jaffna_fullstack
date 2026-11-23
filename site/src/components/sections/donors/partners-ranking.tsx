import Image from "next/image"

import { isUpload } from "@/content/site-info"

export type RankingDonor = {
  name: string
  summary?: string
  website?: string
  region?: string
  image?: string
}

function PartnerCell({ donor }: { donor: RankingDonor }) {
  const body = (
    <>
      <div className="flex min-h-12 w-full shrink-0 items-center justify-center sm:min-h-14">
        {donor.image ? (
          <Image
            src={encodeURI(donor.image)}
            alt=""
            width={240}
            height={72}
            unoptimized={isUpload(donor.image) || donor.image.endsWith(".svg")}
            className="max-h-11 w-auto max-w-full object-contain sm:max-h-12"
          />
        ) : (
          <p className="font-heading text-2xl font-semibold text-[#023e8a]">{donor.name.slice(0, 1)}</p>
        )}
      </div>
      <div className="mt-3 flex w-full shrink-0 flex-col items-center gap-1.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-center font-heading text-sm font-semibold leading-snug text-[#03202b] sm:min-h-[2.75rem] sm:text-base">
          {donor.name}
        </h3>
        {donor.region ? (
          <p className="line-clamp-2 text-center text-[10px] font-semibold leading-4 tracking-[0.12em] text-[#17b3c6] uppercase">
            {donor.region}
          </p>
        ) : null}
      </div>
    </>
  )

  const className =
    "flex min-h-[9.5rem] w-full flex-col items-center justify-between rounded-xl border border-[#d9e4ea] bg-white px-3 py-4 transition hover:border-[#17b3c6]/50 hover:bg-[#f7fbfd] sm:min-h-[10.5rem] sm:px-4"

  if (donor.website) {
    return (
      <a href={donor.website} target="_blank" rel="noreferrer" className={className}>
        {body}
      </a>
    )
  }

  return <article className={className}>{body}</article>
}

export function PartnersRanking({
  kicker,
  title,
  subtitle,
  donors,
}: {
  kicker: string
  title: string
  subtitle: string
  donors: RankingDonor[]
}) {
  if (!donors.length) {
    return (
      <section id="partners" className="scroll-mt-80 bg-white px-4 py-16 sm:px-8 sm:py-20">
        <p className="mx-auto max-w-6xl text-center text-[#5c6b7a]">
          Donor partners will appear here once published in the CMS.
        </p>
      </section>
    )
  }

  return (
    <section id="partners" className="scroll-mt-80 bg-white text-[#023e8a]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#03202b] via-[#0a5062] to-[#17b3c6] px-4 py-16 text-center text-white sm:px-8 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -left-10 size-56 rotate-12 rounded-3xl bg-black/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-24 size-72 rounded-full bg-[#ffcf4a]/15"
        />
        <p className="relative text-xs font-bold tracking-[0.28em] text-[#ffcf4a] uppercase">{kicker}</p>
        <h2 className="relative mx-auto mt-3 max-w-3xl font-heading text-3xl font-semibold text-balance sm:text-5xl">
          {title}
        </h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
          {subtitle}
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-12">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {donors.map((donor, index) => (
            <li key={`${donor.name}-${index}`}>
              <PartnerCell donor={donor} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
