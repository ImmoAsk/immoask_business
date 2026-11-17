import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldClassName, focusRing } from "@/components/ui/styles";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      {...props}
      type={type}
      className={cn(
        fieldClassName,
        focusRing,
        "h-10 px-3 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-zinc-700 dark:file:bg-zinc-800 dark:file:text-zinc-200",
        className,
      )}
    />
  );
}
