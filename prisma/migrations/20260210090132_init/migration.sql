/*
  Warnings:

  - You are about to drop the column `lessonDuration` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `remainingLessons` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `totalLessons` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `totalPaid` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `sessionDurationMinutes` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSessions` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "lessonDuration",
DROP COLUMN "remainingLessons",
DROP COLUMN "totalLessons",
DROP COLUMN "totalPaid",
ADD COLUMN     "sessionDurationMinutes" INTEGER NOT NULL,
ADD COLUMN     "totalSessions" INTEGER NOT NULL;
