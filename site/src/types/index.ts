export type NavSection = {
  label: string
  id: string
}

export type NavItem = {
  label: string
  href: string
  description: string
  sections: NavSection[]
}

export type LocaleCode = "en" | "ta" | "si"
