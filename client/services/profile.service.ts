import { axiosInstance, axiosServerInstance } from "@/lib/axios";
import { ViewProfileInput, UpdateProfileInput } from "@/schema/profile";

export const profileService = {
  viewProfile: async (data: ViewProfileInput) => {
    const response = await axiosServerInstance.post("/api/profile/v1/view-single-profile", { id: data.id });
    return response.data;
  },

  getAllProfiles: async () => {
    const response = await axiosInstance.get("/api/profile/v1/all-profiles");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileInput) => {
    const response = await axiosInstance.post("/api/profile/v1/update-profile", data);
    return response.data;
  },
};
