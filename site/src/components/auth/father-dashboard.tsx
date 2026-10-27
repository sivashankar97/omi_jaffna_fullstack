"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Camera,
  FileText,
  Images,
  LogOut,
  Newspaper,
  Pencil,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react"
import { FormEvent, useCallback, useEffect, useState, type ReactNode } from "react"

import { signOutSession } from "@/components/auth/session"
import { isUpload } from "@/content/site-info"
import { cn } from "cn"

type FatherUser = {
  id: string
  name: string
  email: string
  role: string
  father_id: string | null
  date_of_birth: string | null
  mobile_number: string | null
  bio: string
  place: string
  photo_url: string
}

type FatherItem = {
  id: string
  kind: "document" | "gallery" | "action" | "news"
  title: string
  body: string
  file_url: string
  status: string
  created_at: string
}

type MyNews = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  image_url: string
  location_text: string
  status: string
  published_at: string | null
  created_at: string
  section: string | null
  gallery: { src: string; alt?: string; caption?: string }[] | null
}

type MyEvent = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  location_text: string
  event_date: string | null
  status: string
  published_at: string | null
  created_at: string
  date_display: string | null
  end_date: string | null
}

type AdminReport = {
  id: string
  title: string
  body: string
  file_url: string
  created_at: string
  sent_by: string | null
}

type ProvinceNews = {
  slug: string
  title: string
  excerpt: string
  image_url: string
  published_at: string | null
  date_display: string | null
}

type DashboardData = {
  user: FatherUser
  items: Record<"document" | "gallery" | "action" | "news", FatherItem[]>
  adminReports: AdminReport[]
  myNews: MyNews[]
  myEvents: MyEvent[]
  provinceNews: ProvinceNews[]
}

const sections = [
  { id: "personal", label: "Profile", icon: UserRound },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "news", label: "Articles", icon: Newspaper },
] as const

type SectionId = (typeof sections)[number]["id"]

const NEWS_SECTIONS = [
  ["province-events", "Province events"],
  ["parish-events", "Parish events"],
  ["liturgical", "Liturgical celebrations"],
  ["formation", "Formation activities"],
  ["youth", "Youth events"],
  ["social", "Social initiatives"],
] as const

const field =
  "mt-1.5 w-full rounded-lg border border-[#dce8ee] bg-white px-3 py-2.5 text-sm text-[#0b4a5c] outline-none placeholder:text-[#9aafb8] focus:border-[#0f8fa3] focus:ring-2 focus:ring-[#0f8fa3]/15"
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f8fa3] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] disabled:opacity-55"
const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#dce8ee] bg-white px-3 py-2 text-sm font-medium text-[#0b4a5c] transition hover:border-[#0f8fa3] hover:text-[#0f8fa3] disabled:opacity-55"
const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#b42318] transition hover:bg-[#fff5f5] disabled:opacity-55"

function dateInput(value: string | null | undefined) {
  return value ? String(value).slice(0, 10) : ""
}

function StatusPill({ status }: { status: string }) {
  const published = status === "published"
  const pending = status === "review" || status === "draft" || status === "open"
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        published && "bg-[#e6f7ef] text-[#0b6b3a]",
        pending && "bg-[#fff6dc] text-[#8a6500]",
        !published && !pending && "bg-[#eef2ff] text-[#3949ab]"
      )}
    >
      {published ? "Published" : pending ? "Pending" : status}
    </span>
  )
}

function SectionShell({
  title,
  lede,
  children,
}: {
  title: string
  lede: string
  children: ReactNode
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-[#0b4a5c] sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-[#6b8290]">{lede}</p>
      </div>
      {children}
    </div>
  )
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-[#dce8ee] bg-[#f8fcfd] px-4 py-8 text-center text-sm text-[#6b8290]">{children}</p>
}

export function FatherDashboard() {
  const router = useRouter()
  const [section, setSection] = useState<SectionId>("personal")
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState(false)
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const response = await fetch("/api/father/dashboard", { credentials: "same-origin", cache: "no-store" })
    if (response.status === 401) {
      router.replace("/login?next=/dashboard")
      return
    }
    if (response.status === 403) {
      // Staff sessions belong in the CMS, not the Father dashboard.
      window.location.assign("/admin")
      return
    }
    if (!response.ok) {
      setError("Could not load your dashboard.")
      return
    }
    setData(await response.json())
    setError("")
  }, [router])

  useEffect(() => {
    load().catch(() => setError("Could not load your dashboard."))
  }, [load])

  async function signOut() {
    await signOutSession()
    router.replace("/login")
  }

  async function uploadFile(file: File) {
    const body = new FormData()
    body.append("file", file)
    const response = await fetch("/api/father/upload", { method: "POST", credentials: "same-origin", body })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Upload failed.")
    return result.item.url as string
  }

  function apiError(result: { error?: unknown }, fallback: string) {
    if (typeof result.error === "string") return result.error
    const fields = (result.error as { fieldErrors?: Record<string, string[]> } | undefined)?.fieldErrors
    const first = fields && Object.values(fields).flat()[0]
    return first || fallback
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!data) return
    const formEl = event.currentTarget
    const form = new FormData(formEl)
    const body: Record<string, string> = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      date_of_birth: String(form.get("date_of_birth") || "").trim(),
      mobile_number: String(form.get("mobile_number") || "").trim(),
      place: String(form.get("place") || "").trim(),
      bio: String(form.get("bio") || "").trim(),
    }
    const password = String(form.get("password") || "")
    if (password) body.password = password
    setBusy(true)
    setNotice("")
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(apiError(result, "Could not save your details."))
        return
      }
      setData((current) => (current ? { ...current, user: result.user } : current))
      setNotice("Profile saved.")
      const passwordInput = formEl.querySelector<HTMLInputElement>('input[name="password"]')
      if (passwordInput) passwordInput.value = ""
    } finally {
      setBusy(false)
    }
  }

  async function onPortrait(file: File | null) {
    if (!file || !data) return
    setBusy(true)
    try {
      const url = await uploadFile(file)
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: url }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(apiError(result, "Could not update photo."))
        return
      }
      setData({ ...data, user: result.user })
      setNotice("Portrait updated.")
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setBusy(false)
    }
  }

  async function addItem(kind: "document" | "gallery", payload: { title: string; file_url: string; body?: string }) {
    setBusy(true)
    setNotice("")
    try {
      const response = await fetch("/api/father/items", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, status: "published", ...payload }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(apiError(result, "Could not add that item."))
        return
      }
      setData((current) => {
        if (!current) return current
        return { ...current, items: { ...current.items, [kind]: [result.item, ...current.items[kind]] } }
      })
      setNotice("Saved.")
    } finally {
      setBusy(false)
    }
  }

  async function saveItem(id: string, kind: "document" | "gallery", patch: { title: string; body?: string }) {
    setBusy(true)
    setNotice("")
    try {
      const response = await fetch(`/api/father/items/${id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(apiError(result, "Could not update."))
        return
      }
      setData((current) => {
        if (!current) return current
        return {
          ...current,
          items: {
            ...current.items,
            [kind]: current.items[kind].map((item) => (item.id === id ? result.item : item)),
          },
        }
      })
      setEditingItemId(null)
      setNotice("Updated.")
    } finally {
      setBusy(false)
    }
  }

  async function removeItem(id: string, kind: "document" | "gallery") {
    if (!window.confirm("Remove this item?")) return
    const response = await fetch(`/api/father/items/${id}`, { method: "DELETE", credentials: "same-origin" })
    if (!response.ok) {
      setNotice("Could not remove that item.")
      return
    }
    setData((current) => {
      if (!current) return current
      return { ...current, items: { ...current.items, [kind]: current.items[kind].filter((item) => item.id !== id) } }
    })
    setNotice("Removed.")
  }

  async function saveNews(payload: Record<string, unknown>, editId?: string | null) {
    setBusy(true)
    setNotice("")
    try {
      const response = await fetch(editId ? `/api/father/news/${editId}` : "/api/father/news", {
        method: editId ? "PATCH" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(apiError(result, "Could not save article."))
        return false
      }
      setData((current) => {
        if (!current) return current
        if (editId) {
          return { ...current, myNews: current.myNews.map((item) => (item.id === editId ? result.item : item)) }
        }
        return { ...current, myNews: [result.item, ...current.myNews] }
      })
      setEditingNewsId(null)
      setNotice(editId ? "Article updated." : "Article submitted for approval.")
      return true
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not save article.")
      return false
    } finally {
      setBusy(false)
    }
  }

  async function removeNews(id: string) {
    if (!window.confirm("Delete this article? This cannot be undone.")) return
    const response = await fetch(`/api/father/news/${id}`, { method: "DELETE", credentials: "same-origin" })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      setNotice(apiError(result, "Could not delete article."))
      return
    }
    setData((current) => (current ? { ...current, myNews: current.myNews.filter((item) => item.id !== id) } : current))
    if (editingNewsId === id) setEditingNewsId(null)
    setNotice("Article deleted.")
  }

  async function saveEvent(payload: Record<string, unknown>, editId?: string | null) {
    setBusy(true)
    setNotice("")
    try {
      const response = await fetch(editId ? `/api/father/events/${editId}` : "/api/father/events", {
        method: editId ? "PATCH" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(apiError(result, "Could not save event."))
        return false
      }
      setData((current) => {
        if (!current) return current
        if (editId) {
          return { ...current, myEvents: current.myEvents.map((item) => (item.id === editId ? result.item : item)) }
        }
        return { ...current, myEvents: [result.item, ...(current.myEvents || [])] }
      })
      setEditingEventId(null)
      setNotice(editId ? "Event updated." : "Event submitted for approval.")
      return true
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not save event.")
      return false
    } finally {
      setBusy(false)
    }
  }

  async function removeEvent(id: string) {
    if (!window.confirm("Delete this event? This cannot be undone.")) return
    const response = await fetch(`/api/father/events/${id}`, { method: "DELETE", credentials: "same-origin" })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      setNotice(apiError(result, "Could not delete event."))
      return
    }
    setData((current) =>
      current ? { ...current, myEvents: (current.myEvents || []).filter((item) => item.id !== id) } : current
    )
    if (editingEventId === id) setEditingEventId(null)
    setNotice("Event deleted.")
  }

  if (error) {
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-heading text-2xl text-[#0b4a5c]">{error}</p>
        <Link href="/login" className={cn(btnGhost, "mt-6")}>
          Sign in again
        </Link>
      </section>
    )
  }

  if (!data) {
    return <section className="mx-auto max-w-lg px-4 py-20 text-center text-[#6b8290]">Loading your dashboard…</section>
  }

  const { user, items, adminReports = [], myNews = [], myEvents = [], provinceNews = [] } = data
  const counts = {
    documents: items.document.length + adminReports.length,
    events: myEvents.length,
    gallery: items.gallery.length,
    news: myNews.length,
  }

  async function onNewsSubmit(event: FormEvent<HTMLFormElement>, edit?: MyNews | null) {
    event.preventDefault()
    const formEl = event.currentTarget
    const form = new FormData(formEl)
    const title = String(form.get("title") || "").trim()
    const excerpt = String(form.get("excerpt") || "").trim()
    const body = String(form.get("body") || "").trim()
    const location_text = String(form.get("place") || "").trim()
    const sectionValue = String(form.get("section") || "").trim()
    const coverInput = formEl.elements.namedItem("cover") as HTMLInputElement
    const galleryInput = formEl.elements.namedItem("gallery") as HTMLInputElement
    const coverFile = coverInput.files?.[0]
    if (!title || !excerpt || !body || !location_text || !sectionValue) {
      setNotice("Please fill every required field.")
      return
    }
    if (!edit && !coverFile) {
      setNotice("Cover photo is required.")
      return
    }
    try {
      let image_url = edit?.image_url || ""
      let gallery = edit?.gallery || []
      if (coverFile) {
        image_url = await uploadFile(coverFile)
        gallery = [{ src: image_url, alt: title, caption: "" }, ...gallery.filter((g) => g.src !== edit?.image_url)]
      }
      for (const file of Array.from(galleryInput.files || [])) {
        const src = await uploadFile(file)
        gallery = [...gallery, { src, alt: title, caption: "" }]
      }
      const ok = await saveNews(
        { title, excerpt, body, location_text, image_url, section: sectionValue, gallery },
        edit?.id
      )
      if (ok && !edit) formEl.reset()
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not save article.")
    }
  }

  async function onEventSubmit(event: FormEvent<HTMLFormElement>, edit?: MyEvent | null) {
    event.preventDefault()
    const formEl = event.currentTarget
    const form = new FormData(formEl)
    const payload = {
      title: String(form.get("title") || "").trim(),
      excerpt: String(form.get("excerpt") || "").trim(),
      location_text: String(form.get("place") || "").trim(),
      event_date: String(form.get("event_date") || "").trim(),
      end_date: String(form.get("end_date") || "").trim(),
      body: String(form.get("body") || "").trim(),
    }
    if (!payload.title || !payload.excerpt || !payload.location_text || !payload.event_date) {
      setNotice("Please fill every required field.")
      return
    }
    const ok = await saveEvent(payload, edit?.id)
    if (ok && !edit) formEl.reset()
  }

  return (
    <div className="min-h-[70vh] bg-[#f3f8fa]">
      <header className="border-b border-[#dce8ee] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#e7f4f7] ring-1 ring-[#dce8ee]">
              {user.photo_url ? (
                <Image src={user.photo_url} alt="" fill sizes="48px" className="object-cover" unoptimized={isUpload(user.photo_url)} />
              ) : (
                <span className="flex size-full items-center justify-center text-sm font-semibold text-[#0f8fa3]">
                  {user.name.slice(0, 1)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-semibold text-[#0b4a5c]">{user.name}</p>
              <p className="truncate text-xs text-[#6b8290]">
                {user.father_id ? `OMI ${user.father_id}` : "Father"}
                {user.place ? ` · ${user.place}` : ""}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" className={btnGhost}>
              Website
            </Link>
            <button type="button" onClick={signOut} className={btnGhost}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[12.5rem_1fr]">
        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {sections.map(({ id, label, icon: Icon }) => {
            const count =
              id === "documents"
                ? counts.documents
                : id === "events"
                  ? counts.events
                  : id === "gallery"
                    ? counts.gallery
                    : id === "news"
                      ? counts.news
                      : null
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSection(id)
                  setNotice("")
                  setEditingNewsId(null)
                  setEditingEventId(null)
                  setEditingItemId(null)
                }}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition",
                  section === id ? "bg-[#0f8fa3] text-white" : "text-[#0b4a5c] hover:bg-white"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {count !== null ? (
                  <span className={cn("rounded-full px-1.5 text-[11px]", section === id ? "bg-white/20" : "bg-[#e7f4f7] text-[#0f8fa3]")}>
                    {count}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>

        <main className="min-w-0 rounded-2xl border border-[#dce8ee] bg-white p-5 sm:p-7">
          {notice ? (
            <p role="status" className="mb-5 rounded-lg border border-[#d5eef3] bg-[#f0fafc] px-3 py-2.5 text-sm text-[#0b4a5c]">
              {notice}
            </p>
          ) : null}

          {section === "personal" ? (
            <SectionShell title="Profile" lede="Your account details. OMI ID cannot be changed.">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#dce8ee] bg-[#f8fcfd] p-3">
                <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-full bg-[#0f8fa3] text-white">
                  {user.photo_url ? (
                    <Image src={user.photo_url} alt="" fill className="object-cover" unoptimized={isUpload(user.photo_url)} />
                  ) : (
                    <Camera className="size-5" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#0b4a5c]">Portrait</span>
                  <span className="text-xs text-[#6b8290]">JPEG, PNG or WebP</span>
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => onPortrait(e.target.files?.[0] ?? null)} />
              </label>
              <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#6b8290]">
                  Full name
                  <input name="name" required defaultValue={user.name} className={field} />
                </label>
                <label className="block text-sm font-medium text-[#6b8290]">
                  OMI ID
                  <input disabled value={user.father_id || ""} className={cn(field, "opacity-60")} />
                </label>
                <label className="block text-sm font-medium text-[#6b8290]">
                  Email
                  <input name="email" type="email" required defaultValue={user.email} className={field} />
                </label>
                <label className="block text-sm font-medium text-[#6b8290]">
                  Mobile
                  <input name="mobile_number" required defaultValue={user.mobile_number || ""} className={field} />
                </label>
                <label className="block text-sm font-medium text-[#6b8290]">
                  Date of birth
                  <input name="date_of_birth" type="date" required defaultValue={dateInput(user.date_of_birth)} className={field} />
                </label>
                <label className="block text-sm font-medium text-[#6b8290]">
                  Place of ministry
                  <input name="place" defaultValue={user.place || ""} className={field} />
                </label>
                <label className="block text-sm font-medium text-[#6b8290] sm:col-span-2">
                  Short bio
                  <textarea name="bio" rows={3} defaultValue={user.bio || ""} className={field} />
                </label>
                <label className="block text-sm font-medium text-[#6b8290] sm:col-span-2">
                  New password (optional)
                  <input name="password" type="password" minLength={12} placeholder="Leave blank to keep current" className={field} />
                </label>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={busy} className={btnPrimary}>
                    Save profile
                  </button>
                </div>
              </form>
            </SectionShell>
          ) : null}

          {section === "documents" ? (
            <SectionShell title="Documents" lede="Province reports and your own files. Edit or remove your uploads anytime.">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-[#8aa3ad] uppercase">From the Province</p>
                {adminReports.length === 0 ? (
                  <Empty>No reports from admin yet.</Empty>
                ) : (
                  adminReports.map((report) => (
                    <div key={report.id} className="rounded-xl border border-[#dce8ee] px-4 py-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-[#0b4a5c]">{report.title}</p>
                          <p className="mt-0.5 text-xs text-[#6b8290]">
                            {new Date(report.created_at).toLocaleDateString("en-GB")}
                            {report.sent_by ? ` · ${report.sent_by}` : ""}
                          </p>
                          {report.body ? <p className="mt-2 text-sm text-[#6b8290]">{report.body}</p> : null}
                        </div>
                        <a href={report.file_url} target="_blank" rel="noreferrer" className={btnGhost}>
                          Open
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-[#8aa3ad] uppercase">My documents</p>
                <form
                  className="grid gap-3 rounded-xl border border-dashed border-[#dce8ee] bg-[#f8fcfd] p-4 sm:grid-cols-[1fr_1fr_auto]"
                  onSubmit={async (event) => {
                    event.preventDefault()
                    const formEl = event.currentTarget
                    const form = new FormData(formEl)
                    const title = String(form.get("title") || "").trim()
                    const file = (formEl.elements.namedItem("file") as HTMLInputElement).files?.[0]
                    if (!title || !file) return
                    try {
                      const url = await uploadFile(file)
                      await addItem("document", { title, file_url: url, body: file.name })
                      formEl.reset()
                    } catch (err) {
                      setNotice(err instanceof Error ? err.message : "Upload failed.")
                    }
                  }}
                >
                  <input name="title" required placeholder="Title" className={field} />
                  <input name="file" required type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className={field} />
                  <button type="submit" disabled={busy} className={btnPrimary}>
                    <Upload className="size-4" /> Add
                  </button>
                </form>
                {items.document.length === 0 ? (
                  <Empty>No personal documents yet.</Empty>
                ) : (
                  items.document.map((item) => (
                    <div key={item.id} className="rounded-xl border border-[#dce8ee] px-4 py-3">
                      {editingItemId === item.id ? (
                        <form
                          className="space-y-3"
                          onSubmit={async (event) => {
                            event.preventDefault()
                            const form = new FormData(event.currentTarget)
                            await saveItem(item.id, "document", {
                              title: String(form.get("title") || "").trim(),
                              body: String(form.get("body") || "").trim(),
                            })
                          }}
                        >
                          <input name="title" required defaultValue={item.title} className={field} />
                          <input name="body" defaultValue={item.body} placeholder="Note" className={field} />
                          <div className="flex gap-2">
                            <button type="submit" disabled={busy} className={btnPrimary}>
                              Save
                            </button>
                            <button type="button" className={btnGhost} onClick={() => setEditingItemId(null)}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-[#0b4a5c]">{item.title}</p>
                            {item.file_url ? (
                              <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-[#0f8fa3] hover:underline">
                                Open file
                              </a>
                            ) : null}
                          </div>
                          <div className="flex gap-1">
                            <button type="button" className={btnGhost} onClick={() => setEditingItemId(item.id)}>
                              <Pencil className="size-3.5" /> Edit
                            </button>
                            <button type="button" className={btnDanger} onClick={() => removeItem(item.id, "document")}>
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </SectionShell>
          ) : null}

          {section === "events" ? (
            <SectionShell title="Events" lede="Submit calendar events. You can edit or delete while pending; published events are locked.">
              {!editingEventId ? (
                <form onSubmit={(e) => onEventSubmit(e)} className="grid gap-3 rounded-xl border border-dashed border-[#dce8ee] bg-[#f8fcfd] p-4">
                  <input name="title" required placeholder="Event name *" className={field} />
                  <input name="excerpt" required placeholder="Summary *" className={field} />
                  <input name="place" required placeholder="Place *" className={field} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input name="event_date" required type="date" className={field} aria-label="Start date" />
                    <input name="end_date" type="date" className={field} aria-label="End date" />
                  </div>
                  <textarea name="body" rows={3} placeholder="Notes (optional)" className={field} />
                  <button type="submit" disabled={busy} className={btnPrimary}>
                    Submit event
                  </button>
                </form>
              ) : null}

              <div className="space-y-3">
                {myEvents.length === 0 ? (
                  <Empty>No events yet.</Empty>
                ) : (
                  myEvents.map((item) => {
                    const locked = item.status === "published"
                    return (
                      <div key={item.id} className="rounded-xl border border-[#dce8ee] px-4 py-3">
                        {editingEventId === item.id ? (
                          <form onSubmit={(e) => onEventSubmit(e, item)} className="grid gap-3">
                            <input name="title" required defaultValue={item.title} className={field} />
                            <input name="excerpt" required defaultValue={item.excerpt} className={field} />
                            <input name="place" required defaultValue={item.location_text} className={field} />
                            <div className="grid gap-3 sm:grid-cols-2">
                              <input name="event_date" required type="date" defaultValue={dateInput(item.event_date)} className={field} />
                              <input name="end_date" type="date" defaultValue={dateInput(item.end_date)} className={field} />
                            </div>
                            <textarea name="body" rows={3} defaultValue={item.body || ""} className={field} />
                            <div className="flex gap-2">
                              <button type="submit" disabled={busy} className={btnPrimary}>
                                Save changes
                              </button>
                              <button type="button" className={btnGhost} onClick={() => setEditingEventId(null)}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-[#0b4a5c]">{item.title}</p>
                                <StatusPill status={item.status} />
                              </div>
                              <p className="mt-1 text-sm text-[#6b8290]">
                                {item.location_text}
                                {item.event_date ? ` · ${new Date(item.event_date).toLocaleDateString("en-GB")}` : ""}
                              </p>
                              {item.excerpt ? <p className="mt-1 text-sm text-[#6b8290]">{item.excerpt}</p> : null}
                            </div>
                            {!locked ? (
                              <div className="flex gap-1">
                                <button type="button" className={btnGhost} onClick={() => setEditingEventId(item.id)}>
                                  <Pencil className="size-3.5" /> Edit
                                </button>
                                <button type="button" className={btnDanger} onClick={() => removeEvent(item.id)}>
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-[#6b8290]">On home calendar</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </SectionShell>
          ) : null}

          {section === "gallery" ? (
            <SectionShell title="Gallery" lede="Photos from your ministry. Edit titles or remove anytime.">
              <form
                className="grid gap-3 rounded-xl border border-dashed border-[#dce8ee] bg-[#f8fcfd] p-4 sm:grid-cols-[1fr_1fr_auto]"
                onSubmit={async (event) => {
                  event.preventDefault()
                  const formEl = event.currentTarget
                  const form = new FormData(formEl)
                  const title = String(form.get("title") || "").trim()
                  const file = (formEl.elements.namedItem("file") as HTMLInputElement).files?.[0]
                  if (!title || !file) return
                  try {
                    const url = await uploadFile(file)
                    await addItem("gallery", { title, file_url: url })
                    formEl.reset()
                  } catch (err) {
                    setNotice(err instanceof Error ? err.message : "Upload failed.")
                  }
                }}
              >
                <input name="title" required placeholder="Photo title" className={field} />
                <input name="file" required type="file" accept="image/jpeg,image/png,image/webp" className={field} />
                <button type="submit" disabled={busy} className={btnPrimary}>
                  <Upload className="size-4" /> Add
                </button>
              </form>
              {items.gallery.length === 0 ? (
                <Empty>No photos yet.</Empty>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {items.gallery.map((item) => (
                    <li key={item.id} className="overflow-hidden rounded-xl border border-[#dce8ee]">
                      {item.file_url ? (
                        <div className="relative aspect-[4/3] bg-[#f8fcfd]">
                          <Image src={item.file_url} alt="" fill className="object-cover" unoptimized={isUpload(item.file_url)} />
                        </div>
                      ) : null}
                      <div className="space-y-2 p-3">
                        {editingItemId === item.id ? (
                          <form
                            className="space-y-2"
                            onSubmit={async (event) => {
                              event.preventDefault()
                              const form = new FormData(event.currentTarget)
                              await saveItem(item.id, "gallery", { title: String(form.get("title") || "").trim() })
                            }}
                          >
                            <input name="title" required defaultValue={item.title} className={field} />
                            <div className="flex gap-2">
                              <button type="submit" disabled={busy} className={btnPrimary}>
                                Save
                              </button>
                              <button type="button" className={btnGhost} onClick={() => setEditingItemId(null)}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-[#0b4a5c]">{item.title}</p>
                            <div className="flex shrink-0 gap-1">
                              <button type="button" className={btnGhost} onClick={() => setEditingItemId(item.id)}>
                                <Pencil className="size-3.5" />
                              </button>
                              <button type="button" className={btnDanger} onClick={() => removeItem(item.id, "gallery")}>
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionShell>
          ) : null}

          {section === "news" ? (
            <SectionShell title="Articles" lede="Write for the Province news. Edit or delete while pending; published articles are locked.">
              {!editingNewsId ? (
                <form onSubmit={(e) => onNewsSubmit(e)} className="grid gap-3 rounded-xl border border-dashed border-[#dce8ee] bg-[#f8fcfd] p-4">
                  <input name="title" required placeholder="Headline *" className={field} />
                  <input name="excerpt" required placeholder="Short summary *" className={field} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input name="place" required placeholder="Place *" className={field} />
                    <select name="section" required defaultValue="province-events" className={field}>
                      {NEWS_SECTIONS.map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea name="body" required rows={5} placeholder="Full article *" className={field} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-medium text-[#6b8290]">
                      Cover photo *
                      <input name="cover" required type="file" accept="image/jpeg,image/png,image/webp" className={field} />
                    </label>
                    <label className="block text-xs font-medium text-[#6b8290]">
                      More photos
                      <input name="gallery" type="file" multiple accept="image/jpeg,image/png,image/webp" className={field} />
                    </label>
                  </div>
                  <button type="submit" disabled={busy} className={btnPrimary}>
                    Submit article
                  </button>
                </form>
              ) : null}

              <div className="space-y-3">
                {myNews.length === 0 ? (
                  <Empty>No articles yet.</Empty>
                ) : (
                  myNews.map((item) => {
                    const locked = item.status === "published"
                    return (
                      <div key={item.id} className="rounded-xl border border-[#dce8ee] px-4 py-3">
                        {editingNewsId === item.id ? (
                          <form onSubmit={(e) => onNewsSubmit(e, item)} className="grid gap-3">
                            <input name="title" required defaultValue={item.title} className={field} />
                            <input name="excerpt" required defaultValue={item.excerpt} className={field} />
                            <div className="grid gap-3 sm:grid-cols-2">
                              <input name="place" required defaultValue={item.location_text} className={field} />
                              <select name="section" required defaultValue={item.section || "province-events"} className={field}>
                                {NEWS_SECTIONS.map(([id, label]) => (
                                  <option key={id} value={id}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <textarea name="body" required rows={5} defaultValue={item.body} className={field} />
                            <div className="grid gap-3 sm:grid-cols-2">
                              <label className="block text-xs font-medium text-[#6b8290]">
                                Replace cover (optional)
                                <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className={field} />
                              </label>
                              <label className="block text-xs font-medium text-[#6b8290]">
                                Add photos
                                <input name="gallery" type="file" multiple accept="image/jpeg,image/png,image/webp" className={field} />
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <button type="submit" disabled={busy} className={btnPrimary}>
                                Save changes
                              </button>
                              <button type="button" className={btnGhost} onClick={() => setEditingNewsId(null)}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-[#0b4a5c]">{item.title}</p>
                                <StatusPill status={item.status} />
                              </div>
                              {item.excerpt ? <p className="mt-1 text-sm text-[#6b8290]">{item.excerpt}</p> : null}
                              {locked ? (
                                <Link href={`/news/${item.slug}`} className="mt-2 inline-block text-sm font-medium text-[#0f8fa3] hover:underline">
                                  View on website
                                </Link>
                              ) : null}
                            </div>
                            {!locked ? (
                              <div className="flex gap-1">
                                <button type="button" className={btnGhost} onClick={() => setEditingNewsId(item.id)}>
                                  <Pencil className="size-3.5" /> Edit
                                </button>
                                <button type="button" className={btnDanger} onClick={() => removeNews(item.id)}>
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {provinceNews.length > 0 ? (
                <div className="space-y-3 border-t border-[#eef4f7] pt-6">
                  <p className="text-xs font-semibold tracking-[0.14em] text-[#8aa3ad] uppercase">Latest on the website</p>
                  {provinceNews.slice(0, 4).map((story) => (
                    <Link
                      key={story.slug}
                      href={`/news/${story.slug}`}
                      className="block rounded-xl border border-[#dce8ee] px-4 py-3 transition hover:border-[#0f8fa3]"
                    >
                      <p className="text-xs text-[#0f8fa3]">
                        {story.date_display || (story.published_at ? new Date(story.published_at).toLocaleDateString("en-GB") : "News")}
                      </p>
                      <p className="mt-0.5 font-medium text-[#0b4a5c]">{story.title}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </SectionShell>
          ) : null}
        </main>
      </div>
    </div>
  )
}
