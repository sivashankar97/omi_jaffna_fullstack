export type JourneyEvent = { date?: string; text: string }

export type JourneyYear = { year: string; events: JourneyEvent[] }

export type JourneyEra = { id: string; range: string; title: string; years: JourneyYear[] }

function y(year: string, ...events: (string | [string, string])[]): JourneyYear {
  return {
    year,
    events: events.map((event) => (typeof event === "string" ? { text: event } : { date: event[0], text: event[1] })),
  }
}

export const journeyEras: JourneyEra[] = [
  {
    id: "foundations",
    range: "1847 – 1899",
    title: "The Early Foundations",
    years: [
      y(
        "1847",
        ["September 17", "Mgr. Bettachini appointed Pro-Vicar of Jaffna."],
        ["November 28", "Arrival of the first Oblates in Ceylon (Frs. Semeria, Keating, Ciamin, and Br. Gaspard de Stephanis)."]
      ),
      y(
        "1848",
        ["May 10", "Fr. Semeria presented Mgr. Bettachini with a project to establish a Seminary for the formation of a Ceylonese Clergy."],
        ["September 8", "Fr. Semeria formally appointed Secretary to Mgr. Bettachini (a post equivalent to Vicar General) and parish priest of Jaffna, with Fr. Keating as assistant."]
      ),
      y(
        "1849",
        ["May 12", "Arrival of the second band of Oblates (Frs. Mouchel, Leydier, and Le Bescou)."],
        ["August 13", "Mgr. Bettachini appointed Vicar Apostolic of Jaffna."]
      ),
      y("1850", ["August", "Arrival of Frs. Vivier and Mauroit."]),
      y(
        "1851",
        ["June 4", "Fr. Semeria appointed Vicar General of Jaffna."],
        ["June 16", "Fr. Leydier died of cholera at Vathiry."],
        ["July 26", "Arrival of four Oblate Fathers to work in the Vicariate of Colombo (Frs. Pulicani, Perrard, Duffo, and Lallemant)."]
      ),
      y("1852", ["August 23", "Arrival of Frs. Chounavel and Pelissier."], ["December", "Outbreak of cholera at Point Pedro."]),
      y(
        "1853",
        ["February 2", "Fr. Perrard appointed to Galle."],
        ["May", "Arrival of Frs. Rouffiac and Lacombe."],
        ["November 10", "Cholera broke out in Jaffna; death of Fr. Ciamin."]
      ),
      y(
        "1854",
        ["April", "Introduction of the Catholic Faith at Wewala, a Buddhist village near Moratuwa."],
        ["July 6", "Arrival of Frs. Geneys and Flurin."],
        ["September", "Fr. Perrard sent to Kurunegala."]
      ),
      y(
        "1855",
        ["January 22", "Fr. Lacombe died of cholera at Mathagal at the age of 27."],
        ["February 5–7", "The great cholera and smallpox epidemics raging throughout the peninsula ceased upon the termination of a Triduum in the Jaffna Cathedral in honor of the Immaculate Conception."],
        ["September", "Fr. Pulicani appointed to Duwa, Fr. Perrard to Alukuru Korale, and Fr. Duffo to Kalutara."]
      ),
      y("1861", ["December 14", "Death of Fr. Crousel in Colombo."]),
      y(
        "1862",
        ["March 9", "Sacrilegious theft in the Jaffna Cathedral; a Triduum of expiation held. First reappearance of cholera since 1855."],
        ["May 24", "Mgr. Semeria created a Roman Count and Assistant to the Pontifical Throne."],
        ["August 15", "St. Thomas’ Church, Point Pedro, opened."],
        ["October 1", "First Report of Jaffna Catholic Schools published."]
      ),
      y(
        "1863",
        ["April 14", "Consecration of the Episcopal Chapel of the Immaculate Conception, Jaffna."],
        ["June 27", "Transfer of St. Joseph’s Orphanage to Colombogam."]
      ),
      y(
        "1864",
        ["April 17", "Mission preached at Katuneriya by Mgr. Semeria. The Society of the Brothers of St. Joseph established at Colombogam to train teachers for vernacular schools and catechists to assist missionaries."],
        ["May", "Sardiel, the “Robin Hood of Ceylon,” converted and assisted on the gallows by Frs. Duffo and Perrard."]
      ),
      y(
        "1865",
        ["January 24", "Foundation of the Congregation of the Sisters of St. Peter at Jaffna (the first community of indigenous nuns, founded by the Holy Family Sisters)."],
        ["August 21", "Bro. Dowling died of consumption at Jaffna."]
      ),
      y(
        "1867",
        ["April 15", "Mgr. Semeria left for Europe accompanied by Fr. Bonjean. Fr. Boisseau took charge of St. Joseph’s Orphanage; Fr. Moukel appointed Pro-Vicar."],
        ["July", "An Association founded at Marseilles by Mgr. Semeria to provide dowries for Jaffna orphan girls."]
      ),
      y(
        "1868",
        ["January 23", "Death of Mgr. Semeria from pleurisy at Marseilles, France."],
        ["July 5", "Nomination of Mgr. Bonjean as Vicar Apostolic of Jaffna."],
        ["August 24", "Consecration of Mgr. Bonjean."]
      ),
      y("1869", "Foundation of St. Martin’s Seminary, Jaffna, by Bishop Bonjean."),
      y("1870", "Commencement of the Madhu pilgrimage."),
      y("1871", "Foundation of the St. Joseph’s Catholic Press in Jaffna."),
      y(
        "1872",
        "Cornerstone laid for the Church of Our Lady of Madhu. Inauguration of the Jaffna Catholic Guardian.",
        ["December 23", "Mgr. Bonjean ordained Fr. Sandarasegara, the first Ceylonese to be raised to the priesthood by an Oblate Bishop."]
      ),
      y("1877", ["September", "Establishment of a Catechumenate and the St. Vincent de Paul’s Foundling Orphanage in Jaffna."]),
      y(
        "1879",
        ["September 22", "Nomination of Mgr. Theophilus Andrew Melizan as Coadjutor to Mgr. Bonjean."],
        ["November 29", "Consecration of Mgr. Melizan at Marseilles, France."]
      ),
      y("1881", ["June", "Gampola and the surrounding territory (Udapalata Pattuwa) placed under the jurisdiction of the Vicar Apostolic of Jaffna."]),
      y(
        "1883",
        ["August 28", "Bishop Bonjean took possession of the Vicariate of Colombo as Vicar Apostolic. Establishment of the Ecclesiastical Seminary (later named St. Bernard’s Seminary)."]
      ),
      y(
        "1887",
        ["January 6", "Establishment of the Hierarchy in Ceylon. The Colombo Vicariate became the Archdiocese of Colombo, and Mgr. Bonjean became the first Archbishop of Colombo."],
        ["December 13", "Inauguration of St. Lucia’s Cathedral."]
      ),
      y("1889", "The Bishops’ Conference of Sri Lanka was formed. A monthly Catholic family magazine called Bhakthi Prabodhanaya was started."),
      y("1892", ["August 3", "Death of Archbishop Bonjean."]),
      y(
        "1893",
        ["November 28", "Mgr. Melizan, transferred from Jaffna, appointed Archbishop of Colombo."],
        ["August", "Founding of St. Aloysius’ Seminary."],
        ["August 24", "Consecration of Mgr. Joulain."]
      ),
      y("1896", ["March 2", "Opening of St. Joseph’s College."]),
      y(
        "1898",
        ["June 28", "Fr. Antony Coudert appointed Coadjutor Bishop to Archbishop Melizan."],
        ["November 30", "Consecration of Mgr. Coudert."]
      ),
    ],
  },
  {
    id: "expansion",
    range: "1900 – 1949",
    title: "Expansion & Institutional Growth",
    years: [
      y("1902", ["October 9", "Inauguration of the Catholic Union of Ceylon."]),
      y("1905", ["January 27", "Death of Archbishop Melizan; Mgr. Coudert became the Archbishop of Colombo."]),
      y("1907", "Jaffna and Colombo welded into a single Oblate Vicariate; Fr. Jules Collin became the First Vicar of Missions."),
      y("1911", "Beginnings of the Tewatte Shrine."),
      y("1912", ["November 1", "Arrival of Mgr. Augustin Dontenwill, Superior General."]),
      y("1919", ["February 7", "Death of Mgr. Joulain."], ["July 28", "Fr. Jules Andrew Brault appointed Bishop of Jaffna."]),
      y("1920", ["February 15", "Consecration of Mgr. Andrew Brault."]),
      y("1922", ["July 16", "First Catholic Literature Convention; beginning of the Catholic “Forward Movement.”"]),
      y("1923", ["January 20", "Death of Bishop Andrew Brault."]),
      y(
        "1924",
        ["January 16", "Fr. Guyomar nominated as Bishop of Jaffna (Consecrated March 9)."],
        ["July 2", "Coronation of Our Lady of Madhu."]
      ),
      y(
        "1928",
        ["February 2", "Fr. Bastiampillai Anthonipillai Thomas founded the first indigenous contemplative order of Rosarians with six postulants at Tholagatty, Jaffna."]
      ),
      y(
        "1929",
        ["March 31", "Death of Archbishop Antony Coudert."],
        ["December 14", "Fr. Peter Marque appointed Archbishop of Colombo."]
      ),
      y("1930", ["February 11", "Consecration of Mgr. Peter Marque."]),
      y("1934", ["May 1", "Inauguration of the Oblate Scholasticate (Immaculate Conception) in Colombo."]),
      y("1937", ["June 4", "Death of Archbishop Peter Marque."]),
      y(
        "1938",
        ["June 2", "Fr. Jean Marie Masson appointed Archbishop of Colombo (Consecrated August 24)."],
        ["December 13", "Consecration of St. Lucia’s Cathedral."]
      ),
      y(
        "1939",
        ["January 5", "Erection of the Diocese of Chilaw; nomination of Fr. J. Aloysius Perera as Bishop of Chilaw."],
        ["April 8", "Death of Mgr. Aloysius Perera."]
      ),
      y("1940", ["January 12", "Fr. Edmund Peiris nominated Bishop of Chilaw (Consecrated April 25)."]),
      y("1944", ["January 25", "Consecration of the Church of Our Lady of Madhu."]),
      y("1945", ["December 14", "Nomination of Fr. Thomas Cooray as Coadjutor to Archbishop Masson."]),
      y("1946", ["March 7", "Consecration of Mgr. Thomas Cooray."]),
      y(
        "1947",
        ["February 11", "Proclamation of the Blessed Virgin Mary as Our Lady of Lanka."],
        ["July 28", "Death of Archbishop Masson. Mgr. Thomas Cooray succeeded to the See of Colombo, becoming the first Ceylonese Archbishop."],
        ["December 8", "Consecration of the Archdiocese to the Immaculate Heart of Mary solemnly renewed by Archbishop Thomas Cooray."]
      ),
      y(
        "1948",
        ["July 8", "100 years of Oblate presence in Sri Lanka celebrated at St. Joseph’s College with a Marian Congress, Vocation Exhibition, etc."],
        ["October 14", "Establishment of the House of Preachers “Nazareth” in Wennappuwa, with Fr. Lopupillai Augustine as Superior."]
      ),
      y(
        "1949",
        ["March 10", "Fr. Emilianus Pillai nominated Coadjutor to Mgr. Guyomar, Bishop of Jaffna."],
        ["May 16", "Oblate Novitiate shifted from Bambalapitiya to “Mont Eden,” Kalutara."],
        ["August 12", "Oblate Scholasticate moved from Kynsey Road, Borella, to the vacated Novitiate premises at Bambalapitiya."]
      ),
    ],
  },
  {
    id: "localization",
    range: "1950 – 1999",
    title: "An Era of Localization and Service",
    years: [
      y(
        "1950",
        ["April 25", "St. Vincent’s Home, Maggona, handed over to Oblate administration (Became a formal Religious House on May 9, 1951)."],
        ["May 1", "Oblate Scholasticate shifted to Kohuwela from Bambalapitiya. The Statue of Our Lady of Fatima arrived from Portugal, brought by two Oblates, and toured the country."],
        ["July 18", "Mgr. Emilianus Pillai succeeded to the See of Jaffna."],
        ["July 21", "Oblate Juniorate opened at Kohuwela."]
      ),
      y("1951", ["January 5", "Fatima Parish, Maradana, handed over to the Oblate Congregation."]),
      y("1954", ["December 14", "Ragama Parish handed over to the Oblates. Lakrivi Movement started in Sri Lanka by Fr. Felix Mavel."]),
      y(
        "1955",
        ["August 2", "The Regional Seminary of Our Lady of Lanka at Ampitiya, Kandy, handed over to the Oblates. Fr. Fred Sackett appointed First Rector."],
        ["August 31", "Oblate Scholasticate shifted to the Ampitiya Seminary building from Nugegoda."]
      ),
      y(
        "1956",
        ["June 22", "Fr. Marcelline Jayakody won an award as a leading personality in the film world for his magnificent lyrics in the film Rekava."]
      ),
      y(
        "1959",
        ["February 11", "Blessing of the Grotto at Tewatte; first Mass said by Most Rev. Fr. Leo Deschatelets, Superior General."],
        ["June 22", "Oblate Scholasticate moved to its own buildings adjacent to the seminary."]
      ),
      y("1961", "“Amala Utpavam” house of Oblate Preachers established at Colombogam."),
      y(
        "1963",
        ["August 1", "North Central Province (NCP) handed over to the Oblates for evangelization. Rev. Fr. Anthony Fernando appointed First Ceylonese Provincial (1963–1968)."]
      ),
      y("1964", ["October 9", "Archbishop Thomas Cooray created a Cardinal by Pope Paul VI."]),
      y("1965", ["April 28", "Oblate Missionaries from Sri Lanka went to Malaysia."]),
      y(
        "1967",
        ["February 13", "Sri Lanka raised to the status of a Province."],
        ["July 3", "Sri Lankan Province started missionary work in Kanchipuram, India."]
      ),
      y("1968", ["July 17", "Fr. Edmund Fernando consecrated as Auxiliary Bishop to the Cardinal Archbishop."]),
      y("1969", ["December 30", "“Amala Utpavam” Home for retired Fathers opened in Jaffna."]),
      y(
        "1971",
        ["February 14", "Sri Lankan Province opened a mission in Pakistan."],
        ["July 27", "Juniorate established at Colombogam, Jaffna."],
        ["December 29", "Centre for Society and Religion (CSR) started; Fr. Lucien Schmitt appointed Fr. Tissa Balasuriya as its first director."]
      ),
      y("1972", ["February 1", "Juniorate established in India."], ["May", "Fr. Dalston Forbes elected General Councilor for Asia."]),
      y(
        "1973",
        ["February", "125 years of Oblate Presence in Sri Lanka celebrated, graced by Most Rev. Fr. Richard Hanly, Superior General."],
        ["May 15", "Oblate Novitiate moved to “Sidupiyanilla,” Bandarawela, from Mont Eden, Kalutara."],
        ["May 26", "Novitiate started canonically in India."],
        ["July", "Mission in Bangladesh started under the leadership of Fr. Henry Vanhoof."]
      ),
      y(
        "1974",
        ["December 26", "Minor Basilica of Our Lady of Lanka at Tewatte consecrated and dedicated by His Eminence Thomas Cardinal Cooray."]
      ),
      y("1976", ["September 2", "Cardinal Cooray retired from the See of Colombo."]),
      y("1978", ["January 2–8", "Oblate Congress held at Kandy."]),
      y(
        "1980",
        ["July 11", "Fr. Michael Rodrigo founded the “Suba Seth Gedara” (Friendly Wishes House) at Alukalavita in Buttala."],
        ["November", "Fr. Jim Cooke elected as the 1st Assistant General (the first Sri Lankan to hold the post)."]
      ),
      y(
        "1981",
        ["May 22", "Postage stamp issued honoring late Fr. S. Gnanaprakasar, the first Oblate to be so honored."],
        ["December 8", "“Marian Grove,” a house for elderly Oblates, opened at Green Path, Kohuwela."]
      ),
      y(
        "1982",
        ["January", "The Oblate Pre-Novitiate began at De Mazenod House, Mattakkuliya."],
        ["March 10", "Fr. Joy Goonewardena named Bishop of the new Diocese of Anuradhapura."],
        ["May 22", "Formal opening of the Communication Centre in Thodharpham, Jaffna."],
        ["June 18–24", "Sri Lankan Oblate Provincial Congress in Kandy."]
      ),
      y(
        "1983",
        "Fr. Marcelline Jayakody won the prestigious international Ramon Magsaysay Award. Fr. Fernand Jette, Superior General, visited Sri Lanka."
      ),
      y(
        "1984",
        ["May 30", "Fr. Bernard Quintus elected Second Assistant General."],
        ["November 14", "Opening of the Oblate Communication Centre at Palwatte, Minuwangoda."],
        ["December 8", "Establishment of the General Delegation in Jaffna."],
        ["December 15", "Mgr. Edmund Fernando named to the See of Badulla."]
      ),
      y("1985", ["May 22", "Commemorative stamp issued honoring Fr. Peter Pillai."]),
      y("1986", ["July 28", "Oblate Congress held at Tewatte."]),
      y(
        "1987",
        ["October 27", "Rajabima Oblate Centre opened in Anuradhapura."],
        ["November 10", "Assassination of Fr. Michael Rodrigo at Buttala."]
      ),
      y(
        "1988",
        ["July", "Second Asian Oblate Formators Meeting held in Wennappuwa."],
        ["October 20", "Bro. S. Wryma, the last foreign Oblate Brother, passed away."],
        ["October 29", "Cardinal Cooray passed away."],
        ["May 22", "Philatelic Bureau issued a stamp honoring Fr. M. J. Legoc."],
        ["August 5", "Visit of Fr. Marcello Zago, Superior General. Erection of the Vice Province of Jaffna."],
        ["September 4", "Mgr. Edmund Peiris passed away."],
        ["September 10", "Oblate Congress."],
        ["December 28", "Philatelic Bureau issued a stamp honoring Thomas Cardinal Cooray."]
      ),
      y(
        "1990",
        ["May 22", "Postage stamp issued honoring Fr. T. M. F. Long, former Rector of St. Patrick’s, Jaffna."],
        ["June 11", "First South Asian Oblate Formators Meeting held at Ampitiya."]
      ),
      y("1993", "Mr. Roche Tewerapperuma made an Honorary Oblate."),
      y(
        "1994",
        ["February 17", "Blessing of the new Chapel at “Marian Grove.” Fr. Fraccid Anthony founded the “Sahana Medura” (House of Comfort) at Kanuwana, Ja-Ela, devoted to healing the mentally ill."]
      ),
      y(
        "1995",
        ["May 27", "Fr. Marcello Zago, Superior General, arrived to visit the Province."],
        ["December 3", "Blessed Eugene de Mazenod, Founder of the Oblates, declared a Saint."],
        ["December 9", "Oblate-founded approved school (Susithodaya) celebrated its 100th anniversary."],
        ["December 12", "St. Eugene de Mazenod canonization celebrations at St. Lucia’s Cathedral organized by the Sri Lanka Province."]
      ),
      y(
        "1996",
        ["June 1", "Visitation of the Province by a team appointed by Fr. General."],
        ["August 12–16", "Oblate Congress at Ampitiya."]
      ),
      y("1997", ["June 14", "Mgr. Edmund Fernando resigned from the See of Badulla."]),
    ],
  },
]
