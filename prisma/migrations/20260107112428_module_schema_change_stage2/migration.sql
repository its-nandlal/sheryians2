/*
  Warnings:

  - You are about to drop the column `assignmentId` on the `module` table. All the data in the column will be lost.
  - You are about to drop the column `quizUrl` on the `module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "module" DROP COLUMN "assignmentId",
DROP COLUMN "quizUrl";
