"use client";

import Link from "next/link";
import { useSavedTrips } from "@/hooks/use-saved-trips";
import { TripCard, TripCardData } from "@/components/trips/TripCard";

type SavedTripsClientListProps = {
  trips: TripCardData[];
};

export function SavedTripsClientList({ trips }: SavedTripsClientListProps) {
  const { isReady, savedTripIds } = useSavedTrips();

  if (!isReady) {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">Loading your saved trips...</p>
      </section>
    );
  }

  const tripMap = new Map(trips.map((trip) => [trip.id, trip]));
  const orderedSavedIds = Array.from(savedTripIds);
  const savedTrips = orderedSavedIds
    .map((tripId) => tripMap.get(tripId))
    .filter((trip): trip is TripCardData => Boolean(trip));
  const missingCount = orderedSavedIds.length - savedTrips.length;

  if (savedTrips.length === 0) {
    return (
      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-base font-semibold text-slate-900">No saved trips yet</p>
        <p className="text-sm leading-6 text-slate-600">
          Tap the save icon on any trip card to keep it here for later.
        </p>
        <Link
          href="/results"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          Browse trips
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {missingCount > 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {missingCount} saved trip{missingCount > 1 ? "s are" : " is"} no longer available.
        </p>
      )}

      {savedTrips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </section>
  );
}
