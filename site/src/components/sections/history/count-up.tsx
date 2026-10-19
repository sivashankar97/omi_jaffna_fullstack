"use client"

import { useEffect, useRef, useState } from "react"

const DURATION = 1800

export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : value
  const numeric = match !== null
  const ref = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node || !numeric) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(target)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCurrent(Math.round(target * eased))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, numeric])

  if (!numeric) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true" className="tabular-nums">
        {current}
        {suffix}
      </span>
    </span>
  )
}
