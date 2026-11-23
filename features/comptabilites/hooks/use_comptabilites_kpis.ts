import type {
  ComptabiliteBreakdownSlice,
  ComptabiliteCategory,
  ComptabiliteKpis,
  ComptabiliteMonthPoint,
  ComptabiliteOperation,
  ComptabilitesData,
  ComptabiliteTrend,
} from "../types";
import { COMPTABILITE_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./comptabilites_categories";

const sum = (operations: ComptabiliteOperation[]) => operations.reduce((total, operation) => total + operation.amount, 0);

function trend(history: number[]): ComptabiliteTrend {
  const amount = history.at(-1) ?? 0;
  const previous = history.at(-2);
  return {
    amount,
    deltaPercent: previous ? ((amount - previous) / Math.abs(previous)) * 100 : null,
    history,
  };
}

/** Months of the chart: closed months, then the month in progress computed from its operations. */
export function computeMonthlySeries(data: ComptabilitesData): ComptabiliteMonthPoint[] {
  const income = sum(data.operations.filter((operation) => operation.flow === "recette"));
  const expenses = sum(data.operations.filter((operation) => operation.flow === "depense"));
  return [
    ...data.history.map((month) => ({ ...month, balance: month.income - month.expenses, current: false })),
    { month: data.asOf.slice(0, 7), income, expenses, balance: income - expenses, current: true },
  ];
}

/** Share of each category in a flow; percentages are rounded so they add up to 100. */
export function computeBreakdown(
  operations: ComptabiliteOperation[],
  categories: readonly ComptabiliteCategory[],
): { total: number; slices: ComptabiliteBreakdownSlice[] } {
  const amounts = categories.map((category) => sum(operations.filter((operation) => operation.category === category)));
  const total = amounts.reduce((a, b) => a + b, 0);
  const raw = amounts.map((amount) => (total === 0 ? 0 : (amount / total) * 100));
  const percents = raw.map(Math.floor);
  // Largest remainders get the missing points, so the legend never shows 99 % or 101 %.
  const missing = total === 0 ? 0 : 100 - percents.reduce((a, b) => a + b, 0);
  raw
    .map((value, index) => ({ index, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest)
    .slice(0, missing)
    .forEach(({ index }) => (percents[index] += 1));
  return {
    total,
    slices: categories.map((category, index) => ({
      category,
      label: COMPTABILITE_CATEGORIES[category].label,
      amount: amounts[index],
      percent: percents[index],
    })),
  };
}

/** Cards, chart series and breakdowns, all derived from the same data. */
export function computeComptabilitesKpis(data: ComptabilitesData) {
  const series = computeMonthlySeries(data);
  const kpis: ComptabiliteKpis = {
    income: trend(series.map((month) => month.income)),
    expenses: trend(series.map((month) => month.expenses)),
    balance: trend(series.map((month) => month.balance)),
    ledger: { ...data.ledger, balanced: data.ledger.assets === data.ledger.liabilities },
  };
  return {
    kpis,
    series,
    incomeBreakdown: computeBreakdown(data.operations, INCOME_CATEGORIES),
    expenseBreakdown: computeBreakdown(data.operations, EXPENSE_CATEGORIES),
  };
}

export function useComptabilitesKpis(data: ComptabilitesData) {
  return computeComptabilitesKpis(data);
}

export type UseComptabilitesKpisResult = ReturnType<typeof useComptabilitesKpis>;
