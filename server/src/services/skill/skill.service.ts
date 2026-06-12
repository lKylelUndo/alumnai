import { SkillRepository } from "@/repositories/skill.repository";
import { AddSkillInputTypes } from "@/schema/skill";

export class SkillService {
  private skillRepository = new SkillRepository();

  public add = async (data: AddSkillInputTypes) => {
    try {
        const response = await this.skillRepository.add(data);
        if (!response)
            return { status: "error", code: 400, message: "Unable to add skill" }

        return { status: "success", code: 201, message: "Successfully add skill" }
    } catch (error) {
        console.error("AddSkillService", error);
        return { status: "error", code: 500, message: "Unable to add skill on profile" };
    }
  };

  public remove = async () => {
    try {
        
    } catch (error) {
        console.error("RemoveSkillService", error);
        return { status: "error", code: 500, message: "Unable to remove a skill on profile" };
    }
  };
}
