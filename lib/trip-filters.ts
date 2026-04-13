import { Prisma } from "@prisma/client";
import { DEFAULT_SORT, SortKey } from "@/lib/sort";

export const ANY_OPTION = "Any";

export const DAYS_OPTIONS = [ANY_OPTION, "2", "3", "4"] as const;
export const DIFFICULTY_OPTIONS = [
  ANY_OPTION,
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;
export const TERRAIN_OPTIONS = [ANY_OPTION, "Desert", "Mountains", "Lakes"] as const;
export type TripFilters = {
  days: string;
  difficulty: string;
  terrain: string;
};
export type QueryParamUpdates = Partial<TripFilters & { sort: SortKey; q: string }>;

type SearchParams = Record<string, string | string[] | undefined>;

const DEFAULT_FILTERS: TripFilters = {
  days: ANY_OPTION,
  difficulty: ANY_OPTION,
  terrain: ANY_OPTION,
};

function getSingleParamValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseSingleFilter(
  value: string | undefined,
  options: readonly string[]
): string {
  if (!value || !options.includes(value)) {
    return ANY_OPTION;
  }

  return value;
}

export function parseFilters(searchParams: SearchParams): TripFilters {
  return {
    days: parseSingleFilter(getSingleParamValue(searchParams.days), DAYS_OPTIONS),
    difficulty: parseSingleFilter(
      getSingleParamValue(searchParams.difficulty),
      DIFFICULTY_OPTIONS
    ),
    terrain: parseSingleFilter(
      getSingleParamValue(searchParams.terrain),
      TERRAIN_OPTIONS
    ),
  };
}

export function parseSearchQuery(searchParams: SearchParams): string | undefined {
  const value = getSingleParamValue(searchParams.q)?.trim();
  return value ? value : undefined;
}

export function buildTripWhere(
  filters: TripFilters,
  query?: string
): Prisma.TripWhereInput {
  const whereClauses: Prisma.TripWhereInput[] = [];

  if (filters.days !== ANY_OPTION) {
    whereClauses.push({ days: Number(filters.days) });
  }

  if (filters.difficulty !== ANY_OPTION) {
    whereClauses.push({ difficulty: filters.difficulty });
  }

  if (filters.terrain !== ANY_OPTION) {
    whereClauses.push({ terrain: filters.terrain });
  }

  if (query) {
    whereClauses.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { park: { contains: query, mode: "insensitive" } },
        { terrain: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { whyThisTrip: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (whereClauses.length === 0) {
    return {};
  }

  if (whereClauses.length === 1) {
    return whereClauses[0];
  }

  return { AND: whereClauses };
}

export function buildUpdatedQueryString(
  currentSearchParams: URLSearchParams,
  updates: QueryParamUpdates
): string {
  const nextParams = new URLSearchParams(currentSearchParams.toString());

  for (const [key, value] of Object.entries(updates) as Array<
    [keyof QueryParamUpdates, string | undefined]
  >) {
    if (
      !value ||
      value === ANY_OPTION ||
      (key === "sort" && value === DEFAULT_SORT)
    ) {
      nextParams.delete(key);
      continue;
    }

    nextParams.set(key, value);
  }

  return nextParams.toString();
}

export function resetFilters(): TripFilters {
  return { ...DEFAULT_FILTERS };
}
