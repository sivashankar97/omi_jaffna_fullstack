import {
  charismHero,
  charismIdentity,
  charismMission,
  charismMotto,
  charismPriorities,
  charismVision,
} from "@/content/charism"
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
    badge: "Welcome",
    eyebrow: "Oblate Province of Jaffna",
    title: "Welcome home to mission",
    highlight: "home",
    lede: "Presence, charism and ministries across Sri Lanka and abroad — one Oblate family serving the most abandoned.",
    cards: [
      {
        badge: "Presence",
        title: "Island-wide and abroad — houses, parishes and missions in one family.",
        image: "/Herosection/Welcome.jpeg",
        href: "/history",
        tone: "teal",
      },
      {
        badge: "Charism",
        title: "Evangelizing the poor through presence, accompaniment and service.",
        image: "/Herosection/Ministry_1.jpg",
        href: "/charism",
        tone: "teal",
      },
      {
        badge: "Ministries",
        title: "Seventeen ways of serving — education, media, justice and formation.",
        image: "/Herosection/ministry_2.jpg",
        href: "/ministries",
        tone: "gold",
      },
    ],
  },
  inspiration: {
    kicker: "Daily inspiration",
    quote: "Leave nothing undared for the Kingdom of God.",
    attribution: "St. Eugene de Mazenod",
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
    text: "Thodarpaham, 657/1 Hospital Road, Jaffna. Write, call, or visit — and see all Oblate house addresses on the Contact page.",
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
      archive: {
        kicker: "Historical archive",
        title: "Remembering those who went before",
        subtitle: "The Province necrology and the published year-by-year journey of the Oblates in Sri Lanka.",
        journeyTitle: "The journey, year by year",
        journeyIntro: "Open a year. The line is the published journey of the Oblate Province of Jaffna.",
      },
      necrology: {
        kicker: "In memoriam",
        title: "Oblates who served in Ceylon and Jaffna",
        lede: "The register of {count} Oblate bishops, priests, brothers and scholastics who gave their lives to the mission on this island, from {first} to {last}. Eternal rest grant unto them, O Lord.",
        countLabel: "Oblates",
        firstLabel: "First entry",
        latestLabel: "Latest",
        footnote: "Scroll inside the register to see every name. Dates are written day, month, year, as in the Province list.",
        emptyTitle: "No name matches that search.",
        emptyHint: "Check the spelling, or try a place such as Jaffna or Mannar.",
        emptyFilteredHint: "A role or era filter is also on. Search the whole register instead.",
      },
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
      mission: charismMission,
      vision: charismVision,
      motto: charismMotto,
    },
  },
  leadership: {
    label: "Leadership page sections",
    defaults: {
      hero: {
        kicker: "Province leadership",
        title: "Leadership",
        summary:
          "From Thodarpaham in Jaffna, the Provincial Superior and Council coordinate the missionary life of the Province. Administration exists to enable mission.",
      },
      superior: {
        kicker: "Provincial Superior",
        title: "Our Provincial Leader",
      },
    },
  },
  ministries: {
    label: "Ministries page sections",
    defaults: {
      hero: {
        kicker: "Our ministries",
        title: "Many places. One mission.",
        summary:
          "From parishes and schools to youth centres, counselling, rehabilitation, peacebuilding, community development, formation and diaspora ministry.",
        ministriesLabel: "Ministries",
        parishesLabel: "Parishes",
        missionValue: "1",
        missionName: "Mission",
      },
    },
  },
  international: {
    label: "International page sections",
    defaults: {
      hero: {
        kicker: "The mission comes full circle",
        title: "Missionaries once came here. Now the Province also sends.",
        summary:
          "Oblates from the Province serve abroad. Open a country to see missions and photos. Diaspora chaplaincy and formation abroad continue the same charism.",
        countriesValue: "14",
        countriesLabel: "Countries",
        continentsValue: "5",
        continentsLabel: "Continents",
        studyAbroadValue: "3",
        studyAbroadLabel: "Study abroad",
      },
      category1: {
        kicker: "Category 1",
        title: "Category 1 countries",
        subtitle: "Mission countries in this group — edit the list anytime in the CMS.",
      },
      category2: {
        kicker: "Category 2",
        title: "Category 2 countries",
        subtitle: "Mission countries in this group — edit the list anytime in the CMS.",
      },
      countryCardCta: "View missions & photos",
      formation: {
        kicker: "Formation abroad",
        title: "Formation beyond Sri Lanka",
        subtitle:
          "Young Oblates are also formed in international communities, preparing them for a mission without borders.",
      },
      closing: {
        quote: "Go into all the world and proclaim the Good News to the whole creation.",
        reference: "Mark 16:15",
        ctaLabel: "Connect with our missionaries",
        ctaHref: "/contact",
      },
    },
  },
  library: {
    label: "Library page sections",
    defaults: {
      hero: {
        kicker: "Province library",
        title: "Read. Reflect. Download.",
        summary:
          "Magazines, Oblate library collections, new book releases and articles — published for the Province and available as PDF.",
        magazinesLabel: "Magazine issues",
        librariesLabel: "Library titles",
        booksLabel: "New releases",
        articlesLabel: "Articles",
        collectionsKicker: "Collections",
        collectionsTitle: "Four doors into the Province library",
      },
      magazine: {
        cardTitle: "Magazine",
        cardDescription: "Province magazines by title — open an issue and download the PDF.",
        cardCta: "Browse magazines",
        pageKicker: "Library · Magazine",
        pageTitle: "Magazines",
        pageSummary: "Browse by magazine title. Open a PDF to read or download an issue.",
        empty: "No magazine issues published yet.",
      },
      libraries: {
        cardTitle: "Libraries",
        cardDescription: "Books from each Oblate library collection.",
        cardCta: "Browse libraries",
        pageKicker: "Library · Libraries",
        pageTitle: "Libraries",
        pageSummary: "Books from each Oblate library. Download PDFs when published.",
        empty: "No library books published yet.",
      },
      books: {
        cardTitle: "Books",
        cardDescription: "New book releases from the Province.",
        cardCta: "Browse new releases",
        pageKicker: "Library · Books",
        pageTitle: "New book releases",
        pageSummary: "Recently released books. Download the PDF when available.",
        empty: "No new book releases published yet.",
      },
      articles: {
        cardTitle: "Articles",
        cardDescription: "Articles and papers available as PDF downloads.",
        cardCta: "Browse articles",
        pageKicker: "Library · Articles",
        pageTitle: "Articles",
        pageSummary: "Articles and papers from the Province.",
        empty: "No articles published yet.",
      },
      downloadLabel: "Download PDF",
      comingSoonLabel: "PDF coming soon",
      backLabel: "Back to Library",
      closing: {
        quote: "A library is a place where hope and knowledge meet.",
        ctaLabel: "Contact the Province",
        ctaHref: "/contact",
      },
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
