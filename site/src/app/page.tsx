import { HomeSections } from "@/components/sections/home/home-sections"
import { HeroSection } from "@/components/sections/hero/hero-section"
import { getBlock, getHomeContent } from "@/lib/cms"

export default async function HomePage() {
  const [{ hero }, banner] = await Promise.all([getHomeContent(), getBlock("home")])
  return (
    <>
      <HeroSection hero={hero} media={banner.hero} />
      <HomeSections />
    </>
  )
}
