import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { RentCollectionKpis } from "../types";
import { rentCollectionsPanel } from "./rent_collections_styles";

const card = cn(rentCollectionsPanel, "flex min-w-0 flex-col gap-5 p-6 xl:p-5 2xl:p-6");
const amount = "text-[30px] leading-none font-bold tracking-tight tabular-nums whitespace-nowrap xl:text-[26px] 2xl:text-[30px]";
const chip = "rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap";
const percent = (value: number) => value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

export type RentCollectionsKpiProps = {
  kpis: RentCollectionKpis;
  /** "Relancer": shows the payments not received. */
  onShowPending?: () => void;
};

export function RentCollectionsKpi({ kpis, onShowPending }: RentCollectionsKpiProps) {
  const { rent, charges, deposits, pending } = kpis;
  const recovered = Math.min(100, rent.recoveredPercent);

  return (
    <section
      aria-label="Indicateurs des encaissements"
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))]"
    >
      {/* Rent: the headline figure, on ImmoAsk blue. */}
      <article className="relative flex min-w-0 flex-col gap-5 overflow-hidden rounded-3xl bg-linear-to-br from-brand-500 via-brand-600 to-brand-900 p-6 text-white shadow-[0_12px_32px_-12px_rgba(10,116,174,0.55)] sm:col-span-2 xl:col-span-1 xl:p-5 2xl:p-6">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <Icon name="cash" className="size-5" />
          </span>
          <h2 className="flex-1 text-base font-semibold">Total loyers encaissé</h2>
          {rent.deltaPercent !== null ? (
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold whitespace-nowrap ring-1 ring-white/20">
              {rent.deltaPercent >= 0 ? "+" : "−"}
              {percent(Math.abs(rent.deltaPercent))} % vs M-1
            </span>
          ) : null}
        </div>
        <p className="relative flex flex-wrap items-baseline gap-x-2">
          <span className="text-[44px] leading-none font-bold tracking-tight whitespace-nowrap tabular-nums xl:text-[40px] 2xl:text-[48px]">
            {formatAmount(rent.amount)}
          </span>
          <span className="text-lg font-semibold text-brand-100">FCFA</span>
        </p>
        <div className="relative mt-auto flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold">
            <span>{percent(recovered)} % recouvré</span>
            <span className="text-brand-100">
              {rent.count} encaissement{rent.count > 1 ? "s" : ""}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Loyers recouvrés"
            aria-valuenow={Math.round(recovered)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-white/25"
          >
            <div className="h-full rounded-full bg-white" style={{ width: `${recovered}%` }} />
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-brand-50">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2 rounded-sm bg-white" />
              Mobile Money · {rent.mobileMoneyCount}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2 rounded-sm bg-brand-300" />
              Virements et autres · {rent.otherCount}
            </li>
          </ul>
        </div>
      </article>

      <article className={card}>
        <Heading icon="file">Charges locatives</Heading>
        <Amount value={charges.amount} />
        <div className="mt-auto flex flex-wrap gap-2">
          <span className={cn(chip, "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100")}>
            {charges.water} eau
          </span>
          <span className={cn(chip, "bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100")}>
            {charges.electricity} électricité
          </span>
        </div>
      </article>

      <article className={card}>
        <Heading icon="shield">Total cautions</Heading>
        <Amount value={deposits.amount} />
        <div className="mt-auto flex flex-wrap gap-2">
          <span className={cn(chip, "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300")}>
            {deposits.count} dépôt{deposits.count > 1 ? "s" : ""}
          </span>
          {deposits.escrowActive ? (
            <span className={cn(chip, "bg-brand-600 text-white dark:bg-brand-500")}>Séquestre actif</span>
          ) : null}
        </div>
      </article>

      {/* Money not received: the one card allowed a warning colour. */}
      <article
        className={cn(
          card,
          pending.count > 0 &&
            "border-red-100 bg-linear-to-b from-red-50/80 to-white dark:border-red-900/40 dark:from-red-950/40 dark:to-zinc-950",
        )}
      >
        <Heading icon="clock" warning={pending.count > 0}>
          En attente et retards
        </Heading>
        <Amount value={pending.amount} warning={pending.count > 0} />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          {pending.count > 0 ? (
            <>
              <span className={cn(chip, "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300")}>
                {pending.count} dossier{pending.count > 1 ? "s" : ""}
              </span>
              {onShowPending ? (
                <button
                  type="button"
                  onClick={onShowPending}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg text-sm font-semibold text-brand-700 hover:underline dark:text-brand-100",
                    focusRing,
                  )}
                >
                  Relancer <Icon name="arrowRight" className="size-4" />
                </button>
              ) : null}
            </>
          ) : (
            <span className="text-sm text-brand-700 dark:text-brand-100">Tout est encaissé</span>
          )}
        </div>
      </article>
    </section>
  );
}

function Heading({ icon, warning = false, children }: { icon: IconName; warning?: boolean; children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-2xl",
          warning
            ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300"
            : "bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100",
        )}
      >
        <Icon name={icon} className="size-5" />
      </span>
      <h2
        className={cn(
          "text-[15px] leading-snug font-semibold",
          warning ? "text-red-700 dark:text-red-300" : "text-zinc-700 dark:text-zinc-200",
        )}
      >
        {children}
      </h2>
    </div>
  );
}

function Amount({ value, warning = false }: { value: number; warning?: boolean }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5">
      <span className={cn(amount, warning ? "text-red-700 dark:text-red-400" : "text-zinc-950 dark:text-zinc-50")}>
        {formatAmount(value)}
      </span>
      <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">FCFA</span>
    </p>
  );
}
