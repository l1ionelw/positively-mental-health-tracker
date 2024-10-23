/*
  Warnings:

  - Changed the type of `ownerId` on the `DailyLogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ownerId` on the `DailySurveys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DailyLogs" DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DailySurveys" DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;
