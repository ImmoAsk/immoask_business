"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { formatDay } from "../hooks/calendries_dates";
import type { UseCalendriesDraftResult } from "../hooks/use_calendries_draft";
import type { UseCalendriesPeriodsResult } from "../hooks/use_calendries_periods";
import type { CalendrieBien, CalendrieDraftMode, CalendriePeriod, CalendrieReason } from "../types";
import { calendriesControl, calendriesPanel, reasons } from "./calendries_styles";

const modes: { value: CalendrieDraftMode; label: string }[] = [
  { value: "continue", label: "Période continue" },
  { value: "multiple", label: "Dates multiples" },
];

type Feedback = { tone: "success"; text: string } | { tone: "error"; text: string; conflicts: CalendriePeriod[] };

export type CalendriesPeriodFormProps = {
  bien: CalendrieBien | null;
  draft: UseCalendriesDraftResult;
  onSubmit: UseCalendriesPeriodsResult["add"];
  className?: string;
};

/** "Définir une période d'indisponibilité": refuses any overlap, so a bien is never booked twice. */
export function CalendriesPeriodForm({ bien, draft, onSubmit, className }: CalendriesPeriodFormProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { draft: value, ranges, error } = draft;
  const canSubmit = bien !== null && ranges.length > 0 && error === null;

  const submit = () => {
    if (!bien || !canSubmit) return;
    const result = onSubmit(bien.id, ranges, value.reason, value.comment);
    if (result.ok) {
      const days = ranges.reduce((sum, [start, end]) => sum + (Date.parse(end) - Date.parse(start)) / 86_400_000 + 1, 0);
      setFeedback({
        tone: "success",
        text: `${bien.title} est indisponible ${ranges.length > 1 ? `sur ${ranges.length} périodes` : `du ${formatDay(ranges[0][0])} au ${formatDay(ranges[0][1])}`} (${days} jour${days > 1 ? "s" : ""}).`,
      });
      draft.reset();
    } else {
      setFeedback({ tone: "error", text: "Ces dates chevauchent une indisponibilité existante :", conflicts: result.conflicts });
    }
  };

  return (
    <section aria-labelledby="calendries-form-title" className={cn(calendriesPanel, "@container flex flex-col gap-5 p-5", className)}>
      <h2 id="calendries-form-title" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Définir une période d&apos;indisponibilité
      </h2>

      <div role="group" aria-label="Type de période" className="grid grid-cols-2 gap-1 rounded-2xl bg-zinc-100 p-1 dark:bg-white/5">
        {modes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            aria-pressed={value.mode === mode.value}
            onClick={() => {
              draft.setMode(mode.value);
              setFeedback(null);
            }}
            className={cn(
              "h-10 cursor-pointer rounded-xl text-sm font-semibold transition-colors",
              focusRing,
              value.mode === mode.value
                ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white",
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="grid gap-5 @xl:grid-cols-2"
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {value.mode === "continue" ? "Période" : "Jours à bloquer"}
          </legend>
          {value.mode === "continue" ? (
            <div className="grid grid-cols-2 gap-3">
              <DateField id="calendries-start" label="Du" value={value.start} onChange={(start) => draft.update({ start, end: value.end && value.end >= start ? value.end : start })} />
              <DateField id="calendries-end" label="Au" value={value.end} min={value.start || undefined} onChange={(end) => draft.update({ end })} />
            </div>
          ) : value.dates.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {value.dates.map((day) => (
                <li key={day}>
                  <button
                    type="button"
                    onClick={() => draft.update({ dates: value.dates.filter((date) => date !== day) })}
                    aria-label={`Retirer le ${formatDay(day)}`}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 tabular-nums hover:bg-brand-100 dark:bg-brand-900/60 dark:text-brand-100",
                      focusRing,
                    )}
                  >
                    {formatDay(day)}
                    <Icon name="close" className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {value.mode === "continue"
              ? "Ou cliquez le premier puis le dernier jour sur le calendrier."
              : "Cliquez les jours sur le calendrier ; les jours qui se suivent forment une seule période."}
          </p>
          {error ? <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p> : null}
        </fieldset>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="calendries-reason" className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-300">
              Motif
            </label>
            <div className="relative">
              <select
                id="calendries-reason"
                value={value.reason}
                onChange={(event) => draft.update({ reason: event.target.value as CalendrieReason })}
                className={cn(calendriesControl, focusRing, "h-11 w-full cursor-pointer appearance-none pr-10 pl-3.5")}
              >
                {(Object.keys(reasons) as CalendrieReason[]).map((reason) => (
                  <option key={reason} value={reason}>
                    {reasons[reason].label}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>
          <div>
            <label htmlFor="calendries-comment" className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-300">
              Commentaire (optionnel)
            </label>
            <textarea
              id="calendries-comment"
              rows={3}
              value={value.comment}
              onChange={(event) => draft.update({ comment: event.target.value })}
              placeholder="Ex : client en cours de réservation…"
              className={cn(calendriesControl, focusRing, "w-full resize-y px-3.5 py-2.5 placeholder:text-zinc-400")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 @xl:col-span-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-600 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500",
              focusRing,
            )}
          >
            <Icon name="lock" className="size-4.5" />
            Marquer comme indisponible
          </button>
          {!bien ? <p className="text-xs text-zinc-500">Sélectionnez d&apos;abord un bien.</p> : null}

          {feedback ? (
            <div
              role={feedback.tone === "error" ? "alert" : "status"}
              className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                feedback.tone === "success"
                  ? "bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-100"
                  : "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-200",
              )}
            >
              <p className="font-medium">{feedback.text}</p>
              {feedback.tone === "error" ? (
                <ul className="mt-1 list-disc pl-5">
                  {feedback.conflicts.map((period) => (
                    <li key={period.id}>
                      {reasons[period.reason].label} du {formatDay(period.start)} au {formatDay(period.end)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      </form>

      <p className="flex gap-3 rounded-2xl bg-brand-50/70 p-4 text-[13px] leading-relaxed text-brand-900 dark:bg-brand-900/30 dark:text-brand-100">
        <Icon name="alert" className="mt-0.5 size-4.5 shrink-0 text-brand-600 dark:text-brand-100" />
        Les périodes d&apos;indisponibilité sont visibles par tous les utilisateurs ayant accès au bien, et une période
        qui en chevauche une autre est refusée : pas de double réservation.
      </p>
    </section>
  );
}

function DateField({
  id,
  label,
  value,
  min,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className={cn(calendriesControl, focusRing, "h-11 w-full px-3 tabular-nums")}
      />
    </div>
  );
}
