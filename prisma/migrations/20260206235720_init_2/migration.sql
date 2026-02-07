/*
  Warnings:

  - You are about to drop the column `registeredById` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_registeredById_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "registeredById";

-- AlterTable
ALTER TABLE "Secretary" ALTER COLUMN "baseSalary" DROP DEFAULT,
ALTER COLUMN "bonusPerClient" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "registeredById" TEXT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "Secretary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
