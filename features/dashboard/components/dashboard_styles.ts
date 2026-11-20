// Shared class names for dashboard panels and colored icon tiles.

export const dashboardPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const toneTile = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
} as const;

export const toneText = {
  brand: "text-brand-700 dark:text-brand-100",
  amber: "text-amber-700 dark:text-amber-300",
  indigo: "text-indigo-600 dark:text-indigo-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
} as const;
