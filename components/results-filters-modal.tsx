"use client";

import { useState } from "react";

export type ResultsFiltersState = {
  maxDistance: number;
  activity: string;
  difficulty: string[];
  suitability: string[];
};

type ResultsFiltersModalProps = {
  open: boolean;
  trailCount: number;
  onClose: () => void;
  onClearAll?: (nextState: ResultsFiltersState) => void;
  onApply?: (nextState: ResultsFiltersState) => void;
};

const DEFAULT_FILTERS: ResultsFiltersState = {
  maxDistance: 50,
  activity: "All",
  difficulty: [],
  suitability: [],
};

const BASE_ACTIVITY_OPTIONS = ["All", "Hiking", "Mountain biking", "Running"] as const;
const MORE_ACTIVITY_OPTIONS = ["Backpacking", "Walking"] as const;
const DIFFICULTY_OPTIONS = ["Easy", "Moderate", "Hard", "Strenuous"] as const;
const SUITABILITY_OPTIONS = ["Dog-friendly", "Kid-friendly", "Wheelchair-friendly"] as const;
const SORT_OPTIONS = ["Recommended", "Nearest", "Easiest"] as const;

function getControlClass(active: boolean): string {
  const baseClass =
    "flex min-h-11 w-full items-center rounded-xl border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

  return active
    ? `${baseClass} border-black bg-black text-white`
    : `${baseClass} border-slate-300 bg-white text-slate-800 hover:bg-slate-50`;
}

export function ResultsFiltersModal({
  open,
  trailCount,
  onClose,
  onClearAll,
  onApply,
}: ResultsFiltersModalProps) {
  const [filters, setFilters] = useState<ResultsFiltersState>(DEFAULT_FILTERS);
  const [showMoreActivity, setShowMoreActivity] = useState(false);
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>("Recommended");

  const updateFilter = <K extends keyof ResultsFiltersState>(
    key: K,
    value: ResultsFiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: "difficulty" | "suitability", value: string) => {
    setFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return { ...prev, [key]: next };
    });
  };

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSortBy("Recommended");
    setShowMoreActivity(false);
    onClearAll?.(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply?.(filters);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50" aria-hidden={false}>
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] w-full max-w-md flex-col rounded-t-xl border border-slate-200 bg-white shadow-xl"
      >
        <header className="sticky top-0 z-10 space-y-3 rounded-t-xl border-b border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-xl leading-none text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              ×
            </button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <span className="font-medium">Sort</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as (typeof SORT_OPTIONS)[number])}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm font-medium text-slate-700 underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Distance away</h3>
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={50}
                value={filters.maxDistance}
                onChange={(event) => updateFilter("maxDistance", Number(event.target.value))}
                className="w-full accent-black"
              />
              <p className="text-sm text-slate-600">
                Up to {filters.maxDistance === 50 ? "50+" : filters.maxDistance} miles
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Activity</h3>
            <div className="space-y-2">
              {BASE_ACTIVITY_OPTIONS.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => updateFilter("activity", activity)}
                  className={getControlClass(filters.activity === activity)}
                >
                  {activity}
                </button>
              ))}
              {showMoreActivity &&
                MORE_ACTIVITY_OPTIONS.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => updateFilter("activity", activity)}
                    className={getControlClass(filters.activity === activity)}
                  >
                    {activity}
                  </button>
                ))}
            </div>
            <button
              type="button"
              onClick={() => setShowMoreActivity((prev) => !prev)}
              className="text-sm font-medium text-slate-700 underline underline-offset-2"
            >
              {showMoreActivity ? "Less" : "More"}
            </button>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Difficulty</h3>
            <div className="space-y-2">
              {DIFFICULTY_OPTIONS.map((difficulty) => (
                <label
                  key={difficulty}
                  className="flex min-h-11 items-center justify-between rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
                >
                  <span>{difficulty}</span>
                  <input
                    type="checkbox"
                    checked={filters.difficulty.includes(difficulty)}
                    onChange={() => toggleArrayFilter("difficulty", difficulty)}
                    className="h-4 w-4 accent-black"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Suitability</h3>
            <div className="space-y-2">
              {SUITABILITY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex min-h-11 items-center justify-between rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800"
                >
                  <span>{option}</span>
                  <input
                    type="checkbox"
                    checked={filters.suitability.includes(option)}
                    onChange={() => toggleArrayFilter("suitability", option)}
                    className="h-4 w-4 accent-black"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <footer className="sticky bottom-0 z-10 border-t border-slate-200 bg-white p-4">
          <button
            type="button"
            onClick={handleApply}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Show {trailCount} trails
          </button>
        </footer>
      </div>
    </div>
  );
}
