"use client"

import { useEffect, useState } from "react"

import { cn } from "cn"

export type Slide = { src: string; alt: string; fit: string }

type AutoSlideProps = {
  slides: readonly Slide[]
  className?: string
  label?: string
  cover?: boolean
}

export function AutoSlide({ slides: showcaseSlides, className, label = "Province images", cover = false }: AutoSlideProps) {
  const slides = showcaseSlides.length ? [...showcaseSlides, showcaseSlides[0]] : []
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return
    const timer = window.setInterval(() => {
      setAnimate(true)
      setIndex((current) => current + 1)
    }, 3800)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (index !== showcaseSlides.length) return
    const timer = window.setTimeout(() => {
      setAnimate(false)
      setIndex(0)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [index, showcaseSlides.length])

  return (
    <div
      className={cn(
        cover
          ? "relative h-full min-h-[24rem] overflow-hidden bg-[#03045e]"
          : "relative overflow-hidden rounded-3xl bg-[#e7fbff] shadow-xl ring-1 ring-white/70",
        className
      )}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        className={cn("flex h-full", animate && "transition-transform duration-700 ease-out")}
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(index * 100) / slides.length}%)`,
        }}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={`${slide.src}-${slideIndex}`}
            className="relative h-full"
            style={{ width: `${100 / slides.length}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slideIndex === slides.length - 1 ? "" : slide.alt}
              className={cn(
                "h-full w-full",
                cover || slide.fit !== "contain" ? "object-cover" : "object-contain p-8",
                slideIndex === index && "slide-ken"
              )}
            />
          </div>
        ))}
      </div>
      <div className="absolute right-4 bottom-4 flex gap-1.5">
        {showcaseSlides.map((slide, dot) => (
          <span
            key={`${dot}-${slide.src}`}
            className={cn(
              "h-2 rounded-full bg-white/70 transition-all",
              (index % showcaseSlides.length) === dot ? "w-6 bg-white" : "w-2"
            )}
          />
        ))}
      </div>
    </div>
  )
}
