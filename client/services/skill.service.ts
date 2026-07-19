import axiosInstance from "@/lib/axios";
import { AddSkillInput, RemoveSkillInput } from "@/schema/skill";

export const skillService = {
  addSkill: async (data: AddSkillInput) => {
    console.log("🚀 ~ addSkill ~ data:", data)
    const response = await axiosInstance.post("/api/skill/v1/add-skill", data);
    return response.data;
  },

  removeSkill: async (data: RemoveSkillInput) => {
    const response = await axiosInstance.post("/api/skill/v1/remove-skill", data);
    return response.data;
  },
};
