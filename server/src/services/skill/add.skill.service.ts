import { SkillRepository } from "@/repositories/skill.repository";
import { AddSkillInputTypes } from "@/schema/skill";

export const AddSkillService = async (data: AddSkillInputTypes) => {
  const skillRepository = new SkillRepository();

  try {
    const response = await skillRepository.add(data);
    if (!response)
      return { status: "error", code: 400, message: "Unable to add skill" };

    return { status: "success", code: 201, message: "Successfully add skill" };
  } catch (error) {
    console.error("AddSkillService", error);
    return { status: "error", code: 500, message: "Unable to add skill on profile" };
  }
};
