"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, MailCheck, UserRound } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"

import {
  AuthArtPanel,
  AuthField,
  FieldHint,
  FieldIcon,
  fieldInput,
  fieldInputError,
  fieldLabel,
  primaryBtn,
} from "@/components/auth/member-access"
import { MotionHero } from "@/components/motion/motion-reveal"
import { site } from "@/config/site"
import { useSiteInfo } from "@/components/layout/site-info"
import { isUpload } from "@/content/site-info"
import { cn } from "cn"

type Status = { kind: "error" | "success"; text: string } | null

function Notice({ status }: { status: Status }) {
  if (!status) return null
  return (
    <p
      role={status.kind === "error" ? "alert" : "status"}
      className={cn(
        "mt-4 rounded-xl border px-4 py-3 text-sm",
        status.kind === "error"
          ? "border-[#f3c1c1] bg-[#fff5f5] text-[#b42318]"
          : "border-[#bfe7ee] bg-[#effafc] text-[#0b4a5c]"
      )}
    >
      {status.text}
    </p>
  )
}

function errorText(result: { error?: unknown }, fallback: string) {
  if (typeof result.error === "string") return result.error
  const fields = (result.error as { fieldErrors?: Record<string, string[]> } | undefined)?.fieldErrors
  return Object.values(fields ?? {}).flat()[0] || fallback
}

function Shell({ children }: { children: React.ReactNode }) {
  const siteInfo = useSiteInfo()
  return (
    <section className="member-access-stage relative isolate flex min-h-[calc(100svh-5.5rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <MotionHero className="member-access-shell relative z-10 grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.05fr_minmax(0,1fr)]">
        <AuthArtPanel />
        <div className="member-access-glass relative flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
          <div className="member-access-field mb-5 flex items-center gap-2.5" style={{ animationDelay: "0.18s" }}>
            <Image
              src={siteInfo.logos.emblemImage}
              unoptimized={isUpload(siteInfo.logos.emblemImage)}
              alt=""
              width={40}
              height={40}
              className="size-10 object-contain"
              priority
            />
            <span className="text-sm font-semibold text-[#0b4a5c]">{site.shortName}</span>
          </div>
          {children}
        </div>
      </MotionHero>
    </section>
  )
}

function BackToLogin() {
  return (
    <p className="mt-6 text-center text-sm text-[#5a7380]">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 font-semibold text-[#0b4a5c] transition hover:text-[#0f8fa3]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign in
      </Link>
    </p>
  )
}

export function ForgotPassword() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const identifier = String(new FormData(event.currentTarget).get("identifier") ?? "").trim()
    if (!identifier) {
      setError("Enter your email or OMI ID.")
      return
    }
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ identifier }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.status === 429) setError("Too many requests. Please wait a few minutes and try again.")
      else if (!response.ok) setError(errorText(result, "Could not send the reset link. Please try again."))
      else setSent(result.message || "If an account matches, a reset link has been sent to its email address.")
    } catch {
      setError("The site could not be reached. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Shell>
      {sent ? (
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-[#e7f7fa] text-[#0f8fa3]">
            <MailCheck className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-heading text-[1.55rem] leading-tight font-semibold text-[#0b4a5c] sm:text-[1.75rem]">
            Check your email
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5a7380]">{sent}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#5a7380]">
            No email after a few minutes? Check your spam folder, or contact the Province office to confirm the email on
            your account.
          </p>
          <button type="button" onClick={() => setSent("")} className={cn(primaryBtn, "mt-6")}>
            Send another link
          </button>
          <BackToLogin />
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <AuthField delay={0.22}>
            <h1 className="font-heading text-[1.55rem] leading-tight font-semibold tracking-tight text-[#0b4a5c] sm:text-[1.75rem]">
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#5a7380]">
              Enter your OMI ID or the email on your account. We will email you a link to choose a new password.
            </p>
          </AuthField>
          <AuthField delay={0.3}>
            <label className={cn(fieldLabel, "mt-7")} htmlFor="forgot-id">
              Email or OMI ID
            </label>
            <div className="relative">
              <FieldIcon>
                <UserRound className="size-4" />
              </FieldIcon>
              <input
                id="forgot-id"
                name="identifier"
                autoComplete="username"
                required
                autoFocus
                placeholder="you@example.com or 14080"
                aria-invalid={Boolean(error)}
                onChange={() => setError("")}
                className={cn(fieldInput, "pl-10", error && fieldInputError)}
              />
            </div>
            <FieldHint hint="Staff (CMS) accounts: use your staff email." />
          </AuthField>
          <Notice status={error ? { kind: "error", text: error } : null} />
          <AuthField delay={0.38}>
            <button type="submit" disabled={busy} className={cn(primaryBtn, "mt-6")}>
              {busy ? "Sending…" : "Send reset link"}
              {!busy ? <ArrowRight className="member-access-cta-arrow size-4" aria-hidden="true" /> : null}
            </button>
          </AuthField>
          <BackToLogin />
        </form>
      )}
    </Shell>
  )
}

export function ResetPassword({ token }: { token: string }) {
  const [valid, setValid] = useState<boolean | null>(token ? null : false)
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [status, setStatus] = useState<Status>(null)
  const [done, setDone] = useState<{ role: string; message: string } | null>(null)

  useEffect(() => {
    if (!token) return
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((result) => setValid(Boolean(result.valid)))
      .catch(() => setValid(true))
  }, [token])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const password = String(data.get("password") ?? "")
    const confirm = String(data.get("confirm") ?? "")
    const next: typeof errors = {}
    if (password.length < 12) next.password = "Use at least 12 characters."
    else if (new TextEncoder().encode(password).length > 72) next.password = "Password is too long."
    if (confirm !== password) next.confirm = "The two passwords do not match."
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    setStatus(null)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token, password }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.status === 429) setStatus({ kind: "error", text: "Too many attempts. Please wait a few minutes." })
      else if (!response.ok) {
        const text = errorText(result, "Could not change the password.")
        if (/invalid or has expired/i.test(text)) setValid(false)
        else setStatus({ kind: "error", text })
      } else setDone({ role: result.role, message: result.message })
    } catch {
      setStatus({ kind: "error", text: "The site could not be reached. Please try again." })
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    const staff = done.role !== "father"
    return (
      <Shell>
        <span className="grid size-12 place-items-center rounded-2xl bg-[#e7f7fa] text-[#0f8fa3]">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-heading text-[1.55rem] leading-tight font-semibold text-[#0b4a5c] sm:text-[1.75rem]">
          Password changed
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5a7380]">{done.message}</p>
        <a href={staff ? "/admin" : "/login"} className={cn(primaryBtn, "mt-6")}>
          {staff ? "Sign in to the CMS" : "Sign in"}
          <ArrowRight className="member-access-cta-arrow size-4" aria-hidden="true" />
        </a>
      </Shell>
    )
  }

  if (valid === false) {
    return (
      <Shell>
        <h1 className="font-heading text-[1.55rem] leading-tight font-semibold text-[#0b4a5c] sm:text-[1.75rem]">
          This link has expired
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5a7380]">
          Reset links work once and only for 60 minutes. Request a new link to choose your password.
        </p>
        <Link href="/forgot-password" className={cn(primaryBtn, "mt-6")}>
          Request a new link
          <ArrowRight className="member-access-cta-arrow size-4" aria-hidden="true" />
        </Link>
        <BackToLogin />
      </Shell>
    )
  }

  return (
    <Shell>
      <form onSubmit={onSubmit} noValidate>
        <AuthField delay={0.22}>
          <h1 className="font-heading text-[1.55rem] leading-tight font-semibold tracking-tight text-[#0b4a5c] sm:text-[1.75rem]">
            Choose a new password
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a7380]">
            Use at least 12 characters. After saving, you will sign in again on every device.
          </p>
        </AuthField>
        <div className="mt-7 grid gap-4">
          {(["password", "confirm"] as const).map((field, index) => (
            <AuthField key={field} delay={0.3 + index * 0.08}>
              <label className={fieldLabel} htmlFor={`reset-${field}`}>
                {field === "password" ? "New password" : "Repeat new password"}
              </label>
              <div className="relative">
                <FieldIcon>
                  <Lock className="size-4" />
                </FieldIcon>
                <input
                  id={`reset-${field}`}
                  name={field}
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={12}
                  disabled={valid === null}
                  placeholder="At least 12 characters"
                  aria-invalid={Boolean(errors[field])}
                  className={cn(fieldInput, "pr-11 pl-10", errors[field] && fieldInputError)}
                />
                {field === "password" ? (
                  <button
                    type="button"
                    onClick={() => setShow((open) => !open)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8aa3ad] transition hover:text-[#0f8fa3]"
                    aria-label={show ? "Hide passwords" : "Show passwords"}
                    aria-pressed={show}
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                ) : null}
              </div>
              <FieldHint error={errors[field]} />
            </AuthField>
          ))}
        </div>
        <Notice status={status} />
        <button type="submit" disabled={busy || valid === null} className={cn(primaryBtn, "mt-6")}>
          {valid === null ? "Checking link…" : busy ? "Saving…" : "Save new password"}
          {!busy && valid ? <ArrowRight className="member-access-cta-arrow size-4" aria-hidden="true" /> : null}
        </button>
        <BackToLogin />
      </form>
    </Shell>
  )
}
