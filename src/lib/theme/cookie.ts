import {
  isThemePreference,
  THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  type ThemePreference,
} from "./constants";

export function parseThemeCookie(value: string | undefined): ThemePreference {
  return isThemePreference(value) ? value : "system";
}

/** Client-only: persist preference for SSR on the next request. */
export function setThemeCookie(theme: ThemePreference) {
  document.cookie = [
    `${THEME_COOKIE}=${theme}`,
    "path=/",
    `max-age=${THEME_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ");
}
