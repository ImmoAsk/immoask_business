import Link from "next/link";
import { initials } from "@/components/layout";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatAmount, MONTHS_LONG, parseMonth } from "@/lib/utils/format";
import type { DashboardEncaissementStatus, DashboardRecentEncaissementData } from "../types";
import { dashboardPanel } from "./dashboard_styles";

const statusStyle: Record<DashboardEncaissementStatus, { label: string; className: string }> = {
  paye: {
    label: "Payé",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  en_retard: {
    label: "En retard",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  en_attente: {
    label: "En attente",
    className: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
  },
};

// Avatar colors are tied to the tenant (stable across reloads and filters), not to the row position.
const avatarTones = [
  "bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-100",
  "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
];

function avatarTone(name: string, status: DashboardEncaissementStatus) {
  if (status === "en_retard") return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return avatarTones[hash % avatarTones.length];
}

export type DashboardRecentEncaissementProps = {
  encaissements: DashboardRecentEncaissementData[];
  total: number;
  /** ISO month "YYYY-MM" the list covers. */
  month: string;
  onRemind?: (encaissement: DashboardRecentEncaissementData) => void;
  className?: string;
};

export function DashboardRecentEncaissement({
  encaissements,
  total,
  month,
  onRemind,
  className,
}: DashboardRecentEncaissementProps) {
  const monthName = MONTHS_LONG[parseMonth(month).monthIndex];

  return (
    <section aria-labelledby="dashboard-recent-title" className={cn(dashboardPanel, "p-6 sm:p-8", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="dashboard-recent-title" className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Derniers encaissements
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Paiements enregistrés ce mois de {monthName}
          </p>
        </div>
        <Link
          href="/app/encaissements"
          className={cn("shrink-0 rounded text-sm font-semibold text-brand-700 hover:underline dark:text-brand-100", focusRing)}
        >
          Voir tout ({total})
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-zinc-100 dark:divide-white/10">
        {encaissements.map((item) => (
          <li key={item.id}>
            <EncaissementRow item={item} onRemind={onRemind} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function EncaissementRow({
  item,
  onRemind,
}: {
  item: DashboardRecentEncaissementData;
  onRemind?: (item: DashboardRecentEncaissementData) => void;
}) {
  const late = item.status === "en_retard";
  const status = statusStyle[item.status];

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 py-4 md:grid-cols-[auto_minmax(0,1.6fr)_minmax(0,1fr)_auto_auto]">
      <span
        className={cn(
          "grid size-12 place-items-center rounded-full text-sm font-semibold",
          avatarTone(item.tenantName, item.status),
        )}
        aria-hidden="true"
      >
        {initials(item.tenantName)}
      </span>

      <div className="min-w-0">
        <p className="truncate font-semibold text-zinc-950 dark:text-zinc-50">{item.tenantName}</p>
        <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
          {item.propertyName} • {item.location}
        </p>
      </div>

      <div className="col-start-2 row-start-2 min-w-0 md:col-start-auto md:row-start-auto md:text-right">
        <p className={cn("font-semibold tabular-nums", late ? "text-amber-700 dark:text-amber-300" : "text-zinc-950 dark:text-zinc-50")}>
          {formatAmount(item.amount)} FCFA
        </p>
        <p className="truncate text-sm text-zinc-400">{item.method}</p>
      </div>

      <span className={cn("col-start-3 row-start-1 justify-self-end rounded-full px-3 py-1 text-sm font-medium md:col-start-auto md:row-start-auto", status.className)}>
        {status.label}
      </span>

      <div className="col-start-3 row-start-2 justify-self-end md:col-start-auto md:row-start-auto">
        {late ? (
          <button
            type="button"
            onClick={() => onRemind?.(item)}
            className={cn(
              "rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-900/60 dark:text-brand-100",
              focusRing,
            )}
          >
            Relancer
          </button>
        ) : item.receiptUrl ? (
          <a
            href={item.receiptUrl}
            aria-label={`Reçu de ${item.tenantName}`}
            className={cn(
              "grid size-9 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10",
              focusRing,
            )}
          >
            <Icon name="receipt" className="size-5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
