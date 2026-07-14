"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { flattenError } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useApiFormErrors } from "@/hooks/use-api-form-errors";
import { useRouter } from "@/i18n/navigation";

import { createLoginSchema, type LoginFormValues } from "../schemas/login";
import { login } from "../services/login";

const LOGIN_FIELDS = ["email", "password"] as const;

function toClientErrorMessage(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    fieldErrors,
    formError,
    applyApiErrors,
    clearFieldError,
    clearErrors,
    setClientFieldErrors,
  } = useApiFormErrors(LOGIN_FIELDS);

  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Chrome applies autofill styles before user interaction and blows up
  // font-size; readOnly until focus delays autofill until styles stick.
  const [autofillUnlocked, setAutofillUnlocked] = useState(false);

  function updateField<K extends keyof LoginFormValues>(field: K, value: LoginFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearErrors();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      const flattened = flattenError(parsed.error);
      setClientFieldErrors({
        email: toClientErrorMessage(flattened.fieldErrors.email?.[0]),
        password: toClientErrorMessage(flattened.fieldErrors.password?.[0]),
      });
      return;
    }

    setLoading(true);

    try {
      await login(parsed.data);
      router.push("/dashboard");
    } catch (error) {
      applyApiErrors(error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(fieldErrors.email) || undefined}>
          <FieldLabel htmlFor="email">{t("form.email")}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            readOnly={!autofillUnlocked}
            onFocus={() => setAutofillUnlocked(true)}
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="h-11"
            aria-invalid={Boolean(fieldErrors.email) || undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error">{fieldErrors.email}</FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.password) || undefined}>
          <FieldLabel htmlFor="password">{t("form.password")}</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              readOnly={!autofillUnlocked}
              onFocus={() => setAutofillUnlocked(true)}
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="h-11 pr-9"
              aria-invalid={Boolean(fieldErrors.password) || undefined}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-1 my-auto flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? t("form.hidePassword") : t("form.showPassword")}
              aria-pressed={showPassword}
            >
              <span className="relative size-4">
                <Eye
                  className={
                    showPassword ? "invisible absolute inset-0 size-4" : "absolute inset-0 size-4"
                  }
                  aria-hidden
                />
                <EyeOff
                  className={
                    showPassword ? "absolute inset-0 size-4" : "invisible absolute inset-0 size-4"
                  }
                  aria-hidden
                />
              </span>
            </button>
          </div>
          <FieldError id="password-error">{fieldErrors.password}</FieldError>
        </Field>

        {formError ? <FieldError>{formError}</FieldError> : null}

        <Button type="submit" className="mt-1 h-11 w-full" size="lg" disabled={loading}>
          {loading ? t("form.submitting") : t("form.submit")}
        </Button>
      </FieldGroup>
    </form>
  );
}
