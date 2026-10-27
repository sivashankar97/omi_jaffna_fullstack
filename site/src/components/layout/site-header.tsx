"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Menu, Search } from "lucide-react"

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
  const headerRef = useRef<HTMLElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const hangRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return mainNavigation.filter((item) =>
      `${item.label} ${item.description}`.toLowerCase().includes(term)
    )
  }, [query, mainNavigation])

  useEffect(() => {
    setOpenHref(null)
    setMobileOpen(null)
  }, [pathname])

  useEffect(() => {
    const brand = brandRef.current
    const hang = hangRef.current
    const pill = pillRef.current
    const shell = shellRef.current
    if (!brand || !hang || !pill || !shell) return
    let resizeFrame = 0

    // Desktop: hang pill over hero. Mobile: pill hidden — no nest padding.
    const measure = () => {
      resizeFrame = 0
      const pillH = pill.offsetHeight
      const nest = pillH > 0 ? Math.max(1, Math.round(pillH * 0.4)) : 0
      brand.style.paddingBottom = `${nest}px`
      hang.style.marginTop = nest ? `-${nest}px` : "0px"
      shell.style.height = `${brand.offsetHeight}px`
    }

    const onResize = () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(measure)
    }

    measure()
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null
    ro?.observe(pill)
    ro?.observe(brand)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      ro?.disconnect()
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
      <header ref={headerRef} className="site-header pointer-events-none fixed inset-x-0 top-0 z-40">
        {/* Top: white + logos + search — paddingBottom set in JS to half the pill height */}
        <div ref={brandRef} className="pointer-events-auto bg-white pb-7">
          <div className="relative mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:gap-5 sm:px-5 sm:py-4">
            <Link href="/" className="justify-self-start" aria-label={site.name}>
              <Image
                src={siteInfo.logos.headerImage}
                unoptimized={isUpload(siteInfo.logos.headerImage)}
                alt="Missionary Oblates of Mary Immaculate"
                width={320}
                height={96}
                priority
                className="h-12 w-auto max-w-[9.5rem] object-contain object-left sm:h-14 sm:max-w-[14rem] lg:h-16 lg:max-w-none"
              />
            </Link>

            <div className="relative mx-auto w-full min-w-0 max-w-[15rem] justify-self-center sm:max-w-[22rem] lg:max-w-[28rem]">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the Province"
                aria-label="Search"
                className="header-search h-6 w-full rounded-full border border-[#17b3c6] bg-white pr-9 pl-5 text-[12.5px] leading-none text-[#023e8a] shadow-none placeholder:text-[#9aa8b5] focus-visible:border-[#17b3c6] focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-7"
              />
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 z-10 size-3.5 -translate-y-1/2 text-[#17b3c6]"
                strokeWidth={1.75}
              />
              {query.trim() ? <SearchResults results={results} onPick={() => setQuery("")} /> : null}
            </div>

            <div className="flex items-center justify-self-end gap-2">
              <Link href="/" aria-label="Oblate Province of Jaffna" className="shrink-0">
                <Image
                  src={siteInfo.logos.emblemImage}
                  unoptimized={isUpload(siteInfo.logos.emblemImage)}
                  alt=""
                  width={64}
                  height={64}
                  priority
                  className="size-11 rounded-full object-contain sm:size-14 lg:size-16"
                />
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Open menu"
                    className="size-9 rounded-full border-transparent bg-[#17b3c6] text-white shadow-none hover:bg-[#0e98ac] hover:text-white lg:hidden"
                  >
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>Pages</SheetTitle>
                    <SheetDescription>Oblate Province of Jaffna</SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-8">
                    <MemberMenu variant="mobile" />
                    {mainNavigation.map((item) => {
                      const open = mobileOpen === item.href
                      return (
                        <div key={item.href}>
                          <div
                            className={cn(
                              "flex items-center rounded-xl transition hover:bg-[#eaf8fb]",
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
                                aria-expanded={open}
                                aria-label={`${item.label} sections`}
                                onClick={() => setMobileOpen(open ? null : item.href)}
                                className="px-3 py-3"
                              >
                                <ChevronDown className={cn("size-4 transition duration-300", open && "rotate-180")} />
                              </button>
                            ) : null}
                          </div>
                          {open && item.sections.length > 0 ? (
                            <ul className="menu-drop overflow-hidden rounded-xl border border-[#90e0ef] bg-white">
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
        </div>

        {/* Desktop nav pill only — mobile uses the hamburger toggle above */}
        <div ref={hangRef} className="pointer-events-auto relative z-50 hidden -mt-7 px-3 sm:px-5 lg:block">
          <div
            ref={pillRef}
            className="header-nav-pill mx-auto flex w-full max-w-7xl items-center gap-3 rounded-full bg-[#17b3c6] py-1.5 pr-1.5 pl-3 sm:gap-4 sm:py-2 sm:pr-2 sm:pl-4"
          >
            <nav ref={navRef} aria-label="Main" className="min-w-0 flex-1">
              <ul className="flex flex-nowrap items-center justify-start gap-0.5 sm:gap-1">
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
                      className="relative shrink-0"
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
                        className={cn(
                          "inline-flex h-9 items-center whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold tracking-wide transition xl:px-3 xl:text-xs",
                          active
                            ? "bg-white text-[#0a5062] shadow-[0_1px_6px_rgba(10,80,98,0.18)]"
                            : "text-white/95 hover:bg-white/20 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                      {open ? (
                        <div className={cn("absolute top-full z-50 pt-2", alignRight ? "right-0" : "left-0")}>
                          <div className="menu-drop max-h-80 w-56 overflow-y-auto rounded-2xl border border-white/70 bg-white/95 py-1 text-[#123944] shadow-[0_16px_40px_rgba(8,47,61,0.16)] backdrop-blur-xl">
                            {item.sections.map((section, index) => (
                              <Link
                                key={section.id}
                                href={section.href || `${item.href}#${section.id}`}
                                onClick={() => setOpenHref(null)}
                                className="menu-row block border-b border-[#edf2f3]/80 px-3.5 py-2.5 text-[13px] font-medium transition last:border-b-0 hover:bg-[#f0f8f8] focus-visible:bg-[#f0f8f8] focus-visible:outline-none"
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
            </nav>

            <div className="ml-auto flex shrink-0 flex-row flex-nowrap items-center">
              <MemberMenu variant="desktop" />
            </div>
          </div>
        </div>
      </header>
    </>
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
    <div className="absolute top-[calc(100%+0.45rem)] right-0 left-0 z-50 overflow-hidden rounded-2xl border border-[#90e0ef]/80 bg-gradient-to-b from-white/95 to-[#e7fbff]/90 shadow-[0_18px_40px_-20px_rgba(2,62,138,0.35)] backdrop-blur-xl">
      {results.length === 0 ? (
        <p className="px-4 py-3 text-sm text-[#5c6b7a]">No matching page</p>
      ) : (
        <ul>
          {results.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onPick}
                className="block border-b border-[#e7fbff] px-4 py-2.5 transition last:border-b-0 hover:bg-[#17b3c6]/10"
              >
                <span className="block text-sm font-semibold text-[#023e8a]">{item.label}</span>
                <span className="block text-xs text-[#5c6b7a]">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
