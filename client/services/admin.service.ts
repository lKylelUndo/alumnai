import { axiosServerInstance, axiosInstance } from "@/lib/axios"
import { VerifyUserInput } from "@/schema/admin"

export const adminService = {
  getUnverifiedUsers: async () => {
    const response = await axiosServerInstance.get("/api/admin/v1/get-unverified-users")
    return response.data
  },
  
  verifyUser: async (data: VerifyUserInput) => {
    const response = await axiosInstance.post("/api/admin/v1/verify-a-user", data)
    return response.data  
  },

  getTopMentors: async () => {
    const response = await axiosServerInstance.get("/api/admin/v1/get-top-mentors")
    return response.data
  },

  getAlumniRequest: async () => {
    const response = await axiosServerInstance.get("/api/admin/v1/get-alumni-request")
    return response.data
  },

  getAllUsers: async () => {
    const response = await axiosServerInstance.get("/api/admin/v1/get-user-management")
    return response.data
  },

  getSkillTrendAnalytics: async () => {
    const response = await axiosServerInstance.get("/api/admin/v1/get-analytics")
    return response.data
  },
}
