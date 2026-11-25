"use client";

import { WorkspaceScopeNotice } from "@/features/workspace/components";
import { addDays, diffDays } from "../hooks/calendriers_dates";
import { useCalendriersBiens } from "../hooks/use_calendriers_biens";
import { useCalendriersData } from "../hooks/use_calendriers_data";
import { useCalendriersDraft } from "../hooks/use_calendriers_draft";
import { useCalendriersKpis } from "../hooks/use_calendriers_kpis";
import { useCalendriersNavigation } from "../hooks/use_calendriers_navigation";
import { useCalendriersPeriods } from "../hooks/use_calendriers_periods";
import { useCalendriersInScope } from "../hooks/use_calendriers_scope";
import { CalendriersBienList } from "./calendriers_bien_list";
import { CalendriersCalendar } from "./calendriers_calendar";
import { CalendriersKpi } from "./calendriers_kpi";
import { CalendriersPeriodForm } from "./calendriers_period_form";
import { CalendriersUpcoming } from "./calendriers_upcoming";

/** Availability calendar: pick a property, see its month, block periods without double bookings. */
export function Calendriers() {
  const { data } = useCalendriersData();
  const { periods, add, remove } = useCalendriersPeriods(data.periods);
  const navigation = useCalendriersNavigation(data.asOf);
  // Properties of the header's management contract, and their blocked periods.
  const scoped = useCalendriersInScope(data.biens, periods);
  const biens = useCalendriersBiens(scoped.biens, scoped.periods, data.asOf);
  const draft = useCalendriersDraft();
  const kpis = useCalendriersKpis(scoped.biens, scoped.periods, data.asOf, navigation.month);

  // Every day the form would block, to highlight it on the calendar.
  const draftDays = draft.ranges.flatMap(([start, end]) =>
    Array.from({ length: diffDays(start, end) + 1 }, (_, index) => addDays(start, index)),
  );
  // In continuous mode, show the start even before an end is picked.
  const highlighted = draft.draft.mode === "continue" && draftDays.length === 0 && draft.draft.start ? [draft.draft.start] : draftDays;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8 min-[100rem]:max-w-[1560px]">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">Calendrier de disponibilité</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Gérez la disponibilité de vos biens immobiliers et évitez les doubles réservations.
        </p>
        <WorkspaceScopeNotice className="mt-3" />
      </header>

      <CalendriersKpi kpis={kpis} month={navigation.month} />

      <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)] min-[100rem]:grid-cols-[300px_minmax(0,1fr)_340px]">
        <CalendriersBienList list={biens} className="xl:row-span-2 min-[100rem]:row-span-1" />
        <CalendriersCalendar
          bien={biens.selected}
          periods={periods}
          asOf={data.asOf}
          navigation={navigation}
          draftDays={highlighted}
          onPickDay={(day) => {
            if (navigation.view === "jour" && draft.draft.mode === "continue") draft.update({ start: day, end: day });
            else draft.pickDay(day);
          }}
          onRemovePeriod={remove}
        />
        <CalendriersPeriodForm bien={biens.selected} draft={draft} onSubmit={add} className="xl:col-start-2 min-[100rem]:col-start-3 min-[100rem]:row-start-1" />
      </div>

      <CalendriersUpcoming
        biens={scoped.biens}
        periods={scoped.periods}
        asOf={data.asOf}
        onView={(period) => {
          biens.select(period.bienId);
          navigation.goTo(period.start, "mois");
        }}
        onRemove={remove}
      />
    </div>
  );
}

