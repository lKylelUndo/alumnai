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

    // Ranked formatted candidates
    const formattedCandidates = formatCandidates(students, extractedSkills);

    const recommendedStudents = await recommendStudent(rawSearch,extractedSkills,formattedCandidates);

    const candidateById = new Map(
      formattedCandidates.map((candidate) => [candidate.id, candidate]),
    );

    const recommendedStudentsWithProfile = recommendedStudents.map(
      (item: any) => ({
        ...candidateById.get(item.id),
        ...item,
        skills: candidateById.get(item.id)?.skills ?? [],
        bio: candidateById.get(item.id)?.bio ?? "",
        name: candidateById.get(item.id)?.name ?? "",
      }),
    );

    return {
      status: "success",
      code: 200,
      recommendedStudents: recommendedStudentsWithProfile,
    };
  } catch (error) {
    console.error("smartSearch", error);
    return { status: "error", code: 500, message: "Unable to search" };
  }
};
