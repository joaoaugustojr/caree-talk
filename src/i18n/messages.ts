import type { AbstractIntlMessages } from "next-intl";

import type { AppLocale } from "./routing";

/**
 * Feature-based message loading:
 * - Common  → shared across pages (shared actions, base metadata)
 * - Home    → home page only
 * - Auth    → auth feature (login/register + form/validation)
 * - Dashboard → dashboard page only
 * - ApiErrors → upstream API error codes (auth.*, validation.*)
 */
export async function loadMessages(locale: AppLocale): Promise<AbstractIntlMessages> {
  const [common, home, auth, dashboard, apiErrors] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/auth.json`),
    import(`../messages/${locale}/dashboard.json`),
    import(`../messages/${locale}/api-errors.json`),
  ]);

  return {
    Common: common.default,
    Home: home.default,
    Auth: auth.default,
    Dashboard: dashboard.default,
    ApiErrors: apiErrors.default,
  };
}
