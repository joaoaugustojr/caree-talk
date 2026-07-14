"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";

import { DEFAULT_THEME, isThemePreference, type ThemePreference } from "@/lib/theme/constants";
import { setThemeCookie } from "@/lib/theme/cookie";

function ThemeCookieSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!isThemePreference(theme)) {
      return;
    }

    setThemeCookie(theme);
  }, [theme]);

  return null;
}

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
};

export function ThemeProvider({ children, defaultTheme = DEFAULT_THEME }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
    >
      <ThemeCookieSync />
      {children}
    </NextThemesProvider>
  );
}
