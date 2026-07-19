/*
  Warnings:

  - The `level` column on the `Skill` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "level",
ADD COLUMN     "level" DOUBLE PRECISION;
