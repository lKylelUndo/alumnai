-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "isAvailableForMentorship" DROP NOT NULL;
ALTER TABLE "Profile" ALTER COLUMN "isAvailableForMentorship" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "isAvailableForCollaboration" DROP NOT NULL;
ALTER TABLE "Profile" ALTER COLUMN "isAvailableForCollaboration" DROP DEFAULT;

-- Backfill: previous `true` values were written by the old default, never explicitly chosen
UPDATE "Profile" SET "isAvailableForMentorship" = NULL;
UPDATE "Profile" SET "isAvailableForCollaboration" = NULL;
