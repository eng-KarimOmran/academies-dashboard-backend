/*
  Warnings:

  - A unique constraint covering the columns `[academyId,name]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Course_academyId_idx" ON "Course"("academyId");

-- CreateIndex
CREATE INDEX "Course_name_idx" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_academyId_name_key" ON "Course"("academyId", "name");
