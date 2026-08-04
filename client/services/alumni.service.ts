import { axiosInstance } from "@/lib/axios";

export const alumniService = {
  requestAlumniUpgrade: async (documentUrl: string) => {
    const response = await axiosInstance.post("/api/alumni/v1/request-alumni-upgrade", { documentUrl });
    return response.data;
  },
};

