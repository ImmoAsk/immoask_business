"use client";

import { addDays, diffDays } from "../hooks/calendries_dates";
import { useCalendriesBiens } from "../hooks/use_calendries_biens";
import { useCalendriesData } from "../hooks/use_calendries_data";
import { useCalendriesDraft } from "../hooks/use_calendries_draft";
import { useCalendriesKpis } from "../hooks/use_calendries_kpis";
import { useCalendriesNavigation } from "../hooks/use_calendries_navigation";
import { useCalendriesPeriods } from "../hooks/use_calendries_periods";
import { CalendriesBienList } from "./calendries_bien_list";
import { CalendriesCalendar } from "./calendries_calendar";
import { CalendriesKpi } from "./calendries_kpi";
import { CalendriesPeriodForm } from "./calendries_period_form";
import { CalendriesUpcoming } from "./calendries_upcoming";

/** Availability calendar: pick a property, see its month, block periods without double bookings. */
export function Calendries() {
  const { data } = useCalendriesData();
  const { periods, add, remove } = useCalendriesPeriods(data.periods);
  const navigation = useCalendriesNavigation(data.asOf);
  const biens = useCalendriesBiens(data.biens, periods, data.asOf);
  const draft = useCalendriesDraft();
  const kpis = useCalendriesKpis(data.biens, periods, data.asOf, navigation.month);

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
      </header>

      <CalendriesKpi kpis={kpis} month={navigation.month} />

      <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)] min-[100rem]:grid-cols-[300px_minmax(0,1fr)_340px]">
        <CalendriesBienList list={biens} className="xl:row-span-2 min-[100rem]:row-span-1" />
        <CalendriesCalendar
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
        <CalendriesPeriodForm bien={biens.selected} draft={draft} onSubmit={add} className="xl:col-start-2 min-[100rem]:col-start-3 min-[100rem]:row-start-1" />
      </div>

      <CalendriesUpcoming
        biens={data.biens}
        periods={periods}
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

