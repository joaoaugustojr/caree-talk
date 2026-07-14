import { getTranslations, setRequestLocale } from "next-intl/server";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Dashboard");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
    </main>
  );
}
