/*
  Warnings:

  - A unique constraint covering the columns `[academyId,id]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Course_academyId_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Course_academyId_id_key" ON "Course"("academyId", "id");
