import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LoginForm } from "@/features/auth/components/login-form";
import { Link } from "@/i18n/navigation";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return {
    title: t("login.metaTitle"),
    description: t("login.metaDescription"),
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Auth");

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{t("login.title")}</h1>
        <p className="text-sm text-zinc-600">{t("login.subtitle")}</p>
      </header>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-zinc-600">
        {t("login.noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-zinc-900 underline-offset-4 hover:underline"
        >
          {t("login.createAccount")}
        </Link>
      </p>
    </section>
  );
}
