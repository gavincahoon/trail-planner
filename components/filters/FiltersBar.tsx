"use client";

import { useState } from "react";
import {
  ANY_OPTION,
  buildUpdatedQueryString,
  DAYS_OPTIONS,
  DIFFICULTY_OPTIONS,
  TERRAIN_OPTIONS,
  TripFilters,
} from "@/lib/trip-filters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterChip } from "./FilterChip";
import { FiltersSheet } from "./FiltersSheet";

type FiltersBarProps = {
  filters: TripFilters;
};

function isActive(value: string): boolean {
  return value !== ANY_OPTION;
}

export function FiltersBar({ filters }: FiltersBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushWithUpdates = (updates: Partial<TripFilters>) => {
    const queryString = buildUpdatedQueryString(
      new URLSearchParams(searchParams.toString()),
      updates
    );

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md gap-2">
          <button
            type="button"
            aria-label="Open filters"
            onClick={() => setSheetOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            ☰
          </button>

          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
