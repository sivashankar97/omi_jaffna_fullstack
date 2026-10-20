import { site } from "@/config/site"

export const siteInfoDefaults = {
  contact: {
    address: site.contact.address,
    phone: site.contact.phone,
    phoneHref: site.contact.phoneHref,
    email: site.contact.email,
    mapLink: "https://www.google.com/maps/search/?api=1&query=657%2F1+Hospital+Road+Jaffna",
  },
  social: { ...site.social },
  logos: {
    headerImage: site.assets.logos.left,
    emblemImage: site.assets.logos.right,
  },
  newsImage: "/Herosection/Heroimage_3.jpg",
}

export type SiteInfo = typeof siteInfoDefaults

/** CMS uploads are served by the API, which the Next image optimizer cannot fetch on Netlify. */
export const isUpload = (src: string) => src.startsWith("/api/")
