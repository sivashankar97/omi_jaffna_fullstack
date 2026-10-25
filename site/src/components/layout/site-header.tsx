"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Menu, Moon, Search, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MemberMenu } from "@/components/auth/member-menu"
import { mainNavigation as defaultNavigation } from "@/config/navigation"
import type { NavItem } from "@/types"
import { site } from "@/config/site"
import { useSiteInfo } from "@/components/layout/site-info"
import { isUpload } from "@/content/site-info"
import { cn } from "cn"

export function SiteHeader({ navigation: mainNavigation = defaultNavigation }: { navigation?: NavItem[] }) {
  const siteInfo = useSiteInfo()
  const pathname = usePathname()
  const [query, setQuery] = useState("")
  const [openHref, setOpenHref] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)
  const headerRef = useRef<HTMLElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const expandedRef = useRef(true)

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return mainNavigation.filter((item) =>
      `${item.label} ${item.description}`.toLowerCase().includes(term)
    )
  }, [query])

  useEffect(() => {
    setOpenHref(null)
    setMobileOpen(null)
  }, [pathname])

  useEffect(() => {
    const header = headerRef.current
    const shell = shellRef.current
    if (!header || !shell) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let resizeFrame = 0

    // The header is fixed and shrinks on scroll; the shell reserves its full
    // expanded height so the page never shifts (shifting caused a scroll loop).
    const measure = () => {
      resizeFrame = 0
      const tuck = header.style.getPropertyValue("--tuck")
      const wasExpanded = header.classList.contains("is-expanded")
      header.style.setProperty("--tuck", "0")
      header.classList.add("is-expanded")
      shell.style.height = `${header.offsetHeight}px`
      header.style.setProperty("--tuck", tuck || "0")
      if (!wasExpanded) header.classList.remove("is-expanded")
    }

    const onResize = () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(measure)
    }

    const apply = () => {
      frame = 0
      const y = window.scrollY
      const tuck = reduce ? (y > 48 ? 1 : 0) : Math.min(1, Math.max(0, (y - 2) / 72))
      header.style.setProperty("--tuck", tuck.toFixed(4))
      const nextExpanded = tuck < 0.04
      if (nextExpanded !== expandedRef.current) {
        expandedRef.current = nextExpanded
        setExpanded(nextExpanded)
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }
    apply()
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      if (frame) cancelAnimationFrame(frame)
      if (resizeFrame) cancelAnimationFrame(resizeFrame)
    }
  }, [])

  useEffect(() => {
    if (!openHref) return
    function onPointer(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenHref(null)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenHref(null)
    }
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [openHref])

  return (
    <>
    <div ref={shellRef} className="site-header-shell shrink-0" aria-hidden="true" />
    <header
      ref={headerRef}
      className={cn(
        "site-header fixed inset-x-0 top-0 z-40 bg-white text-[#102a43] shadow-[0_5px_18px_-14px_rgba(8,47,61,0.65)] dark:bg-[#071422] dark:text-[#e7fbff]",
        expanded && "is-expanded"
      )}
    >
      <div className="header-logo-row mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 overflow-x-hidden px-3 sm:gap-4 sm:px-6">
        <Link href="/" className="justify-self-start" aria-label={site.name}>
          <Image
            src={siteInfo.logos.headerImage}
            unoptimized={isUpload(siteInfo.logos.headerImage)}
            alt="Missionary Oblates of Mary Immaculate"
            width={520}
            height={140}
            priority
            className="header-logo-left object-contain object-left"
          />
        </Link>

        <div className="relative min-w-0 w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/50 dark:text-white/70" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search"
            className={cn(
              "header-search border-2 border-[#48cae4] bg-white pl-9 dark:bg-[#0c1c2e] dark:text-[#e7fbff]"
            )}
          />
          {query.trim() ? (
            <SearchResults results={results} onPick={() => setQuery("")} />
          ) : null}
        </div>

        <div className="flex items-center justify-self-end gap-2">
          <Link href="/" aria-label="Oblate Province of Jaffna" className="shrink-0">
            <span
              className="header-logo-right flex items-center justify-center"
            >
              <Image
                src={siteInfo.logos.emblemImage}
                unoptimized={isUpload(siteInfo.logos.emblemImage)}
                alt="Oblate Province of Jaffna emblem"
                width={500}
                height={500}
                priority
                className="h-full w-full object-contain"
              />
            </span>
          </Link>

          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="border-transparent bg-[#17b3c6] text-white shadow-sm hover:bg-[#0f9fb4] hover:text-white lg:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Pages</SheetTitle>
                <SheetDescription>
                  Oblate Province of Jaffna
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-8">
                <MemberMenu variant="mobile" />
                {mainNavigation.map((item) => {
                  const expanded = mobileOpen === item.href
                  return (
                    <div key={item.href}>
                      <div
                        className={cn(
                          "flex items-center rounded-lg transition hover:bg-primary/30",
                          pathname === item.href && "bg-[#e7fbff]"
                        )}
                      >
                        <SheetClose asChild>
                          <Link href={item.href} className="flex-1 px-3 py-3 text-base font-bold">
                            {item.label}
                          </Link>
                        </SheetClose>
                        {item.sections.length > 0 ? (
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-label={`${item.label} sections`}
                            onClick={() => setMobileOpen(expanded ? null : item.href)}
                            className="px-3 py-3"
                          >
                            <ChevronDown className={cn("size-4 transition duration-300", expanded && "rotate-180")} />
                          </button>
                        ) : null}
                      </div>
                      {expanded && item.sections.length > 0 ? (
                        <ul className="menu-drop overflow-hidden rounded-lg border border-[#90e0ef] bg-white">
                          {item.sections.map((section, index) => (
                            <li
                              key={section.id}
                              className="menu-row border-b border-[#e7fbff] last:border-b-0"
                              style={{ animationDelay: `${index * 35}ms` }}
                            >
                              <SheetClose asChild>
                                <Link
                                  href={section.href || `${item.href}#${section.id}`}
                                  className="block px-4 py-3 text-sm font-semibold tracking-wide text-[#023e8a] uppercase transition hover:bg-[#e7fbff]"
                                >
                                  {section.label}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div
        className="h-[2px] bg-gradient-to-r from-[#ffcf4a] via-[#48cae4] to-[#0e6a68]"
        aria-hidden="true"
      />

      <nav
        ref={navRef}
        aria-label="Main"
        className="header-nav nav-gradient relative hidden lg:block"
      >
        <div className="header-nav-clip">
        <div className="relative z-10 mx-auto flex w-full max-w-[90rem] items-center gap-3 px-3 py-1 min-[1400px]:gap-5 min-[1400px]:px-5">
          <ul className="flex min-w-0 flex-1 flex-nowrap items-center justify-between gap-0.5">
            {mainNavigation.map((item, itemIndex) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              const hasSections = item.sections.length > 0
              const open = hasSections && openHref === item.href
              const alignRight = itemIndex > mainNavigation.length / 2
              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenHref(item.href)}
                  onMouseLeave={() => setOpenHref((current) => (current === item.href ? null : current))}
                  onFocus={() => setOpenHref(item.href)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setOpenHref((current) => (current === item.href ? null : current))
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    aria-expanded={hasSections ? open : undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenHref(null)}
                    className="nav-pill inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2 text-[11px] font-semibold transition-colors min-[1200px]:px-2.5 min-[1200px]:text-xs min-[1400px]:px-3 min-[1400px]:text-[13px]"
                  >
                    {item.label}
                  </Link>
                  {open ? (
                    <div className={cn("absolute top-full z-50 pt-2", alignRight ? "right-0" : "left-0")}>
                      <div className="menu-drop max-h-80 w-64 overflow-y-auto rounded-md border border-[#dbe8e9] bg-white py-1 text-[#123944] shadow-[0_14px_36px_rgba(8,47,61,0.2)]">
                        {item.sections.map((section, index) => (
                          <Link
                            key={section.id}
                            href={section.href || `${item.href}#${section.id}`}
                            onClick={() => setOpenHref(null)}
                            className="menu-row block border-b border-[#edf2f3] px-4 py-3 text-sm font-medium transition last:border-b-0 hover:bg-[#f0f8f8] focus-visible:bg-[#f0f8f8] focus-visible:outline-none"
                            style={{ animationDelay: `${index * 20}ms` }}
                          >
                            {section.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
          <MemberMenu variant="desktop" />
        </div>
        </div>
      </nav>
    </header>
    </>
  )
}

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("omi-theme")
    if (stored === "dark") {
      document.documentElement.classList.add("dark")
      document.cookie = "omi-theme=dark;path=/;max-age=31536000;SameSite=Lax"
    }
    setDark(document.documentElement.classList.contains("dark"))
  }, [])

  function toggle() {
    const next = !document.documentElement.classList.contains("dark")
    const theme = next ? "dark" : "light"
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("omi-theme", theme)
    document.cookie = `omi-theme=${theme};path=/;max-age=31536000;SameSite=Lax`
    setDark(next)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      onClick={toggle}
      className="dark:border-[#90e0ef] dark:bg-[#0c1c2e] dark:text-[#e7fbff]"
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  )
}

function SearchResults({
  results,
  onPick,
}: {
  results: NavItem[]
  onPick: () => void
}) {
  return (
    <div className="absolute top-[calc(100%+0.35rem)] right-0 left-0 z-50 overflow-hidden rounded-lg border border-primary/40 bg-white shadow-lg">
      {results.length === 0 ? (
        <p className="px-3 py-3 text-sm text-black/60">No matching page</p>
      ) : (
        <ul>
          {results.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onPick}
                className="block px-3 py-2 transition hover:bg-primary/25"
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="block text-xs text-black/60">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
