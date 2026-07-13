import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/**
 * Next.js 16 uses `proxy.ts` (middleware rename).
 * next-intl still exports createMiddleware — used as the default proxy handler.
 *
 * Matcher skips API routes and static assets.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
