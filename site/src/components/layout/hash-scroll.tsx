"use client"

import { useEffect } from "react"

/**
 * Menu links such as /#join-us open another page; the browser scrolls before that page's
 * content and images have taken their final size, so the section ends up off-screen.
 * Re-align the target once the page has settled.
 */
export function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const align = () => document.getElementById(id)?.scrollIntoView({ block: "start" })
    const frame = requestAnimationFrame(align)
    const timers = [300, 900].map((delay) => window.setTimeout(align, delay))
    window.addEventListener("load", align, { once: true })
    const stop = () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener("load", align)
    }
    window.addEventListener("wheel", stop, { once: true, passive: true })
    window.addEventListener("touchstart", stop, { once: true, passive: true })
    return () => {
      cancelAnimationFrame(frame)
      stop()
      window.removeEventListener("wheel", stop)
      window.removeEventListener("touchstart", stop)
    }
  }, [])

  return null
}
