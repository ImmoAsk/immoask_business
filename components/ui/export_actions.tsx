"use client";

import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { downloadCsv, printPdf } from "@/lib/utils/export";
import type { ExportTable } from "@/lib/utils/export";

const button = cn(
  "inline-flex h-9 cursor-pointer items-center gap-1.5 px-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/5",
  focusRing,
);

export type ExportActionsProps = {
  /** Built on click, so it reflects the current selection or results. */
  getTable: () => ExportTable;
  /** Rows the export will contain, shown in the label. */
  count: number;
  /** True when the export covers checked rows only. */
  selection?: boolean;
  className?: string;
};

/** "Exporter" label with CSV and PDF buttons. */
export function ExportActions({ getTable, count, selection = false, className }: ExportActionsProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <span className="hidden font-medium text-zinc-500 sm:inline dark:text-zinc-400">
        {selection ? `Exporter la sélection (${count})` : `Exporter (${count})`}
      </span>
      <div
        role="group"
        aria-label={selection ? `Exporter les ${count} lignes sélectionnées` : `Exporter les ${count} lignes`}
        className="inline-flex divide-x divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-zinc-950"
      >
        <button type="button" disabled={count === 0} onClick={() => downloadCsv(getTable())} className={button}>
          <Icon name="download" className="size-4" />
          CSV
        </button>
        <button type="button" disabled={count === 0} onClick={() => printPdf(getTable())} className={button}>
          <Icon name="file" className="size-4" />
          PDF
        </button>
      </div>
    </div>
  );
}
