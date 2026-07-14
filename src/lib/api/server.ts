import { getAccessToken } from "@/lib/auth/cookies";

import { ApiError, type ApiRequestOptions } from "./types";

const API_URL = process.env.API_URL;

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Server-side API client.
 *
 * Use this in Server Components, Route Handlers, and Server Actions.
 * It talks directly to the upstream API (API_URL) — the browser never sees this URL.
 *
 * The access token is read from the httpOnly cookie automatically.
 * Pass skipAuth: true for public endpoints (register, login) when calling
 * from the server (most auth flows go through browserApi + proxy instead).
 *
 * Why not route server calls through /api/[...path] too?
 * Server → upstream API is a direct internal hop (faster, no HTTP loopback).
 *
 */
export async function serverApi<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new Error("API_URL is not configured");
  }

  const { method = "GET", body, headers = {}, skipAuth = false, token } = options;

  // Read Bearer token from httpOnly cookie unless explicitly skipped/overridden.
  const accessToken = skipAuth ? undefined : (token ?? (await getAccessToken()));

  const response = await fetch(`${API_URL}${normalizePath(path)}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, responseBody);
  }

  return responseBody as T;
}
