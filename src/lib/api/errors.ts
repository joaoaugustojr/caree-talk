/**
 * Upstream validation payloads use stable codes for client i18n:
 * { errors: { email: [{ code, message, meta? }] } }
 *
 * Resolution order for display text:
 * 1. Translated `code` (when present and known in ApiErrors)
 * 2. Upstream `message` (API default / English)
 * 3. ApiErrors.fallback
 */

export type ApiCodedError = {
  code?: string;
  message: string;
  meta?: Record<string, unknown>;
};

export type ApiErrorBody = {
  success?: boolean;
  message?: string;
  errors?: Record<string, Array<ApiCodedError | string>>;
};

type ApiErrorTranslator = {
  (key: string, values?: Record<string, string | number | Date>): string;
  has: (key: string) => boolean;
};

export function isApiErrorBody(body: unknown): body is ApiErrorBody {
  return Boolean(body && typeof body === "object");
}

export function parseApiCodedError(value: unknown): ApiCodedError | undefined {
  if (typeof value === "string" && value.length > 0) {
    return { message: value };
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  const rawCode = (value as { code?: unknown }).code;
  const code = typeof rawCode === "string" && rawCode.length > 0 ? rawCode : undefined;

  const rawMessage = (value as { message?: unknown }).message;
  const message = typeof rawMessage === "string" ? rawMessage : "";

  if (!code && message.length === 0) {
    return undefined;
  }

  const meta = (value as { meta?: unknown }).meta;

  return {
    code,
    message,
    meta: meta && typeof meta === "object" ? (meta as Record<string, unknown>) : undefined,
  };
}

/** First error entry per field (enough for form UIs). */
export function getApiFieldCodedErrors(body: unknown): Partial<Record<string, ApiCodedError>> {
  if (!isApiErrorBody(body) || !body.errors) {
    return {};
  }

  const result: Partial<Record<string, ApiCodedError>> = {};

  for (const [field, entries] of Object.entries(body.errors)) {
    const first = parseApiCodedError(entries?.[0]);
    if (first) {
      result[field] = first;
    }
  }

  return result;
}

function toIntlValues(
  meta?: Record<string, unknown>,
): Record<string, string | number | Date> | undefined {
  if (!meta) {
    return undefined;
  }

  const values: Record<string, string | number | Date> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
      values[key] = value;
    } else if (value != null) {
      values[key] = String(value);
    }
  }

  return Object.keys(values).length > 0 ? values : undefined;
}

/**
 * Prefer i18n by `code`; otherwise use the API `message`; last resort `fallback`.
 */
export function translateApiCode(
  t: ApiErrorTranslator,
  code: string | undefined,
  meta?: Record<string, unknown>,
  apiMessage?: string,
): string {
  if (code && t.has(code)) {
    return t(code, toIntlValues(meta));
  }

  if (apiMessage && apiMessage.length > 0) {
    return apiMessage;
  }

  return t("fallback");
}

export function translateApiFieldErrors(
  t: ApiErrorTranslator,
  body: unknown,
  fields: string[],
): Partial<Record<string, string>> {
  const coded = getApiFieldCodedErrors(body);
  const result: Partial<Record<string, string>> = {};

  for (const field of fields) {
    const entry = coded[field];
    if (entry) {
      result[field] = translateApiCode(t, entry.code, entry.meta, entry.message);
    }
  }

  return result;
}

/** Top-level API message when there are no field errors. */
export function translateApiFormError(t: ApiErrorTranslator, body: unknown): string {
  const apiMessage =
    isApiErrorBody(body) && typeof body.message === "string" ? body.message : undefined;

  return translateApiCode(t, undefined, undefined, apiMessage);
}
