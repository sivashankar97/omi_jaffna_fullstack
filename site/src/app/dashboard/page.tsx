import type { Metadata } from "next"

import { FatherDashboard } from "@/components/auth/father-dashboard"
import { categoriesForSection } from "@/content/library"
import { getBlock } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Father dashboard",
  description: "Personal details, documents, actions, gallery and news for Oblate Fathers of the Province of Jaffna.",
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const library = await getBlock("library")
  return <FatherDashboard libraryCategories={categoriesForSection("libraries", library)} />
}
