"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { loginWithPassword } from "@/lib/auth/login";
import { DEFAULT_AFTER_LOGIN, returnPathFromLocation } from "@/lib/auth/redirect";
import { getSession } from "@/lib/auth/session";
import type { LoginCredentials, LoginField, LoginFieldErrors, LoginStatus } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }: Pick<LoginCredentials, "email" | "password">): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  if (!email.trim()) errors.email = "Saisissez votre adresse e-mail.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Cette adresse e-mail n'est pas valide.";
  if (!password) errors.password = "Saisissez votre mot de passe.";
  return errors;
}

const errorMessages = {
  invalid_credentials: "E-mail ou mot de passe incorrect.",
  network: "Connexion impossible pour le moment. Vérifiez votre réseau puis réessayez.",
} as const;

export type UseLoginFormOptions = {
  /** Where to go after a successful sign-in, unless the URL has a valid `?next=` back-office page. */
  redirectTo?: string;
};

/** State, validation and submission for the email/password sign-in form. */
export function useLoginForm({ redirectTo = DEFAULT_AFTER_LOGIN }: UseLoginFormOptions = {}) {
  const router = useRouter();
  const [values, setValues] = useState<LoginCredentials>({ email: "", password: "", remember: true });
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<LoginStatus>("idle");

  // A valid session is already stored in this browser: skip the form.
  useEffect(() => {
    if (getSession()) router.replace(returnPathFromLocation(redirectTo));
  }, [router, redirectTo]);

  function setField<K extends keyof LoginCredentials>(field: K, value: LoginCredentials[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as the user edits it.
    if (field !== "remember") {
      setFieldErrors((current) => ({ ...current, [field as LoginField]: undefined }));
    }
    setFormError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;

    const errors = validateLogin(values);
    setFieldErrors(errors);
    if (errors.email || errors.password) {
      const firstInvalid = errors.email ? "email" : "password";
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setFormError(null);
    try {
      const result = await loginWithPassword({ ...values, email: values.email.trim() });
      if (result.ok) {
        setStatus("success");
        router.replace(returnPathFromLocation(redirectTo));
        return;
      }
      setFormError(errorMessages[result.error]);
    } catch {
      setFormError(errorMessages.network);
    }
    setStatus("idle");
  }

  return { values, setField, fieldErrors, formError, status, onSubmit };
}
