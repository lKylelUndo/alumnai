-- CreateIndex
CREATE INDEX "Certification_profileId_idx" ON "Certification"("profileId");

-- CreateIndex
CREATE INDEX "Collaboration_fromAlumniId_idx" ON "Collaboration"("fromAlumniId");

-- CreateIndex
CREATE INDEX "Collaboration_toStudentId_idx" ON "Collaboration"("toStudentId");

-- CreateIndex
CREATE INDEX "Mentorship_fromStudentId_idx" ON "Mentorship"("fromStudentId");

-- CreateIndex
CREATE INDEX "Mentorship_toAlumniId_idx" ON "Mentorship"("toAlumniId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Recognition_fromStudentId_idx" ON "Recognition"("fromStudentId");

-- CreateIndex
CREATE INDEX "Recognition_toAlumniId_idx" ON "Recognition"("toAlumniId");

-- CreateIndex
CREATE INDEX "Skill_profileId_idx" ON "Skill"("profileId");

-- CreateIndex
CREATE INDEX "Token_userId_idx" ON "Token"("userId");
