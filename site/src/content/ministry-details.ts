export type MinistryStory = {
  heading: string
  paragraphs: string[]
}

export type MinistryArticle = {
  title: string
  summary: string
  date: string
  href: string
  image?: string
}

export type MinistryPhoto = {
  src: string
  alt: string
  caption: string
}

export type MinistryVideo = {
  title: string
  url: string
  thumbnail: string
  caption: string
}

export type MinistryFutureEvent = {
  title: string
  date: string
  place: string
  summary: string
}

export type MinistrySectionContent = {
  history: MinistryStory[]
  articles: MinistryArticle[]
  photos: MinistryPhoto[]
  videos: MinistryVideo[]
  futureEvents: MinistryFutureEvent[]
}

/** One place under a ministry — shown as a tab, opens its own page. */
export type MinistryMajorSection = MinistrySectionContent & {
  listNo: string
  slug: string
  title: string
  place: string
  summary: string
  image: string
  group?: string
  /** Longer "About this place" paragraphs; empty uses a generated sentence. */
  about?: string[]
  /** "How the mission serves here"; empty uses the ministry's focus points. */
  focus?: string[]
  /** Google Maps (or other) link; empty searches the title + place. */
  mapUrl?: string
  contact?: { name?: string; role?: string; phone?: string; email?: string }
}

export type MinistryDetail = {
  tagline: string
  overview: string[]
  focus: string[]
  highlights: { value: string; label: string }[]
  scripture?: { text: string; reference: string }
  stories: MinistryStory[]
  majorSections: MinistryMajorSection[]
}

export const emptyMinistryDetail: MinistryDetail = {
  tagline: "",
  overview: [],
  focus: [],
  highlights: [],
  stories: [],
  majorSections: [],
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Sample content for every major-section tab (seeded into the CMS). */
function sectionBody(title: string, place: string): MinistrySectionContent {
  const where = place ? `${title}, ${place}` : title
  const loc = place || "the Province"
  return {
    history: [
      {
        heading: `Beginnings of ${title}`,
        paragraphs: [
          `${where} grew out of the Oblate Province of Jaffna’s call to walk with people on the margins. Early teams gathered for prayer, catechesis and practical help.`,
          `Over time the work at ${loc} settled into a steady pattern of presence — Oblates and lay collaborators sharing house, mission and hospitality.`,
        ],
      },
      {
        heading: "Growing with the community",
        paragraphs: [
          `Visits, formation of local leaders and partnership with nearby parishes shaped how ${title} serves today.`,
          "This sample history is placeholder text. Replace it in the CMS with confirmed Province notes when ready.",
        ],
      },
      {
        heading: "Mission today",
        paragraphs: [
          `Under the Provincial Superior, ${title} continues to serve through accompaniment, celebration of the sacraments where applicable, and care for the most abandoned.`,
        ],
      },
    ],
    articles: [
      {
        title: `A day at ${title}`,
        summary: `Field notes from a recent visit to ${where} — prayer, listening and small acts of care.`,
        date: "2026-09-18",
        href: "/news",
      },
      {
        title: "Partners who walk with us",
        summary: `How parish teams and collaborators sustain the mission at ${loc}.`,
        date: "2026-08-02",
        href: "/news",
      },
      {
        title: `Young people at ${title}`,
        summary: "Youth leaders share what draws them to serve with the Oblates.",
        date: "2026-06-14",
        href: "/news",
      },
    ],
    photos: [
      {
        src: "/Herosection/Ministry_1.jpg",
        alt: `${title} gathering`,
        caption: `${title}${place ? ` — ${place}` : ""}`,
      },
      {
        src: "/Herosection/ministry_2.jpg",
        alt: `${title} mission`,
        caption: "On mission",
      },
      {
        src: "/Herosection/ministry_3.jpg",
        alt: `${title} prayer`,
        caption: "Prayer and community",
      },
      {
        src: "/Herosection/Welcome.jpeg",
        alt: `${title} welcome`,
        caption: "Welcome and hospitality",
      },
    ],
    videos: [
      {
        title: `${title} — introduction`,
        url: "https://www.youtube.com/results?search_query=Oblate+Province+Jaffna",
        thumbnail: "/Herosection/Ministry_1.jpg",
        caption: "Sample clip — replace with a Province video link in the CMS",
      },
      {
        title: `Voices from ${loc}`,
        url: "https://www.youtube.com/results?search_query=Missionary+Oblates",
        thumbnail: "/Herosection/ministry_2.jpg",
        caption: "Placeholder video — update URL and thumbnail in the CMS",
      },
    ],
    futureEvents: [
      {
        title: `${title} day of recollection`,
        date: "2026-11-15",
        place: place || "Provincial House, Jaffna",
        summary: `A morning of prayer and sharing for those connected with ${title}.`,
      },
      {
        title: "Outreach weekend",
        date: "2026-12-06",
        place: loc,
        summary: "Visits, catechesis and community meals with local teams.",
      },
      {
        title: `${title} annual review`,
        date: "2027-01-24",
        place: "Province centre",
        summary: "Planning meeting for the year ahead — open to coordinators.",
      },
    ],
  }
}

type PlaceDef = { listNo: string; title: string; place: string; group?: string }

function toSections(places: PlaceDef[]): MinistryMajorSection[] {
  return places.map((p) => ({
    listNo: p.listNo,
    slug: `${p.listNo}-${slugify(p.title)}${p.place ? `-${slugify(p.place)}` : ""}`,
    title: p.title,
    place: p.place,
    group: p.group,
    summary: p.place ? `Serving from ${p.place}.` : "",
    image: "/Herosection/Ministry_1.jpg",
    ...sectionBody(p.title, p.place),
  }))
}

/** Province places under each CMS ministry title (user list, Oct 2026). */
export const provinceMinistryPlaces: Record<string, PlaceDef[]> = {
  Administration: [{ listNo: "01", title: "Thodarpaham", place: "Jaffna" }],
  "Mission Preaching": [{ listNo: "02", title: "Amathi Aham", place: "Vavuniya" }],
  "Hospital & Prison Chaplaincy": [
    { listNo: "1", title: "Teaching Hospital", place: "Jaffna" },
    { listNo: "2", title: "District Hospital", place: "Mannar" },
    { listNo: "3", title: "District Hospital", place: "Vavuniya" },
    { listNo: "4", title: "District Hospital", place: "Trincomalee" },
    { listNo: "5", title: "District Hospital", place: "Batticaloa" },
  ],
  "Formal Education": [
    { listNo: "1", title: "St Patrick's College", place: "", group: "Schools" },
    { listNo: "2", title: "St Anthony's Maha Vidyalayam", place: "Muthur", group: "Schools" },
    { listNo: "3", title: "Fatima School", place: "Mannar", group: "Schools" },
    { listNo: "4", title: "Kalmunai Carmel Fatima College", place: "Kalmunai", group: "Schools" },
    { listNo: "5", title: "Fatima Maha Vidyalayam", place: "Iranapalai", group: "Schools" },
    { listNo: "6", title: "St Anthony's Vidyalayam", place: "Colombo", group: "Schools" },
    { listNo: "7", title: "Kokkulai Singhala Vidyalayam", place: "", group: "Schools" },
    { listNo: "1", title: "OIHE – De Mazenod Campus", place: "Jaffna", group: "Institutes" },
    { listNo: "2", title: "Eugene Academy", place: "Mannar", group: "Institutes" },
    { listNo: "3", title: "College of Education", place: "Vavuniya", group: "Institutes" },
  ],
  "Non-Formal Education": [
    { listNo: "1", title: "Annai Illam", place: "Kilinochchi" },
    { listNo: "2", title: "OBTEC", place: "Kanakapuram, Kilinochchi" },
    { listNo: "3", title: "Amala Uthayam", place: "Uppuveli" },
    { listNo: "4", title: "Anjali Aham", place: "Point Pedro" },
  ],
  "Youth Animation": [{ listNo: "06", title: "Gnanatheepam Youth Empowerment Centre", place: "Ariyalai" }],
  "Children’s Animation": [{ listNo: "07", title: "Amala Annai Anpaham", place: "Mulangavil" }],
  "Children's Animation": [{ listNo: "07", title: "Amala Annai Anpaham", place: "Mulangavil" }],
  "Parish Ministry": [
    { listNo: "1", title: "Maniyam Thoddam Parish", place: "Jaffna" },
    { listNo: "2", title: "Kanakarayankulam Parish", place: "Vavuniya" },
    { listNo: "3", title: "Hapurugala Parish", place: "Ratnapura" },
    { listNo: "4", title: "St. Jude Parish", place: "Pasara" },
    { listNo: "5", title: "Muthur Parish", place: "Trincomalee" },
    { listNo: "6", title: "Anthoniyarpuram Parish", place: "Mannar" },
    { listNo: "7", title: "Akkarayan Parish", place: "Kilinochchi" },
    { listNo: "8", title: "Thachanamadhu Parish", place: "Mannar" },
    { listNo: "9", title: "Anninganda Parish", place: "Galle" },
    { listNo: "10", title: "Kokkulai Parish", place: "Mullaitivu" },
    { listNo: "11", title: "Thirukovil Parish", place: "Batticaloa" },
    { listNo: "12", title: "Sambalthevu Parish", place: "Trincomalee" },
  ],
  Formation: [
    { listNo: "1", title: "St. Joseph's Juniorate", place: "Colombuthurai" },
    { listNo: "2", title: "Pre-novitiate", place: "Keeri" },
    { listNo: "3", title: "De Mazenod Scholasticate", place: "Colombuthurai" },
  ],
  "Psycho-Social Counselling": [
    { listNo: "1", title: "Amaithi Thendral", place: "Mullaitivu" },
    { listNo: "2", title: "Valarpirai / ICOF", place: "Chundikuli" },
  ],
  "Care for Persons with Disabilities": [{ listNo: "11", title: "Amathi Karangal", place: "Mankulam" }],
  Rehabilitation: [
    { listNo: "1", title: "Thiruppunamai / CRADA", place: "Thoddaveli" },
    { listNo: "2", title: "Eugene De Mazenod Home", place: "Batticaloa" },
  ],
  "Justice, Peace & Integrity of Creation": [
    { listNo: "13", title: "Centre for Peace and Reconciliation", place: "Kilinochchi" },
  ],
  "Spiritual Renewal & Animation": [{ listNo: "14", title: "Sangamam", place: "Kopay" }],
  "Community Development": [
    { listNo: "1", title: "Nesakarangal", place: "Iyackachchi" },
    { listNo: "2", title: "Amathi Vanam", place: "Skandhapuram" },
    { listNo: "3", title: "Amathik Kalam", place: "Kokkilai" },
    { listNo: "4", title: "Amala Aruvi", place: "Mullikulam" },
    { listNo: "5", title: "Malarum Mullai", place: "Oddusuddan" },
  ],
  "Retired Oblates": [{ listNo: "16", title: "Amala Utpavam", place: "Colombuthurai" }],
  "Oblate Community / Fathers’ House": [{ listNo: "17", title: "Colombo Oblate House", place: "Borella" }],
  "Oblate Community / Fathers' House": [{ listNo: "17", title: "Colombo Oblate House", place: "Borella" }],
}

export function placesForMinistryTitle(title: string): PlaceDef[] {
  const exact = provinceMinistryPlaces[title]
  if (exact) return exact
  const normalized = title.replace(/[’']/g, "'").trim().toLowerCase()
  for (const [key, places] of Object.entries(provinceMinistryPlaces)) {
    if (key.replace(/[’']/g, "'").trim().toLowerCase() === normalized) return places
  }
  return []
}

export function majorSectionsForMinistry(title: string): MinistryMajorSection[] {
  return toSections(placesForMinistryTitle(title))
}

export const ministryStorySource =
  "Pathinathan Sathiyaseelan, OMI, “Present Ministries of the Oblates of Mary Immaculate in Jaffna Province”"
