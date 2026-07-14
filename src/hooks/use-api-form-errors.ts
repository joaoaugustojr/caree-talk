"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { translateApiFieldErrors, translateApiFormError } from "@/lib/api/errors";
import { ApiError } from "@/lib/api/types";

export type ApiFormFieldErrors<TField extends string> = Partial<Record<TField, string>>;

/**
 * Shared form error state for upstream ApiError payloads.
 *
 * Usage:
 *   const { fieldErrors, formError, applyApiErrors, clearFieldError, setClientFieldErrors } =
 *     useApiFormErrors(["email", "password"] as const);
 */
export function useApiFormErrors<TField extends string>(fields: readonly TField[]) {
  const tApiErrors = useTranslations("ApiErrors");
  const [fieldErrors, setFieldErrors] = useState<ApiFormFieldErrors<TField>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function clearErrors() {
    setFieldErrors({});
    setFormError(null);
  }

  function clearFieldError(field: TField) {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  function setClientFieldErrors(errors: ApiFormFieldErrors<TField>) {
    setFieldErrors(errors);
    setFormError(null);
  }

  function applyApiErrors(error: unknown) {
    if (!(error instanceof ApiError)) {
      setFieldErrors({});
      setFormError(tApiErrors("fallback"));
      return;
    }

    const nextFieldErrors = translateApiFieldErrors(tApiErrors, error.body, [
      ...fields,
    ]) as ApiFormFieldErrors<TField>;

    setFieldErrors(nextFieldErrors);
    setFormError(
      Object.keys(nextFieldErrors).length > 0
        ? null
        : translateApiFormError(tApiErrors, error.body),
    );
  }

  return {
    fieldErrors,
    formError,
    setFieldErrors,
    setFormError,
    setClientFieldErrors,
    clearErrors,
    clearFieldError,
    applyApiErrors,
  };
}
