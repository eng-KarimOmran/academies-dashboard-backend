-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_registeredById_fkey";

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
