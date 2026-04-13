import { FiltersBar } from "@/components/filters/FiltersBar";
import { TripCard, TripCardData } from "@/components/trips/TripCard";
import { prisma } from "@/lib/prisma";
import { applySorting, buildSortOrderBy, parseSort } from "@/lib/sort";
import {
  buildTripWhere,
  parseFilters,
  parseSearchQuery,
} from "@/lib/trip-filters";
import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

function toURLSearchParams(params: SearchParams): URLSearchParams {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item);
      }
      continue;
    }

    query.set(key, value);
  }

  return query;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (searchParams ? await searchParams : {}) as SearchParams;
  const filters = parseFilters(params);
  // URL sort param is parsed on the server so data ordering matches shared links/bookmarks.
  const sort = parseSort(params);
  const query = parseSearchQuery(params);
  const where = buildTripWhere(filters, query);
  const clearSearchParams = toURLSearchParams(params);
  clearSearchParams.delete("q");
  const clearSearchHref = clearSearchParams.toString()
    ? `/results?${clearSearchParams.toString()}`
    : "/results";

  const trails: TripCardData[] = await prisma.trip.findMany({
    where,
    orderBy: buildSortOrderBy(sort),
    select: {
      id: true,
      name: true,
      location: true,
      park: true,
      days: true,
      difficulty: true,
      terrain: true,
      description: true,
      whyThisTrip: true,
    },
  });
  // UI writes sort back to URL; server re-renders and this final in-memory pass handles rank-based difficulty sorts.
  const sortedTrails = applySorting(trails, sort);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Trails</h1>
      <FiltersBar filters={filters} query={query} />

      {sortedTrails.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-base font-semibold text-slate-900">
            {query ? `No trips found for "${query}"` : "No trails match your filters"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {query
              ? "Try a broader search or clear filters to explore more options."
              : "Try removing one or more filters to see more trail options."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {query && (
              <Link
                href={clearSearchHref}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Clear search
              </Link>
            )}
            <Link
              href="/results"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-3 text-sm font-medium text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Reset all
            </Link>
          </div>
        </div>
      )}

      <section className="space-y-5">
        {sortedTrails.map((trail) => (
          <TripCard key={trail.id} trip={trail} />
        ))}
      </section>
    </main>
  );
}
