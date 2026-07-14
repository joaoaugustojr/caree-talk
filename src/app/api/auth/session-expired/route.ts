import { type NextRequest, NextResponse } from "next/server";

import { type AppLocale, routing } from "@/i18n/routing";
import { buildClearAuthCookie } from "@/lib/auth/cookies";
import { withLocalePrefix } from "@/lib/auth/routes";

/**
 * Clears an invalid session cookie and sends the user to login.
 * Used when `/auth/me` fails so proxy does not bounce login ↔ dashboard.
 */
export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale: AppLocale = routing.locales.includes(localeParam as AppLocale)
    ? (localeParam as AppLocale)
    : routing.defaultLocale;

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = withLocalePrefix("/login", locale);
  loginUrl.search = "";

  const response = NextResponse.redirect(loginUrl);
  const clearCookie = buildClearAuthCookie();
  response.cookies.set(clearCookie.name, clearCookie.value, clearCookie.options);

  return response;
}
