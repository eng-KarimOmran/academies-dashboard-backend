/*
  Warnings:

  - You are about to drop the column `basePrice` on the `Car` table. All the data in the column will be lost.
  - Added the required column `captainLessonPrice` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carSessionPrice` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "basePrice",
ADD COLUMN     "carSessionPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "captainLessonPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "carSessionPrice" DOUBLE PRECISION NOT NULL;
