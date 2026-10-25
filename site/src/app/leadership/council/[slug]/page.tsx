import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LeadershipPersonProfile } from "@/components/sections/leadership/leadership-person-profile"
import { councilHref } from "@/config/navigation"
import { getCouncilMember, getLeadership } from "@/lib/cms"

type CouncilPageProps = {
  params: Promise<{ slug: string }>
}

function toProfile(person: {
  slug: string
  name: string
  role: string
  term?: string
  summary: string
  bio: string
  image?: string
  gallery: { src: string; alt: string; caption: string }[]
}) {
  return {
    slug: person.slug,
    name: person.name,
    role: person.role,
    term: person.term,
    summary: person.summary,
    bio: person.bio,
    image: person.image,
    gallery: person.gallery,
  }
}

export async function generateStaticParams() {
  return (await getLeadership()).council.map((person) => ({ slug: person.slug }))
}

export async function generateMetadata({ params }: CouncilPageProps): Promise<Metadata> {
  const { slug } = await params
  const person = await getCouncilMember(slug)
  if (!person) return { title: "Council member" }
  return {
    title: `${person.name} · Leadership`,
    description: person.summary || person.role || `Profile of ${person.name}, Provincial Council.`,
  }
}

export default async function CouncilMemberPage({ params }: CouncilPageProps) {
  const { slug } = await params
  const { council } = await getLeadership()
  const index = council.findIndex((person) => person.slug === slug)
  const person = index >= 0 ? council[index] : await getCouncilMember(slug)
  if (!person) notFound()

  const resolvedIndex = index >= 0 ? index : council.findIndex((row) => row.slug === person.slug)
  const previous = resolvedIndex >= 0 ? council[(resolvedIndex - 1 + council.length) % council.length] : null
  const next = resolvedIndex >= 0 ? council[(resolvedIndex + 1) % council.length] : null
  const showNav = council.length > 1 && previous && next && previous.slug !== person.slug

  return (
    <LeadershipPersonProfile
      kind="council"
      person={toProfile(person)}
      previous={showNav ? toProfile(previous) : null}
      next={showNav ? toProfile(next!) : null}
      hrefFor={councilHref}
    />
  )
}
