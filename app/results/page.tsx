import { FiltersBar } from "@/components/filters/FiltersBar";
import { prisma } from "@/lib/prisma";
import { buildTripWhere, parseFilters } from "@/lib/trip-filters";
import Link from "next/link";

type TripListItem = {
  id: string;
  name: string;
  location: string;
  park: string;
  days: number;
  difficulty: string;
  terrain: string;
  description: string;
  whyThisTrip: string | null;
}

type SearchParams = Record<string, string | string[] | undefined>;

function getShortDescription(text: string): string {
  const maxLength = 170;
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getWhyThisTrip(trail: TripListItem): string {
  if (trail.whyThisTrip?.trim()) {
    return trail.whyThisTrip;
  }

  return `Great for a ${trail.days}-day ${trail.difficulty.toLowerCase()} trip through ${trail.terrain.toLowerCase()} terrain in ${trail.park}.`;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (searchParams ? await searchParams : {}) as SearchParams;
  const filters = parseFilters(params);
  const where = buildTripWhere(filters);

  const trails: TripListItem[] = await prisma.trip.findMany({
    where,
    orderBy: [{ name: "asc" }],
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

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Trails</h1>
      <FiltersBar filters={filters} />

      {trails.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-base font-semibold text-slate-900">No trails match your filters</p>
          <p className="mt-1 text-sm text-slate-600">
            Try removing one or more filters to see more trail options.
          </p>
        </div>
      )}

      <section className="space-y-5">
        {trails.map((trail) => (
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
