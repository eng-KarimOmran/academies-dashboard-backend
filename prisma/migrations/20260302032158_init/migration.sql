/*
  Warnings:

  - You are about to drop the column `referenceNumber` on the `PaymentTransaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PaymentTransaction_referenceNumber_key";

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP COLUMN "referenceNumber";
