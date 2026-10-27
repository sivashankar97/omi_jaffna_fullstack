import { site } from "@/config/site"

export type ContactHouse = {
  name: string
  place: string
  address: string
  kind: string
  phone: string
  email: string
  mapLink: string
}

function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Sri Lanka`)}`
}

/** Defaults for the `site-info` CMS block — Contact page, footer, Home contact, social. */
export const siteInfoDefaults = {
  contact: {
    officeName: "Thodarpaham, Provincial House",
    address: site.contact.address,
    city: "Jaffna, Sri Lanka",
    phone: site.contact.phone,
    phoneHref: site.contact.phoneHref,
    email: site.contact.email,
    mapLink: mapsLink(site.contact.address),
    hours: "Weekdays · Province office hours",
  },
  /** All Oblate houses & formation communities shown on Contact. Fully editable in CMS. */
  houses: [
    {
      name: "OMI Provincial House – Thodarpaham",
      place: "Jaffna",
      address: "657/1, Hospital Road, Jaffna",
      kind: "Provincial House",
      phone: site.contact.phone,
      email: site.contact.email,
      mapLink: mapsLink("657/1, Hospital Road, Jaffna"),
    },
    {
      name: "Amala Utpavam",
      place: "Columbuthurai, Jaffna",
      address: "Swamiyar Veethi, Columbuthurai, Jaffna",
      kind: "Community house",
      phone: "",
      email: "",
      mapLink: mapsLink("Swamiyar Veethi, Columbuthurai, Jaffna"),
    },
    {
      name: "St Joseph’s OMI Seminary",
      place: "Columbuthurai, Jaffna",
      address: "Swamiyar Road / Swamiyar Veethi, Columbuthurai, Jaffna",
      kind: "Formation",
      phone: "",
      email: "",
      mapLink: mapsLink("Swamiyar Veethi, Columbuthurai, Jaffna"),
    },
    {
      name: "Vasanthaham – De Mazenod Scholasticate",
      place: "Columbuthurai, Jaffna",
      address: "Swamiyar Veethi, Columbuthurai, Jaffna",
      kind: "Formation",
      phone: "",
      email: "",
      mapLink: mapsLink("Swamiyar Veethi, Columbuthurai, Jaffna"),
    },
    {
      name: "Gnanodhayam",
      place: "Keeri, Mannar",
      address: "Thalvupadu Road, Keeri, Mannar",
      kind: "Formation",
      phone: "",
      email: "",
      mapLink: mapsLink("Thalvupadu Road, Keeri, Mannar"),
    },
    {
      name: "Eugene Nivasa / OMI Fathers’ House",
      place: "Avissawella",
      address: "No. 956/1, Ratnapura Road, Dehiyahapitiya, Avissawella",
      kind: "Community & retired care",
      phone: "",
      email: "",
      mapLink: mapsLink("No. 956/1, Ratnapura Road, Dehiyahapitiya, Avissawella"),
    },
  ] satisfies ContactHouse[],
  social: {
    facebook: site.social.facebook,
    instagram: site.social.instagram,
    youtube: site.social.youtube,
  },
  logos: {
    headerImage: site.assets.logos.left,
    emblemImage: site.assets.logos.right,
  },
  newsImage: "/Herosection/Heroimage_3.jpg",
}

export type SiteInfo = typeof siteInfoDefaults

/** CMS uploads: `/api/files/…` or direct Supabase Storage public URLs. */
export const isUpload = (src: string) =>
  src.startsWith("/api/") ||
  /\/api\/files\//.test(src) ||
  /\.supabase\.co\/storage\/v1\/object\/public\//.test(src)
