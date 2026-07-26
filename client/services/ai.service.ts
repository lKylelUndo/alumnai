import { axiosInstance } from "@/lib/axios";
import { SmartSearchInput } from "@/schema/ai";

export const aiService = {
  smartSearch: async (data: SmartSearchInput) => {
    const response = await axiosInstance.post("/api/ai/v1/search-students", data);
    return response.data;
  },
};
