import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt-BR"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // URL is the source of truth. Otherwise cookie/Accept-Language
  // redirect /login → /pt-BR/login after removing the prefix.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
