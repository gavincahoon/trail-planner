import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

// Strip sslmode from URI so `pg` uses `ssl` below (avoids verify-full + self-signed chain issues with Supabase).
const connectionString = process.env.DATABASE_URL?.split("?")[0] ?? "";
const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.trip.create({
    data: {
      name: "Zion Kolob Canyons Backpack",
      location: "Utah",
      park: "Zion National Park",
      days: 3,
      difficulty: "Moderate",
      terrain: "Desert",
      description: "Quiet canyon backpack with access to Kolob Arch.",
      day1: "Hike from Lee Pass to La Verkin Creek (~6 miles).",
      day2: "Day hike to Kolob Arch and explore Beartrap Canyon.",
      day3: "Hike back to Lee Pass.",
      permitRequired: true,
      permitLink: "https://www.recreation.gov",
      bestSeason: "Spring and fall",
      trailheadInfo: "Start at Lee Pass Trailhead off Kolob Canyons Road.",
      parkingInfo: "Overnight parking is available at Lee Pass with permit display.",
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
  