/*
  Warnings:

  - The `status` column on the `PaymentTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `Academy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `Captain` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `Car` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `Secretary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "status" "SubscriptionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionCancellation" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Academy_id_deletedAt_key" ON "Academy"("id", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Area_id_deletedAt_key" ON "Area"("id", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Captain_id_deletedAt_key" ON "Captain"("id", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Car_id_deletedAt_key" ON "Car"("id", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_deletedAt_key" ON "Client"("id", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Course_id_deletedAt_key" ON "Course"("id", "deletedAt");

-- CreateIndex
CREATE INDEX "PaymentTransaction_status_idx" ON "PaymentTransaction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Secretary_id_deletedAt_key" ON "Secretary"("id", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_deletedAt_key" ON "User"("id", "deletedAt");
