import { site } from "@/config/site"
import type { SiteInfo } from "@/content/site-info"

const profileUrl = (value: string) =>
  /^https:\/\//.test(value) && !/facebook\.com\/share\/|wa\.me\//.test(value)

export function OrganizationJsonLd({ info }: { info: SiteInfo }) {
  const sameAs = [...new Set([...Object.values(site.social), ...Object.values(info.social)].filter(profileUrl))]
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ReligiousOrganization"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: [site.shortName, "OMI Jaffna Province"],
    url: site.url,
    logo: `${site.url}${site.assets.logos.right}`,
    description: site.description,
    foundingDate: site.foundingYear,
    email: info.contact.email || site.contact.email,
    telephone: (info.contact.phoneHref || site.contact.phoneHref).replace(/^tel:/, ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: info.contact.address || site.contact.address,
      addressLocality: "Jaffna",
      addressCountry: "LK",
    },
    parentOrganization: {
      "@type": "ReligiousOrganization",
      name: site.congregation,
      url: site.familyPortal.world,
    },
    sameAs,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
