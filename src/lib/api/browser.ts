import { ApiError, type ApiRequestOptions } from "./types";

function normalizePath(path: string) {
  const trimmed = path.startsWith("/") ? path.slice(1) : path;
  return `/api/${trimmed}`;
}

/**
 * Browser-side API client.
 *
 * Use this in Client Components ("use client") and browser event handlers.
 * It NEVER calls the upstream API directly — every request goes through the Next.js
 * catch-all proxy at /api/[...path], which:
 *   1. Attaches the httpOnly access_token cookie as Authorization header
 *   2. Forwards the request to the backend API
 *   3. Manages auth cookies on login/register/refresh/logout
 *
 * Example:
 *   browserApi("/auth/login", { method: "POST", body: { email, password } })
 *   → fetch("/api/auth/login", …)
 *
 */
export async function browserApi<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const finalPath = normalizePath(path);

  const response = await fetch(finalPath, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, responseBody);
  }

  return responseBody as T;
}
