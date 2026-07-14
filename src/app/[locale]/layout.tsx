import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { BRAND_NAME } from "@/config/brand";
import { routing } from "@/i18n/routing";
import { THEME_COOKIE } from "@/lib/theme/constants";
import { parseThemeCookie } from "@/lib/theme/cookie";

import "../globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Common" });

  return {
    title: {
      default: BRAND_NAME,
      template: `%s | ${BRAND_NAME}`,
    },
    description: t("metadata.description"),
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const cookieStore = await cookies();
  const defaultTheme = parseThemeCookie(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <html
      lang={locale}
      className={`${instrumentSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider defaultTheme={defaultTheme}>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
