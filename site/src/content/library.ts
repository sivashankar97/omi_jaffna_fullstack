/** Library area structure (routes + default categories). Page copy and the category lists are edited in CMS block `library`. */

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

/** Category lists as edited in CMS block `library` (defaults above). */
export type LibraryCategoryLists = {
  magazineCategories: readonly LibraryCategory[]
  libraryCategories: readonly LibraryCategory[]
}

const defaultLists: LibraryCategoryLists = { magazineCategories, libraryCategories }

export function categoriesForSection(
  section: LibrarySectionId,
  lists: LibraryCategoryLists = defaultLists
): LibraryCategory[] {
  const list =
    section === "magazine" ? lists.magazineCategories : section === "libraries" ? lists.libraryCategories : []
  return list
    .map((item) => ({ id: String(item.id ?? "").trim(), label: String(item.label ?? "").trim() }))
    .filter((item) => item.id && item.label)
}

export function categoryLabel(section: LibrarySectionId, categoryId: string, lists?: LibraryCategoryLists) {
  return categoriesForSection(section, lists).find((item) => item.id === categoryId)?.label || categoryId
}
