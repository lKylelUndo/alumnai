import { axiosInstance, axiosServerInstance } from "@/lib/axios";
import { ViewProfileInput, UpdateProfileInput } from "@/schema/profile";

export const profileService = {
  viewProfile: async (data: ViewProfileInput) => {
    const instance = typeof window !== "undefined" ? axiosInstance : axiosServerInstance;
    const response = await instance.post("/api/profile/v1/view-single-profile", { id: data.id });
    return response.data;
  },

  updateProfile: async (data: UpdateProfileInput) => {
    const response = await axiosInstance.post("/api/profile/v1/update-profile", data);
    return response.data;
  },

  setCertificationVisibility: async (certificationId: string, isVisible: boolean) => {
    const response = await axiosInstance.patch(
      `/api/profile/v1/certifications/${certificationId}/visibility`,
      { isVisible }
    );
    return response.data;
  },

  deleteCertification: async (certificationId: string) => {
    const response = await axiosInstance.delete(
      `/api/profile/v1/certifications/${certificationId}`
    );
    return response.data;
  },
};
