import { cookies } from "next/headers";

/** Cookie name for the Bearer access token. */
export const ACCESS_TOKEN_COOKIE = "access_token";

const cookieOptions = {
  httpOnly: true, // JS in the browser cannot read this — mitigates XSS token theft
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days — adjust to match API token TTL
};

/** Read the access token on the server (Server Components, proxy, serverApi). */
export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

/** Build cookie config after a successful login/register/refresh. */
export function buildAuthCookie(token: string) {
  return {
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    options: cookieOptions,
  };
}

/** Build cookie config to clear the session on logout. */
export function buildClearAuthCookie() {
  return {
    name: ACCESS_TOKEN_COOKIE,
    value: "",
    options: {
      ...cookieOptions,
      maxAge: 0,
    },
  };
}
