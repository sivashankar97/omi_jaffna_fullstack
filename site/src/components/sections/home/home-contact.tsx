import { Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"
import { Reveal } from "@/components/motion/reveal"

const details = [
  {
    icon: MapPin,
    label: "Address",
    value: "657/1 Hospital Road, Jaffna, Sri Lanka",
    href: "https://www.google.com/maps/search/?api=1&query=657%2F1+Hospital+Road+Jaffna",
  },
  { icon: Phone, label: "Telephone", value: "021-2222721", href: "tel:+94212222721" },
  { icon: Mail, label: "Email", value: "omi.jafprovince@gmail.com", href: "mailto:omi.jafprovince@gmail.com" },
]

export function HomeContact() {
  return (
    <section id="contact-us" className="scroll-mt-80 bg-[#f7fbff] px-4 pb-20 sm:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgb(2_62_138/0.1)] ring-1 ring-[#cfe9ef] lg:grid-cols-[22rem_minmax(0,1fr)]">
        <Reveal
          from="left"
          className="relative overflow-hidden bg-gradient-to-br from-[#0f9fb4] via-[#17b3c6] to-[#0e98ac] px-7 py-10 text-white sm:px-9"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-20 size-64 rounded-full bg-white/15 blur-2xl"
          />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.24em] text-white/80 uppercase">Provincial House</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold">Contact us</h2>
            <p className="mt-3 text-sm leading-6 text-white/85">Thodarpaham, Jaffna. Write to us or visit the Province office.</p>
            <ul className="mt-8 grid gap-5">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <a href={href} className="group flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/20 ring-1 ring-white/40 transition group-hover:bg-white group-hover:text-[#17b3c6]">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-[11px] font-semibold tracking-[0.2em] text-white/75 uppercase">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-[15px] font-semibold break-all group-hover:underline">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal from="right" delay={150} className="px-6 py-10 text-[#023e8a] sm:px-10">
          <h3 className="font-heading text-2xl font-semibold">Send an enquiry</h3>
          <p className="mt-1 text-sm text-[#5c6b7a]">Your message opens in your email app, addressed to the Province office.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
