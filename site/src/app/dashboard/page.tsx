import type { Metadata } from "next"

import { FatherDashboard } from "@/components/auth/father-dashboard"

export const metadata: Metadata = {
  title: "Father dashboard",
  description: "Personal details, documents, actions, gallery and news for Oblate Fathers of the Province of Jaffna.",
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return <FatherDashboard />
}
