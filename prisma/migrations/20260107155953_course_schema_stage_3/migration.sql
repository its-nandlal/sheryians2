/*
  Warnings:

  - You are about to drop the column `introVideoFileId` on the `course` table. All the data in the column will be lost.
  - Added the required column `duration` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseDuration" AS ENUM ('ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'NINE_MONTHS', 'ONE_YEAR');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- AlterTable
ALTER TABLE "course" DROP COLUMN "introVideoFileId",
DROP COLUMN "duration",
ADD COLUMN     "duration" "CourseDuration" NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "CourseLevel" NOT NULL;
