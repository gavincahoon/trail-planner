import { SavedTripsClientList } from "@/components/saved-trips/SavedTripsClientList";
import { TripCardData } from "@/components/trips/TripCard";
import { prisma } from "@/lib/prisma";

export default async function SavedTripsPage() {
  const trips: TripCardData[] = await prisma.trip.findMany({
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
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Saved Trips</h1>
        <p className="text-sm leading-6 text-slate-600">
          Keep your favorite options in one place while you compare routes and plan logistics.
        </p>
      </header>

      <SavedTripsClientList trips={trips} />
    </main>
  );
}
