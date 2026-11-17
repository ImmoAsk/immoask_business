import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { focusRing } from "@/components/ui/styles";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={cn(
        "size-4 shrink-0 cursor-pointer rounded border border-black/20 accent-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:accent-zinc-50",
        focusRing,
        className,
      )}
    />
  );
}
