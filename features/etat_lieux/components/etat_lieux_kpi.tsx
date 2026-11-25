import { useId } from "react";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { InventoryKpis } from "../types";
import { etatLieuxPanel } from "./etat_lieux_styles";

const card = cn(etatLieuxPanel, "relative flex min-w-0 flex-col gap-3.5 overflow-hidden p-6 xl:p-5 2xl:p-6");
const value = "text-[38px] leading-none font-bold tracking-tight text-zinc-950 tabular-nums xl:text-[32px] 2xl:text-[38px] dark:text-zinc-50";
const unit = "text-[15px] font-semibold text-zinc-500 dark:text-zinc-400";

export type EtatLieuxKpiProps = {
  kpis: InventoryKpis;
  /** "Voir les éléments endommagés". */
  onShowDamaged: () => void;
};

export function EtatLieuxKpi({ kpis, onShowDamaged }: EtatLieuxKpiProps) {
  const { inventories, damaged, damageCost, good } = kpis;
  const costedPercent = Math.round(damageCost.percent);
  const goodPercent = Math.round(good.percent);

  return (
    <section aria-label="Indicateurs des inventaires" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <article className={card}>
        <Sparkline values={inventories.history} />
        <Heading icon="clipboardCheck" tile="bg-brand-600 text-white shadow-[0_8px_18px_-6px_rgba(10,116,174,0.6)] dark:bg-brand-500">
          Inventaires réalisés
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{inventories.count}</span>
          <span className={unit}>inventaire{inventories.count > 1 ? "s" : ""}</span>
        </p>
        <p className="mt-auto">
          <span className="inline-flex rounded-xl bg-brand-50 px-3 py-1.5 text-[13px] font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-100">
            {inventories.entries} entrée{inventories.entries > 1 ? "s" : ""} · {inventories.exits} sortie{inventories.exits > 1 ? "s" : ""}
          </span>
        </p>
      </article>

      <article className={card}>
        <Heading icon="alert" tile="bg-brand-900 text-white dark:bg-brand-300 dark:text-brand-950">
          Éléments endommagés
        </Heading>
        <p className="flex flex-wrap items-center gap-3">
          <span className="flex items-baseline gap-2">
            <span className={value}>{damaged.count}</span>
            <span className={unit}>élément{damaged.count > 1 ? "s" : ""}</span>
          </span>
          {damaged.count > 0 ? (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">À chiffrer</span>
          ) : null}
        </p>
        <button
          type="button"
          onClick={onShowDamaged}
          disabled={damaged.count === 0}
          className={cn(
            "mt-auto flex h-[42px] w-full cursor-pointer items-center justify-between gap-2 rounded-xl bg-brand-50 px-3.5 text-left text-[13.5px] font-semibold text-brand-700 transition-colors hover:bg-brand-100 disabled:cursor-default disabled:opacity-60 dark:bg-brand-900/60 dark:text-brand-100 dark:hover:bg-brand-900",
            focusRing,
          )}
        >
          {damaged.count > 0 ? "Voir les éléments endommagés" : "Aucun élément endommagé"}
          <Icon name="chevronRight" className="size-4" strokeWidth={2.4} />
        </button>
      </article>

      <article className={card}>
        <Heading icon="cash" tile="bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100">
          Coût des dégradations
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{formatAmount(damageCost.amount)}</span>
          <span className={unit}>FCFA</span>
        </p>
        <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400">
          {damageCost.costed} sur {damageCost.damaged} élément{damageCost.damaged > 1 ? "s" : ""} endommagé{damageCost.damaged > 1 ? "s" : ""} chiffré
          {damageCost.costed > 1 ? "s" : ""}
        </p>
        <Progress label="Éléments endommagés chiffrés" percent={costedPercent} />
      </article>

      <article className={card}>
        <Heading icon="shield" tile="bg-brand-50 text-brand-600 ring-1 ring-brand-200 ring-inset dark:bg-brand-900/60 dark:text-brand-100 dark:ring-brand-700">
          Éléments en bon état
          <span className="ml-auto shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-brand-700 dark:bg-brand-900/60 dark:text-brand-100">
            {goodPercent} %
          </span>
        </Heading>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={value}>{good.count}</span>
          <span className={unit}>élément{good.count > 1 ? "s" : ""}</span>
        </p>
        <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400">« Bon » ou « Excellent » sur {good.total} éléments inventoriés</p>
        <Progress label="Éléments en bon état" percent={goodPercent} />
      </article>
    </section>
  );
}

function Progress({ label, percent }: { label: string; percent: number }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="mt-auto h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
    >
      <div className="h-full rounded-full bg-brand-600 dark:bg-brand-400" style={{ width: `${percent}%` }} />
    </div>
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

/** Decorative trend of inventories on record; the count carries the information. */
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
