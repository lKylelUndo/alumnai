import { axiosServerInstance, axiosInstance } from "@/lib/axios"
import { VerifyUserInput } from "@/schema/admin"

export const adminService = {
  getUnverifiedUsers: async () => {
    const response = await axiosServerInstance.get("/api/admin/v1/get-unverified-users")
    return response.data
  },
  
  verifyUser: async (data: VerifyUserInput) => {
    const response = await axiosInstance.post(
      "/api/admin/v1/verify-a-user",
      data
    )
    return response.data  
  },
}
