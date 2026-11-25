"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { printPdf } from "@/lib/utils/export";
import { agoLabel, compareLines, counterpart, KIND_LABELS } from "../hooks/etat_lieux_items";
import type { InventoryLine } from "../types";
import { ConditionBadge, costText, inventorySheet, KindTile, TypeBadge } from "./etat_lieux_parts";
import { etatLieuxPanel, fieldLabel } from "./etat_lieux_styles";

const LONG_DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const outline = cn(
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-300 bg-white px-2 text-center text-[13.5px] font-semibold whitespace-nowrap text-zinc-900 hover:border-brand-400 dark:border-white/15 dark:bg-transparent dark:text-zinc-100",
  focusRing,
);

const VERDICTS = {
  worse: { text: "Dégradation constatée", style: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
  same: { text: "État inchangé entre l'entrée et la sortie", style: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100" },
  better: { text: "État amélioré depuis l'entrée", style: "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100" },
};

export type EtatLieuxDetailProps = {
  line: InventoryLine | null;
  /** Every inventoried item, to find the other inventory and build the sheet. */
  lines: InventoryLine[];
  asOf: string;
  /** "Voir l'inventaire complet". */
  onShowInventory: () => void;
  onAddPhoto: () => void;
  className?: string;
};

/** The selected item: photos, facts, entry → exit comparison and actions. */
export function EtatLieuxDetail({ line, lines, asOf, onShowInventory, onAddPhoto, className }: EtatLieuxDetailProps) {
  const [photo, setPhoto] = useState(0);

  if (!line) {
    return (
      <aside className={cn(etatLieuxPanel, "p-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
        Sélectionnez un élément pour voir son détail.
      </aside>
    );
  }

  const current = Math.min(photo, line.photos - 1);
  const damaged = line.condition === "endommage";
  const captions = ["Vue d'ensemble", damaged ? "Dommage constaté" : "Détail", "Vue rapprochée", "Angle"];
  const other = counterpart(line, lines);
  const comparison = other ? compareLines(line, other) : null;
  const facts: [string, string, string?][] = [
    ["Locataire", line.inventory.tenant],
    ["Gestionnaire", line.inventory.manager],
    ["Date d'inventaire", LONG_DATE.format(new Date(`${line.inventory.date}T00:00:00Z`)), agoLabel(line.inventory.date, asOf)],
  ];

  return (
    <aside aria-labelledby="etat-lieux-detail-title" className={cn(etatLieuxPanel, "overflow-hidden", className)}>
      <div className="relative">
        <KindTile kind={line.kind} variant={current} className="h-52 w-full" iconClassName="size-22" />
        <span className="absolute bottom-3.5 left-4 rounded-full bg-brand-950/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {captions[current % captions.length]} · {current + 1}/{line.photos}
        </span>
        <TypeBadge type={line.inventory.type} className="absolute top-4 right-4 bg-white! ring-0! dark:bg-zinc-950!" />
        {damaged && current === 1 ? (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
            <Icon name="alert" className="size-3.5" strokeWidth={2.4} />
            Dommage constaté
          </span>
        ) : null}
      </div>

      <div role="group" aria-label="Photos de l'élément" className="flex flex-wrap gap-2 px-6 pt-3">
        {Array.from({ length: line.photos }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Afficher la photo ${index + 1}`}
            aria-pressed={index === current}
            onClick={() => setPhoto(index)}
            className={cn(
              "cursor-pointer overflow-hidden rounded-[10px] border-2 transition-opacity",
              focusRing,
              index === current ? "border-brand-600 dark:border-brand-400" : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <KindTile kind={line.kind} variant={index} className="h-11 w-15" iconClassName="size-4.5" />
          </button>
        ))}
        <button
          type="button"
          onClick={onAddPhoto}
          aria-label="Ajouter une photo"
          className={cn(
            "grid h-12 w-16 cursor-pointer place-items-center rounded-[10px] border-2 border-dashed border-zinc-300 text-brand-700 hover:border-brand-400 dark:border-white/20 dark:text-brand-100",
            focusRing,
          )}
        >
          <Icon name="plus" className="size-4.5" strokeWidth={2.4} />
        </button>
      </div>

      <div className="flex flex-col gap-5 p-6 pt-5">
        <div>
          <p className="text-xs font-bold tracking-[0.1em] text-brand-700 tabular-nums dark:text-brand-100">{line.inventory.reference}</p>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <h2 id="etat-lieux-detail-title" className="text-[19px] leading-snug font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              {line.element}
            </h2>
            <ConditionBadge condition={line.condition} className="mt-0.5 shrink-0" />
          </div>
          <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
            {KIND_LABELS[line.kind]} · {line.room}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="col-span-2 min-w-0">
            <dt className={fieldLabel}>Propriété</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{line.inventory.property}</dd>
          </div>
          {facts.map(([term, value, sub]) => (
            <div key={term} className="min-w-0">
              <dt className={fieldLabel}>{term}</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
              {sub ? <dd className="text-xs text-zinc-500 dark:text-zinc-400">{sub}</dd> : null}
            </div>
          ))}
          <div className="min-w-0">
            <dt className={fieldLabel}>Coût de l&apos;élément</dt>
            <dd className={cn("mt-1 text-sm font-bold tabular-nums", line.cost === null ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-950 dark:text-zinc-50")}>
              {line.cost === null ? "Non renseigné" : costText(line.cost)}
            </dd>
          </div>
        </dl>

        {comparison ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 dark:border-white/10 dark:bg-white/5">
            <p className={cn(fieldLabel, "mb-2.5")}>Comparaison entrée → sortie</p>
            <div className="flex items-center gap-2.5">
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-xs text-zinc-500 dark:text-zinc-400">Entrée · {formatShortDate(comparison.entry.inventory.date)}</p>
                <ConditionBadge condition={comparison.entry.condition} />
              </div>
              <Icon name="arrowRight" className="size-5 shrink-0 text-zinc-400" strokeWidth={2.2} />
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-xs text-zinc-500 dark:text-zinc-400">Sortie · {formatShortDate(comparison.exit.inventory.date)}</p>
                <ConditionBadge condition={comparison.exit.condition} />
              </div>
            </div>
            <p className={cn("mt-3 rounded-xl px-3 py-2 text-[13px] font-bold", VERDICTS[comparison.trend].style)}>
              {VERDICTS[comparison.trend].text}
              {comparison.trend === "worse" && comparison.exit.cost !== null ? ` · ${costText(comparison.exit.cost)} à chiffrer` : ""}
            </p>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-3 text-[13px] leading-relaxed text-zinc-500 dark:border-white/15 dark:text-zinc-400">
            Aucun inventaire {line.inventory.type === "entree" ? "de sortie" : "d'entrée"} enregistré pour cet élément : la comparaison sera disponible dès
            qu&apos;il sera réalisé.
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onShowInventory}
            className={cn(
              "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] hover:from-brand-600 hover:to-brand-800",
              focusRing,
            )}
          >
            <Icon name="clipboard" className="size-4.5" strokeWidth={2.2} />
            Voir l&apos;inventaire complet
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={() => printPdf(inventorySheet(line, lines))} className={outline}>
              <Icon name="download" className="mr-1.5 size-4 text-brand-600 dark:text-brand-100" />
              Fiche PDF
            </button>
            <Link href="/app/portofolio" className={outline}>
              Voir la propriété
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
