import {
  charismHero,
  charismIdentity,
  charismMission,
  charismMotto,
  charismPriorities,
  charismVision,
  coreCommitments,
  missionaryFamily,
} from "@/content/charism"
import { briefHistory, development, whoWeAre } from "@/content/history"
import { journeyEras } from "@/content/journey"
import { siteInfoDefaults } from "@/content/site-info"

/**
 * Website text the CMS can edit. Each block is stored on the CMS "page" entry whose slug is the
 * block id (in `metadata.sections`); anything not edited there falls back to these defaults.
 * The CMS builds its forms from the shape of these defaults (served at /cms-blocks).
 */
export const homeWelcomeDefaults = {
  badge: "Welcome",
  eyebrow: "Oblate Province of Jaffna",
  title: "A missionary family since 1847",
  lede: "From the arrival of the first Oblates to today's houses, parishes and missions — one family serving the most abandoned in Sri Lanka and abroad.",
  mainImage: "/Herosection/welcome-church-sunset.jpg",
  mainImageAlt: "White church on a tropical hillside at golden sunset",
  buttonLabel: "Begin exploring",
  buttonHref: "/history",
  openLabel: "Open",
  cards: [
    {
      badge: "Presence",
      title: "Island-wide and abroad — houses, parishes and missions in one family.",
      image: "/Herosection/Welcome.jpeg",
      href: "/history",
    },
    {
      badge: "Charism",
      title: "Evangelizing the poor through presence, accompaniment and service.",
      image: "/Herosection/Ministry_1.jpg",
      href: "/charism",
    },
    {
      badge: "Ministries",
      title: "Seventeen ways of serving — education, media, justice and formation.",
      image: "/Herosection/ministry_2.jpg",
      href: "/ministries",
    },
  ],
}

export const homeSectionsDefaults = {
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
  hero: {
    kicker: "Digital mission",
    title: "The screen is also a mission field",
    summary:
      "Technology should serve evangelization, human dignity and community. The church, the village, the school and the smartphone are all places where the Gospel can be shared.",
    cta: "Explore our media",
    ctaHref: "#social-signals",
  },
  social: {
    kicker: "Live channels",
    title: "Follow the Province online",
    summary:
      "Watch, follow and share — YouTube, Instagram and Facebook are the public channels of the Oblate Province of Jaffna.",
    youtubeHandle: "Oblate Jaffna TV",
    youtubeText: "The official channel. Programmes are published there, including நற்கருணை ஆராதனை.",
    youtubeAction: "Watch on YouTube",
    instagramHandle: "@omi_jaffna",
    instagramText: "Photographs and short notes from the Province account.",
    instagramAction: "Follow on Instagram",
    facebookHandle: "Province page",
    facebookText: "The public Facebook page shared for this Province.",
    facebookAction: "Open Facebook",
  },
  desks: {
    kicker: "Media desks",
    title: "Eight ways into the same mission",
    summary: "Choose a desk. Photographs are from the Province collection, not frames of one event.",
    tabs: [
      { panel: "photo-gallery", label: "Photo gallery" },
      { panel: "video", label: "Video" },
      { panel: "podcasts", label: "Podcasts" },
      { panel: "songs", label: "Songs" },
      { panel: "articles", label: "Articles" },
      { panel: "interviews", label: "Interviews" },
      { panel: "homilies-and-reflections", label: "Homilies and reflections" },
      { panel: "testimonials", label: "Testimonials" },
    ],
  },
  videos: {
    intro: "",
    channelTitle: "Oblate Jaffna TV",
    channelText: "Open the official YouTube channel of the Province.",
    notes: [
      { title: "Channel", text: "Oblate Jaffna TV, the official YouTube channel of the Oblate Province of Jaffna." },
      { title: "On the channel", text: "நற்கருணை ஆராதனை is one programme listed there." },
      { title: "Write", text: "{email}" },
    ],
    items: [
      {
        title: "",
        category: "",
        url: "",
        thumbnail: "",
        description: "",
        date: "",
      },
    ],
  },
  podcasts: {
    intro:
      "A podcast series has not been published yet. The rows below are the public voices already named by the Province: the channel, the bulletin and the magazines.",
    items: [
      {
        title: "Oblate Jaffna TV",
        category: "Watch",
        description: "The official YouTube channel of the Province. New programmes are published there.",
        url: "youtube",
        audio: "",
        coverImage: "",
        date: "",
      },
      {
        title: "Yazha-Thoni",
        category: "Read",
        description: "The official news bulletin of the Oblate Province of Jaffna. The Lyre Boat.",
        url: "/media#publications",
        audio: "",
        coverImage: "",
        date: "",
      },
      {
        title: "Zeal",
        category: "Read",
        description: "A scholastic publication of reflections, articles and community news.",
        url: "/media#publications",
        audio: "",
        coverImage: "",
        date: "",
      },
      {
        title: "Naan",
        category: "Read",
        description: "A Tamil magazine of the Province for personal growth, reflection and community life.",
        url: "/media#publications",
        audio: "",
        coverImage: "",
        date: "",
      },
    ],
  },
  songs: {
    intro: "Hymns and songs of the Province. Press play to listen.",
    emptyText: "Songs will be added here as they are approved for the website.",
    items: [
      {
        title: "",
        category: "",
        artist: "",
        description: "",
        audio: "",
        coverImage: "",
        url: "",
        date: "",
      },
    ],
  },
  articles: {
    intro: "",
    ctaLabel: "Open the full report",
  },
  interviews: {
    intro: "No recorded interview is published on this page. The answers are the Province’s own published lines.",
    items: [
      {
        q: "Who is speaking?",
        a: "The Oblate Province of Jaffna, part of the Missionary Oblates of Mary Immaculate. These lines are published Province statements, not a recorded interview.",
      },
      {
        q: "When did the mission reach this island?",
        a: "The Oblate missionary presence in Sri Lanka began in 1847. The first Oblates reached Jaffna in 1848.",
      },
      {
        q: "What is the charism?",
        a: "Evangelizing the poor. Presence, accompaniment, education, compassion, justice, reconciliation and service.",
      },
      {
        q: "What is the mission?",
        a: "Empowered by the Good News, we work for a healing society in and through the light of the Good News.",
      },
      { q: "What is the vision?", a: "A life towards a renewed, just and free society." },
      {
        q: "Who leads the Province now?",
        a: "Very Rev. Fr. Paul Jeyanthan Pachchek, OMI, Provincial Superior, 2023–2026. The house is Thodarpaham, 657/1 Hospital Road, Jaffna.",
      },
    ],
  },
  readings: {
    intro: "Homily manuscripts are not published here. These are the texts the Province already gives for prayer and mission.",
    items: [
      { kicker: "The sending", text: "{homeQuote}", audio: "" },
      { kicker: "The journey", text: "{homeLede}", audio: "" },
      {
        kicker: "Charism",
        text: "Evangelizing the poor. Presence, accompaniment, education, compassion, justice, reconciliation and service.",
        audio: "",
      },
      {
        kicker: "Mission",
        text: "Empowered by the Good News, we work for a healing society in and through the light of the Good News.",
        audio: "",
      },
      { kicker: "Vision", text: "A life towards a renewed, just and free society.", audio: "" },
    ],
  },
  testimonials: {
    intro:
      "Personal testimonies are not published until a person has agreed to the words. Until then, this desk lists the ministries through which the Province already serves.",
    items: [{ name: "", place: "", text: "", image: "" }],
  },
  publications: {
    kicker: "Read",
    title: "Publications of the Province",
    summary: "Covers, editions and downloads will be added as each issue is approved for the website.",
  },
  topImage: "/Herosection/Welcome.jpeg",
  topImageAlt: "Oblate Media Ministry, OMI Jaffna Province",
  videoImage: "/Herosection/Heroimage_2.jpg",
  gallery: [
    {
      src: "/Herosection/Heroimage_2.jpg",
      alt: "A jubilee arch of the Oblate Province of Jaffna",
      caption: "Jubilee arch marked OMI 200. Province collection.",
      category: "",
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

export const newsPageDefaults = {
  ceremonies: {
    kicker: "General event dates",
    title: "OMI ceremonies",
    summary:
      "Feasts, foundations and remembrances the Oblate family keeps every year. Pick a month or a date to see the ceremony.",
    items: [
      {
        month: 1,
        day: 25,
        title: "Foundation of the Congregation",
        since: "1816",
        category: "Liturgical Feasts & Foundations",
        description: "",
      },
      {
        month: 2,
        day: 17,
        title: "Papal Approval of the OMI Constitutions and Rules by Pope Leo XII",
        since: "1826",
        category: "Liturgical Feasts & Foundations",
        description: "",
      },
      {
        month: 5,
        day: 21,
        title: "Feast of St. Eugene de Mazenod",
        since: "",
        category: "Liturgical Feasts & Foundations",
        description: "Founder of the OMI.",
      },
      {
        month: 12,
        day: 8,
        title: "Feast of the Immaculate Conception",
        since: "",
        category: "Liturgical Feasts & Foundations",
        description: "Principal Patroness of the Congregation.",
      },
      {
        month: 5,
        day: 29,
        title: "Feast of Blessed Joseph Gérard",
        since: "",
        category: "Oblate Saints, Blesseds & Martyrs",
        description: "Apostle of Lesotho.",
      },
      {
        month: 6,
        day: 12,
        title: "Feast of Blessed Józef Cebula",
        since: "",
        category: "Oblate Saints, Blesseds & Martyrs",
        description: "Martyr of World War II.",
      },
      {
        month: 9,
        day: 4,
        title: "Feast of the Blessed Martyrs of Laos",
        since: "",
        category: "Oblate Saints, Blesseds & Martyrs",
        description: "Including the OMI martyrs.",
      },
      {
        month: 11,
        day: 28,
        title: "Feast of the Blessed Martyrs of Spain",
        since: "",
        category: "Oblate Saints, Blesseds & Martyrs",
        description: "The Oblate Martyrs of Pozuelo.",
      },
      {
        month: 11,
        day: 3,
        title: "Annual Requiem Mass for all deceased Oblates",
        since: "",
        category: "Remembrances & Regional Dates",
        description: "",
      },
      {
        month: 11,
        day: 10,
        title: "Anniversary of Fr. Michael Rodrigo, OMI",
        since: "",
        category: "Remembrances & Regional Dates",
        description: "Sri Lankan Oblate Martyr.",
      },
    ],
  },
}

export const vocationsDefaults = {
  hero: {
    kicker: "Vocations",
    title: "A call to give one’s life in service of the Gospel",
    summary:
      "The Province accompanies those who discern this call through prayer, study, community life, pastoral experience, spiritual direction and missionary formation.",
    primaryCta: "Talk to the vocation team",
    primaryHref: "/contact",
    secondaryCta: "The formation journey",
    secondaryHref: "#formation-journey",
  },
  signs: {
    kicker: "Is God calling you?",
    title: "Signs of a missionary vocation",
    subtitle: "A vocation is rarely a sudden voice. It often grows quietly through desires like these.",
    items: [
      {
        title: "Love for Christ",
        text: "A desire to know Jesus more deeply and to follow him with your whole life.",
      },
      {
        title: "Heart for the poor",
        text: "Being moved by the suffering of people and wanting to stand with them.",
      },
      {
        title: "Joy in community",
        text: "Finding life in sharing prayer, work and mission with brothers.",
      },
      {
        title: "Readiness to go",
        text: "Openness to be sent wherever the Gospel and the people need you most.",
      },
    ],
  },
  journey: {
    kicker: "Formation houses",
    title: "The formation journey",
    subtitle: "Step by step, candidates grow in prayer, study, community and mission.",
    stageNotes: [
      {
        match: "Juniorate",
        stage: "First steps",
        text: "Young men begin to discover community life, prayer and study while completing their education.",
      },
      {
        match: "Pre-Novitiate",
        stage: "Discernment",
        text: "A year of deeper discernment, spiritual direction and preparation for religious life.",
      },
      {
        match: "De Mazenod",
        stage: "Philosophy",
        text: "Philosophical studies, pastoral exposure and growth in the Oblate missionary spirit.",
      },
      {
        match: "Oblate Scholasticate",
        stage: "Theology",
        text: "Theological formation and missionary preparation toward final vows and priesthood.",
      },
    ],
  },
  discernment: {
    kicker: "Begin the conversation",
    title: "Begin with prayer and conversation",
    steps: [
      {
        title: "Pray",
        text: "Bring the question to God in silence, Scripture and the Eucharist.",
      },
      {
        title: "Talk",
        text: "Speak with an Oblate, your parish priest or the vocation team.",
      },
      {
        title: "Come and see",
        text: "Visit a formation house and share in community life for a few days.",
      },
    ],
    primaryCta: "Contact the vocation team",
    primaryHref: "/contact",
    secondaryCta: "Read the charism",
    secondaryHref: "/charism",
  },
}

export const blocks = {
  home: {
    label: "Top banner video and image",
    defaults: { hero: { posterImage: "/Herosection/Heroimage_4.jpg", video: "/video/Hero_section.mp4" } },
  },
  "site-info": { label: "Footer, contact and social links", defaults: siteInfoDefaults },
  "home-welcome": {
    label: "Welcome section (below the top banner)",
    defaults: homeWelcomeDefaults,
    labels: {
      title: "Title",
      mainImage: "Main photo (large card on the left)",
      mainImageAlt: "Main photo description (for screen readers)",
      image: "Card photo",
      href: "Card link (e.g. /charism)",
    },
  },
  "home-sections": { label: "Home page sections", defaults: homeSectionsDefaults },
  journey: { label: "Our journey timeline", defaults: { eras: journeyEras } },
  "media-page": { label: "Media page text & photos", defaults: mediaPageDefaults },
  "news-page": { label: "News page — OMI ceremonies calendar", defaults: newsPageDefaults },
  vocations: { label: "Vocations page sections", defaults: vocationsDefaults },
  history: {
    label: "History page sections",
    defaults: {
      images: {
        heroImage: "/Herosection/Heroimage_4.jpg",
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
        familyImage: "/Administration.jpg",
        familyImageAlt: "Oblates united in prayer around the Word of God",
      },
      hero: charismHero,
      missionaryFamily,
      coreCommitments,
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
        collectionsTitleAccent: "Province",
        latestKicker: "Latest",
        latestTitle: "Latest from the library",
        latestAllLabel: "All",
        latestMagazinesLabel: "Magazines",
        latestBooksLabel: "Books",
        latestArticlesLabel: "Articles",
        latestReleasesLabel: "New Releases",
        latestViewAllLabel: "View all",
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
      latestIssueLabel: "Latest issue",
      previousIssuesLabel: "Previous Issues",
      earlierIssuesKicker: "Earlier issues",
      previousIssuesSummaryPrefix: "Browse and download earlier issues of",
      pdfFormatLabel: "PDF Format",
      sampleIssueLabel: "Sample Issue",
      closing: {
        quote: "A library is a place where hope and knowledge meet.",
        quoteAccentWords: ["hope", "knowledge"],
        summary: "Discover resources, grow in faith, and be inspired for mission.",
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
