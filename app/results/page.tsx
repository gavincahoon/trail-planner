import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import Link from 'next/link'

type TripListItem = {
  id: string
  name: string
  location: string
  park: string
  days: number
  difficulty: string
  terrain: string
  description: string
  whyThisTrip: string | null
}

type SearchParams = Record<string, string | string[] | undefined>

const DAYS_OPTIONS = [2, 3, 4] as const
const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const
const TERRAIN_OPTIONS = ['Desert', 'Mountains', 'Lakes'] as const
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'days', label: 'Shortest trip' },
  { value: 'easiest', label: 'Easiest' },
] as const
const DIFFICULTY_RANK: Record<string, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
}

type SortOption = (typeof SORT_OPTIONS)[number]['value']

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
  const baseClass =
    'flex h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2'
  return isSelected
    ? `${baseClass} bg-black text-white`
    : `${baseClass} border border-gray-300 bg-white text-gray-800 hover:bg-gray-50`
}

function getShortDescription(text: string): string {
  const maxLength = 170
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}...`
}

function getWhyThisTrip(trip: TripListItem): string {
  if (trip.whyThisTrip?.trim()) {
    return trip.whyThisTrip
  }

  return `Great for a ${trip.days}-day ${trip.difficulty.toLowerCase()} trip through ${trip.terrain.toLowerCase()} terrain in ${trip.park}.`
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
  const selectedSortRaw = getSingleParamValue(params.sort)

  const selectedDays = DAYS_OPTIONS.find(
    (days) => String(days) === selectedDaysRaw
  )
  const selectedDifficulty = DIFFICULTY_OPTIONS.find(
    (difficulty) => difficulty === selectedDifficultyRaw
  )
  const selectedTerrain = TERRAIN_OPTIONS.find(
    (terrain) => terrain === selectedTerrainRaw
  )
  const selectedSort: SortOption = SORT_OPTIONS.some(
    (sort) => sort.value === selectedSortRaw
  )
    ? (selectedSortRaw as SortOption)
    : 'recommended'

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

  const orderBy: Prisma.TripOrderByWithRelationInput[] =
    selectedSort === 'days'
      ? [{ days: 'asc' }, { name: 'asc' }]
      : [{ name: 'asc' }]

  const trips: TripListItem[] = await prisma.trip.findMany({
    where,
    orderBy,
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
  })

  if (selectedSort === 'easiest') {
    trips.sort((a, b) => {
      const difficultyDelta =
        (DIFFICULTY_RANK[a.difficulty] ?? Number.MAX_SAFE_INTEGER) -
        (DIFFICULTY_RANK[b.difficulty] ?? Number.MAX_SAFE_INTEGER)

      if (difficultyDelta !== 0) {
        return difficultyDelta
      }

      if (a.days !== b.days) {
        return a.days - b.days
      }

      return a.name.localeCompare(b.name)
    })
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Trips</h1>
      <section className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Sort</p>
          <div className="grid gap-2">
            {SORT_OPTIONS.map((sort) => {
              const isSelected = selectedSort === sort.value
              return (
                <Link
                  key={sort.value}
                  href={getFilterHref(params, 'sort', sort.value)}
                  className={filterButtonClass(isSelected)}
                >
                  {sort.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Days</p>
          <div className="grid gap-2">
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
          <p className="mb-2 text-sm font-semibold text-slate-700">Difficulty</p>
          <div className="grid gap-2">
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
          <p className="mb-2 text-sm font-semibold text-slate-700">Terrain</p>
          <div className="grid gap-2">
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

        <Link
          href="/results"
          className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          Clear filters
        </Link>
      </section>

      {trips.length === 0 && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-base font-semibold text-slate-900">No trips match your filters</p>
          <p className="mt-1 text-sm text-slate-600">
            Try removing one or more filters to see more trip options.
          </p>
          <Link
            href="/results"
            className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Reset filters
          </Link>
        </div>
      )}

      <section className="space-y-4">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/trip/${trip.id}`}
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{trip.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {trip.location} ({trip.park})
                </p>
              </div>
              <span className="text-sm font-medium text-blue-700 transition group-hover:translate-x-0.5">
                View details →
              </span>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {trip.days} days
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {trip.difficulty}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {trip.terrain}
              </span>
            </div>

            <p className="mb-4 text-sm leading-6 text-slate-700">
              {getShortDescription(trip.description)}
            </p>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                Why this trip
              </p>
              <p className="mt-1 text-sm text-amber-900">{getWhyThisTrip(trip)}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
