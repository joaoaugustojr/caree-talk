import { z } from "zod";

/** Keep in sync with the API LoginData password minLength. */
export const PASSWORD_MIN_LENGTH = 8;

type TranslateFn = (key: string, values?: Record<string, string | number | Date>) => string;

/**
 * Login schema factory — messages come from i18n (Auth.validation.*).
 * Aligned with the API LoginData contract: email + password (min N).
 */
export function createLoginSchema(t: TranslateFn) {
  return z.object({
    email: z.email(t("validation.invalidEmail")),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, t("validation.passwordMin", { min: PASSWORD_MIN_LENGTH })),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
