import type { Metadata } from "next"

import { LibrarySectionPage } from "@/components/sections/library/library-section-page"

export const metadata: Metadata = {
  title: "Books · Library",
  description: "New book releases available to download as PDF.",
}

export default function BooksPage() {
  return <LibrarySectionPage section="books" />
}
