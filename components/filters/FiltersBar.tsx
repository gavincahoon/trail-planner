"use client";

import { FormEvent, useState } from "react";
import {
  ANY_OPTION,
  buildUpdatedQueryString,
  DAYS_OPTIONS,
  DIFFICULTY_OPTIONS,
  QueryParamUpdates,
  TERRAIN_OPTIONS,
  TripFilters,
} from "@/lib/trip-filters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterChip } from "./FilterChip";
import { FiltersSheet } from "./FiltersSheet";
import { SortChip } from "./SortChip";

type FiltersBarProps = {
  filters: TripFilters;
  query?: string;
};

function isActive(value: string): boolean {
  return value !== ANY_OPTION;
}

export function FiltersBar({ filters, query }: FiltersBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [queryDraft, setQueryDraft] = useState(query ?? "");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushWithUpdates = (updates: QueryParamUpdates) => {
    const queryString = buildUpdatedQueryString(
      new URLSearchParams(searchParams.toString()),
      updates
    );

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pushWithUpdates({ q: queryDraft.trim() });
  };

  const clearSearch = () => {
    setQueryDraft("");
    pushWithUpdates({ q: "" });
  };

  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md flex-col gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="search"
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.target.value)}
              placeholder="Search trips, parks, or terrain"
              aria-label="Search trips"
              className="h-10 w-full rounded-full border border-slate-300 bg-white px-4 pr-20 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            />
            <div className="absolute right-1 top-1 flex items-center gap-1">
              {queryDraft && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="inline-flex h-8 items-center justify-center rounded-full px-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="inline-flex h-8 items-center justify-center rounded-full bg-black px-3 text-xs font-semibold text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Go
              </button>
            </div>
          </form>

          <div className="flex w-full gap-2">
            <button
              type="button"
              aria-label="Open filters"
              onClick={() => setSheetOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              ☰
            </button>

            <div className="flex touch-pan-x gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <SortChip />
              <FilterChip
                label="Days"
                selectedValue={filters.days}
                isActive={isActive(filters.days)}
                options={DAYS_OPTIONS}
                onSelect={(value) => pushWithUpdates({ days: value })}
              />
              <FilterChip
                label="Difficulty"
                selectedValue={filters.difficulty}
                isActive={isActive(filters.difficulty)}
                options={DIFFICULTY_OPTIONS}
                onSelect={(value) => pushWithUpdates({ difficulty: value })}
              />
              <FilterChip
                label="Terrain"
                selectedValue={filters.terrain}
                isActive={isActive(filters.terrain)}
                options={TERRAIN_OPTIONS}
                onSelect={(value) => pushWithUpdates({ terrain: value })}
              />
            </div>
          </div>
        </div>
      </div>

      <FiltersSheet
        key={`${filters.days}-${filters.difficulty}-${filters.terrain}-${sheetOpen ? "open" : "closed"}`}
        open={sheetOpen}
        initialFilters={filters}
        onClose={() => setSheetOpen(false)}
        onApply={(draft) => {
          pushWithUpdates(draft);
          setSheetOpen(false);
        }}
      />
    </>
  );
}
