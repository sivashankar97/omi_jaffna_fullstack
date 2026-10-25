import { Reveal } from "@/components/motion/reveal"
import { MinistryCard } from "@/components/sections/ministry-card"
import { ministryAnchor, ministryHref } from "@/config/navigation"
import type { Ministry } from "@/lib/cms"

export function MinistryExplorer({ ministries }: { ministries: Ministry[] }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {ministries.map((ministry, index) => (
        <Reveal
          id={ministryAnchor(ministry.number)}
          key={ministryHref(ministry)}
          from={index % 3 === 0 ? "left" : index % 3 === 2 ? "right" : "up"}
          delay={(index % 3) * 90}
          className="h-full scroll-mt-80"
        >
          <MinistryCard
            ministry={ministry}
            index={index}
            href={ministryHref(ministry)}
            actionLabel="View details"
          />
        </Reveal>
      ))}
    </div>
  )
}
