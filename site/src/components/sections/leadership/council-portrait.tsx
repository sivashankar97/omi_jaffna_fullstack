"use client"

import { useEffect, useRef, useState } from "react"

type FigureFrame = { left: number; top: number; width: number; height: number }

/** Same visual person height on every council card (ignores transparent padding). */
const PERSON_HEIGHT = 1.16
const MAX_PERSON_WIDTH = 1.28

function personBounds(img: HTMLImageElement) {
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (!nw || !nh) return null
  const scale = Math.min(1, 240 / Math.max(nw, nh))
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
  let scale = (cardH * PERSON_HEIGHT) / box.h
  if (box.w * scale > cardW * MAX_PERSON_WIDTH) {
    scale = (cardW * MAX_PERSON_WIDTH) / box.w
  }
  const left = cardW / 2 - (box.x + box.w / 2) * scale
  const top = cardH - (box.y + box.h) * scale
  return {
    width: img.naturalWidth * scale,
    height: img.naturalHeight * scale,
    left,
    top,
  }
}

export function CouncilPortrait({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState<FigureFrame | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let cancelled = false
    setFrame(null)

    const probe = new Image()
    probe.crossOrigin = "anonymous"
    const apply = () => {
      if (cancelled || !wrapRef.current || !probe.naturalWidth) return
      const next = frameFor(probe, wrapRef.current.clientWidth, wrapRef.current.clientHeight)
      if (next) setFrame(next)
    }
    probe.onload = apply
    probe.onerror = () => {
      // CORS blocked — keep CSS fallback sizing.
    }
    probe.src = src

    const ro = new ResizeObserver(apply)
    ro.observe(wrap)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [src])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      <img
        src={src}
        alt={alt}
        className="absolute max-w-none select-none drop-shadow-[0_18px_30px_rgba(3,32,43,0.4)] transition duration-700 group-hover:scale-[1.03]"
        style={
          frame
            ? {
                left: frame.left,
                top: frame.top,
                width: frame.width,
                height: frame.height,
                transformOrigin: "bottom center",
              }
            : {
                left: "50%",
                bottom: 0,
                height: "116%",
                width: "auto",
                maxWidth: "112%",
                transform: "translateX(-50%)",
                objectFit: "contain",
                objectPosition: "bottom center",
              }
        }
      />
    </div>
  )
}
