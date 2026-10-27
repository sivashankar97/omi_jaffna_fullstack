"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Mail,
  Phone,
  UserRound,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { FormEvent, useEffect, useState, type ReactNode } from "react"

import { notifyAuthChanged, signOutSession } from "@/components/auth/session"
import { MotionHero } from "@/components/motion/motion-reveal"
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

type FieldErrors = Partial<
  Record<"name" | "father_id" | "date_of_birth" | "email" | "mobile_number" | "password" | "identity", string>
>

const AUTH_ART = "/images/guided-by-sunrise-cross.jpg"
const AUTH_SUPPORT = "Serving with hope. Building communities. Sharing Christ’s love."

/** Same-site path only — blocks `//evil.com` open redirects. */
function safeNextPath(fallback = "/dashboard") {
  if (typeof window === "undefined") return fallback
  const next = new URLSearchParams(window.location.search).get("next")
  if (!next) return fallback
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback
  try {
    const url = new URL(next, window.location.origin)
    if (url.origin !== window.location.origin) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

const fieldLabel = "mb-1.5 block text-[11px] font-semibold tracking-[0.14em] text-[#5a7380] uppercase"

const fieldInput =
  "w-full rounded-[0.85rem] border border-[#d7e8ee] bg-white px-3.5 py-2.5 text-sm text-[#0b4a5c] outline-none transition placeholder:text-[#9aafb8] focus:border-[#17b3c6] focus:ring-3 focus:ring-[#17b3c6]/20"

const fieldInputError = "border-[#e8a0a0] focus:border-[#d14343] focus:ring-[#d14343]/15"

const primaryBtn =
  "member-access-cta inline-flex w-full items-center justify-center gap-2 rounded-[0.9rem] bg-[#0f8fa3] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_32px_-16px_rgb(15_143_163/0.75)] transition hover:bg-[#0c7d8f] disabled:opacity-60"

const ease = [0.22, 1, 0.36, 1] as const

function FieldHint({ error, hint }: { error?: string; hint?: string }) {
  if (error) {
    return (
      <p role="alert" className="mt-1.5 text-[12px] leading-snug text-[#b42318]">
        {error}
      </p>
    )
  }
  if (hint) {
    return <p className="mt-1.5 text-[12px] leading-snug text-[#7a8f9a]">{hint}</p>
  }
  return null
}

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-[#8aa3ad]"
    >
      {children}
    </span>
  )
}

function AuthField({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div className="member-access-field" style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  )
}

function AuthArtPanel() {
  return (
    <div className="relative min-h-[14rem] overflow-hidden sm:min-h-[16rem] lg:min-h-full">
      <Image
        src={AUTH_ART}
        alt=""
        fill
        priority
        sizes="(min-width:1024px) 48vw, 100vw"
        className="member-access-art-media object-cover object-[center_35%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#03202b]/78 via-[#03202b]/25 to-[#03202b]/10"
      />
      <div className="member-access-art-copy absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-9">
        <p className="inline-block border-b-2 border-[#f4c430] pb-1 text-[11px] font-semibold tracking-[0.22em] text-white/90 uppercase">
          {site.shortName}
        </p>
        <p className="mt-3 font-heading text-[1.55rem] leading-tight font-semibold sm:text-[1.85rem]">
          {site.tagline}
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85">{AUTH_SUPPORT}</p>
      </div>
    </div>
  )
}

function parseFieldErrors(error: unknown): FieldErrors {
  if (!error || typeof error !== "object") return {}
  const fields = (error as { fieldErrors?: Record<string, string[]> }).fieldErrors
  if (!fields) return {}
  const next: FieldErrors = {}
  for (const [key, messages] of Object.entries(fields)) {
    if (messages?.[0]) next[key as keyof FieldErrors] = messages[0]
  }
  return next
}

function firstError(errors: FieldErrors, fallback: string) {
  const first = Object.values(errors).find(Boolean)
  return first || fallback
}

export function MemberAccess({ mode }: { mode: Mode }) {
  const siteInfo = useSiteInfo()
  const reduce = useReducedMotion()
  const [notice, setNotice] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [member, setMember] = useState<Member | null>(null)
  const [name, setName] = useState("")
  const [omiId, setOmiId] = useState("")
  const [omiRecognised, setOmiRecognised] = useState(false)
  const register = mode === "register"

  useEffect(() => {
    if (register) return
    const fromQuery = new URLSearchParams(window.location.search).get("notice")
    if (fromQuery) setNotice(fromQuery)
  }, [register])

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const user = data?.user as Member | undefined
        if (!user) {
          setMember(null)
          return
        }
        if (user.role === "father") {
          window.location.assign(safeNextPath("/dashboard"))
          return
        }
        setMember(user)
      })
      .catch(() => setMember(null))
  }, [])

  useEffect(() => {
    if (!register) return
    const id = omiId.trim()
    if (!id || id.length < 3) {
      setOmiRecognised(false)
      return
    }
    const timer = window.setTimeout(() => {
      fetch(`/api/auth/omi-lookup?omi_id=${encodeURIComponent(id)}`, { credentials: "same-origin" })
        .then(async (response) => {
          const result = await response.json().catch(() => ({}))
          if (!response.ok) {
            setOmiRecognised(false)
            const field = parseFieldErrors(result.error)
            if (field.father_id) setErrors((current) => ({ ...current, father_id: field.father_id }))
            return
          }
          setOmiRecognised(Boolean(result.valid))
          setErrors((current) => {
            const next = { ...current }
            delete next.father_id
            return next
          })
        })
        .catch(() => setOmiRecognised(false))
    }, 350)
    return () => window.clearTimeout(timer)
  }, [omiId, register])

  function signedIn(user: Member) {
    notifyAuthChanged(user)
    if (user.role !== "father") {
      window.location.assign("/admin")
      return
    }
    window.location.assign(safeNextPath("/dashboard"))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (field: string) => String(data.get(field) ?? "").trim()
    const nextErrors: FieldErrors = {}

    let body: Record<string, string>
    if (register) {
      const mobileRaw = value("mobile_number").replace(/\s+/g, " ")
      const mobile = mobileRaw.startsWith("+") ? mobileRaw : mobileRaw ? `+94 ${mobileRaw}` : ""
      body = {
        name: name.trim(),
        father_id: omiId.trim(),
        date_of_birth: value("date_of_birth"),
        email: value("email"),
        mobile_number: mobile,
        password: String(data.get("password") ?? ""),
      }
      if (!body.name) nextErrors.name = "Enter your full name as on Province records."
      if (!body.father_id) nextErrors.father_id = "Enter your OMI ID."
      if (!body.date_of_birth) nextErrors.date_of_birth = "Enter your date of birth."
      if (!body.email) nextErrors.email = "Enter your email address."
      if (!body.mobile_number) nextErrors.mobile_number = "Enter your mobile number."
      if (!body.password) nextErrors.password = "Choose a password."
      else if (body.password.length < 12) nextErrors.password = "Password must be at least 12 characters."
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors)
        setNotice("")
        return
      }
    } else {
      body = { identifier: value("identity"), password: String(data.get("password") ?? "") }
      if (!body.identifier) nextErrors.identity = "Enter your OMI ID."
      if (!body.password) nextErrors.password = "Enter your password."
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors)
        setNotice("")
        return
      }
    }

    setBusy(true)
    setNotice("")
    setErrors({})
    try {
      const response = await fetch(register ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (response.status === 429) {
          setNotice("Too many attempts. Please wait a few minutes and try again.")
          return
        }
        const fieldErrors = parseFieldErrors(result.error)
        if (Object.keys(fieldErrors).length) {
          setErrors(fieldErrors)
          setNotice("")
        } else {
          setNotice(
            typeof result.error === "string"
              ? result.error
              : firstError(fieldErrors, register ? "Registration failed." : "Sign in failed.")
          )
        }
        return
      }
      if (register && (result.pending_approval || result.user?.active === false)) {
        const message =
          result.message ||
          "Registration received. A Province administrator must activate your account before you can sign in."
        window.location.assign(`/login?notice=${encodeURIComponent(message)}`)
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
    <section className="member-access-stage relative isolate flex min-h-[calc(100svh-5.5rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <MotionHero className="member-access-shell relative z-10 grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.05fr_minmax(0,1fr)]">
        <AuthArtPanel />

        <motion.div
          className="member-access-glass relative flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11"
          initial={reduce ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.12, ease }}
        >
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

          {member ? (
            <div>
              <h1 className="font-heading text-2xl font-semibold text-[#0b4a5c] sm:text-[1.7rem]">Welcome</h1>
              <p className="mt-2 text-sm text-[#5a7380]">You are signed in</p>
              <p className="mt-6 text-lg font-medium text-[#0b4a5c]">{member.name}</p>
              {member.father_id ? (
                <p className="mt-1 text-sm text-[#5a7380]">OMI ID {member.father_id}</p>
              ) : null}
              <p className="text-sm text-[#5a7380]">{member.email}</p>
              <div className="mt-8 flex flex-col gap-3">
                {member.role === "father" ? (
                  <Link href="/dashboard" className={primaryBtn}>
                    Open profile
                    <ArrowRight className="member-access-cta-arrow size-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <a href="/admin" className={primaryBtn}>
                    Open the CMS
                    <ArrowRight className="member-access-cta-arrow size-4" aria-hidden="true" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  className="text-sm font-semibold text-[#0b4a5c] transition hover:text-[#0f8fa3]"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="w-full" noValidate>
              <AuthField delay={0.22}>
                <h1 className="font-heading text-[1.55rem] leading-tight font-semibold tracking-tight text-[#0b4a5c] sm:text-[1.75rem]">
                  {register ? "Create your Father account" : "Sign in to your account"}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-[#5a7380]">
                  {register
                    ? "Use your OMI ID and Province name from the personnel list to open a secure profile."
                    : "Enter your OMI ID and password to continue to your Province profile."}
                </p>
              </AuthField>

              {register ? (
                <div className="mt-6 grid gap-3.5">
                  <AuthField delay={0.3}>
                    <label className={fieldLabel} htmlFor="reg-name">
                      Full Name
                    </label>
                    <div className="relative">
                      <FieldIcon>
                        <UserRound className="size-4" />
                      </FieldIcon>
                      <input
                        id="reg-name"
                        name="name"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value)
                          setErrors((current) => {
                            const next = { ...current }
                            delete next.name
                            return next
                          })
                        }}
                        placeholder="As on Province records"
                        aria-invalid={Boolean(errors.name)}
                        className={cn(fieldInput, "pl-10", errors.name && fieldInputError)}
                      />
                    </div>
                    <FieldHint error={errors.name} hint="Use your full name exactly as on Province records." />
                  </AuthField>

                  <AuthField delay={0.36}>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className={fieldLabel} htmlFor="reg-father">
                          OMI ID
                        </label>
                        <div className="relative">
                          <FieldIcon>
                            <IdCard className="size-4" />
                          </FieldIcon>
                          <input
                            id="reg-father"
                            name="father_id"
                            autoComplete="username"
                            required
                            inputMode="numeric"
                            value={omiId}
                            onChange={(event) => {
                              setOmiId(event.target.value)
                              setErrors((current) => {
                                const next = { ...current }
                                delete next.father_id
                                return next
                              })
                            }}
                            placeholder="e.g. 14080"
                            aria-invalid={Boolean(errors.father_id)}
                            className={cn(fieldInput, "pl-10", errors.father_id && fieldInputError)}
                          />
                        </div>
                        <FieldHint
                          error={errors.father_id}
                          hint={omiRecognised && !errors.father_id ? "OMI ID recognised on the Province list." : undefined}
                        />
                      </div>
                      <div>
                        <label className={fieldLabel} htmlFor="reg-dob">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <FieldIcon>
                            <CalendarDays className="size-4" />
                          </FieldIcon>
                          <input
                            id="reg-dob"
                            name="date_of_birth"
                            type="date"
                            autoComplete="bday"
                            required
                            aria-invalid={Boolean(errors.date_of_birth)}
                            className={cn(fieldInput, "pl-10", errors.date_of_birth && fieldInputError)}
                          />
                        </div>
                        <FieldHint error={errors.date_of_birth} />
                      </div>
                    </div>
                  </AuthField>

                  <AuthField delay={0.42}>
                    <label className={fieldLabel} htmlFor="reg-email">
                      Email
                    </label>
                    <div className="relative">
                      <FieldIcon>
                        <Mail className="size-4" />
                      </FieldIcon>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        aria-invalid={Boolean(errors.email)}
                        className={cn(fieldInput, "pl-10", errors.email && fieldInputError)}
                      />
                    </div>
                    <FieldHint error={errors.email} />
                  </AuthField>

                  <AuthField delay={0.48}>
                    <label className={fieldLabel} htmlFor="reg-mobile">
                      Mobile Number
                    </label>
                    <div
                      className={cn(
                        "relative flex overflow-hidden rounded-[0.85rem] border border-[#d7e8ee] bg-white focus-within:border-[#17b3c6] focus-within:ring-3 focus-within:ring-[#17b3c6]/20",
                        errors.mobile_number && "border-[#e8a0a0] focus-within:border-[#d14343] focus-within:ring-[#d14343]/15"
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5 border-r border-[#d7e8ee] bg-[#f4fafc] px-3 text-sm font-medium text-[#5a7380]">
                        <Phone className="size-3.5 text-[#8aa3ad]" aria-hidden="true" />
                        +94
                      </span>
                      <input
                        id="reg-mobile"
                        name="mobile_number"
                        type="tel"
                        autoComplete="tel-national"
                        required
                        inputMode="tel"
                        placeholder="77 123 4567"
                        aria-invalid={Boolean(errors.mobile_number)}
                        className="w-full border-0 bg-transparent px-3 py-2.5 text-sm text-[#0b4a5c] outline-none placeholder:text-[#9aafb8]"
                      />
                    </div>
                    <FieldHint error={errors.mobile_number} />
                  </AuthField>

                  <AuthField delay={0.54}>
                    <label className={fieldLabel} htmlFor="reg-password">
                      Password
                    </label>
                    <div className="relative">
                      <FieldIcon>
                        <Lock className="size-4" />
                      </FieldIcon>
                      <input
                        id="reg-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={12}
                        placeholder="At least 12 characters"
                        aria-invalid={Boolean(errors.password)}
                        className={cn(fieldInput, "pr-11 pl-10", errors.password && fieldInputError)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((open) => !open)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8aa3ad] transition hover:text-[#0f8fa3]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FieldHint error={errors.password} />
                  </AuthField>
                </div>
              ) : (
                <div className="mt-7 grid gap-4">
                  <AuthField delay={0.3}>
                    <label className={fieldLabel} htmlFor="login-id">
                      OMI ID
                    </label>
                    <div className="relative">
                      <FieldIcon>
                        <IdCard className="size-4" />
                      </FieldIcon>
                      <input
                        id="login-id"
                        name="identity"
                        autoComplete="username"
                        required
                        placeholder="Your OMI ID"
                        aria-invalid={Boolean(errors.identity)}
                        className={cn(fieldInput, "pl-10", errors.identity && fieldInputError)}
                      />
                    </div>
                    <FieldHint error={errors.identity} />
                  </AuthField>
                  <AuthField delay={0.38}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <label className={cn(fieldLabel, "mb-0")} htmlFor="login-password">
                        Password
                      </label>
                      <Link href="/contact" className="text-xs font-semibold text-[#0f8fa3] hover:text-[#0c7d8f]">
                        Forgot Password
                      </Link>
                    </div>
                    <div className="relative">
                      <FieldIcon>
                        <Lock className="size-4" />
                      </FieldIcon>
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        placeholder="••••••••••••"
                        aria-invalid={Boolean(errors.password)}
                        className={cn(fieldInput, "pr-11 pl-10", errors.password && fieldInputError)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((open) => !open)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8aa3ad] transition hover:text-[#0f8fa3]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FieldHint error={errors.password} />
                  </AuthField>
                </div>
              )}

              <AnimatePresence>
                {notice ? (
                  <motion.p
                    key={notice}
                    role="alert"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.28, ease }}
                    className="mt-4 rounded-xl border border-[#f3c1c1] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]"
                  >
                    {notice}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <AuthField delay={0.6}>
                <button type="submit" disabled={busy} className={cn(primaryBtn, "mt-6")}>
                  {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
                  {!busy ? <ArrowRight className="member-access-cta-arrow size-4" aria-hidden="true" /> : null}
                </button>
              </AuthField>

              <AuthField delay={0.66}>
                <div className="mt-5 flex items-start gap-2 text-[12px] leading-snug text-[#5a7380]">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#0f8fa3]" aria-hidden="true" />
                  <p>
                    {register
                      ? "Registration is checked against the Province OMI ID personnel list. Your official name is used for the account."
                      : "Sign-in is for Oblate Fathers of the Jaffna Province only."}
                  </p>
                </div>

                <p className="mt-5 text-center text-sm text-[#5a7380]">
                  {register ? "Already have an account? " : "New Father account? "}
                  <Link
                    href={register ? "/login" : "/register"}
                    className="font-semibold text-[#0b4a5c] transition hover:text-[#0f8fa3]"
                  >
                    {register ? "Sign in" : "Create an account"}
                  </Link>
                </p>
              </AuthField>
            </form>
          )}
        </motion.div>
      </MotionHero>
    </section>
  )
}
