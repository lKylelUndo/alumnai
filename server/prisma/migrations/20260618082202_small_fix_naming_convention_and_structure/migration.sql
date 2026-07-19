/*
  Warnings:

  - You are about to drop the `Recogntion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_collaborationId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_mentorshipId_fkey";

-- DropForeignKey
ALTER TABLE "Recogntion" DROP CONSTRAINT "Recogntion_fromStudentId_fkey";

-- DropForeignKey
ALTER TABLE "Recogntion" DROP CONSTRAINT "Recogntion_toAlumniId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "mentorshipId" DROP NOT NULL,
ALTER COLUMN "collaborationId" DROP NOT NULL;

-- DropTable
DROP TABLE "Recogntion";

-- CreateTable
CREATE TABLE "Recognition" (
    "id" TEXT NOT NULL,
    "fromStudentId" TEXT NOT NULL,
    "toAlumniId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recognition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recognition" ADD CONSTRAINT "Recognition_fromStudentId_fkey" FOREIGN KEY ("fromStudentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recognition" ADD CONSTRAINT "Recognition_toAlumniId_fkey" FOREIGN KEY ("toAlumniId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_mentorshipId_fkey" FOREIGN KEY ("mentorshipId") REFERENCES "Mentorship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_collaborationId_fkey" FOREIGN KEY ("collaborationId") REFERENCES "Collaboration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
