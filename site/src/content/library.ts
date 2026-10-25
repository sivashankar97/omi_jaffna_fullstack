/** Library area structure (categories + routes). Page copy lives in CMS block `library`. */

export type LibrarySectionId = "magazine" | "libraries" | "books" | "articles"

export type LibraryCategory = {
  id: string
  label: string
}

export const magazineCategories: LibraryCategory[] = [
  { id: "year-thoni", label: "Year Thoni" },
  { id: "naan", label: "Naan" },
  { id: "zeal", label: "Zeal" },
  { id: "koinonia", label: "Koinonia" },
  { id: "vaanavil", label: "Vaanavil" },
  { id: "malai-loran-versus-katru", label: "Malai Loran Versus Katru" },
]

export const libraryCategories: LibraryCategory[] = [
  { id: "gaanapairkasiyar", label: "Gaanapairkasiyar Library" },
  { id: "anna-illam", label: "Anna Illam Library" },
  { id: "de-mazoned-scholasticate", label: "De Mazoned Scholasticate Library" },
  { id: "malarum-mullai", label: "Malarum Mullai Library" },
]

export const librarySectionRoutes: Record<LibrarySectionId, string> = {
  magazine: "/library/magazines",
  libraries: "/library/libraries",
  books: "/library/books",
  articles: "/library/articles",
}

export function categoriesForSection(section: LibrarySectionId): LibraryCategory[] {
  if (section === "magazine") return magazineCategories
  if (section === "libraries") return libraryCategories
  return []
}

export function categoryLabel(section: LibrarySectionId, categoryId: string) {
  return categoriesForSection(section).find((item) => item.id === categoryId)?.label || categoryId
}
