/*
  Warnings:

  - You are about to drop the column `date` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Lesson_captainId_date_idx";

-- DropIndex
DROP INDEX "Lesson_carId_date_idx";

-- DropIndex
DROP INDEX "Lesson_date_idx";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "date",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Lesson_startTime_idx" ON "Lesson"("startTime");

-- CreateIndex
CREATE INDEX "Lesson_captainId_startTime_idx" ON "Lesson"("captainId", "startTime");

-- CreateIndex
CREATE INDEX "Lesson_carId_startTime_idx" ON "Lesson"("carId", "startTime");
