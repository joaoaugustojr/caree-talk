import { browserApi } from "@/lib/api/browser";
import type { ApiSuccess } from "@/lib/api/types";

import type { LoginPayload, User } from "../types";

/**
 * Auth feature services — thin wrappers around browserApi.
 *
 * These run in the browser and always go through the Next.js proxy.
 * The proxy handles cookie storage; these functions never touch the token.
 *
 * For server-side auth checks (e.g. dashboard page), use serverApi("/auth/me")
 * in a Server Component instead.
 */

export async function login(payload: LoginPayload) {
  return browserApi<ApiSuccess<{ user: User }>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function logout() {
  return browserApi<ApiSuccess<null>>("/auth/logout", {
    method: "DELETE",
  });
}

export async function getCurrentUser() {
  return browserApi<ApiSuccess<User>>("/auth/me");
}
