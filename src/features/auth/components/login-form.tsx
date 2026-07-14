"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { flattenError } from "zod";

import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/types";
import { cn } from "@/lib/cn";

import { createLoginSchema, type LoginFormValues } from "../schemas/login";
import { login } from "../services/login";

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

const inputClassName = cn(
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5",
  "text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10",
);

function getFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ApiError) || !error.body || typeof error.body !== "object") {
    return {};
  }

  const body = error.body as {
    errors?: Record<string, string[]>;
  };

  if (!body.errors) {
    return {};
  }

  return {
    email: body.errors.email?.[0],
    password: body.errors.password?.[0],
  };
}

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Chrome applies autofill styles before user interaction and blows up
  // font-size; readOnly until focus delays autofill until styles stick.
  const [autofillUnlocked, setAutofillUnlocked] = useState(false);

  function updateField<K extends keyof LoginFormValues>(field: K, value: LoginFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  function getFormMessage(error: unknown): string {
    if (error instanceof ApiError && error.body && typeof error.body === "object") {
      const message = (error.body as { message?: string }).message;
      if (message) return message;
    }

    return t("errors.loginFailed");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      const flattened = flattenError(parsed.error);
      setFieldErrors({
        email: flattened.fieldErrors.email?.[0],
        password: flattened.fieldErrors.password?.[0],
      });
      return;
    }

    setLoading(true);

    try {
      await login(parsed.data);
      router.push("/dashboard");
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setFormError(getFormMessage(error));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          {t("form.email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          readOnly={!autofillUnlocked}
          onFocus={() => setAutofillUnlocked(true)}
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          className={cn(
            inputClassName,
            fieldErrors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          )}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-sm text-red-600">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
          {t("form.password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          readOnly={!autofillUnlocked}
          onFocus={() => setAutofillUnlocked(true)}
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          className={cn(
            inputClassName,
            fieldErrors.password && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          )}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "password-error" : undefined}
        />
        {fieldErrors.password ? (
          <p id="password-error" className="text-sm text-red-600">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {loading ? t("form.submitting") : t("form.submit")}
      </button>
    </form>
  );
}
