import type { Metadata } from "next"

import { ForgotPassword } from "@/components/auth/password-recovery"

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Get a link to reset your Oblate Province of Jaffna account password.",
  robots: { index: false },
}

export default function ForgotPasswordPage() {
  return <ForgotPassword />
}
