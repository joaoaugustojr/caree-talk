import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return {
    title: t("register.metaTitle"),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Auth");

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {t("register.title")}
        </h1>
        <p className="text-sm text-zinc-600">{t("register.subtitle")}</p>
      </header>

      <Link
        href="/login"
        className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
      >
        {t("register.backToLogin")}
      </Link>
    </section>
  );
}
