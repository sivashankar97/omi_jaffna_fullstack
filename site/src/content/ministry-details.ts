export type MinistryDetail = {
  tagline: string
  overview: string[]
  focus: string[]
  highlights: { value: string; label: string }[]
  scripture?: { text: string; reference: string }
}

export const ministryDetails: Record<string, MinistryDetail> = {
  "01": {
    tagline: "Leadership that serves the mission",
    overview: [
      "The Provincial Administration at Thodarpaham, Jaffna, is the heart that keeps the whole Province moving together. Under the Provincial Superior and his Council, it coordinates the missionaries, communities and ministries spread across Sri Lanka and abroad.",
      "Administration is not an office apart from the mission. It discerns where the needs of the people are greatest, sends Oblates where they are most needed, and makes sure that resources are used with transparency for pastoral and social service.",
    ],
    focus: [
      "Appointing and accompanying Oblates in parishes, ministries and formation houses",
      "Planning and coordinating the pastoral priorities of the Province",
      "Responsible stewardship of finances, properties and mission resources",
      "Communication with the General Administration in Rome and the local Church",
      "Care for the well-being of every Oblate and community",
    ],
    highlights: [
      { value: "17", label: "Ministries coordinated" },
      { value: "12", label: "Parishes served" },
      { value: "1", label: "Missionary family" },
    ],
    scripture: { text: "Whoever wants to be first must be the servant of all.", reference: "Mark 9:35" },
  },
  "02": {
    tagline: "Carrying the Good News to every village",
    overview: [
      "Mission preaching is the oldest work of the Oblates, born from St Eugene de Mazenod’s missions to the poor villages of Provence. From Amathi Aham, Vavuniya, the Province continues this tradition by bringing the Word of God to parishes and communities across the island.",
      "Mission teams spend days in a village, visiting families, celebrating the sacraments, preaching renewal and listening to people’s struggles. They leave behind communities that are more alive in faith and more united in hope.",
    ],
    focus: [
      "Parish missions and renewal programmes in rural and remote areas",
      "Family visits, reconciliation and celebration of the sacraments",
      "Retreats and days of recollection for parishes and groups",
      "Training lay leaders to continue faith formation after the mission",
    ],
    highlights: [
      { value: "1816", label: "Oblate missions began" },
      { value: "Island", label: "Wide reach" },
      { value: "Lay", label: "Leaders formed" },
    ],
    scripture: { text: "He has sent me to preach the Good News to the poor.", reference: "Luke 4:18" },
  },
  "03": {
    tagline: "A ministry of presence where people are most alone",
    overview: [
      "Oblate chaplains visit hospitals and prisons to be with people at their most vulnerable moments. In wards and cells, they offer prayer, the sacraments, a listening ear and the assurance that no one is forgotten by God.",
      "The ministry also reaches out to families of patients and prisoners, supports reintegration after release, and works with staff and authorities to protect the dignity of every person.",
    ],
    focus: [
      "Regular pastoral visits, prayer and the sacraments for the sick and prisoners",
      "Comfort and accompaniment for the dying and their families",
      "Counselling and support for prisoners preparing for release",
      "Collaboration with hospital staff, prison officers and social services",
    ],
    highlights: [
      { value: "24/7", label: "Pastoral availability" },
      { value: "Sick", label: "And dying accompanied" },
      { value: "Hope", label: "For the imprisoned" },
    ],
    scripture: { text: "I was sick and you visited me, I was in prison and you came to me.", reference: "Matthew 25:36" },
  },
  "04": {
    tagline: "Forming minds, hearts and futures",
    overview: [
      "Education has always been a key part of the Oblate mission in Sri Lanka. Through schools and educational institutions across the mission, the Province helps children and young people grow in knowledge, character and Christian values.",
      "Oblate educators give special attention to students from poor and war-affected families, so that access to good education becomes a path out of poverty and toward a dignified future.",
    ],
    focus: [
      "Quality academic education rooted in Gospel values",
      "Scholarships and support for students from poor families",
      "Moral, spiritual and leadership formation for students",
      "Teacher development and partnership with parents",
    ],
    highlights: [
      { value: "Schools", label: "Across the mission" },
      { value: "Values", label: "Based education" },
      { value: "All", label: "Students welcomed" },
    ],
    scripture: { text: "Train children in the right way, and when old, they will not stray.", reference: "Proverbs 22:6" },
  },
  "05": {
    tagline: "Learning that empowers beyond the classroom",
    overview: [
      "In Kilinochchi, Trincomalee and Point Pedro, the Province runs non-formal education centres for youth and adults who could not complete formal schooling, often because of war, displacement or poverty.",
      "Vocational training, language and computer skills, and personal development programmes give people practical tools to find work, start small businesses and take an active part in rebuilding their communities.",
    ],
    focus: [
      "Vocational and technical skills training",
      "English, Tamil and computer literacy programmes",
      "Livelihood support and small-business guidance",
      "Empowerment programmes for women and school leavers",
    ],
    highlights: [
      { value: "3", label: "Centres" },
      { value: "Skills", label: "For livelihood" },
      { value: "Women", label: "Empowered" },
    ],
    scripture: { text: "Let each of you use the gift you have received to serve one another.", reference: "1 Peter 4:10" },
  },
  "06": {
    tagline: "Walking with young people in faith and life",
    overview: [
      "From Gnanatheepam, Ariyalai, the Youth Animation ministry accompanies young people as they search for meaning, faith and direction. It creates safe spaces where youth can pray, learn, share and discover their gifts.",
      "Through camps, leadership programmes, cultural events and service projects, young people grow into confident leaders who carry Gospel values into their families, parishes and society.",
    ],
    focus: [
      "Faith formation, retreats and youth prayer gatherings",
      "Leadership training and personality development",
      "Cultural, sports and creative programmes",
      "Guidance on careers, relationships and life challenges",
      "Service projects that build solidarity with the poor",
    ],
    highlights: [
      { value: "Youth", label: "Camps & retreats" },
      { value: "Leaders", label: "Formed for society" },
      { value: "Faith", label: "Lived in action" },
    ],
    scripture: { text: "Let no one despise your youth, but set an example for believers.", reference: "1 Timothy 4:12" },
  },
}
