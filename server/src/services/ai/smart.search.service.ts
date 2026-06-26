import { extractTechnicalSkills, recommendStudent } from "@/lib/gemini";
import { ProfileRepository } from "@/repositories/profile.repository";
import { formatCandidates } from "@/utils/format.recommended.candidates";

export const SmartSearchService = async (rawSearch: string) => {
  const profileRepository = new ProfileRepository();

  try {
    // Extract skills
    const extractedSkills = await extractTechnicalSkills(rawSearch);

    // Get matching candidates
    const students = await profileRepository.matchSkill(extractedSkills);

    // Ranked candidates
    const formattedCandidates = formatCandidates(students, extractedSkills);
    
    const recommendedStudents = await recommendStudent(rawSearch, extractedSkills, formattedCandidates)

    return { status: "success", code: 200, recommendedStudents };
  } catch (error) {
    console.error("smartSearch", error);
    return { status: "error", code: 500, message: "Unable to search" };
  }
};
