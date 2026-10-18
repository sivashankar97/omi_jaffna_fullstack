export const newsSections = [
  { id: "province-events", title: "Province events" },
  { id: "parish-events", title: "Parish events" },
  { id: "liturgical", title: "Liturgical celebrations" },
  { id: "formation", title: "Formation activities" },
  { id: "youth", title: "Youth events" },
  { id: "social", title: "Social initiatives" },
] as const

export type NewsSectionId = (typeof newsSections)[number]["id"]

export type NewsImage = {
  src: string
  alt: string
  caption: string
}

export type NewsArticle = {
  slug: string
  section: NewsSectionId
  title: string
  description: string
  dateLabel: string
  place: string
  cover: NewsImage
  paragraphs: string[]
  gallery: NewsImage[]
  sample?: boolean
}

const flag: NewsImage = {
  src: "/Herosection/Heroimage_3.jpg",
  alt: "The flag of the Oblate Province of Jaffna",
  caption: "The flag of the Oblate Province of Jaffna.",
}

const arch: NewsImage = {
  src: "/Herosection/Heroimage_2.jpg",
  alt: "A jubilee arch of the Oblate Province of Jaffna",
  caption: "A jubilee arch prepared for the Oblate Province of Jaffna.",
}

const emblem: NewsImage = {
  src: "/Herosection/Missionary_section.jpg",
  alt: "The missionary emblem of the Oblate Province of Jaffna",
  caption: "The missionary emblem of the Province, with the Oblate seal.",
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "superior-general-visit",
    section: "province-events",
    title: "The Superior General visits the Province",
    description:
      "Fr. Luis Ignacio Rois Alonso stayed with the Oblate Province of Jaffna for ten days, visiting parishes and houses and joining vows and an ordination in Jaffna.",
    dateLabel: "24 October – 2 November 2024",
    place: "Parishes and houses of the Province",
    cover: arch,
    paragraphs: [
      "From 24 October to 2 November 2024, Fr. Luis Ignacio Rois Alonso, Superior General of the Missionary Oblates of Mary Immaculate, stayed with the Oblate Province of Jaffna.",
      "The visit lasted ten days. He went to Oblate parishes, formation houses and communities of the Province. The journey followed the life of the Province as it is lived in many places, island-wide and abroad, rather than in a single district.",
      "During those days he joined perpetual vows and an ordination in Jaffna. Vows and ordination belong to the ordinary hope of a missionary province: men committing themselves to the mission, with the wider Oblate family present for it.",
      "A house-by-house diary has not been published on this page. The public record is the length of the visit, the Superior General who came, the communities he met, and the vows and ordination he joined in Jaffna.",
      "Photographs on this page are from the Province collection. They are not presented as a frame-by-frame record of the ten days. When the Province releases photographs of the visit itself, they can take their place here.",
    ],
    gallery: [arch, flag, emblem],
  },
  {
    slug: "provincial-assembly-2025",
    section: "province-events",
    title: "Provincial Assembly at Gnanodhayam",
    description:
      "Oblates met in Mannar from 16 to 19 February 2025 under the theme “Synodal Journey of Hope – Renewing Oblate Charism Together.”",
    dateLabel: "16–19 February 2025",
    place: "Gnanodhayam, Mannar",
    cover: emblem,
    paragraphs: [
      "From 16 to 19 February 2025 the Oblates of the Province met in assembly at Gnanodhayam, Mannar, the Oblate Institute for Religious Studies.",
      "The theme was “Synodal Journey of Hope – Renewing Oblate Charism Together.” The title set the tone: a shared reading of the Oblate charism, and a hope that the mission can be renewed together rather than in isolation.",
      "The assembly spoke about formation, community life, mission, finance and spiritual growth. These are the ordinary concerns of a province that must form its members, support its houses and keep the work of evangelizing the poor clear.",
      "The meeting is written in the past tense from the published dates. A longer report, if the Province issues one, can be added to this page. Until then the public notice remains the dates, the place, the theme and the subjects that were discussed.",
      "The images shown with this report belong to the Province. They illustrate the missionary family that gathered. They are not a claim that each picture was taken inside the assembly hall.",
    ],
    gallery: [emblem, flag, arch],
  },
  {
    slug: "kokkilai-church-opening",
    section: "parish-events",
    title: "Church opening at Kokkilai",
    description:
      "The Church of Our Lady of Good Voyage was opened and blessed on 21 August 2026 by the Bishop of Jaffna.",
    dateLabel: "21 August 2026",
    place: "Church of Our Lady of Good Voyage, Kokkilai",
    cover: flag,
    paragraphs: [
      "On 21 August 2026 the Church of Our Lady of Good Voyage at Kokkilai was opened and blessed. The day belonged to the Catholic community of the parish, and it was marked as a milestone of faith.",
      "The church was blessed by Rt. Rev. Dr. Justin Bernard Gnanapragasam, Bishop of Jaffna. Kokkilai is a parish of the Oblate Province of Jaffna, in Mullaitivu.",
      "A church opening is a public sign that worship, gathering and pastoral care have a home. The Oblates of this Province serve the people of God island-wide and abroad, and this parish is part of that presence.",
      "The Province has not published a full order of service, a list of those who took part, or the times of Mass. This report stays with what has been made public: the date, the place, the bishop who blessed the church, and the meaning of the day for the community.",
      "Photographs of the new church will be added when the Province office releases them. The pictures on this page are Province images already held for the website. They accompany the report. They are not offered as photographs of the blessing itself.",
    ],
    gallery: [flag, arch, emblem],
  },
  {
    slug: "jaffna-day-of-recollection",
    section: "youth",
    title: "A day of recollection at Ariyalai",
    description:
      "Oblates of the Jaffna District spent 16 May 2026 in prayer and fraternity at the Youth Empowerment Center.",
    dateLabel: "16 May 2026",
    place: "Youth Empowerment Center, Ariyalai",
    cover: arch,
    paragraphs: [
      "On 16 May 2026 the Oblates of the Jaffna District gathered for a day of recollection at the Youth Empowerment Center in Ariyalai.",
      "The day was given to prayer, reflection and fraternity. Those who took part renewed their commitment to serve the people of God.",
      "A day of recollection is not a public festival. It is time set aside for the missionaries themselves, so that preaching, teaching, accompaniment and the care of young people can continue with a clear heart.",
      "The Youth Empowerment Center at Ariyalai is part of the Province’s work with young people. Hosting the recollection there placed the missionaries’ own prayer inside a house already given to youth.",
      "The Province office has not published a timetable or personal reflections from the day. What is public is the gathering itself: who met, where they met, and the purpose of the day. Pictures from the Center can be added when they are released. The images here are from the Province collection.",
    ],
    gallery: [arch, flag, emblem],
  },
]

function sampleImage(n: number, alt: string): NewsImage {
  return { src: `/news/img_${n}.jpg`, alt, caption: alt }
}

const samplePara =
  "This is a sample story used to preview the news layout. The Province office will replace it with the published report."

export const sampleNews: NewsArticle[] = [
  {
    slug: "sample-palm-sunday-procession",
    section: "liturgical",
    title: "Palm Sunday procession",
    description: "Priests, religious and faithful walked together with palms to open Holy Week.",
    dateLabel: "Sample story",
    place: "Province",
    cover: sampleImage(1, "A Palm Sunday procession with clergy and faithful carrying palms"),
    paragraphs: [
      "Clergy, religious and the faithful walked together carrying palms at the start of Holy Week.",
      "The procession recalled the entry of Jesus into Jerusalem and led the community into the liturgy of the Passion.",
      samplePara,
    ],
    gallery: [sampleImage(1, "A Palm Sunday procession with clergy and faithful carrying palms")],
    sample: true,
  },
  {
    slug: "sample-international-gathering",
    section: "province-events",
    title: "Oblate delegates at an international gathering",
    description: "Delegates joined members of the wider Church family for an audience and shared reflection.",
    dateLabel: "Sample story",
    place: "Abroad",
    cover: sampleImage(2, "Delegates applauding during an audience in a frescoed hall"),
    paragraphs: [
      "Delegates joined members of the wider Church family for an audience and a time of shared reflection.",
      "Meetings like this connect the Province with the universal Church and with Oblates serving in other countries.",
      samplePara,
    ],
    gallery: [sampleImage(2, "Delegates applauding during an audience in a frescoed hall")],
    sample: true,
  },
  {
    slug: "sample-christmas-night-mass",
    section: "liturgical",
    title: "Christmas night Mass",
    description: "A full church gathered for the celebration of the Nativity of the Lord.",
    dateLabel: "Sample story",
    place: "Parish church",
    cover: sampleImage(3, "A full church decorated for Christmas night Mass"),
    paragraphs: [
      "The parish church was filled for the celebration of the Nativity of the Lord.",
      "Wreaths, lights and the crib prepared by parishioners welcomed families to the night liturgy.",
      samplePara,
    ],
    gallery: [sampleImage(3, "A full church decorated for Christmas night Mass")],
    sample: true,
  },
  {
    slug: "sample-oblates-gather",
    section: "province-events",
    title: "Oblates gather at the Province house",
    description: "Oblates from across the Province met for prayer, fraternity and a community photograph.",
    dateLabel: "Sample story",
    place: "Province house",
    cover: sampleImage(4, "Oblates in white habits gathered for a group photograph"),
    paragraphs: [
      "Oblates from different communities met at the Province house for prayer and fraternity.",
      "Gatherings like this give missionaries working far apart a time to share their work and renew their community life.",
      samplePara,
    ],
    gallery: [sampleImage(4, "Oblates in white habits gathered for a group photograph")],
    sample: true,
  },
  {
    slug: "sample-district-meeting",
    section: "province-events",
    title: "District meeting of the Oblates",
    description: "Oblates of a district met to share updates on mission, community and pastoral work.",
    dateLabel: "Sample story",
    place: "Province hall",
    cover: sampleImage(5, "Oblates seated in a circle during a district meeting"),
    paragraphs: [
      "Oblates of the district met in the Province hall to share updates on their mission and communities.",
      "The meeting looked at pastoral needs, formation and the support each community requires.",
      samplePara,
    ],
    gallery: [sampleImage(5, "Oblates seated in a circle during a district meeting")],
    sample: true,
  },
  {
    slug: "sample-church-blessing",
    section: "parish-events",
    title: "A new church building blessed",
    description: "The bishop blessed a new building as the parish community and Oblates looked on.",
    dateLabel: "Sample story",
    place: "Parish",
    cover: sampleImage(6, "A bishop blessing a new church building with priests and faithful"),
    paragraphs: [
      "The bishop blessed a new parish building in the presence of priests, altar servers and the faithful.",
      "A blessing marks a new home for worship, gathering and pastoral care in the parish.",
      samplePara,
    ],
    gallery: [sampleImage(6, "A bishop blessing a new church building with priests and faithful")],
    sample: true,
  },
  {
    slug: "sample-community-art-project",
    section: "social",
    title: "Community workers share a children's art project",
    description: "Oblates and community staff welcomed a visitor and presented artwork made with children.",
    dateLabel: "Sample story",
    place: "Social ministry centre",
    cover: sampleImage(7, "Oblates and community workers holding a children's painting"),
    paragraphs: [
      "Oblates and community staff welcomed a visitor and presented a painting made with the children they serve.",
      "Creative work helps children express themselves and builds trust between families and the centre.",
      samplePara,
    ],
    gallery: [sampleImage(7, "Oblates and community workers holding a children's painting")],
    sample: true,
  },
  {
    slug: "sample-community-prayer",
    section: "formation",
    title: "Community prayer during a formation week",
    description: "Oblates in liturgical stoles prayed together during a week of formation and renewal.",
    dateLabel: "Sample story",
    place: "Formation house",
    cover: sampleImage(8, "Oblates in stoles standing in prayer in a chapel"),
    paragraphs: [
      "Oblates gathered in the chapel for community prayer during a week of formation and renewal.",
      "Prayer together is at the heart of Oblate community life and of the mission it supports.",
      samplePara,
    ],
    gallery: [sampleImage(8, "Oblates in stoles standing in prayer in a chapel")],
    sample: true,
  },
]

newsArticles.push(...sampleNews)

export function getNewsArticle(slug: string) {
  return newsArticles.find((article) => article.slug === slug)
}

export function newsSectionTitle(id: NewsSectionId) {
  return newsSections.find((section) => section.id === id)?.title ?? "News"
}
