"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

import { isThemePreference, type ThemePreference } from "@/lib/theme/constants";
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
  defaultTheme: ThemePreference;
};

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
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
