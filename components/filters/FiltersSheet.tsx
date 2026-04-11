"use client";

import { useState } from "react";
import {
  ANY_OPTION,
  DAYS_OPTIONS,
  DIFFICULTY_OPTIONS,
  TERRAIN_OPTIONS,
  TripFilters,
  resetFilters,
} from "@/lib/trip-filters";

type FiltersSheetProps = {
  open: boolean;
  initialFilters: TripFilters;
  onClose: () => void;
  onApply: (filters: TripFilters) => void;
};

function optionButtonClass(selected: boolean): string {
  return `h-10 rounded-full border px-4 text-sm font-medium transition ${
    selected
      ? "border-black bg-black text-white"
      : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
  }`;
}

type SectionProps = {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

function FilterSection({ label, options, value, onChange }: SectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={optionButtonClass(value === option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}

export function FiltersSheet({
  open,
  initialFilters,
  onClose,
  onApply,
}: FiltersSheetProps) {
  const [draft, setDraft] = useState<TripFilters>(initialFilters);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85vh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-white">
        <div className="flex justify-center px-4 pt-3">
          <span className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        <div className="space-y-6 px-4 pb-24 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700"
            >
              Close
            </button>
          </div>

          <FilterSection
            label="Days"
            options={DAYS_OPTIONS}
            value={draft.days}
            onChange={(value) => setDraft((prev) => ({ ...prev, days: value }))}
          />

          <FilterSection
            label="Difficulty"
            options={DIFFICULTY_OPTIONS}
            value={draft.difficulty}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, difficulty: value }))
            }
          />

          <FilterSection
            label="Terrain"
            options={TERRAIN_OPTIONS}
            value={draft.terrain}
            onChange={(value) => setDraft((prev) => ({ ...prev, terrain: value }))}
          />

          <p className="text-xs text-slate-500">
            Choose {ANY_OPTION} to remove a filter.
          </p>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDraft(resetFilters())}
              className="h-12 flex-1 rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onApply(draft)}
              className="h-12 flex-1 rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
