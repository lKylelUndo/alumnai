/*
  Warnings:

  - Added the required column `isVisible` to the `Certification` table with a default value (no backfill needed: existing rows default to `true`).

*/
-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;
