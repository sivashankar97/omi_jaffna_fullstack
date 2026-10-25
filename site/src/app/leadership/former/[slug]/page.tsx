import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LeadershipPersonProfile } from "@/components/sections/leadership/leadership-person-profile"
import { formerProvincialHref } from "@/config/navigation"
import { getFormerProvincial, getFormerProvincials } from "@/lib/cms"

type FormerPageProps = {
  params: Promise<{ slug: string }>
}

function toProfile(person: {
  slug: string
  name: string
  dates: string
  summary: string
  bio: string
  image?: string
  gallery: { src: string; alt: string; caption: string }[]
}) {
  return {
    slug: person.slug,
    name: person.name,
    role: "Former Provincial",
    term: person.dates,
    summary: person.summary,
    bio: person.bio,
    image: person.image,
    gallery: person.gallery,
  }
}

export async function generateStaticParams() {
  return (await getFormerProvincials()).map((person) => ({ slug: person.slug }))
}

export async function generateMetadata({ params }: FormerPageProps): Promise<Metadata> {
  const { slug } = await params
  const person = await getFormerProvincial(slug)
  if (!person) return { title: "Former Provincial" }
  return {
    title: `${person.name} · Leadership`,
    description: person.summary || person.dates || `Profile of ${person.name}, Former Provincial.`,
  }
}

export default async function FormerProvincialPage({ params }: FormerPageProps) {
  const { slug } = await params
  const former = await getFormerProvincials()
  const index = former.findIndex((person) => person.slug === slug)
  const person = index >= 0 ? former[index] : await getFormerProvincial(slug)
  if (!person) notFound()

  const resolvedIndex = index >= 0 ? index : former.findIndex((row) => row.slug === person.slug)
  const previous = resolvedIndex >= 0 ? former[(resolvedIndex - 1 + former.length) % former.length] : null
  const next = resolvedIndex >= 0 ? former[(resolvedIndex + 1) % former.length] : null
  const showNav = former.length > 1 && previous && next && previous.slug !== person.slug

  return (
    <LeadershipPersonProfile
      kind="former"
      person={toProfile(person)}
      previous={showNav ? toProfile(previous) : null}
      next={showNav ? toProfile(next!) : null}
      hrefFor={formerProvincialHref}
    />
  )
}
