import { generateSkillGapAnalysis } from "@/lib/gemini";
import { SkillRepository } from "@/repositories/skill.repository";

export const AnalyzeSkillGapService = async (
  userId: string,
  forceRefresh: boolean = false
) => {
  const skillRepository = new SkillRepository();

  try {
    // 1. Try cache first unless forceRefresh is true (handled inside repository)
    if (!forceRefresh) {
      const cached = await skillRepository.getCachedSkillGap(userId);
      if (cached) {
        return {
          code: 200,
          status: "success",
          message: "Skill gap analysis retrieved from cache",
          data: cached,
        };
      }
    }

    // 2. Retrieve student profile and skills via repository
    const studentProfile = await skillRepository.findStudentProfileWithSkills(userId);

    if (!studentProfile) {
      return {
        code: 404,
        status: "error",
        message: "Student profile not found",
      };
    }

    const studentSkillNames = studentProfile.skills.map((s) => s.name);
    const workField = studentProfile.work_field || studentProfile.current_position || "Web Development";

    // 3. Retrieve alumni skills for similar career path/work_field via repository
    const alumniSkills = await skillRepository.findAlumniSkillsByWorkField(workField);

    // 4. Use Gemini to compare and generate recommendations
    const analysisResult = await generateSkillGapAnalysis(
      studentSkillNames,
      alumniSkills,
      workField
    );

    // 5. Cache result via repository
    await skillRepository.setCachedSkillGap(userId, analysisResult);

    return {
      code: 200,
      status: "success",
      message: "Successfully generated skill gap analysis",
      data: analysisResult,
    };
  } catch (error) {
    console.error("AnalyzeSkillGapService error:", error);
    return {
      code: 500,
      status: "error",
      message: "Unable to analyze skill gap",
    };
  }
};
