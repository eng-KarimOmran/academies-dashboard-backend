/*
  Warnings:

  - You are about to drop the column `bonusPerClient` on the `Secretary` table. All the data in the column will be lost.
  - You are about to drop the column `registeredById` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `bonus` to the `Secretary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target` to the `Secretary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_registeredById_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "registeredById" TEXT;

-- AlterTable
ALTER TABLE "Secretary" DROP COLUMN "bonusPerClient",
ADD COLUMN     "bonus" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "target" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "registeredById";

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "Secretary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
