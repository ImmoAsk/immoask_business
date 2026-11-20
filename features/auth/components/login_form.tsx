"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon, type IconName } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { useLoginForm, type UseLoginFormOptions } from "../hooks/use_login_form";

export type LoginFormProps = UseLoginFormOptions & {
  /** Shows the demo credentials (development only). */
  demoHint?: { email: string; password: string };
};

export function LoginForm({ redirectTo, demoHint }: LoginFormProps) {
  const { values, setField, fieldErrors, formError, status, onSubmit } = useLoginForm({ redirectTo });
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();
  const busy = status !== "idle";

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5" aria-busy={busy}>
      {formError ? (
        <Alert variant="danger">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <Field
        id={`${id}-email`}
        label="Adresse e-mail"
        icon="mail"
        error={fieldErrors.email}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="vous@exemple.com"
        value={values.email}
        onChange={(event) => setField("email", event.target.value)}
        disabled={busy}
      />

      <Field
        id={`${id}-password`}
        label="Mot de passe"
        icon="lock"
        error={fieldErrors.password}
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Votre mot de passe"
        value={values.password}
        onChange={(event) => setField("password", event.target.value)}
        disabled={busy}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={showPassword}
            className={cn(
              "grid size-8 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200",
              focusRing,
            )}
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} className="size-[18px]" />
          </button>
        }
      />

      <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
        <Checkbox
          name="remember"
          checked={values.remember}
          onChange={(event) => setField("remember", event.target.checked)}
          disabled={busy}
          className="accent-brand-600! dark:accent-brand-500!"
        />
        Rester connecté
      </label>

      <Button
        type="submit"
        variant="brand"
        size="lg"
        loading={status === "submitting"}
        disabled={busy}
        className="mt-1 w-full"
      >
        {status === "success" ? "Redirection…" : status === "submitting" ? "Connexion…" : "Se connecter"}
      </Button>

      {demoHint ? (
        <p className="rounded-xl border border-dashed border-brand-500/40 bg-brand-50/60 px-4 py-3 text-[13px] text-zinc-600 dark:bg-brand-900/30 dark:text-zinc-300">
          <span className="font-semibold text-brand-700 dark:text-brand-100">Compte de démonstration</span>
          <br />
          {demoHint.email} · {demoHint.password}
        </p>
      ) : null}
    </form>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon: IconName;
  error?: string;
  trailing?: React.ReactNode;
};

function Field({ id, label, icon, error, trailing, className, ...inputProps }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon
          name={icon}
          className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-zinc-400"
        />
        <Input
          {...inputProps}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn("h-12 rounded-xl pl-11 text-[15px]", trailing ? "pr-12" : "pr-4", className)}
        />
        {trailing ? <div className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</div> : null}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
