"use client";

import { useState } from "react";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import type { ManagementAgreement, ManagementAvailableBien, ManagementTerminationReason } from "../types";
import { fieldLabel, terminationReasons } from "./management_agreements_styles";

const secondary = cn(
  "h-11 cursor-pointer rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/5",
  focusRing,
);

/** A radio choice drawn as a card. */
function Choice({
  name,
  checked,
  onChange,
  tone = "brand",
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  tone?: "brand" | "red";
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand-500",
        checked
          ? tone === "red"
            ? "border-red-600 bg-red-50/70 dark:border-red-500 dark:bg-red-950/30"
            : "border-brand-600 bg-brand-50/70 dark:border-brand-400 dark:bg-brand-900/30"
          : "border-zinc-200 hover:border-zinc-300 dark:border-white/10",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className={cn("size-4.5 shrink-0", tone === "red" ? "accent-red-600!" : "accent-brand-600!")}
      />
      <span className="min-w-0">{children}</span>
    </label>
  );
}

export type AssignBienDialogProps = {
  agreement: ManagementAgreement | null;
  available: ManagementAvailableBien[];
  /** The unassigned properties are still loading. */
  isLoadingAvailable?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (bien: ManagementAvailableBien) => void;
};

/** "Affecter un bien immobilier": pick one of the unassigned properties. */
export function AssignBienDialog({ agreement, available, isLoadingAvailable = false, open, onOpenChange, onConfirm }: AssignBienDialogProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const bien = available.find((item) => item.id === picked) ?? null;
  const close = (value: boolean) => {
    if (!value) setPicked(null);
    onOpenChange(value);
  };

  return (
    <Dialog open={open && agreement !== null} onOpenChange={close} size="md">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Affecter un bien immobilier</DialogTitle>
        <DialogDescription>{agreement?.label}</DialogDescription>
      </DialogHeader>
      <fieldset className="mt-5 flex max-h-80 flex-col gap-2 overflow-y-auto">
        <legend className={cn(fieldLabel, "mb-2")}>Biens disponibles, non affectés</legend>
        {available.length === 0 ? (
          <p role="status" className="text-sm text-zinc-500 dark:text-zinc-400">
            {isLoadingAvailable ? "Chargement des biens…" : "Tous les biens sont déjà affectés à un contrat."}
          </p>
        ) : (
          available.map((item) => (
            <Choice key={item.id} name="management-assign" checked={picked === item.id} onChange={() => setPicked(item.id)}>
              <span className="block font-semibold text-zinc-950 dark:text-zinc-50">{item.label}</span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">{item.details}</span>
            </Choice>
          ))
        )}
      </fieldset>
      <DialogFooter>
        <button type="button" onClick={() => close(false)} className={secondary}>
          Annuler
        </button>
        <button
          type="button"
          disabled={!bien}
          onClick={() => {
            if (!bien) return;
            onConfirm(bien);
            close(false);
          }}
          className={cn(
            "h-11 cursor-pointer rounded-xl bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-brand-500",
            focusRing,
          )}
        >
          Affecter ce bien
        </button>
      </DialogFooter>
    </Dialog>
  );
}

export type TerminateDialogProps = {
  agreement: ManagementAgreement | null;
  /** ISO day the termination takes effect. */
  effectiveDate: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: ManagementTerminationReason) => void;
};

/** "Résilier le contrat": reason and effective date, then confirmation. */
export function TerminateDialog({ agreement, effectiveDate, open, onOpenChange, onConfirm }: TerminateDialogProps) {
  const [reason, setReason] = useState<ManagementTerminationReason>("fin_mandat");
  const close = (value: boolean) => {
    if (!value) setReason("fin_mandat");
    onOpenChange(value);
  };
  const biens = agreement?.biensCount ?? 0;

  return (
    <Dialog open={open && agreement !== null} onOpenChange={close} size="md">
      <div className="flex items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          <Icon name="alert" className="size-5" />
        </span>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Résilier le contrat {agreement?.reference} ?</DialogTitle>
          <DialogDescription className="leading-relaxed">
            {biens > 0
              ? `${biens === 1 ? "Le bien affecté ne sera" : `Les ${biens} biens affectés ne seront`} plus géré${biens > 1 ? "s" : ""} par l'agence à la date d'effet.`
              : "Aucun bien n'est affecté à ce contrat."}{" "}
            Cette action est enregistrée dans l&apos;historique.
          </DialogDescription>
        </DialogHeader>
      </div>
      <fieldset className="mt-5 flex flex-col gap-2">
        <legend className={cn(fieldLabel, "mb-2")}>Motif de résiliation</legend>
        {(Object.keys(terminationReasons) as ManagementTerminationReason[]).map((key) => (
          <Choice key={key} name="management-terminate" tone="red" checked={reason === key} onChange={() => setReason(key)}>
            <span className="font-semibold text-zinc-950 dark:text-zinc-50">{terminationReasons[key]}</span>
          </Choice>
        ))}
      </fieldset>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
        Date d&apos;effet : <strong className="text-zinc-950 dark:text-zinc-50">{formatShortDate(effectiveDate)}</strong>
      </p>
      <DialogFooter>
        <button type="button" onClick={() => close(false)} className={secondary}>
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
