/*
  Warnings:

  - You are about to drop the column `appliedAt` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetterReference` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetterSourceType` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `jobLocation` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "appliedAt",
DROP COLUMN "coverLetterReference",
DROP COLUMN "coverLetterSourceType",
DROP COLUMN "deadline",
DROP COLUMN "jobLocation",
ADD COLUMN     "resumePdfPath" TEXT;
