"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/utils/dates";
import { printPdf } from "@/lib/utils/export";
import type { ExportTable } from "@/lib/utils/export";
import { formatAmount } from "@/lib/utils/format";
import { phoneDigits } from "@/lib/utils/phone";
import { collectionTotal, isReceived, lineCommission, lineOwnerShare, natureLabel } from "../hooks/rent_collections_money";
import type { RentCollection, RentCollectionLine } from "../types";
import { channelText, Fcfa, StatusBadge } from "./rent_collections_parts";
import { lineKinds, rentCollectionsPanel } from "./rent_collections_styles";

const primaryButton = cn(
  "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-brand-600 to-brand-700 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(10,116,174,0.7)] hover:from-brand-700 hover:to-brand-800",
  focusRing,
);
const secondaryButton = cn(
  "inline-flex h-12 w-full items-center justify-center rounded-2xl border border-brand-200 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-100 dark:hover:bg-brand-900/40",
  focusRing,
);

export type RentCollectionsDetailProps = {
  collection: RentCollection | null;
  className?: string;
};

/** Breakdown of one payment: what goes to the owner, the agency's commission, charges and deposits. */
export function RentCollectionsDetail({ collection, className }: RentCollectionsDetailProps) {
  if (!collection) {
    return (
      <aside className={cn(rentCollectionsPanel, "p-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}>
        Sélectionnez un encaissement pour voir son détail.
      </aside>
    );
  }

  const received = isReceived(collection);
  const total = collectionTotal(collection);
  const facts: [string, string][] = [
    ["Locataire", collection.tenant.name],
    ["Bien", collection.bien.title],
    ["Quartier", `${collection.bien.quartier}, ${collection.bien.city}`],
    ["Canal", channelText(collection)],
    [received ? "Date" : "Échéance", formatShortDate(collection.date)],
  ];

  return (
    <aside
      aria-labelledby="rent-collection-detail-title"
      className={cn(rentCollectionsPanel, "flex flex-col gap-5 p-6", className)}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Détail</p>
          <h2 id="rent-collection-detail-title" className="text-xl font-bold text-brand-700 dark:text-brand-100">
            #{collection.reference}
          </h2>
        </div>
        <StatusBadge collection={collection} />
      </header>

      <div className="rounded-2xl bg-linear-to-br from-brand-50 to-brand-100/70 p-5 dark:from-brand-900/50 dark:to-brand-950/60">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {received ? "Total encaissé" : "Montant attendu"} · {natureLabel(collection)}
        </p>
        <p className="mt-1 flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight text-brand-700 tabular-nums dark:text-brand-100">
            {formatAmount(total)}
          </span>
          <span className="text-sm font-semibold text-brand-700 dark:text-brand-100">FCFA</span>
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {collection.lines.map((line, index) => (
          <li key={`${line.kind}-${index}`}>
            <LineBreakdown line={line} received={received} />
          </li>
        ))}
      </ul>

      <dl className="flex flex-col gap-2.5 border-t border-zinc-100 pt-5 text-sm dark:border-white/10">
        {facts.map(([term, value]) => (
          <div key={term} className="flex items-baseline justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">{term}</dt>
            <dd className="text-right font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3">
        {received ? (
          <button type="button" onClick={() => printPdf(quittanceTable(collection))} className={primaryButton}>
            <Icon name="download" className="size-4.5" />
            Télécharger la quittance
          </button>
        ) : (
          <a
            href={reminderUrl(collection)}
            target="_blank"
            rel="noreferrer"
            className={primaryButton}
          >
            <Icon name="whatsapp" className="size-4.5" />
            Relancer via WhatsApp
          </a>
        )}
        <Link href="/app/locataires" className={secondaryButton}>
          Voir la fiche du locataire
        </Link>
      </div>
    </aside>
  );
}

function LineBreakdown({ line, received }: { line: RentCollectionLine; received: boolean }) {
  const kind = lineKinds[line.kind];
  const title = line.kind === "loyer" ? kind.label : line.kind === "charges" ? kind.label : line.label;
  const commission = lineCommission(line);
  const ownerShare = lineOwnerShare(line);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl p-4",
        commission > 0
          ? "border border-brand-100 dark:border-brand-800/60"
          : "bg-zinc-50 dark:bg-white/5",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100">
          <Icon name={kind.icon} className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="leading-snug font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
          {line.kind === "charges" ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{line.label}</p>
          ) : null}
        </div>
        <Fcfa amount={line.amount} />
      </div>

      {commission > 0 ? (
        <>
          <div
            className="flex h-2 gap-0.5 overflow-hidden rounded-full"
            role="img"
            aria-label={`${formatAmount(ownerShare)} FCFA ${received ? "reversés" : "à reverser"} au propriétaire, ${formatAmount(commission)} FCFA de commission`}
          >
            <span className="rounded-full bg-brand-600" style={{ width: `${(ownerShare / line.amount) * 100}%` }} />
            <span className="flex-1 rounded-full bg-brand-300" />
          </div>
          <dl className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <span aria-hidden="true" className="size-2 rounded-sm bg-brand-600" />
                {received ? "Reversé au propriétaire" : "À reverser au propriétaire"}
              </dt>
              <dd className="font-semibold whitespace-nowrap text-zinc-900 tabular-nums dark:text-zinc-100">
                {formatAmount(ownerShare)} FCFA
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <span aria-hidden="true" className="size-2 rounded-sm bg-brand-300" />
                Commission {line.commissionPercent} % du loyer
              </dt>
              <dd className="font-semibold whitespace-nowrap text-brand-700 tabular-nums dark:text-brand-100">
                {formatAmount(commission)} FCFA
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="flex justify-end">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/60 dark:text-brand-100">
            {line.kind === "caution" ? "Séquestre · restituable" : line.kind === "service" ? "Prestation" : "Sans commission"}
          </span>
        </p>
      )}
    </div>
  );
}

function reminderUrl(collection: RentCollection) {
  const text =
    `Bonjour ${collection.tenant.name}, petit rappel concernant ${natureLabel(collection).toLowerCase()} ` +
    `(${formatAmount(collectionTotal(collection))} FCFA) pour ${collection.bien.title}. ` +
    `Merci de régulariser dès que possible. — ImmoAsk Business`;
  return `https://wa.me/${phoneDigits(collection.tenant.phone)}?text=${encodeURIComponent(text)}`;
}

/** Printable receipt ("quittance") of a received payment. */
export function quittanceTable(collection: RentCollection): ExportTable {
  return {
    title: `Quittance ${collection.reference} — ${collection.tenant.name}`,
    header: ["Désignation", "Montant"],
    rows: [
      ...collection.lines.map((line) => [
        line.kind === "charges" ? `Charges — ${line.label}` : line.label,
        `${formatAmount(line.amount)} FCFA`,
      ]),
      ["Total encaissé", `${formatAmount(collectionTotal(collection))} FCFA`],
      ["Locataire", collection.tenant.name],
      ["Bien", `${collection.bien.title}, ${collection.bien.quartier} (${collection.bien.city})`],
      ["Canal", channelText(collection)],
      ["Date d'encaissement", formatShortDate(collection.date)],
    ],
    footer: "Quittance valant reçu pour les sommes ci-dessus, sous réserve d'encaissement définitif.",
  };
}
