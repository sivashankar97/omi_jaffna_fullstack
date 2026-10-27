import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Cookie presence guard for the Father dashboard.
 * JWT validity and role checks stay on the API (`auth` / `allow`).
 */
export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get("omi_session")?.value)
  if (!hasSession) {
    const login = new URL("/login", request.url)
    login.searchParams.set("next", "/dashboard")
    return NextResponse.redirect(login)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
}
