import { MONTHS_LONG, parseMonth } from "@/lib/utils/format";
import type { DashboardGreetingData } from "../types";

export type DashboardGreetingProps = {
  greeting: DashboardGreetingData;
};

export function DashboardGreeting({ greeting }: DashboardGreetingProps) {
  const { firstName, month, collectedRate, tenantsToRemind, synced } = greeting;
  const monthName = MONTHS_LONG[parseMonth(month).monthIndex];
  const allGood = collectedRate >= 90;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
          Bonjour, {firstName}
        </h1>
        {synced ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500" />
            Synchronisé
          </span>
        ) : null}
      </div>
      <p className="text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
        <span aria-hidden="true">👋 </span>
        {allGood ? "Tout est en ordre ce mois-ci : " : "Point du mois : "}
        <strong className="font-semibold text-zinc-950 dark:text-zinc-50">
          {collectedRate}% de vos loyers de {monthName}
        </strong>{" "}
        sont déjà encaissés
        {!allGood && tenantsToRemind > 0
          ? `, ${tenantsToRemind} locataire${tenantsToRemind > 1 ? "s" : ""} à relancer.`
          : "."}
      </p>
    </section>
  );
}
