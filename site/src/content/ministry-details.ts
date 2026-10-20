export type MinistryDetail = {
  tagline: string
  overview: string[]
  focus: string[]
  highlights: { value: string; label: string }[]
  scripture?: { text: string; reference: string }
}

/** Drawn from “Present Ministries of the Oblates of Mary Immaculate in Jaffna Province” (OMI Jaffna book, pp. 450–466). */
export const ministryDetails: Record<string, MinistryDetail> = {
  "01": {
    tagline: "Leadership that serves the mission",
    overview: [
      "The Provincial Administration at Thodarpaham, Jaffna, is the heart that keeps the whole Province moving together. Under the Provincial Superior and his Council, it coordinates the missionaries, communities and ministries spread across Sri Lanka and abroad.",
      "Thodarpaham was established in 1982 under the leadership of Fr. Hillerian Vethanayagam, OMI, first as a centre for human development, communication and mass media. Its library was opened at a significant moment in Jaffna’s history, in the aftermath of the burning of the Jaffna Public Library in 1981, and it continues to serve people today.",
      "Administration is not an office apart from the mission. Thodarpaham now functions as the Provincial administrative centre, discerns where the needs of the people are greatest, sends Oblates where they are most needed, and also gives a home to the hospital chaplain and other Oblate ministries.",
    ],
    focus: [
      "Appointing and accompanying Oblates in parishes, ministries and formation houses",
      "Planning and coordinating the pastoral priorities of the Province",
      "Responsible stewardship of finances, properties and mission resources",
      "Communication with the General Administration in Rome and the local Church",
      "Care for the well-being of every Oblate and community",
      "Keeping the Thodarpaham library open to the people of Jaffna",
    ],
    highlights: [
      { value: "1982", label: "Thodarpaham founded" },
      { value: "17", label: "Ministries coordinated" },
      { value: "1", label: "Missionary family" },
    ],
    scripture: { text: "Whoever wants to be first must be the servant of all.", reference: "Mark 9:35" },
  },
  "02": {
    tagline: "From Amala Utpavam to Amathi Aham",
    overview: [
      "The Jaffna Oblate Preaching Community is one of the significant missionary ministries of the Province. Inspired by the missionary spirit of St. Eugene de Mazenod, the community has proclaimed the Gospel among Tamil-speaking Catholics with zeal and dedication.",
      "Beginning in the late 1940s under pioneers such as Fr. Z. N. Croos, OMI, the Oblate preachers travelled from parish to parish conducting missions, retreats, novenas and renewal programmes. In 1961 the community was formally established at Columbuthurai, Jaffna, under the name Amala Utpavam.",
      "In 1998, partly due to the war, the preaching community was transferred to Vavuniya and renamed Amathi Aham. From there its ministry expanded to Tamil-speaking Catholic communities throughout Sri Lanka. Today, under the leadership of Fr. B. Jeyabalan, OMI, it continues to bring the Gospel, hope, reconciliation and spiritual renewal to people.",
    ],
    focus: [
      "Parish missions that renew faith in whole communities",
      "Retreats, novenas and renewal programmes",
      "Proclaiming the Gospel to Tamil-speaking Catholics across Sri Lanka",
      "Preaching reconciliation and hope in communities wounded by war",
      "Accompanying parishes after the mission through ongoing spiritual renewal",
    ],
    highlights: [
      { value: "1940s", label: "Preaching began" },
      { value: "1961", label: "Amala Utpavam founded" },
      { value: "1998", label: "Moved to Vavuniya" },
    ],
    scripture: { text: "The Spirit of the Lord has sent me to bring good news to the poor.", reference: "Luke 4:18" },
  },
  "03": {
    tagline: "Christ’s compassionate presence among the sick and imprisoned",
    overview: [
      "The Chapel of Our Lady of Good Health at Jaffna Teaching Hospital has been a place of prayer, healing and hope for more than five decades. In 1979 the chaplaincy was entrusted to the Oblates, with Fr. Daniel Francis, OMI, as the first full-time Oblate hospital chaplain. The present chapel was built in 2000 and expanded in 2019, and Fr. A. Delushan, OMI, serves there today.",
      "On 1 August 2019 the Bishop of Batticaloa entrusted the Oblates with hospital chaplaincy and prison ministry in his diocese. Oblates also serve the sick at Vavuniya General Hospital since 1999 and minister in Vavuniya Prison, at Mannar General Hospital since the early 2000s, and in the General Hospital and Prison of Trincomalee.",
      "This service reaches people of different faiths and backgrounds, reflecting the Oblate commitment to everyone who is vulnerable and marginalized. Through it the Oblates remain close to the poor, the suffering and the most abandoned, bringing Christ’s compassionate presence to hospitals and prisons.",
    ],
    focus: [
      "Celebrating the Eucharist and administering the Sacraments",
      "Counselling patients and prisoners",
      "Accompanying grieving families",
      "Practical help such as medicines, transport, clothing and hygiene items",
      "Bringing hope, dignity, reconciliation and renewal to prisoners",
    ],
    highlights: [
      { value: "1979", label: "Oblate hospital chaplaincy" },
      { value: "5", label: "Hospitals served" },
      { value: "3", label: "Prisons served" },
    ],
    scripture: { text: "I was sick and you took care of me, I was in prison and you visited me.", reference: "Matthew 25:36" },
  },
  "04": {
    tagline: "Education as mission since 1847",
    overview: [
      "From the very beginning of their mission in Jaffna in 1847, the Oblates became actively involved in education. Over the years hundreds of Oblates have served as teachers and principals and have established and administered numerous schools and educational institutions, in both government and private schools and colleges.",
      "Great personalities such as Fr. Timothy Long, OMI, Fr. Antoninus, OMI, and Fr. N. Arulnesan, OMI, made significant contributions to education. Many Oblates have also served as lecturers and professors in universities, seminaries and other institutions of higher education, and this tradition continues today.",
      "The De Mazenod Campus – Oblate Institute of Higher Education (OIHE) in Jaffna works with the motto “Higher Education for All”. Begun in 2016 under Fr. Edwin Vasantharajah, OMI, it was registered with the Tertiary and Vocational Education Commission (TVEC) in 2022 and, since 2024, has been directed by Fr. Antonine Jeevendra Paul, OMI.",
    ],
    focus: [
      "Oblates teaching and leading as principals in schools and colleges",
      "Affordable higher education through the De Mazenod Campus (OIHE)",
      "Lecturing in universities, seminaries and institutes of higher learning",
      "Forming students in knowledge, character and Gospel values",
      "Opening education to young people who cannot afford its cost",
    ],
    highlights: [
      { value: "1847", label: "Education ministry began" },
      { value: "2016", label: "De Mazenod Campus" },
      { value: "2022", label: "TVEC registered" },
    ],
    scripture: { text: "Train children in the right way, and when old, they will not stray.", reference: "Proverbs 22:6" },
  },
  "05": {
    tagline: "Learning that empowers beyond the classroom",
    overview: [
      "The LEBARA Education Resource Centre was established on 16 February 2013 at Annai Illam, Kilinochchi. Initiated by Fr. A. Sylvester, OMI, and now led by Fr. Sebamalai Perera, OMI, it serves as both a library and an education resource centre for children and young people affected by the civil war, supporting more than 275 students.",
      "Malarum Mullai, a community education centre in Oddusuddan, Mullaitivu, was begun in 2018 by Fr. S. Anpurasa, OMI. It provides free tuition and encourages children to develop their talents through music, dance and other skills, with the support of Wilde Ganzen and Stichting Mullai in the Netherlands.",
      "Amala Uthayam Boys’ Hostel at Uppuveli, Trincomalee, established in 2005, gives boys from economically disadvantaged families a safe home so that they can continue their schooling with stability and confidence. Today it continues under the care of Fr. Gerald, OMI.",
    ],
    focus: [
      "Library and learning resources for war-affected children",
      "Free tuition and after-school educational support",
      "Music, dance and skill-building for children’s talents",
      "Residential care so poor boys can stay in school",
      "Personal formation and pastoral accompaniment of young people",
    ],
    highlights: [
      { value: "275+", label: "Students supported" },
      { value: "2013", label: "LEBARA centre opened" },
      { value: "2018", label: "Malarum Mullai began" },
    ],
    scripture: { text: "Let each of you use the gift you have received to serve one another.", reference: "1 Peter 4:10" },
  },
  "06": {
    tagline: "Walking with young people in faith and life",
    overview: [
      "Gnanatheepam, the Youth Empowerment Centre at Ariyalai, is run through HAVONOS – OMI, an Oblate social-development initiative supported by HAVONOS in the Netherlands and coordinated by Fr. S. R. Satheeskumar, OMI. It responds to the needs of young people in the war-affected North and East.",
      "The centre offers awareness and leadership programmes on mental health, suicide prevention, substance abuse, life skills and educational motivation. Vocational training, youth clubs and leadership programmes help young people become responsible and confident members of society.",
      "Since October 2024 the Oblates also serve as chaplains at the College of Education, Vavuniya, giving spiritual accompaniment and formation to student-teachers as they prepare for their future educational mission.",
    ],
    focus: [
      "Awareness programmes on mental health and suicide prevention",
      "Prevention of substance abuse among young people",
      "Life-skills, leadership and educational motivation",
      "Vocational training and youth clubs",
      "Spiritual accompaniment of student-teachers in Vavuniya",
    ],
    highlights: [
      { value: "1", label: "Youth centre, Ariyalai" },
      { value: "5", label: "Key youth issues addressed" },
      { value: "2024", label: "College chaplaincy began" },
    ],
    scripture: { text: "Let no one despise your youth, but set an example for believers.", reference: "1 Timothy 4:12" },
  },
  "07": {
    tagline: "A home and a future for every child",
    overview: [
      "Amala Annai Anpaham began in the Jaffna Peninsula in the 1980s as a home for orphans and children in need, initiated by Fr. D. Vincent Patrick, OMI, and his companions. After the displacement of the Tamil Exodus in 1995, it was relocated to Mulankavil in the Kilinochchi District.",
      "Following later government regulations, it became a boys’ hostel that offers disadvantaged boys accommodation, education, life-skills and personal formation. The Oblates who accompany the hostel support the boys in their studies, talents, character and preparation for a better future.",
      "Across the parishes, the St. Eugene’s Children Club offers children aged 8 to 18 a safe, joyful and faith-filled place to grow, with the vision “To nurture children into strong pillars of the faith community”. It is guided by Fr. S. Roystan, OMI, Director of Children’s Ministry, with parish priests, animators, catechists, volunteers and parents.",
    ],
    focus: [
      "Residential care, education and life-skills for disadvantaged boys",
      "Faith formation and Christian values for children",
      "Children’s Leadership Teams in parishes",
      "Artistic and technological skills and care for nature",
      "Fostering vocations to the Oblate way of life",
    ],
    highlights: [
      { value: "1980s", label: "Children’s home began" },
      { value: "1995", label: "Moved to Mulankavil" },
      { value: "8–18", label: "Children’s Club ages" },
    ],
    scripture: { text: "Let the little children come to me, and do not stop them.", reference: "Matthew 19:14" },
  },
  "08": {
    tagline: "Men of difficult missions, close to the people",
    overview: [
      "When the Oblates arrived in Sri Lanka in 1847, they took responsibility for Catholic communities and parishes, providing sacramental, pastoral and catechetical services throughout the Vicariates of Jaffna and Colombo.",
      "As the local diocesan clergy was formed and dioceses became more established, the Oblates gradually handed over parishes to diocesan priests and moved towards specialized and missionary ministries.",
      "Today, 15 Oblates serve in parishes in the dioceses of Jaffna, Mannar, Trincomalee, Batticaloa, Badulla, Ratnapura, Galle and Kandy. True to their tradition as “men of difficult missions”, they continue to accept challenging, rural and remote pastoral assignments, serving the faithful with dedication and commitment.",
    ],
    focus: [
      "Celebrating the Eucharist and the Sacraments",
      "Proclaiming the Word of God and catechesis",
      "Visiting families, the sick and the elderly",
      "Serving rural and remote communities",
      "Building living Christian communities",
    ],
    highlights: [
      { value: "15", label: "Oblates in parishes" },
      { value: "8", label: "Dioceses served" },
      { value: "1847", label: "Parish service began" },
    ],
    scripture: { text: "I am the good shepherd. I know my own and my own know me.", reference: "John 10:14" },
  },
  "09": {
    tagline: "Forming the missionaries of tomorrow",
    overview: [
      "St. Joseph’s Juniorate, Columbuthurai, welcomed its first Rector, Fr. Adrian Joseph, OMI, on 23 January 1970. It receives Tamil-speaking young men from different parts of the country and gives them education, spiritual formation and a supportive community as they grow towards Oblate life.",
      "Gnanodhayam was established in 2003 as an Oblate Institute for Religious Studies and Pre-Novitiate Formation Centre, with Fr. P. Emmanuel Jesuthasan, OMI, as its first Director. From February to July it forms candidates spiritually, humanly and intellectually, and during the rest of the year it offers retreats and courses for priests and religious.",
      "The Oblate Scholastic Theologate began in 1997 at Matthew’s Memorial Home, Amala Utpavam, with Fr. Jeevendra Paul, OMI, as first Superior. In 2001 it moved to its present home as the De Mazenod Scholasticate, inaugurated on 8 July 2001 by the Superior General, Fr. William Steckling, OMI. Today it is a Regional Scholasticate welcoming scholastics from Colombo, Vietnam and Zambia.",
    ],
    focus: [
      "Accompanying young vocations at the Juniorate",
      "Pre-novitiate discernment at Gnanodhayam",
      "Philosophical and theological studies at the Scholasticate",
      "Human, spiritual, pastoral and community formation",
      "Retreats and ongoing formation for priests and religious",
    ],
    highlights: [
      { value: "1970", label: "Juniorate opened" },
      { value: "2003", label: "Gnanodhayam founded" },
      { value: "2001", label: "De Mazenod Scholasticate" },
    ],
    scripture: { text: "You did not choose me, but I chose you and appointed you to go and bear fruit.", reference: "John 15:16" },
  },
  "10": {
    tagline: "Healing wounded hearts, families and communities",
    overview: [
      "The OBTEC Counselling Centre was established on 23 September 2022 at Kanagapuram, Kilinochchi, with Fr. I. S. Vijendran, OMI, as its first Director. It works with the District General Hospital, Kilinochchi, and the Divisional Hospital, Tharmapuram, and serves schools, children’s homes, villages and parishes, including people affected by addiction.",
      "Amaithy Thendral, the Centre for Psychosocial Animation and Value Education in Mullaitivu, began in 2006 and was inaugurated on 20 January 2008 to bring healing after the 2004 tsunami and the war. Its ministry has reached Mannar, Vavuniya, Kilinochchi and Mullaitivu, with 67 staff members over the years.",
      "Anjali Aham in Point Pedro, founded on 22 May 2006 “to journey with wounded people in love and compassion”, Valarpirai – the Institute of Counselling and Ongoing Formation founded by Fr. S. M. Selvaratnam, OMI – and Annai Illam in Kilinochchi, one of the few counsellor-training centres in the Vanni, complete this ministry of listening and healing.",
    ],
    focus: [
      "Individual, family and school-based counselling",
      "Trauma-informed care, play and art therapy for children",
      "Psychosocial support for widows, families and persons with disabilities",
      "Community mental-health awareness and parenting programmes",
      "Training counsellors for war-affected regions",
    ],
    highlights: [
      { value: "5", label: "Counselling centres" },
      { value: "67", label: "Amaithy Thendral staff" },
      { value: "2022", label: "OBTEC established" },
    ],
    scripture: { text: "He heals the brokenhearted and binds up their wounds.", reference: "Psalm 147:3" },
  },
  "11": {
    tagline: "Restoring hope, dignity and independence",
    overview: [
      "Amathi Karankal – the LEBARA Wellness Centre for Amputees at Panikankulam, Mankulam, Mullaitivu – was inaugurated in May 2014 to restore hope, dignity and independence to persons with amputations and disabilities, especially those affected by the civil conflict. Fr. S. Anpurasa, OMI, served as its first Director.",
      "The Centre is a joint initiative of the LEBARA Foundation, Meththa Foundation, Missio Aachen, Porticus, the Missionary Oblates of Mary Immaculate and generous benefactors. It cares for the physical, psychological, economic, spiritual and educational needs of amputees and their families.",
      "Its major service is free artificial limbs and orthotic devices that help people regain mobility and confidence. Counselling, motivational programmes, livelihood assistance and educational grants help individuals and families build more secure and hopeful futures.",
    ],
    focus: [
      "Artificial limbs and orthotic devices free of charge",
      "Counselling and psychosocial support to overcome trauma",
      "Livelihood assistance for self-employment and small businesses",
      "Educational grants for children of amputee families",
      "Holistic care for the whole family",
    ],
    highlights: [
      { value: "2014", label: "Centre inaugurated" },
      { value: "Free", label: "Artificial limbs" },
      { value: "5", label: "Partner organisations" },
    ],
    scripture: { text: "The lame walk, the deaf hear, and the poor have good news brought to them.", reference: "Matthew 11:5" },
  },
  "12": {
    tagline: "A turning point towards dignity and recovery",
    overview: [
      "The Centre for Rehabilitation of Alcoholics and Drug Addicts (CRADA) was established on 10 October 2006 at Thottaveli, Mannar. Its roots go back to 2003, when Fr. Vincent Patrick, OMI, began the “Puthiya Udhayam” (New Dawn) support group in Pesalai. The Bishop of Mannar then set up a permanent centre known as Thiruppumunai – the turning point.",
      "Under successive Oblate directors, including the present director Fr. V. Justin, OMI, CRADA offers medical care, counselling, psychosocial education, spiritual guidance, yoga, recreation, vocational training and livelihood assistance, together with mental-health professionals and community organisations.",
      "‘Thiruppam’ – Esther Rehabilitation Centre in Batticaloa responds to addiction in the Eastern Province through counselling, school awareness, youth formation and pastoral visits, referring those who need residential care to Thiruppumunai in Mannar.",
    ],
    focus: [
      "Residential rehabilitation with medical and psychological care",
      "Counselling and spiritual guidance for individuals and families",
      "Awareness and prevention programmes in schools and villages",
      "Vocational training and livelihood support after recovery",
      "Village support groups for long-term recovery",
    ],
    highlights: [
      { value: "2006", label: "CRADA established" },
      { value: "2003", label: "First support group" },
      { value: "2", label: "Rehabilitation centres" },
    ],
    scripture: { text: "See, I am making all things new.", reference: "Revelation 21:5" },
  },
  "13": {
    tagline: "Building a just and peaceful Sri Lanka",
    overview: [
      "The Centre for Peace and Reconciliation (CPR) was established on 2 May 2005 to promote peace, justice, reconciliation and human dignity. It was founded for communities affected by ethnic conflict and social division, to build bridges between people and to empower the marginalized to live with dignity and equal rights.",
      "Its vision is “A just and peaceful Sri Lanka where the rights of all people are assured.” With partners such as Misereor, CPR works for human and minority rights, interreligious dialogue, the rights of women and children, gender equality and environmental responsibility inspired by Laudato Si’. Because of this advocacy, some Oblates have faced security threats and intimidation.",
      "Since 2021 a specialized ministry to families in difficulty, begun by Fr. Stany Anthonipillai, OMI, accompanies single mothers, widows and war-affected families in the Vanni and Jaffna through counselling, empowerment, limited legal assistance, livelihood support and children’s nutrition.",
    ],
    focus: [
      "Human-rights advocacy and minority rights",
      "Interreligious dialogue and peaceful coexistence",
      "Care for creation inspired by Laudato Si’",
      "Training in non-violent communication",
      "Empowerment of widows, single mothers and struggling families",
    ],
    highlights: [
      { value: "2005", label: "CPR established" },
      { value: "2021", label: "Family ministry began" },
      { value: "All", label: "Faiths and communities" },
    ],
    scripture: { text: "Blessed are the peacemakers, for they will be called children of God.", reference: "Matthew 5:9" },
  },
  "14": {
    tagline: "A path to wisdom, prayer and renewal",
    overview: [
      "Sangamam at Kopay, Jaffna, was established after the 2004 tsunami to care for children affected by the disaster. Over the years it has grown into a centre for prayer, retreats, healing, psycho-spiritual accompaniment, meditation and renewal.",
      "Today its Gnanavazhi – Path to Wisdom – programme offers spiritual animation, contemplative formation, renewal programmes and training for formators, helping people deepen their relationship with God.",
      "Gnanodhayam also offers retreats, renewal programmes and formation courses for priests and religious during the year, continuing the Oblate tradition of spiritual renewal for the whole Church.",
    ],
    focus: [
      "Retreats and days of prayer",
      "Meditation and contemplative formation",
      "Psycho-spiritual accompaniment and healing",
      "Renewal programmes for priests and religious",
      "Training for formators",
    ],
    highlights: [
      { value: "2004", label: "Born after the tsunami" },
      { value: "2", label: "Renewal centres" },
      { value: "1", label: "Path to Wisdom" },
    ],
    scripture: { text: "Come to me, all you who are weary, and I will give you rest.", reference: "Matthew 11:28" },
  },
  "15": {
    tagline: "Communities building their own future",
    overview: [
      "HAVONOS – OMI, supported by HAVONOS in the Netherlands and coordinated by Fr. S. R. Satheeskumar, OMI, serves vulnerable communities across the Northern and Eastern Provinces through education, livelihood development, psychosocial support, youth empowerment and rehabilitation.",
      "Its FAITH (Food Always in the Home) programme supports women-headed families through livelihood projects, agriculture, home gardening, counselling and women’s groups, and more than 775 women have benefited. The SieCo Centre, Amathikalam Community Development Centre and Sieni Fund give poor children scholarships, school supplies and meals.",
      "The Nesakkarankal Farm at Iyakachchi promotes sustainable livelihoods through coconut cultivation, goat and poultry farming and brick-making. Anjali Aham in Point Pedro has also grown into an important community development ministry across the Jaffna Peninsula.",
    ],
    focus: [
      "Livelihood projects for women-headed families",
      "Scholarships, school supplies and meals for children",
      "Sustainable agriculture and farming",
      "Vocational training and youth empowerment",
      "Partnership with communities for lasting change",
    ],
    highlights: [
      { value: "775+", label: "Women supported" },
      { value: "2", label: "Provinces served" },
      { value: "1", label: "Community farm" },
    ],
    scripture: { text: "I came that they may have life, and have it abundantly.", reference: "John 10:10" },
  },
  "16": {
    tagline: "Gratitude for lives given to the mission",
    overview: [
      "Amala Utpavam at Columbuthurai, Jaffna, holds a special place in the story of the Province. It was the home of the Oblate Preaching Community from 1961, and in 1997 the Scholastic Theologate began at Matthew’s Memorial Home on its grounds.",
      "Today Amala Utpavam is home to Oblates who have given decades of missionary service in parishes, schools, preaching, formation and social ministries. Here they are cared for with gratitude and fraternity, and continue to serve the Province through their prayer, wisdom and witness.",
      "Their presence reminds younger Oblates that the mission is handed on from one generation to the next, and that a life given to God and the poor remains fruitful to the end.",
    ],
    focus: [
      "Loving care and health support for elderly Oblates",
      "Community life, prayer and fraternity",
      "Sharing wisdom and experience with younger Oblates",
      "Praying for the mission and the people of the Province",
    ],
    highlights: [
      { value: "1961", label: "Amala Utpavam began" },
      { value: "Decades", label: "Of service honoured" },
      { value: "1", label: "Oblate family" },
    ],
    scripture: { text: "I have fought the good fight, I have finished the race, I have kept the faith.", reference: "2 Timothy 4:7" },
  },
  "17": {
    tagline: "A home of prayer, rest and shared mission",
    overview: [
      "The Colombo Oblate House at Borella gives Oblates of the Jaffna Province a home in the capital. It welcomes Oblates who travel for studies, ministry, medical care and work with the national Church and partner organisations.",
      "Like every Oblate house, it is first a community: a place of prayer, rest and shared missionary life, where Oblates support one another and stay connected with the Province in Jaffna.",
    ],
    focus: [
      "Hospitality for Oblates working or studying in Colombo",
      "Community prayer and fraternal life",
      "Support for Oblates needing medical care or rest",
      "A link between the Province and the Church in Colombo",
    ],
    highlights: [
      { value: "1", label: "House in Colombo" },
      { value: "Prayer", label: "And fraternity" },
      { value: "All", label: "Oblates welcomed" },
    ],
    scripture: { text: "How good and pleasant it is when brothers live together in unity.", reference: "Psalm 133:1" },
  },
}
