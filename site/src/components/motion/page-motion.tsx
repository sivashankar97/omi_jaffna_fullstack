"use client"

import { useEffect, useRef } from "react"

const motionSelector = "h1, h2, h3, h4, p, li, a, button, blockquote"

const textBloom: Keyframe[] = [
  { opacity: 0, transform: "translateY(6px)" },
  { opacity: 1, transform: "none" },
]

const titleSweep: Keyframe[] = [
  { opacity: 0, clipPath: "inset(0 100% 0 0)", transform: "translateY(18px)" },
  { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "none" },
]

export function PageMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Web Animations only — never touch class/style, or React reports a hydration mismatch
    // for nodes inside Suspense boundaries that have not hydrated yet.
    const pending = new Map<Element, Animation>()
    const seen = new WeakSet<Element>()

    const inView = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return
          pending.get(target)?.play()
          pending.delete(target)
          inView.unobserve(target)
        })
      },
      { rootMargin: "0px 0px -2% 0px" },
    )

    const register = (node: Element) => {
      if (seen.has(node) || node.closest("[data-motion-own]")) return
      seen.add(node)
      const animation = node.animate(node.matches("h1, h2") ? titleSweep : textBloom, {
        duration: 150,
        easing: "ease-out",
        fill: "backwards",
      })
      animation.pause()
      pending.set(node, animation)
      inView.observe(node)
    }

    const scan = (scope: ParentNode) => {
      if (scope instanceof Element && scope.matches(motionSelector)) register(scope)
      scope.querySelectorAll(motionSelector).forEach(register)
    }

    scan(root)

    const added = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node)
        }),
      )
    })
    added.observe(root, { childList: true, subtree: true })
    return () => {
      added.disconnect()
      inView.disconnect()
      pending.forEach((animation) => animation.cancel())
    }
  }, [])

  return (
    <div ref={ref} className="page-stage relative">
      <span className="page-curtain" aria-hidden="true" />
      {children}
    </div>
  )
}
