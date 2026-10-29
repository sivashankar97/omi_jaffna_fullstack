"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "cn"

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  id?: string
  as?: "div" | "li"
  from?: "left" | "right" | "up" | "zoom"
}

/** Short offsets: long slides over glass/backdrop-filter cards read as flicker. */
const offsets = {
  left: "translate3d(-24px, 0, 0)",
  right: "translate3d(24px, 0, 0)",
  up: "translate3d(0, 20px, 0)",
  zoom: "translate3d(0, 16px, 0) scale(0.97)",
} as const

export function Reveal({
  children,
  className,
  delay = 0,
  id,
  as: Tag = "div",
  from,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      // A ratio threshold never fires on blocks taller than the screen, so trigger on any overlap.
      { threshold: 0, rootMargin: "0px 0px -6% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const classNameValue = cn(shown && !from && "animate-card-in", id && "scroll-mt-80", className)
  const style: React.CSSProperties = from
    ? {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : offsets[from],
        transition: `opacity 0.55s ease ${delay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }
    : { animationDelay: "0ms" }

  if (Tag === "li") {
    return (
      <li
        id={id}
        ref={(node) => {
          ref.current = node
        }}
        style={style}
        className={classNameValue}
      >
        {children}
      </li>
    )
  }

  return (
    <div
      id={id}
      ref={(node) => {
        ref.current = node
      }}
      style={style}
      className={classNameValue}
    >
      {children}
    </div>
  )
}
