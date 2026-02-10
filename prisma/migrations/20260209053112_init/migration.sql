/*
  Warnings:

  - You are about to drop the column `currency` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "currency",
ALTER COLUMN "priceDiscounted" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "priceOriginal" SET DATA TYPE DOUBLE PRECISION;

-- DropEnum
DROP TYPE "Currency";
