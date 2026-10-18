"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "cn"

export function CharismWays({ ways: meanings }: { ways: string[] }) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.22 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="how-we-live"
      ref={ref}
      className={cn("scroll-mt-80 px-4 py-16 sm:px-8", shown && "charism-ways-on")}
    >
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
        {meanings.map((line, index) => (
          <div
            key={line}
            className={`charism-way charism-way-${(index % 8) + 1}`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="charism-way-card">
              <p className="font-heading text-xl leading-snug sm:text-2xl">{line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
