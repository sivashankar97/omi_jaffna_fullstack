import type { Metadata } from "next"
import Link from "next/link"

import { PageBanner } from "@/components/sections/page-banner"
import { site } from "@/config/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How the ${site.name} website collects, uses and protects personal information.`,
}

const UPDATED = "28 October 2026"

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        This website is run by the {site.name} ({site.congregation}), {site.contact.address}, Sri Lanka. For any
        question about your personal information, write to{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or call{" "}
        <a href={site.contact.phoneHref}>{site.contact.phone}</a>.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email, phone number (optional), the reason for writing and your
          message.
        </li>
        <li>
          <strong>Member accounts</strong> (Oblate fathers and staff): name, email address, OMI ID, and a securely
          hashed password. We never store passwords in readable form.
        </li>
        <li>
          <strong>Content you add as a member:</strong> profile details, photos, documents, events and articles you
          submit for the website.
        </li>
        <li>
          <strong>Technical data:</strong> standard server logs (such as IP address and browser type) used to keep
          the site secure and to limit abuse.
        </li>
      </ul>
    ),
  },
  {
    title: "How we use it",
    body: (
      <ul>
        <li>To answer your enquiries and pastoral or vocation requests.</li>
        <li>To let members sign in, manage their profile and publish approved content.</li>
        <li>To send account emails, such as password reset links.</li>
        <li>To protect the website against misuse.</li>
      </ul>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        We use only the cookies the site needs to work: a sign-in cookie that keeps members logged in, and a cookie
        that remembers your light or dark theme. We do not use advertising or tracking cookies.
      </p>
    ),
  },
  {
    title: "Services we use",
    body: (
      <ul>
        <li>Our own server, where the website and its database are hosted.</li>
        <li>Brevo, to deliver account emails such as password resets.</li>
        <li>Google Drive, to store daily backups of the website database.</li>
        <li>Map tiles from Esri (ArcGIS) on the mission map, and embedded YouTube videos on some pages.</li>
      </ul>
    ),
  },
  {
    title: "Sharing",
    body: (
      <p>
        We do not sell or rent personal information. We share it only with the services above, so they can do their
        part, or when the law requires it.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        Enquiries are kept as long as needed to answer and follow up. Member accounts are kept while the account is
        active. Backups are deleted automatically after 30 days.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <p>
        You can ask to see, correct or delete the personal information we hold about you by writing to{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. Members can also update their profile from
        their dashboard.
      </p>
    ),
  },
  {
    title: "Changes",
    body: <p>If this policy changes, we will update this page and the date below.</p>,
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        id="privacy"
        kicker="Your information"
        title="Privacy Policy"
        summary={`How the ${site.name} website collects, uses and protects personal information.`}
      />

      <section className="bg-white px-4 py-16 text-[#023e8a] sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="font-heading text-2xl font-semibold text-[#023e8a]">{section.title}</h2>
              <div className="mt-3 space-y-3 leading-7 text-[#3d4b59] [&_a]:font-semibold [&_a]:text-[#0e98ac] [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
                {section.body}
              </div>
            </article>
          ))}
          <p className="border-t border-[#d5dee6] pt-6 text-sm text-[#5c6b7a]">
            Last updated {UPDATED}. Questions? <Link href="/contact" className="font-semibold text-[#0e98ac]">Contact us</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
