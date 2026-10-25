import type { Metadata } from "next"

import { LibrarySectionPage } from "@/components/sections/library/library-section-page"

export const metadata: Metadata = {
  title: "Libraries · Library",
  description: "Books from Oblate libraries available to download as PDF.",
}

export default function LibrariesPage() {
  return <LibrarySectionPage section="libraries" />
}
