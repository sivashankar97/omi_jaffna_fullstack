import type { Metadata } from "next"

import { ContactForm } from "@/components/contact/contact-form"
import { PageHero } from "@/components/layout/page-hero"
import { getSiteInfo } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Oblate Province of Jaffna at Thodarpaham, Hospital Road.",
}

export default async function ContactPage() {
  const { contact } = await getSiteInfo()
  return (
    <>
      <PageHero
        id="thodarpaham"
        tone="cyan"
        kicker="Provincial House"
        title="Thodarpaham, Jaffna"
        summary={`${contact.address}. Telephone ${contact.phone}. Email ${contact.email}.`}
      />
      <section className="grid lg:grid-cols-2">
        <div id="visit" className="scroll-mt-80 bg-[#f7fbff] px-6 py-14 text-[#023e8a]">
          <h2 className="font-heading text-3xl">Visit or write</h2>
          <dl className="mt-6 space-y-4 text-lg">
            <div>
              <dt className="text-xs tracking-[0.2em] text-[#0077b6] uppercase">Address</dt>
              <dd className="mt-1">{contact.address}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-[#0077b6] uppercase">Telephone</dt>
              <dd className="mt-1">
                <a href={contact.phoneHref}>{contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-[#0077b6] uppercase">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
          </dl>
          <a className="mt-8 inline-block text-primary underline" href={contact.mapLink}>
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
