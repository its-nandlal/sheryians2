/*
  Warnings:

  - You are about to drop the column `keywords` on the `course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course" DROP COLUMN "keywords",
ADD COLUMN     "metaKeywords" TEXT[];
