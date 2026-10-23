import type { Metadata } from "next"

import { MemberAccess } from "@/components/auth/member-access"

export const metadata: Metadata = {
  title: "Father registration",
  description: "Create a Father account for the Oblate Province of Jaffna profile dashboard.",
}

export default function RegisterPage() {
  return <MemberAccess mode="register" />
}
