import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldClassName, focusRing } from "@/components/ui/styles";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className={cn(fieldClassName, focusRing, "h-10 appearance-none pr-10 pl-3", className)}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M5.5 7.75 10 12.25 14.5 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
