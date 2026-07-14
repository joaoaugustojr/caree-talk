import { getTranslations, setRequestLocale } from "next-intl/server";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BRAND_NAME } from "@/config/brand";

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Shared split layout for auth pages (login, register, forgot/reset).
 * Brand panel on the left (desktop); form panel on the right.
 */
export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Auth");

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <aside className="relative hidden overflow-hidden bg-zinc-100 lg:flex dark:bg-zinc-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,_#d7e3f2_0%,_transparent_52%),radial-gradient(circle_at_85%_88%,_#e4e4e7_0%,_transparent_48%)] dark:bg-[radial-gradient(circle_at_18%_12%,_#27272a_0%,_transparent_55%),radial-gradient(circle_at_85%_88%,_#18181b_0%,_transparent_50%)]"
        />
        <div className="relative flex w-full flex-col justify-between px-12 py-14 xl:px-16 xl:py-16">
          <p className="text-4xl font-semibold tracking-tight text-zinc-900 xl:text-5xl dark:text-zinc-50">
            {BRAND_NAME}
          </p>
          <p className="max-w-sm text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("layout.tagline")}
          </p>
        </div>
      </aside>

      <section className="relative flex min-h-screen flex-col justify-center bg-background px-6 py-12 sm:px-10">
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        <p className="mb-10 text-center text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase lg:hidden">
          {BRAND_NAME}
        </p>
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </section>
    </main>
  );
}
