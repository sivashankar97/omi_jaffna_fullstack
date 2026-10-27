"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"

import { notifyAuthChanged, signOutSession } from "@/components/auth/session"
import { MotionReveal } from "@/components/motion/motion-reveal"
import { site } from "@/config/site"
import { useSiteInfo } from "@/components/layout/site-info"
import { isUpload } from "@/content/site-info"
import { cn } from "cn"

type Mode = "login" | "register"

type Member = {
  name: string
  email: string
  role: "admin" | "editor" | "publisher" | "father"
  father_id: string | null
}

const AUTH_ART = "/images/faithful-horizons-sunrise.jpg"

const fieldLabel = "mb-1.5 block text-[11px] font-semibold tracking-[0.16em] text-[#5c6b7a] uppercase"

const fieldInput =
  "w-full rounded-xl border border-[#cfe9ef] bg-white/90 px-4 py-2.5 text-sm text-[#023e8a] outline-none transition placeholder:text-[#9aa8b5] focus:border-[#17b3c6] focus:ring-3 focus:ring-[#17b3c6]/25"

const primaryBtn =
  "inline-flex w-full items-center justify-center rounded-xl bg-[#17b3c6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgb(23_179_198/0.7)] transition hover:bg-[#0e98ac] disabled:opacity-60"

function errorMessage(error: unknown, fallback: string) {
  if (typeof error === "string") return error
  const fields = (error as { fieldErrors?: Record<string, string[]> } | undefined)?.fieldErrors
  const first = fields && Object.entries(fields)[0]
  if (!first) return fallback
  const labels: Record<string, string> = {
    name: "Full name",
    father_id: "Father ID",
    date_of_birth: "Date of birth",
    email: "Email",
    mobile_number: "Mobile number",
    password: "Password",
  }
  return `${labels[first[0]] ?? first[0]}: ${first[1][0]}`
}

export function MemberAccess({ mode }: { mode: Mode }) {
  const siteInfo = useSiteInfo()
  const [notice, setNotice] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [member, setMember] = useState<Member | null>(null)
  const register = mode === "register"

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const user = data?.user as Member | undefined
        if (user?.role === "father") {
          window.location.assign("/dashboard")
          return
        }
        setMember(user ?? null)
      })
      .catch(() => setMember(null))
  }, [])

  function signedIn(user: Member) {
    notifyAuthChanged(user)
    if (user.role !== "father") {
      window.location.assign("/admin")
      return
    }
    window.location.assign("/dashboard")
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (name: string) => String(data.get(name) ?? "").trim()

    let body: Record<string, string>
    if (register) {
      body = {
        name: value("name"),
        father_id: value("father_id"),
        date_of_birth: value("date_of_birth"),
        email: value("email"),
        mobile_number: value("mobile_number"),
        password: String(data.get("password") ?? ""),
      }
      if (Object.values(body).some((field) => !field)) {
        setNotice("Fill in every field to register.")
        return
      }
      if (body.password.length < 12) {
        setNotice("Choose a password of at least 12 characters.")
        return
      }
    } else {
      body = { identifier: value("identity"), password: String(data.get("password") ?? "") }
      if (!body.identifier || !body.password) {
        setNotice("Add your Father ID and password.")
        return
      }
    }

    setBusy(true)
    setNotice("")
    try {
      const response = await fetch(register ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(
          response.status === 429
            ? "Too many attempts. Please wait a few minutes and try again."
            : errorMessage(result.error, register ? "Registration failed." : "Sign in failed.")
        )
        return
      }
      signedIn(result.user)
    } catch {
      setNotice("The site could not be reached. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    await signOutSession()
    setMember(null)
  }

  return (
    <section className="member-access-stage relative isolate flex min-h-[calc(100svh-4.5rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/3 size-[28rem] -translate-x-1/2 rounded-full bg-[#17b3c6]/18 blur-[120px]"
      />

      <MotionReveal className="member-access-shell relative z-10 grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.05fr_minmax(0,1fr)]">
        {/* Left — full art */}
        <div className="relative hidden min-h-[36rem] lg:block">
          <Image
            src={AUTH_ART}
            alt=""
            fill
            priority
            sizes="(min-width:1024px) 52vw, 100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#03202b]/55 via-transparent to-[#03202b]/15"
          />
          <div className="absolute inset-x-0 bottom-0 p-7 text-white">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/75 uppercase">
              {site.shortName}
            </p>
            <p className="mt-2 font-heading text-2xl font-semibold leading-tight">{site.tagline}</p>
          </div>
        </div>

        {/* Right — white glass register / login card */}
        <div className="member-access-glass relative flex flex-col justify-center px-6 py-9 sm:px-9 sm:py-11 lg:px-10">
          <div className="mb-6 flex items-center gap-2.5">
            <Image
              src={siteInfo.logos.emblemImage}
              unoptimized={isUpload(siteInfo.logos.emblemImage)}
              alt=""
              width={36}
              height={36}
              className="size-9 object-contain"
              priority
            />
            <span className="text-sm font-semibold text-[#023e8a]">{site.shortName}</span>
          </div>

          {member ? (
            <div>
              <h1 className="font-heading text-2xl font-semibold text-[#023e8a] sm:text-[1.7rem]">Welcome</h1>
              <p className="mt-2 text-sm text-[#5c6b7a]">You are signed in</p>
              <p className="mt-6 text-lg font-medium text-[#023e8a]">{member.name}</p>
              {member.father_id ? (
                <p className="mt-1 text-sm text-[#5c6b7a]">Father ID {member.father_id}</p>
              ) : null}
              <p className="text-sm text-[#5c6b7a]">{member.email}</p>
              <div className="mt-8 flex flex-col gap-3">
                {member.role === "father" ? (
                  <Link href="/dashboard" className={primaryBtn}>
                    Open profile
                  </Link>
                ) : (
                  <a href="/admin" className={primaryBtn}>
                    Open the CMS
                  </a>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  className="text-sm font-semibold text-[#023e8a] transition hover:text-[#17b3c6]"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="w-full" noValidate>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#023e8a] sm:text-[1.7rem]">
                {register ? "Create your Father account" : "Please enter your account details"}
              </h1>
              <p className="mt-2 text-sm text-[#5c6b7a]">
                {register
                  ? "Use your Father ID and Province details to open a secure profile."
                  : "Enter your Father ID and password to continue."}
              </p>

              {register ? (
                <div className="mt-6 grid gap-3.5">
                  <div>
                    <label className={fieldLabel} htmlFor="reg-name">
                      Full name
                    </label>
                    <input
                      id="reg-name"
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="As on Province records"
                      className={fieldInput}
                    />
                  </div>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className={fieldLabel} htmlFor="reg-father">
                        Father ID
                      </label>
                      <input
                        id="reg-father"
                        name="father_id"
                        autoComplete="username"
                        required
                        placeholder="e.g. OMI-…"
                        className={fieldInput}
                      />
                    </div>
                    <div>
                      <label className={fieldLabel} htmlFor="reg-dob">
                        Date of birth
                      </label>
                      <input
                        id="reg-dob"
                        name="date_of_birth"
                        type="date"
                        autoComplete="bday"
                        required
                        className={fieldInput}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel} htmlFor="reg-email">
                      Email
                    </label>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className={fieldInput}
                    />
                  </div>
                  <div>
                    <label className={fieldLabel} htmlFor="reg-mobile">
                      Mobile number
                    </label>
                    <input
                      id="reg-mobile"
                      name="mobile_number"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="+94 …"
                      className={fieldInput}
                    />
                  </div>
                  <div>
                    <label className={fieldLabel} htmlFor="reg-password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={12}
                        placeholder="At least 12 characters"
                        className={cn(fieldInput, "pr-11")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((open) => !open)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9aa8b5] transition hover:text-[#17b3c6]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-7 grid gap-4">
                  <div>
                    <label className={fieldLabel} htmlFor="login-id">
                      Father ID
                    </label>
                    <input
                      id="login-id"
                      name="identity"
                      autoComplete="username"
                      required
                      placeholder="Your Father ID"
                      className={fieldInput}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <label className={cn(fieldLabel, "mb-0")} htmlFor="login-password">
                        Password
                      </label>
                      <Link href="/contact" className="text-xs font-semibold text-[#17b3c6] hover:text-[#0e98ac]">
                        Forgot Password
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        placeholder="••••••••••••"
                        className={cn(fieldInput, "pr-11")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((open) => !open)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9aa8b5] transition hover:text-[#17b3c6]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {notice ? (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-[#f3c1c1] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]"
                >
                  {notice}
                </p>
              ) : null}

              <button type="submit" disabled={busy} className={cn(primaryBtn, "mt-6")}>
                {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
              </button>

              <p className="mt-6 text-center text-sm text-[#5c6b7a]">
                {register ? "Already have an account? " : "New Father account? "}
                <Link
                  href={register ? "/login" : "/register"}
                  className="font-semibold text-[#023e8a] transition hover:text-[#17b3c6]"
                >
                  {register ? "Sign in" : "Create an account"}
                </Link>
              </p>
            </form>
          )}
        </div>
      </MotionReveal>
    </section>
  )
}
