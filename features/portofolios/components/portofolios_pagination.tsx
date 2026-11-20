import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { PORTOFOLIO_PAGE_SIZES } from "../hooks/use_portofolio_list";

/** Page numbers with gaps: 1 … 4 5 6 … 12 */
function pageList(page: number, pageCount: number): (number | "gap")[] {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, index) => (index > 0 && p - sorted[index - 1] > 1 ? ["gap" as const, p] : [p]));
}

const pageButton = cn(
  "inline-flex h-9 min-w-9 cursor-pointer items-center justify-center gap-1 rounded-xl border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5",
  focusRing,
);

export type PortofoliosPaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  range: { from: number; to: number };
  total: number;
  pageSize?: number;
  /** Shows the "Lignes par page" select when provided. */
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
};

export function PortofoliosPagination({
  page,
  pageCount,
  onPageChange,
  range,
  total,
  pageSize,
  onPageSizeChange,
  className,
}: PortofoliosPaginationProps) {
  return (
    <div className={cn("flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-zinc-600 dark:text-zinc-400">
        <p aria-live="polite">
          Affichage de <strong className="text-zinc-950 dark:text-zinc-50">{range.from}</strong> à{" "}
          <strong className="text-zinc-950 dark:text-zinc-50">{range.to}</strong> sur{" "}
          <strong className="text-zinc-950 dark:text-zinc-50">{total}</strong> bien{total > 1 ? "s" : ""}
        </p>
        {onPageSizeChange && pageSize ? (
          <label className="flex items-center gap-2 border-zinc-200 sm:border-l sm:pl-5 dark:border-white/10">
            Lignes par page :
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className={cn(
                "h-9 cursor-pointer rounded-xl border border-zinc-200 bg-white px-2 font-medium text-zinc-900 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100",
                focusRing,
              )}
            >
              {PORTOFOLIO_PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={pageButton}
          aria-label="Page précédente"
        >
          <Icon name="chevronLeft" className="size-4" />
          <span className="hidden md:inline">Précédent</span>
        </button>
        {pageList(page, pageCount).map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-zinc-400">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Page ${item}`}
              className={cn(
                pageButton,
                item === page &&
                  "border-brand-600 bg-brand-600 text-white hover:bg-brand-600 dark:border-brand-500 dark:bg-brand-500 dark:text-white dark:hover:bg-brand-500",
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className={pageButton}
          aria-label="Page suivante"
        >
          <span className="hidden md:inline">Suivant</span>
          <Icon name="chevronRight" className="size-4" />
        </button>
      </nav>
    </div>
  );
}
