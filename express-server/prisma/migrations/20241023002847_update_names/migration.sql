/*
  Warnings:

  - You are about to drop the `DailyLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailySurvey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DailyLog";

-- DropTable
DROP TABLE "DailySurvey";

-- CreateTable
CREATE TABLE "DailySurveys" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "mood" TEXT NOT NULL,
    "anxietyReason" TEXT NOT NULL,

    CONSTRAINT "DailySurveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLogs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "DailyLogs_pkey" PRIMARY KEY ("id")
);
