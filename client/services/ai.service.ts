import { axiosInstance } from "@/lib/axios";

export const aiService = {
  smartSearch: async (searchQuery: string) => {
    const response = await axiosInstance.post("/api/ai/v1/find-collaborators", { searchQuery });
    return response.data;
  },
};
