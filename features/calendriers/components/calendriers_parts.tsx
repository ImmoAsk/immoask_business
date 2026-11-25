import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { CalendrierAvailability, CalendrierReason } from "../types";
import { availabilityStyles, reasons } from "./calendriers_styles";

export function AvailabilityBadge({ availability, className }: { availability: CalendrierAvailability; className?: string }) {
  const style = availabilityStyles[availability];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        style.badge,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}

export function ReasonBadge({ reason }: { reason: CalendrierReason }) {
  const style = reasons[reason];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-xs font-semibold whitespace-nowrap", style.badge)}>
      <Icon name={style.icon} className="size-3.5" />
      {style.label}
    </span>
  );
}
