"use client"

import { useEffect, useRef, useState } from "react"

import { charismMotto } from "@/content/charism"
import { cn } from "cn"

export function CharismVow() {
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
      { threshold: 0.28 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="mission-vision" ref={ref} className={cn("scroll-mt-80 px-4 py-16 sm:px-8", shown && "charism-vow-on")}>
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <img
          src="/Herosection/Cross_vision.png?v=3"
          alt="Oblate cross"
          className="charism-cross mx-auto h-auto max-h-[32rem] w-full max-w-sm object-contain"
        />
        <div className="grid gap-5">
          <div id="mission" className="charism-glass-mission scroll-mt-80 rounded-[2rem] px-7 py-8">
            <h2 className="font-heading text-4xl">Mission</h2>
            <p className="mt-4 max-w-xl text-lg leading-8">
              Empowered by the Good News, we work for a healing society in and through the light of the Good News.
            </p>
          </div>
          <div id="vision" className="charism-glass-vision scroll-mt-80 rounded-[2rem] px-7 py-8">
            <h2 className="font-heading text-4xl">Vision</h2>
            <p className="mt-4 max-w-xl text-lg leading-8">
              A life towards a renewed, just and free society.
            </p>
          </div>
          <div id="motto" className="charism-glass-motto scroll-mt-80 rounded-[2rem] px-7 py-8">
            <h2 className="font-heading text-4xl">Motto</h2>
            <p className="mt-4 max-w-xl text-lg leading-8">{charismMotto}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
