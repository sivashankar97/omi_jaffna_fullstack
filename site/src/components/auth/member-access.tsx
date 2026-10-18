"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"

import { site } from "@/config/site"

type Mode = "login" | "register"

type Member = {
  name: string
  email: string
  role: "admin" | "editor" | "publisher" | "father"
  father_id: string | null
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#d5dee6] bg-[#f7fafc] px-3 py-2.5 text-base text-[#023e8a] outline-none placeholder:text-[#8aa0b2] focus:border-[#0077b6]"

const buttonClass =
  "rounded-full border-2 border-[#023e8a] bg-white px-6 py-2.5 text-sm font-semibold text-[#023e8a] transition hover:bg-[#e7fbff] disabled:opacity-60"

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
  const [notice, setNotice] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [member, setMember] = useState<Member | null>(null)
  const register = mode === "register"

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setMember(data?.user ?? null))
      .catch(() => setMember(null))
  }, [])

  function signedIn(user: Member) {
    if (user.role !== "father") {
      window.location.assign("/admin")
      return
    }
    setMember(user)
    setNotice("")
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
        setNotice("Add your Father ID or email, and your password.")
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
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => null)
    setMember(null)
  }

  return (
    <section className="grid min-h-[70vh] bg-white lg:grid-cols-[minmax(16rem,0.9fr)_1.1fr]">
      <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#e7fbff] to-[#caf0f8] px-8 py-12 text-center">
        <Image
          src={site.assets.logos.right}
          alt="Oblate Province of Jaffna"
          width={220}
          height={220}
          className="h-40 w-40 object-contain sm:h-52 sm:w-52"
          priority
        />
        <p className="font-heading text-2xl font-semibold text-[#023e8a]">{site.name}</p>
        <p className="max-w-xs text-sm leading-6 text-[#5c6b7a]">{site.tagline}</p>
      </div>

      <div className="flex items-center bg-white px-6 py-12 sm:px-12">
        {member ? (
          <div className="w-full max-w-lg">
            <p className="font-heading text-4xl font-semibold text-[#023e8a]">Welcome</p>
            <h1 className="mt-2 text-sm font-semibold tracking-[0.18em] text-[#0077b6] uppercase">Signed in</h1>
            <p className="mt-6 text-lg font-medium text-[#023e8a]">{member.name}</p>
            {member.father_id ? <p className="mt-1 text-sm text-[#5c6b7a]">Father ID {member.father_id}</p> : null}
            <p className="mt-1 text-sm text-[#5c6b7a]">{member.email}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {member.role === "father" ? (
                <Link href="/" className={buttonClass}>
                  Go to the home page
                </Link>
              ) : (
                <a href="/admin" className={buttonClass}>
                  Open the CMS
                </a>
              )}
              <button type="button" onClick={signOut} className="text-sm font-semibold text-[#0077b6] hover:underline">
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="w-full max-w-lg" noValidate>
            <p className="font-heading text-4xl font-semibold text-[#023e8a]">
              {register ? "New member" : "Members"}
            </p>
            <h1 className="mt-2 text-sm font-semibold tracking-[0.18em] text-[#0077b6] uppercase">
              {register ? "Father registration" : "Sign in"}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#5c6b7a]">
              {register
                ? "Create a Father account with your Father ID. You can sign in with it straight away."
                : "Fathers sign in with their Father ID. Province staff sign in with their email."}
            </p>

            {register ? (
              <div className="mt-8 grid gap-5">
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Full name
                  <input name="name" autoComplete="name" className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Father ID
                  <input name="father_id" autoComplete="username" placeholder="Your OMI / oblation number" className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Date of birth
                  <input name="date_of_birth" type="date" autoComplete="bday" className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Email
                  <input name="email" type="email" autoComplete="email" placeholder="name@email.com" className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Mobile number
                  <input name="mobile_number" type="tel" autoComplete="tel" className={fieldClass} />
                </label>
              </div>
            ) : (
              <div className="mt-8 grid gap-5">
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Father ID or email
                  <input name="identity" autoComplete="username" placeholder="Father ID or staff email" className={fieldClass} />
                </label>
              </div>
            )}

            <label className="mt-5 block text-sm font-medium text-[#5c6b7a]">
              Password
              <span className="relative mt-2 block">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={register ? "new-password" : "current-password"}
                  placeholder={register ? "At least 12 characters" : "Enter password"}
                  className={`${fieldClass} mt-0 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((open) => !open)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#0077b6]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </span>
            </label>
            {register ? null : (
              <div className="mt-4 text-sm">
                <Link href="/contact" className="font-semibold text-[#0077b6] hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={busy} className={buttonClass}>
                {busy ? "Please wait…" : register ? "Register" : "Log in"}
              </button>
              <Link
                href={register ? "/login" : "/register"}
                className="text-sm font-semibold text-[#0077b6] hover:underline"
              >
                {register ? "Log in" : "Create an account"}
              </Link>
            </div>
            {notice ? (
              <p role="alert" className="mt-4 max-w-md text-sm leading-6 text-[#b42318]">
                {notice}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  )
}
