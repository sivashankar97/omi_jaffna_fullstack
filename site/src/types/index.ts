export type NavSection = {
  label: string
  id: string
  /** When set, dropdown item links here instead of `parent#id`. */
  href?: string
}

export type NavItem = {
  label: string
  href: string
  description: string
  sections: NavSection[]
}

export type LocaleCode = "en" | "ta" | "si"
