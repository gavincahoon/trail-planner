import Image from "next/image";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Plan Your Next Backpacking Trip
      </h1>

      <a href="/results" className="mt-6 inline-block bg-black text-white px-4 py-2">
        Find My Trip
      </a>
    </main>
  )
}
