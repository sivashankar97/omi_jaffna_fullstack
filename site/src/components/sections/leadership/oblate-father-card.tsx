"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "cn"

export type PriestCardProps = {
  name: string
  place?: string
  image?: string
  className?: string
}

/**
 * Splits a full name like "Rev. Fr. Gnanamuthu Wenceslaus OMI" or "Rev. Fr. G. Wenceslaus"
 * into a title line ("Rev. Fr." / "Rev. Fr. G.") and a name line ("Wenceslaus").
 */
export function parsePriestName(fullName: string): { prefix: string; name: string } {
  const cleaned = (fullName || "")
    .replace(/\s*,?\s*\b(OMI|OMILs|O\.M\.I\.)\b/gi, "")
    .trim()

  const prefixMatch = cleaned.match(
    /^(Very\s+Rev\.?\s*Fr\.?|Rev\.?\s*Fr\.?|Rev\.?\s*Bro\.?|Fr\.?|Bro\.?)\s*/i
  )
  let prefix = prefixMatch ? prefixMatch[1].replace(/Rev\.?Fr\.?/i, "Rev. Fr.").trim() : "Rev. Fr."
  let rest = prefixMatch ? cleaned.slice(prefixMatch[0].length).trim() : cleaned

  // Check if rest starts with initials like "G.", "G", "S. M.", "P."
  const initialsMatch = rest.match(/^(([A-Z]\.?\s*)+)\s+([A-Za-z].*)$/)
  if (initialsMatch) {
    const initials = initialsMatch[1].trim()
    prefix = `${prefix} ${initials}`
    rest = initialsMatch[3].trim()
  } else {
    // If the name is "Gnanamuthu Wenceslaus", check if the last word is the common call-name
    const words = rest.split(/\s+/)
    if (words.length === 2 && words[0].length <= 2) {
      prefix = `${prefix} ${words[0]}`
      rest = words[1]
    }
  }

  return { prefix, name: rest || fullName }
}

function getInitials(name: string): string {
  const parts = name
    .replace(/\b(Rev|Fr|Bro|OMI|OMILs)\b/gi, "")
    .replace(/[.,]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return "OMI"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Vector background graphic reproducing the signature Oblate card style:
 * 3 vibrant cyan stripes, white dividers, curved concentric outline rings,
 * and a bottom-right curved cyan accent.
 */
function CardVectorBackground() {
  return (
    <svg
      viewBox="0 0 340 455"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full pointer-events-none select-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Pure White Base */}
      <rect width="340" height="455" fill="#ffffff" />

      {/* Vertical Cyan Stripe 1 (Inner) */}
      <rect x="166" y="0" width="32" height="455" fill="#0bd4f4" />

      {/* Vertical Cyan Stripe 2 (Middle) */}
      <rect x="208" y="0" width="26" height="455" fill="#13a6c8" />

      {/* Vertical Cyan Stripe 3 (Outer) */}
      <rect x="240" y="0" width="58" height="455" fill="#16a5ca" />

      {/* Concentric Curved Arc Outlines */}
      <path
        d="M 60 455 A 320 320 0 0 1 340 180"
        stroke="#38bdf8"
        strokeWidth="1.5"
        opacity="0.45"
        fill="none"
      />
      <path
        d="M 90 455 A 280 280 0 0 1 340 215"
        stroke="#38bdf8"
        strokeWidth="1.5"
        opacity="0.45"
        fill="none"
      />
      <path
        d="M 120 455 A 240 240 0 0 1 340 250"
        stroke="#38bdf8"
        strokeWidth="1.5"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M 150 455 A 200 200 0 0 1 340 290"
        stroke="#38bdf8"
        strokeWidth="1.5"
        opacity="0.35"
        fill="none"
      />

      {/* Bottom-right Solid Cyan Arc Accent */}
      <path
        d="M 230 455 A 190 190 0 0 1 340 350 L 340 455 Z"
        fill="#0096c7"
        opacity="0.9"
      />
    </svg>
  )
}

/**
 * Stylized Oblate Emblem Icon
 */
function OblateEmblem({ className = "size-9" }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-start", className)}>
      <img
        src="/images/father-card-logo.png"
        alt="Oblate Emblem"
        className="size-full object-contain"
        onError={(e) => {
          const target = e.currentTarget
          target.style.display = "none"
        }}
      />
    </div>
  )
}

/** Same proportions as the artwork inside sample-father-card.png (the black margin is not part of the card). */
const CARD_ASPECT = "682 / 915"

/**
 * Head sits just under the top of the card and the figure is cut off at the bottom edge,
 * matching the sample. Horizontal centre keeps the name clear on the left.
 */
const FIGURE_TOP = 0.045
const FIGURE_CENTER_X = 0.6

type FigureFrame = { left: number; top: number; width: number; height: number }

/** Bounds of the priest inside a cut-out, ignoring transparent and black padding. */
function personBounds(img: HTMLImageElement) {
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (!nw || !nh) return null
  const scale = Math.min(1, 220 / Math.max(nw, nh))
  const cw = Math.max(1, Math.round(nw * scale))
  const ch = Math.max(1, Math.round(nh * scale))
  const canvas = document.createElement("canvas")
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, cw, ch)
  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, cw, ch).data
  } catch {
    return null
  }
  let minX = cw
  let minY = ch
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = (y * cw + x) * 4
      if (data[i + 3] < 28) continue
      if (data[i] < 18 && data[i + 1] < 18 && data[i + 2] < 18) continue
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
  if (maxX < 0) return null
  const inv = 1 / scale
  return {
    x: minX * inv,
    y: minY * inv,
    w: (maxX - minX + 1) * inv,
    h: (maxY - minY + 1) * inv,
  }
}

function frameFor(img: HTMLImageElement, cardW: number, cardH: number): FigureFrame | null {
  const box = personBounds(img)
  if (!box || !cardW || !cardH) return null
  const targetH = cardH * (1 - FIGURE_TOP)
  const scale = targetH / box.h
  return {
    width: img.naturalWidth * scale,
    height: img.naturalHeight * scale,
    top: cardH * FIGURE_TOP - box.y * scale,
    left: cardW * FIGURE_CENTER_X - (box.x + box.w / 2) * scale,
  }
}

/**
 * OblateFatherCard
 * Exactly replicates the requested Oblate Father style card:
 * - Rounded rectangle with exact border radius (36px / rounded-[2.25rem])
 * - Realistic soft multi-layer shadow
 * - Cyan vertical stripes and circular arc background
 * - Top-left OMI emblem, maroon dash, and two-line bold typography (Maroon title + Black name)
 * - Transparent priest cutout image positioned naturally with bottom-clip and subtle depth shadow
 * - Dignified fallback placeholder when no photo is uploaded yet
 * - Fully responsive for all screen sizes
 */
const cardShell =
  "group relative mx-auto w-full max-w-[340px] overflow-hidden rounded-[36px] bg-white transition-all duration-300 ease-out shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18),0_10px_20px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.26),0_14px_28px_-8px_rgba(0,0,0,0.14)]"

export function OblateFatherCard({ name, place, image, className }: PriestCardProps) {
  const [imgError, setImgError] = useState(false)
  const [frame, setFrame] = useState<FigureFrame | null>(null)
  const cardRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const { prefix, name: displayName } = parsePriestName(name)

  const isWenceslaus = /wenceslaus/i.test(name)
  const resolvedImage = image || (isWenceslaus ? "/images/sample-father-card.png" : undefined)
  const isSample = resolvedImage === "/images/sample-father-card.png"
  const hasImage = Boolean(resolvedImage) && !imgError

  useEffect(() => {
    if (!hasImage || isSample) return
    const card = cardRef.current
    const img = imgRef.current
    if (!card || !img) return
    const measure = () => {
      if (!img.naturalWidth) return
      setFrame(frameFor(img, card.clientWidth, card.clientHeight))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    return () => observer.disconnect()
  }, [hasImage, isSample, resolvedImage])

  if (isSample && !imgError) {
    return (
      <article className={cn(cardShell, className)} style={{ aspectRatio: CARD_ASPECT }}>
        {/* Crop away the black margin so the artwork fills the card exactly. */}
        <img
          src="/images/sample-father-card.png"
          alt={name}
          className="absolute max-w-none"
          style={{
            width: `${(1024 / 682) * 100}%`,
            height: `${(1017 / 915) * 100}%`,
            left: `${(-223 / 682) * 100}%`,
            top: `${(-55 / 915) * 100}%`,
          }}
          onError={() => setImgError(true)}
        />
      </article>
    )
  }

  return (
    <article
      ref={cardRef}
      className={cn(cardShell, "flex select-none flex-col", className)}
      style={{ aspectRatio: CARD_ASPECT }}
    >
      {/* Background Vector Art */}
      <CardVectorBackground />

      {/* Top-Left Branding & Priest Name */}
      <div className="relative z-20 flex flex-col items-start p-6 sm:p-7 max-w-[56%] sm:max-w-[52%]">
        {/* Logo / Emblem */}
        <OblateEmblem className="size-8 sm:size-9" />

        {/* Small Maroon Accent Bar */}
        <div className="my-2.5 h-[3.5px] w-6 rounded-full bg-[#860000]" />

        {/* Priest Name */}
        <div className="space-y-0.5">
          <p className="font-heading text-lg font-bold leading-tight tracking-tight text-[#860000] sm:text-xl">
            {prefix}
          </p>
          <h4 className="font-heading text-xl font-black leading-tight tracking-tight text-slate-950 sm:text-2xl break-words">
            {displayName}
          </h4>
        </div>
      </div>

      {/* Priest Image Layer (or Dignified Placeholder) */}
      {hasImage ? (
        <img
          ref={imgRef}
          src={resolvedImage}
          alt=""
          onLoad={() => {
            const card = cardRef.current
            const img = imgRef.current
            if (card && img) setFrame(frameFor(img, card.clientWidth, card.clientHeight))
          }}
          onError={() => setImgError(true)}
          className="pointer-events-none absolute z-10 max-w-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
          style={
            frame
              ? { left: frame.left, top: frame.top, width: frame.width, height: frame.height }
              : { opacity: 0 }
          }
        />
      ) : (
        <div className="pointer-events-none absolute bottom-0 right-0 z-10 flex h-[70%] w-[75%] flex-col items-center justify-end pb-8">
          {/* Subtle Monogram Cross Badge */}
          <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] text-[#0077b6] ring-4 ring-white shadow-[0_8px_20px_rgba(0,180,216,0.2)] transition-transform duration-300 group-hover:scale-105">
            <span className="font-heading text-2xl font-extrabold tracking-wider">
              {getInitials(name)}
            </span>
          </div>
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Oblate Priest
          </span>
        </div>
      )}
    </article>
  )
}
