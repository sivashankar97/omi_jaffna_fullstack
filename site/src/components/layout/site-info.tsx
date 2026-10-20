"use client"

import { createContext, useContext, type ReactNode } from "react"

import { siteInfoDefaults, type SiteInfo } from "@/content/site-info"

const SiteInfoContext = createContext<SiteInfo>(siteInfoDefaults)

/** Contact details and social links from the CMS, for client components. */
export function SiteInfoProvider({ value, children }: { value: SiteInfo; children: ReactNode }) {
  return <SiteInfoContext value={value}>{children}</SiteInfoContext>
}

export const useSiteInfo = () => useContext(SiteInfoContext)
