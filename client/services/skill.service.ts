import { axiosInstance, axiosServerInstance } from "@/lib/axios";
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

  searchSkills: async (query: string) => {
    const response = await axiosInstance.get(`/api/skill/v1/search-skills?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getTopAlumniSkills: async (refresh = false) => {
    const url = refresh ? "/api/skill/v1/get-top-alumni-skills?refresh=true" : "/api/skill/v1/get-top-alumni-skills";
    const response = await axiosServerInstance.get(url);
    return response.data;
  },

  analyzeSkillGap: async (refresh = false) => {
    const url = refresh ? "/api/skill/v1/skill-gap-analysis?refresh=true" : "/api/skill/v1/skill-gap-analysis";
    const response = await axiosInstance.get(url);
    return response.data;
  },

  githubSkillIndex: async (githubURL: string) => {
    const response = await axiosInstance.post("/api/skill/v1/github-skill-index", { githubURL });
    return response.data;
  },
};


