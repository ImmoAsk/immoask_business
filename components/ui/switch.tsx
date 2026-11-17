"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { focusRing } from "@/components/ui/styles";

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  id,
  name,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SwitchProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isChecked = checked ?? uncontrolled;

  function toggle() {
    const next = !isChecked;
    if (checked === undefined) setUncontrolled(next);
    onCheckedChange?.(next);
  }

  return (
    <>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={isChecked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        data-state={isChecked ? "checked" : "unchecked"}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          focusRing,
          isChecked ? "bg-zinc-950 dark:bg-zinc-50" : "bg-zinc-300 dark:bg-zinc-700",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
            isChecked ? "translate-x-5 dark:bg-zinc-950" : "translate-x-0.5",
          )}
        />
      </button>
      {name ? <input type="hidden" name={name} value={isChecked ? "true" : "false"} /> : null}
    </>
  );
}
