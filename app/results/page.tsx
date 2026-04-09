import { prisma } from '@/lib/prisma'
import Link from 'next/link'

type TripListItem = {
  id: string
  name: string
  description: string
}

export default async function ResultsPage() {
  const trips = await prisma.trip.findMany()

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Trips</h1>

      {trips.map((trip: TripListItem) => (
        <div key={trip.id} className="mb-4 border p-4">
          <h2 className="text-xl">{trip.name}</h2>
          <p>{trip.description}</p>

          <Link href={`/trip/${trip.id}`} className="text-blue-500">
            View Trip →
          </Link>
        </div>
      ))}
    </div>
  )
}
