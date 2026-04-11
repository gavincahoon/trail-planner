"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TrailListItem = {
  id: string;
  name: string;
  location: string;
  park: string;
  days: number;
  difficulty: string;
  terrain: string;
  description: string;
  whyThisTrip: string | null;
};

type FiltersState = {
  maxDistance: number;
  activity: string;
  difficulty: string[];
  suitability: string[];
};

const DEFAULT_FILTERS: FiltersState = {
  maxDistance: 50,
  activity: "All",
  difficulty: [],
  suitability: [],
};

const ACTIVITY_OPTIONS = ["All", "Desert", "Mountains", "Lakes"] as const;
const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"] as const;
const SUITABILITY_OPTIONS = [
  "Family Friendly",
  "Dog Friendly",
  "Permit-Free",
] as const;

function chipButtonClass(isSelected: boolean): string {
  const baseClass =
    "flex h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";
  return isSelected
    ? `${baseClass} bg-black text-white`
    : `${baseClass} border border-gray-300 bg-white text-gray-800 hover:bg-gray-50`;
}

function getShortDescription(text: string): string {
  const maxLength = 170;
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getWhyThisTrip(trail: TrailListItem): string {
  if (trail.whyThisTrip?.trim()) {
    return trail.whyThisTrip;
  }

  return `Great for a ${trail.days}-day ${trail.difficulty.toLowerCase()} trip through ${trail.terrain.toLowerCase()} terrain in ${trail.park}.`;
}

export function ResultsFilters({ trails }: { trails: TrailListItem[] }) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const updateFilter = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleArrayFilter = (
    key: "difficulty" | "suitability",
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = prev[key];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [key]: nextValues,
      };
    });
  };

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      // Placeholder only: distance filtering is deferred until we add distance data.
      const matchesDistance = true;

      const matchesActivity =
        filters.activity === "All" || trail.terrain === filters.activity;

      const matchesDifficulty =
        filters.difficulty.length === 0 ||
        filters.difficulty.includes(trail.difficulty);

      // Placeholder only: suitability filtering is deferred until we add suitability data.
      const matchesSuitability = true;

      return (
        matchesDistance &&
        matchesActivity &&
        matchesDifficulty &&
        matchesSuitability
      );
    });
  }, [trails, filters]);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Trails</h1>

      <section className="space-y-4">
        <div>
          <label
            htmlFor="maxDistance"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Max distance ({filters.maxDistance} mi)
          </label>
          <input
            id="maxDistance"
            type="range"
            min={1}
            max={50}
            step={1}
            value={filters.maxDistance}
            onChange={(event) =>
              updateFilter("maxDistance", Number(event.target.value))
            }
            className="w-full accent-black"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Activity</p>
          <div className="grid gap-2">
            {ACTIVITY_OPTIONS.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => updateFilter("activity", activity)}
                className={chipButtonClass(filters.activity === activity)}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Difficulty</p>
          <div className="grid gap-2">
            {DIFFICULTY_OPTIONS.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => toggleArrayFilter("difficulty", difficulty)}
                className={chipButtonClass(filters.difficulty.includes(difficulty))}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Suitability</p>
          <div className="grid gap-2">
            {SUITABILITY_OPTIONS.map((suitability) => (
              <button
                key={suitability}
                type="button"
                onClick={() => toggleArrayFilter("suitability", suitability)}
                className={chipButtonClass(filters.suitability.includes(suitability))}
              >
                {suitability}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Suitability filtering is coming soon once this data is available.
          </p>
        </div>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          Show {filteredTrails.length} trails
        </button>

        <button
          type="button"
          onClick={clearAllFilters}
          className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          Clear all
        </button>
      </section>

      {filteredTrails.length === 0 && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-base font-semibold text-slate-900">No trails match your filters</p>
          <p className="mt-1 text-sm text-slate-600">
            Try removing one or more filters to see more trail options.
          </p>
        </div>
      )}

      <section className="space-y-5">
        {filteredTrails.map((trail) => (
          <Link
            key={trail.id}
            href={`/trip/${trail.id}`}
            className="group block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">{trail.name}</h2>
              <p className="text-sm text-slate-500">
                {trail.location} ({trail.park})
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-slate-700">
                {trail.days} days
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-slate-700">
                {trail.difficulty}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-slate-700">
                {trail.terrain}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-700">
              {getShortDescription(trail.description)}
            </p>

            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                Why this trip
              </p>
              <p className="mt-1 text-sm text-amber-900">{getWhyThisTrip(trail)}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
