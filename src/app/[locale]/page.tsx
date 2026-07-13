import { getTranslations, setRequestLocale } from "next-intl/server";

import { BRAND_NAME } from "@/config/brand";
import { Link } from "@/i18n/navigation";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <section className="w-full max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">{BRAND_NAME}</h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600">{t("subtitle")}</p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          {t("cta")}
        </Link>
      </section>
    </main>
  );
}
