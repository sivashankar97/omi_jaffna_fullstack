import type { Metadata } from "next"
import { Noto_Sans_Tamil } from "next/font/google"
import { cookies } from "next/headers"

import { PageTheme } from "@/components/layout/page-theme"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteInfoProvider } from "@/components/layout/site-info"
import { ProvinceMap } from "@/components/map/province-map"
import { buildNavigation } from "@/config/navigation"
import { site } from "@/config/site"
import { getFormationHouses, getMapLocations, getMinistries, getParishes, getSiteInfo } from "@/lib/cms"

import "./globals.css"

const tamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tamil",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.congregation}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = (await cookies()).get("omi-theme")?.value
  const [ministries, parishes, formationHouses, mapLocations, siteInfo] = await Promise.all([
    getMinistries(),
    getParishes(),
    getFormationHouses(),
    getMapLocations(),
    getSiteInfo(),
  ])
  const navigation = buildNavigation({ ministries, parishes, formationHouses })

  return (
    <html
      lang="en"
      className={`${tamil.variable} h-full antialiased${theme === "dark" ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteInfoProvider value={siteInfo}>
          <SiteHeader navigation={navigation} />
          <main className="flex-1">
            <PageTheme>{children}</PageTheme>
          </main>
          <ProvinceMap locations={mapLocations} />
          <SiteFooter navigation={navigation} info={siteInfo} />
        </SiteInfoProvider>
      </body>
    </html>
  )
}
