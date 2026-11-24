import { useId } from "react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { ManagementAgreementKpis } from "../types";
import { managementPanel } from "./management_agreements_styles";

const card = cn(managementPanel, "relative flex min-w-0 flex-col gap-3.5 overflow-hidden p-6 xl:p-5 2xl:p-6");
const value = "text-[38px] leading-none font-bold tracking-tight text-zinc-950 tabular-nums xl:text-[32px] 2xl:text-[38px] dark:text-zinc-50";
const unit = "text-[15px] font-semibold text-zinc-500 dark:text-zinc-400";
const rowButton = cn(
  "mt-auto flex h-[42px] w-full cursor-pointer items-center gap-2 rounded-xl px-3.5 text-left text-[13.5px] font-semibold transition-colors",
  focusRing,
);

export type ManagementAgreementsKpiProps = {
  kpis: ManagementAgreementKpis;
  /** "Voir les dossiers en attente". */
  onShowPending: () => void;
  /** "Lots affectés aux contrats actifs". */
  onShowAssigned: () => void;
};

export function ManagementAgreementsKpi({ kpis, onShowPending, onShowAssigned }: ManagementAgreementsKpiProps) {
  const { active, commissions, pending, biens } = kpis;
  const percent = Math.round(commissions.percentOfRents);

  return (
    <section aria-label="Indicateurs des contrats de gestion" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <article className={card}>
        <Sparkline values={active.history} />
        <Heading icon="file" tile="bg-brand-600 text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] dark:bg-brand-500">
          Contrats actifs
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{active.count}</span>
          <span className={unit}>actif{active.count > 1 ? "s" : ""}</span>
        </p>
        <p className="mt-auto">
          <span className="inline-flex rounded-xl bg-brand-50 px-3 py-1.5 text-[13px] font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-100">
            sur {active.total} contrat{active.total > 1 ? "s" : ""} enregistré{active.total > 1 ? "s" : ""}
          </span>
        </p>
      </article>

      <article className={card}>
        <Heading icon="cash" tile="bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950">
          Commissions du mois
          <span className="ml-auto shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-brand-700 dark:bg-brand-900/60 dark:text-brand-100">
            {percent} % des loyers
          </span>
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{formatAmount(commissions.amount)}</span>
          <span className={unit}>FCFA</span>
        </p>
        <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400">
          estimées sur {formatAmount(commissions.rents)} FCFA de loyers
        </p>
        <div
          role="progressbar"
          aria-label="Part des commissions dans les loyers"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-auto h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
        >
          <div className="h-full rounded-full bg-brand-600 dark:bg-brand-400" style={{ width: `${Math.min(100, percent)}%` }} />
        </div>
      </article>

      <article className={card}>
        <Heading icon="clock" tile="bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100">
          À traiter
        </Heading>
        <p className="flex flex-wrap items-center gap-3">
          <span className="flex items-baseline gap-2">
            <span className={value}>{pending.count}</span>
            <span className={unit}>dossier{pending.count > 1 ? "s" : ""}</span>
          </span>
          {pending.count > 0 ? (
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              Attention
            </span>
          ) : null}
        </p>
        <button
          type="button"
          onClick={onShowPending}
          disabled={pending.count === 0}
          className={cn(
            rowButton,
            "justify-between bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:cursor-default disabled:opacity-60 dark:bg-brand-900/60 dark:text-brand-100 dark:hover:bg-brand-900",
          )}
        >
          {pending.count > 0 ? "Voir les dossiers en attente" : "Aucun dossier en attente"}
          <Icon name="chevronRight" className="size-4" strokeWidth={2.4} />
        </button>
      </article>

      <article className={card}>
        <Heading icon="building" tile="bg-brand-50 text-brand-600 ring-1 ring-brand-200 ring-inset dark:bg-brand-900/60 dark:text-brand-100 dark:ring-brand-700">
          Biens sous gestion
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{biens.count}</span>
          <span className={unit}>bien{biens.count > 1 ? "s" : ""}</span>
        </p>
        <button
          type="button"
          onClick={onShowAssigned}
          className={cn(rowButton, "bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10")}
        >
          <Icon name="building" className="size-4 text-brand-600 dark:text-brand-100" />
          <span className="flex-1">Lots affectés aux contrats actifs</span>
          <Icon name="chevronRight" className="size-4 text-zinc-500" strokeWidth={2.2} />
        </button>
      </article>
    </section>
  );
}

function Heading({ icon, tile, children }: { icon: IconName; tile: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", tile)}>
        <Icon name={icon} className="size-5.5" strokeWidth={2} />
      </span>
      <h2 className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-snug font-semibold text-zinc-800 dark:text-zinc-100">
        {children}
      </h2>
    </div>
  );
}

/** Decorative trend of active contracts; the count carries the information. */
function Sparkline({ values }: { values: number[] }) {
  const id = useId();
  if (values.length < 2) return null;
  const width = 130;
  const height = 54;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const line = values
    .map((v, index) => {
      const x = 2 + (index / (values.length - 1)) * (width - 4);
      const y = 6 + (1 - (v - min) / span) * (height - 12);
      return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="pointer-events-none absolute top-[4.5rem] right-5 h-[54px] w-[130px] text-brand-500 dark:text-brand-300"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width - 2},${height} L2,${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
