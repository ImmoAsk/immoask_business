import type { ComptabiliteCategory } from "./comptabilite_operation";

export type ComptabiliteTrend = {
  amount: number;
  /** Change vs last month, %, null without history. */
  deltaPercent: number | null;
  /** Monthly values, oldest first, ending with this month. */
  history: number[];
};

/** Figures for the four cards. */
export type ComptabiliteKpis = {
  income: ComptabiliteTrend;
  expenses: ComptabiliteTrend;
  balance: ComptabiliteTrend;
  ledger: { assets: number; liabilities: number; balanced: boolean };
};

/** One month in the overview chart. */
export type ComptabiliteMonthPoint = {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  /** The month in progress. */
  current: boolean;
};

/** One slice of a breakdown donut. */
export type ComptabiliteBreakdownSlice = {
  category: ComptabiliteCategory;
  label: string;
  amount: number;
  percent: number;
};
