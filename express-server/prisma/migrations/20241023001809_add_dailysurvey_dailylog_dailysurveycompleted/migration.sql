-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailySurveyCompeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DailySurvey" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "mood" TEXT NOT NULL,
    "anxietyReason" TEXT NOT NULL,

    CONSTRAINT "DailySurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);
