"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  CalendarDays,
  Camera,
  ChevronRight,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Pencil,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react"
import { FormEvent, useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import {
  AiButton,
  btnDanger,
  btnGhost,
  btnPrimary,
  dateInput,
  Empty,
  field,
  Field,
  FileDrop,
  firstSentence,
  FormActions,
  FormCard,
  FormGroup,
  ItemCard,
  NewButton,
  ProgressIndicator,
  SectionShell,
  shortDate,
  SubHeading,
  Toast,
  type Notice,
  type NoticeTone,
} from "@/components/auth/father-dashboard-ui"
import { signOutSession } from "@/components/auth/session"
import { libraryCategories as defaultLibraryCategories, type LibraryCategory } from "@/content/library"
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

type Photo = { src: string; alt?: string; caption?: string }

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
  updated_at: string
  section: string | null
  gallery: Photo[] | null
  from_event: string | null
}

type MyEvent = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  image_url: string
  location_text: string
  event_date: string | null
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
  date_display: string | null
  end_date: string | null
  gallery: Photo[] | null
}

type MyBook = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  image_url: string
  media_url: string
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
  section: "books" | "libraries" | null
  category: string | null
  date_display: string | null
  author: string | null
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
  profileSlug: string | null
  items: Record<"document" | "gallery" | "action" | "news", FatherItem[]>
  adminReports: AdminReport[]
  myNews: MyNews[]
  myEvents: MyEvent[]
  myBooks: MyBook[]
  provinceNews: ProvinceNews[]
}

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "personal", label: "Profile", icon: UserRound },
  { id: "news", label: "Articles", icon: Newspaper },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "documents", label: "Documents", icon: FileText },
] as const

type SectionId = (typeof sections)[number]["id"]
type EditTarget = { kind: "news" | "events" | "books"; id: string }

const NEWS_SECTIONS = [
  ["province-events", "Province events"],
  ["parish-events", "Parish events"],
  ["liturgical", "Liturgical celebrations"],
  ["formation", "Formation activities"],
  ["youth", "Youth events"],
  ["social", "Social initiatives"],
] as const

const IMAGE_TYPES = "image/jpeg,image/png,image/webp"
const MAX_PDF = 40 * 1024 * 1024
const MAX_IMAGE = 12 * 1024 * 1024

const bookPlace = (book: Pick<MyBook, "section" | "category">, libraryCategories: readonly LibraryCategory[]) =>
  book.section === "libraries"
    ? `Library › ${libraryCategories.find((c) => c.id === book.category)?.label || "collection"}`
    : "New book release"
const bookLink = (book: Pick<MyBook, "section">) => (book.section === "libraries" ? "/library/libraries" : "/library/books")
const newsSectionLabel = (id: string | null) => NEWS_SECTIONS.find(([key]) => key === id)?.[1] || "News"

function NewsSectionSelect({ value }: { value?: string | null }) {
  return (
    <select name="section" required defaultValue={value || "province-events"} className={field}>
      {NEWS_SECTIONS.map(([id, label]) => (
        <option key={id} value={id}>
          {label}
        </option>
      ))}
    </select>
  )
}

function CurrentImage({ src, label }: { src: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-xs text-[#6b8290]">
      <span className="relative size-12 overflow-hidden rounded-lg ring-1 ring-[#dce8ee]">
        <Image src={src} alt="" fill sizes="48px" className="object-cover" unoptimized={isUpload(src)} />
      </span>
      {label}
    </span>
  )
}

function ArticleFields({ item, fromEvent, ai }: { item?: MyNews; fromEvent?: MyEvent; ai?: ReactNode }) {
  const coverRequired = !item && !fromEvent?.image_url
  return (
    <>
      <FormGroup title="The story">
        <Field label="Headline" required>
          <input name="title" required defaultValue={item?.title ?? fromEvent?.title} className={field} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Place" required>
            <input name="place" required defaultValue={item?.location_text ?? fromEvent?.location_text} className={field} />
          </Field>
          <Field label="News section" required>
            <NewsSectionSelect value={item?.section} />
          </Field>
        </div>
        <Field
          label="Full article"
          required
          hint="Write it yourself, or write a few points and press “Write with AI” to turn them into full paragraphs."
        >
          <textarea name="body" required rows={item || fromEvent ? 9 : 7} defaultValue={item?.body ?? fromEvent?.body} className={field} />
        </Field>
        {ai}
        <Field label="Short summary" optional hint="Shown under the headline. If empty, the first sentence of the article is used.">
          <input name="excerpt" defaultValue={item?.excerpt ?? fromEvent?.excerpt} className={field} />
        </Field>
      </FormGroup>
      <FormGroup title="Photos">
        <FileDrop
          name="cover"
          label={item ? "Replace cover photo" : "Cover photo"}
          accept={IMAGE_TYPES}
          required={coverRequired}
          optional={!coverRequired}
          hint={fromEvent?.image_url && !item ? "Leave empty to use the event photo." : "JPEG, PNG or WebP, up to 12 MB."}
          current={item?.image_url ? <CurrentImage src={item.image_url} label="Current cover" /> : null}
        />
        <FileDrop
          name="gallery"
          label={item ? "Add more photos" : "More photos"}
          accept={IMAGE_TYPES}
          multiple
          optional
          hint={fromEvent?.gallery?.length ? `The event's ${fromEvent.gallery.length} photos are included.` : "Shown as a gallery under the article."}
        />
      </FormGroup>
    </>
  )
}

function EventFields({ item, ai }: { item?: MyEvent; ai?: ReactNode }) {
  return (
    <>
      <FormGroup title="Event details">
        <Field label="Event name" required>
          <input name="title" required defaultValue={item?.title} className={field} />
        </Field>
        <Field label="Place" required>
          <input name="place" required defaultValue={item?.location_text} className={field} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date" required>
            <input name="event_date" required type="date" defaultValue={dateInput(item?.event_date)} className={field} />
          </Field>
          <Field label="End date" optional hint="Only if it runs for more than one day.">
            <input name="end_date" type="date" defaultValue={dateInput(item?.end_date)} className={field} />
          </Field>
        </div>
      </FormGroup>
      <FormGroup title="Description">
        <Field
          label="Description"
          optional
          hint="Write it yourself, or write a few points (who, what, when, why) and press “Write with AI”."
        >
          <textarea name="body" rows={7} defaultValue={item?.body || ""} className={field} />
        </Field>
        {ai}
        <Field label="Summary for the calendar" optional hint="One line. If empty, the first sentence of the description is used.">
          <input name="excerpt" defaultValue={item?.excerpt} className={field} />
        </Field>
      </FormGroup>
      <FormGroup title="Photos">
        {item?.gallery?.length ? (
          <div>
            <p className="text-sm font-medium text-[#0b4a5c]">Current photos</p>
            <p className="text-xs text-[#6b8290]">Untick a photo to remove it. The first photo is the cover.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.gallery.map((photo, index) => (
                <label key={photo.src} className="relative block size-20 cursor-pointer overflow-hidden rounded-lg ring-1 ring-[#dce8ee]">
                  <Image src={photo.src} alt={`Photo ${index + 1}`} fill sizes="80px" className="object-cover" unoptimized={isUpload(photo.src)} />
                  <input
                    name="keep_photo"
                    type="checkbox"
                    value={photo.src}
                    defaultChecked
                    aria-label={`Keep photo ${index + 1}`}
                    className="absolute top-1 right-1 size-5 accent-[#0f8fa3]"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}
        <FileDrop
          name="photos"
          label={item?.gallery?.length ? "Add more photos" : "Photos"}
          accept={IMAGE_TYPES}
          multiple
          optional
          hint="Up to 24 photos. The first becomes the cover."
        />
      </FormGroup>
    </>
  )
}

function BookFields({
  item,
  defaultAuthor,
  ai,
  libraryCategories,
}: {
  item?: MyBook
  defaultAuthor: string
  ai?: ReactNode
  libraryCategories: readonly LibraryCategory[]
}) {
  const [where, setWhere] = useState<"books" | "libraries">(item?.section === "libraries" ? "libraries" : "books")
  const choice = (value: "books" | "libraries", title: string, text: string) => (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer gap-3 rounded-xl border-2 p-3 transition focus-within:ring-2 focus-within:ring-[#0f8fa3]/20",
        where === value ? "border-[#0f8fa3] bg-[#effafc]" : "border-[#dce8ee] bg-white hover:border-[#0f8fa3]/50"
      )}
    >
      <input
        type="radio"
        name="section"
        value={value}
        checked={where === value}
        onChange={() => setWhere(value)}
        className="mt-1 size-4 shrink-0 accent-[#0f8fa3]"
      />
      <span>
        <span className="block text-sm font-semibold text-[#0b4a5c]">{title}</span>
        <span className="block text-xs leading-relaxed text-[#6b8290]">{text}</span>
      </span>
    </label>
  )
  return (
    <>
      <FormGroup title="About the book">
        <Field label="Title" required>
          <input name="title" required defaultValue={item?.title} className={field} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Author" required>
            <input name="author" required defaultValue={item?.author || defaultAuthor} className={field} />
          </Field>
          <Field label="Year / edition" optional hint="For example “2026” or “2nd edition, 2025”.">
            <input name="date_display" defaultValue={item?.date_display || ""} className={field} />
          </Field>
        </div>
      </FormGroup>
      <FormGroup title="Where should it appear?">
        <div role="radiogroup" aria-label="Where should it appear?" className="grid gap-3 sm:grid-cols-2">
          {choice("books", "New book release", "Shown under Library › Books as a new release.")}
          {choice("libraries", "Library collection", "Placed in one of the Province libraries.")}
        </div>
        {where === "libraries" ? (
          <Field label="Library collection" required>
            <select name="category" required defaultValue={item?.category || ""} className={field}>
              <option value="" disabled>
                Choose a collection…
              </option>
              {libraryCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
      </FormGroup>
      <FormGroup title="Description">
        <Field label="Short description" optional hint="One or two lines shown on the Library card.">
          <input name="excerpt" defaultValue={item?.excerpt} className={field} />
        </Field>
        <Field label="Longer description" optional hint="What the book is about and who it is for. “Write with AI” can help from a few points.">
          <textarea name="body" rows={6} defaultValue={item?.body} className={field} />
        </Field>
        {ai}
      </FormGroup>
      <FormGroup title="Files">
        <FileDrop
          name="pdf"
          label={item ? "Replace the book PDF" : "Book PDF"}
          accept="application/pdf"
          required={!item}
          optional={Boolean(item)}
          hint="PDF only, up to 40 MB."
          current={
            item?.media_url ? (
              <a href={item.media_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0f8fa3] hover:underline">
                <FileText className="size-4" /> Current PDF
              </a>
            ) : null
          }
        />
        <FileDrop
          name="cover"
          label={item?.image_url ? "Replace cover image" : "Cover image"}
          accept={IMAGE_TYPES}
          optional
          hint="JPEG, PNG or WebP. Without a cover, the Library shows a designed cover with the title."
          current={item?.image_url ? <CurrentImage src={item.image_url} label="Current cover" /> : null}
        />
      </FormGroup>
    </>
  )
}

function StatCard({
  icon,
  label,
  published,
  waiting,
  onClick,
}: {
  icon: ReactNode
  label: string
  published: number
  waiting: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-0 rounded-xl bg-[#f3f8fa] px-3 py-2.5 text-left ring-1 ring-[#e3eef2] transition hover:bg-[#e9f5f8] hover:ring-[#0f8fa3]/40 focus-visible:ring-2 focus-visible:ring-[#0f8fa3] focus-visible:outline-none sm:px-4 sm:py-3"
    >
      <span className="flex items-center gap-1.5 text-xs font-medium text-[#5b8594]">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span className="mt-1 block font-heading text-xl font-semibold text-[#0b4a5c] sm:text-2xl">
        {published}
        <span className="ml-1 font-sans text-[11px] font-normal text-[#6b8290]">published</span>
      </span>
      <span className={cn("block truncate text-[11px] font-medium", waiting ? "text-[#8a6500]" : "text-[#8aa3ad]")}>
        {waiting ? `${waiting} waiting` : "None waiting"}
      </span>
    </button>
  )
}

export function FatherDashboard({
  libraryCategories = defaultLibraryCategories,
}: {
  libraryCategories?: readonly LibraryCategory[]
}) {
  const router = useRouter()
  const [section, setSection] = useState<SectionId>("overview")
  const [creating, setCreating] = useState<SectionId | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState<Notice | null>(null)
  const [busy, setBusy] = useState(false)
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [editingBookId, setEditingBookId] = useState<string | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [articleFromEventId, setArticleFromEventId] = useState<string | null>(null)
  const [aiBusy, setAiBusy] = useState(false)
  const [progress, setProgress] = useState<{ label: string; percent: number } | null>(null)
  const working = busy || aiBusy || progress !== null
  const mainRef = useRef<HTMLElement>(null)

  const notify = useCallback((text: string, tone: NoticeTone = "error") => {
    setNotice(text ? { text, tone, id: Date.now() } : null)
  }, [])
  const clearNotice = useCallback(() => setNotice(null), [])

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

  useEffect(() => {
    document.getElementById(`tab-${section}`)?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [section])

  function go(next: SectionId, options: { create?: boolean; edit?: EditTarget } = {}) {
    setSection(next)
    setCreating(options.create ? next : null)
    setEditingNewsId(options.edit?.kind === "news" ? options.edit.id : null)
    setEditingEventId(options.edit?.kind === "events" ? options.edit.id : null)
    setEditingBookId(options.edit?.kind === "books" ? options.edit.id : null)
    setEditingItemId(null)
    setArticleFromEventId(null)
    const main = mainRef.current
    if (main && main.getBoundingClientRect().top < 0) main.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  async function signOut() {
    await signOutSession()
    router.replace("/login")
  }

  /** XHR instead of fetch so the browser reports upload progress for the progress bar. */
  function uploadFile(file: File, label = "Uploading file") {
    return new Promise<string>((resolve, reject) => {
      const body = new FormData()
      body.append("file", file)
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/father/upload")
      xhr.responseType = "json"
      setProgress({ label, percent: 0 })
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) setProgress({ label, percent: Math.round((event.loaded / event.total) * 100) })
      }
      xhr.onload = () => {
        setProgress(null)
        const result = (xhr.response || {}) as { error?: unknown; item?: { url: string } }
        if (xhr.status >= 200 && xhr.status < 300 && result.item?.url) resolve(result.item.url)
        else reject(new Error(typeof result.error === "string" ? result.error : "Upload failed."))
      }
      xhr.onerror = () => {
        setProgress(null)
        reject(new Error("Upload failed. Check your internet connection and try again."))
      }
      xhr.send(body)
    })
  }

  const photoLabel = (index: number, total: number) => (total > 1 ? `Uploading photo ${index + 1} of ${total}` : "Uploading photo")

  function apiError(result: { error?: unknown }, fallback: string) {
    if (typeof result.error === "string") return result.error
    const fields = (result.error as { fieldErrors?: Record<string, string[]> } | undefined)?.fieldErrors
    const first = fields && Object.values(fields).flat()[0]
    return first || fallback
  }

  async function send(url: string, method: string, payload?: unknown) {
    const response = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: payload ? { "Content-Type": "application/json" } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    })
    return { ok: response.ok, result: await response.json().catch(() => ({})) }
  }

  /** Turns the writer's notes into full text and fills the form; the father still reviews and submits it. */
  async function aiWrite(formEl: HTMLFormElement | null, kind: "event" | "article" | "book") {
    if (!formEl) return
    const input = (name: string) => formEl.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null
    const get = (name: string) => input(name)?.value.trim() || formEl.dataset[name.replace(/_(\w)/g, (_, c) => c.toUpperCase())] || ""
    const set = (name: string, value: string) => {
      const el = input(name)
      if (el && value) el.value = value
    }
    if (!get("title") && !get("body")) {
      notify("Add a title and a few points in the description first.", "info")
      return
    }
    setAiBusy(true)
    clearNotice()
    try {
      const { ok, result } = await send("/api/father/ai/write", "POST", {
        kind,
        title: get("title"),
        place: get("place"),
        event_date: get("event_date"),
        end_date: get("end_date"),
        excerpt: get("excerpt"),
        notes: get("body"),
        book_author: kind === "book" ? get("author") : "",
        year: kind === "book" ? get("date_display") : "",
      })
      if (!ok) {
        notify(apiError(result, "AI writing failed. Please try again."))
        return
      }
      const draft = result.draft as { title: string; excerpt: string; body: string; sources?: string[] }
      if (kind === "article") set("title", draft.title)
      set("excerpt", draft.excerpt)
      set("body", draft.body)
      notify(
        draft.sources?.length
          ? `Draft written, with background from ${draft.sources.join("; ")}. Please check every detail and correct anything before you submit.`
          : "Draft written. Please read it through and correct anything before you submit.",
        "info"
      )
    } catch {
      notify("AI writing failed. Please try again.")
    } finally {
      setAiBusy(false)
    }
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
    clearNotice()
    try {
      const { ok, result } = await send("/api/auth/profile", "PATCH", body)
      if (!ok) {
        notify(apiError(result, "Could not save your details."))
        return
      }
      setData((current) => (current ? { ...current, user: result.user } : current))
      notify("Profile saved.", "success")
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
      const url = await uploadFile(file, "Uploading portrait")
      const { ok, result } = await send("/api/auth/profile", "PATCH", { photo_url: url })
      if (!ok) {
        notify(apiError(result, "Could not update photo."))
        return
      }
      setData((current) => (current ? { ...current, user: result.user } : current))
      notify("Portrait updated.", "success")
    } catch (err) {
      notify(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setBusy(false)
    }
  }

  async function addItem(kind: "document" | "gallery", payload: { title: string; file_url: string; body?: string }) {
    setBusy(true)
    clearNotice()
    try {
      const { ok, result } = await send("/api/father/items", "POST", { kind, status: "published", ...payload })
      if (!ok) {
        notify(apiError(result, "Could not add that item."))
        return false
      }
      setData((current) =>
        current ? { ...current, items: { ...current.items, [kind]: [result.item, ...current.items[kind]] } } : current
      )
      notify(kind === "gallery" ? "Photo added." : "Document added.", "success")
      return true
    } finally {
      setBusy(false)
    }
  }

  async function saveItem(id: string, kind: "document" | "gallery", patch: { title: string; body?: string }) {
    setBusy(true)
    clearNotice()
    try {
      const { ok, result } = await send(`/api/father/items/${id}`, "PATCH", patch)
      if (!ok) {
        notify(apiError(result, "Could not update."))
        return
      }
      setData((current) =>
        current
          ? {
              ...current,
              items: { ...current.items, [kind]: current.items[kind].map((item) => (item.id === id ? result.item : item)) },
            }
          : current
      )
      setEditingItemId(null)
      notify("Updated.", "success")
    } finally {
      setBusy(false)
    }
  }

  async function removeItem(id: string, kind: "document" | "gallery") {
    if (!window.confirm(kind === "gallery" ? "Remove this photo?" : "Remove this document?")) return
    const { ok } = await send(`/api/father/items/${id}`, "DELETE")
    if (!ok) {
      notify("Could not remove that item.")
      return
    }
    setData((current) =>
      current ? { ...current, items: { ...current.items, [kind]: current.items[kind].filter((item) => item.id !== id) } } : current
    )
    notify("Removed.", "success")
  }

  async function saveNews(payload: Record<string, unknown>, editId?: string | null) {
    setBusy(true)
    clearNotice()
    try {
      const { ok, result } = await send(editId ? `/api/father/news/${editId}` : "/api/father/news", editId ? "PATCH" : "POST", payload)
      if (!ok) {
        notify(apiError(result, "Could not save article."))
        return false
      }
      setData((current) => {
        if (!current) return current
        if (editId) return { ...current, myNews: current.myNews.map((item) => (item.id === editId ? result.item : item)) }
        return { ...current, myNews: [result.item, ...current.myNews] }
      })
      setEditingNewsId(null)
      setArticleFromEventId(null)
      setCreating(null)
      notify(editId ? "Article updated." : "Article sent for approval. You will see it as Published once the Province office approves it.", "success")
      return true
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save article.")
      return false
    } finally {
      setBusy(false)
    }
  }

  async function removeNews(id: string) {
    if (!window.confirm("Delete this article? This cannot be undone.")) return
    const { ok, result } = await send(`/api/father/news/${id}`, "DELETE")
    if (!ok) {
      notify(apiError(result, "Could not delete article."))
      return
    }
    setData((current) => (current ? { ...current, myNews: current.myNews.filter((item) => item.id !== id) } : current))
    if (editingNewsId === id) setEditingNewsId(null)
    notify("Article deleted.", "success")
  }

  async function saveEvent(payload: Record<string, unknown>, editId?: string | null) {
    setBusy(true)
    clearNotice()
    try {
      const { ok, result } = await send(editId ? `/api/father/events/${editId}` : "/api/father/events", editId ? "PATCH" : "POST", payload)
      if (!ok) {
        notify(apiError(result, "Could not save event."))
        return false
      }
      setData((current) => {
        if (!current) return current
        if (editId) return { ...current, myEvents: current.myEvents.map((item) => (item.id === editId ? result.item : item)) }
        return { ...current, myEvents: [result.item, ...(current.myEvents || [])] }
      })
      setEditingEventId(null)
      setCreating(null)
      notify(editId ? "Event updated." : "Event sent for approval. It appears on the calendar once the Province office approves it.", "success")
      return true
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save event.")
      return false
    } finally {
      setBusy(false)
    }
  }

  async function removeEvent(id: string) {
    if (!window.confirm("Delete this event? This cannot be undone.")) return
    const { ok, result } = await send(`/api/father/events/${id}`, "DELETE")
    if (!ok) {
      notify(apiError(result, "Could not delete event."))
      return
    }
    setData((current) => (current ? { ...current, myEvents: (current.myEvents || []).filter((item) => item.id !== id) } : current))
    if (editingEventId === id) setEditingEventId(null)
    notify("Event deleted.", "success")
  }

  async function saveBook(payload: Record<string, unknown>, editId?: string | null) {
    setBusy(true)
    clearNotice()
    try {
      const { ok, result } = await send(editId ? `/api/father/library/${editId}` : "/api/father/library", editId ? "PATCH" : "POST", payload)
      if (!ok) {
        notify(apiError(result, "Could not save the book."))
        return false
      }
      setData((current) => {
        if (!current) return current
        if (editId) return { ...current, myBooks: current.myBooks.map((item) => (item.id === editId ? result.item : item)) }
        return { ...current, myBooks: [result.item, ...(current.myBooks || [])] }
      })
      setEditingBookId(null)
      setCreating(null)
      notify(editId ? "Book updated." : "Book sent for approval. It appears in the Library once the Province office approves it.", "success")
      return true
    } finally {
      setBusy(false)
    }
  }

  async function removeBook(id: string) {
    if (!window.confirm("Delete this book? This cannot be undone.")) return
    const { ok, result } = await send(`/api/father/library/${id}`, "DELETE")
    if (!ok) {
      notify(apiError(result, "Could not delete the book."))
      return
    }
    setData((current) => (current ? { ...current, myBooks: (current.myBooks || []).filter((item) => item.id !== id) } : current))
    if (editingBookId === id) setEditingBookId(null)
    notify("Book deleted.", "success")
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

  const { user, profileSlug, items, adminReports = [], myNews = [], myEvents = [], myBooks = [], provinceNews = [] } = data
  const waitingOf = (list: { status: string }[]) => list.filter((item) => item.status !== "published").length
  const publishedOf = (list: { status: string }[]) => list.length - waitingOf(list)
  const counts: Partial<Record<SectionId, number>> = {
    news: myNews.length,
    events: myEvents.length,
    books: myBooks.length,
    gallery: items.gallery.length,
    documents: items.document.length + adminReports.length,
  }

  const waiting = [
    ...myNews.map((item) => ({ kind: "news" as const, label: "Article", id: item.id, title: item.title, status: item.status, date: item.updated_at })),
    ...myEvents.map((item) => ({ kind: "events" as const, label: "Event", id: item.id, title: item.title, status: item.status, date: item.updated_at })),
    ...myBooks.map((item) => ({ kind: "books" as const, label: "Book", id: item.id, title: item.title, status: item.status, date: item.updated_at })),
  ]
    .filter((item) => item.status !== "published")
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
  const recent = [
    ...myNews.map((item) => ({ label: "Article", id: item.id, title: item.title, status: item.status, date: item.published_at, href: `/news/${item.slug}` })),
    ...myEvents.map((item) => ({ label: "Event", id: item.id, title: item.title, status: item.status, date: item.published_at, href: `/events/${item.slug}` })),
    ...myBooks.map((item) => ({ label: "Book", id: item.id, title: item.title, status: item.status, date: item.published_at, href: bookLink(item) })),
  ]
    .filter((item) => item.status === "published")
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 5)

  async function onNewsSubmit(event: FormEvent<HTMLFormElement>, edit?: MyNews | null, fromEvent?: MyEvent) {
    event.preventDefault()
    const formEl = event.currentTarget
    const form = new FormData(formEl)
    const title = String(form.get("title") || "").trim()
    const body = String(form.get("body") || "").trim()
    const excerpt = String(form.get("excerpt") || "").trim() || firstSentence(body)
    const location_text = String(form.get("place") || "").trim()
    const sectionValue = String(form.get("section") || "").trim()
    const coverInput = formEl.elements.namedItem("cover") as HTMLInputElement
    const galleryInput = formEl.elements.namedItem("gallery") as HTMLInputElement
    const coverFile = coverInput.files?.[0]
    if (!title || !excerpt || !body || !location_text || !sectionValue) {
      notify("Please fill every required field.")
      return
    }
    if (!edit && !coverFile && !fromEvent?.image_url) {
      notify("Choose a cover photo.")
      return
    }
    try {
      let image_url = edit?.image_url || fromEvent?.image_url || ""
      let gallery = edit?.gallery || fromEvent?.gallery || []
      const files = [...(coverFile ? [coverFile] : []), ...Array.from(galleryInput.files || [])]
      for (const [index, file] of files.entries()) {
        const src = await uploadFile(file, photoLabel(index, files.length))
        if (file === coverFile) {
          image_url = src
          gallery = [{ src, alt: title, caption: "" }, ...gallery.filter((g) => g.src !== edit?.image_url)]
        } else {
          gallery = [...gallery, { src, alt: title, caption: "" }]
        }
      }
      const ok = await saveNews(
        { title, excerpt, body, location_text, image_url, section: sectionValue, gallery, from_event: fromEvent?.id },
        edit?.id
      )
      if (ok && !edit) formEl.reset()
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save article.")
    }
  }

  async function onEventSubmit(event: FormEvent<HTMLFormElement>, edit?: MyEvent | null) {
    event.preventDefault()
    const formEl = event.currentTarget
    const form = new FormData(formEl)
    const body = String(form.get("body") || "").trim()
    const payload = {
      title: String(form.get("title") || "").trim(),
      excerpt: String(form.get("excerpt") || "").trim() || firstSentence(body),
      location_text: String(form.get("place") || "").trim(),
      event_date: String(form.get("event_date") || "").trim(),
      end_date: String(form.get("end_date") || "").trim(),
      body,
    }
    if (!payload.title || !payload.location_text || !payload.event_date) {
      notify("Please fill in the event name, place and start date.")
      return
    }
    if (!payload.excerpt) {
      notify("Add a short summary or a description.")
      return
    }
    const kept = new Set(form.getAll("keep_photo").map(String))
    const newFiles = Array.from((formEl.elements.namedItem("photos") as HTMLInputElement).files || [])
    let gallery: Photo[] = (edit?.gallery || []).filter((photo) => kept.has(photo.src))
    if (gallery.length + newFiles.length > 24) {
      notify("An event can have up to 24 photos.")
      return
    }
    try {
      for (const [index, file] of newFiles.entries()) {
        gallery = [...gallery, { src: await uploadFile(file, photoLabel(index, newFiles.length)), alt: payload.title, caption: "" }]
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : "Photo upload failed.")
      return
    }
    const ok = await saveEvent({ ...payload, gallery }, edit?.id)
    if (ok && !edit) formEl.reset()
  }

  async function onBookSubmit(event: FormEvent<HTMLFormElement>, edit?: MyBook | null) {
    event.preventDefault()
    const formEl = event.currentTarget
    const form = new FormData(formEl)
    const body = String(form.get("body") || "").trim()
    const payload = {
      title: String(form.get("title") || "").trim(),
      author: String(form.get("author") || "").trim(),
      date_display: String(form.get("date_display") || "").trim(),
      excerpt: String(form.get("excerpt") || "").trim() || firstSentence(body),
      body,
      section: String(form.get("section") || "books"),
      category: String(form.get("category") || ""),
    }
    const pdf = (formEl.elements.namedItem("pdf") as HTMLInputElement).files?.[0]
    const cover = (formEl.elements.namedItem("cover") as HTMLInputElement).files?.[0]
    if (!payload.title || !payload.author) {
      notify("Please add the title and the author.")
      return
    }
    if (payload.section === "libraries" && !payload.category) {
      notify("Choose the library collection.")
      return
    }
    if (!edit && !pdf) {
      notify("Choose the book PDF.")
      return
    }
    if (pdf && (pdf.type !== "application/pdf" || pdf.size > MAX_PDF)) {
      notify(pdf.type !== "application/pdf" ? "The book file must be a PDF." : "The PDF must be 40 MB or smaller.")
      return
    }
    if (cover && (!IMAGE_TYPES.split(",").includes(cover.type) || cover.size > MAX_IMAGE)) {
      notify("The cover must be a JPEG, PNG or WebP image up to 12 MB.")
      return
    }
    let media_url = edit?.media_url || ""
    let image_url = edit?.image_url || ""
    try {
      if (pdf) media_url = await uploadFile(pdf, "Uploading book PDF")
      if (cover) image_url = await uploadFile(cover, "Uploading cover image")
    } catch (err) {
      notify(err instanceof Error ? err.message : "Upload failed.")
      return
    }
    const ok = await saveBook({ ...payload, media_url, image_url }, edit?.id)
    if (ok && !edit) formEl.reset()
  }

  const actionCards = [
    { id: "news" as const, title: "Write an article", text: "Share news from your parish or ministry.", icon: Newspaper },
    { id: "events" as const, title: "Add an event", text: "Put a feast or programme on the calendar.", icon: CalendarDays },
    { id: "books" as const, title: "Submit a book", text: "Upload a book PDF for the Library.", icon: BookOpen },
    { id: "gallery" as const, title: "Upload photos", text: "Add photos from your ministry.", icon: Images },
  ]

  return (
    <div className="min-h-[70vh] bg-[#f3f8fa]">
      {working ? (
        <ProgressIndicator
          label={progress?.label ?? (aiBusy ? "AI is writing your draft…" : "Saving…")}
          percent={progress?.percent ?? null}
        />
      ) : null}
      <Toast key={notice?.id} notice={notice} onClose={clearNotice} />

      <header className="border-b border-[#dce8ee] bg-white">
        <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:pt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 basis-64 items-center gap-3 sm:gap-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[#e7f4f7] ring-2 ring-white shadow-[0_0_0_1px_#dce8ee] sm:size-16">
                {user.photo_url ? (
                  <Image src={user.photo_url} alt="" fill sizes="64px" className="object-cover" unoptimized={isUpload(user.photo_url)} />
                ) : (
                  <span className="flex size-full items-center justify-center font-heading text-xl font-semibold text-[#0f8fa3]">
                    {user.name.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.14em] text-[#5b8594] uppercase">Father dashboard</p>
                <h1 className="font-heading text-lg leading-tight font-semibold break-words text-[#0b4a5c] sm:text-2xl">{user.name}</h1>
                <p className="truncate text-xs text-[#6b8290] sm:text-sm">
                  {user.father_id ? `OMI ${user.father_id}` : "Father"}
                  {user.place ? ` · ${user.place}` : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileSlug ? (
                <Link href={`/leadership/fathers/${profileSlug}`} className={btnGhost}>
                  <ExternalLink className="size-4" /> View my public profile
                </Link>
              ) : null}
              <button type="button" onClick={signOut} className={btnGhost}>
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <StatCard
              icon={<Newspaper className="size-3.5 shrink-0" />}
              label="Articles"
              published={publishedOf(myNews)}
              waiting={waitingOf(myNews)}
              onClick={() => go("news")}
            />
            <StatCard
              icon={<CalendarDays className="size-3.5 shrink-0" />}
              label="Events"
              published={publishedOf(myEvents)}
              waiting={waitingOf(myEvents)}
              onClick={() => go("events")}
            />
            <StatCard
              icon={<BookOpen className="size-3.5 shrink-0" />}
              label="Books"
              published={publishedOf(myBooks)}
              waiting={waitingOf(myBooks)}
              onClick={() => go("books")}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[13.5rem_1fr] lg:gap-6">
        <nav aria-label="Dashboard sections" className="-mx-4 min-w-0 lg:mx-0">
          <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1 lg:sticky lg:top-40 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
            {sections.map(({ id, label, icon: Icon }) => {
              const count = counts[id]
              const active = section === id
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => go(id)}
                  className={cn(
                    "flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-[#0f8fa3]/40 focus-visible:outline-none lg:rounded-lg lg:px-3",
                    active
                      ? "bg-[#0f8fa3] text-white shadow-sm"
                      : "bg-white text-[#0b4a5c] ring-1 ring-[#dce8ee] hover:ring-[#0f8fa3]/50 lg:bg-transparent lg:ring-0 lg:hover:bg-white"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="lg:flex-1 lg:text-left">{label}</span>
                  {count !== undefined ? (
                    <span
                      className={cn(
                        "min-w-5 rounded-full px-1.5 text-center text-[11px] leading-5",
                        active ? "bg-white/20" : "bg-[#e7f4f7] text-[#0f8fa3]"
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </nav>

        <main ref={mainRef} className="min-w-0 scroll-mt-28 rounded-2xl border border-[#dce8ee] bg-white p-4 sm:p-7">
          {section === "overview" ? (
            <div className="space-y-8">
              <SectionShell
                title={`Welcome, ${user.name.split(" ")[0]}`}
                lede="Everything you send is checked by the Province office before it appears on the website."
              >
                <div>
                  <SubHeading>What would you like to do?</SubHeading>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {actionCards.map(({ id, title, text, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => go(id, { create: true })}
                        className="group flex items-center gap-3 rounded-2xl border border-[#dce8ee] bg-[#f8fcfd] p-4 text-left transition hover:border-[#0f8fa3] hover:bg-white focus-visible:ring-2 focus-visible:ring-[#0f8fa3]/40 focus-visible:outline-none xl:flex-col xl:items-start"
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0f8fa3] text-white">
                          <Icon className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-[#0b4a5c]">{title}</span>
                          <span className="block text-xs leading-relaxed text-[#6b8290]">{text}</span>
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-[#8aa3ad] transition group-hover:translate-x-0.5 xl:hidden" />
                      </button>
                    ))}
                  </div>
                </div>
              </SectionShell>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="space-y-3">
                  <SubHeading>Waiting for approval</SubHeading>
                  {waiting.length ? (
                    <ul className="divide-y divide-[#eef4f7] rounded-2xl border border-[#dce8ee]">
                      {waiting.map((item) => (
                        <li key={item.kind + item.id} className="flex items-center gap-3 px-4 py-3">
                          <span className="w-14 shrink-0 text-[11px] font-semibold tracking-wide text-[#8a6500] uppercase">{item.label}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-[#0b4a5c]">{item.title}</span>
                            <span className="text-xs text-[#6b8290]">Sent {shortDate(item.date)}</span>
                          </span>
                          <button type="button" className={btnGhost} onClick={() => go(item.kind, { edit: { kind: item.kind, id: item.id } })}>
                            <Pencil className="size-3.5" /> Edit
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-[#dce8ee] px-4 py-6 text-center text-sm text-[#6b8290]">
                      Nothing waiting. Everything you sent has been reviewed.
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <SubHeading>Recently published</SubHeading>
                  {recent.length ? (
                    <ul className="divide-y divide-[#eef4f7] rounded-2xl border border-[#dce8ee]">
                      {recent.map((item) => (
                        <li key={item.label + item.id}>
                          <Link href={item.href} className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#f8fcfd]">
                            <span className="w-14 shrink-0 text-[11px] font-semibold tracking-wide text-[#0b6b3a] uppercase">{item.label}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-[#0b4a5c]">{item.title}</span>
                              <span className="text-xs text-[#6b8290]">{shortDate(item.date)}</span>
                            </span>
                            <ExternalLink className="size-4 shrink-0 text-[#8aa3ad]" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-[#dce8ee] px-4 py-6 text-center text-sm text-[#6b8290]">
                      Your approved articles, events and books will appear here.
                    </p>
                  )}
                </div>
              </div>

              {adminReports.length ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <SubHeading>From the Province</SubHeading>
                    <button type="button" onClick={() => go("documents")} className="text-sm font-medium text-[#0f8fa3] hover:underline">
                      All documents
                    </button>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {adminReports.slice(0, 2).map((report) => (
                      <li key={report.id}>
                        <a
                          href={report.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-2xl border border-[#dce8ee] px-4 py-3 transition hover:border-[#0f8fa3]"
                        >
                          <FileText className="size-5 shrink-0 text-[#0f8fa3]" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-[#0b4a5c]">{report.title}</span>
                            <span className="text-xs text-[#6b8290]">{shortDate(report.created_at)}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {section === "personal" ? (
            <SectionShell title="Profile" lede="Your account details. Your OMI ID cannot be changed.">
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[#dce8ee] bg-[#f8fcfd] p-4 transition focus-within:ring-2 focus-within:ring-[#0f8fa3]/30 hover:border-[#0f8fa3]">
                <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0f8fa3] text-white">
                  {user.photo_url ? (
                    <Image src={user.photo_url} alt="" fill sizes="64px" className="object-cover" unoptimized={isUpload(user.photo_url)} />
                  ) : (
                    <Camera className="size-6" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-[#0b4a5c]">Portrait</span>
                  <span className="block text-sm text-[#6b8290]">Tap to choose a new photo (JPEG, PNG or WebP).</span>
                </span>
                <input type="file" accept={IMAGE_TYPES} className="sr-only" onChange={(e) => onPortrait(e.target.files?.[0] ?? null)} />
              </label>
              <form onSubmit={saveProfile} className="space-y-4">
                <FormGroup title="Personal details">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" required>
                      <input name="name" required defaultValue={user.name} className={field} />
                    </Field>
                    <Field label="OMI ID">
                      <input disabled value={user.father_id || ""} className={cn(field, "bg-[#f3f8fa] opacity-70")} />
                    </Field>
                    <Field label="Date of birth" required>
                      <input name="date_of_birth" type="date" required defaultValue={dateInput(user.date_of_birth)} className={field} />
                    </Field>
                    <Field label="Place of ministry" optional>
                      <input name="place" defaultValue={user.place || ""} className={field} />
                    </Field>
                    <Field label="Short bio" optional className="sm:col-span-2">
                      <textarea name="bio" rows={3} defaultValue={user.bio || ""} className={field} />
                    </Field>
                  </div>
                </FormGroup>
                <FormGroup title="Contact and sign-in">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email" required>
                      <input name="email" type="email" required defaultValue={user.email} className={field} />
                    </Field>
                    <Field label="Mobile" required>
                      <input name="mobile_number" type="tel" required defaultValue={user.mobile_number || ""} className={field} />
                    </Field>
                    <Field label="New password" optional hint="At least 12 characters. Leave blank to keep your current password." className="sm:col-span-2">
                      <input name="password" type="password" minLength={12} autoComplete="new-password" className={field} />
                    </Field>
                  </div>
                </FormGroup>
                <FormActions>
                  <button type="submit" disabled={working} className={btnPrimary}>
                    Save profile
                  </button>
                </FormActions>
              </form>
            </SectionShell>
          ) : null}

          {section === "news" ? (
            <SectionShell
              title="Articles"
              lede="Write for the Province news. You can edit or delete an article while it waits for approval; published articles are locked."
              action={creating !== "news" && !editingNewsId ? <NewButton label="New article" onClick={() => go("news", { create: true })} /> : null}
            >
              {creating === "news" && !editingNewsId ? (
                <FormCard title="New article">
                  <form onSubmit={(e) => onNewsSubmit(e)} className="space-y-4">
                    <ArticleFields ai={<AiButton busy={aiBusy} disabled={working} onClick={(form) => aiWrite(form, "article")} />} />
                    <FormActions>
                      <button type="submit" disabled={working} className={btnPrimary}>
                        Send for approval
                      </button>
                      <button type="button" className={btnGhost} onClick={() => setCreating(null)}>
                        Cancel
                      </button>
                    </FormActions>
                  </form>
                </FormCard>
              ) : null}

              {myNews.length === 0 && creating !== "news" ? (
                <Empty
                  title="No articles yet"
                  text="Share news from your parish or ministry. The Province office checks it before it appears in News."
                  action={<NewButton label="Write your first article" onClick={() => go("news", { create: true })} />}
                />
              ) : (
                <div className="space-y-3">
                  {myNews.map((item) =>
                    editingNewsId === item.id ? (
                      <FormCard key={item.id} title="Edit article">
                        <form onSubmit={(e) => onNewsSubmit(e, item)} className="space-y-4">
                          <ArticleFields item={item} ai={<AiButton busy={aiBusy} disabled={working} onClick={(form) => aiWrite(form, "article")} label="Rewrite with AI" />} />
                          <FormActions>
                            <button type="submit" disabled={working} className={btnPrimary}>
                              Save changes
                            </button>
                            <button type="button" className={btnGhost} onClick={() => setEditingNewsId(null)}>
                              Cancel
                            </button>
                          </FormActions>
                        </form>
                      </FormCard>
                    ) : (
                      <ItemCard
                        key={item.id}
                        image={item.image_url}
                        icon={<Newspaper className="size-6" />}
                        title={item.title}
                        status={item.status}
                        meta={[newsSectionLabel(item.section), item.location_text, shortDate(item.published_at || item.created_at)].filter(Boolean).join(" · ")}
                        excerpt={item.excerpt}
                        actions={
                          item.status === "published" ? (
                            <Link href={`/news/${item.slug}`} className={btnGhost}>
                              <ExternalLink className="size-3.5" /> View on website
                            </Link>
                          ) : (
                            <>
                              <button type="button" className={btnGhost} onClick={() => go("news", { edit: { kind: "news", id: item.id } })}>
                                <Pencil className="size-3.5" /> Edit
                              </button>
                              <button type="button" className={btnDanger} aria-label={`Delete ${item.title}`} onClick={() => removeNews(item.id)}>
                                <Trash2 className="size-4" /> <span className="sm:sr-only">Delete</span>
                              </button>
                            </>
                          )
                        }
                      />
                    )
                  )}
                </div>
              )}

              {provinceNews.length > 0 ? (
                <div className="space-y-3 border-t border-[#eef4f7] pt-6">
                  <SubHeading>Latest on the website</SubHeading>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {provinceNews.slice(0, 4).map((story) => (
                      <Link
                        key={story.slug}
                        href={`/news/${story.slug}`}
                        className="block rounded-xl border border-[#dce8ee] px-4 py-3 transition hover:border-[#0f8fa3]"
                      >
                        <p className="text-xs text-[#0f8fa3]">{story.date_display || shortDate(story.published_at) || "News"}</p>
                        <p className="mt-0.5 line-clamp-2 font-medium text-[#0b4a5c]">{story.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </SectionShell>
          ) : null}

          {section === "events" ? (
            <SectionShell
              title="Events"
              lede="Put feasts and programmes on the Province calendar, with photos. Once an event is approved you can turn it into a news article."
              action={creating !== "events" && !editingEventId ? <NewButton label="New event" onClick={() => go("events", { create: true })} /> : null}
            >
              {creating === "events" && !editingEventId ? (
                <FormCard title="New event">
                  <form onSubmit={(e) => onEventSubmit(e)} className="space-y-4">
                    <EventFields ai={<AiButton busy={aiBusy} disabled={working} onClick={(form) => aiWrite(form, "event")} />} />
                    <FormActions>
                      <button type="submit" disabled={working} className={btnPrimary}>
                        Send for approval
                      </button>
                      <button type="button" className={btnGhost} onClick={() => setCreating(null)}>
                        Cancel
                      </button>
                    </FormActions>
                  </form>
                </FormCard>
              ) : null}

              {myEvents.length === 0 && creating !== "events" ? (
                <Empty
                  title="No events yet"
                  text="Add a feast, retreat or programme. It appears on the calendar once the Province office approves it."
                  action={<NewButton label="Add your first event" onClick={() => go("events", { create: true })} />}
                />
              ) : (
                <div className="space-y-3">
                  {myEvents.map((item) => {
                    const article = myNews.find((story) => story.from_event === item.id)
                    if (editingEventId === item.id) {
                      return (
                        <FormCard key={item.id} title="Edit event">
                          <form onSubmit={(e) => onEventSubmit(e, item)} className="space-y-4">
                            <EventFields item={item} ai={<AiButton busy={aiBusy} disabled={working} onClick={(form) => aiWrite(form, "event")} />} />
                            <FormActions>
                              <button type="submit" disabled={working} className={btnPrimary}>
                                Save changes
                              </button>
                              <button type="button" className={btnGhost} onClick={() => setEditingEventId(null)}>
                                Cancel
                              </button>
                            </FormActions>
                          </form>
                        </FormCard>
                      )
                    }
                    return (
                      <ItemCard
                        key={item.id}
                        image={item.image_url}
                        icon={<CalendarDays className="size-6" />}
                        title={item.title}
                        status={item.status}
                        meta={[
                          item.location_text,
                          item.event_date ? shortDate(item.event_date) + (item.end_date ? ` – ${shortDate(item.end_date)}` : "") : "",
                          item.gallery?.length ? `${item.gallery.length} photo${item.gallery.length > 1 ? "s" : ""}` : "",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                        excerpt={item.excerpt}
                        actions={
                          item.status === "published" ? (
                            <>
                              <Link href={`/events/${item.slug}`} className={btnGhost}>
                                <ExternalLink className="size-3.5" /> View on website
                              </Link>
                              {article ? (
                                article.status === "published" ? (
                                  <Link href={`/news/${article.slug}`} className="text-sm font-semibold text-[#0b6b3a] hover:underline">
                                    Article published
                                  </Link>
                                ) : (
                                  <span className="text-sm font-semibold text-[#8a6500]">Article waiting for approval</span>
                                )
                              ) : articleFromEventId !== item.id ? (
                                <button type="button" className={btnPrimary} onClick={() => setArticleFromEventId(item.id)}>
                                  <Newspaper className="size-4" /> Publish as article
                                </button>
                              ) : null}
                            </>
                          ) : (
                            <>
                              <button type="button" className={btnGhost} onClick={() => go("events", { edit: { kind: "events", id: item.id } })}>
                                <Pencil className="size-3.5" /> Edit
                              </button>
                              <button type="button" className={btnDanger} aria-label={`Delete ${item.title}`} onClick={() => removeEvent(item.id)}>
                                <Trash2 className="size-4" /> <span className="sm:sr-only">Delete</span>
                              </button>
                            </>
                          )
                        }
                      >
                        {articleFromEventId === item.id && !article ? (
                          <div className="mt-4">
                            <FormCard title="New article from this event">
                              <p className="-mt-2 mb-4 px-1 text-sm text-[#6b8290]">
                                The form is filled from the event. Press “Write with AI” for a news-style draft, then edit it. The Province office approves it before it appears in News and on your profile.
                              </p>
                              <form
                                onSubmit={(e) => onNewsSubmit(e, null, item)}
                                data-event-date={dateInput(item.event_date)}
                                data-end-date={dateInput(item.end_date)}
                                className="space-y-4"
                              >
                                <ArticleFields fromEvent={item} ai={<AiButton busy={aiBusy} disabled={working} onClick={(form) => aiWrite(form, "article")} />} />
                                <FormActions>
                                  <button type="submit" disabled={working} className={btnPrimary}>
                                    Send for approval
                                  </button>
                                  <button type="button" className={btnGhost} onClick={() => setArticleFromEventId(null)}>
                                    Cancel
                                  </button>
                                </FormActions>
                              </form>
                            </FormCard>
                          </div>
                        ) : null}
                      </ItemCard>
                    )
                  })}
                </div>
              )}
            </SectionShell>
          ) : null}

          {section === "books" ? (
            <SectionShell
              title="Books"
              lede="Upload a book as a PDF for the Province Library, as a new release or in one of the library collections. The Province office approves it before it appears."
              action={creating !== "books" && !editingBookId ? <NewButton label="New book" onClick={() => go("books", { create: true })} /> : null}
            >
              {creating === "books" && !editingBookId ? (
                <FormCard title="Submit a book">
                  <form onSubmit={(e) => onBookSubmit(e)} className="space-y-4">
                    <BookFields defaultAuthor={user.name} libraryCategories={libraryCategories} ai={<AiButton busy={aiBusy} disabled={working} onClick={(form) => aiWrite(form, "book")} />} />
                    <FormActions>
                      <button type="submit" disabled={working} className={btnPrimary}>
                        Send for approval
                      </button>
                      <button type="button" className={btnGhost} onClick={() => setCreating(null)}>
                        Cancel
                      </button>
                    </FormActions>
                  </form>
                </FormCard>
              ) : null}

              {myBooks.length === 0 && creating !== "books" ? (
                <Empty
                  title="No books yet"
                  text="Share a book you have written or edited. Choose whether it is a new release or part of a library collection."
                  action={<NewButton label="Submit your first book" onClick={() => go("books", { create: true })} />}
                />
              ) : (
                <div className="space-y-3">
                  {myBooks.map((item) =>
                    editingBookId === item.id ? (
                      <FormCard key={item.id} title="Edit book">
                        <form onSubmit={(e) => onBookSubmit(e, item)} className="space-y-4">
                          <BookFields item={item} defaultAuthor={user.name} libraryCategories={libraryCategories} ai={<AiButton busy={aiBusy} disabled={working} onClick={(form) => aiWrite(form, "book")} />} />
                          <FormActions>
                            <button type="submit" disabled={working} className={btnPrimary}>
                              Save changes
                            </button>
                            <button type="button" className={btnGhost} onClick={() => setEditingBookId(null)}>
                              Cancel
                            </button>
                          </FormActions>
                        </form>
                      </FormCard>
                    ) : (
                      <ItemCard
                        key={item.id}
                        image={item.image_url}
                        icon={<BookOpen className="size-6" />}
                        title={item.title}
                        status={item.status}
                        meta={[item.author ? `by ${item.author}` : "", item.date_display, bookPlace(item, libraryCategories)].filter(Boolean).join(" · ")}
                        excerpt={item.excerpt}
                        actions={
                          <>
                            {item.media_url ? (
                              <a href={item.media_url} target="_blank" rel="noreferrer" className={btnGhost}>
                                <FileText className="size-3.5" /> Open PDF
                              </a>
                            ) : null}
                            {item.status === "published" ? (
                              <Link href={bookLink(item)} className={btnGhost}>
                                <ExternalLink className="size-3.5" /> View in Library
                              </Link>
                            ) : (
                              <>
                                <button type="button" className={btnGhost} onClick={() => go("books", { edit: { kind: "books", id: item.id } })}>
                                  <Pencil className="size-3.5" /> Edit
                                </button>
                                <button type="button" className={btnDanger} aria-label={`Delete ${item.title}`} onClick={() => removeBook(item.id)}>
                                  <Trash2 className="size-4" /> <span className="sm:sr-only">Delete</span>
                                </button>
                              </>
                            )}
                          </>
                        }
                      />
                    )
                  )}
                </div>
              )}
            </SectionShell>
          ) : null}

          {section === "gallery" ? (
            <SectionShell
              title="Gallery"
              lede="Photos from your ministry. You can rename or remove them at any time."
              action={creating !== "gallery" ? <NewButton label="Add photo" onClick={() => go("gallery", { create: true })} /> : null}
            >
              {creating === "gallery" ? (
                <FormCard title="Add a photo">
                  <form
                    className="space-y-4"
                    onSubmit={async (event) => {
                      event.preventDefault()
                      const formEl = event.currentTarget
                      const form = new FormData(formEl)
                      const title = String(form.get("title") || "").trim()
                      const file = (formEl.elements.namedItem("file") as HTMLInputElement).files?.[0]
                      if (!title || !file) return
                      try {
                        const url = await uploadFile(file, "Uploading photo")
                        if (await addItem("gallery", { title, file_url: url })) {
                          formEl.reset()
                          setCreating(null)
                        }
                      } catch (err) {
                        notify(err instanceof Error ? err.message : "Upload failed.")
                      }
                    }}
                  >
                    <FormGroup title="Photo">
                      <Field label="Photo title" required>
                        <input name="title" required className={field} />
                      </Field>
                      <FileDrop name="file" label="Photo" accept={IMAGE_TYPES} required hint="JPEG, PNG or WebP, up to 12 MB." />
                    </FormGroup>
                    <FormActions>
                      <button type="submit" disabled={working} className={btnPrimary}>
                        <Upload className="size-4" /> Add photo
                      </button>
                      <button type="button" className={btnGhost} onClick={() => setCreating(null)}>
                        Cancel
                      </button>
                    </FormActions>
                  </form>
                </FormCard>
              ) : null}
              {items.gallery.length === 0 && creating !== "gallery" ? (
                <Empty
                  title="No photos yet"
                  text="Add photos from your ministry to keep them in one place."
                  action={<NewButton label="Add your first photo" onClick={() => go("gallery", { create: true })} />}
                />
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.gallery.map((item) => (
                    <li key={item.id} className="overflow-hidden rounded-2xl border border-[#dce8ee] bg-white">
                      {item.file_url ? (
                        <div className="relative aspect-[4/3] bg-[#f8fcfd]">
                          <Image src={item.file_url} alt={item.title} fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover" unoptimized={isUpload(item.file_url)} />
                        </div>
                      ) : null}
                      <div className="p-3">
                        {editingItemId === item.id ? (
                          <form
                            className="space-y-2"
                            onSubmit={async (event) => {
                              event.preventDefault()
                              const form = new FormData(event.currentTarget)
                              await saveItem(item.id, "gallery", { title: String(form.get("title") || "").trim() })
                            }}
                          >
                            <Field label="Photo title" required>
                              <input name="title" required defaultValue={item.title} className={field} />
                            </Field>
                            <div className="flex gap-2">
                              <button type="submit" disabled={working} className={btnPrimary}>
                                Save
                              </button>
                              <button type="button" className={btnGhost} onClick={() => setEditingItemId(null)}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <p className="min-w-0 truncate text-sm font-medium text-[#0b4a5c]">{item.title}</p>
                            <div className="flex shrink-0 gap-1">
                              <button type="button" className={btnGhost} aria-label={`Rename ${item.title}`} onClick={() => setEditingItemId(item.id)}>
                                <Pencil className="size-4" />
                              </button>
                              <button type="button" className={btnDanger} aria-label={`Remove ${item.title}`} onClick={() => removeItem(item.id, "gallery")}>
                                <Trash2 className="size-4" />
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

          {section === "documents" ? (
            <SectionShell
              title="Documents"
              lede="Reports the Province sends you, and your own files. You can rename or remove your files at any time."
              action={creating !== "documents" ? <NewButton label="Add document" onClick={() => go("documents", { create: true })} /> : null}
            >
              <div className="space-y-3">
                <SubHeading>From the Province</SubHeading>
                {adminReports.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[#dce8ee] px-4 py-6 text-center text-sm text-[#6b8290]">
                    No reports from the Province yet.
                  </p>
                ) : (
                  adminReports.map((report) => (
                    <ItemCard
                      key={report.id}
                      icon={<FileText className="size-6" />}
                      title={report.title}
                      meta={[shortDate(report.created_at), report.sent_by].filter(Boolean).join(" · ")}
                      excerpt={report.body}
                      actions={
                        <a href={report.file_url} target="_blank" rel="noreferrer" className={btnGhost}>
                          <ExternalLink className="size-3.5" /> Open
                        </a>
                      }
                    />
                  ))
                )}
              </div>

              <div className="space-y-3 border-t border-[#eef4f7] pt-6">
                <SubHeading>My documents</SubHeading>
                {creating === "documents" ? (
                  <FormCard title="Add a document">
                    <form
                      className="space-y-4"
                      onSubmit={async (event) => {
                        event.preventDefault()
                        const formEl = event.currentTarget
                        const form = new FormData(formEl)
                        const title = String(form.get("title") || "").trim()
                        const file = (formEl.elements.namedItem("file") as HTMLInputElement).files?.[0]
                        if (!title || !file) return
                        try {
                          const url = await uploadFile(file, "Uploading document")
                          if (await addItem("document", { title, file_url: url, body: file.name })) {
                            formEl.reset()
                            setCreating(null)
                          }
                        } catch (err) {
                          notify(err instanceof Error ? err.message : "Upload failed.")
                        }
                      }}
                    >
                      <FormGroup title="Document">
                        <Field label="Title" required>
                          <input name="title" required className={field} />
                        </Field>
                        <FileDrop
                          name="file"
                          label="File"
                          accept={`application/pdf,${IMAGE_TYPES}`}
                          required
                          hint="PDF (up to 40 MB) or an image (up to 12 MB)."
                        />
                      </FormGroup>
                      <FormActions>
                        <button type="submit" disabled={working} className={btnPrimary}>
                          <Upload className="size-4" /> Add document
                        </button>
                        <button type="button" className={btnGhost} onClick={() => setCreating(null)}>
                          Cancel
                        </button>
                      </FormActions>
                    </form>
                  </FormCard>
                ) : null}
                {items.document.length === 0 && creating !== "documents" ? (
                  <p className="rounded-2xl border border-dashed border-[#dce8ee] px-4 py-6 text-center text-sm text-[#6b8290]">
                    No personal documents yet.
                  </p>
                ) : (
                  items.document.map((item) =>
                    editingItemId === item.id ? (
                      <FormCard key={item.id} title="Edit document">
                        <form
                          className="space-y-4"
                          onSubmit={async (event) => {
                            event.preventDefault()
                            const form = new FormData(event.currentTarget)
                            await saveItem(item.id, "document", {
                              title: String(form.get("title") || "").trim(),
                              body: String(form.get("body") || "").trim(),
                            })
                          }}
                        >
                          <Field label="Title" required>
                            <input name="title" required defaultValue={item.title} className={field} />
                          </Field>
                          <Field label="Note" optional>
                            <input name="body" defaultValue={item.body} className={field} />
                          </Field>
                          <FormActions>
                            <button type="submit" disabled={working} className={btnPrimary}>
                              Save
                            </button>
                            <button type="button" className={btnGhost} onClick={() => setEditingItemId(null)}>
                              Cancel
                            </button>
                          </FormActions>
                        </form>
                      </FormCard>
                    ) : (
                      <ItemCard
                        key={item.id}
                        icon={<FileText className="size-6" />}
                        title={item.title}
                        meta={[shortDate(item.created_at), item.body].filter(Boolean).join(" · ")}
                        actions={
                          <>
                            {item.file_url ? (
                              <a href={item.file_url} target="_blank" rel="noreferrer" className={btnGhost}>
                                <ExternalLink className="size-3.5" /> Open
                              </a>
                            ) : null}
                            <button type="button" className={btnGhost} onClick={() => setEditingItemId(item.id)}>
                              <Pencil className="size-3.5" /> Edit
                            </button>
                            <button type="button" className={btnDanger} aria-label={`Remove ${item.title}`} onClick={() => removeItem(item.id, "document")}>
                              <Trash2 className="size-4" /> <span className="sm:sr-only">Remove</span>
                            </button>
                          </>
                        }
                      />
                    )
                  )
                )}
              </div>
            </SectionShell>
          ) : null}
        </main>
      </div>
    </div>
  )
}
