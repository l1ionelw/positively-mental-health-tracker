/*
  Warnings:

  - You are about to drop the column `dailySurveyCompeleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dailySurveyCompeleted",
ADD COLUMN     "surveyCompletedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
