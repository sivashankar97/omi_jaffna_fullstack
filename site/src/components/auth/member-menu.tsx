"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react"

import { signOutSession } from "@/components/auth/session"
import { site } from "@/config/site"
import { cn } from "cn"

type Member = {
  name: string
  email: string
  role: string
  father_id: string | null
}

type MemberMenuProps = {
  variant?: "desktop" | "mobile"
}

export function MemberMenu({ variant = "desktop" }: MemberMenuProps) {
  const pathname = usePathname()
  const [member, setMember] = useState<Member | null | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      if (!response.ok) {
        setMember(null)
        return
      }
      const data = await response.json()
      setMember(data?.user ?? null)
    } catch {
      setMember(null)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh, pathname])

  useEffect(() => {
    const onAuth = (event: Event) => {
      const detail = (event as CustomEvent<{ user: Member | null }>).detail
      if (detail && "user" in detail) {
        setMember(detail.user)
        setOpen(false)
        return
      }
      refresh()
    }
    window.addEventListener("omi-auth-changed", onAuth)
    return () => window.removeEventListener("omi-auth-changed", onAuth)
  }, [refresh])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  async function signOut() {
    await signOutSession()
    setMember(null)
    setOpen(false)
    window.location.assign("/")
  }

  if (member === undefined) {
    return variant === "mobile" ? (
      <div className="mb-3 h-9 animate-pulse rounded-md bg-[#e7fbff]" />
    ) : (
      <div className="h-8 w-28 animate-pulse rounded-full bg-white/60" />
    )
  }

  if (!member || member.role !== "father") {
    if (variant === "mobile") {
      return (
        <div className="mb-3 flex gap-2">
          <Link
            href={site.familyPortal.login}
            className="rounded-full bg-gradient-to-r from-[#0c3948] to-[#116d69] px-3 py-2 text-xs font-semibold text-white"
          >
            Login
          </Link>
          <Link
            href={site.familyPortal.register}
            className="rounded-full border border-[#ffcf4a] bg-[#ffcf4a] px-3 py-2 text-xs font-bold text-[#102a43]"
          >
            Register
          </Link>
        </div>
      )
    }
    return (
      <div className="relative z-20 flex shrink-0 flex-row flex-nowrap items-center gap-1">
        <Link
          href={site.familyPortal.login}
          className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-xs font-semibold text-white/90 transition hover:bg-white/15 hover:text-white"
        >
          Login
        </Link>
        <Link
          href={site.familyPortal.register}
          className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-white px-5 text-xs font-bold text-[#17b3c6] transition hover:bg-[#e7fbff]"
        >
          Register
        </Link>
      </div>
    )
  }

  const firstName = member.name.split(/\s+/)[0] || member.name

  if (variant === "mobile") {
    return (
      <div className="mb-4 space-y-2 rounded-xl bg-[#eaf8fb] p-3 ring-1 ring-[#bfe6ef]">
        <p className="text-sm font-semibold text-[#023e8a]">{member.name}</p>
        {member.father_id ? <p className="text-xs text-[#5c6b7a]">Father ID {member.father_id}</p> : null}
        <Link
          href={site.familyPortal.dashboard}
          className="flex items-center gap-2 rounded-lg bg-[#023e8a] px-3 py-2.5 text-sm font-semibold text-white"
        >
          <LayoutDashboard className="size-4" /> Profile dashboard
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#023e8a] ring-1 ring-[#bfe6ef]"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative z-20 shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-8 max-w-[11rem] shrink-0 items-center gap-1.5 rounded-full border border-white/80 bg-white px-3 text-[11px] font-semibold text-[#0b3a55] shadow-[0_1px_4px_rgb(8_47_61/0.08)] transition hover:bg-white xl:h-9 xl:px-3.5 xl:text-xs"
      >
        <UserRound className="size-4 shrink-0" />
        <span className="truncate">{firstName}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#dbe8e9] bg-white py-1 text-[#123944] shadow-[0_14px_36px_rgba(8,47,61,0.2)]"
        >
          <div className="border-b border-[#edf2f3] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#023e8a]">{member.name}</p>
            {member.father_id ? (
              <p className="mt-0.5 text-[11px] text-[#5c6b7a]">Father ID {member.father_id}</p>
            ) : null}
          </div>
          <Link
            href={site.familyPortal.dashboard}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition hover:bg-[#f0f8f8]"
          >
            <LayoutDashboard className="size-4 text-[#0e98ac]" /> Profile dashboard
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition hover:bg-[#f0f8f8]"
          >
            <LogOut className="size-4 text-[#0e98ac]" /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}
