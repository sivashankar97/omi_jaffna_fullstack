"use client"

import React, { useEffect, useId, useRef, useState } from "react"
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
  const initialsMatch =
    rest.match(/^((?:[A-Z]\.\s*)+)([A-Za-z]{2,}.*)$/) || rest.match(/^((?:[A-Z]\.?\s+)+)([A-Za-z].*)$/)
  if (initialsMatch) {
    const initials = initialsMatch[1].trim()
    prefix = `${prefix} ${initials}`
    rest = initialsMatch[2].trim()
  } else if (/wenceslaus/i.test(rest)) {
    prefix = "Rev. Fr.G"
    rest = "Wenceslaus"
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

/** Stripes, circle and rings measured from sample-father-card.png (card artwork is 639 × 966). */
const STRIPES = [
  { x: 294, w: 82, top: "#02d3f4", mid: "#8ce2f9" },
  { x: 395, w: 82, top: "#01a1c5", mid: "#6cc9e0" },
  { x: 495, w: 83, top: "#059fc5", mid: "#8cd3e5" },
]
const CIRCLE = { cx: 549, cy: 830, r: 389 }
const RINGS = [425, 470, 515]

function CardVectorBackground({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 639 966"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {STRIPES.map((s, i) => (
          <linearGradient key={i} id={`${id}-s${i}`} x1="0" y1="0" x2="0" y2="966" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={s.top} />
            <stop offset="0.3" stopColor={s.mid} />
            <stop offset="0.45" stopColor={s.mid} stopOpacity="0" />
          </linearGradient>
        ))}
        <clipPath id={`${id}-stripes`}>
          {STRIPES.map((s, i) => (
            <rect key={i} x={s.x} y="0" width={s.w} height="460" />
          ))}
        </clipPath>
      </defs>

      <rect width="639" height="966" fill="#ffffff" />
      {STRIPES.map((s, i) => (
        <rect key={i} x={s.x} y="0" width={s.w} height="966" fill={`url(#${id}-s${i})`} />
      ))}

      {RINGS.map((r) => (
        <circle key={r} cx={CIRCLE.cx} cy={CIRCLE.cy} r={r} stroke="#3fc6e8" strokeWidth="2" opacity="0.8" />
      ))}
      <g clipPath={`url(#${id}-stripes)`}>
        {RINGS.map((r) => (
          <circle key={r} cx={CIRCLE.cx} cy={CIRCLE.cy} r={r} stroke="#ffffff" strokeWidth="2.5" />
        ))}
      </g>

      <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={CIRCLE.r} fill="#05a2c6" />
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

/** Card outline inside sample-father-card.png (806 × 1024 image, white margin outside). */
const SAMPLE = { imgW: 806, imgH: 1024, left: 53, top: 30, w: 639, h: 966 }
const CARD_ASPECT = `${SAMPLE.w} / ${SAMPLE.h}`

/**
 * Head sits just under the top of the card, the figure is cut off at the bottom edge and
 * may reach past the right edge (like the hand in the sample). Values are fractions of the card.
 */
const FIGURE_TOP = 0.041
const HEAD_CENTER_X = 0.61
const MAX_FIGURE_WIDTH = 1.0
const RIGHT_OVERFLOW = 0.11

/** Typography in container-width units so it scales with the card exactly like the sample. */
const NAME_SIZE_CQW = 7.2
const NAME_FIT_CHARS = 10

function nameSize(text: string) {
  const longest = Math.max(1, ...text.split(/\s+/).map((w) => w.length))
  return `${Math.max(4.4, NAME_SIZE_CQW * Math.min(1, NAME_FIT_CHARS / longest))}cqw`
}

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

  // Head centre: middle of the opaque pixels in the top 12% of the figure.
  const headRows = Math.max(1, Math.round((maxY - minY + 1) * 0.12))
  let headSum = 0
  let headCount = 0
  for (let y = minY; y < minY + headRows; y++) {
    let left = -1
    let right = -1
    for (let x = minX; x <= maxX; x++) {
      const i = (y * cw + x) * 4
      if (data[i + 3] < 28) continue
      if (data[i] < 18 && data[i + 1] < 18 && data[i + 2] < 18) continue
      if (left < 0) left = x
      right = x
    }
    if (left >= 0) {
      headSum += (left + right) / 2
      headCount++
    }
  }

  const inv = 1 / scale
  return {
    x: minX * inv,
    y: minY * inv,
    w: (maxX - minX + 1) * inv,
    h: (maxY - minY + 1) * inv,
    headX: (headCount ? headSum / headCount : (minX + maxX) / 2) * inv,
  }
}

function frameFor(img: HTMLImageElement, cardW: number, cardH: number): FigureFrame | null {
  const box = personBounds(img)
  if (!box || !cardW || !cardH) return null
  const scale = Math.min((cardH * (1 - FIGURE_TOP)) / box.h, (cardW * MAX_FIGURE_WIDTH) / box.w)
  let left = cardW * HEAD_CENTER_X - box.headX * scale
  const right = left + (box.x + box.w) * scale
  const maxRight = cardW * (1 + RIGHT_OVERFLOW)
  if (right > maxRight) left -= right - maxRight
  return {
    width: img.naturalWidth * scale,
    height: img.naturalHeight * scale,
    top: cardH - (box.y + box.h) * scale,
    left,
  }
}

const CARD_RADIUS = "9.4cqw"
const CARD_SHADOW = "0 16px 26px -14px rgba(0,0,0,0.38), 0 4px 10px -6px rgba(0,0,0,0.12)"
const NAME_FONT: React.CSSProperties = {
  fontFamily: '"Helvetica Neue", Helvetica, Arial, var(--font-sans)',
  fontWeight: 700,
  letterSpacing: "-0.035em",
  lineHeight: 1,
}

const cardShell =
  "group relative mx-auto w-full max-w-[340px] select-none transition-transform duration-300 ease-out hover:-translate-y-1.5"
const cardStyle: React.CSSProperties = { aspectRatio: CARD_ASPECT, containerType: "inline-size" }

const KNOWN_PRIEST_PHOTOS: Record<string, string> = {
  wenceslaus: "/images/fr-wenceslaus-cutout.png",
  loshington: "/Leadership_img/Francis_Loshington_Antonipillai-removebg-preview.png",
  jesuthasan: "/Leadership_img/Pakkiyanathan_Antony_Jesuthasan-removebg-preview.png",
  sathiyaseelan: "/Leadership_img/Sathiyaseelan_Pathinathan-removebg-preview.png",
  "edwin vasantharajah": "/Leadership_img/Rev. Fr. Edwin Vasantharajah.png",
  "anson regikumar": "/Leadership_img/Anson_Regikumar_Tharcious-removebg-preview.png",
  "jeevendra paul": "/Leadership_img/Rev. Fr. Jeevendra Paul.png",
  selvaratnam: "/Leadership_img/Rev. Fr. S.M. Selvaratnam.png",
  "jeyanthan pachchek": "/Leadership_img/Rev. Fr. Paul Jeyanthan Pachchek, OMI.png",
  "antony hubert": "/Leadership_img/Antony Hubert.png",
}

function resolvePriestPhoto(name: string, explicitImage?: string): string | undefined {
  if (explicitImage && explicitImage !== "/images/sample-father-card.png") {
    return explicitImage
  }
  const lower = (name || "").toLowerCase()
  for (const [key, path] of Object.entries(KNOWN_PRIEST_PHOTOS)) {
    if (lower.includes(key)) return path
  }
  return explicitImage && explicitImage !== "/images/sample-father-card.png" ? explicitImage : undefined
}

/**
 * Oblate priest card matching sample-father-card.png: thin cyan rounded frame, fading stripes,
 * cyan circle with rings, emblem + maroon bar + two-line name, and a cut-out photo whose head
 * sits under the top edge and whose body is cut at the bottom (it may reach past the right edge).
 */
export function OblateFatherCard({ name, place, image, className }: PriestCardProps) {
  const [imgError, setImgError] = useState(false)
  const [frame, setFrame] = useState<FigureFrame | null>(null)
  const cardRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const svgId = useId().replace(/:/g, "")
  const { prefix, name: displayName } = parsePriestName(name)

  const resolvedImage = resolvePriestPhoto(name, image)
  const isWenceslausCutout = resolvedImage === "/images/fr-wenceslaus-cutout.png"
  const hasImage = Boolean(resolvedImage) && !imgError

  useEffect(() => {
    if (!hasImage || isWenceslausCutout) return
    const card = cardRef.current
    const img = imgRef.current
    if (!card || !img) return
    const measure = () => {
      if (!img.naturalWidth) return
      const calculatedFrame = frameFor(img, card.clientWidth, card.clientHeight)
      if (calculatedFrame) setFrame(calculatedFrame)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    return () => observer.disconnect()
  }, [hasImage, isWenceslausCutout, resolvedImage])

  return (
    <article
      ref={cardRef}
      className={cn(cardShell, className)}
      style={cardStyle}
      title={place ? `${name} (${place})` : name}
    >
      {/* Background card frame and SVG art */}
      <div
        className="absolute inset-0 overflow-hidden bg-white"
        style={{
          borderRadius: CARD_RADIUS,
          border: "max(1.5px, 0.47cqw) solid #26bad4",
          boxShadow: CARD_SHADOW,
        }}
      >
        <CardVectorBackground id={svgId} />
      </div>

      {/* Top-Left Branding & Priest Name */}
      <div
        className="absolute z-20 flex flex-col items-start"
        style={{ left: "6.1cqw", top: "10.3cqw", maxWidth: "46cqw" }}
      >
        {/* Emblem */}
        <div style={{ margin: "-1.5cqw 0 0 -1.8cqw" }}>
          <OblateEmblem className="size-[11.4cqw]" />
        </div>

        {/* Small Maroon Accent Bar */}
        <div
          className="bg-[#5c2217]"
          style={{ marginTop: "0.6cqw", width: "7.5cqw", height: "0.95cqw", borderRadius: "1px" }}
        />

        {/* Title / Prefix (e.g. Rev. Fr.G) */}
        <p
          className="text-[#820004]"
          style={{ ...NAME_FONT, fontSize: nameSize(prefix), marginTop: "2.2cqw" }}
        >
          {prefix}
        </p>

        {/* Display Name */}
        <h4
          className="break-words text-[#080808]"
          style={{ ...NAME_FONT, fontSize: nameSize(displayName), marginTop: "0.4cqw" }}
        >
          {displayName}
        </h4>
      </div>

      {/* Priest Image Layer (or Dignified Monogram Badge) */}
      {hasImage ? (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ clipPath: `inset(-20% -${RIGHT_OVERFLOW * 100}% 0.35% 0)` }}
        >
          {isWenceslausCutout ? (
            <img
              src={resolvedImage}
              alt={name}
              className="absolute max-w-none select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              style={{
                width: `${(SAMPLE.imgW / SAMPLE.w) * 100}%`,
                height: `${(SAMPLE.imgH / SAMPLE.h) * 100}%`,
                left: `${(-SAMPLE.left / SAMPLE.w) * 100}%`,
                top: `${(-SAMPLE.top / SAMPLE.h) * 100}%`,
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <img
              ref={imgRef}
              src={resolvedImage}
              alt={name}
              onLoad={() => {
                const card = cardRef.current
                const img = imgRef.current
                if (card && img) {
                  const calculatedFrame = frameFor(img, card.clientWidth, card.clientHeight)
                  if (calculatedFrame) setFrame(calculatedFrame)
                }
              }}
              onError={() => setImgError(true)}
              className="absolute select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              style={
                frame
                  ? { left: frame.left, top: frame.top, width: frame.width, height: frame.height, maxWidth: "none" }
                  : {
                      bottom: 0,
                      right: "-3%",
                      height: "92%",
                      width: "auto",
                      maxWidth: "85%",
                      objectFit: "contain",
                      objectPosition: "bottom right",
                    }
              }
            />
          )}
        </div>
      ) : (
        <div className="pointer-events-none absolute bottom-0 right-0 z-10 flex h-[70%] w-[75%] flex-col items-center justify-end pb-8">
          <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] text-[#0077b6] ring-4 ring-white shadow-[0_8px_20px_rgba(0,180,216,0.2)] transition-transform duration-300 group-hover:scale-105">
            <span className="font-heading text-2xl font-extrabold tracking-wider">
              {getInitials(name)}
            </span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Oblate Priest
          </span>
        </div>
      )}
    </article>
  )
}
