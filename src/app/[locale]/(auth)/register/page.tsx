import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

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
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("register.title")}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("register.subtitle")}</p>
      </header>

      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
      >
        {t("register.backToLogin")}
      </Link>
    </div>
  );
}
