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
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required minLength={2} autoComplete="name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="reason">Reason for enquiry</Label>
        <select
          id="reason"
          name="reason"
          required
          className="h-10 rounded-lg border border-input bg-white px-3 text-sm"
        >
          {reasons.map((reason) => (
            <option key={reason.category} value={reason.category}>
              {reason.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required minLength={10} rows={5} />
      </div>
      <label className="flex items-start gap-2 text-sm leading-5">
        <input name="consent" type="checkbox" required className="mt-1" />
        I agree that the Province office may store these details to answer my enquiry.
      </label>
      <Button type="submit" className="w-fit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send enquiry"}
      </Button>
      {status.kind === "sent" || status.kind === "error" ? (
        <p role="status" className={status.kind === "error" ? "text-sm text-[#b42318]" : "text-sm"}>
          {status.message}
        </p>
      ) : null}
    </form>
  )
}
