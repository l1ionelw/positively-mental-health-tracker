/*
  Warnings:

  - You are about to drop the column `logCompletedTime` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "logCompletedTime",
ADD COLUMN     "lastlogCompletedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
