"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"

import { notifyAuthChanged, signOutSession } from "@/components/auth/session"
import { site } from "@/config/site"
import { useSiteInfo } from "@/components/layout/site-info"
import { isUpload } from "@/content/site-info"

type Mode = "login" | "register"

type Member = {
  name: string
  email: string
  role: "admin" | "editor" | "publisher" | "father"
  father_id: string | null
}

/** Register / login palette */
const C = {
  lightest: "#EDFBFD",
  light: "#D6F6FA",
  soft: "#ACEEF6",
  bright: "#75E2F0",
  primary: "#3ED7EA",
  gold: "#FFCF4A",
  ink: "#023e8a",
  muted: "#3d5a6c",
}

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-[#ACEEF6] bg-[#EDFBFD] px-3 py-2.5 text-base text-[#023e8a] outline-none placeholder:text-[#5a7a8a] focus:border-[#3ED7EA] focus:bg-white focus:ring-2 focus:ring-[#75E2F0]/50"

const primaryBtn =
  "inline-flex w-full items-center justify-center rounded-lg bg-[#3ED7EA] px-5 py-3 text-sm font-bold text-[#023e8a] transition hover:bg-[#75E2F0] disabled:opacity-60 sm:w-auto sm:min-w-40"

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
    <section className="min-h-[calc(100svh-4.5rem)] w-full" style={{ backgroundColor: C.lightest }}>
      <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col lg:flex-row">
        {/* Brand — full height, no side gaps */}
        <aside
          className="flex w-full shrink-0 flex-col items-center justify-center gap-3 px-6 py-10 text-center sm:px-10 lg:w-[36%] lg:py-16"
          style={{ background: `linear-gradient(165deg, ${C.primary} 0%, ${C.bright} 45%, ${C.soft} 100%)` }}
        >
          <Image
            src={siteInfo.logos.emblemImage}
            unoptimized={isUpload(siteInfo.logos.emblemImage)}
            alt="Oblate Province of Jaffna"
            width={120}
            height={120}
            className="size-24 object-contain sm:size-28"
            priority
          />
          <p className="font-heading text-xl font-semibold sm:text-2xl" style={{ color: C.ink }}>
            {site.name}
          </p>
          <p className="max-w-xs text-sm" style={{ color: C.muted }}>
            {site.tagline}
          </p>
          <span
            className="mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase"
            style={{ backgroundColor: C.gold, color: C.ink }}
          >
            {register ? "New account" : "Members"}
          </span>
        </aside>

        {/* Form — fills remaining width */}
        <div
          className="flex w-full flex-1 flex-col justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16"
          style={{ backgroundColor: "#ffffff" }}
        >
          {member ? (
            <div className="w-full max-w-xl">
              <h1 className="font-heading text-3xl font-semibold" style={{ color: C.ink }}>
                Welcome
              </h1>
              <p className="mt-1 text-sm" style={{ color: C.muted }}>
                You are signed in
              </p>
              <p className="mt-6 text-lg font-medium" style={{ color: C.ink }}>
                {member.name}
              </p>
              {member.father_id ? (
                <p className="mt-1 text-sm" style={{ color: C.muted }}>
                  Father ID {member.father_id}
                </p>
              ) : null}
              <p className="text-sm" style={{ color: C.muted }}>
                {member.email}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  className="text-sm font-semibold hover:underline"
                  style={{ color: C.ink }}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="w-full max-w-3xl" noValidate>
              <h1 className="font-heading text-3xl font-semibold sm:text-4xl" style={{ color: C.ink }}>
                {register ? "Register" : "Login"}
              </h1>
              <p className="mt-2 text-sm leading-6" style={{ color: C.muted }}>
                {register
                  ? "Create a Father account with your Father ID. All fields are required."
                  : "Sign in with your Father ID and password."}
              </p>

              {register ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium sm:col-span-2" style={{ color: C.muted }}>
                    Full name
                    <input name="name" autoComplete="name" required className={fieldClass} />
                  </label>
                  <label className="block text-sm font-medium" style={{ color: C.muted }}>
                    Father ID
                    <input
                      name="father_id"
                      autoComplete="username"
                      required
                      placeholder="OMI / oblation number"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block text-sm font-medium" style={{ color: C.muted }}>
                    Date of birth
                    <input name="date_of_birth" type="date" autoComplete="bday" required className={fieldClass} />
                  </label>
                  <label className="block text-sm font-medium" style={{ color: C.muted }}>
                    Email
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="name@email.com"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block text-sm font-medium" style={{ color: C.muted }}>
                    Mobile number
                    <input name="mobile_number" type="tel" autoComplete="tel" required className={fieldClass} />
                  </label>
                  <label className="block text-sm font-medium sm:col-span-2" style={{ color: C.muted }}>
                    Password
                    <span className="relative mt-1.5 block">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={12}
                        placeholder="At least 12 characters"
                        className={`${fieldClass} mt-0 pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((open) => !open)}
                        className="absolute top-1/2 right-3 -translate-y-1/2"
                        style={{ color: C.ink }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </span>
                  </label>
                </div>
              ) : (
                <div className="mt-8 grid max-w-md gap-4">
                  <label className="block text-sm font-medium" style={{ color: C.muted }}>
                    Father ID
                    <input
                      name="identity"
                      autoComplete="username"
                      required
                      placeholder="Your Father ID"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block text-sm font-medium" style={{ color: C.muted }}>
                    Password
                    <span className="relative mt-1.5 block">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        placeholder="Enter password"
                        className={`${fieldClass} mt-0 pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((open) => !open)}
                        className="absolute top-1/2 right-3 -translate-y-1/2"
                        style={{ color: C.ink }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </span>
                  </label>
                  <Link href="/contact" className="text-sm font-semibold hover:underline" style={{ color: C.ink }}>
                    Forgot password?
                  </Link>
                </div>
              )}

              {notice ? (
                <p role="alert" className="mt-5 text-sm leading-6 text-[#b42318]">
                  {notice}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <button type="submit" disabled={busy} className={primaryBtn}>
                  {busy ? "Please wait…" : register ? "Register" : "Log in"}
                </button>
                <p className="text-sm" style={{ color: C.muted }}>
                  {register ? "Already have an account?" : "New Father?"}{" "}
                  <Link
                    href={register ? "/login" : "/register"}
                    className="font-bold hover:underline"
                    style={{ color: C.ink }}
                  >
                    {register ? "Log in" : "Register"}
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
