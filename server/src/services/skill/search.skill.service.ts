import { CanonicalSkillRepository } from "@/repositories/canonical.skill.repository";

export const SearchSkillService = async (query: string) => {
  const canonicalSkillRepository = new CanonicalSkillRepository();

  try {
    if (!query || query.trim().length === 0) {
      return { status: "error", code: 400, message: "Search query is required" };
    }

    const skills = await canonicalSkillRepository.search(query);

    return {
      status: "success",
      code: 200,
      message: "Skills fetched",
      data: { skills: skills.map((s) => ({ id: s.id, name: s.name })) },
    };
  } catch (error) {
    console.error("SearchSkillService", error);
    return { status: "error", code: 500, message: "Unable to search skills" };
  }
};
