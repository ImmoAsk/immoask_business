import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/utils/format";
import { COMPTABILITE_CATEGORIES } from "../hooks/comptabilites_categories";
import type { ComptabiliteCategory, ComptabiliteOperation } from "../types";
import { categoryIcons, comptabilitesPanel, flowColors } from "./comptabilites_styles";
import { OperationsHeader } from "./comptabilites_table";

/** "Graphique" view: the filtered operations totalled per category, on one shared scale. */
export function ComptabilitesCategoryChart({ results, className }: { results: ComptabiliteOperation[]; className?: string }) {
  const rows = (Object.keys(COMPTABILITE_CATEGORIES) as ComptabiliteCategory[])
    .map((category) => {
      const operations = results.filter((operation) => operation.category === category);
      return {
        category,
        flow: COMPTABILITE_CATEGORIES[category].flow,
        count: operations.length,
        amount: operations.reduce((sum, operation) => sum + operation.amount, 0),
      };
    })
    .filter((row) => row.count > 0);
  const max = Math.max(1, ...rows.map((row) => row.amount));

  return (
    <section aria-labelledby="comptabilites-category-title" className={cn(comptabilitesPanel, className)}>
      <OperationsHeader results={results} title="Opérations par catégorie" id="comptabilites-category-title" icon="trendUp" />
      <div className="flex flex-col gap-4 p-6">
        <ul className="flex gap-5 text-sm text-zinc-700 dark:text-zinc-300">
          {(["recette", "depense"] as const).map((flow) => (
            <li key={flow} className="flex items-center gap-2">
              <span aria-hidden="true" className={cn("size-2.5 rounded-full", flowColors[flow].bg)} />
              {flowColors[flow].label}
            </li>
          ))}
        </ul>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">Aucune opération ne correspond.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((row) => (
              <li
                key={row.category}
                className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] items-center gap-4 max-sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  <Icon name={categoryIcons[row.category]} className="size-4 shrink-0 text-brand-600 dark:text-brand-100" />
                  <span className="truncate">{COMPTABILITE_CATEGORIES[row.category].label}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">({row.count})</span>
                </span>
                <span className="h-3 rounded-full bg-zinc-100 max-sm:order-last max-sm:col-span-2 dark:bg-white/5" aria-hidden="true">
                  <span
                    className={cn("block h-full rounded-full", flowColors[row.flow].bg)}
                    style={{ width: `${(row.amount / max) * 100}%` }}
                  />
                </span>
                <span className="text-right text-sm font-semibold text-zinc-950 tabular-nums dark:text-zinc-50">
                  {row.flow === "recette" ? "+" : "−"}
                  {formatAmount(row.amount)} FCFA
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
