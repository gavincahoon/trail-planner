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
  });

  if (!trip) notFound();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{trip.name}</h1>

      <p className="mt-2">{trip.description}</p>

      <h2 className="mt-6 font-bold">Itinerary</h2>
      <p>Day 1: {trip.day1}</p>
      <p>Day 2: {trip.day2}</p>
      <p>Day 3: {trip.day3}</p>
      {trip.day4 && <p>Day 4: {trip.day4}</p>}

      <h2 className="mt-6 font-bold">Logistics</h2>
      <p>Permit Required: {trip.permitRequired ? "Yes" : "No"}</p>

      {trip.permitLink && (
        <a href={trip.permitLink} className="text-blue-500">
          Get Permit
        </a>
      )}
    </div>
  );
}
