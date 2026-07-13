import type { AbstractIntlMessages } from "next-intl";

import type { AppLocale } from "./routing";

/**
 * Feature-based message loading:
 * - Common → shared across pages
 * - Home   → home page only
 */
export async function loadMessages(locale: AppLocale): Promise<AbstractIntlMessages> {
  const [common, home] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
  ]);

  return {
    Common: common.default,
    Home: home.default,
  };
}
