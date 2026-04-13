import { Prisma } from "@prisma/client";

export const SORT_OPTIONS = [
  "best",
  "shortest",
  "easiest",
  "hardest",
  "alphabetical",
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number];

export const DEFAULT_SORT: SortKey = "best";

export const SORT_LABELS: Record<SortKey, string> = {
  best: "Best",
  shortest: "Shortest",
  easiest: "Easiest",
  hardest: "Hardest",
  alphabetical: "Alphabetical",
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

type SearchParamsInput = SearchParamsRecord | URLSearchParams;

type SortableTrip = {
  name?: string | null;
  days?: number | null;
  difficulty?: string | null;
};

const DIFFICULTY_RANK: Record<string, number> = {
  easy: 1,
  beginner: 1,
  moderate: 2,
  intermediate: 2,
  hard: 3,
  advanced: 3,
  strenuous: 4,
};

function getSingleParamValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getSortParamValue(searchParams: SearchParamsInput): string | undefined {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get("sort") ?? undefined;
  }

  return getSingleParamValue(searchParams.sort);
}

function getDifficultyRank(difficulty: string | null | undefined): number {
  if (!difficulty) {
    return Number.MAX_SAFE_INTEGER;
  }

  return DIFFICULTY_RANK[difficulty.trim().toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
}

function compareByDayThenName(a: SortableTrip, b: SortableTrip): number {
  const aDays = a.days ?? Number.MAX_SAFE_INTEGER;
  const bDays = b.days ?? Number.MAX_SAFE_INTEGER;
  const dayDiff = aDays - bDays;
  if (dayDiff !== 0) {
    return dayDiff;
  }

  const aName = a.name ?? "";
  const bName = b.name ?? "";
  return aName.localeCompare(bName);
}

export function parseSort(searchParams: SearchParamsInput): SortKey {
  const value = getSortParamValue(searchParams);
  if (!value || !SORT_OPTIONS.includes(value as SortKey)) {
    return DEFAULT_SORT;
  }

  return value as SortKey;
}

export function buildSortOrderBy(
  sort: SortKey
): Prisma.TripOrderByWithRelationInput[] {
  switch (sort) {
    case "alphabetical":
      return [{ name: "asc" }];
    case "best":
    case "shortest":
    case "easiest":
    case "hardest":
      return [{ days: "asc" }, { name: "asc" }];
  }
}

export function applySorting<T extends SortableTrip>(trips: T[], sort: SortKey): T[] {
  if (sort !== "easiest" && sort !== "hardest") {
    return trips;
  }

  const direction = sort === "easiest" ? 1 : -1;
  return trips
    .map((trip, index) => ({ trip, index }))
    .sort((left, right) => {
      const rankDiff =
        (getDifficultyRank(left.trip.difficulty) - getDifficultyRank(right.trip.difficulty)) *
        direction;
      if (rankDiff !== 0) {
        return rankDiff;
      }

      const fallbackDiff = compareByDayThenName(left.trip, right.trip);
      if (fallbackDiff !== 0) {
        return fallbackDiff;
      }

      return left.index - right.index;
    })
    .map(({ trip }) => trip);
}
