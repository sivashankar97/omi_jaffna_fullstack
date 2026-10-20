export type PortraitCrop = {
  /** Natural image size in pixels. */
  w: number
  h: number
  /** Face centre as a fraction of the image width and height. */
  fx: number
  fy: number
  /** Fraction of the image width that should fill the circle. */
  span: number
}

const crop = (w: number, h: number, fx: number, fy: number, span: number): PortraitCrop => ({ w, h, fx, fy, span })
const photo = (file: string) => `/Leadership_img/${encodeURIComponent(file)}`

/** Face crops for the Former Provincials circles, keyed by image path. Uploaded photos without a crop are centred. */
export const portraitCrops: Record<string, PortraitCrop> = {
  [photo("Rev. Fr. Louis Ponnaiah, OMI.png")]: crop(546, 457, 0.49, 0.29, 0.42),
  [photo("Rev. Fr. P. P. Philip.png")]: crop(441, 566, 0.52, 0.11, 0.3),
  [photo("Rev. Fr. P. Jesunesan.png")]: crop(513, 487, 0.47, 0.23, 0.5),
  [photo("Rev. Fr. Jeevendra Paul.png")]: crop(546, 457, 0.53, 0.3, 0.42),
  [photo("Rev. Fr. S.M. Selvaratnam.png")]: crop(546, 457, 0.56, 0.41, 0.5),
  [photo("Rev. Fr. Paul Natchathiram.png")]: crop(545, 458, 0.49, 0.47, 0.42),
  [photo("Rev. Fr. Edwin Vasantharajah.png")]: crop(546, 457, 0.5, 0.33, 0.42),
  [photo("Rev. Fr. Eugene Benedict.png")]: crop(350, 525, 0.47, 0.21, 0.74),
}
