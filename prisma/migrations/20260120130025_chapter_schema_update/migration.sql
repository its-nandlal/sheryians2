/*
  Warnings:

  - You are about to drop the column `isFree` on the `chapter` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chapter" DROP COLUMN "isFree",
DROP COLUMN "order";
