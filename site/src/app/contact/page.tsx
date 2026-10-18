import type { Metadata } from "next"

import { ContactForm } from "@/components/contact/contact-form"
import { PageHero } from "@/components/layout/page-hero"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Oblate Province of Jaffna at Thodarpaham, Hospital Road.",
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        id="thodarpaham"
        tone="cyan"
        kicker="Provincial House"
        title="Thodarpaham, Jaffna"
        summary="657/1 Hospital Road, Jaffna, Sri Lanka. Telephone 021-2222721. Email omi.jafprovince@gmail.com."
      />
      <section className="grid lg:grid-cols-2">
        <div id="visit" className="scroll-mt-80 bg-[#f7fbff] px-6 py-14 text-[#023e8a]">
          <h2 className="font-heading text-3xl">Visit or write</h2>
          <dl className="mt-6 space-y-4 text-lg">
            <div>
              <dt className="text-xs tracking-[0.2em] text-[#0077b6] uppercase">Address</dt>
              <dd className="mt-1">657/1 Hospital Road, Jaffna, Sri Lanka</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-[#0077b6] uppercase">Telephone</dt>
              <dd className="mt-1">
                <a href="tel:+94212222721">021-2222721</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-[#0077b6] uppercase">Email</dt>
              <dd className="mt-1">
                <a href="mailto:omi.jafprovince@gmail.com">omi.jafprovince@gmail.com</a>
              </dd>
            </div>
          </dl>
          <a
            className="mt-8 inline-block text-primary underline"
            href="https://www.google.com/maps/search/?api=1&query=657%2F1+Hospital+Road+Jaffna"
          >
            Open in Google Maps
          </a>
        </div>
        <div id="enquiry" className="scroll-mt-80 bg-white px-6 py-14 text-[#023e8a]">
          <h2 className="font-heading text-3xl">Enquiry</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
