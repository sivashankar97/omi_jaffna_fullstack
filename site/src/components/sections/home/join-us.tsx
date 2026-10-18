"use client"

import { ArrowUpRight, Check, X } from "lucide-react"
import { FormEvent, useState } from "react"

import { cn } from "cn"

type Field = {
  name: string
  label: string
  hint?: string
  type?: "text" | "email" | "tel" | "textarea" | "select"
  required?: boolean
  options?: string[]
  autoComplete?: string
}

type Path = {
  id: "oblate" | "associate"
  label: string
  title: string
  tagline: string
  text: string
  close: string
  steps?: string[]
  fields: Field[]
}

const paths: Path[] = [
  {
    id: "oblate",
    label: "Be an Oblate",
    title: "Be an Oblate",
    tagline: "Answer the call. Serve the most abandoned.",
    text: "Do you feel a calling to walk alongside the poor, the marginalized and those who long for hope? The Missionary Oblates of Mary Immaculate invite young men to discern a life of purpose and brotherhood. Whether called to serve as a priest or a religious brother, becoming an Oblate means giving your life to the Gospel in the spirit of St. Eugene de Mazenod.",
    close: "Take the first step in your discernment journey today.",
    steps: [
      "“Come and See” vocation camp",
      "The Juniorate",
      "The Pre-Novitiate",
      "The Novitiate",
      "The Scholasticate",
    ],
    fields: [
      { name: "Full name", label: "Full name", required: true, autoComplete: "name" },
      {
        name: "Date of birth / Age",
        label: "Date of birth / Age",
        hint: "Helps us direct you to the right formation stage",
        required: true,
      },
      { name: "Email", label: "Email address", type: "email", autoComplete: "email" },
      { name: "Phone / WhatsApp", label: "Phone / WhatsApp number", type: "tel", required: true, autoComplete: "tel" },
      { name: "City / Diocese", label: "City / Diocese of residence", required: true },
      {
        name: "Highest qualification",
        label: "Highest educational qualification",
        hint: "e.g. O/Ls, A/Ls, Degree",
        required: true,
      },
      { name: "Occupation / Studies", label: "Current occupation / studies", required: true },
      {
        name: "Message",
        label: "Message",
        hint: "Tell us a little about yourself and why you are interested in the Oblates",
        type: "textarea",
      },
    ],
  },
  {
    id: "associate",
    label: "Be an Oblate Lay Associate",
    title: "Be an Oblate Lay Associate",
    tagline: "Live the charism in your everyday life.",
    text: "You do not need to take religious vows to share in our mission. We warmly invite laypeople, men and women, married and single, to join the wider Oblate family as Lay Associates. As an Associate you carry the spirit of St. Eugene de Mazenod into your family, your workplace and your community, through prayer, support for youth ministry, or work for justice and the poor.",
    close: "Come, share in our mission and walk the Emmaus journey with us.",
    fields: [
      { name: "Full name", label: "Full name", required: true, autoComplete: "name" },
      { name: "Email", label: "Email address", type: "email", autoComplete: "email" },
      { name: "Phone / WhatsApp", label: "Phone / WhatsApp number", type: "tel", required: true, autoComplete: "tel" },
      { name: "City / Parish", label: "City / Parish of residence", required: true },
      { name: "Profession / Occupation", label: "Profession / Occupation", required: true },
      {
        name: "Area of interest",
        label: "Area of interest",
        type: "select",
        required: true,
        options: ["Prayer and spiritual life", "Youth ministry", "Justice and the poor", "Parish service", "Other"],
      },
      {
        name: "Message",
        label: "Message",
        hint: "Tell us how you would like to collaborate or what drew you to the Oblate charism",
        type: "textarea",
      },
    ],
  },
]

const inputClass =
  "w-full rounded-xl border border-[#cfe9ef] bg-white px-4 py-2.5 text-sm text-[#023e8a] outline-none transition focus:border-[#17b3c6] focus:ring-3 focus:ring-[#17b3c6]/25"

function JoinForm({ path }: { path: Path }) {
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const body = path.fields.map((field) => `${field.label}: ${String(data.get(field.name) ?? "")}`).join("\n")
    window.location.href = `mailto:omi.jafprovince@gmail.com?subject=${encodeURIComponent(path.title)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {path.fields.map((field) => {
        const id = `${path.id}-${field.name.toLowerCase().replace(/[^a-z]+/g, "-")}`
        return (
          <div key={field.name} className="grid gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold text-[#023e8a]">
              {field.label}
              {field.required ? <span className="text-[#17b3c6]"> *</span> : null}
            </label>
            {field.hint ? <span className="-mt-1 text-xs text-[#5c6b7a] italic">{field.hint}</span> : null}
            {field.type === "textarea" ? (
              <textarea id={id} name={field.name} rows={4} required={field.required} className={inputClass} />
            ) : field.type === "select" ? (
              <select id={id} name={field.name} required={field.required} defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Please choose an option
                </option>
                {field.options?.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.type ?? "text"}
                required={field.required}
                autoComplete={field.autoComplete}
                className={inputClass}
              />
            )}
          </div>
        )
      })}
      <label className="flex items-start gap-2 text-sm leading-5 text-[#5c6b7a]">
        <input type="checkbox" required className="mt-1 accent-[#17b3c6]" />
        I understand this form will open in my email app to reach the Province.
      </label>
      <button
        type="submit"
        className="w-fit rounded-full bg-[#17b3c6] px-7 py-3 text-sm font-bold tracking-wide text-white uppercase shadow-md transition hover:bg-[#0f9fb4]"
      >
        Send
      </button>
      {sent ? <p className="text-sm text-[#023e8a]">Your email app should open with this form.</p> : null}
    </form>
  )
}

export function JoinUs() {
  const [openId, setOpenId] = useState<Path["id"] | null>(null)
  const open = paths.find((path) => path.id === openId) ?? null

  return (
    <section id="join-us" className="relative scroll-mt-80 overflow-hidden bg-[#f7fbff] px-4 py-20 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-[#17b3c6] opacity-10 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-semibold text-[#023e8a] sm:text-5xl">Join us</h2>
          <p className="mt-2 text-sm font-semibold tracking-[0.22em] text-[#17b3c6] uppercase">
            Walk with the Oblates
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mx-auto sm:max-w-3xl sm:grid-cols-2">
          {paths.map((path) => {
            const on = path.id === openId
            return (
              <button
                key={path.id}
                type="button"
                aria-expanded={on}
                aria-controls="join-panel"
                onClick={() => setOpenId(on ? null : path.id)}
                className={cn(
                  "group flex items-center justify-between gap-4 rounded-2xl border-2 px-6 py-5 text-left transition hover:-translate-y-0.5",
                  on
                    ? "border-[#17b3c6] bg-[#17b3c6] text-white shadow-[0_16px_36px_rgb(23_179_198/0.35)]"
                    : "border-[#17b3c6]/40 bg-white text-[#023e8a] shadow-sm hover:border-[#17b3c6]"
                )}
              >
                <span className="text-lg font-bold tracking-wide uppercase">{path.label}</span>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full transition",
                    on ? "bg-white text-[#17b3c6]" : "bg-[#17b3c6] text-white group-hover:rotate-45"
                  )}
                >
                  {on ? <X className="size-5" /> : <ArrowUpRight className="size-5" />}
                </span>
              </button>
            )
          })}
        </div>

        {open ? (
          <div
            key={open.id}
            id="join-panel"
            className="mt-10 grid gap-10 rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_rgb(2_62_138/0.1)] ring-1 ring-[#cfe9ef] motion-safe:animate-[media-panel_0.5s_ease_both] sm:p-10 lg:grid-cols-2"
          >
            <div>
              <h3 className="font-heading text-3xl font-bold text-[#17b3c6] uppercase sm:text-4xl">{open.title}</h3>
              <p className="mt-3 text-sm font-bold tracking-wide text-[#5c6b7a] uppercase">{open.tagline}</p>
              <p className="mt-6 text-[15px] leading-7 text-[#3d4b59]">{open.text}</p>
              <p className="mt-4 font-semibold text-[#023e8a]">{open.close}</p>
              {open.steps ? (
                <ol className="mt-6 divide-y divide-[#e3f1f4] border-y border-[#e3f1f4]">
                  {open.steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-3 py-3.5 text-[15px] font-semibold text-[#023e8a]">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#17b3c6]/15 text-xs font-bold text-[#0f9fb4]">
                        {index + 1}
                      </span>
                      Step {index + 1}: {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-6 grid gap-2.5">
                  {["Prayer", "Youth ministry", "Justice and the poor"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[15px] font-semibold text-[#023e8a]">
                      <Check className="size-4 text-[#17b3c6]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <JoinForm path={open} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
