import { ArrowRight } from "lucide-react"

import { cn } from "cn"

/** Teal circular arrow used on Media page cards (reference layout). */
export function MediaCircleArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#17b3c6] text-white shadow-[0_10px_24px_-12px_rgba(14,152,172,0.9)] transition duration-300 group-hover:scale-105 group-hover:bg-[#0e98ac]",
        className
      )}
    >
      <ArrowRight className="size-4" strokeWidth={2.5} />
    </span>
  )
}
