import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isAuthPage = request.nextUrl.pathname === "/"
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard")

  // If user is on auth page and has valid token, redirect to dashboard
  if (isAuthPage && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch {
      // Invalid token, continue to auth page
    }
  }

  // If user is trying to access dashboard without token, redirect to auth
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If user is on dashboard with invalid token, redirect to auth
  if (isDashboardPage && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch {
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*"]
}
