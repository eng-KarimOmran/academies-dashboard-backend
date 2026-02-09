/*
  Warnings:

  - You are about to drop the column `lessonDuration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `totalLessons` on the `Course` table. All the data in the column will be lost.
  - Added the required column `description` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practicalSessions` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceDiscounted` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceOriginal` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionDurationMinutes` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSessions` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EGP');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "lessonDuration",
DROP COLUMN "price",
DROP COLUMN "totalLessons",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EGP',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "featuredReason" TEXT,
ADD COLUMN     "practicalSessions" INTEGER NOT NULL,
ADD COLUMN     "priceDiscounted" INTEGER NOT NULL,
ADD COLUMN     "priceOriginal" INTEGER NOT NULL,
ADD COLUMN     "sessionDurationMinutes" INTEGER NOT NULL,
ADD COLUMN     "totalSessions" INTEGER NOT NULL,
ADD COLUMN     "trainingDetails" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
