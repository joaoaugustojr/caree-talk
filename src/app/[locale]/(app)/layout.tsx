import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import type { User } from "@/features/auth/types";
import { serverApi } from "@/lib/api/server";
import type { ApiSuccess } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/cookies";

type AppLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Authenticated app shell.
 * Proxy blocks missing cookies; this confirms the session with the API.
 * Invalid sessions clear the cookie via /api/auth/session-expired to avoid redirect loops.
 */
export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const token = await getAccessToken();

  if (!token) {
    redirect(`/api/auth/session-expired?locale=${encodeURIComponent(locale)}`);
  }

  try {
    await serverApi<ApiSuccess<User>>("/auth/me");
  } catch {
    redirect(`/api/auth/session-expired?locale=${encodeURIComponent(locale)}`);
  }

  return children;
}
