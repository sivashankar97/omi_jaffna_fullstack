"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

import { cn } from "cn"

type From = "left" | "right" | "up" | "zoom"

/** Keyvo-like soft slides — kept short so glass/backdrop-filter cards don’t flicker. */
const offsets: Record<From, { x?: number; y?: number }> = {
  left: { x: -18 },
  right: { x: 18 },
  up: { y: 18 },
  zoom: { y: 14 },
}

const ease = [0.22, 1, 0.36, 1] as const

/** Any overlap triggers: a ratio like 0.14 never fires on blocks taller than ~7 screens. */
const viewport = { once: true, amount: "some", margin: "0px 0px -6% 0px" } as const

type MotionRevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  id?: string
  from?: From
  as?: "div" | "li"
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  id,
  from = "up",
  as = "div",
}: MotionRevealProps) {
  const reduce = useReducedMotion()
  const offset = offsets[from]
  const classes = cn(id && "scroll-mt-80", className)

  if (reduce) {
    if (as === "li") {
      return (
        <li id={id} className={classes} data-motion-own="">
          {children}
        </li>
      )
    }
    return (
      <div id={id} className={classes} data-motion-own="">
        {children}
      </div>
    )
  }

  const motionProps = {
    id,
    className: classes,
    "data-motion-own": "",
    initial: { opacity: 0, ...offset },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport,
    transition: {
      duration: 0.55,
      delay: delay / 1000,
      ease,
    },
  }

  if (as === "li") {
    return <motion.li {...motionProps}>{children}</motion.li>
  }

  return <motion.div {...motionProps}>{children}</motion.div>
}

type MotionHeroProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

/** Mount entrance — Keyvo hero: soft rise, no blur (blur caused scroll flicker). */
export function MotionHero({ children, className, delay = 0 }: MotionHeroProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} data-motion-own="">
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      data-motion-own=""
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease }}
    >
      {children}
    </motion.div>
  )
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
}

type MotionStaggerProps = {
  children: React.ReactNode
  className?: string
  /** Stagger gap in seconds (Keyvo ~0.08–0.1). */
  stagger?: number
  as?: "div" | "ul"
}

/** Parent for cascading card grids (Keyvo bento / feature rows). */
export function MotionStagger({ children, className, stagger = 0.09, as = "div" }: MotionStaggerProps) {
  const reduce = useReducedMotion()
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
  }

  if (reduce) {
    const Tag = as === "ul" ? "ul" : "div"
    return (
      <Tag className={className} data-motion-own="">
        {children}
      </Tag>
    )
  }

  if (as === "ul") {
    return (
      <motion.ul
        className={className}
        data-motion-own=""
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={variants}
      >
        {children}
      </motion.ul>
    )
  }

  return (
    <motion.div
      className={className}
      data-motion-own=""
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

type MotionItemProps = {
  children: React.ReactNode
  className?: string
  as?: "div" | "li"
}

/** Child of MotionStagger — one cascade step. */
export function MotionItem({ children, className, as = "div" }: MotionItemProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    if (as === "li") {
      return (
        <li className={className} data-motion-own="">
          {children}
        </li>
      )
    }
    return (
      <div className={className} data-motion-own="">
        {children}
      </div>
    )
  }

  if (as === "li") {
    return (
      <motion.li className={className} data-motion-own="" variants={staggerItem}>
        {children}
      </motion.li>
    )
  }

  return (
    <motion.div className={className} data-motion-own="" variants={staggerItem}>
      {children}
    </motion.div>
  )
}

/** Gentle Keyvo-style float for hero product / quote panels. */
export function MotionFloat({ children, className, delay = 0 }: MotionHeroProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} data-motion-own="">
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      data-motion-own=""
      initial={{ opacity: 0, y: 28 }}
      animate={{
        opacity: 1,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.7, delay: delay / 1000, ease },
        y: {
          duration: 5.5,
          delay: delay / 1000 + 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {children}
    </motion.div>
  )
}
