"use client"

import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const reasons = [
  { label: "General enquiries", category: "general" },
  { label: "Vocations", category: "vocations" },
  { label: "Parish enquiries", category: "parish" },
  { label: "Publications / media", category: "media" },
  { label: "Mission support", category: "support" },
  { label: "Safeguarding / pastoral concerns", category: "safeguarding" },
] as const

const labelClass = "text-xs font-bold tracking-[0.14em] text-[#0e98ac] uppercase"
const fieldClass =
  "h-12 w-full rounded-xl border border-[#d9eef3] bg-[#f8fdfe] px-4 text-sm text-[#023e8a] outline-none transition focus-visible:border-[#17b3c6] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#17b3c6]/15"

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; message: string } | { kind: "error"; message: string }

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus({ kind: "sending" })
    try {
      const response = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          phone: String(data.get("phone") ?? "").trim(),
          category: String(data.get("reason") ?? "general"),
          message: String(data.get("message") ?? "").trim(),
          privacy_consent: data.get("consent") === "on",
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        const message =
          response.status === 429
            ? "Too many messages were sent from this connection. Please try again later."
            : "Please check your name, email and a message of at least 10 characters, then try again."
        setStatus({ kind: "error", message })
        return
      }
      form.reset()
      setStatus({ kind: "sent", message: result.message ?? "Your enquiry has been received." })
    } catch {
      setStatus({ kind: "error", message: "The message could not be sent. Please check your connection and try again." })
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name" className={labelClass}>
            Name
          </Label>
          <Input id="name" name="name" required minLength={2} autoComplete="name" className={fieldClass} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className={labelClass}>
            Email
          </Label>
          <Input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone" className={labelClass}>
            Phone (optional)
          </Label>
          <Input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={fieldClass} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reason" className={labelClass}>
            Reason for enquiry
          </Label>
          <select id="reason" name="reason" required className={`${fieldClass} px-3`}>
            {reasons.map((reason) => (
              <option key={reason.category} value={reason.category}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message" className={labelClass}>
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="rounded-xl border-[#d9eef3] bg-[#f8fdfe] px-4 py-3 text-[#023e8a] transition focus-visible:border-[#17b3c6] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#17b3c6]/15"
        />
      </div>
      <label className="flex items-start gap-3 text-sm leading-5 text-[#3d4b59]">
        <input name="consent" type="checkbox" required className="mt-0.5 size-4 accent-[#0e98ac]" />
        I agree that the Province office may store these details to answer my enquiry.
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          disabled={status.kind === "sending"}
          className="h-12 rounded-full bg-gradient-to-r from-[#17b3c6] to-[#06394a] px-8 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(6,57,74,0.9)] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          {status.kind === "sending" ? "Sending…" : "Send enquiry"}
        </Button>
        {status.kind === "sent" || status.kind === "error" ? (
          <p
            role="status"
            className={
              status.kind === "error"
                ? "rounded-xl bg-[#fdecea] px-4 py-2 text-sm text-[#b42318]"
                : "rounded-xl bg-[#e6f7ef] px-4 py-2 text-sm text-[#146c43]"
            }
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}
