import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { MinistryCard } from "@/components/sections/ministry-card"
import { ministryAnchor, ministryHref } from "@/config/navigation"
import type { Ministry } from "@/lib/cms"

export function MinistryExplorer({ ministries }: { ministries: Ministry[] }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {ministries.map((ministry, index) => (
        <Reveal
          id={ministryAnchor(ministry.number)}
          key={ministryHref(ministry)}
          delay={(index % 3) * 90}
          className="h-full scroll-mt-80"
        >
          <Link
            href={ministryHref(ministry)}
            aria-label={`View details: ${ministry.title}`}
            className="block h-full rounded-[1.75rem] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(2,62,138,0.55)] focus-visible:ring-4 focus-visible:ring-[#17b3c6]/60 focus-visible:outline-none"
          >
            <MinistryCard ministry={ministry} index={index} actionLabel="View details" />
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
