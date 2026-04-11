import { Prisma } from "@prisma/client";

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

export function buildTripWhere(filters: TripFilters): Prisma.TripWhereInput {
  const where: Prisma.TripWhereInput = {};

  if (filters.days !== ANY_OPTION) {
    where.days = Number(filters.days);
  }

  if (filters.difficulty !== ANY_OPTION) {
    where.difficulty = filters.difficulty;
  }

  if (filters.terrain !== ANY_OPTION) {
    where.terrain = filters.terrain;
  }

  return where;
}

export function buildUpdatedQueryString(
  currentSearchParams: URLSearchParams,
  updates: Partial<TripFilters>
): string {
  const nextParams = new URLSearchParams(currentSearchParams.toString());

  for (const [key, value] of Object.entries(updates) as Array<
    [keyof TripFilters, string | undefined]
  >) {
    if (!value || value === ANY_OPTION) {
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
