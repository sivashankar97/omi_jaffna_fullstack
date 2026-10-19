"use client"

import { useState } from "react"
import { Check, Link2 } from "lucide-react"

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const open = (base: string) => {
    const url = encodeURIComponent(window.location.href)
    window.open(`${base}${url}`, "_blank", "noopener,noreferrer")
  }

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const button =
    "inline-flex h-9 items-center gap-2 rounded-full border border-[#d5dee6] bg-white px-3.5 text-xs font-semibold text-[#0a5062] transition hover:-translate-y-0.5 hover:border-[#17b3c6] hover:bg-[#f4fbfd]"

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-bold tracking-[0.18em] text-[#6b7a88] uppercase">Share</span>
      <button type="button" className={button} onClick={() => open("https://www.facebook.com/sharer/sharer.php?u=")}>
        Facebook
      </button>
      <button
        type="button"
        className={button}
        onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${title} `)}`)}
      >
        WhatsApp
      </button>
      <button type="button" className={button} onClick={copy}>
        {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  )
}
