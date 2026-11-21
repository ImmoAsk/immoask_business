import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  default: "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950",
  secondary: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  outline:
    "border border-black/10 bg-transparent text-zinc-700 dark:border-white/15 dark:text-zinc-200",
  success: "bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-100",
  warning: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
} as const;

export type BadgeVariant = keyof typeof variants;

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
