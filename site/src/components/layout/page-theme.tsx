"use client"

import { usePathname } from "next/navigation"

const pageThemes: Record<string, string> = {
  "/about": "reef",
  "/charism": "tide",
  "/parishes": "depth",
  "/publications": "moon",
  "/login": "slate",
  "/register": "harbor",
}

export function PageTheme({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const theme = pageThemes[pathname]

  if (!theme) return children

  return (
    <div data-page-theme={theme} className="page-theme">
      {children}
    </div>
  )
}
