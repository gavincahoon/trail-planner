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
        elevationGain: 1700,
        difficulty: "Intermediate",
        terrain: "Desert",
        featured: true,
        description:
          "A quieter Zion route with creek camps, cottonwood shade, and a classic out-and-back to Kolob Arch.",
        day1: "Start at Lee Pass and hike to La Verkin Creek camp (about 6 to 7 miles).",
        day2: "Day hike to Kolob Arch and side canyons, then return to camp (about 8 to 10 miles round trip).",
        day3: "Break camp and hike back to Lee Pass trailhead (about 6 to 7 miles).",
        permitRequired: true,
        permitLink: "https://www.nps.gov/zion/planyourvisit/backpacking.htm",
        bestSeason: "Spring and fall",
        trailheadInfo: "Lee Pass Trailhead in the Kolob Canyons district; check current road and weather conditions.",
        parkingInfo: "Overnight parking is available at Lee Pass; display permit details as required by park staff.",
        whyThisTrip:
          "You get iconic Zion canyon scenery with lower crowds than the main canyon and a rewarding arch destination.",
        packingList:
          "- 3L water capacity\n- Sun shirt and sun hat\n- Lightweight shelter\n- Water filter for creek sources\n- Permit confirmation copy",
      },
      {
        name: "Zion West Rim Backpack",
        location: "Utah",
        park: "Zion National Park",
        days: 3,
        elevationGain: 2600,
        difficulty: "Advanced",
        terrain: "Desert",
        featured: true,
        description:
          "A high-plateau-to-canyon route with huge views into Zion Canyon and long descent terrain.",
        day1: "From Lava Point area, hike the upper West Rim and camp in a designated West Rim site.",
        day2: "Continue along the rim with expansive overlooks and camp in a lower West Rim zone.",
        day3: "Descend to The Grotto in Zion Canyon; arrange shuttle logistics in advance.",
        permitRequired: true,
        permitLink: "https://www.nps.gov/zion/planyourvisit/backpacking.htm",
        bestSeason: "Late spring and fall",
        trailheadInfo: "Most hikers start near Lava Point and finish at The Grotto; confirm seasonal road access.",
        parkingInfo: "Use park shuttle and private shuttle services to link start and finish points.",
        whyThisTrip:
          "This is one of Zion’s signature backpack routes, combining high country solitude with dramatic canyon descent.",
        packingList:
          "- 3L to 4L water capacity\n- Trekking poles for long descent\n- Sun and heat protection\n- Layering for cooler rim temperatures\n- Shuttle reservation details",
      },
      {
        name: "Canyonlands Needles Chesler Park Loop",
        location: "Utah",
        park: "Canyonlands National Park (Needles)",
        days: 3,
        elevationGain: 1300,
        difficulty: "Intermediate",
        terrain: "Desert",
        featured: false,
        description:
          "A classic Needles trip through slickrock basins, striped spires, and broad desert views.",
        day1: "Start at Elephant Hill and hike toward Chesler Park backcountry zone (about 6 to 8 miles).",
        day2: "Day loop through Joint Trail and nearby viewpoints with a light pack.",
        day3: "Hike back to Elephant Hill via established loop connectors (about 6 to 8 miles).",
        permitRequired: true,
        permitLink: "https://www.nps.gov/cany/planyourvisit/backcountrypermits.htm",
        bestSeason: "Spring and fall",
        trailheadInfo: "Elephant Hill Trailhead access requires careful driving on park roads; arrive early.",
        parkingInfo: "Overnight parking is available at Elephant Hill trailhead near permit check-in locations.",
        whyThisTrip:
          "You get the best Needles geology in a manageable 3-day plan with flexible day-two exploration.",
        packingList:
          "- 3L water carry capacity\n- Sun hoodie and brimmed hat\n- Grippy footwear for slickrock\n- Detailed map/GPS track\n- Extra electrolytes",
      },
      {
        name: "Capitol Reef Upper Muley Twist Backpack",
        location: "Utah",
        park: "Capitol Reef National Park",
        days: 3,
        elevationGain: 2200,
        difficulty: "Advanced",
        terrain: "Desert",
        featured: false,
        description:
          "A remote desert route through folds, fins, and canyons with big views and sparse water.",
        day1: "Begin near Upper Muley Twist area and establish a legal backcountry camp after routefinding sections.",
        day2: "Explore connecting canyon terrain and high viewpoints, carrying full-day water.",
        day3: "Return to trailhead route with early start to avoid heat.",
        permitRequired: true,
        permitLink: "https://www.nps.gov/care/planyourvisit/backpacking.htm",
        bestSeason: "Spring and fall",
        trailheadInfo: "Trailhead access may require high-clearance roads; verify conditions with the visitor center.",
        parkingInfo: "Park at designated trailhead pullouts and register itinerary with park backcountry desk.",
        whyThisTrip:
          "This trip offers a true remote-desert experience with fewer people and outstanding Waterpocket Fold scenery.",
        packingList:
          "- 4L or more water capacity\n- Sun protection layers\n- Routefinding map/GPS\n- Sturdy footwear for rough terrain\n- Emergency communication device",
      },
      {
        name: "Uinta Red Castle Lakes Loop",
        location: "Utah",
        park: "Uinta Mountains",
        days: 3,
        elevationGain: 1500,
        difficulty: "Intermediate",
        terrain: "Mountains",
        featured: true,
        description:
          "An alpine basin route with lakes, meadows, and high-country camps in the Uintas.",
        day1: "From China Meadows trailhead, hike to lower Red Castle Lake area and camp (about 7 to 9 miles).",
        day2: "Explore upper basin terrain and side lakes with a light day pack.",
        day3: "Return to China Meadows trailhead on the same corridor (about 7 to 9 miles).",
        permitRequired: false,
        permitLink: null,
        bestSeason: "July to September",
        trailheadInfo: "China Meadows trailhead is a common Red Castle access point; afternoon storms are frequent.",
        parkingInfo: "Overnight parking is available at trailhead lots; arrive early on summer weekends.",
        whyThisTrip:
          "You get classic Uinta alpine scenery and strong camp options without committing to a longer expedition.",
        packingList:
          "- Warm layers for cold nights\n- Rain shell for afternoon storms\n- Mosquito protection\n- Water filter\n- Trekking poles",
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
  