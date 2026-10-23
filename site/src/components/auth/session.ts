/** Notify the header (and other listeners) that the signed-in member changed. */
export function notifyAuthChanged(user: unknown = null) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("omi-auth-changed", { detail: { user } }))
}

export async function signOutSession() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => null)
  notifyAuthChanged(null)
}
