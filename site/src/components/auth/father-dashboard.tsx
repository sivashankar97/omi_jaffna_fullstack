"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Camera,
  CheckCircle2,
  Circle,
  FileText,
  Images,
  LogOut,
  Newspaper,
  Trash2,
  Upload,
  UserRound,
  ListTodo,
} from "lucide-react"
import { FormEvent, useCallback, useEffect, useState } from "react"

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

type ProvinceNews = {
  slug: string
  title: string
  excerpt: string
  image_url: string
  published_at: string | null
  date_display: string | null
}

type AdminReport = {
  id: string
  title: string
  body: string
  file_url: string
  created_at: string
  sent_by: string | null
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

type DashboardData = {
  user: FatherUser
  items: Record<"document" | "gallery" | "action" | "news", FatherItem[]>
  adminReports: AdminReport[]
  myNews: MyNews[]
  provinceNews: ProvinceNews[]
}

const sections = [
  { id: "personal", label: "Personal details", icon: UserRound },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "actions", label: "Actions", icon: ListTodo },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "news", label: "News", icon: Newspaper },
] as const

type SectionId = (typeof sections)[number]["id"]

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#d5dee6] bg-[#f7fafc] px-3 py-2.5 text-base text-[#023e8a] outline-none placeholder:text-[#8aa0b2] focus:border-[#0077b6]"
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#023e8a] bg-[#023e8a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0077b6] disabled:opacity-60"
const ghostClass =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#023e8a] bg-white px-5 py-2.5 text-sm font-semibold text-[#023e8a] transition hover:bg-[#e7fbff] disabled:opacity-60"

function dateInput(value: string | null | undefined) {
  return value ? String(value).slice(0, 10) : ""
}

export function FatherDashboard() {
  const router = useRouter()
  const [section, setSection] = useState<SectionId>("personal")
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const response = await fetch("/api/father/dashboard", { credentials: "same-origin" })
    if (response.status === 401 || response.status === 403) {
      router.replace("/login")
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

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!data) return
    const form = new FormData(event.currentTarget)
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
        setNotice(typeof result.error === "string" ? result.error : "Could not save your details.")
        return
      }
      setData((current) => (current ? { ...current, user: result.user } : current))
      setNotice("Personal details saved.")
      event.currentTarget.querySelector<HTMLInputElement>('input[name="password"]')!.value = ""
    } finally {
      setBusy(false)
    }
  }

  async function uploadFile(file: File) {
    const body = new FormData()
    body.append("file", file)
    const response = await fetch("/api/father/upload", { method: "POST", credentials: "same-origin", body })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Upload failed.")
    return result.item.url as string
  }

  async function addItem(kind: FatherItem["kind"], payload: Partial<FatherItem> & { title: string }) {
    setBusy(true)
    setNotice("")
    try {
      const response = await fetch("/api/father/items", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, status: kind === "action" ? "open" : kind === "news" ? "draft" : "published", ...payload }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(typeof result.error === "string" ? result.error : "Could not add that item.")
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

  async function patchItem(id: string, kind: FatherItem["kind"], patch: Partial<FatherItem>) {
    const response = await fetch(`/api/father/items/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      setNotice(typeof result.error === "string" ? result.error : "Could not update.")
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
  }

  async function removeItem(id: string, kind: FatherItem["kind"]) {
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
        setNotice(typeof result.error === "string" ? result.error : "Could not update photo.")
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

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-heading text-2xl text-[#023e8a]">{error}</p>
        <Link href="/login" className={`${ghostClass} mt-6`}>
          Sign in again
        </Link>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center text-[#5c6b7a]">
        Loading your dashboard…
      </section>
    )
  }

  const { user, items, adminReports = [], myNews = [], provinceNews } = data

  async function submitNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const title = String(formData.get("title") || "").trim()
    const excerpt = String(formData.get("excerpt") || "").trim()
    const body = String(formData.get("body") || "").trim()
    const location_text = String(formData.get("place") || "").trim()
    const coverInput = form.elements.namedItem("cover") as HTMLInputElement
    const galleryInput = form.elements.namedItem("gallery") as HTMLInputElement
    const coverFile = coverInput.files?.[0]
    if (!title || !body || !coverFile) {
      setNotice("Add a title, story text and a cover photo.")
      return
    }
    setBusy(true)
    setNotice("")
    try {
      const image_url = await uploadFile(coverFile)
      const gallery: { src: string; alt: string; caption: string }[] = [
        { src: image_url, alt: title, caption: "" },
      ]
      for (const file of Array.from(galleryInput.files || [])) {
        const src = await uploadFile(file)
        gallery.push({ src, alt: title, caption: "" })
      }
      const response = await fetch("/api/father/news", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          body,
          location_text,
          image_url,
          section: "province-events",
          gallery,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setNotice(typeof result.error === "string" ? result.error : "Could not submit your news.")
        return
      }
      setData((current) =>
        current ? { ...current, myNews: [result.item, ...current.myNews] } : current
      )
      setNotice("News submitted for admin approval. It will appear on the website after it is published.")
      form.reset()
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not submit your news.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-[70vh] bg-[#f4fbfd]">
      <header className="border-b border-[#d8eef3] bg-gradient-to-br from-[#03202b] via-[#06394a] to-[#0a5062] px-4 py-10 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative size-16 overflow-hidden rounded-full bg-white/10 ring-2 ring-[#ffcf4a]/70 sm:size-20">
              {user.photo_url ? (
                <Image
                  src={user.photo_url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={isUpload(user.photo_url)}
                />
              ) : (
                <span className="flex size-full items-center justify-center font-heading text-xl font-bold">
                  {user.name.slice(0, 1)}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#ffcf4a] uppercase">Father dashboard</p>
              <h1 className="mt-1 font-heading text-3xl font-semibold sm:text-4xl">{user.name}</h1>
              <p className="mt-1 text-sm text-white/75">
                {user.father_id ? `Father ID ${user.father_id}` : "Member"}
                {user.place ? ` · ${user.place}` : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 transition hover:bg-white/15">
              Website
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#023e8a]"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[15rem_1fr]">
        <nav aria-label="Dashboard sections" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                section === id
                  ? "bg-[#023e8a] text-white shadow-sm"
                  : "bg-white text-[#023e8a] ring-1 ring-[#d8eef3] hover:bg-[#eaf8fb]"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 rounded-[1.75rem] bg-white p-5 ring-1 ring-[#d8eef3] sm:p-8">
          {notice ? (
            <p role="status" className="mb-5 rounded-xl bg-[#eaf8fb] px-4 py-3 text-sm text-[#0a3d7a]">
              {notice}
            </p>
          ) : null}

          {section === "personal" ? (
            <form onSubmit={saveProfile} className="space-y-5">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#023e8a]">Personal details</h2>
                <p className="mt-1 text-sm text-[#5c6b7a]">Update your account information. Father ID cannot be changed here.</p>
              </div>
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl bg-[#f4fbfd] p-4 ring-1 ring-[#d8eef3]">
                <span className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-[#023e8a] text-white">
                  {user.photo_url ? (
                    <Image src={user.photo_url} alt="" fill className="object-cover" unoptimized={isUpload(user.photo_url)} />
                  ) : (
                    <Camera className="size-6" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#023e8a]">Portrait photo</span>
                  <span className="text-xs text-[#5c6b7a]">JPEG, PNG or WebP up to 12 MB</span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => onPortrait(event.target.files?.[0] ?? null)}
                />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Full name
                  <input name="name" required defaultValue={user.name} className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Father ID
                  <input disabled value={user.father_id || ""} className={`${fieldClass} opacity-70`} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Email
                  <input name="email" type="email" required defaultValue={user.email} className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Mobile number
                  <input name="mobile_number" required defaultValue={user.mobile_number || ""} className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Date of birth
                  <input name="date_of_birth" type="date" required defaultValue={dateInput(user.date_of_birth)} className={fieldClass} />
                </label>
                <label className="block text-sm font-medium text-[#5c6b7a]">
                  Place of ministry
                  <input name="place" defaultValue={user.place || ""} placeholder="e.g. Jaffna" className={fieldClass} />
                </label>
              </div>
              <label className="block text-sm font-medium text-[#5c6b7a]">
                Short bio
                <textarea name="bio" rows={4} defaultValue={user.bio || ""} className={fieldClass} />
              </label>
              <label className="block text-sm font-medium text-[#5c6b7a]">
                New password (optional)
                <input name="password" type="password" minLength={12} placeholder="Leave blank to keep current" className={fieldClass} />
              </label>
              <button type="submit" disabled={busy} className={buttonClass}>
                Save personal details
              </button>
            </form>
          ) : null}

          {section === "documents" ? (
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#023e8a]">From the Province</h2>
                <p className="mt-1 text-sm text-[#5c6b7a]">
                  PDFs and reports sent by the CMS admin for you to download.
                </p>
                {adminReports.length === 0 ? (
                  <p className="mt-4 rounded-2xl bg-[#f4fbfd] px-4 py-8 text-center text-sm text-[#5c6b7a]">
                    No reports from the admin yet.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {adminReports.map((report) => (
                      <li key={report.id} className="rounded-2xl bg-[#eaf8fb] p-4 ring-1 ring-[#bfe6ef]">
                        <p className="text-[11px] font-bold tracking-[0.14em] text-[#0e98ac] uppercase">
                          Admin report · {new Date(report.created_at).toLocaleDateString("en-GB")}
                          {report.sent_by ? ` · ${report.sent_by}` : ""}
                        </p>
                        <p className="mt-1 font-heading text-lg font-semibold text-[#023e8a]">{report.title}</p>
                        {report.body ? <p className="mt-1 text-sm leading-6 text-[#5c6b7a]">{report.body}</p> : null}
                        <a
                          href={report.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-[#0a3d7a] hover:underline"
                        >
                          Open / download PDF
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <ItemSection
                title="My documents"
                hint="Your own certificates, letters and PDFs."
                items={items.document}
                empty="No personal documents yet."
                onRemove={(id) => removeItem(id, "document")}
                renderMeta={(item) =>
                  item.file_url ? (
                    <a href={item.file_url} className="text-sm font-semibold text-[#0e98ac] hover:underline" target="_blank" rel="noreferrer">
                      Open file
                    </a>
                  ) : null
                }
              >
                <AddFileForm
                  busy={busy}
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  label="Upload document"
                  onSubmit={async ({ title, file }) => {
                    try {
                      const url = await uploadFile(file)
                      await addItem("document", { title, file_url: url, body: file.name })
                    } catch (err) {
                      setNotice(err instanceof Error ? err.message : "Upload failed.")
                    }
                  }}
                />
              </ItemSection>
            </div>
          ) : null}

          {section === "actions" ? (
            <ItemSection
              title="Actions"
              hint="Personal reminders and tasks for your ministry."
              items={items.action}
              empty="No actions yet."
              onRemove={(id) => removeItem(id, "action")}
              renderMeta={(item) => (
                <button
                  type="button"
                  onClick={() => patchItem(item.id, "action", { status: item.status === "done" ? "open" : "done" })}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a3d7a]"
                >
                  {item.status === "done" ? <CheckCircle2 className="size-4 text-[#0e98ac]" /> : <Circle className="size-4" />}
                  {item.status === "done" ? "Done" : "Mark done"}
                </button>
              )}
            >
              <AddTextForm
                busy={busy}
                titleLabel="Action"
                bodyLabel="Notes (optional)"
                onSubmit={async ({ title, body }) => addItem("action", { title, body })}
              />
            </ItemSection>
          ) : null}

          {section === "gallery" ? (
            <ItemSection
              title="Gallery"
              hint="Photos from your parish, community or ministry."
              items={items.gallery}
              empty="No photos yet."
              onRemove={(id) => removeItem(id, "gallery")}
              grid
              renderMeta={(item) =>
                item.file_url ? (
                  <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl bg-[#eaf8fb]">
                    <Image src={item.file_url} alt="" fill className="object-cover" unoptimized={isUpload(item.file_url)} />
                  </div>
                ) : null
              }
            >
              <AddFileForm
                busy={busy}
                accept="image/jpeg,image/png,image/webp"
                label="Add photo"
                onSubmit={async ({ title, file }) => {
                  try {
                    const url = await uploadFile(file)
                    await addItem("gallery", { title, file_url: url })
                  } catch (err) {
                    setNotice(err instanceof Error ? err.message : "Upload failed.")
                  }
                }}
              />
            </ItemSection>
          ) : null}

          {section === "news" ? (
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#023e8a]">Submit a news story</h2>
                <p className="mt-1 text-sm text-[#5c6b7a]">
                  Add a cover photo and optional gallery. An admin must approve it before it appears on the public News page.
                </p>
                <form onSubmit={submitNews} className="mt-5 space-y-4 rounded-2xl border border-dashed border-[#bfe6ef] bg-[#fafefe] p-4">
                  <label className="block text-sm font-medium text-[#5c6b7a]">
                    Headline *
                    <input name="title" required className={fieldClass} />
                  </label>
                  <label className="block text-sm font-medium text-[#5c6b7a]">
                    Short summary
                    <input name="excerpt" className={fieldClass} />
                  </label>
                  <label className="block text-sm font-medium text-[#5c6b7a]">
                    Place
                    <input name="place" placeholder="e.g. Jaffna" className={fieldClass} />
                  </label>
                  <label className="block text-sm font-medium text-[#5c6b7a]">
                    Story *
                    <textarea name="body" required rows={6} className={fieldClass} />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-[#5c6b7a]">
                      Cover photo *
                      <input name="cover" type="file" required accept="image/jpeg,image/png,image/webp" className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-[#eaf8fb] file:px-3 file:py-1 file:text-xs file:font-semibold`} />
                    </label>
                    <label className="block text-sm font-medium text-[#5c6b7a]">
                      More photos (optional)
                      <input name="gallery" type="file" multiple accept="image/jpeg,image/png,image/webp" className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-[#eaf8fb] file:px-3 file:py-1 file:text-xs file:font-semibold`} />
                    </label>
                  </div>
                  <button type="submit" disabled={busy} className={buttonClass}>
                    Submit for admin approval
                  </button>
                </form>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-[#023e8a]">Your submissions</h3>
                <p className="mt-1 text-sm text-[#5c6b7a]">Track approval status. Published stories open on the website.</p>
                <ul className="mt-4 space-y-3">
                  {myNews.length === 0 ? (
                    <li className="rounded-2xl bg-[#f4fbfd] px-4 py-6 text-sm text-[#5c6b7a]">No submissions yet.</li>
                  ) : (
                    myNews.map((story) => (
                      <li key={story.id} className="rounded-2xl bg-[#f4fbfd] p-4 ring-1 ring-[#d8eef3]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-heading text-lg font-semibold text-[#023e8a]">{story.title}</p>
                            {story.excerpt ? <p className="mt-1 text-sm text-[#5c6b7a]">{story.excerpt}</p> : null}
                            <p className="mt-2 text-xs font-semibold tracking-wide uppercase">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5",
                                  story.status === "published"
                                    ? "bg-[#d8f5e7] text-[#0b6b3a]"
                                    : story.status === "review"
                                      ? "bg-[#fff4cc] text-[#8a6500]"
                                      : "bg-[#eef2ff] text-[#3949ab]"
                                )}
                              >
                                {story.status === "published"
                                  ? "Published on website"
                                  : story.status === "review"
                                    ? "Awaiting admin approval"
                                    : story.status}
                              </span>
                            </p>
                          </div>
                          {story.status === "published" ? (
                            <Link href={`/news/${story.slug}`} className="text-sm font-semibold text-[#0e98ac] hover:underline">
                              View on site
                            </Link>
                          ) : null}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-[#023e8a]">Province news</h3>
                <p className="mt-1 text-sm text-[#5c6b7a]">Latest published stories from the website.</p>
                <ul className="mt-4 space-y-3">
                  {provinceNews.length === 0 ? (
                    <li className="rounded-2xl bg-[#f4fbfd] px-4 py-6 text-sm text-[#5c6b7a]">No published news yet.</li>
                  ) : (
                    provinceNews.map((story) => (
                      <li key={story.slug}>
                        <Link
                          href={`/news/${story.slug}`}
                          className="block rounded-2xl bg-[#f4fbfd] px-4 py-4 ring-1 ring-[#d8eef3] transition hover:bg-white hover:ring-[#17b3c6]"
                        >
                          <span className="text-xs font-semibold tracking-wide text-[#0e98ac] uppercase">
                            {story.date_display || (story.published_at ? new Date(story.published_at).toLocaleDateString("en-GB") : "News")}
                          </span>
                          <span className="mt-1 block font-heading text-lg font-semibold text-[#023e8a]">{story.title}</span>
                          {story.excerpt ? <span className="mt-1 block text-sm text-[#5c6b7a]">{story.excerpt}</span> : null}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ItemSection({
  title,
  hint,
  items,
  empty,
  children,
  onRemove,
  renderMeta,
  grid,
}: {
  title: string
  hint: string
  items: FatherItem[]
  empty: string
  children: React.ReactNode
  onRemove: (id: string) => void
  renderMeta?: (item: FatherItem) => React.ReactNode
  grid?: boolean
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-[#023e8a]">{title}</h2>
        <p className="mt-1 text-sm text-[#5c6b7a]">{hint}</p>
      </div>
      {children}
      {items.length === 0 ? (
        <p className="rounded-2xl bg-[#f4fbfd] px-4 py-8 text-center text-sm text-[#5c6b7a]">{empty}</p>
      ) : (
        <ul className={cn(grid ? "grid gap-4 sm:grid-cols-2" : "space-y-3")}>
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl bg-[#f4fbfd] p-4 ring-1 ring-[#d8eef3]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-lg font-semibold text-[#023e8a]">{item.title}</p>
                  {item.body ? <p className="mt-1 text-sm leading-6 text-[#5c6b7a] whitespace-pre-line">{item.body}</p> : null}
                  <div className="mt-3">{renderMeta?.(item)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.title}`}
                  className="rounded-full p-2 text-[#5c6b7a] transition hover:bg-white hover:text-[#b42318]"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function AddTextForm({
  busy,
  titleLabel,
  bodyLabel,
  onSubmit,
}: {
  busy: boolean
  titleLabel: string
  bodyLabel: string
  onSubmit: (values: { title: string; body: string }) => Promise<void>
}) {
  return (
    <form
      className="grid gap-3 rounded-2xl border border-dashed border-[#bfe6ef] bg-[#fafefe] p-4 sm:grid-cols-[1fr_auto] sm:items-end"
      onSubmit={async (event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const title = String(form.get("title") || "").trim()
        const body = String(form.get("body") || "").trim()
        if (!title) return
        await onSubmit({ title, body })
        event.currentTarget.reset()
      }}
    >
      <div className="space-y-3 sm:col-span-2">
        <label className="block text-sm font-medium text-[#5c6b7a]">
          {titleLabel}
          <input name="title" required className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[#5c6b7a]">
          {bodyLabel}
          <textarea name="body" rows={3} className={fieldClass} />
        </label>
      </div>
      <button type="submit" disabled={busy} className={buttonClass}>
        Add
      </button>
    </form>
  )
}

function AddFileForm({
  busy,
  accept,
  label,
  onSubmit,
}: {
  busy: boolean
  accept: string
  label: string
  onSubmit: (values: { title: string; file: File }) => Promise<void>
}) {
  return (
    <form
      className="grid gap-3 rounded-2xl border border-dashed border-[#bfe6ef] bg-[#fafefe] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.currentTarget
        const data = new FormData(form)
        const title = String(data.get("title") || "").trim()
        const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0]
        if (!title || !file) return
        await onSubmit({ title, file })
        form.reset()
      }}
    >
      <label className="block text-sm font-medium text-[#5c6b7a]">
        Title
        <input name="title" required className={fieldClass} />
      </label>
      <label className="block text-sm font-medium text-[#5c6b7a]">
        File
        <input name="file" type="file" required accept={accept} className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-[#eaf8fb] file:px-3 file:py-1 file:text-xs file:font-semibold`} />
      </label>
      <button type="submit" disabled={busy} className={buttonClass}>
        <Upload className="size-4" /> {label}
      </button>
    </form>
  )
}
