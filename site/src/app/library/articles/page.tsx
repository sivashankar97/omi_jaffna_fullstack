import type { Metadata } from "next"

import { LibrarySectionPage } from "@/components/sections/library/library-section-page"

export const metadata: Metadata = {
  title: "Articles · Library",
  description: "Articles available to download as PDF.",
}

export default function ArticlesPage() {
  return <LibrarySectionPage section="articles" />
}