/*
  Warnings:

  - Added the required column `isVisible` to the `Recognition` table with a default value (no backfill needed: existing rows default to `true`).
  - A unique constraint covering the columns `[fromStudentId,toAlumniId]` on the table `Recognition` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Recognition" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- Deduplicate before the unique index is created.
-- RecognitionRepository.upsert() is a racy find-then-create/update, so duplicate
-- (fromStudentId, toAlumniId) rows may already exist. A plain CREATE UNIQUE INDEX
-- would fail on them and abort this migration, so remove all but the most recently
-- updated row per (fromStudentId, toAlumniId) pair first.
DELETE FROM "Recognition"
WHERE "id" IN (
  SELECT "id"
  FROM (
    SELECT
      "id",
      ROW_NUMBER() OVER (
        PARTITION BY "fromStudentId", "toAlumniId"
        ORDER BY "updatedAt" DESC, "createdAt" DESC
      ) AS "row_num"
    FROM "Recognition"
  ) AS "ranked_recognitions"
  WHERE "ranked_recognitions"."row_num" > 1
);

-- CreateIndex
CREATE UNIQUE INDEX "Recognition_fromStudentId_toAlumniId_key" ON "Recognition"("fromStudentId", "toAlumniId");
