/*
  Warnings:

  - You are about to drop the column `isStudentVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isStudentVerified",
ADD COLUMN     "isAccountVerified" BOOLEAN NOT NULL DEFAULT false;
