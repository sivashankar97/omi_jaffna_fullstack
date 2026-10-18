import type { Metadata } from "next"

import { MemberAccess } from "@/components/auth/member-access"

export const metadata: Metadata = {
  title: "Register",
  description: "Request an account on the Oblate Province of Jaffna site.",
}

export default function RegisterPage() {
  return <MemberAccess mode="register" />
}
