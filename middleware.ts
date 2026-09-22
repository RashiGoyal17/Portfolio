import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

// Protects all /admin/* routes except the login page and its API route.
// Allows access via EITHER:
//   a) the HMAC-signed password cookie (see lib/session.ts), or
//   b) a valid NextAuth session cookie (Google OAuth restricted to ADMIN_EMAIL
//      in auth.ts's signIn callback).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicAdminPath =
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/auth");

  if (isPublicAdminPath) return NextResponse.next();

  const passwordCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasPasswordSession = await verifySessionToken(passwordCookie);

  // NextAuth v5 sets one of these cookies on a valid session.
  const nextAuthCookie =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;
  const hasOAuthSession = Boolean(nextAuthCookie);

  if (hasPasswordSession || hasOAuthSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
