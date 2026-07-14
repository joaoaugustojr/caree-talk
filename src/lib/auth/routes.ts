import { type AppLocale, routing } from "@/i18n/routing";

/** Guest-only routes: redirect to dashboard when a session cookie exists. */
export const AUTH_GUEST_ROUTES = ["/login", "/register"] as const;

/** Protected route prefixes: redirect to login when no session cookie. */
export const AUTH_PROTECTED_PREFIXES = ["/dashboard"] as const;

export function splitLocalePath(pathname: string): { locale: AppLocale; pathname: string } {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) {
      return { locale, pathname: "/" };
    }

    if (pathname.startsWith(`/${locale}/`)) {
      const rest = pathname.slice(locale.length + 1);
      return { locale, pathname: rest.startsWith("/") ? rest : `/${rest}` };
    }
  }

  return { locale: routing.defaultLocale, pathname };
}

export function withLocalePrefix(pathname: string, locale: AppLocale): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (locale === routing.defaultLocale) {
    return normalized;
  }

  if (normalized === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

export function isGuestRoute(pathname: string): boolean {
  return AUTH_GUEST_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isProtectedRoute(pathname: string): boolean {
  return AUTH_PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
