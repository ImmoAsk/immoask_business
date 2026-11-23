import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import type { RentPaymentKpis } from "../types";
import { rentPaymentsPanel } from "./rent_payments_styles";

const card = cn(rentPaymentsPanel, "flex min-w-0 flex-col gap-5 p-6 xl:p-5 2xl:p-6");
const amount = "text-[30px] leading-none font-bold tracking-tight tabular-nums whitespace-nowrap xl:text-[26px] 2xl:text-[30px]";
const chip = "rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap";

export type RentPaymentsKpiProps = {
  kpis: RentPaymentKpis;
  /** "Relancer sur WhatsApp": shows the late payments, each with its reminder. */
  onShowLate?: () => void;
};

export function RentPaymentsKpi({ kpis, onShowLate }: RentPaymentsKpiProps) {
  const { expected, paid, partial, unpaid } = kpis;
  const share = (value: number) => (expected.amount === 0 ? 0 : (value / expected.amount) * 100);
  const segments = [
    { label: "Payés", value: expected.paid, bar: "bg-white", dot: "bg-white" },
    { label: "Partiels", value: expected.partial, bar: "bg-brand-300", dot: "bg-brand-300" },
    { label: "À payer ou en retard", value: expected.unpaid, bar: "bg-red-300", dot: "bg-red-300" },
  ];

  return (
    <section
      aria-label="Indicateurs des paiements de loyer"
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))]"
    >
      <article className="relative flex min-w-0 flex-col gap-5 overflow-hidden rounded-3xl bg-linear-to-br from-brand-500 via-brand-600 to-brand-900 p-6 text-white shadow-[0_12px_32px_-12px_rgba(10,116,174,0.55)] sm:col-span-2 xl:col-span-1 xl:p-5 2xl:p-6">
        <span aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <Icon name="home" className="size-5" />
          </span>
          <h2 className="flex-1 text-base font-semibold whitespace-nowrap">Total loyers attendus</h2>
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold whitespace-nowrap ring-1 ring-white/20">
            {expected.leases} baux actifs ce mois
          </span>
        </div>
        <p className="relative flex flex-wrap items-baseline gap-x-2">
          <span className="text-[44px] leading-none font-bold tracking-tight whitespace-nowrap tabular-nums xl:text-[40px] 2xl:text-[48px]">
            {formatAmount(expected.amount)}
          </span>
          <span className="text-lg font-semibold text-brand-100">FCFA</span>
        </p>
        <div className="relative mt-auto flex flex-col gap-3">
          <div className="flex h-2.5 gap-1" role="img" aria-label={segments.map((s) => `${s.label} : ${formatAmount(s.value)} FCFA`).join(", ")}>
            {segments
              .filter((segment) => segment.value > 0)
              .map((segment) => (
                <span key={segment.label} className={cn("rounded-full", segment.bar)} style={{ width: `${share(segment.value)}%` }} />
              ))}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-brand-50">
            {segments.map((segment) => (
              <li key={segment.label} className="flex items-center gap-2 whitespace-nowrap">
                <span aria-hidden="true" className={cn("size-2 rounded-sm", segment.dot)} />
                {segment.label} · {formatAmount(segment.value)}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <article className={card}>
        <Heading icon="checkCircle">Complètement payés</Heading>
        <Amount value={paid.amount} tone="text-brand-700 dark:text-brand-100" />
        <div className="mt-auto flex flex-wrap gap-2">
          <span className={cn(chip, "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100")}>
            {paid.receipts} quittance{paid.receipts > 1 ? "s" : ""} émise{paid.receipts > 1 ? "s" : ""}
          </span>
        </div>
      </article>

      <article className={card}>
        <Heading icon="pieChart">Paiements partiels</Heading>
        <Amount value={partial.amount} tone="text-zinc-950 dark:text-zinc-50" />
        <div className="mt-auto flex flex-col items-start gap-2">
          <span className={cn(chip, "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100")}>
            Perçu {formatAmount(partial.received)}
          </span>
          {partial.count > 0 ? (
            <span className={cn(chip, "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300")}>
              Reste {formatAmount(partial.remaining)} · {partial.count} dossier{partial.count > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
      </article>

      {/* Rent not received: the one card allowed a warning colour. */}
      <article
        className={cn(
          card,
          unpaid.count > 0 &&
            "border-red-100 bg-linear-to-b from-red-50/80 to-white dark:border-red-900/40 dark:from-red-950/40 dark:to-zinc-950",
        )}
      >
        <Heading icon="clock" warning={unpaid.count > 0}>
          À payer ou en retard
        </Heading>
        <Amount value={unpaid.amount} tone={unpaid.count > 0 ? "text-red-700 dark:text-red-400" : "text-zinc-950 dark:text-zinc-50"} />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          {unpaid.count > 0 ? (
            <>
              <span className={cn(chip, "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300")}>
                {unpaid.count} impayé{unpaid.count > 1 ? "s" : ""}
              </span>
              {unpaid.late > 0 && onShowLate ? (
                <button
                  type="button"
                  onClick={onShowLate}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg text-sm font-semibold text-brand-700 hover:underline dark:text-brand-100",
                    focusRing,
                  )}
                >
                  <Icon name="whatsapp" className="size-4" />
                  Relancer sur WhatsApp
                  <Icon name="arrowRight" className="size-3.5" />
                </button>
              ) : null}
            </>
          ) : (
            <span className="text-sm text-brand-700 dark:text-brand-100">Tous les loyers sont réglés</span>
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

function Amount({ value, tone }: { value: number; tone: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5">
      <span className={cn(amount, tone)}>{formatAmount(value)}</span>
      <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">FCFA</span>
    </p>
  );
}
