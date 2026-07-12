/*
  Warnings:

  - You are about to drop the column `socialLinks` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "socialLinks",
ADD COLUMN     "graduatedYear" TEXT,
ADD COLUMN     "socialLink" TEXT;
