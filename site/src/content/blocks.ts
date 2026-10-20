import { charismHero, charismIdentity, charismMotto, charismPriorities } from "@/content/charism"
import { briefHistory, development, whoWeAre } from "@/content/history"
import { journeyEras } from "@/content/journey"
import { siteInfoDefaults } from "@/content/site-info"

/**
 * Website text the CMS can edit. Each block is stored on the CMS "page" entry whose slug is the
 * block id (in `metadata.sections`); anything not edited there falls back to these defaults.
 * The CMS builds its forms from the shape of these defaults (served at /cms-blocks).
 */
export const homeSectionsDefaults = {
  welcome: {
    kicker: "Island-wide and abroad",
    stats: [
      { label: "Ceylon", value: "1847" },
      { label: "Jaffna", value: "1848" },
      { label: "Ministries", value: "17" },
    ],
    image: "/Herosection/Welcome.jpeg",
    imageAlt: "Oblate Media Ministry of the Oblate Province of Jaffna",
  },
  pillars: {
    kicker: "What guides us",
    title: "Our calling",
    items: [
      {
        title: "Charism",
        text: "Evangelizing the poor. Presence, accompaniment, education, compassion, justice, reconciliation and service.",
        href: "/charism",
      },
      {
        title: "Mission",
        text: "Empowered by the Good News, we work for a healing society in and through the light of the Good News.",
        href: "/charism#mission",
      },
      { title: "Vision", text: "A life towards a renewed, just and free society.", href: "/charism#vision" },
    ],
  },
  ministries: { title: "Ministries", kicker: "Seventeen ways of serving" },
  paths: [
    {
      kicker: "Formation",
      title: "A life given to mission",
      text: "Prayer, study and community at Colombuthurai, Keeri and Ampitiya, and formation houses abroad.",
      href: "/vocations",
    },
    {
      kicker: "Beyond the island",
      title: "Missionaries sent abroad",
      text: "Oblates of this Province serve in Mexico, Kenya, Europe, Australia, Pakistan and other missions.",
      href: "/international",
    },
    {
      kicker: "Province office",
      title: "Write to Jaffna",
      text: "657/1 Hospital Road, Jaffna. The Province office answers vocation, parish and publication enquiries.",
      href: "/contact",
    },
  ],
  news: { title: "Latest news", kicker: "From the Province" },
  media: {
    title: "Media",
    kicker: "Live · Events · Photos",
    liveTitle: "Oblate Jaffna TV",
    liveText: "Watch on the official YouTube channel of the Province",
    liveImage: "/Herosection/ministry_2.jpg",
    eventsTitle: "Events",
    eventsText: "Feasts, gatherings and celebrations",
    eventsImage: "/news/img_2.jpg",
    photos: ["/news/img_4.jpg", "/news/img_6.jpg", "/news/img_8.jpg"],
  },
  family: {
    title: "One congregation",
    kicker: "Jaffna, with the wider Oblate family",
    text: "Official notices from this Province are published on the News page. The General Administration and the Colombo Province each keep their own sites.",
  },
  joinUs: {
    title: "Join us",
    kicker: "Walk with the Oblates",
    oblate: {
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
    },
    associate: {
      label: "Be an Oblate Lay Associate",
      title: "Be an Oblate Lay Associate",
      tagline: "Live the charism in your everyday life.",
      text: "You do not need to take religious vows to share in our mission. We warmly invite laypeople, men and women, married and single, to join the wider Oblate family as Lay Associates. As an Associate you carry the spirit of St. Eugene de Mazenod into your family, your workplace and your community, through prayer, support for youth ministry, or work for justice and the poor.",
      close: "Come, share in our mission and walk the Emmaus journey with us.",
      interests: ["Prayer", "Youth ministry", "Justice and the poor"],
    },
  },
  contact: {
    kicker: "Provincial House",
    title: "Contact us",
    text: "Thodarpaham, Jaffna. Write to us or visit the Province office.",
  },
}

export const mediaPageDefaults = {
  topImage: "/Herosection/Welcome.jpeg",
  topImageAlt: "Oblate Media Ministry, OMI Jaffna Province",
  videoImage: "/Herosection/Heroimage_2.jpg",
  gallery: [
      {
        src: "/Herosection/Heroimage_2.jpg",
        alt: "A jubilee arch of the Oblate Province of Jaffna",
        caption: "Jubilee arch marked OMI 200. Province collection.",
      },
      {
        src: "/Herosection/Heroimage_3.jpg",
        alt: "The flag of the Oblate Province of Jaffna",
        caption: "The flag of the Oblate Province of Jaffna.",
      },
      {
        src: "/Herosection/Missionary_section.jpg",
        alt: "The missionary emblem of the Oblate Province of Jaffna",
        caption: "Missionary emblem with the Oblate seal.",
      },
      {
        src: "/Herosection/Heroimage_1.jpg",
        alt: "Oblate cross and the words Evangelizare pauperibus misit me",
        caption: "The Oblate cross and the words Evangelizare pauperibus misit me.",
      },
      {
        src: "/Herosection/Welcome.jpeg",
        alt: "Oblate Media Ministry of the Oblate Province of Jaffna",
        caption: "Mark of the Oblate Media Ministry.",
      },
      {
        src: "/logos/logo_2.png",
        alt: "Emblem of the Oblate Province of Jaffna",
        caption: "Emblem of the Oblate Province of Jaffna.",
      },
    ],
}

export const blocks = {
  home: {
    label: "Top banner video and image",
    defaults: { hero: { posterImage: "/Herosection/Heroimage_4.jpg", video: "/video/Hero_section.mp4" } },
  },
  "site-info": { label: "Footer, contact and social links", defaults: siteInfoDefaults },
  "home-sections": { label: "Home page sections", defaults: homeSectionsDefaults },
  journey: { label: "Our journey timeline", defaults: { eras: journeyEras } },
  "media-page": { label: "Media page photos", defaults: mediaPageDefaults },
  history: {
    label: "History page sections",
    defaults: {
      images: {
        heroImage: "/Herosection/Heroimage_4.jpg",
        familyImage: "/Administration.jpg",
        familyImageAlt: "Oblates united in prayer around the Word of God",
        historyImage: "/Herosection/Heroimage_2.jpg",
      },
      whoWeAre,
      briefHistory,
      development,
    },
  },
  charism: {
    label: "Charism page sections",
    defaults: {
      images: {
        identityImage: "/Herosection/Heroimage_4.jpg",
        identityImageAlt: "Oblate church in Jaffna",
        crossImage: "/Herosection/Cross_vision.png?v=3",
      },
      hero: charismHero,
      identity: charismIdentity,
      priorities: charismPriorities,
      motto: charismMotto,
    },
  },
}

export type BlockId = keyof typeof blocks
export type BlockContent<K extends BlockId> = (typeof blocks)[K]["defaults"]
export type HomeSectionsContent = typeof homeSectionsDefaults

/** Edited values over defaults. Lists are replaced as a whole; empty text keeps the default. */
export function mergeContent<T>(base: T, edit: unknown): T {
  if (edit === undefined || edit === null) return base
  if (Array.isArray(base)) return (Array.isArray(edit) ? edit : base) as T
  if (base && typeof base === "object") {
    if (typeof edit !== "object" || Array.isArray(edit)) return base
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [key, value] of Object.entries(edit as Record<string, unknown>)) {
      out[key] = key in out ? mergeContent(out[key], value) : value
    }
    return out as T
  }
  if (typeof edit === "string" && !edit.trim()) return base
  return (base === undefined || typeof edit === typeof base ? edit : base) as T
}
