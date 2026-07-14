import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";

import {
  isGuestRoute,
  isProtectedRoute,
  splitLocalePath,
  withLocalePrefix,
} from "@/lib/auth/routes";

import { routing } from "./i18n/routing";

/**
 * Next.js 16 uses `proxy.ts` (middleware rename).
 *
 * Order:
 * 1. next-intl (locale redirects / rewrites)
 * 2. session gate (cookie presence) for guest vs protected routes
 *
 * Matcher skips API routes and static assets.
 */
const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const i18nResponse = handleI18nRouting(request);

  // Locale redirect/rewrite already decided — don't override.
  if (!i18nResponse.ok) {
    return i18nResponse;
  }

  const { locale, pathname } = splitLocalePath(request.nextUrl.pathname);
  const hasSession = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value);

  if (isProtectedRoute(pathname) && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = withLocalePrefix("/login", locale);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestRoute(pathname) && hasSession) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = withLocalePrefix("/dashboard", locale);
    return NextResponse.redirect(dashboardUrl);
  }

  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
