import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  buildAuthCookie,
  buildClearAuthCookie,
  getAccessToken,
} from "@/lib/auth/cookies";

const API_URL = process.env.API_URL;

/**
 * Backend auth endpoints that return a new access_token in the response body.
 * The proxy intercepts these to store the token in an httpOnly cookie
 * and strip it from the JSON sent back to the browser.
 */
const AUTH_TOKEN_PATHS = new Set(["/auth/login", "/auth/register", "/auth/refresh"]);

function normalizePath(segments: string[]) {
  return `/${segments.join("/")}`;
}

function isAuthTokenResponse(path: string, method: string, ok: boolean) {
  return ok && method === "POST" && AUTH_TOKEN_PATHS.has(path);
}

function isLogout(path: string, method: string) {
  return path === "/auth/logout" && method === "DELETE";
}

/**
 * Remove access_token and token_type from the response body before sending
 * it to the browser. The token lives only in the httpOnly cookie.
 */
function stripAccessToken(body: unknown) {
  if (!body || typeof body !== "object" || !("data" in body)) {
    return body;
  }

  const payload = body as { data?: Record<string, unknown> };

  if (!payload.data || typeof payload.data !== "object") {
    return body;
  }

  const data = payload.data;
  const safeData = { ...data };
  delete safeData.access_token;
  delete safeData.token_type;

  return {
    ...body,
    data: safeData,
  };
}

/**
 * Core BFF proxy: forwards browser requests to the upstream API.
 *
 * Request flow:
 *   browserApi("/auth/login")
 *     → GET/POST /api/auth/login  (this handler)
 *       → POST {API_URL}/auth/login  (backend)
 *
 * Responsibilities:
 *   1. Forward method, body, and query string unchanged
 *   2. Attach Authorization: Bearer {cookie} when a session exists
 *   3. On login/register/refresh: set httpOnly cookie, strip token from JSON
 *   4. On logout: clear the cookie
 */
export async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  if (!API_URL) {
    return NextResponse.json({ message: "API_URL is not configured" }, { status: 500 });
  }

  const path = normalizePath(pathSegments);
  const token = await getAccessToken();
  const search = request.nextUrl.search;

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const rawBody = hasBody ? await request.text() : undefined;

  const upstream = await fetch(`${API_URL}${path}${search}`, {
    method: request.method,
    headers: {
      Accept: "application/json",
      "Content-Type": request.headers.get("content-type") ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: rawBody,
    cache: "no-store",
  });

  const body = await upstream.json().catch(() => null);
  const shouldStripToken = isAuthTokenResponse(path, request.method, upstream.ok);
  const responseBody = shouldStripToken ? stripAccessToken(body) : body;

  const response = NextResponse.json(responseBody, { status: upstream.status });

  // Store token in httpOnly cookie — browser JS never sees the raw value.
  if (shouldStripToken && body && typeof body === "object" && "data" in body) {
    const data = (body as { data?: { access_token?: string } }).data;
    const accessToken = data?.access_token;

    if (accessToken) {
      const authCookie = buildAuthCookie(accessToken);
      response.cookies.set(authCookie.name, authCookie.value, authCookie.options);
    }
  }

  if (isLogout(path, request.method) && upstream.ok) {
    const clearCookie = buildClearAuthCookie();
    response.cookies.set(clearCookie.name, clearCookie.value, clearCookie.options);
  }

  return response;
}

/** Auth routes that do not require an existing session (except /auth/me). */
export function isProxyPathPublic(path: string) {
  return path.startsWith("/auth/") && path !== "/auth/me";
}

export function getAuthCookieName() {
  return ACCESS_TOKEN_COOKIE;
}
