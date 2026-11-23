"use client"

import { useState } from "react"
import { HandHeart, Info } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"

const AMOUNTS = [1000, 2500, 5000, 10000] as const

const labelClass = "text-xs font-bold tracking-[0.14em] text-[#0e98ac] uppercase"
const fieldClass =
  "h-12 w-full rounded-xl border border-[#d9eef3] bg-[#f8fdfe] px-4 text-sm text-[#023e8a] outline-none transition focus-visible:border-[#17b3c6] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#17b3c6]/15"

export type DonatePanelCopy = {
  kicker: string
  title: string
  subtitle: string
  amountLabel: string
  customAmountLabel: string
  currencyLabel: string
  nameLabel: string
  emailLabel: string
  noteLabel: string
  buttonLabel: string
  comingSoonBadge: string
  comingSoonNote: string
}

export function DonatePanel({ copy }: { copy: DonatePanelCopy }) {
  const [amount, setAmount] = useState<(typeof AMOUNTS)[number] | "custom">(2500)
  const [custom, setCustom] = useState("")

  return (
    <section
      id="give"
      className="relative isolate scroll-mt-80 overflow-hidden bg-[#f4fbfd] px-4 py-14 text-[#023e8a] sm:px-8 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-[#17b3c6]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-[#ffcf4a]/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <Reveal from="up" className="flex flex-col justify-center">
          <p className="flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-[#0e98ac] uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-[#17b3c6]" />
            {copy.kicker}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-balance text-[#03202b] sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#5c6b7a]">{copy.subtitle}</p>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#17b3c6]/25 bg-white/80 px-4 py-3.5 text-sm leading-6 text-[#0a5062] shadow-[0_12px_30px_-24px_rgba(10,80,98,0.45)]">
            <Info className="mt-0.5 size-4 shrink-0 text-[#17b3c6]" aria-hidden="true" />
            <p>
              <span className="font-semibold text-[#03202b]">{copy.comingSoonBadge}. </span>
              {copy.comingSoonNote}
            </p>
          </div>
        </Reveal>

        <Reveal from="up" delay={120}>
          <div
            aria-disabled="true"
            className="relative overflow-hidden rounded-[1.75rem] border border-[#d5e6ec] bg-white p-6 shadow-[0_24px_50px_-32px_rgba(10,80,98,0.45)] sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0a5062] via-[#17b3c6] to-[#ffcf4a]" />
            <div className="mb-6 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eef8fb] px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-[#0e98ac] uppercase">
                <HandHeart className="size-3.5" />
                {copy.comingSoonBadge}
              </span>
              <span className="text-xs font-semibold tracking-wide text-[#5c6b7a] uppercase">
                {copy.currencyLabel}
              </span>
            </div>

            <form
              className="grid gap-5"
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <div className="grid gap-2">
                <p className={labelClass}>{copy.amountLabel}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {AMOUNTS.map((value) => {
                    const selected = amount === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(value)}
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                          selected
                            ? "border-[#17b3c6] bg-[#17b3c6] text-white shadow-[0_12px_24px_-16px_rgba(14,152,172,0.9)]"
                            : "border-[#d9eef3] bg-[#f8fdfe] text-[#023e8a] hover:border-[#17b3c6]/50"
                        }`}
                      >
                        {value.toLocaleString("en-LK")}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="donate-custom" className={labelClass}>
                  {copy.customAmountLabel}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-semibold text-[#5c6b7a]">
                    LKR
                  </span>
                  <input
                    id="donate-custom"
                    type="text"
                    inputMode="numeric"
                    placeholder="Other amount"
                    value={custom}
                    onChange={(event) => {
                      setCustom(event.target.value)
                      setAmount("custom")
                    }}
                    className={`${fieldClass} pl-14`}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="donate-name" className={labelClass}>
                    {copy.nameLabel}
                  </label>
                  <input id="donate-name" type="text" autoComplete="name" placeholder="Your name" className={fieldClass} />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="donate-email" className={labelClass}>
                    {copy.emailLabel}
                  </label>
                  <input
                    id="donate-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="donate-note" className={labelClass}>
                  {copy.noteLabel}
                </label>
                <textarea
                  id="donate-note"
                  rows={3}
                  placeholder="Optional message"
                  className="w-full rounded-xl border border-[#d9eef3] bg-[#f8fdfe] px-4 py-3 text-sm text-[#023e8a] outline-none transition focus-visible:border-[#17b3c6] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#17b3c6]/15"
                />
              </div>

              <button
                type="submit"
                disabled
                className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full bg-[#0a5062] px-6 text-sm font-semibold text-white opacity-70"
              >
                {copy.buttonLabel}
              </button>
              <p className="text-center text-xs leading-5 text-[#5c6b7a]">{copy.comingSoonNote}</p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
