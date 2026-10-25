import type { Metadata } from "next"

import { LibrarySectionPage } from "@/components/sections/library/library-section-page"

export const metadata: Metadata = {
  title: "Magazines · Library",
  description: "Province magazines available to download as PDF.",
}

export default function MagazinesPage() {
  return <LibrarySectionPage section="magazine" />
}
