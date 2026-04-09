import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import Link from 'next/link'

type TripListItem = {
  id: string
  name: string
  description: string
}

type SearchParams = Record<string, string | string[] | undefined>

const DAYS_OPTIONS = [2, 3, 4] as const
const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const
const TERRAIN_OPTIONS = ['Desert', 'Mountains', 'Lakes'] as const

function getSingleParamValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function getFilterHref(params: SearchParams, key: string, value: string): string {
  const nextParams = new URLSearchParams()

  for (const [paramKey, paramValue] of Object.entries(params)) {
    const singleValue = getSingleParamValue(paramValue)

    if (!singleValue || paramKey === key) {
      continue
    }

    nextParams.set(paramKey, singleValue)
  }

  if (getSingleParamValue(params[key]) !== value) {
    nextParams.set(key, value)
  }

  const queryString = nextParams.toString()
  return queryString ? `/results?${queryString}` : '/results'
}

function filterButtonClass(isSelected: boolean): string {
  const baseClass = 'rounded border px-3 py-1 text-sm'
  return isSelected
    ? `${baseClass} border-blue-600 bg-blue-600 text-white`
    : `${baseClass} border-gray-300 text-gray-700 hover:bg-gray-100`
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const params = (searchParams ? await searchParams : {}) as SearchParams

  const selectedDaysRaw = getSingleParamValue(params.days)
  const selectedDifficultyRaw = getSingleParamValue(params.difficulty)
  const selectedTerrainRaw = getSingleParamValue(params.terrain)

  const selectedDays = DAYS_OPTIONS.find(
    (days) => String(days) === selectedDaysRaw
  )
  const selectedDifficulty = DIFFICULTY_OPTIONS.find(
    (difficulty) => difficulty === selectedDifficultyRaw
  )
  const selectedTerrain = TERRAIN_OPTIONS.find(
    (terrain) => terrain === selectedTerrainRaw
  )

  const where: Prisma.TripWhereInput = {}

  if (selectedDays) {
    where.days = selectedDays
  }

  if (selectedDifficulty) {
    where.difficulty = selectedDifficulty
  }

  if (selectedTerrain) {
    where.terrain = selectedTerrain
  }

  const trips = await prisma.trip.findMany({
    where,
    orderBy: { name: 'asc' },
  })

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Trips</h1>
      <div className="mb-8 space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Days</p>
          <div className="flex flex-wrap gap-2">
            {DAYS_OPTIONS.map((days) => {
              const value = String(days)
              const isSelected = selectedDays === days
              return (
                <Link
                  key={value}
                  href={getFilterHref(params, 'days', value)}
                  className={filterButtonClass(isSelected)}
                >
                  {days}
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty
              return (
                <Link
                  key={difficulty}
                  href={getFilterHref(params, 'difficulty', difficulty)}
                  className={filterButtonClass(isSelected)}
                >
                  {difficulty}
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">Terrain</p>
          <div className="flex flex-wrap gap-2">
            {TERRAIN_OPTIONS.map((terrain) => {
              const isSelected = selectedTerrain === terrain
              return (
                <Link
                  key={terrain}
                  href={getFilterHref(params, 'terrain', terrain)}
                  className={filterButtonClass(isSelected)}
                >
                  {terrain}
                </Link>
              )
            })}
          </div>
        </div>

        <Link href="/results" className="inline-block text-sm text-blue-600 hover:underline">
          Clear filters
        </Link>
      </div>

      {trips.length === 0 && (
        <p className="mb-4 text-gray-600">No trips match these filters.</p>
      )}

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
