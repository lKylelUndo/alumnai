import { extractTechnicalSkills, recommendStudent } from "@/lib/gemini";
import { ProfileRepository } from "@/repositories/profile.repository";
import { CanonicalSkillRepository } from "@/repositories/canonical.skill.repository";
import { normalizeSkillName } from "@/utils/normalize.skill";
import { formatCandidates } from "@/utils/format.recommended.candidates";

export const SmartSearchService = async (rawSearch: string) => {
  const profileRepository = new ProfileRepository();
  const canonicalSkillRepository = new CanonicalSkillRepository();

  try {
    // Extract skills
    const rawExtractedSkills = await extractTechnicalSkills(rawSearch);

    // Canonicalize each extracted skill
    const canonicalSkillsPromises = rawExtractedSkills.map(async (rawSkill) => {
      const normalized = normalizeSkillName(rawSkill);
      if (!normalized) return rawSkill;
      const canonical = await canonicalSkillRepository.findByNormalizedName(normalized);
      return canonical ? canonical.name : rawSkill;
    });

    const extractedSkills = Array.from(new Set(await Promise.all(canonicalSkillsPromises)));
    console.log("🚀 ~ SmartSearchService ~ canonical extractedSkills:", extractedSkills);

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
