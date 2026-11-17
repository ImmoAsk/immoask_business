import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldClassName, focusRing } from "@/components/ui/styles";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={cn(fieldClassName, focusRing, "min-h-28 px-3 py-2", className)}
    />
  );
}
