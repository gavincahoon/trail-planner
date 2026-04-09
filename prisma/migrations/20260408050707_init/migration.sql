-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "park" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "terrain" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "day1" TEXT NOT NULL,
    "day2" TEXT NOT NULL,
    "day3" TEXT NOT NULL,
    "day4" TEXT,
    "permitRequired" BOOLEAN NOT NULL,
    "permitLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);
