"use client";

import { useState } from "react";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { RentAgreement, RentTerminationReason } from "../types";
import { depositText } from "./rent_agreements_parts";
import { fieldLabel, terminationReasons } from "./rent_agreements_styles";

export type RentTerminateDialogProps = {
  agreement: RentAgreement | null;
  /** ISO day the termination takes effect. */
  effectiveDate: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: RentTerminationReason) => void;
};

/** "Résilier le contrat": reason and effective date, then confirmation. */
export function RentTerminateDialog({ agreement, effectiveDate, open, onOpenChange, onConfirm }: RentTerminateDialogProps) {
  const [reason, setReason] = useState<RentTerminationReason>("depart_locataire");
  const close = (value: boolean) => {
    if (!value) setReason("depart_locataire");
    onOpenChange(value);
  };

  return (
    <Dialog open={open && agreement !== null} onOpenChange={close} size="md">
      <div className="flex items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          <Icon name="alert" className="size-5" />
        </span>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Résilier le contrat {agreement?.reference} ?</DialogTitle>
          <DialogDescription className="leading-relaxed">
            La location de {agreement?.tenant} prend fin à la date d&apos;effet. La caution ({agreement ? depositText(agreement).value : ""})
            devra être restituée selon l&apos;état des lieux de sortie.
          </DialogDescription>
        </DialogHeader>
      </div>
      <fieldset className="mt-5 flex flex-col gap-2">
        <legend className={cn(fieldLabel, "mb-2")}>Motif de résiliation</legend>
        {(Object.keys(terminationReasons) as RentTerminationReason[]).map((key) => (
          <label
            key={key}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold text-zinc-950 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand-500 dark:text-zinc-50",
              reason === key ? "border-red-600 bg-red-50/70 dark:border-red-500 dark:bg-red-950/30" : "border-zinc-200 hover:border-zinc-300 dark:border-white/10",
            )}
          >
            <input
              type="radio"
              name="rent-terminate"
              checked={reason === key}
              onChange={() => setReason(key)}
              className="size-4.5 shrink-0 accent-red-600!"
            />
            {terminationReasons[key]}
          </label>
        ))}
      </fieldset>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
        Date d&apos;effet : <strong className="text-zinc-950 dark:text-zinc-50">{formatShortDate(effectiveDate)}</strong>
      </p>
      <DialogFooter>
        <button
          type="button"
          onClick={() => close(false)}
          className={cn(
            "h-11 cursor-pointer rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/5",
            focusRing,
          )}
        >
          Garder le contrat
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm(reason);
            close(false);
          }}
          className={cn("h-11 cursor-pointer rounded-xl bg-red-700 px-5 text-sm font-bold text-white hover:bg-red-800", focusRing)}
        >
          Confirmer la résiliation
        </button>
      </DialogFooter>
    </Dialog>
  );
}
