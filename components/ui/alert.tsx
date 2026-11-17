import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  default:
    "border-black/10 bg-zinc-50 text-zinc-950 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50",
  info: "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  warning:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100",
  danger:
    "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
} as const;

export type AlertVariant = keyof typeof variants;

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
};

export function Alert({ className, variant = "default", role, children, ...props }: AlertProps) {
  const liveRole = variant === "danger" || variant === "warning" ? "alert" : undefined;

  return (
    <div
      role={role ?? liveRole}
      className={cn("flex gap-3 rounded-xl border p-4 text-sm", variants[variant], className)}
      {...props}
    >
      <AlertIcon variant={variant} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
    </div>
  );
}

export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-medium", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm opacity-90", className)} {...props} />;
}

function AlertIcon({ variant }: { variant: AlertVariant }) {
  if (variant === "default") return null;

  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="mt-0.5 size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {icons[variant]}
    </svg>
  );
}

const icons: Record<Exclude<AlertVariant, "default">, ReactNode> = {
  info: (
    <>
      <circle cx="10" cy="10" r="7.25" />
      <path d="M10 9v4.5" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  success: (
    <>
      <circle cx="10" cy="10" r="7.25" />
      <path d="M6.5 10.25 8.75 12.5 13.5 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  warning: (
    <>
      <path d="M10 3.25 17.25 16.25h-14.5L10 3.25Z" strokeLinejoin="round" />
      <path d="M10 8v3.5" strokeLinecap="round" />
      <circle cx="10" cy="13.75" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  danger: (
    <>
      <circle cx="10" cy="10" r="7.25" />
      <path d="M7.5 7.5 12.5 12.5M12.5 7.5 7.5 12.5" strokeLinecap="round" />
    </>
  ),
};
