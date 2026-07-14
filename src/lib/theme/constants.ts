export const THEME_COOKIE = "theme";

export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const THEMES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEMES)[number];

/** Used when the user has no saved preference. */
export const DEFAULT_THEME: ThemePreference = "system";

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === "string" && THEMES.includes(value as ThemePreference);
}
