export const site = {
  name: "Oblate Province of Jaffna",
  shortName: "OMI Jaffna",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://omijaffna.com").replace(/\/$/, ""),
  foundingYear: "1847",
  congregation: "Missionary Oblates of Mary Immaculate",
  tagline: "17 Ministries. Many Places. One Mission.",
  years: "1847–2026",
  description:
    "Discover the Oblate Province of Jaffna — 1847–2026. Explore our charism, mission, ministries, history, formation, parishes, international mission and news.",
  contact: {
    address: "657/1 Hospital Road, Jaffna",
    phone: "021-2222721",
    phoneHref: "tel:+94212222721",
    email: "omi.jafprovince@gmail.com",
  },
  familyPortal: {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    colombo: "https://omicolombo.org/",
    world: "https://www.omiworld.org/",
  },
  social: {
    facebook: "https://www.facebook.com/omi.jaffna.1",
    instagram: "https://www.instagram.com/omi_jaffna/",
    youtube: "https://www.youtube.com/@oblatejaffnatv",
  },
  assets: {
    logos: {
      left: "/logos/logo_1.png",
      right: "/logos/Logo%20-%20OMI%20-%20Jaffna.png",
    },
    video: {
      hero: "/video/hero.mp4",
    },
  },
} as const

export type SiteConfig = typeof site
