import type { Metadata } from "next"
import Link from "next/link"

import { PageHero } from "@/components/layout/page-hero"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { houseAnchor } from "@/config/navigation"
import { getFormationHouses } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Vocations",
  description: "Discern a missionary vocation with the Oblate Province of Jaffna.",
}

export default async function VocationsPage() {
  const formationHouses = await getFormationHouses()
  return (
    <>
      <PageHero
        id="the-call"
        tone="black"
        kicker="Formation"
        title="A call to give one’s life in service of the Gospel"
        summary="The Province accompanies those who discern this call through prayer, study, community life, pastoral experience, spiritual direction and missionary formation."
      />
      <section className="bg-[#f7fbff] px-4 py-16 text-[#023e8a] sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {formationHouses.map((house, index) => (
            <Reveal id={houseAnchor(house.name)} key={house.name} delay={index * 90}>
              <article className="rounded-2xl border-2 border-[#023e8a] bg-white p-6">
                <h2 className="font-heading text-2xl">{house.name}</h2>
                {house.place ? <p className="mt-2">{house.place}</p> : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section id="discernment" className="scroll-mt-80 bg-white px-4 py-16 text-center text-[#023e8a] sm:px-8">
        <h2 className="font-heading text-4xl">Begin with prayer and conversation</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/contact">Contact the vocation team</Link>
          </Button>
          <Button asChild>
            <Link href="/charism">Read the charism</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
