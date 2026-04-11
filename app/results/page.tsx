import { ResultsFilters } from "@/components/results-filters";
import { prisma } from "@/lib/prisma";

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

export default async function ResultsPage() {
  const trails: TripListItem[] = await prisma.trip.findMany({
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

  return <ResultsFilters trails={trails} />;
}
