/*
  Warnings:

  - Added the required column `days` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseDays" AS ENUM ('MON_FRI', 'MON_SAT', 'WEEKENDS');

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "days" "CourseDays" NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
