import { HomeSections } from "@/components/sections/home/home-sections"
import { HeroSection } from "@/components/sections/hero/hero-section"
import { getHomeContent } from "@/lib/cms"

export default async function HomePage() {
  const { hero } = await getHomeContent()
  return (
    <>
      <HeroSection hero={hero} />
      <HomeSections />
    </>
  )
}
