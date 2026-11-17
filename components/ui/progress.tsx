import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  value?: number;
};

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-zinc-950 transition-[width] dark:bg-zinc-50"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
