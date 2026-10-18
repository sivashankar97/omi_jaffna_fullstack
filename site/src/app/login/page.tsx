import type { Metadata } from "next"

import { MemberAccess } from "@/components/auth/member-access"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the Oblate Province of Jaffna site.",
}

export default function LoginPage() {
  return <MemberAccess mode="login" />
}
