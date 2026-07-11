/**
 * Shared API types used by both clients:
 * - browserApi  → front-end → Next.js proxy (/api/*)
 * - serverApi   → server    → upstream API (API_URL)
 *
 * Upstream responses follow: { success: true, data: T, message?: string }
 */

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string | null;
};

export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** Server-only: do not attach Bearer token from the httpOnly cookie. */
  skipAuth?: boolean;
  /** Server-only: override the token read from cookies (rare). */
  token?: string;
};

/** Thrown by browserApi/serverApi when the upstream response is not ok. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super("API request failed");
    this.name = "ApiError";
  }
}

/** Pagination links from the upstream API. */
export type PaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

/** Pagination meta from the upstream API. */
export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: string | null;
  to: string | null;
  path: string;
};

/** Paginated response from the upstream API. */
export type ApiPaginated<T> = {
  success: true;
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
  message?: string | null;
};
