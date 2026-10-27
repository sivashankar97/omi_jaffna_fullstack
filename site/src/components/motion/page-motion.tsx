"use client"

import { useLayoutEffect, useRef } from "react"

const motionSelector = "h1, h2, h3, h4, p, li, a, button, blockquote"

export function PageMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const nodes = [...root.querySelectorAll<HTMLElement>(motionSelector)]
    if (reduce) {
      nodes.forEach((node) => {
        node.style.animation = "none"
      })
      return
    }

    const play = (node: HTMLElement) => {
      node.style.animationPlayState = "running"
    }

    const pending = new Set<HTMLElement>()
    nodes.forEach((node) => {
      // Skip nodes owned by MotionReveal / MotionHero — dual opacity/transform = scroll flicker
      if (node.closest("[data-motion-own]")) return
      node.classList.add("text-motion")
      if (node.matches("h1, h2")) node.classList.add("text-motion-title")
      node.style.animationDelay = "0ms"
      pending.add(node)
    })

    const reveal = () => {
      pending.forEach((node) => {
        const rect = node.getBoundingClientRect()
        const inView = rect.bottom > 0 && rect.top < window.innerHeight * 0.98 && rect.height > 0
        if (!inView) return
        play(node)
        pending.delete(node)
      })
    }

    reveal()
    window.addEventListener("scroll", reveal, { passive: true })
    window.addEventListener("resize", reveal)
    return () => {
      window.removeEventListener("scroll", reveal)
      window.removeEventListener("resize", reveal)
    }
  }, [])

  return (
    <div ref={ref} className="page-stage relative">
      <span className="page-curtain" aria-hidden="true" />
      {children}
    </div>
  )
}
