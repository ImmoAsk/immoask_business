// Shared class names for dashboard panels and icon tiles: ImmoAsk blue, amber only for warnings.

export const dashboardPanel =
  "rounded-3xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-zinc-950";

export const toneTile = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-100",
  deep: "bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-100",
  solid: "bg-brand-600 text-white dark:bg-brand-500",
  /** Only for figures that need attention (late payments). */
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
} as const;

export const toneText = {
  brand: "text-brand-700 dark:text-brand-100",
  deep: "text-brand-800 dark:text-brand-100",
  solid: "text-brand-700 dark:text-brand-100",
  warning: "text-amber-700 dark:text-amber-300",
} as const;
