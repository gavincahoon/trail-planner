import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      days: true,
      difficulty: true,
      terrain: true,
      bestSeason: true,
      day1: true,
      day2: true,
      day3: true,
      day4: true,
      permitRequired: true,
      permitLink: true,
      trailheadInfo: true,
      parkingInfo: true,
    },
  });

  if (!trip) notFound();

  const itineraryDays = [
    { label: "Day 1", details: trip.day1 },
    { label: "Day 2", details: trip.day2 },
    { label: "Day 3", details: trip.day3 },
    ...(trip.day4 ? [{ label: "Day 4", details: trip.day4 }] : []),
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{trip.name}</h1>
        <p className="text-base leading-7 text-slate-700">{trip.description}</p>
      </header>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-lg font-semibold text-amber-900">Why This Trip</h2>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          This route balances a manageable {trip.days}-day timeline with {trip.terrain.toLowerCase()} terrain, making it a strong pick for {trip.difficulty.toLowerCase()} backpackers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Days</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{trip.days}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{trip.difficulty}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Terrain</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{trip.terrain}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Best season</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {trip.bestSeason ?? "Not specified"}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Itinerary</h2>
        <div className="space-y-3">
          {itineraryDays.map((day) => (
            <div key={day.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{day.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{day.details}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Logistics</h2>
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Permit required:</span>{" "}
            {trip.permitRequired ? "Yes" : "No"}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Permit link:</span>{" "}
            {trip.permitLink ? (
              <a
                href={trip.permitLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline underline-offset-2 hover:text-blue-800"
              >
                Get permit
              </a>
            ) : (
              "Not specified"
            )}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Trailhead info:</span>{" "}
            {trip.trailheadInfo ?? "Not specified"}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Parking info:</span>{" "}
            {trip.parkingInfo ?? "Not specified"}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Packing List</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>Lightweight shelter and sleep system suited for forecast conditions</li>
            <li>Water storage and treatment for at least one full hiking day</li>
            <li>Insulation and rain protection layers for temperature swings</li>
            <li>Map, headlamp, first-aid kit, and basic emergency essentials</li>
            <li>Enough food plus one backup meal for schedule changes</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
