// Client-side table exports (no server, no dependency). Call from a click handler.

export type ExportCell = string | number;

export type ExportTable = {
  /** File name without extension, also the PDF title. */
  title: string;
  header: string[];
  rows: ExportCell[][];
  /** PDF footer; defaults to the row count. */
  footer?: string;
};

function csvCell(value: ExportCell) {
  const text = String(value);
  return /[";\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function slug(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

/** Semicolon-separated with a BOM, so Excel (fr) opens accents and columns correctly. */
export function downloadCsv({ title, header, rows }: ExportTable) {
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(title)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: ExportCell) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Opens the browser's print dialog on a clean A4 landscape table; "Enregistrer au format PDF"
 * produces the file. Uses a hidden iframe, so no pop-up blocker is involved.
 */
export function printPdf({ title, header, rows, footer }: ExportTable) {
  const generated = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" }).format(new Date());
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
@page { size: A4 landscape; margin: 14mm; }
* { box-sizing: border-box; }
body { font: 11px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; color: #18181b; margin: 0; }
header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #0a74ae; padding-bottom: 8px; margin-bottom: 12px; }
h1 { font-size: 18px; margin: 0; color: #06304a; }
.meta { color: #71717a; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; background: #eaf5fc; color: #075f93; font-weight: 600; }
th, td { padding: 6px 8px; border-bottom: 1px solid #e4e4e7; vertical-align: top; }
tr { break-inside: avoid; }
footer { margin-top: 10px; color: #71717a; }
</style></head><body>
<header><h1>${escapeHtml(title)}</h1><span class="meta">ImmoAsk Business · ${escapeHtml(generated)}</span></header>
<table><thead><tr>${header.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>
<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>
<footer>${escapeHtml(footer ?? `${rows.length} ligne${rows.length > 1 ? "s" : ""}`)}</footer>
</body></html>`;

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.append(frame);
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    frame.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();
  win.addEventListener("afterprint", () => frame.remove(), { once: true });
  win.focus();
  win.print();
}
