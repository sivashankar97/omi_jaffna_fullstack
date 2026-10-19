import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Compass, Heart, HandHeart, MapPin, MessageCircle, Sparkles, Users } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { ScrollProgress } from "@/components/sections/history/scroll-progress"
import { PageBanner } from "@/components/sections/page-banner"
import { SectionHeading } from "@/components/sections/section-heading"
import { houseAnchor } from "@/config/navigation"
import { getFormationHouses } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Vocations",
  description: "Discern a missionary vocation with the Oblate Province of Jaffna.",
}

const stageNotes: { match: string; stage: string; text: string }[] = [
  {
    match: "Juniorate",
    stage: "First steps",
    text: "Young men begin to discover community life, prayer and study while completing their education.",
  },
  {
    match: "Pre-Novitiate",
    stage: "Discernment",
    text: "A year of deeper discernment, spiritual direction and preparation for religious life.",
  },
  {
    match: "De Mazenod",
    stage: "Philosophy",
    text: "Philosophical studies, pastoral exposure and growth in the Oblate missionary spirit.",
  },
  {
    match: "Oblate Scholasticate",
    stage: "Theology",
    text: "Theological formation and missionary preparation toward final vows and priesthood.",
  },
]

const signs = [
  { icon: Heart, title: "Love for Christ", text: "A desire to know Jesus more deeply and to follow him with your whole life." },
  { icon: HandHeart, title: "Heart for the poor", text: "Being moved by the suffering of people and wanting to stand with them." },
  { icon: Users, title: "Joy in community", text: "Finding life in sharing prayer, work and mission with brothers." },
  { icon: Compass, title: "Readiness to go", text: "Openness to be sent wherever the Gospel and the people need you most." },
]

const steps = [
  { icon: Sparkles, title: "Pray", text: "Bring the question to God in silence, Scripture and the Eucharist." },
  { icon: MessageCircle, title: "Talk", text: "Speak with an Oblate, your parish priest or the vocation team." },
  { icon: BookOpen, title: "Come and see", text: "Visit a formation house and share in community life for a few days." },
]

export default async function VocationsPage() {
  const formationHouses = await getFormationHouses()
  return (
    <>
      <ScrollProgress />
      <PageBanner
        id="the-call"
        kicker="Vocations"
        title="A call to give one’s life in service of the Gospel"
        summary="The Province accompanies those who discern this call through prayer, study, community life, pastoral experience, spiritual direction and missionary formation."
      >
        <Link
          href="/contact"
          className="rounded-full bg-[#ffcf4a] px-6 py-3 text-sm font-semibold text-[#03202b] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
        >
          Talk to the vocation team
        </Link>
        <Link
          href="#formation-journey"
          className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          The formation journey
        </Link>
      </PageBanner>

      <section className="bg-white px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24">
        <SectionHeading
          kicker="Is God calling you?"
          title="Signs of a missionary vocation"
          subtitle="A vocation is rarely a sudden voice. It often grows quietly through desires like these."
        />
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signs.map((sign, index) => (
            <Reveal key={sign.title} from="up" delay={index * 110} className="h-full">
              <article className="group h-full rounded-[1.75rem] border border-[#d5dee6] bg-white p-7 transition duration-500 hover:-translate-y-2 hover:border-[#17b3c6] hover:shadow-[0_30px_60px_-30px_rgba(10,80,98,0.55)]">
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#0a5062] to-[#17b3c6] text-white transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <sign.icon className="size-7" strokeWidth={1.7} />
                </span>
                <h3 className="mt-6 font-heading text-2xl font-semibold text-[#023e8a]">{sign.title}</h3>
                <p className="mt-3 leading-7 text-[#5c6b7a]">{sign.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="formation-journey"
        className="relative isolate scroll-mt-80 overflow-hidden bg-[#f4fbfd] px-4 py-20 text-[#023e8a] sm:px-8 sm:py-24"
      >
        <SectionHeading
          kicker="Formation houses"
          title="The formation journey"
          subtitle="Step by step, candidates grow in prayer, study, community and mission."
        />
        <ol className="relative mx-auto mt-16 max-w-4xl">
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-[#17b3c6] via-[#0a5062] to-[#ffcf4a] sm:left-1/2"
          />
          {formationHouses.map((house, index) => {
            const note = stageNotes.find((item) => house.name.includes(item.match))
            const right = index % 2 === 1
            return (
              <Reveal
                id={houseAnchor(house.name)}
                key={house.name}
                as="li"
                from={right ? "right" : "left"}
                delay={index * 80}
                className={`relative mb-10 pl-16 last:mb-0 sm:w-1/2 sm:pl-0 ${right ? "sm:ml-auto sm:pl-12" : "sm:pr-12"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-6 left-6 grid size-10 -translate-x-1/2 place-items-center rounded-full bg-white font-heading text-sm font-semibold text-[#0a5062] shadow-md ring-4 ring-[#17b3c6]/30 ${
                    right ? "sm:left-0" : "sm:right-0 sm:left-auto sm:translate-x-1/2"
                  }`}
                >
                  {index + 1}
                </span>
                <article className="rounded-[1.5rem] border border-[#d5dee6] bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(10,80,98,0.55)]">
                  {note ? (
                    <p className="text-xs font-bold tracking-[0.22em] text-[#17b3c6] uppercase">{note.stage}</p>
                  ) : null}
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-[#023e8a]">{house.name}</h3>
                  {house.place ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5c6b7a]">
                      <MapPin aria-hidden="true" className="size-4 text-[#ffbf00]" />
                      {house.place}
                    </p>
                  ) : null}
                  {note ? <p className="mt-4 leading-7 text-[#3d4b59]">{note.text}</p> : null}
                </article>
              </Reveal>
            )
          })}
        </ol>
      </section>

      <section
        id="discernment"
        className="relative isolate scroll-mt-80 overflow-hidden bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-20 text-white sm:px-8 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="charism-orb pointer-events-none absolute -top-40 -right-32 -z-10 size-[26rem] rounded-full bg-[#17b3c6] opacity-20 blur-[120px]"
        />
        <SectionHeading light kicker="Begin the conversation" title="Begin with prayer and conversation" />
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
          {steps.map((item, index) => (
            <Reveal key={item.title} from="zoom" delay={index * 120} className="h-full">
              <article className="h-full rounded-[1.75rem] border border-white/15 bg-white/5 p-7 text-center backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:bg-white/10">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#ffcf4a] text-[#03202b]">
                  <item.icon className="size-6" />
                </span>
                <p className="mt-4 text-xs font-bold tracking-[0.22em] text-[#ffcf4a] uppercase">Step {index + 1}</p>
                <h3 className="mt-1 font-heading text-2xl font-semibold" style={{ color: "#ffffff" }}>
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-white/75">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal from="up" delay={200} className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-[#ffcf4a] px-6 py-3 text-sm font-semibold text-[#03202b] transition hover:-translate-y-0.5 hover:bg-[#ffd966]"
          >
            Contact the vocation team
          </Link>
          <Link
            href="/charism"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Read the charism
          </Link>
        </Reveal>
      </section>
    </>
  )
}
