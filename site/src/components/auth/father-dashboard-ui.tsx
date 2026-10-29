"use client"

import Image from "next/image"
import { CheckCircle2, CircleAlert, FileText, Info, Plus, Sparkles, UploadCloud, X } from "lucide-react"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

import { isUpload } from "@/content/site-info"
import { cn } from "cn"

export const field =
  "mt-1.5 block w-full rounded-lg border border-[#dce8ee] bg-white px-3 py-2.5 text-base text-[#0b4a5c] outline-none placeholder:text-[#9aafb8] focus:border-[#0f8fa3] focus:ring-2 focus:ring-[#0f8fa3]/15 sm:text-sm"
export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0f8fa3] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] focus-visible:ring-2 focus-visible:ring-[#0f8fa3]/40 focus-visible:outline-none disabled:opacity-55 sm:min-h-10"
export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#dce8ee] bg-white px-3 py-2 text-sm font-medium text-[#0b4a5c] transition hover:border-[#0f8fa3] hover:text-[#0f8fa3] focus-visible:ring-2 focus-visible:ring-[#0f8fa3]/40 focus-visible:outline-none disabled:opacity-55 sm:min-h-10"
export const btnDanger =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#b42318] transition hover:bg-[#fff5f5] focus-visible:ring-2 focus-visible:ring-[#b42318]/30 focus-visible:outline-none disabled:opacity-55 sm:min-h-10 sm:min-w-10"
const btnAi =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[#f3d27a] bg-[#fff8e1] px-3 py-2 text-sm font-semibold text-[#8a6500] transition hover:bg-[#ffefc0] focus-visible:ring-2 focus-visible:ring-[#f3d27a] focus-visible:outline-none disabled:opacity-55 sm:min-h-10"

export function AiButton({
  busy,
  disabled,
  onClick,
  label = "Write with AI",
}: {
  busy: boolean
  disabled?: boolean
  onClick: (form: HTMLFormElement | null) => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={(e) => onClick(e.currentTarget.form)}
      disabled={busy || disabled}
      title="Optional: turns your notes into full paragraphs. You can edit everything afterwards."
      className={btnAi}
    >
      <Sparkles className="size-4" />
      {busy ? "Writing…" : label}
      {busy ? null : <span className="font-normal opacity-75">(optional)</span>}
    </button>
  )
}

/** Fallback summary when the father leaves it empty: the first sentence of the description. */
export function firstSentence(text: string) {
  const flat = text.replace(/\s+/g, " ").trim()
  const sentence = flat.match(/^.+?[.!?](?=\s|$)/)?.[0] || flat
  return sentence.length > 200 ? `${sentence.slice(0, 197).replace(/\s\S*$/, "")}…` : sentence
}

export function dateInput(value: string | null | undefined) {
  return value ? String(value).slice(0, 10) : ""
}

export function shortDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""
}

export function fileSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function ProgressIndicator({ label, percent }: { label: string; percent: number | null }) {
  return createPortal(
    <>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed inset-x-0 top-0 z-[200] h-1 overflow-hidden bg-[#0f8fa3]/15"
      >
        {percent === null ? (
          <div className="progress-line-indeterminate h-full w-1/3 bg-[#0f8fa3]" />
        ) : (
          <div className="h-full bg-[#0f8fa3] transition-[width] duration-200" style={{ width: `${percent}%` }} />
        )}
      </div>
      <div
        aria-live="polite"
        className="fixed inset-x-4 bottom-4 z-[200] mx-auto max-w-sm rounded-xl bg-white p-3 shadow-[0_12px_40px_-12px_rgba(11,74,92,0.45)] ring-1 ring-[#dce8ee]"
      >
        <div className="flex items-center justify-between gap-3 text-sm font-medium text-[#0b4a5c]">
          <span className="truncate">{label}</span>
          {percent !== null ? <span className="shrink-0 tabular-nums text-[#0f8fa3]">{percent}%</span> : null}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e7f4f7]">
          {percent === null ? (
            <div className="progress-line-indeterminate h-full w-1/3 rounded-full bg-[#0f8fa3]" />
          ) : (
            <div className="h-full rounded-full bg-[#0f8fa3] transition-[width] duration-200" style={{ width: `${percent}%` }} />
          )}
        </div>
      </div>
    </>,
    document.body
  )
}

export type NoticeTone = "success" | "error" | "info"
export type Notice = { text: string; tone: NoticeTone; id: number }

/** Success messages hide themselves; errors and AI notes stay until closed. */
export function Toast({ notice, onClose }: { notice: Notice | null; onClose: () => void }) {
  useEffect(() => {
    if (notice?.tone !== "success") return
    const timer = setTimeout(onClose, 4500)
    return () => clearTimeout(timer)
  }, [notice, onClose])
  if (!notice) return null
  const Icon = notice.tone === "success" ? CheckCircle2 : notice.tone === "error" ? CircleAlert : Info
  return createPortal(
    <div className="pointer-events-none fixed inset-x-3 top-[6.75rem] z-[190] flex justify-center sm:top-28 lg:top-40">
      <div
        role={notice.tone === "error" ? "alert" : "status"}
        className={cn(
          "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-[0_16px_40px_-16px_rgba(11,74,92,0.5)] ring-1",
          notice.tone === "success" && "bg-[#effaf4] text-[#0b5b33] ring-[#bfe8d0]",
          notice.tone === "error" && "bg-[#fff5f4] text-[#9b1c13] ring-[#f6c9c4]",
          notice.tone === "info" && "bg-white text-[#0b4a5c] ring-[#cfe6ee]"
        )}
      >
        <Icon className="mt-0.5 size-4 shrink-0" />
        <p className="min-w-0 flex-1 leading-relaxed">{notice.text}</p>
        <button type="button" onClick={onClose} aria-label="Close message" className="-m-1.5 rounded-md p-1.5 opacity-70 hover:opacity-100">
          <X className="size-4" />
        </button>
      </div>
    </div>,
    document.body
  )
}

export function StatusPill({ status }: { status: string }) {
  const published = status === "published"
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        published ? "bg-[#e6f7ef] text-[#0b6b3a]" : "bg-[#fff6dc] text-[#8a6500]"
      )}
    >
      <span className={cn("size-1.5 rounded-full", published ? "bg-[#12a15b]" : "bg-[#e0a800]")} />
      {published ? "Published" : "Waiting for approval"}
    </span>
  )
}

export function SectionShell({
  title,
  lede,
  action,
  children,
}: {
  title: string
  lede: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1 basis-60">
          <h2 className="font-heading text-xl font-semibold text-[#0b4a5c] sm:text-2xl">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#6b8290]">{lede}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export function NewButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={btnPrimary}>
      <Plus className="size-4" /> {label}
    </button>
  )
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfe2ea] bg-[#f8fcfd] px-5 py-10 text-center">
      <p className="font-heading text-base font-semibold text-[#0b4a5c]">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-[#6b8290]">{text}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold tracking-[0.14em] text-[#8aa3ad] uppercase">{children}</p>
}

/** A labelled form field; the label wraps the control so it is tied to it. */
export function Field({
  label,
  required,
  optional,
  hint,
  className,
  children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  hint?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-[#0b4a5c]">
        {label}
        {required ? <span className="text-[#b42318]"> *</span> : null}
        {optional ? <span className="font-normal text-[#8aa3ad]"> (optional)</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs leading-relaxed text-[#6b8290]">{hint}</span> : null}
    </label>
  )
}

/** Card that groups related fields inside a form. */
export function FormGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-[#e3eef2] bg-white p-4 sm:p-5">
      <legend className="px-1 text-xs font-semibold tracking-[0.14em] text-[#5b8594] uppercase">{title}</legend>
      {children}
    </fieldset>
  )
}

export function FormCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#d5e8ef] bg-[#f6fbfc] p-3 sm:p-5">
      {title ? <p className="mb-4 px-1 font-heading text-lg font-semibold text-[#0b4a5c]">{title}</p> : null}
      {children}
    </div>
  )
}

/** Submit row; sticks to the bottom of the screen on phones so the button is always in reach. */
export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-3 flex flex-wrap items-center gap-2 border-t border-[#e3eef2] bg-[#f6fbfc]/95 px-3 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:backdrop-blur-none">
      {children}
    </div>
  )
}

type Picked = { name: string; size: number; preview?: string }

/** Drop-zone file input: the real input covers the box so click and drag-and-drop both work. */
export function FileDrop({
  name,
  label,
  accept,
  multiple,
  required,
  optional,
  hint,
  current,
}: {
  name: string
  label: string
  accept: string
  multiple?: boolean
  required?: boolean
  optional?: boolean
  hint?: string
  current?: ReactNode
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [picked, setPicked] = useState<Picked[]>([])
  const [over, setOver] = useState(false)

  useEffect(() => {
    const form = input.current?.form
    if (!form) return
    const clear = () => setPicked([])
    form.addEventListener("reset", clear)
    return () => form.removeEventListener("reset", clear)
  }, [])

  useEffect(
    () => () => {
      for (const file of picked) if (file.preview) URL.revokeObjectURL(file.preview)
    },
    [picked]
  )

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-[#0b4a5c]">
        {label}
        {required ? <span className="text-[#b42318]"> *</span> : null}
        {optional ? <span className="font-normal text-[#8aa3ad]"> (optional)</span> : null}
      </label>
      {current ? <div className="mt-1.5">{current}</div> : null}
      <div
        className={cn(
          "relative mt-1.5 flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-5 text-center transition focus-within:border-[#0f8fa3] focus-within:ring-2 focus-within:ring-[#0f8fa3]/15",
          over ? "border-[#0f8fa3] bg-[#e9f7fa]" : "border-[#cfe2ea] bg-white hover:border-[#0f8fa3]/60"
        )}
      >
        <UploadCloud className="size-6 text-[#0f8fa3]" aria-hidden="true" />
        <p className="text-sm font-medium text-[#0b4a5c]">
          {picked.length ? "Choose different file" + (multiple ? "s" : "") : multiple ? "Choose files or drag them here" : "Choose a file or drag it here"}
        </p>
        {hint ? <p className="text-xs text-[#6b8290]">{hint}</p> : null}
        <input
          ref={input}
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          onDragEnter={() => setOver(true)}
          onDragLeave={() => setOver(false)}
          onDrop={() => setOver(false)}
          onChange={(e) => {
            setOver(false)
            setPicked(
              Array.from(e.target.files || []).map((file) => ({
                name: file.name,
                size: file.size,
                preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
              }))
            )
          }}
        />
      </div>
      {picked.length ? (
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {picked.map((file) => (
            <li key={file.name + file.size} className="flex min-w-0 items-center gap-2.5 rounded-lg bg-white px-2.5 py-2 ring-1 ring-[#e3eef2]">
              {file.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.preview} alt="" className="size-10 shrink-0 rounded-md object-cover" />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#e7f4f7] text-[#0f8fa3]">
                  <FileText className="size-5" />
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm text-[#0b4a5c]">{file.name}</span>
                <span className="text-xs text-[#6b8290]">{fileSize(file.size)}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/** One submission in a list: thumbnail, title, meta line, status and actions. */
export function ItemCard({
  image,
  icon,
  title,
  meta,
  status,
  excerpt,
  actions,
  children,
}: {
  image?: string | null
  icon: ReactNode
  title: string
  meta?: ReactNode
  status?: string
  excerpt?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#dce8ee] bg-white p-3 sm:p-4">
      <div className="flex gap-3 sm:gap-4">
        <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e7f4f7] text-[#0f8fa3] ring-1 ring-[#dce8ee] sm:size-20">
          {image ? <Image src={image} alt="" fill sizes="80px" className="object-cover" unoptimized={isUpload(image)} /> : icon}
        </span>
        <div className="min-w-0 flex-1">
          {status ? <StatusPill status={status} /> : null}
          <p className="mt-1 font-medium leading-snug break-words text-[#0b4a5c]">{title}</p>
          {meta ? <p className="mt-0.5 text-xs leading-relaxed text-[#6b8290]">{meta}</p> : null}
          {excerpt ? <p className="mt-1 line-clamp-2 text-sm text-[#6b8290]">{excerpt}</p> : null}
        </div>
      </div>
      {actions ? <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#eef4f7] pt-3">{actions}</div> : null}
      {children}
    </div>
  )
}
