/*
  Warnings:

  - You are about to drop the column `plateLetters` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumbers` on the `Car` table. All the data in the column will be lost.
  - Added the required column `modelName` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "plateLetters",
DROP COLUMN "plateNumbers",
ADD COLUMN     "modelName" TEXT NOT NULL;
