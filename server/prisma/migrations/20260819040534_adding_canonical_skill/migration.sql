-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "canonicalSkillId" TEXT;

-- CreateTable
CREATE TABLE "CanonicalSkill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanonicalSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CanonicalSkill_name_key" ON "CanonicalSkill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CanonicalSkill_normalizedName_key" ON "CanonicalSkill"("normalizedName");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_canonicalSkillId_fkey" FOREIGN KEY ("canonicalSkillId") REFERENCES "CanonicalSkill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
