import type { CautionMode, CautionStatus } from "./caution";

/** Status tabs above the table. */
export type CautionTab = "toutes" | CautionStatus;

export type CautionFilters = {
  property: string;
  mode: "tous" | CautionMode;
  /** Deposited within the last N days. */
  period: "tous" | "90" | "180";
  /** "Niveau du coffre" chip: less than half left. */
  lowOnly: boolean;
};

export type CautionOption<T extends string = string> = { value: T; label: string };
