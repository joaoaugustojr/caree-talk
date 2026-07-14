import { setRequestLocale } from "next-intl/server";

import { BRAND_NAME } from "@/config/brand";

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Shared layout for auth pages (login, register, forgot/reset password).
 * Uses route group `(auth)` so URLs stay /login, /register, etc.
 */
export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#e8eef5_0%,_#f4f4f5_45%,_#fafafa_100%)]"
      />

      <div className="mb-10 text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {BRAND_NAME}
        </p>
      </div>

      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
