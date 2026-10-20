export const provincialSuperior = {
  role: "Provincial Superior",
  name: "Very Rev. Fr. Paul Jeyanthan Pachchek, OMI",
  term: "2023 – Present",
  image: "/Leadership_img/Rev.%20Fr.%20Paul%20Jeyanthan%20Pachchek%2C%20OMI.png",
  bio: "Appointed as the Provincial Superior by Rev. Fr. Luis Ignacio Rois Alonso, OMI, Superior General of the Missionary Oblates of Mary Immaculate, for the first term of three years on the 10th of January 2023, and being installed on the 17th of February the same year. Reappointed for the second term of three years on the 15th of January 2026, and being installed on the 16th of February 2026.",
  terms: [
    { label: "First term", appointed: "10 January 2023", installed: "17 February 2023" },
    { label: "Second term", appointed: "15 January 2026", installed: "16 February 2026" },
  ],
} as const

export type PortraitCrop = {
  src: string
  /** Natural image size in pixels. */
  w: number
  h: number
  /** Face centre as a fraction of the image width and height. */
  fx: number
  fy: number
  /** Fraction of the image width that should fill the circle. */
  span: number
}

const portrait = (file: string, w: number, h: number, fx: number, fy: number, span: number): PortraitCrop => ({
  src: `/Leadership_img/${encodeURIComponent(file)}`,
  w,
  h,
  fx,
  fy,
  span,
})

export const formerProvincialPhotos: Record<string, PortraitCrop> = {
  "Rev. Fr. Louis Ponnaiah, OMI": portrait("Rev. Fr. Louis Ponnaiah, OMI.png", 546, 457, 0.49, 0.29, 0.42),
  "Rev. Fr. P. P. Philip": portrait("Rev. Fr. P. P. Philip.png", 441, 566, 0.52, 0.11, 0.3),
  "Rev. Fr. P. Jesunesan": portrait("Rev. Fr. P. Jesunesan.png", 513, 487, 0.47, 0.23, 0.5),
  "Rev. Fr. Jeevendra Paul": portrait("Rev. Fr. Jeevendra Paul.png", 546, 457, 0.53, 0.3, 0.42),
  "Rev. Fr. S.M. Selvaratnam": portrait("Rev. Fr. S.M. Selvaratnam.png", 546, 457, 0.56, 0.41, 0.5),
  "Rev. Fr. Paul Natchathiram": portrait("Rev. Fr. Paul Natchathiram.png", 545, 458, 0.49, 0.47, 0.42),
  "Rev. Fr. Edwin Vasantharajah": portrait("Rev. Fr. Edwin Vasantharajah.png", 546, 457, 0.5, 0.33, 0.42),
  "Rev. Fr. Eugene Benedict": portrait("Rev. Fr. Eugene Benedict.png", 350, 525, 0.47, 0.21, 0.74),
}

export const councilImages: Record<string, { src: string; cover?: boolean }> = {
  "Rev. Fr. Pakkiyanathan Antony Jesuthasan": {
    src: "/Leadership_img/Pakkiyanathan_Antony_Jesuthasan-removebg-preview.png",
  },
  "Rev. Fr. Francis Loshington Antonipillai": {
    src: "/Leadership_img/Francis_Loshington_Antonipillai-removebg-preview.png",
  },
  "Rev. Fr. Sathiyaseelan Pathinathan": { src: "/Leadership_img/Sathiyaseelan_Pathinathan-removebg-preview.png" },
  "Rev. Fr. Jayabalan Balasingham": { src: "/Leadership_img/Jayabalan_Balasingham-removebg-preview.png" },
  "Rev. Fr. Anson Regikumar Tharcious": { src: "/Leadership_img/Anson_Regikumar_Tharcious-removebg-preview.png" },
  // Landscape source with wide empty margins; cover keeps the figure the same size as the portrait photos.
  "Rev. Fr. Antony Hubert": { src: "/Leadership_img/Antony%20Hubert.png", cover: true },
}
