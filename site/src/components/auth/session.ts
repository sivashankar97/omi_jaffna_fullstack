/** Notify the header (and other listeners) that the signed-in member changed. */
export function notifyAuthChanged(user: unknown = null) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("omi-auth-changed", { detail: { user } }))
}

export async function fetchSessionUser() {
  const response = await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
  if (!response.ok) return null
  const data = await response.json().catch(() => ({}))
  return data?.user ?? null
}

export async function signOutSession() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin", cache: "no-store" }).catch(
    () => null
  )
  notifyAuthChanged(null)
}
