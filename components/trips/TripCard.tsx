"use client";

import Link from "next/link";
import { SaveTripButton } from "@/components/saved-trips/SaveTripButton";

export type TripCardData = {
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

function getShortDescription(text: string): string {
  const maxLength = 170;
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getWhyThisTrip(trip: TripCardData): string {
  if (trip.whyThisTrip?.trim()) {
    return trip.whyThisTrip;
  }

  return `Great for a ${trip.days}-day ${trip.difficulty.toLowerCase()} trip through ${trip.terrain.toLowerCase()} terrain in ${trip.park}.`;
}

type TripCardProps = {
  trip: TripCardData;
};

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link
      href={`/trip/${trip.id}`}
      className="group relative block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <SaveTripButton tripId={trip.id} preventNavigation className="absolute right-3 top-3 z-10" />

      <div className="space-y-1 pr-12">
        <h2 className="text-lg font-bold text-slate-900">{trip.name}</h2>
        <p className="text-sm text-slate-500">
          {trip.location} ({trip.park})
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-slate-700">{trip.days} days</span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-slate-700">
          {trip.difficulty}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-slate-700">{trip.terrain}</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-700">{getShortDescription(trip.description)}</p>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Why this trip</p>
        <p className="mt-1 text-sm text-amber-900">{getWhyThisTrip(trip)}</p>
      </div>
    </Link>
  );
}
