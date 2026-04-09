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
  const existingTrips = await prisma.trip.count();
  if (existingTrips > 0) {
    console.log("Seed skipped: Trip table already has data.");
    return;
  }

  await prisma.trip.createMany({
    data: [
      {
        name: "Zion Kolob Canyons Backpack",
        location: "Utah",
        park: "Zion National Park",
        days: 3,
        difficulty: "Intermediate",
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
        whyThisTrip: "A scenic desert route with manageable mileage and a strong payoff at Kolob Arch.",
        packingList:
          "- 3L water carry capacity\n- Sun hoodie and wide-brim hat\n- Lightweight shelter\n- Desert traction-friendly shoes\n- Permit confirmation",
      },
      {
        name: "Glacier Basin Loop",
        location: "Colorado",
        park: "Rocky Mountain National Park",
        days: 4,
        difficulty: "Intermediate",
        terrain: "Mountains",
        description: "Alpine lakes and high passes with classic Rockies scenery.",
        day1: "Start at Bear Lake and camp near Glacier Gorge.",
        day2: "Cross to alpine basins and explore side valleys.",
        day3: "Traverse high-country passes and descend to treeline.",
        day4: "Complete the loop back to Bear Lake.",
        permitRequired: true,
        permitLink: "https://www.nps.gov/romo/planyourvisit/wild_guide.htm",
        bestSeason: "July to September",
        trailheadInfo: "Bear Lake Trailhead with shuttle access in peak season.",
        parkingInfo: "Park at Park & Ride and take shuttle when lots are full.",
        whyThisTrip: "A classic alpine loop with big views, varied terrain, and rewarding high-country camps.",
        packingList:
          "- Insulation layer for cold mornings\n- Afternoon storm shell\n- Trekking poles for steep sections\n- Water filter\n- Map and downloaded offline route",
      },
      {
        name: "Boundary Waters Lakes Traverse",
        location: "Minnesota",
        park: "Boundary Waters Canoe Area Wilderness",
        days: 3,
        difficulty: "Beginner",
        terrain: "Lakes",
        description: "A mellow water-linked route with quiet camps and easy navigation.",
        day1: "Enter via designated access point and paddle to first campsite.",
        day2: "Travel through connected lakes and short portages.",
        day3: "Return to entry point with optional shoreline hike.",
        permitRequired: false,
        permitLink: null,
        bestSeason: "Late spring to early fall",
        trailheadInfo: "Entry points vary by permit zone; check your assigned launch.",
        parkingInfo: "Permit stations list nearby overnight parking options.",
        whyThisTrip: "A beginner-friendly lakes route that keeps navigation simple while delivering quiet campsites.",
        packingList:
          "- Dry bags for all gear\n- Bug protection\n- Lightweight rain gear\n- Camp shoes\n- Basic repair kit",
      },
    ],
  });
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
  