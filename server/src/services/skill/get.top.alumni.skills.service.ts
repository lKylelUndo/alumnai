import { SkillRepository } from "@/repositories/skill.repository";

export const GetTopAlumniSkillsService = async (forceRefresh: boolean = false) => {
  const skillRepository = new SkillRepository();

  try {
    const skills = await skillRepository.findTopAlumniSkills(forceRefresh);

    return {
      code: 200,
      status: "success",
      message: "Fetched top alumni skills",
      data: { skills },
    };
  } catch (error) {
    console.error("GetTopAlumniSkillsService", error);
    return { code: 500, status: "error", message: "Unable to fetch top alumni skills" };
  }
};
