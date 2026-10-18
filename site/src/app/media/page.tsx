import type { Metadata } from "next"

import { PageHero } from "@/components/layout/page-hero"
import { defaultPublications, MediaPublications } from "@/components/sections/media/media-publications"
import { MediaStudio } from "@/components/sections/media/media-studio"
import { SocialSignals } from "@/components/sections/media/social-signals"
import { getMinistries, getNews, getPublications, getTimeline } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Media",
  description: "Digital mission, photos, video, reflections and publications of the Oblate Province of Jaffna.",
}

export default async function MediaPage() {
  const [news, ministries, timeline, publications] = await Promise.all([
    getNews(),
    getMinistries(),
    getTimeline(),
    getPublications(defaultPublications),
  ])
  return (
    <>
      <PageHero
        id="digital-mission"
        tone="black"
        kicker="Digital mission"
        title="The screen is also a mission field"
        summary="Technology should serve evangelization, human dignity and community. The church, the village, the school and the smartphone are all places where the Gospel can be shared."
      />
      <SocialSignals />
      <MediaStudio news={news} ministries={ministries} timeline={timeline} />
      <MediaPublications publications={publications} />
    </>
  )
}
